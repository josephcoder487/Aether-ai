import { NewsCategory, NewsNotification } from '../types';

const NEWS_TEMPLATES: Record<NewsCategory, { headlines: string[]; sources: string[] }> = {
  tech: {
    sources: ['Tech Pulse', 'Silicon Dispatch', 'NextGen Hardware', 'Cyber Wire', 'Digital Trends'],
    headlines: [
      'Breakthrough semiconductor process achieves 42% thermal efficiency leap in trial run',
      'Major open cloud framework releases ultra-fast neural inference runtime',
      'Satellite constellation initiates low-latency optical links across 18 regional hubs',
      'Next-generation solid-state battery architecture reaches commercial verification milestone',
      'Quantum coherence record surpassed in laboratory quantum-dot processor tests',
    ],
  },
  finance: {
    sources: ['Market Chronicle', 'Capital Wire', 'Global Trade Review', 'Financial Herald'],
    headlines: [
      'Global equity benchmark advances 1.6% driven by resilient enterprise manufacturing data',
      'Central banking consortium signals steady liquidity rates for upcoming quarter',
      'Renewable energy venture index tops year-to-date performance across European markets',
      'Semiconductor supplier consortium reports strong quarterly order backlog of 28%',
      'Sovereign green bond issuance reaches record subscription volume in Tokyo',
    ],
  },
  world: {
    sources: ['Global Dispatch', 'World Horizon', 'International Chronicle', 'Metro Courier'],
    headlines: [
      'High-speed continental rail link marks completion of vital alpine tunnel section',
      'International biodiversity convention finalizes cooperative ocean sanctuary treaty',
      'Clean desalinization facility powered entirely by solar grid begins regional water supply',
      'Metropolitan smart transit grid reduces peak commute congestion by 23% in 6 months',
      'Archeological excavation uncovers remarkably preserved Roman trading outpost',
    ],
  },
  sports: {
    sources: ['Sports Arena', 'The Athletic Wire', 'Championship Digest', 'Paddock News'],
    headlines: [
      'Stoppage-time curled strike seals dramatic comeback victory in cup quarter-final',
      'National sprint record lowered during thrilling dry-track season opener',
      'Tactical defensive masterclass steers underdogs into championship finals tournament',
      'Superbike manufacturer confirms bold aerodynamics package for upcoming grand prix',
      'Rookie point guard posts historic triple-double in high-stakes road victory',
    ],
  },
};

export function generateDisguisedNotification(
  contactId: string,
  contactName: string,
  realMessage: string,
  preferredCategory: NewsCategory = 'tech'
): NewsNotification {
  const categoryData = NEWS_TEMPLATES[preferredCategory] || NEWS_TEMPLATES.tech;
  const headlines = categoryData.headlines;
  const sources = categoryData.sources;

  const headline = headlines[Math.floor(Math.random() * headlines.length)];
  const source = sources[Math.floor(Math.random() * sources.length)];

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    contactId,
    contactName,
    category: preferredCategory,
    headline,
    source,
    timestamp: timeStr,
    realMessage: realMessage || 'Sent an attachment',
    createdAt: Date.now(),
  };
}
