import app from '../../app';
import supertest from 'supertest';
const request = supertest(app);
import * as storageService from '../../modules/storage/storage.service';
import * as models from '../../models/Storage';
import * as validators from '../../modules/storage/storage.validators';


describe('Storage /store', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('items securly in db', async () => {
        let returnObject = {
            save: () => new Promise((resolve) => resolve('saved')),
            fetch: () => new Promise((resolve) => resolve(null)),
            where: () => returnObject,
        };
        jest.spyOn(models, 'Storage').mockImplementation(() => returnObject as any);
        jest.spyOn(storageService, 'constructStorageObject');

        const res = await request.post('/store')
            .set('Accept', 'application/json')
            .send({
                "id": "data-1",
                "encryption_key": "test_enc_key",
                "value": {
                    "hello": 1,
                    "data": null,
                    "boolme": true,
                    "stringme": "test_string"
                }
            });

        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
            "message": "Data stored successfully"
        });
        expect(storageService.constructStorageObject).toBeCalledWith({
            "id": "data-1",
            "encryption_key": "test_enc_key",
            "value": {
                "hello": 1,
                "data": null,
                "boolme": true,
                "stringme": "test_string"
            }
        });
    });

    it('items should be updated in case the key already exists', async () => {
        let returnObject = {
            save: () => new Promise((resolve) => resolve('saved')),
            fetch: () => new Promise((resolve) => resolve({
                serialize: () => ({})
            })),
            where: () => returnObject,
        };

        jest.spyOn(storageService, 'decryptKey').mockReturnValue('testkey');
        jest.spyOn(storageService, 'toEncryptionKey').mockReturnValue('testkey');
        jest.spyOn(models, 'Storage').mockImplementation(() => returnObject as any);
        const res = await request.post('/store')
            .set('Accept', 'application/json')
            .send({
                "id": "data-1",
                "encryption_key": "test_enc_key",
                "value": {
                    "hello": 1,
                    "data": null,
                    "boolme": true,
                    "stringme": "test_string"
                }
            });

        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
            "message": "Data stored successfully"
        });
    });

    it('return status 422 if invalid data', async () => {
        const res = await request.post('/store')
            .set('Accept', 'application/json')
            .send({
                "id": 1,
                "encryption_key": "test_enc_key",
                "value": {
                    "hello": 1,
                    "data": null,
                    "boolme": true,
                    "stringme": "test_string"
                }
            });

        expect(res.status).toEqual(422);
    });

    it('should return status 400 if the user key and the data key does not match', async () => {
        let returnObject = {
            save: () => new Promise((resolve) => resolve('saved')),
            fetch: () => new Promise((resolve) => resolve({
                serialize: () => ({})
            })),
            where: () => returnObject,
        };

        jest.spyOn(storageService, 'decryptKey').mockReturnValue('testkey1');
        jest.spyOn(storageService, 'toEncryptionKey').mockReturnValue('testkey2');
        jest.spyOn(global.console, 'error').mockImplementationOnce(jest.fn());
        jest.spyOn(models, 'Storage').mockImplementation(() => returnObject as any);
        const res = await request.post('/store')
            .set('Accept', 'application/json')
            .send({
                "id": "data-1",
                "encryption_key": "test_enc_key",
                "value": {
                    "hello": 1,
                    "data": null,
                    "boolme": true,
                    "stringme": "test_string"
                }
            });

        expect(res.status).toEqual(400);
        expect(res.body).toEqual({ message: 'Could not store your data' });
        expect(console.error).toBeCalledWith('user key and already existing data key do not match');
    });

    it('any error should be handled gracefully', async () => {
        let err = new Error('testError');
        jest.spyOn(validators, 'isValidStoreData').mockImplementationOnce(() => { throw err });
        jest.spyOn(global.console, 'error').mockImplementationOnce(jest.fn());
        const res = await request.post('/store')
            .set('Accept', 'application/json')
            .send({
                "id": 1,
                "encryption_key": "test_enc_key",
                "value": {
                    "hello": 1,
                    "data": null,
                    "boolme": true,
                    "stringme": "test_string"
                }
            });

        expect(res.status).toEqual(400);
        expect(console.error).toBeCalledWith(err);
    });
});

describe('Storage /retrieve', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('retrieve items in db by wild card', async () => {
        let returnObject = {
            query: () => returnObject,
            whereRaw: () => new Promise((resolve) => resolve([{}]))
        };
        jest.spyOn(models, 'Storage').mockImplementation(() => returnObject as any);
        jest.spyOn(storageService, 'getDecryptedData').mockReturnValue([{ id: '1', value: 'test' }]);
        const res = await request.post('/retrieve')
            .set('Accept', 'application/json')
            .send({
                "id": "data-*",
                "decryption_key": "test_dec_key"
            });

        expect(res.status).toEqual(200);
        expect(res.body).toEqual([{ id: '1', value: 'test' }]);
    });

    it('retrieve items in db using exact identifier', async () => {
        let returnObject = {
            save: () => new Promise((resolve) => resolve('saved')),
            fetchAll: () => new Promise((resolve) => resolve({
                serialize: () => ([{}])
            })),
            where: () => returnObject,
        };
        jest.spyOn(models, 'Storage').mockImplementation(() => returnObject as any);
        jest.spyOn(storageService, 'getDecryptedData').mockReturnValue([{ id: '1', value: 'test' }]);
        const res = await request.post('/retrieve')
            .set('Accept', 'application/json')
            .send({
                "id": "data-1",
                "decryption_key": "test_dec_key"
            });

        expect(res.status).toEqual(200);
        expect(res.body).toEqual([{ id: '1', value: 'test' }]);
    });

    it('should return empty array of no results found', async () => {
        let returnObject = {
            save: () => new Promise((resolve) => resolve('saved')),
            fetchAll: () => new Promise((resolve) => resolve({
                serialize: () => ([])
            })),
            where: () => returnObject,
        };
        jest.spyOn(models, 'Storage').mockImplementation(() => returnObject as any);
        const res = await request.post('/retrieve')
            .set('Accept', 'application/json')
            .send({
                "id": "data-1",
                "decryption_key": "test_dec_key"
            });

        expect(res.status).toEqual(200);
        expect(res.body).toEqual([]);
    });

    it('return status 422 if invalid data', async () => {
        const res = await request.post('/retrieve')
            .set('Accept', 'application/json')
            .send({
                "id": 1,
                "decryption_key": 1,
            });

        expect(res.status).toEqual(422);
    });

    it('any error should be handled gracefully', async () => {
        let err = new Error('testError');
        jest.spyOn(validators, 'isValidRetrieveData').mockImplementationOnce(() => { throw err });
        jest.spyOn(global.console, 'error').mockImplementationOnce(jest.fn());
        const res = await request.post('/retrieve')
            .set('Accept', 'application/json')
            .send({
                "id": "1",
                "decryption_key": "123",
            });

        expect(res.status).toEqual(400);
        expect(console.error).toBeCalledWith(err);
    });

});
