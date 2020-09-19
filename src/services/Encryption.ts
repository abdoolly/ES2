import * as aes256 from 'aes256';

/**
 * @description a service class which is used to encrypt and decrypt data
 */
class Encryption {
    /**
     * a key that is used to encrypt the internal data like the user keys themselves
     */
    public internalKey: string = process.env.secretKey as string;

    encrypt(key: string, message: string) {
        return aes256.encrypt(key, message);
    }

    decrypt(key: string, encryptedMsg: string) {
        return aes256.decrypt(key, encryptedMsg);
    }
}

export const Encryptor = new Encryption();