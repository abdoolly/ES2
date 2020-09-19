import { Encryptor } from '../../services/Encryption';
import { StorageType } from '../../types/models/storage.type';

/**
 * @description a function to make the encryption key from the users datas
 * @param encKey 
 * @param identifier 
 */
export const toEncryptionKey = (encKey: string, identifier: string) => {
    return `${encKey}${identifier}`;
};

/**
 * @description takes a key then decrypt it using the system internal key 
 * @param encKey 
 */
export const decryptKey = (encKey: string) => Encryptor.decrypt(Encryptor.internalKey, encKey);

/**
 * @description a function to take the store data and construct the store data object 
 * mainly by constructing the encryption key then encrypt the data 
 * and at last the encrypted key and the encrypted data
 * @param param0 
 */
export const constructStorageObject = ({ id, encryption_key, value }: any) => {
    encryption_key = toEncryptionKey(encryption_key, id);
    let data = getDataEncrypted(value, encryption_key);
    return {
        identifier: id,
        encryption_key: Encryptor.encrypt(Encryptor.internalKey, encryption_key),
        data,
    }
};

/**
 * @description function that receives the value data and encryption key 
 * to encrpyt the data
 * @param value 
 * @param encKey 
 */
export const getDataEncrypted = (value: any, encKey: string) => {
    return Encryptor.encrypt(encKey, JSON.stringify(value));
};


/**
 * @description take the result items and the user decryption key 
 * to make sure the user key is correct and to decrypt the data the user needs
 * @param items 
 * @param userDecKey 
 */
export const getDecryptedData = (items: StorageType[], userDecKey: string) => {
    try {
        let finalData: { identifier: string, value: any }[] = [];

        for (let item of items) {
            let userFinalDecKey = toEncryptionKey(userDecKey, item.identifier);
            let itemDecKeyDecrypted = decryptKey(item.encryption_key);

            if (userFinalDecKey !== itemDecKeyDecrypted) {
                console.log(`user entered invalid decryption key for identifier "${item.identifier}"`);
                return [];
            }

            // decrypting the data 
            let dataDecrypted = Encryptor.decrypt(itemDecKeyDecrypted, item.data);

            // pushing it in the final array
            finalData.push({
                identifier: item.identifier,
                value: JSON.parse(dataDecrypted)
            });
        }

        return finalData;
    } catch (err) {
        console.error(err);
        return [];
    }
};