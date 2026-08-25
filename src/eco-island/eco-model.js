/* ============================================================
   eco-island · KidsLab 生态模型
   纯逻辑、无 DOM：决定型离散时间步仿真，方便单测与 E2E。
   —— 物种角色 ——
   生产者(草)     : 由养分 + 底数再生
   消费者(兔)     : 吃草，限草可用量；供养
   消费者(狐)     : 吃兔，限兔可用量
   分解者(蘑菇/蚯蚓): 把尸体分解成养分，养分回哺草
   无分解者       : 尸体堆积、养分被锁死 → 草衰退
   ============================================================ */
'use strict';

/* 观测量：用于稳定判定的关键种群 */
const METRIC_KEYS = ['grass', 'rabbit', 'fox', 'mushroom', 'worm', 'carcasses', 'nutrients'];

/* 默认物种可用性（玩家可投放） */
const SPECIES = {
  grass: { icon: '🌱', role: 'producer' },
  rabbit: { icon: '🐇', role: 'consumer' },
  fox: { icon: '🦊', role: 'consumer' },
  mushroom: { icon: '🍄', role: 'decomposer' },
  worm: { icon: '🪱', role: 'decomposer' },
};

const DEFAULT_PARAMS = {
  /* 草 */
  grassCap: 300,         // 草量上限（岛屿承载）
  grassRegrow: 0.35,     // 草向承载力靠拢的速率
  grassEatPerRabbit: 1.2,// 每只兔每帧消耗的草
  /* 兔 */
  rabbitRate: 0.12,      // 兔向目标靠拢的速率（快 → 成灾吓人）
  rabbitBareCap: 120,    // 无天敌时兔的目标上线（泛滥）
  rabbitFoxCap: 38,       // 有天敌时兔的目标被压制的上限
  rabbitDeathsToCarcass: 0.6, // 兔每帧自然死亡中变成尸体的比例
  /* 狐 */
  foxRate: 0.1,          // 狐向目标靠拢的速率
  foxPerRabbits: 0.12,   // 狐目标 ≈ 兔 × 该系数（赶得上兔的繁殖）
  foxMin: 2,             // 有兔时狐至少保留的数量
  foxMax: 12,            // 狐的目标上限
  foxDeathsToCarcass: 0.7,
  /* 分解 */
  nutrientBase: 34,      // 无分解者时的低养分（土壤自转，但很慢）
  nutrientFertile: 120,  // 有分解者时的丰饶养分
  nutrientRate: 0.06,
  decomposePct: 0.16,    // 有分解者时尸体每帧分解比例
  decomposeBase: 0.01,   // 无分解者时极慢分解
  nutrientK: 0.02,       // 养分 → 草 的增益系数
};

function round(x) {
  return Math.max(0, Math.round(x));
}

/**
 * 一步仿真。state 数值以浮点内部计，读取用 round()。
 * 返回新 state（原地修改并返回，便于链式）。
 */
function step(state, params = DEFAULT_PARAMS) {
  const p = Object.assign({}, DEFAULT_PARAMS, params);

  const grassPresent = state.grass > 0;
  const rabbitPresent = state.rabbit > 0;
  const foxPresent = state.fox > 0;
  const decomposerPresent = state.mushroom >= 1 || state.worm >= 1;

  /* ---- 养分 ----
     有分解者 → 丰饶（尸体被回转补土）；无分解者 → 只靠贫瘠自转。 */
  const nutrientTarget = decomposerPresent && state.carcasses > 0
    ? p.nutrientFertile
    : p.nutrientBase;
  let nutrients = state.nutrients + (nutrientTarget - state.nutrients) * p.nutrientRate;

  /* ---- 草 ----
     草向承载力靠拢，养分额外添一把劲；兔吃草。 */
  let grassGrowCap = grassPresent ? p.grassCap : 0;
  let grass = state.grass + Math.max(0, grassGrowCap - state.grass) * p.grassRegrow
    + (grassPresent ? nutrients * p.nutrientK * (1 - state.grass / p.grassCap) : 0);
  const grassEaten = Math.min(Math.max(0, grass), state.rabbit * p.grassEatPerRabbit);
  grass -= grassEaten;

  /* ---- 兔 ----
     目标：先被「草够不够」约束；再被「有狐就压低，没狐就泛滥」调整。
     无草 → 目标归零（断粮饿死）。 */
  let rabbitTarget;
  if (!grassPresent || grass < 2) {
    rabbitTarget = 0;
  } else {
    const foodCap = Math.min(p.rabbitBareCap, grass / 2.5);
    rabbitTarget = foxPresent ? Math.min(foodCap, p.rabbitFoxCap) : foodCap;
  }
  let rabbit = state.rabbit + (rabbitTarget - state.rabbit) * p.rabbitRate;
  if (rabbit < 0) rabbit = 0;

  /* ---- 狐 ----
     狐的数量跟随兔：兔在，狐就有目标；兔没了狐也散场。 */
  const foxTarget = foxPresent && rabbitPresent
    ? Math.max(p.foxMin, Math.min(p.foxMax, rabbit * p.foxPerRabbits))
    : 0;
  let fox = state.fox + (foxTarget - state.fox) * p.foxRate;
  if (fox < 0) fox = 0;

  /* ---- 尸体 ----
     繁殖也会带来自然死亡与捕食；缺分解者时尸体堆着不回转。 */
  const rabbitDeaths = rabbitPresent ? state.rabbit * 0.045 : 0;
  const foxDeaths = foxPresent ? state.fox * 0.05 : 0;
  const decomposeRate = decomposerPresent ? p.decomposePct : p.decomposeBase;
  const carcassDecayed = state.carcasses * decomposeRate;
  const carcasses = Math.max(0,
    state.carcasses - carcassDecayed
    + rabbitDeaths * p.rabbitDeathsToCarcass
    + foxDeaths * p.foxDeathsToCarcass);

  nutrients += carcassDecayed * 0.9;
  if (nutrients < 0) nutrients = 0;

  /* 写回 —— 给已存在的物种一个极小避难种群，让「崩了还能复苏」可见 */
  state.grass = Math.max(0, grass);
  state.rabbit = Math.max(0, rabbit);
  state.fox = Math.max(0, fox);
  state.carcasses = Math.max(0, carcasses);
  state.nutrients = nutrients;
  state.tick = (state.tick || 0) + 1;
  return state;
}

function clamp(n) {
  return Math.max(0, n);
}

/* 创建空岛状态 */
function emptyState() {
  return {
    grass: 0, rabbit: 0, fox: 0, mushroom: 0, worm: 0,
    carcasses: 0, nutrients: 60, tick: 0,
  };
}

/* 把内部浮点值圆整为可展示的整数 */
function snapshot(state) {
  const out = {};
  for (const key of METRIC_KEYS) out[key] = round(state[key]);
  return out;
}

/* 判断计数是否落在目标区间内 */
function inBand(value, band) {
  if (!band) return true;
  const lo = band[0] ?? -Infinity;
  const hi = band[1] ?? Infinity;
  return value >= lo && value <= hi;
}

/* —— 任务（关卡）定义 ——
   每关给一个起点，玩家投放缺失的物种，让各项落在目标区间「足够久」即通关。
   available:   本关允许玩家投放的种类
   goal:        各观测量须落在的区间（低界=数量高，高界=数量低）
   判据设计：仅当「正确补上缺失环节」时的稳定终态落在区间内；缺环节则落在区间外，
   以此强制孩子亲手补上的那一环，正是让整座岛复苏的关键。
 */
const MISSIONS = [
  {
    id: 'producer',
    titleKey: 'm1Title',
    descKey: 'm1Desc',
    kickerKey: 'm1Kicker',
    available: ['grass', 'rabbit'],
    start: { grass: 0, rabbit: 4, fox: 0, mushroom: 0, worm: 0, carcasses: 0, nutrients: 60 },
    goal: {
      grass: [100, Infinity],
      rabbit: [8, Infinity],
    },
    needed: 50,
    hints: ['m1Hint1', 'm1Hint2'],
  },
  {
    id: 'decomposer',
    titleKey: 'm2Title',
    descKey: 'm2Desc',
    kickerKey: 'm2Kicker',
    available: ['mushroom', 'worm'],
    start: { grass: 120, rabbit: 20, fox: 5, mushroom: 0, worm: 0, carcasses: 90, nutrients: 40 },
    goal: {
      carcasses: [0, 30],
      grass: [80, Infinity],
      rabbit: [8, 60],
    },
    needed: 50,
    hints: ['m2Hint1', 'm2Hint2'],
  },
  {
    id: 'balance',
    titleKey: 'm3Title',
    descKey: 'm3Desc',
    kickerKey: 'm3Kicker',
    available: ['fox'],
    start: { grass: 150, rabbit: 70, fox: 0, mushroom: 4, worm: 4, carcasses: 8, nutrients: 60 },
    goal: {
      grass: [100, Infinity],
      rabbit: [8, 44],
      carcasses: [0, 30],
    },
    needed: 50,
    hints: ['m3Hint1', 'm3Hint2'],
  },
  {
    id: 'web',
    titleKey: 'm4Title',
    descKey: 'm4Desc',
    kickerKey: 'm4Kicker',
    available: ['grass', 'rabbit', 'fox', 'mushroom', 'worm'],
    start: { grass: 0, rabbit: 0, fox: 0, mushroom: 0, worm: 0, carcasses: 0, nutrients: 60 },
    goal: {
      grass: [120, Infinity],
      rabbit: [8, 44],
      fox: [2, Infinity],
      carcasses: [0, 30],
    },
    needed: 60,
    hints: ['m4Hint1', 'm4Hint2'],
  },
];

/* 任务起点初始状态 */
function missionStart(m) {
  const s = emptyState();
  s.grass = m.start.grass || 0;
  s.rabbit = m.start.rabbit || 0;
  s.fox = m.start.fox || 0;
  s.mushroom = m.start.mushroom || 0;
  s.worm = m.start.worm || 0;
  s.carcasses = m.start.carcasses || 0;
  s.nutrients = m.start.nutrients ?? 60;
  return s;
}

/* 计算稳定帧数：所有目标区间达标则 +1，否则清零；达到 needed 帧通关 */
function progress(state, m, opts = {}) {
  const needed = opts.needed ?? m.needed ?? 50;
  const goal = m.goal || {};
  let ok = true;
  for (const key of Object.keys(goal)) {
    const band = goal[key];
    if (!inBand(state[key], band)) { ok = false; break; }
  }
  const stable = ok ? (state._stable || 0) + 1 : 0;
  state._stable = stable;
  return {
    ok,
    stable,
    needed,
    done: stable >= needed,
    pct: Math.min(100, Math.round((stable / needed) * 100)),
  };
}

const MISSION_MODEL = {
  emptyState,
  snapshot,
  step,
  progress,
  inBand,
  SPECIES,
  METRIC_KEYS,
  MISSIONS,
  missionStart,
  DEFAULT_PARAMS,
};

export {
  emptyState, snapshot, step, progress, inBand,
  SPECIES, METRIC_KEYS, MISSIONS, missionStart, DEFAULT_PARAMS,
};
export default MISSION_MODEL;