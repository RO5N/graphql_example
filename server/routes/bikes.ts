import express, { Router } from 'express';
import passport from 'passport';
import { getBikes } from '../data/bikes';

const router = Router();
router.use(passport.initialize());

export default express
  .Router()
  .get('/', passport.authenticate('bearer', { session: false }), async (req: any, res: any, _next: any) => {
    if (req.user.role === 'ADMIN') {
      res.status(200).json({
        data: await getBikes(),
      });
    } else {
      return res.status(403).json({ error: 'Unauthorized' });
    }
  });
