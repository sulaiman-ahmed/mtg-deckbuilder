export interface Card {
    name?: string;
    imageUrl?: string;
    colors?: string[];
}

export interface DeckListProps {
    cards: Card[]
    onRemoveCard: (index: number) => void;
}