import app from '../../app';
import supertest from 'supertest';
const request = supertest(app);
import * as storageService from '../../modules/storage/storage.service';
import * as models from '../../models/Storage';


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
        jest.mock('../../modules/storage/storage.service');
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
});
