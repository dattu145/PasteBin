import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { getNow, generateId } from '../lib/utils';
import { getPasteAndIncrement } from '../lib/pastes';

const router = Router();

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string };
        const testHeader = req.headers['x-test-now-ms'];
        const nowHeaderVal = Array.isArray(testHeader) ? testHeader[0] : testHeader;
        const now = getNow(nowHeaderVal as string | undefined);

        const result = await getPasteAndIncrement(id, now);

        if (!result) {
            res.status(404).json({ error: 'Paste not found or expired' });
            return;
        }

        res.status(200).json(result);
    } catch (e: any) {
        console.error('Error fetching paste:', e);
        res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
});


router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { content, ttl_seconds, max_views } = req.body;

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            res.status(400).json({ error: 'Content is required' });
            return;
        }

        const testHeader = req.headers['x-test-now-ms'];

        const nowHeaderVal = Array.isArray(testHeader) ? testHeader[0] : testHeader;
        const now = getNow(nowHeaderVal as string | undefined);

        let expiresAt: string | null = null;
        if (ttl_seconds) {
            expiresAt = new Date(now.getTime() + ttl_seconds * 1000).toISOString();
        }

        const id = generateId();

        const { error } = await supabase
            .from('pastes')
            .insert([
                {
                    id,
                    content,
                    expires_at: expiresAt,
                    max_views: max_views,
                    current_views: 0
                }
            ])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            throw new Error(error.message);
        }

        const protocol = req.protocol;
        const host = req.get('host');
        const url = `${protocol}://${host}/p/${id}`;

        res.status(200).json({ id, url });

    } catch (e: any) {
        console.error('Error creating paste:', e);
        res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
});

export default router;
