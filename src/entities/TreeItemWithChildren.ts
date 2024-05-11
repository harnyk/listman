import { TreeItem } from './TreeItem';

export type TreeItemWithChildren = TreeItem & { children?: TreeItem[] };
