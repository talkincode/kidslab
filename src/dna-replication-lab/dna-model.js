/**
 * DNA 复制实验室 · 碱基配对与遗传信息模型
 *
 * 纯函数层：碱基互补配对是规则而不是测量结果，所以这里全部是确定性判定。
 * 约定：课件只按「位点一一对应」处理互补，不引入 5'/3' 方向与反向平行。
 */

export const BASES = Object.freeze(['A', 'T', 'G', 'C']);

/** DNA 双链的互补规则：A 只配 T，G 只配 C */
export const COMPLEMENT = Object.freeze({ A: 'T', T: 'A', G: 'C', C: 'G' });

export function complementBase(base) {
  return COMPLEMENT[base] || null;
}

export function isLegalPair(templateBase, incomingBase) {
  return COMPLEMENT[templateBase] === incomingBase;
}

export function complementStrand(strand) {
  if (typeof strand !== 'string') return '';
  return [...strand].map((base) => COMPLEMENT[base] || '?').join('');
}

/** 转录：mRNA 与编码链序列相同，只把 T 换成 U */
export function transcribe(codingStrand) {
  if (typeof codingStrand !== 'string') return '';
  return codingStrand.replaceAll('T', 'U');
}

/** 标准遗传密码表（NCBI translation table 1），按 mRNA 密码子索引 */
export const CODON_TABLE = Object.freeze({
  UUU: 'F', UUC: 'F', UUA: 'L', UUG: 'L',
  CUU: 'L', CUC: 'L', CUA: 'L', CUG: 'L',
  AUU: 'I', AUC: 'I', AUA: 'I', AUG: 'M',
  GUU: 'V', GUC: 'V', GUA: 'V', GUG: 'V',
  UCU: 'S', UCC: 'S', UCA: 'S', UCG: 'S',
  CCU: 'P', CCC: 'P', CCA: 'P', CCG: 'P',
  ACU: 'T', ACC: 'T', ACA: 'T', ACG: 'T',
  GCU: 'A', GCC: 'A', GCA: 'A', GCG: 'A',
  UAU: 'Y', UAC: 'Y', UAA: '*', UAG: '*',
  CAU: 'H', CAC: 'H', CAA: 'Q', CAG: 'Q',
  AAU: 'N', AAC: 'N', AAA: 'K', AAG: 'K',
  GAU: 'D', GAC: 'D', GAA: 'E', GAG: 'E',
  UGU: 'C', UGC: 'C', UGA: '*', UGG: 'W',
  CGU: 'R', CGC: 'R', CGA: 'R', CGG: 'R',
  AGU: 'S', AGC: 'S', AGA: 'R', AGG: 'R',
  GGU: 'G', GGC: 'G', GGA: 'G', GGG: 'G',
});

export function codonsOf(messengerRna) {
  const codons = [];
  for (let i = 0; i + 3 <= messengerRna.length; i += 3) codons.push(messengerRna.slice(i, i + 3));
  return codons;
}

export function translate(messengerRna) {
  return codonsOf(messengerRna).map((codon) => CODON_TABLE[codon] ?? '?');
}

/**
 * 半保留复制：双链解开后，每条母链各自配出一条新链，
 * 得到的两条子代双链都是「一条旧链 + 一条新链」。
 */
export function semiConservativeProducts(templateStrand) {
  const coding = complementStrand(templateStrand);
  return Object.freeze([
    Object.freeze({ id: 'left', parental: templateStrand, fresh: coding, parentalRole: 'template' }),
    Object.freeze({ id: 'right', parental: coding, fresh: templateStrand, parentalRole: 'coding' }),
  ]);
}

/** 两条子代双链里保留的母链条数：半保留复制的判定锚点 */
export function retainedParentalStrands(templateStrand) {
  return semiConservativeProducts(templateStrand).filter((duplex) => duplex.parental).length;
}

/* ------------------------------ 突变 ------------------------------ */

export function applyMutation(templateStrand, index, newTemplateBase) {
  if (typeof templateStrand !== 'string') return null;
  if (!Number.isInteger(index) || index < 0 || index >= templateStrand.length) return null;
  if (!COMPLEMENT[newTemplateBase]) return null;
  if (templateStrand[index] === newTemplateBase) return null;
  return `${templateStrand.slice(0, index)}${newTemplateBase}${templateStrand.slice(index + 1)}`;
}

export function proteinOf(templateStrand) {
  return translate(transcribe(complementStrand(templateStrand)));
}

/**
 * 突变类型：氨基酸序列不变是同义突变，改变某个氨基酸是错义突变，
 * 提前出现终止密码子是无义突变。
 */
export function classifyMutation(originalTemplate, mutatedTemplate) {
  const before = proteinOf(originalTemplate);
  const after = proteinOf(mutatedTemplate);
  if (before.join('') === after.join('')) return 'silent';
  const gainedStop = after.some((acid, index) => acid === '*' && before[index] !== '*');
  if (gainedStop) return 'nonsense';
  return 'missense';
}

export function mutationReport(originalTemplate, index, newTemplateBase) {
  const mutated = applyMutation(originalTemplate, index, newTemplateBase);
  if (mutated === null) return null;
  const codonIndex = Math.floor(index / 3);
  const before = {
    template: originalTemplate,
    coding: complementStrand(originalTemplate),
    rna: transcribe(complementStrand(originalTemplate)),
    protein: proteinOf(originalTemplate),
  };
  const after = {
    template: mutated,
    coding: complementStrand(mutated),
    rna: transcribe(complementStrand(mutated)),
    protein: proteinOf(mutated),
  };
  return {
    index,
    codonIndex,
    fromBase: originalTemplate[index],
    toBase: newTemplateBase,
    codonBefore: codonsOf(before.rna)[codonIndex] ?? '',
    codonAfter: codonsOf(after.rna)[codonIndex] ?? '',
    acidBefore: before.protein[codonIndex] ?? '?',
    acidAfter: after.protein[codonIndex] ?? '?',
    kind: classifyMutation(originalTemplate, mutated),
    before,
    after,
  };
}

/** 枚举所有单碱基替换，用于校验「一定存在同义突变」这类挑战 */
export function enumerateSingleSubstitutions(templateStrand) {
  const reports = [];
  for (let index = 0; index < templateStrand.length; index += 1) {
    for (const base of BASES) {
      const report = mutationReport(templateStrand, index, base);
      if (report) reports.push(report);
    }
  }
  return reports;
}

export function hasSilentSubstitution(templateStrand) {
  return enumerateSingleSubstitutions(templateStrand).some((report) => report.kind === 'silent');
}

/* ------------------------------ 关卡数据 ------------------------------ */

/**
 * 起始模板链固定为 TACCAAAGT：
 * 编码链 ATGGTTTCA → mRNA AUG GUU UCA → 甲硫氨酸-缬氨酸-丝氨酸。
 * 后两个密码子都有同义替换，L4 的「换碱基但蛋白不变」一定有解。
 */
export const TEMPLATE_STRAND = 'TACCAAAGT';

export const AMINO_ACIDS = Object.freeze({
  A: 'Ala', R: 'Arg', N: 'Asn', D: 'Asp', C: 'Cys', Q: 'Gln', E: 'Glu', G: 'Gly',
  H: 'His', I: 'Ile', L: 'Leu', K: 'Lys', M: 'Met', F: 'Phe', P: 'Pro', S: 'Ser',
  T: 'Thr', W: 'Trp', Y: 'Tyr', V: 'Val', '*': 'Stop',
});
