import * as storageService from '../../modules/storage/storage.service';
import { constructStorageObject, getDataEncrypted, getDecryptedData, toEncryptionKey } from '../../modules/storage/storage.service';
import { Encryptor } from '../../services/Encryption';


describe('Test storage.service', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('toEncryptionKey should concatenate identifier and key', () => {
        expect(toEncryptionKey('test_key', 'myid')).toEqual(`test_keymyid`);
    });

    it('getDataEncrypted should encrypt any given json data and return a string', () => {
        jest.spyOn(Encryptor, 'encrypt').mockImplementationOnce((key, value) => {
            expect(key).toEqual('123');
            return 'getDataEncrypted_encrypted_data'
        });
        let data = getDataEncrypted({ value: 1 }, '123');
        expect(data).toEqual('getDataEncrypted_encrypted_data');
    });

    it('constructStorageObject should create an object with an encrypted key and encrypted data', () => {
        jest.spyOn(Encryptor, 'encrypt').mockImplementationOnce((key, value) => {
            expect(key).toEqual('123-amsdka');
            return 'encrypted_data'
        });
        jest.spyOn(Encryptor, 'encrypt').mockImplementationOnce(() => 'encrypted_key');

        let body = {
            "id": "-amsdka",
            "encryption_key": "123",
            "value": {
                "hello": 1,
                "data": null,
                "boolme": true,
                "stringme": "LOL"
            }
        };
        let result = constructStorageObject(body);
        expect(result.identifier).toEqual(body.id);
        expect(result.encryption_key).toEqual('encrypted_key');
        expect(result.data).toEqual('encrypted_data');
    });

    it('getDecryptedData should return empty array if no items given', () => {
        let data = getDecryptedData([], '123');
        expect(data).toEqual([]);
    });

    it('getDecryptedData should return empty array and log if the data key and user key are not equal', () => {
        jest.spyOn(Encryptor, 'decrypt').mockImplementationOnce(() => 'balbla');
        jest.spyOn(Encryptor, 'decrypt').mockImplementationOnce(() => ({ 'data_decrypted': 1 }));
        jest.spyOn(console, 'log').mockImplementationOnce((msg) => {
            expect(msg).toEqual('user entered invalid decryption key for identifier "id-1"')
        });

        let items: any[] = [
            {
                identifier: 'id-1',
                encryption_key: '321',
                data: 'data_encrypted_message'
            }
        ];
        let data = getDecryptedData(items, '123');
        expect(data).toEqual([]);
    });

    it('getDecryptedData should return the final data array which contains the data decrypted and their identifiers', () => {
        jest.spyOn(Encryptor, 'decrypt').mockImplementationOnce((key, value) => '123id-1');
        jest.spyOn(Encryptor, 'decrypt').mockImplementationOnce(() => JSON.stringify({ value: 1 }));
        let items: any[] = [
            {
                identifier: 'id-1',
                encryption_key: '123id-1',
                data: 'data_encrypted_message'
            }
        ];
        let data = getDecryptedData(items, '123');
        expect(data[0]).toEqual({
            id: 'id-1',
            value: { value: 1 }
        });
    });

    it('getDecryptedData should return empty array and log the error in case of any error happening inside it', () => {
        let testError = new Error('testerror');
        jest.spyOn(global.console, 'error').mockImplementation(jest.fn());
        jest.spyOn(storageService, 'toEncryptionKey')
            .mockImplementationOnce(() => { throw testError });


        let items: any[] = [
            {
                identifier: 'id-1',
                encryption_key: '123id-1',
                data: 'data_encrypted_message'
            }
        ];
        let data = getDecryptedData(items, '123');
        expect(data).toEqual([]);
        expect(console.error).toBeCalledWith(testError);
    });

});