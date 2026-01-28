import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase.from('pastes').select('count').limit(1);

        if (error) {
            throw error;
        }

        res.status(200).json({ status: 'ok', database: 'connected' });
    } catch (e: any) {
        console.error('Health check failed:', e);
        res.status(503).json({ status: 'error', message: e.message });
    }
});

export default router;
