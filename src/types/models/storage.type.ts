import { Model } from "bookshelf";

export interface StorageType extends Model<any> {
    id: number;
    identifier: string;
    encryption_key: string;
    data: string;
    created_at: Date;
    updated_at: Date;
};
export type StorageP = Promise<StorageType>;