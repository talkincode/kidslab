import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BUILD_TARGETS,
  ISOMER_CHALLENGES,
  MOLECULE_LIBRARY,
  REACTION_MATRIX,
  TETRAHEDRAL_ANGLE,
  TRIGONAL_ANGLE,
  attachAtom,
  addAtom,
  canonicalKey,
  createMolecule,
  cycleBondOrder,
  detectFunctionalGroup,
  freeValence,
  geometryOf,
  identifyMolecule,
  isComplete,
  layoutMolecule,
  matchIsomer,
  measureAngle,
  molecularFormula,
  planarityDeviation,
  reactionOutcome,
  removeAtom,
  setBondOrder,
} from '../../src/organic-builder-lab/molecule-model.js';

const atomsOf = (molecule, element) => molecule.atoms.filter((atom) => atom.element === element);

test('the four target molecules report the formulas and functional groups taught in class', () => {
  assert.equal(MOLECULE_LIBRARY.methane.formula, 'CH4');
  assert.equal(MOLECULE_LIBRARY.ethene.formula, 'C2H4');
  assert.equal(MOLECULE_LIBRARY.ethanol.formula, 'C2H6O');
  assert.equal(MOLECULE_LIBRARY.aceticAcid.formula, 'C2H4O2');

  assert.equal(MOLECULE_LIBRARY.methane.group, 'alkane');
  assert.equal(MOLECULE_LIBRARY.ethene.group, 'alkene');
  assert.equal(MOLECULE_LIBRARY.ethanol.group, 'hydroxyl');
  assert.equal(MOLECULE_LIBRARY.aceticAcid.group, 'carboxyl');
  assert.equal(MOLECULE_LIBRARY.dimethylEther.group, 'ether');

  for (const key of BUILD_TARGETS) assert.equal(isComplete(MOLECULE_LIBRARY[key].molecule), true);
});

test('methane is a regular tetrahedron: all six H-C-H angles equal 109.47 degrees', () => {
  const molecule = MOLECULE_LIBRARY.methane.molecule;
  const { positions } = layoutMolecule(molecule);
  const carbon = atomsOf(molecule, 'C')[0].id;
  const hydrogens = atomsOf(molecule, 'H').map((atom) => atom.id);

  assert.equal(hydrogens.length, 4);
  const angles = [];
  for (let i = 0; i < hydrogens.length; i += 1) {
    for (let j = i + 1; j < hydrogens.length; j += 1) {
      angles.push(measureAngle(positions, hydrogens[i], carbon, hydrogens[j]));
    }
  }
  assert.equal(angles.length, 6);
  for (const angle of angles) assert.ok(Math.abs(angle - TETRAHEDRAL_ANGLE) < 0.01, `angle ${angle}`);
  assert.equal(geometryOf(molecule, carbon), 'tetrahedral');
});

test('ethene is planar with 120 degree bond angles around each carbon', () => {
  const molecule = MOLECULE_LIBRARY.ethene.molecule;
  const { positions } = layoutMolecule(molecule);
  assert.ok(planarityDeviation(positions) < 1e-6, 'all six atoms should share one plane');

  const [first, second] = atomsOf(molecule, 'C').map((atom) => atom.id);
  assert.equal(geometryOf(molecule, first), 'trigonal');
  const hydrogens = molecule.bonds
    .filter((bond) => bond.a === first || bond.b === first)
    .map((bond) => (bond.a === first ? bond.b : bond.a))
    .filter((id) => molecule.atoms.find((atom) => atom.id === id).element === 'H');

  assert.equal(hydrogens.length, 2);
  assert.ok(Math.abs(measureAngle(positions, hydrogens[0], first, hydrogens[1]) - TRIGONAL_ANGLE) < 0.01);
  assert.ok(Math.abs(measureAngle(positions, hydrogens[0], first, second) - TRIGONAL_ANGLE) < 0.01);
});

test('the alcohol oxygen keeps a bent geometry smaller than the tetrahedral angle', () => {
  const molecule = MOLECULE_LIBRARY.ethanol.molecule;
  const { positions } = layoutMolecule(molecule);
  const oxygen = atomsOf(molecule, 'O')[0].id;
  const neighbours = molecule.bonds
    .filter((bond) => bond.a === oxygen || bond.b === oxygen)
    .map((bond) => (bond.a === oxygen ? bond.b : bond.a));

  assert.equal(neighbours.length, 2);
  assert.equal(geometryOf(molecule, oxygen), 'bent');
  const angle = measureAngle(positions, neighbours[0], oxygen, neighbours[1]);
  assert.ok(angle < TETRAHEDRAL_ANGLE, `${angle} should be smaller than 109.47`);
  assert.ok(Math.abs(angle - 104.5) < 0.01);
});

test('valence is conserved: a full atom refuses new bonds and blocked double bonds', () => {
  let molecule = createMolecule();
  const seeded = addAtom(molecule, 'C');
  molecule = seeded.molecule;
  for (let i = 0; i < 4; i += 1) molecule = attachAtom(molecule, seeded.atomId, 'H').molecule;

  assert.equal(freeValence(molecule, seeded.atomId), 0);
  assert.equal(attachAtom(molecule, seeded.atomId, 'H').atomId, null);
  assert.equal(molecularFormula(molecule), 'CH4');

  const hydrogenBond = molecule.bonds[0];
  assert.equal(setBondOrder(molecule, hydrogenBond.id, 2).changed, false, 'hydrogen has no spare valence');
});

test('raising a C-C bond to a double bond flattens the carbon from tetrahedral to trigonal', () => {
  let molecule = createMolecule();
  const first = addAtom(molecule, 'C');
  molecule = first.molecule;
  const second = attachAtom(molecule, first.atomId, 'C');
  molecule = second.molecule;

  assert.equal(geometryOf(molecule, first.atomId), 'tetrahedral');
  const bond = molecule.bonds[0];
  const raised = cycleBondOrder(molecule, bond.id);
  assert.equal(raised.changed, true);
  molecule = raised.molecule;
  assert.equal(geometryOf(molecule, first.atomId), 'trigonal');
  assert.equal(freeValence(molecule, first.atomId), 2);
});

test('only terminal atoms can be taken off, so the molecule never splits in two', () => {
  const molecule = MOLECULE_LIBRARY.ethanol.molecule;
  const middleCarbon = molecule.atoms.find((atom) => atom.element === 'C'
    && molecule.bonds.filter((bond) => bond.a === atom.id || bond.b === atom.id).length > 1);
  const hydrogen = molecule.atoms.find((atom) => atom.element === 'H');

  assert.equal(removeAtom(molecule, middleCarbon.id).removed, false);
  assert.equal(removeAtom(molecule, hydrogen.id).removed, true);
});

test('isomers share a formula but never a connectivity key', () => {
  const [ethanolFormula, etherFormula] = [MOLECULE_LIBRARY.ethanol.formula, MOLECULE_LIBRARY.dimethylEther.formula];
  assert.equal(ethanolFormula, etherFormula);
  assert.notEqual(MOLECULE_LIBRARY.ethanol.canonical, MOLECULE_LIBRARY.dimethylEther.canonical);

  assert.equal(MOLECULE_LIBRARY.nButane.formula, MOLECULE_LIBRARY.isoButane.formula);
  assert.notEqual(MOLECULE_LIBRARY.nButane.canonical, MOLECULE_LIBRARY.isoButane.canonical);

  /* 同一个分子换一个搭建顺序，规范形必须不变 */
  let mirrored = createMolecule();
  const oxygen = addAtom(mirrored, 'O');
  mirrored = oxygen.molecule;
  const left = attachAtom(mirrored, oxygen.atomId, 'C');
  mirrored = left.molecule;
  const right = attachAtom(mirrored, oxygen.atomId, 'C');
  mirrored = right.molecule;
  for (const host of [left.atomId, right.atomId]) {
    for (let i = 0; i < 3; i += 1) mirrored = attachAtom(mirrored, host, 'H').molecule;
  }
  assert.equal(canonicalKey(mirrored), MOLECULE_LIBRARY.dimethylEther.canonical);
  assert.equal(identifyMolecule(mirrored).key, 'dimethylEther');
});

test('the isomer challenge accepts either wiring and rejects the wrong formula', () => {
  const [carbonOxygen, butane] = ISOMER_CHALLENGES;
  assert.equal(carbonOxygen.formula, 'C2H6O');
  assert.equal(butane.formula, 'C4H10');

  assert.equal(matchIsomer(carbonOxygen, MOLECULE_LIBRARY.ethanol.molecule), 'ethanol');
  assert.equal(matchIsomer(carbonOxygen, MOLECULE_LIBRARY.dimethylEther.molecule), 'dimethylEther');
  assert.equal(matchIsomer(carbonOxygen, MOLECULE_LIBRARY.aceticAcid.molecule), null);
  assert.equal(matchIsomer(butane, MOLECULE_LIBRARY.nButane.molecule), 'nButane');
  assert.equal(matchIsomer(butane, MOLECULE_LIBRARY.isoButane.molecule), 'isoButane');

  /* 未补满氢的半成品不能算作答案 */
  let partial = createMolecule();
  const carbon = addAtom(partial, 'C');
  partial = carbon.molecule;
  assert.equal(matchIsomer(carbonOxygen, partial), null);
});

test('each functional group has its own reagent fingerprint', () => {
  assert.deepEqual(REACTION_MATRIX.alkane, {
    bromineWater: false, sodium: false, litmus: false, esterify: false,
  });
  assert.equal(reactionOutcome('alkene', 'bromineWater'), true);
  assert.equal(reactionOutcome('alkane', 'bromineWater'), false);
  assert.equal(reactionOutcome('hydroxyl', 'sodium'), true);
  assert.equal(reactionOutcome('carboxyl', 'sodium'), true);
  assert.equal(reactionOutcome('hydroxyl', 'litmus'), false);
  assert.equal(reactionOutcome('carboxyl', 'litmus'), true);
  assert.equal(reactionOutcome('hydroxyl', 'esterify'), true);
  assert.equal(reactionOutcome('carboxyl', 'esterify'), false);
  assert.equal(reactionOutcome('alkane', 'unknown-reagent'), null);

  /* 四个必做分子的反应指纹必须两两不同，否则矩阵推不出结论 */
  const fingerprints = BUILD_TARGETS.map((key) => JSON.stringify(REACTION_MATRIX[MOLECULE_LIBRARY[key].group]));
  assert.equal(new Set(fingerprints).size, BUILD_TARGETS.length);
  /* 乙醇与甲醚同分子式，但反应表现完全不同 */
  assert.notEqual(
    JSON.stringify(REACTION_MATRIX.hydroxyl),
    JSON.stringify(REACTION_MATRIX.ether),
  );
});

test('functional group detection puts carboxyl ahead of the hydroxyl it contains', () => {
  assert.equal(detectFunctionalGroup(MOLECULE_LIBRARY.aceticAcid.molecule), 'carboxyl');
  assert.equal(detectFunctionalGroup(createMolecule()), 'empty');
});
