import { getImage } from "./registry";

// null = custom image, no effect icon overlay
export const EFFECT_ICON: Record<string, string | null> = {
  "Night Vision": "night vision",
  Invisibility: "invisibility",
  Leaping: "jump boost",
  "Fire Resistance": "fire resistance",
  Swiftness: "speed",
  Slowness: "slowness",
  "Water Breathing": "water breathing",
  Healing: "instant health",
  Harming: "instant damage",
  Poison: "poison",
  Regeneration: "regeneration",
  Strength: "strength",
  Weakness: "weakness",
  "Slow Falling": "slow falling",
  Luck: "luck",
  Weaving: "weaving",
  Oozing: "oozing",
  Blindness: "blindness",
  Absorption: "absorption",
  Haste: "haste",
  "Health Boost": "health boost",
  Hunger: "hunger",
  "Mining Fatigue": "mining fatigue",
  Nausea: "nausea",
  Resistance: "resistance",
  Saturation: "saturation",
  Levitation: "levitation",
  // Name mismatches — effect name differs from potion suffix
  Decay: "wither (effect)",
  "Wind Charging": "wind charged",
  Infestation: "infested",
  "the Turtle Master": "turtle shell",
  // Other effects
  Shazboots: "Shazboots! (effect)",
  Small: "small",
  Big: "big",
  Sticky: "sticky",
  Sharing: "sharing",
};

export function getEffectIcon(itemLabel: string): string | null {
  // Matches 'Potion of Night Vision' and 'Arrow of Night Vision'
  const match = itemLabel.match(/^(?:Potion|Arrow) of (.+)$/);
  if (!match) return null;

  const registryKey = EFFECT_ICON[match[1]];
  if (registryKey === undefined || registryKey === null) return null;
  return getImage(registryKey);
}
