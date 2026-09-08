import { CORRECT_WIRING, deriveExperiment, measureCircuit, recordObservation, restoreObservations } from './ohms-model.js';
import { createLabAudio } from './audio.js';
const SAVE_KEY='kidslab.ohms-law-lab';
const $=id=>document.getElementById(id);
const I18N={
  zh:{faultExamples:'错误接线演示（会中断正常测量）',faultHelp:'用于比较接错后的现象。调参观测请使用上方正常接线。',repair:'恢复正常电路',restoredSafe:'已恢复正确接线；参数和历史记录已保留。',measuredU:'实测电压 U',measuredI:'实测电流 I',selectedR:'电阻设定 R',supply:'电源设定',theoryI:'理论电流',theoryCondition:'假设正确接线、保护未断开',historyTitle:'实验记录 / 历史记录',historyNote:'仅保存主动记录的有效测量，切换参数或接线不会修改历史。',explanation:'实验说明',liveStatus:'● 正常接线 · 实测有效',faultStatus:'⚠ 保护断开 · 实测无效',openStatus:'◌ 近似断路 · 电流几乎为零',back:'返回平台',title:'欧姆定律实验室',benchNav:'实验台',notebookNav:'数据册',missionNav:'观测指南',benchEyebrow:'自由调参 · 实时观测',benchTitle:'让变化看得见',sceneBadge:'可交互 · 3D 实验桌',zoomIn:'放大',zoomOut:'缩小',perspective:'立体',topView:'俯视',fallback:'3D 暂不可用，可继续调参观测读数。',sceneHelp:'拖动旋转 · 滚轮 / 双指缩放 · 光点：正极 → 负极',wiringLabel:'电表接线',wireRight:'正常实验 · A 串联 / V 并联',wireShort:'错误示例：A 并联 → 近似短路',wireOpen:'错误示例：V 串联 → 近似断路',voltageLabel:'电源电压 U',resistanceLabel:'电阻 R',ammeterRange:'电流表量程',voltmeterRange:'电压表量程',record:'记下这一组读数',notebookEyebrow:'边调边看',notebookTitle:'U-I 观测图',trial:'记录',legend:'虚线：当前 R · 空心点：记录 · 实心点：实时',dataNote:'随时记录参数组合进行对比，最多保留最近 100 组。',observe:'自由观测',observeTitle:'思考问题',panelTitle:'观测台',reset:'清空记录',guideVoltage:'固定电阻，慢慢提高电压：电流如何变化？',guideResistance:'固定电压，增大电阻：电流又如何变化？',guideRecord:'随时记录感兴趣的读数，对比图上的点。虚线是当前电阻的理论图线，实心点是实时工作点。',safety:'理想电表与电阻；超量程自动断电保护。光点非真实电荷速度。真实实验请由教师指导。',ready:'直接拖动滑杆开始观测，无需答题。',recorded:'已记录，可继续调参对比。',cleared:'记录已清空，当前参数保留。',theory:'理论计算',protected:'保护状态：实际读数不可用',live:'实时读数',sound:'切换声音',theme:'切换主题',fault:{'short-circuit':'A 并联形成近似短路，保护断电。请改为串联。','open-circuit':'V 串联：电压表内阻很大，电流几乎为零；这是近似断路，不是短路。回到正常接线即可继续观测。','voltmeter-overload':'电压表超量程，保护断电；请选择 15 V 量程。','ammeter-overload':'电流表超量程，保护断电；请选择 3 A 量程。','already-recorded':'这组参数已记录，试试另一组。','invalid-setup':'参数超出实验范围。','invalid-wiring':'请选择接线方式。'}},
  en:{faultExamples:'Wiring mistakes (interrupts measurement)',faultHelp:'Compare wiring faults here. Use the normal circuit above to explore U and R.',repair:'Restore working circuit',restoredSafe:'Correct wiring restored; settings and history preserved.',measuredU:'Measured voltage U',measuredI:'Measured current I',selectedR:'Resistance setting R',supply:'Supply setting',theoryI:'Theoretical current',theoryCondition:'Assuming correct wiring and closed protection',historyTitle:'Experiment records / History',historyNote:'Only explicitly saved valid measurements. Settings and wiring changes preserve history.',explanation:'About this experiment',liveStatus:'● Connected · Valid measurements',faultStatus:'⚠ Protection open · Invalid measurements',openStatus:'⚠ Open circuit · Invalid measurements',back:'Back to platform',title:"Ohm’s Law Lab",benchNav:'Bench',notebookNav:'Data',missionNav:'Observe',benchEyebrow:'Explore · Live readings',benchTitle:'Make change visible',sceneBadge:'Interactive · 3D bench',zoomIn:'Zoom +',zoomOut:'Zoom −',perspective:'3D',topView:'Top',fallback:'3D unavailable. Continue with the sliders and readings.',sceneHelp:'Drag to orbit · Scroll / pinch to zoom · Dots: + → −',wiringLabel:'Meter wiring',wireRight:'Normal · A series / V parallel',wireShort:'Mistake: parallel A → short circuit',wireOpen:'Mistake: series V → open circuit',voltageLabel:'Supply voltage U',resistanceLabel:'Resistance R',ammeterRange:'Ammeter range',voltmeterRange:'Voltmeter range',record:'Save this reading',notebookEyebrow:'Watch as you adjust',notebookTitle:'U-I observations',trial:'Record',legend:'Dashed: current R · Hollow: saved · Filled: live',dataNote:'Save any combinations to compare. Keeps the latest 100 readings.',observe:'Free exploration',observeTitle:'Questions to explore',panelTitle:'Observation deck',reset:'Clear records',guideVoltage:'Hold resistance fixed and slowly increase voltage. What happens to current?',guideResistance:'Hold voltage fixed and increase resistance. How does current change?',guideRecord:'Save interesting readings and compare the points. The dashed line is the theoretical curve for the current resistor; the solid dot is the live operating point.',safety:'Ideal meters and resistor; overrange disconnects this simulator. Dots are not real charge speeds. Use real circuits with a teacher.',ready:'Drag a slider to start exploring. No quiz required.',recorded:'Reading saved. Keep adjusting to compare.',cleared:'Records cleared. Current settings kept.',theory:'Theory',protected:'Protection: readings unavailable',live:'Live readings',sound:'Toggle sound',theme:'Switch theme',fault:{'short-circuit':'Parallel A nearly shorts the circuit. Protection opened; put A in series.','open-circuit':'Series V nearly opens the circuit. Put V across the resistor.','voltmeter-overload':'Voltage over range. Protection opened; select 15 V.','ammeter-overload':'Current over range. Protection opened; select 3 A.','already-recorded':'Already saved. Try another combination.','invalid-setup':'Settings outside the experiment range.','invalid-wiring':'Choose a wiring option.'}}
};
let lang='zh',t=key=>I18N[lang][key],scene,mobilePanel='bench';
let experiment={history:[],setup:{voltageV:1.5,resistanceOhm:10,ammeterRangeA:3,voltmeterRangeV:15,wiring:CORRECT_WIRING}};
let feedback='ready';
let muted=localStorage.getItem(`${SAVE_KEY}.sound`)==='true';
const labAudio=createLabAudio({bgmUrl:new URL('./audio/bgm-calm-tech-01.ogg',import.meta.url),muted});
document.addEventListener('pointerdown',()=>{if(!muted)labAudio.unlock();},{once:true});
let panelOpen=true;
function applyPanel(){const panel=$('panel');if(!panel)return;panel.classList.toggle('is-collapsed',!panelOpen);$('panelBody').hidden=!panelOpen;$('panelHandle')?.setAttribute('aria-expanded',String(panelOpen));const arrow=$('panelArrow');if(arrow)arrow.textContent=panelOpen?'▾':'▸';}
$('panelHandle')?.addEventListener('click',()=>{panelOpen=!panelOpen;applyPanel();});
try {
  const saved=JSON.parse(localStorage.getItem(SAVE_KEY));
  experiment.history=restoreObservations(saved);
  if(saved?.setup && !['invalid-setup','invalid-wiring'].includes(measureCircuit(saved.setup).reason))experiment.setup=saved.setup;
} catch { /* Start with valid defaults if storage is corrupt. */ }
// Reopen in normal wiring; fault demonstrations are transient, history is durable.
if(experiment.setup.wiring!==CORRECT_WIRING){
  experiment={...experiment,setup:{...experiment.setup,wiring:CORRECT_WIRING}};
  feedback='restoredSafe';
}
const save=()=>localStorage.setItem(SAVE_KEY,JSON.stringify({version:2,setup:experiment.setup,trials:experiment.history}));
function tone(){labAudio.beep('tap');}
const fmt=value=>Number(value.toFixed(3)).toString();
const svg=(name,attrs)=>{const e=document.createElementNS('http://www.w3.org/2000/svg',name);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));return e;};
function graph(snapshot){
  const {setup,history:trials,measurement:reading}=snapshot;
  const root=$('graphLines');root.replaceChildren();
  const maxI=1.2,x=u=>38+u/6*264,y=i=>156-i/maxI*138;
  const line=svg('line',{x1:38,y1:156,x2:302,y2:y(6/setup.resistanceOhm),stroke:'#c47916','stroke-width':2,'stroke-dasharray':'5 4','data-theory-line':''});root.append(line);
  for(const [u,i] of [[0,0],[3,.6],[6,1.2]]){
    const a=svg('text',{x:x(u),y:170,'text-anchor':'middle','font-size':10,fill:'currentColor'});a.textContent=u;root.append(a);
    const b=svg('text',{x:33,y:y(i)+4,'text-anchor':'end','font-size':10,fill:'currentColor'});b.textContent=i;root.append(b);
  }
  trials.forEach(trial=>{const dot=svg('circle',{cx:x(trial.voltageV),cy:y(trial.currentA),r:8,fill:'none',stroke:'#2686bd','stroke-width':2,'data-history-point':''});const title=svg('title',{});title.textContent=`${trial.voltageV} V / ${trial.resistanceOhm} Ω = ${fmt(trial.currentA)} A`;dot.append(title);root.append(dot);});
  if(reading.ok)root.append(svg('circle',{cx:x(reading.voltageV),cy:y(reading.currentA),r:6,fill:'#c47916',stroke:'white','stroke-width':2,'data-live-point':''}));
}
function render(){
  const snapshot=deriveExperiment(experiment.setup,experiment.history);
  const {setup,history:trials,measurement:reading}=snapshot;
  scene?.update(snapshot);
  $("app").dataset.status=snapshot.status;
  $("sceneStatus").textContent=t(reading.ok?"liveStatus":snapshot.status==="open-circuit"?"openStatus":"faultStatus");
  $("supplySetting").textContent=`${t("supply")}：${setup.voltageV.toFixed(1)} V`;
  $("theoryCurrent").textContent=`${t("theoryI")}：${fmt(snapshot.theoreticalCurrentA)} A`;
  $('voltageSelect').value=setup.voltageV;$('resistanceSelect').value=setup.resistanceOhm;
  $('ammeterRange').value=setup.ammeterRangeA;$('voltmeterRange').value=setup.voltmeterRangeV;
  $('voltageValue').textContent=`${setup.voltageV.toFixed(1)} V`;$('resistanceValue').textContent=`${setup.resistanceOhm} Ω`;
  $('voltReadout').textContent=reading.ok?`${setup.voltageV.toFixed(1)} V`:'— V';
  $('ampReadout').textContent=reading.ok?`${fmt(reading.currentA)} A`:'— A';
  $('resistorReadout').textContent=`${setup.resistanceOhm} Ω`;
  const formula=`I = U / R = ${setup.voltageV.toFixed(1)} V / ${setup.resistanceOhm} Ω = ${fmt(snapshot.theoreticalCurrentA)} A`;
  $('calculation').textContent=`${t('theory')} · ${formula}（${t('theoryCondition')}）`;
  $('instrumentNote').textContent=reading.ok?t('live'):reading.reason==='open-circuit'?I18N[lang].fault[reading.reason]:`${t('protected')} · ${I18N[lang].fault[reading.reason]}`;
  $('recordBtn').disabled=!reading.ok;
  $('trialCount').textContent=trials.length;
  $('trialRows').replaceChildren(...trials.map((trial,i)=>{const row=document.createElement('tr');[i+1,trial.voltageV.toFixed(1),fmt(trial.currentA),trial.resistanceOhm].forEach(value=>{const cell=document.createElement('td');cell.textContent=value;row.append(cell);});return row;}));
  graph(snapshot);
  $('feedback').textContent=I18N[lang].fault[feedback]||t(feedback);
  $('app').dataset.mobilePanel=mobilePanel;
  document.querySelectorAll('[data-mobile-panel]').forEach(b=>{if(b.tagName==='BUTTON')b.setAttribute('aria-pressed',String(b.dataset.mobilePanel===mobilePanel));});
  $('langBtn').textContent=lang==='zh'?'EN':'中';
  $('themeBtn').setAttribute('aria-label',t('theme'));
  $('soundBtn').setAttribute('aria-label',t('sound'));$('soundBtn').setAttribute('aria-pressed',String(muted));$('soundBtn').textContent=muted?'🔇':'🔊';
  document.title=t('title');
}
for(const [id,key] of [['voltageSelect','voltageV'],['resistanceSelect','resistanceOhm'],['ammeterRange','ammeterRangeA'],['voltmeterRange','voltmeterRangeV']]){
  $(id).addEventListener(id.endsWith('Select')?'input':'change',()=>{experiment={...experiment,setup:{...experiment.setup,[key]:Number($(id).value)}};feedback='ready';save();render();});
}
document.querySelectorAll('.mobile-nav__button').forEach(b=>b.onclick=()=>{mobilePanel=b.dataset.mobilePanel;render();if(mobilePanel!=="bench")$(mobilePanel==="mission"?"missionTitle":"notebookTitle").scrollIntoView({block:"start"});});
$('recordBtn').onclick=()=>{const result=recordObservation(experiment.history,experiment.setup);if(result.ok){experiment={...experiment,history:result.trials};feedback='recorded';tone();window.cool?.track('observe-circuit',{voltageV:experiment.setup.voltageV,resistanceOhm:experiment.setup.resistanceOhm});}else feedback=result.reason;save();render();};
$('resetBtn').onclick=()=>{experiment={...experiment,history:[]};feedback='cleared';save();render();};
$('zoomInBtn').onclick=()=>scene?.zoom(.8);$('zoomOutBtn').onclick=()=>scene?.zoom(1.25);
$('perspectiveBtn').onclick=()=>scene?.view(false);$('topViewBtn').onclick=()=>scene?.view(true);
$('themeBtn').onclick=()=>window.cool.preferences.toggleTheme();$('langBtn').onclick=()=>window.cool.preferences.toggleLang();
$('soundBtn').onclick=()=>{muted=!muted;labAudio.setMuted(muted);localStorage.setItem(`${SAVE_KEY}.sound`,muted);render();};
window.cool.bindI18n(I18N,{onChange({lang:next,t:translate}){lang=next;t=translate;render();}});
applyPanel();
import('./scene.js').then(({createCircuitScene})=>{scene=createCircuitScene($('circuitScene'));render();}).catch(()=>{$('circuitScene').dataset.failed='true';});
