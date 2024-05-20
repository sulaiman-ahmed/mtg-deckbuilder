export interface Card {
  name: string;
  imageUrl: string[];
  details?: CardInformation;
  count: number;
  cmc: number;
  colors: string[];
}

export interface CardInformation {
  id: string;
  name: string;
  mana_cost: string;
  cmc: number;
  type_line: string;
  oracle_text: string;
  power?: string;
  toughness?: string;
  colors: string[];
  color_identity: string[];
  legalities: { [format: string]: string };
  set: string;
  set_name: string;
}

export interface DeckListProps {
  totalCards: number;
  cards: Card[]
  onRemoveCard: (index: number) => void;
}