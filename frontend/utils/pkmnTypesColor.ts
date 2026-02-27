export type TypeStyle = { bg: string; text: string; glow: string };

export const TYPE_COLORS: Record<string, TypeStyle> = {
  fire: { bg: '#ff6b35', text: '#fff', glow: 'rgba(255,107,53,0.6)' },
  water: { bg: '#4a9eff', text: '#fff', glow: 'rgba(74,158,255,0.6)' },
  grass: { bg: '#4caf50', text: '#fff', glow: 'rgba(76,175,80,0.6)' },
  electric: { bg: '#ffd700', text: '#1a1a00', glow: 'rgba(255,215,0,0.7)' },
  psychic: { bg: '#e91e8c', text: '#fff', glow: 'rgba(233,30,140,0.6)' },
  ice: { bg: '#80deea', text: '#003', glow: 'rgba(128,222,234,0.6)' },
  dark: { bg: '#424242', text: '#fff', glow: 'rgba(66,66,66,0.7)' },
  fighting: { bg: '#c62828', text: '#fff', glow: 'rgba(198,40,40,0.6)' },
  poison: { bg: '#9c27b0', text: '#fff', glow: 'rgba(156,39,176,0.6)' },
  ground: { bg: '#a1887f', text: '#fff', glow: 'rgba(161,136,127,0.6)' },
  flying: { bg: '#90caf9', text: '#003', glow: 'rgba(144,202,249,0.6)' },
  bug: { bg: '#8bc34a', text: '#fff', glow: 'rgba(139,195,74,0.6)' },
  rock: { bg: '#78909c', text: '#fff', glow: 'rgba(120,144,156,0.6)' },
  ghost: { bg: '#512da8', text: '#fff', glow: 'rgba(81,45,168,0.6)' },
  steel: { bg: '#90a4ae', text: '#fff', glow: 'rgba(144,164,174,0.6)' },
  fairy: { bg: '#f8bbd0', text: '#880e4f', glow: 'rgba(248,187,208,0.6)' },
  dragon: { bg: '#7c4dff', text: '#fff', glow: 'rgba(124,77,255,0.6)' },
};

export const getTypeStyle = (type: string) =>
  TYPE_COLORS[type?.toLowerCase()] ?? { bg: 'rgba(255,255,255,0.3)', text: '#052838', glow: 'transparent' };

export const STAT_LABELS: Record<string, string> = {
  hp: 'PV', attack: 'ATQ', defense: 'DEF',
  'special-attack': 'ATQ.S', 'special-defense': 'DEF.S', speed: 'VIT',
};