export type ReadinessLevelKey = 'mature' | 'enabled' | 'ready' | 'aware' | 'unready';

export const getRecommendationKey = (score: number): ReadinessLevelKey => {
  if (score > 4.5) return 'mature';
  if (score > 3.5) return 'enabled';
  if (score > 2.5) return 'ready';
  if (score > 1.5) return 'aware';
  return 'unready';
};

export const getRecommendation = (score: number, texts?: any) => {
  const key = getRecommendationKey(score);
  return texts?.[key] || { title: 'Strategic Advisory', desc: '...', shortDesc: '...' };
};

