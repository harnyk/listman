export interface TreeItem {
    id: string;
    parentId: string | null;
    title: string;
    createdAt: Date;
    checked: boolean;
}
