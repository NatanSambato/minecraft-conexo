export interface Tile {
  id:      string
  label:   string
  groupId: number
}

export interface Group {
  id:          number
  correlation: string
  color:       string
  items:       string[]
}

export interface Puzzle {
  id: number
  date:   string
  author: string
  groups: Group[]
}

export type GameStatus = 'playing' | 'won'

export interface SavedProgress {
  status: GameStatus
  solvedGroups: Group[]
  attempts: number
  hintsUsed: number
  hintedGroups: Record<number, string[]>
  tileOrder: string[]
}

export interface RegistryEntry {
  image: string | null;
  pageUrl: string | null;
  translations: Record<string, string>;
  _notFound?: true;   // wiki page didn't exist — needs manual image
  _manual?: true;     // manually written entry — never overwrite on update
}
 
export interface RegistryMeta {
  builtAt?: string;
  updatedAt?: string;
  totalEntries: number;
  languages: string[];
  categories?: string[];
}
 
export interface Registry {
  _meta: RegistryMeta;
  [itemName: string]: RegistryEntry | RegistryMeta;
}

export interface RegistryRow {
  name: string;
  url: string | null;
  pt: string | null;
  es: string | null;
  image: string | null;
  _manual?: true;
}