import { ExtractJwt } from 'passport-jwt';
import passportLocal from 'passport-local';
import { JWT_SECRET } from '../util/secrets';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import passportAnonymous from 'passport-anonymous';

const JwtStrategy = passportJwt.Strategy;
const AnonymousStrategy = passportAnonymous.Strategy;

const LocalStrategy = passportLocal.Strategy;

passport.use(
  'local',
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    if (email === 'admin@admin.com' && password === '123') {
      const payload = {
        user: {
          email: email,
          role: 'ADMIN',
        },
      };
      return done(undefined, payload, { message: 'Logged in' });
    } else {
      return done(undefined, false, { message: 'Invalid email or password' });
    }
  }),
);

passport.use(
  'bearer',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    (jwtPayload, done) => {
      done(null, jwtPayload.user);
    },
  ),
);

passport.use('anonymous', new AnonymousStrategy());
