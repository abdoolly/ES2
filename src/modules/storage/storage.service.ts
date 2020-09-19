import { validate, cleanAttributes } from 'validate.js';
import { Encryptor } from '../../services/Encryption';

export const isValidStoreData = (body: any) => {
    const constraints = {
        id: {
            presence: {
                allowEmpty: false,
                message: `^id field is required`
            },
        },
        encryption_key: {
            presence: {
                message: `^encryption_key is required`
            }
        },
        value: {
            presence: {
                allowEmpty: false,
                message: `^value field is required`
            },
            type: {
                type: (value: any) => typeof value === 'object',
                message: `^value field must be a JSON object`
            }
        }
    };

    let validator = validate(body, constraints, {
        fullMessages: true,
        format: 'grouped',
    });

    return {
        isValid: validator === undefined,
        attributes: cleanAttributes(body, constraints)
    };
};

export const toEncryptionKey = (encKey: string, identifier: string) => {
    return `${encKey}${identifier}`;
};

export const decryptKey = (encKey: string) => Encryptor.decrypt(Encryptor.internalKey, encKey);

export const constructStorageObject = ({ id, encryption_key, value }: any) => {
    encryption_key = toEncryptionKey(encryption_key, id);
    let data = getDataEncrypted(value, encryption_key);
    return {
        identifier: id,
        encryption_key: Encryptor.encrypt(Encryptor.internalKey, encryption_key),
        data,
    }
};

export const getDataEncrypted = (value: any, encKey: string) => {
    return Encryptor.encrypt(encKey, JSON.stringify(value));
};
