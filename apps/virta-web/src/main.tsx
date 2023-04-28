import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Client, Provider, cacheExchange, fetchExchange } from 'urql';

import App from './app/app';

const client = new Client({
  url: 'http://localhost:3000/graphql',
  exchanges: [cacheExchange, fetchExchange],
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </StrictMode>
);
