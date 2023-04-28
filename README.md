### With docker (& docker compose)

1. Install the dependencies:

    `npm install`

2. Build the apps

    `npm run build`

3. Run in docker

    `docker compose -f docker-compose.yml up`

The web container is available on standard http port, the graphql endpoint is accessible on port `3000`;

You can seed initial data by accessing `localhost:3000/seed`

In production we can run both of them behind a proxy or some cloud provider and not need cors or different ports.

### Your own sql instance

1. Install the dependencies

    `npm install`

2. Configure your mysql connection details in the `.env` file. There's a predefined docker.mysql.yml that you can use with docker compose that should work out of the box

3. Run it:

    `npm run start`

The dev web server is available on port `4200`, the graphql endpoint is accessible on port `3000`;

You can seed initial data by accessing `localhost:3000/seed`