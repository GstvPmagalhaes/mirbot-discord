import {
  CARD_ASSET_BASE_URL,
  CHARMELEON_CARD,
  HAUNTER_CARD,
  cardsPool,
} from './utils/images.js';
import type { Card } from './utils/images.js';

export interface FusionRecipe {
  id: string;
  name: string;
  componentIds: string[];
  results: readonly Card[];
  animationUrl: string;
  resultAnimationUrls?: Readonly<Record<string, string>>;
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

export const MONKEY_CARD_IDS = Array.from(
  { length: 10 },
  (_, index) => `monkeys${index + 1}`
);

export const TEAM_CARD_IDS = [
  'cruzeiro',
  'saopaulo',
  'palmeiras',
  'fluminense',
  'botafogo',
  'galo',
  'flamengo',
  'corinthians',
  'vasco',
] as const;

function getCardsById(cardIds: readonly string[]) {
  return cardIds.map((cardId) => {
    const card = cardsPool.find((item) => item.id === cardId);
    if (!card) throw new Error(`Carta da fusão não encontrada: ${cardId}`);
    return card;
  });
}

const exodiaPartCards = getCardsById(EXODIA_PART_IDS);

export const fusionRecipes: FusionRecipe[] = [
  {
    id: 'exodia',
    name: 'Exodia',
    componentIds: [...EXODIA_PART_IDS],
    results: [{
      id: 'exodia',
      name: 'EXODIA, O PROIBIDO',
      imageUrl: `${CARD_ASSET_BASE_URL}/exodia-card.gif`,
      rarity: 'mitico',
    }],
    animationUrl: `${CARD_ASSET_BASE_URL}/exodia-fusao.gif`,
    completionText: 'As cinco partes foram reunidas...',
  },
  {
    id: 'charmander',
    name: 'Charmander',
    componentIds: ['charmander', 'charmander', 'charmander'],
    results: [CHARMELEON_CARD],
    animationUrl: `${CARD_ASSET_BASE_URL}/charizardfusao.gif`,
    completionText: 'Três Charmander se fundiram e evoluíram!',
  },
  {
    id: 'charmeleon',
    name: 'Charmeleon',
    componentIds: ['charmeleon', 'charmeleon', 'charmeleon'],
    results: [{
      id: 'charizard',
      name: 'Charizard',
      imageUrl: `${CARD_ASSET_BASE_URL}/charizard.gif`,
      rarity: 'lendario',
    }],
    animationUrl: `${CARD_ASSET_BASE_URL}/charizardfusao.gif`,
    completionText: 'Três Charmeleon se fundiram e alcançaram a evolução final!',
  },
  {
    id: 'gastly',
    name: 'Gastly',
    componentIds: ['gastly', 'gastly', 'gastly'],
    results: [HAUNTER_CARD],
    animationUrl: `${CARD_ASSET_BASE_URL}/gengarfusao.gif`,
    completionText: 'Três Gastly se fundiram e evoluíram!',
  },
  {
    id: 'haunter',
    name: 'Haunter',
    componentIds: ['haunter', 'haunter', 'haunter'],
    results: [{
      id: 'gengar',
      name: 'Gengar',
      imageUrl: `${CARD_ASSET_BASE_URL}/gengar.gif`,
      rarity: 'lendario',
    }],
    animationUrl: `${CARD_ASSET_BASE_URL}/gengarfusao.gif`,
    completionText: 'Três Haunter se fundiram e alcançaram a evolução final!',
  },
  {
    id: 'monkeys',
    name: 'Monkeys',
    componentIds: [...MONKEY_CARD_IDS],
    results: exodiaPartCards,
    animationUrl: `${CARD_ASSET_BASE_URL}/exodia-fusao.gif`,
    completionText: 'A coleção dos dez Monkeys foi reunida e abriu o selo do Exodia!',
  },
  {
    id: 'times',
    name: 'Times',
    componentIds: [...TEAM_CARD_IDS],
    results: [CHARMELEON_CARD, HAUNTER_CARD],
    animationUrl: `${CARD_ASSET_BASE_URL}/charizardfusao.gif`,
    resultAnimationUrls: {
      charmeleon: `${CARD_ASSET_BASE_URL}/charizardfusao.gif`,
      haunter: `${CARD_ASSET_BASE_URL}/gengarfusao.gif`,
    },
    completionText: 'Os nove Times entraram em campo e invocaram uma evolução!',
  },
];

export function findFusionRecipe(recipeId: string) {
  const normalizedId = recipeId.trim().toLowerCase();
  return fusionRecipes.find((recipe) => recipe.id === normalizedId);
}

export function getFusionAnimationUrl(recipe: FusionRecipe, result: Card) {
  return recipe.resultAnimationUrls?.[result.id] || recipe.animationUrl;
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
  const awardedCard = recipe.results[Math.floor(Math.random() * recipe.results.length)];
  if (!awardedCard) {
    throw new Error(`Fusão sem recompensa configurada: ${recipe.id}`);
  }
  nextInventory.push(awardedCard);

  return {
    success: true,
    inventory: nextInventory,
    card: awardedCard,
  };
}
