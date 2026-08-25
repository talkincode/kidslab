import assert from 'node:assert/strict';
import test from 'node:test';

import {
  AMINO_ACIDS,
  BASES,
  CODON_TABLE,
  COMPLEMENT,
  TEMPLATE_STRAND,
  applyMutation,
  classifyMutation,
  codonsOf,
  complementBase,
  complementStrand,
  enumerateSingleSubstitutions,
  hasSilentSubstitution,
  isLegalPair,
  mutationReport,
  proteinOf,
  retainedParentalStrands,
  semiConservativeProducts,
  transcribe,
  translate,
} from '../../src/dna-replication-lab/dna-model.js';

test('base pairing is strictly A-T and G-C', () => {
  assert.deepEqual(COMPLEMENT, { A: 'T', T: 'A', G: 'C', C: 'G' });
  for (const base of BASES) {
    assert.equal(isLegalPair(base, COMPLEMENT[base]), true);
    for (const other of BASES) {
      if (other === COMPLEMENT[base]) continue;
      assert.equal(isLegalPair(base, other), false, `${base} must not pair with ${other}`);
    }
  }
  assert.equal(complementBase('U'), null);
});

test('a template strand determines the complementary strand and its own mirror', () => {
  assert.equal(complementStrand('TACCAAAGT'), 'ATGGTTTCA');
  assert.equal(complementStrand(complementStrand(TEMPLATE_STRAND)), TEMPLATE_STRAND);
  assert.equal(complementStrand(''), '');
});

test('semi-conservative replication leaves one parental strand in each daughter helix', () => {
  const products = semiConservativeProducts(TEMPLATE_STRAND);
  assert.equal(products.length, 2);
  assert.equal(retainedParentalStrands(TEMPLATE_STRAND), 2);

  const [left, right] = products;
  assert.equal(left.parental, TEMPLATE_STRAND);
  assert.equal(left.fresh, complementStrand(TEMPLATE_STRAND));
  assert.equal(right.parental, complementStrand(TEMPLATE_STRAND));
  assert.equal(right.fresh, TEMPLATE_STRAND);
  /* 两条子代双链的碱基序列彼此互补，与母链完全一致 */
  for (const duplex of products) {
    assert.equal(complementStrand(duplex.parental), duplex.fresh);
  }
});

test('mRNA copies the coding strand with uracil in place of thymine', () => {
  const coding = complementStrand(TEMPLATE_STRAND);
  assert.equal(coding, 'ATGGTTTCA');
  assert.equal(transcribe(coding), 'AUGGUUUCA');
  assert.equal(transcribe(coding).includes('T'), false);
  assert.deepEqual(codonsOf(transcribe(coding)), ['AUG', 'GUU', 'UCA']);
});

test('the standard genetic code translates the lab fragment to Met-Val-Ser', () => {
  assert.deepEqual(proteinOf(TEMPLATE_STRAND), ['M', 'V', 'S']);
  assert.deepEqual(
    proteinOf(TEMPLATE_STRAND).map((code) => AMINO_ACIDS[code]),
    ['Met', 'Val', 'Ser'],
  );
  assert.equal(CODON_TABLE.AUG, 'M');
  assert.equal(CODON_TABLE.UAA, '*');
  assert.equal(CODON_TABLE.UAG, '*');
  assert.equal(CODON_TABLE.UGA, '*');
  assert.equal(Object.keys(CODON_TABLE).length, 64);
  assert.deepEqual(translate('AUGUAA'), ['M', '*']);
});

test('the codon table is degenerate: valine and serine each have four codons', () => {
  const codonsFor = (acid) => Object.entries(CODON_TABLE)
    .filter(([, code]) => code === acid)
    .map(([codon]) => codon);

  assert.deepEqual(codonsFor('V').sort(), ['GUA', 'GUC', 'GUG', 'GUU']);
  assert.deepEqual(codonsFor('M'), ['AUG']);
  assert.deepEqual(codonsFor('W'), ['UGG']);
  assert.equal(codonsFor('S').length, 6);
});

test('a single base swap is rejected when it changes nothing or is out of range', () => {
  assert.equal(applyMutation(TEMPLATE_STRAND, 0, TEMPLATE_STRAND[0]), null);
  assert.equal(applyMutation(TEMPLATE_STRAND, -1, 'A'), null);
  assert.equal(applyMutation(TEMPLATE_STRAND, 99, 'A'), null);
  assert.equal(applyMutation(TEMPLATE_STRAND, 0, 'U'), null);
  assert.equal(applyMutation(TEMPLATE_STRAND, 0, 'A'), 'AACCAAAGT');
});

test('mutation types follow the codon change, not the base change', () => {
  const silent = mutationReport(TEMPLATE_STRAND, 5, 'T');
  assert.equal(silent.codonBefore, 'GUU');
  assert.equal(silent.codonAfter, 'GUA');
  assert.equal(silent.acidBefore, 'V');
  assert.equal(silent.acidAfter, 'V');
  assert.equal(silent.kind, 'silent');
  assert.deepEqual(silent.after.protein, ['M', 'V', 'S']);

  const missense = mutationReport(TEMPLATE_STRAND, 4, 'G');
  assert.equal(missense.codonBefore, 'GUU');
  assert.equal(missense.codonAfter, 'GCU');
  assert.equal(missense.acidAfter, 'A');
  assert.equal(missense.kind, 'missense');

  const nonsense = mutationReport(TEMPLATE_STRAND, 7, 'T');
  assert.equal(nonsense.codonAfter, 'UAA');
  assert.equal(nonsense.acidAfter, '*');
  assert.equal(nonsense.kind, 'nonsense');

  assert.equal(mutationReport(TEMPLATE_STRAND, 0, TEMPLATE_STRAND[0]), null);
});

test('the lab fragment always has a silent substitution so the challenge is solvable', () => {
  assert.equal(hasSilentSubstitution(TEMPLATE_STRAND), true);
  const substitutions = enumerateSingleSubstitutions(TEMPLATE_STRAND);
  assert.equal(substitutions.length, TEMPLATE_STRAND.length * 3);

  const kinds = substitutions.reduce((counts, report) => {
    counts[report.kind] = (counts[report.kind] || 0) + 1;
    return counts;
  }, {});
  assert.equal(kinds.silent, 6);
  assert.equal(kinds.nonsense, 2);
  assert.equal(kinds.missense, 19);

  /* 同义突变只出现在第二、三个密码子的第三位：AUG 是甲硫氨酸的唯一密码子 */
  for (const report of substitutions.filter((item) => item.kind === 'silent')) {
    assert.ok(report.index >= 3, `site ${report.index + 1} should not be inside the start codon`);
    assert.equal(report.index % 3, 2);
    assert.equal(report.acidBefore, report.acidAfter);
  }
});

test('mutating the template propagates through coding strand, mRNA and protein', () => {
  const mutated = applyMutation(TEMPLATE_STRAND, 4, 'G');
  assert.equal(mutated, 'TACCGAAGT');
  assert.equal(complementStrand(mutated), 'ATGGCTTCA');
  assert.equal(transcribe(complementStrand(mutated)), 'AUGGCUUCA');
  assert.deepEqual(proteinOf(mutated), ['M', 'A', 'S']);
  assert.equal(classifyMutation(TEMPLATE_STRAND, mutated), 'missense');
  assert.equal(classifyMutation(TEMPLATE_STRAND, TEMPLATE_STRAND), 'silent');
});
