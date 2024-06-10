export interface Card {
  card_faces?: any;
  image_uris?: any;
  color_identity?: any;
  name: string;
  imageUrl: string[];
  details?: any;
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


export interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  importText: string;
  setImportText: (text: string) => void;
  onImportSubmit: () => void;
}

export interface AddMultipleModalProps {
  open: boolean;
  onClose: () => void;
  onAddMultipleSubmit: () => void;
  multipleCount: number;
  setMultipleCount: (count: number) => void;
}

export interface ScryfallResponse {
  data: Card[];
  has_more: boolean;
  next_page?: string;
}

// Hi Nooriya!