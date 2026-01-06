import { prisma } from '@/lib/prisma';

export async function filterStopWords(query: string): Promise<string> {
  if (!query || query.trim() === '') return '';

  const stopWords = await prisma.stopWord.findMany();
  const stopWordsSet = new Set(stopWords.map((sw) => sw.value));

  const filteredWords = query
    .split(/\s+/)
    .filter((word) => word.trim() !== '' && !stopWordsSet.has(word));

  if (filteredWords.length === 0) {
    return '$$NO_MATCH_RESULT$$';
  }

  return filteredWords.join(' ');
}
