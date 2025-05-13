// Utility to get consistent color for vibes (both Tailwind class and hex)

const vibeColorMap = [
  { name: 'work', class: 'bg-vibe-blue', hex: '#0EA5E9' },
  { name: 'study', class: 'bg-vibe-purple', hex: '#9b87f5' },
  { name: 'exercise', class: 'bg-vibe-green', hex: '#10B981' },
  { name: 'social', class: 'bg-vibe-orange', hex: '#F97316' },
  { name: 'self', class: 'bg-vibe-pink', hex: '#D946EF' },
];

const fallbackClasses = [
  { class: 'bg-vibe-purple', hex: '#8B5CF6' },
  { class: 'bg-vibe-pink', hex: '#EC4899' },
  { class: 'bg-vibe-orange', hex: '#F59E0B' },
  { class: 'bg-vibe-blue', hex: '#06B6D4' },
  { class: 'bg-vibe-green', hex: '#22C55E' },
];

export function getVibeColor(vibeId: string, vibeName: string) {
  const name = vibeName.toLowerCase();
  const found = vibeColorMap.find(v => name.includes(v.name));
  if (found) return { class: found.class, hex: found.hex };
  // fallback: hash id
  const hash = vibeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const idx = hash % fallbackClasses.length;
  return fallbackClasses[idx];
}
