import { ImportedList } from '../entities/ImportedList';
import { ImportedListRepoInterface } from './ImportedListRepoInterface';

export class ImportedListRepo_Impl implements ImportedListRepoInterface {
    async getList(id: string): Promise<ImportedList | null> {
        const response = await fetch(`/api/imports/${id}`).then((r) =>
            r.json()
        );
        return response ?? null;
    }
}
