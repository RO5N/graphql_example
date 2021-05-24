import express, { Router } from 'express';
import passport from 'passport';
import graphqlHTTP from '../graphql/Bike';

const router = Router();
router.use(passport.initialize());

export default express.Router().get('/', passport.authenticate('bearer', { session: false }), graphqlHTTP);
