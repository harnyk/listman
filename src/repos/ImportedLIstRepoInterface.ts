import { ImportedList } from '../entities/ImportedList';

export interface ImportedListRepoInterface {
    getList(id: string): Promise<ImportedList | null>;
}
