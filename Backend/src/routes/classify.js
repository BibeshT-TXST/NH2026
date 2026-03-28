/**
 * routes/classify.js
 *
 * Mounts the /api/classify endpoint.
 */

import { Router } from 'express';
import { classifyReflection } from '../controllers/geminiController.js';

const router = Router();

// POST /api/classify
router.post('/', classifyReflection);

export default router;
