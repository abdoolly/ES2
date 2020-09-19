import { Encryptor } from '../services/Encryption';

describe('Encryptor', () => {
    it('Should encrypt and decrypt successfully', () => {
        let test_key = 'test_key';
        let test_msg = 'test_msg';
        let encrypted = Encryptor.encrypt(test_key, test_msg);
        expect(encrypted).toBeTruthy();

        let decrypted = Encryptor.decrypt('test_keyasd', encrypted);
        expect(decrypted).toEqual(test_msg);
    });
});