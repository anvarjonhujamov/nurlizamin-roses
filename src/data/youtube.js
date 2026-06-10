/**
 * YouTube video IDs (the part after watch?v= or youtu.be/)
 * Override via NEXT_PUBLIC_YOUTUBE_* env vars in .env
 */
export const YOUTUBE_VIDEOS = [
  {
    id: process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_1 || '3SPI59Hr75w',
    title: 'Nurli Zamin',
  },
  {
    id: process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_2 || '2BAMpKAmV-Y',
    title: 'Nurli Zamin',
  },
];

export const YOUTUBE_SHORTS = [
  {
    id: process.env.NEXT_PUBLIC_YOUTUBE_SHORT_1 || '-5wrGaGUtxQ',
    title: 'Nurli Zamin Short',
  },
  {
    id: process.env.NEXT_PUBLIC_YOUTUBE_SHORT_2 || 'pSsyCNmp8PQ',
    title: 'Nurli Zamin Short',
  },
  {
    id: process.env.NEXT_PUBLIC_YOUTUBE_SHORT_3 || 'C2MKs0nh6nY',
    title: 'Nurli Zamin Short',
  },
];

export const YOUTUBE_CHANNEL_URL =
  process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_URL || '';
