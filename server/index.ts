import next from 'next';
import express from 'express';
import compression from 'compression';
import bodyParser, { json, urlencoded } from 'body-parser';
import path from 'path';
import passport from 'passport';
import cors from 'cors';
import { parse } from 'url';
import ping from './routes/ping';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

(async () => {
  await app.prepare();
  const server = express();

  // Express config
  server.set('port', process.env.PORT || 3000);
  server.use(cors());
  server.use(compression());
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(passport.initialize());
  server.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

  // Serve static and next
  server.use('/static', express.static('static'));
  server.get('/_next/*', (req, res) => handle(req, res));

  server.use(json());
  server.use(urlencoded({ extended: true }));

  //API Routes
  server.use('/api/ping', ping);

  //page routes
  server.get('/', (req, res) => {
    const parsedUrl = parse(req.url!, true);
    return handle(req, res, parsedUrl);
  });

  server.get('/:page/:id?', (req, res) => {
    const parsedUrl = parse(req.url!, true);
    return handle(req, res, parsedUrl);
  });

  await server.listen(server.get('port'), () => {
    // Start Express server
    console.log('  App is running at http://localhost:%d in %s mode', server.get('port'), server.get('env'));
    console.log('  Press CTRL-C to stop\n');
  });
})();
