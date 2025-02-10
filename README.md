## Blop
A Discord bot made with discord.js

![GitHub package.json version](https://img.shields.io/github/package-json/v/dankerow/blop)
![GitHub License](https://img.shields.io/github/license/dankerow/blop)


## Setup

Make sure to install the dependencies:

```bash
# pnpm (default)
pnpm install
# yarn
yarn install
# npm
npm install
```

Rename the `.env.example` file to `.env` in the root directory and update the values:

```env
DISCORD_CLIENT_TOKEN=your_discord_bot_token

DATABASE_URL=your_database_url # e.g. postgres://user:password@localhost:5432/database
```

### Database

Set up a [PostgreSQL](https://www.postgresql.org/) database and update the `DATABASE_URL` in the `.env` file.

```env
DATABASE_URL=your_database_url # e.g. postgres://user:password@localhost:5432/database
```

The bot uses [Prisma](https://www.prisma.io/) to interact with the database. To set up the database, run the following command:

```bash
prisma generate
```

To apply the migrations, run:

```bash
prisma migrate
```

To generate the Prisma client, run:

```bash
prisma generate
```

For more information, check the [Prisma documentation](https://www.prisma.io/docs/).

## Running

```bash
pnpm start
```

## Commands

> The bot works with command modules that can be enabled and disabled. To manage them, consult modules menu via the command `/modules`.

*   To get more details about how to use commands, do `/help <command>`.
*   `<>` means required command parameter.
*   `[]` means optional command parameter.

> **Note**: The image generation commands require the [RawGO API](https://github.com/dankerow/rawgo-api) to be deployed.
> 
> Clone the repository and follow the instructions in the [README](https://github.com/dankerow/rawgo-api/blob/main/README.md) to set it up.
> Once the API is running, update the field `apis.rawgo.baseUrl` in the `config` file with the API URL.
