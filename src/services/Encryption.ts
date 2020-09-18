/**
 * @description a service class which is used to encrypt and decrypt data
 */
class Encryption {

    /**
     * a key that is used to encrypt the internal data like the user keys themselves
     */
    private internalKey = process.env.secretKey;

    encrypt() {

    }

    decrypt() {

    }
}

export const Encryptor = new Encryption();