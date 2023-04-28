import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:3000/graphql',
  documents: ['apps/virta-api/src/**/*.ts', 'apps/virta-api/src/**/*.tsx)'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    'apps/virta-web/src/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
