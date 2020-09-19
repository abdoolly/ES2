import { DB } from "../config/db";
import { StorageType } from "../types/models/storage.type";
import { ModelOptions } from "bookshelf";

const model = DB.model('Storage', {
    tableName: 'storage',
});

export const Storage = (attributes?: any, options?: ModelOptions) => {
    return new model<StorageType>(attributes, options);
}