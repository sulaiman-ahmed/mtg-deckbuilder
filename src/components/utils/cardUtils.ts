import axios from 'axios';
import { Card, ScryfallResponse } from '../types';

export const fetchCards = async (searchQuery: string, page: number = 1): Promise<ScryfallResponse> => {
  try {
    const response = await axios.get<ScryfallResponse>(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(searchQuery)} -is:arena&page=${page}`
    );

    const nonDigitalCards = response.data.data.filter((card: any) => !card.digital);
    const formattedCards = nonDigitalCards.map(card => ({
        name: card.name,
        imageUrl: card.card_faces 
          ? card.card_faces.map((face: { image_uris: { normal: any; small: any; }; }) => face.image_uris?.normal || face.image_uris?.small || '') 
          : [card.image_uris?.normal || card.image_uris?.small || ''],
        details: card,
        count: 1,
        colors: card.color_identity,
        cmc: card.cmc,
      }));
    return { ...response.data, data: formattedCards };
  } catch (error) {
    console.error('Error fetching cards:', error);
    return { data: [], has_more: false };
  }
};

export const processImportText = async (importText: string): Promise<Card[]> => {
  const lines = importText.split('\n').filter(line => line.trim().length > 0);
  const newCards = lines.map(line => {
    const [count, ...nameParts] = line.trim().split(' ');
    const name = nameParts.join(' ');
    return { name, count: parseInt(count, 10) };
  });

  const fetchedCards = await Promise.all(newCards.map(async ({ name, count }) => {
    try {
      const response = await axios.get(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}`);
      const card = response.data;
      return {
        name: card.name,
        imageUrl: card.card_faces ? card.card_faces.map((face: any) => face.image_uris?.normal || face.image_uris?.small || '') : [card.image_uris?.normal] || [card.image_uris?.small] || [],
        details: card,
        count,
        colors: card.color_identity,
        cmc: card.cmc,
      };
    } catch (error) {
      console.error(`Error fetching card ${name}:`, error);
      return null;
    }
  }));

  return fetchedCards.filter(card => card !== null) as Card[];
};
