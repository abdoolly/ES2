import { Request, Response, Router } from 'express';
import { Storage } from '../../models/Storage';
import { StorageType } from '../../types/models/storage.type';
import { constructStorageObject, decryptKey, getDataEncrypted, getDecryptedData, toEncryptionKey } from './storage.service';
import { isValidRetrieveData, isValidStoreData } from './storage.validators';
const router = Router();

router.get('/', (req, res) => res.send({ hello: 'world' }));

/**
 * @description store data securly
 */
router.post('/store', async (req: Request, res: Response) => {
    try {
        const { isValid, attributes, errMsgs } = isValidStoreData(req.body);
        // case there was a validation err
        if (!isValid) {
            return res.status(422).send(errMsgs);
        }

        // check if item exists 
        let item = await Storage().where({ identifier: attributes.id }).fetch({ require: false });

        // case this item is a new item then send the values and construct the object with all encryption logic
        if (!item) {
            await Storage(constructStorageObject(attributes)).save();
            return res.send({ message: 'Data stored successfully' });
        }

        // if it does then update the data value for that item
        item = item.serialize();

        // get the encryption key then decrypt it 
        let decryptedKey = decryptKey(item.encryption_key);

        // making the user key in it's final form
        let userKey = toEncryptionKey(attributes.encryption_key, item.identifier);
        if (decryptedKey !== userKey) {
            console.log('user key and already existing data key do not match');
            return res.status(400).send({ message: 'Could not store your data' });
        }

        // encrypt the new data using retrieved key 
        let data = getDataEncrypted(attributes.value, decryptedKey);

        // // update the data 
        await Storage({ id: item.id }).save({ data, updated_at: new Date() });
        return res.send({ message: 'Data stored successfully' });
    } catch (err) {
        console.error(err);
        return res.status(400).send({ message: 'Server error please try again later' });
    }
});

/**
 * @description decrypt data 
 */
router.post('/retrieve', async (req: Request, res: Response) => {
    try {
        let { isValid, attributes: attrs, errMsgs } = isValidRetrieveData(req.body);
        if (!isValid) {
            return res.status(422).send(errMsgs);
        }

        let queryResult: StorageType[] | null = null;
        let wildCardSplit: string[] = attrs.id.split('*');
        let hasWildCard = wildCardSplit.length > 1;

        // if there is a wildcard then handle getting the values using wild card
        if (hasWildCard) {
            queryResult = await Storage().query().whereRaw(`identifier LIKE ?`, [wildCardSplit.join('%')]);
        }

        // no wild card then get the data normally
        if (!hasWildCard) {
            queryResult = (await Storage().where({ identifier: attrs.id }).fetchAll({ require: false })).serialize();
        }

        if (queryResult === null || queryResult.length === 0) {
            return res.send([]);
        }

        const finalData = getDecryptedData(queryResult, attrs.decryption_key);
        return res.send(finalData);
    } catch (err) {
        console.error(err);
        return res.status(400).send({ message: 'Server error please try again later' });
    }
});

export default router;
