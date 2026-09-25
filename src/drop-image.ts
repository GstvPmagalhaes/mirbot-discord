import sharp from 'sharp';
import { getRarityMeta } from './utils/images.js';
import type { Card } from './utils/images.js';

type SharpOverlay = Parameters<ReturnType<typeof sharp>['composite']>[0][number];

const CARD_WIDTH = 360;
const CARD_HEIGHT = 600;
const CARD_BORDER = 10;
const CARD_GAP = 24;
const CARD_RADIUS = 18;
const HOLOGRAPHIC_BORDER = 16;

export async function renderDropImage(cards: Card[]): Promise<Buffer> {
  const panels = await Promise.all(cards.map(renderCardPanel));
  const canvasWidth = cards.length * CARD_WIDTH + Math.max(0, cards.length - 1) * CARD_GAP;

  const composites: SharpOverlay[] = panels.map((input, index) => ({
    input,
    left: index * (CARD_WIDTH + CARD_GAP),
    top: 0,
  }));

  return sharp({
    create: {
      width: canvasWidth,
      height: CARD_HEIGHT,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toBuffer();
}

async function renderCardPanel(card: Card): Promise<Buffer> {
  const meta = getRarityMeta(card);
  const borderWidth = meta.borderStyle === 'holographic'
    ? HOLOGRAPHIC_BORDER
    : CARD_BORDER;
  const innerWidth = CARD_WIDTH - borderWidth * 2;
  const innerHeight = CARD_HEIGHT - borderWidth * 2;

  const response = await fetch(card.imageUrl);
  if (!response.ok) {
    throw new Error(`Falha ao baixar a carta ${card.id}: HTTP ${response.status}`);
  }

  const source = Buffer.from(await response.arrayBuffer());
  const artwork = await sharp(source)
    .resize(innerWidth, innerHeight, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();

  const roundedMask = Buffer.from(`
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" rx="${CARD_RADIUS}" fill="#fff" />
    </svg>
  `);

  const overlays: SharpOverlay[] = [
    { input: artwork, left: borderWidth, top: borderWidth },
  ];

  if (meta.borderStyle === 'holographic') {
    overlays.push({ input: createHolographicFrame(borderWidth), left: 0, top: 0 });
  }

  overlays.push({ input: roundedMask, left: 0, top: 0, blend: 'dest-in' });

  return sharp({
    create: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      channels: 4,
      background: meta.color,
    },
  })
    .composite(overlays)
    .png()
    .toBuffer();
}

function createHolographicFrame(borderWidth: number): Buffer {
  const innerWidth = CARD_WIDTH - borderWidth * 2;
  const innerHeight = CARD_HEIGHT - borderWidth * 2;
  const innerRadius = Math.max(4, CARD_RADIUS - borderWidth / 2);

  return Buffer.from(`
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="holo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#22d3ee" />
          <stop offset="18%" stop-color="#818cf8" />
          <stop offset="38%" stop-color="#f472b6" />
          <stop offset="58%" stop-color="#fde047" />
          <stop offset="78%" stop-color="#34d399" />
          <stop offset="100%" stop-color="#c084fc" />
        </linearGradient>
        <mask id="frame-mask">
          <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" rx="${CARD_RADIUS}" fill="white" />
          <rect x="${borderWidth}" y="${borderWidth}" width="${innerWidth}" height="${innerHeight}"
            rx="${innerRadius}" fill="black" />
        </mask>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g mask="url(#frame-mask)">
        <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="url(#holo)" />
        <path d="M-130 470 L250 -30 M40 650 L420 150" stroke="white"
          stroke-width="24" stroke-opacity="0.28" />
        <g fill="white" filter="url(#glow)">
          <circle cx="18" cy="92" r="2.7" />
          <circle cx="343" cy="142" r="2.1" />
          <circle cx="14" cy="318" r="2" />
          <circle cx="346" cy="402" r="3" />
          <circle cx="92" cy="588" r="2.3" />
          <circle cx="276" cy="13" r="2.4" />
        </g>
      </g>

      <rect x="${borderWidth - 1}" y="${borderWidth - 1}"
        width="${innerWidth + 2}" height="${innerHeight + 2}" rx="${innerRadius}"
        fill="none" stroke="white" stroke-opacity="0.72" stroke-width="2" />
    </svg>
  `);
}
