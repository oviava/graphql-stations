import express from 'express';
import { createHandler } from 'graphql-http/lib/use/http';
import ExpressPlayground from 'graphql-playground-middleware-express';
import cors from 'cors';

import { schema } from './graphql/schema';
import { createContext } from './context';
import { generateSeed } from './seed/seed';

const graphqlHandler = createHandler({
  schema,
  context: createContext,
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.set('trust proxy', true);
app.use(cors());

app.all('/graphql', graphqlHandler);

// this is just for testing the graphql api
app.get('/playground', ExpressPlayground({ endpoint: '/graphql' }));

// this is just for seeding the database
app.get('/seed', async (req, res) => {
  await generateSeed();
  res.send('Seed generated');
});

app.use((err, _req, res, _next) => {
  // we could perhaps use some logging service here
  console.error(err);

  // redirect to a pretty error page
  res.status(500).send('Internal server error');
});

app.listen(port, () => {
  console.log(`Server started`);
});
