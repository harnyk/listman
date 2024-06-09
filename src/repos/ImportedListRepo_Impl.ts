import { ImportedList } from '../entities/ImportedList';
import { ImportedListRepoInterface } from './ImportedLIstRepoInterface';

export class ImportedListRepo_Impl implements ImportedListRepoInterface {
    async getList(id: string): Promise<ImportedList | null> {
        const response = await fetch(`/api/imports/${id}`).then((r) =>
            r.json()
        );
        return response ?? null;
    }
}
