import { Router, Request, Response } from 'express';
import { Storage } from '../../models/Storage';
import { Knex } from '../../config/db';
const router = Router();

router.get('/', (req, res) => res.send({ hello: 'world' }));

/**
 * @description encrypt data
 */
router.post('/encrypt', async (req: Request, res: Response) => {
    // Knex('storage').whereRaw('');
    return res.send({ 'home': 'Hello world' });
});

/**
 * @description decrypt and query data
 */
router.post('/decrypt', (req: Request, res: Response) => {
    return res.send({ 'home': 'Hello world' });
});

export default router;
