import { Router } from 'express';
import '../config/passport';
import passport from 'passport';
import jwt, { SignOptions } from 'jsonwebtoken';
import { NextFunction } from 'express';
import { JWT_SECRET } from '../util/secrets';
import express from 'express';

const router = Router();
router.use(passport.initialize());

const jwtOptions: SignOptions = {
  // JWT signing options for the sessionless login tokens
  issuer: 'ro5n',
  audience: 'ro5n',
  expiresIn: '7 days',
};

//export default router;
export default express.Router().post('/login', (req, res, next: NextFunction) => {
  if (req.body.email && req.body.password) {
    passport.authenticate('local', { session: false }, (err, payload, info) => {
      if (err) return next(err);
      if (!payload) return res.status(401).send({ errors: [info.message] });
      return res.status(200).send({
        token: jwt.sign(payload, JWT_SECRET, jwtOptions),
      });
    })(req, res, next);
  } else {
    res.status(400).json({ message: 'Invalid Payload' });
    return;
  }
});
