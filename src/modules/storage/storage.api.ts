import { Request, Response, Router } from 'express';
import { Storage } from '../../models/Storage';
import { constructStorageObject, decryptKey, getDataEncrypted, isValidStoreData, toEncryptionKey } from './storage.service';
import { Knex } from '../../config/db';
const router = Router();

router.get('/', (req, res) => res.send({ hello: 'world' }));

/**
 * @description encrypt data
 */
router.post('/store', async (req: Request, res: Response) => {
    try {
        const { isValid, attributes } = isValidStoreData(req.body);
        // case there was a validation err
        if (!isValid) {
            return res.status(422).send(isValid);
        }

        // check if item exists 
        let item = await Storage({ identifier: attributes.id }).fetch({ require: false });

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
        return res.status(400).send({ message: 'Server error please try again later' });
    }
});

/**
 * @description decrypt and query data
 */
router.post('/retrieve', async (req: Request, res: Response) => {
    let body = req.body;

    // search for wild card
    // if found search by the like query
    // if not found then search normally 
    // then loop on the findings 
    // make sure decryption key match all results 
    // decrypt data and put it in a new array 
    // any non matching keys will result in stopping the whole operation and returning an empty array
    // in success case return the data decrypted to the user

    if (body.identifier.find()) {

    }

    let result = await Storage().query().whereRaw(`identifier LIKE ?`, ['%data%']);

    // let result = await Storage().where('identifier', 'like', `${body.id}%`).fetch({ require: false });
    // let two = await Knex.table('storage').whereRaw("identifier LIKE ?", ['data%']);

    return res.send(result);
});

export default router;
