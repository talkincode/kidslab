export const ZONES = Object.freeze(['left', 'both', 'right', 'neither']);

export const LEVELS = Object.freeze([
  {
    id: 'identity',
    rules: ['antenna', 'threeEyes'],
    ships: [
      { id: 'comet', antenna: true, threeEyes: false, hull: '#e85b4f', accent: '#ffd36a', mark: '☄' },
      { id: 'nova', antenna: true, threeEyes: true, hull: '#37b7c8', accent: '#ffe993', mark: '✦' },
      { id: 'luna', antenna: false, threeEyes: true, hull: '#e18450', accent: '#bff5ff', mark: '☾' },
      { id: 'drift', antenna: false, threeEyes: false, hull: '#8394a8', accent: '#f4be5b', mark: '●' },
      { id: 'beacon', antenna: true, threeEyes: true, hull: '#d84c66', accent: '#8af1df', mark: '★' },
    ],
  },
  {
    id: 'shape',
    rules: ['round', 'striped'],
    ships: [
      { id: 'pearl', round: true, striped: false, hull: '#d98050', accent: '#fff1b6', mark: '●' },
      { id: 'relay', round: false, striped: true, hull: '#3c9fb8', accent: '#ffc563', mark: '▰' },
      { id: 'orbit', round: true, striped: true, hull: '#cc5b70', accent: '#a8f2e2', mark: '◉' },
      { id: 'kite', round: false, striped: false, hull: '#8794a5', accent: '#e9bc65', mark: '◆' },
      { id: 'halo', round: true, striped: true, hull: '#e37f4e', accent: '#b7ecff', mark: '⊚' },
    ],
  },
  {
    id: 'cargo',
    rules: ['crystal', 'wings'],
    ships: [
      { id: 'swift', crystal: false, wings: true, hull: '#3d9eb5', accent: '#f6c85f', mark: '➤' },
      { id: 'prism', crystal: true, wings: true, hull: '#ca536d', accent: '#91efd8', mark: '♦' },
      { id: 'gem', crystal: true, wings: false, hull: '#df8450', accent: '#bdeeff', mark: '◆' },
      { id: 'cargo', crystal: false, wings: false, hull: '#7d8fa2', accent: '#f2be58', mark: '●' },
      { id: 'aurora', crystal: true, wings: true, hull: '#4a9bb3', accent: '#ffe17e', mark: '✧' },
    ],
  },
  {
    id: 'finale',
    rules: ['blue', 'star'],
    ships: [
      { id: 'polaris', blue: true, star: true, hull: '#247fab', accent: '#ffd86c', mark: '★' },
      { id: 'sol', blue: false, star: true, hull: '#d95d53', accent: '#fff0a8', mark: '★' },
      { id: 'marine', blue: true, star: false, hull: '#2c91bd', accent: '#9fe9df', mark: '●' },
      { id: 'ember', blue: false, star: false, hull: '#df7c4f', accent: '#bceeff', mark: '◆' },
      { id: 'zenith', blue: true, star: true, hull: '#317ea8', accent: '#f6c75f', mark: '★' },
    ],
  },
]);

export function checksFor(level, ship) {
  const [leftRule, rightRule] = level.rules;
  return {
    left: Boolean(ship[leftRule]),
    right: Boolean(ship[rightRule]),
  };
}

export function expectedZone(level, ship) {
  const checks = checksFor(level, ship);
  if (checks.left && checks.right) return 'both';
  if (checks.left) return 'left';
  if (checks.right) return 'right';
  return 'neither';
}

export function truthCode(level, ship) {
  const checks = checksFor(level, ship);
  return `${Number(checks.left)}${Number(checks.right)}`;
}

export function missionSolution(level) {
  return level.ships.map((ship) => expectedZone(level, ship));
}
