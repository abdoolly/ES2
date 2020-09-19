import { getValidationOutput, isValidRetrieveData, isValidStoreData } from '../../modules/storage/storage.validators';

describe('Test storage.validators', () => {
    it('store data identifier should pass the regex tests', () => {
        let regexData = [
            { test: '-amsdka', pass: true },
            { test: 'aksdmaksd-', pass: true },
            { test: 'askmd-,-_akdm', pass: true },
            { test: '-', pass: false },
            { test: '!@#$!', pass: false },
            { test: '1231-23', pass: true },
            { test: '1', pass: true },
            { test: '-,._', pass: false },
            { test: 'asda,asdasd,asdasdasd,asdasd,asd,asd,asd,asd', pass: true },
        ];

        for (let testCase of regexData) {
            let result = isValidStoreData({
                id: testCase.test,
                encryption_key: 'test_enc_key',
                value: { test: 'value' }
            });
            expect(result.isValid).toEqual(testCase.pass);
        }
    });

    it('retrieval data identifier should pass the regex tests', () => {
        let regexData = [
            { test: '*kas*dnjaksnjasd*', pass: true },
            { test: 'kamsdasd*', pass: true },
            { test: '*jasdnjasdasd', pass: true },
            { test: 'kamsd*amskd', pass: true },
            { test: '*kas*mdkasd_.-,*', pass: true },
            { test: '*', pass: false },
            { test: '***', pass: false },
            { test: '-_*-kamsd-,--,', pass: true },
            { test: '123', pass: true },
            { test: '1', pass: true },
            { test: '.', pass: false },
            { test: 'aksmda*kasd*asnd*asdasd*Asdasd*asd*Asd*Asd', pass: true },
            { test: '-,---*kmasd-*__', pass: true },
        ];

        for (let testCase of regexData) {
            let result = isValidRetrieveData({
                id: testCase.test,
                decryption_key: 'test_enc_key',
            });
            expect(result.isValid).toEqual(testCase.pass);
        }
    });

    it('store data and retrieval data should all be required and do not accept empty values', () => {
        let Sresult = isValidStoreData({});
        let Rresult = isValidRetrieveData({});


        expect(Sresult.errMsgs).toEqual({
            "id": [
                "id field is required"
            ],
            "encryption_key": [
                "encryption_key field is required"
            ],
            "value": [
                "value field is required"
            ]
        });

        expect(Rresult.errMsgs).toEqual({
            "id": [
                "id field is required"
            ],
            "decryption_key": [
                "decryption_key is required"
            ]
        });
    });

    it('store and retrieval data types should all be strings', () => {
        let Sresult = isValidStoreData({
            id: 1,
            encryption_key: 123123,
            value: { test: 1 }
        });
        let Rresult = isValidRetrieveData({
            id: 1,
            decryption_key: 23
        });

        expect(Sresult.errMsgs).toEqual({
            "id": [
                "Id must be of type string",
                "Id invalid identifier allowed symbols ('-' , ',' , '.' , '_') and alphanumeric"
            ],
            "encryption_key": [
                "Encryption key must be of type string"
            ]
        });

        expect(Rresult.errMsgs).toEqual({
            "id": [
                "Id must be of type string",
                "Id invalid identifier allowed symbols ('-' , ',' , '.' , '_') and alphanumeric"
            ],
            "decryption_key": [
                "Decryption key must be of type string"
            ]
        });
    });

    it('store value field should be of JSON type only and not empty', () => {
        let Sresult = isValidStoreData({
            id: '1',
            encryption_key: '123123',
            value: 'asmkd'
        });
        expect(Sresult.isValid).toBeFalsy();

        Sresult = isValidStoreData({
            id: '1',
            encryption_key: '123123',
            value: {}
        });
        expect(Sresult.isValid).toBeFalsy();

        Sresult = isValidStoreData({
            id: '1',
            encryption_key: '123123',
            value: []
        });
        expect(Sresult.isValid).toBeFalsy();

        Sresult = isValidStoreData({
            id: '1',
            encryption_key: '123123',
            value: { test: 1 }
        });
        expect(Sresult.isValid).toBeTruthy();
    });

    it('getValidationOutput should return only the attributes in the constraints', () => {
        const constraints = {
            test: { presence: true }
        };
        let { attributes } = getValidationOutput({ test: 1, test_2: 2, test_3: 3 }, constraints);
        expect(attributes).toEqual({ test: 1 });
    });
});