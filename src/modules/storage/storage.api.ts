import { Router, Request, Response } from 'express';
const router = Router();

router.get('/', (req, res) => res.send({ hello: 'world' }));

/**
 * @description encrypt data
 */
router.post('/encrypt', (req: Request, res: Response) => {
    return res.send({ 'home': 'Hello world' });
});

/**
 * @description decrypt and query data
 */
router.post('/decrypt', (req: Request, res: Response) => {
    return res.send({ 'home': 'Hello world' });
});

export default router;
