describe('Storage /store', () => {
    it('items securly in db', async () => { });

    it('items should be updated in case the key already exists')
});

describe('Storage /retrieve', () => {
    it('retrieve items in db by exact identifier', async () => { });

    it('retrieve items in db using wild card identifier', async () => { });

    it('return empty array of decryption key was not the right key', async () => { });

    it('should return empty array in case user key and data key does not match in any of the results');

    it('should retrieve data as they were originally stored', () => { });
});


describe('Storage service', () => {
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
    });
});