export interface CardData {
    name?: string;
    imageUrl?: string;
    colors?: string[];
}

export interface DeckListProps {
    cards: CardData[]
    onRemoveCard: (index: number) => void;
}