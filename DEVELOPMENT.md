## Stack

- [React](https://reactjs.org/)
- [Ant Design](https://ant.design/)
- [Node.js](https://nodejs.org/)
- [Fastify](https://www.fastify.io/)
- [LangChain](https://langchain.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Rspack](https://rspack.dev)
- [@waylaidwanderer/fastify-sse-v2](https://github.com/waylaidwanderer/fastify-sse-v2) (Server-Sent Events)

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Yarn](https://yarnpkg.com/)
- [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

### Structure and Setup

The project contains two main parts:

- `app/` - Monorepo packages for frontend
  - `script/` - Repo to generate `<script>` tag for client
  - `ui/` - The admin dashboard
  - `widget/` - The chat widget to embed in website
- `server/` - API Server and database

To set up the project for development, you need to:

- Clone the repo
- Install dependencies
- Configure environment variables
- Build all the frontend packages
- Start the server

### Configure Infrastructure

#### PostgreSQL

You can run PostgreSQL locally or use a cloud service, but this project requires a PostgreSQL with pgvector installed. I
personally recommend to use [Docker](https://www.docker.com/) to spin up a instance:

```bash
docker run -d --name pgvector -p 5432:5432 ankane/pgvector:latest
```

Checkout the [pgvector docs](https://github.com/pgvector/pgvector) for more information.
Once you have a PostgreSQL instance, you need to create a database and a user for the project:
I use Prisma as ORM for this project, so you can cd to the /server directory and run:

```bash
npx prisma migrate deploy
```

to create the database and tables. Of course this is a one-time command, so don't run it again unless you want to reset
the database.

#### Redis

You can run Redis locally or use a cloud service.
If you want to run Redis locally, I also recommend using [Docker](https://www.docker.com/) or you can use local
redis-server as well, for example, with macOS, you can install it with [Homebrew](https://brew.sh/):

```bash
brew install redis
```

Checkout the [Redis docs](https://redis.io/topics/quickstart) for more information.

### Steps to Start Development

Once you've set up the infrastructure, you can follow these steps to start development:

1. Rename `.env.example` to `.env` `at app/ui`, `app/widget` and `server/` directory.
2. Configure the environment variables in `.env` files. The ones inside the `app/` can still be the same unless you want
   to change the port of the server. For the server:

- `DATABASE_URL` - The URL to connect to the PostgreSQL database. For
  example, `postgresql://postgres:postgres@localhost:5432/postgres`
- `DB_REDIS_URL` - The URL to connect to the Redis server. For example, `redis://localhost:6379`
- `OPENAI_API_KEY` - The API key for OpenAI.
- `DB_SECRET_KEY` - The random string to encrypt the database.

3. Run `pnpm i` in the main directory to install dependencies for the monorepo.
4. Run `yarn` in the `server/` directory to install dependencies for the server.
5. Run `pnpm build` at the main directory to build all the frontend packages.
6. Run `yarn build` at the `server/` directory to build the server.
7. Move all the frontend assets to the server directory:

- `mv app/ui/dist/ server/dist/public`
- `cp -r app/widget/dist/assets/* server/dist/public/assets`
- `mv app/widget/dist/index.html server/dist/public/bot.html`
- `mv app/script/dist/chat.min.js server/dist/public/chat.min.js`

8. Run `pnpm dev` in the main directory and `yarn dev` at the `server/` directory to start the server.
   Now you should be able to access the frontend at `localhost:5173` and the backend API at `localhost:3000`. As you
   make code changes, the servers will reload and reflect the updates. But if you make changes to the widget, you will
   need to run the asset copy command again to update the widget assets in the backend.
