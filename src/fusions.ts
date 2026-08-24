import { CARD_ASSET_BASE_URL } from './utils/images.js';
import type { Card } from './utils/images.js';

export interface FusionRecipe {
  id: string;
  name: string;
  componentIds: string[];
  result: Card;
  animationUrl: string;
}

export type FusionResult =
  | { success: true; inventory: Card[]; card: Card }
  | { success: false; missingIds: string[] };

export const fusionRecipes: FusionRecipe[] = [
  {
    id: 'exodia',
    name: 'Exodia',
    componentIds: [
      'exodiacabeca',
      'exodiamaodireita',
      'exodiamaoesq',
      'exodiapernadireita',
      'exodiapernaesq',
    ],
    result: {
      id: 'exodia',
      name: 'EXODIA, O PROIBIDO',
      imageUrl: `${CARD_ASSET_BASE_URL}/exodia-card.gif`,
      rarity: 'mitico',
    },
    animationUrl: `${CARD_ASSET_BASE_URL}/exodia-fusao.gif`,
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
