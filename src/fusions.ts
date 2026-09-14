import {
  CARD_ASSET_BASE_URL,
  CHARMELEON_CARD,
  HAUNTER_CARD,
} from './utils/images.js';
import type { Card } from './utils/images.js';

export interface FusionRecipe {
  id: string;
  name: string;
  componentIds: string[];
  result: Card;
  animationUrl: string;
  completionText: string;
}

export type FusionResult =
  | { success: true; inventory: Card[]; card: Card }
  | { success: false; missingIds: string[] };

export const EXODIA_PART_IDS = [
  'exodiacabeca',
  'exodiamaodireita',
  'exodiamaoesquerda',
  'exodiapernadireita',
  'exodiapernaesquerda',
] as const;

export const fusionRecipes: FusionRecipe[] = [
  {
    id: 'exodia',
    name: 'Exodia',
    componentIds: [...EXODIA_PART_IDS],
    result: {
      id: 'exodia',
      name: 'EXODIA, O PROIBIDO',
      imageUrl: `${CARD_ASSET_BASE_URL}/exodia-card.gif`,
      rarity: 'mitico',
    },
    animationUrl: `${CARD_ASSET_BASE_URL}/exodia-fusao.gif`,
    completionText: 'As cinco partes foram reunidas...',
  },
  {
    id: 'charmander',
    name: 'Charmander',
    componentIds: ['charmander', 'charmander', 'charmander'],
    result: CHARMELEON_CARD,
    animationUrl: `${CARD_ASSET_BASE_URL}/charizardfusao.gif`,
    completionText: 'Três Charmander se fundiram e evoluíram!',
  },
  {
    id: 'charmeleon',
    name: 'Charmeleon',
    componentIds: ['charmeleon', 'charmeleon', 'charmeleon'],
    result: {
      id: 'charizard',
      name: 'Charizard',
      imageUrl: `${CARD_ASSET_BASE_URL}/charizard.gif`,
      rarity: 'lendario',
    },
    animationUrl: `${CARD_ASSET_BASE_URL}/charizardfusao.gif`,
    completionText: 'Três Charmeleon se fundiram e alcançaram a evolução final!',
  },
  {
    id: 'gastly',
    name: 'Gastly',
    componentIds: ['gastly', 'gastly', 'gastly'],
    result: HAUNTER_CARD,
    animationUrl: `${CARD_ASSET_BASE_URL}/gengarfusao.gif`,
    completionText: 'Três Gastly se fundiram e evoluíram!',
  },
  {
    id: 'haunter',
    name: 'Haunter',
    componentIds: ['haunter', 'haunter', 'haunter'],
    result: {
      id: 'gengar',
      name: 'Gengar',
      imageUrl: `${CARD_ASSET_BASE_URL}/gengar.gif`,
      rarity: 'lendario',
    },
    animationUrl: `${CARD_ASSET_BASE_URL}/gengarfusao.gif`,
    completionText: 'Três Haunter se fundiram e alcançaram a evolução final!',
  },
];

export function findFusionRecipe(recipeId: string) {
  const normalizedId = recipeId.trim().toLowerCase();
  return fusionRecipes.find((recipe) => recipe.id === normalizedId);
}

export function fuseCards(cards: Card[], recipe: FusionRecipe): FusionResult {
  const availableCounts = new Map<string, number>();
  for (const card of cards) {
    availableCounts.set(card.id, (availableCounts.get(card.id) || 0) + 1);
  }

  const missingIds: string[] = [];
  for (const componentId of recipe.componentIds) {
    const count = availableCounts.get(componentId) || 0;
    if (count === 0) {
      missingIds.push(componentId);
    } else {
      availableCounts.set(componentId, count - 1);
    }
  }

  if (missingIds.length > 0) {
    return { success: false, missingIds };
  }

  const nextInventory = [...cards];
  for (const componentId of recipe.componentIds) {
    const index = nextInventory.findIndex((card) => card.id === componentId);
    nextInventory.splice(index, 1);
  }
  nextInventory.push(recipe.result);

  return {
    success: true,
    inventory: nextInventory,
    card: recipe.result,
  };
}
