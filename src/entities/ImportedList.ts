import { ImportedListItem } from './ImportedListItem';

export interface ImportedList {
    ID: string;
    CreatedAt: string;
    Items: ImportedListItem[];
}
