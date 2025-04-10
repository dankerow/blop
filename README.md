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

## Internationalization

Blop comes with built-in internationalization support powered by [i18next](https://www.i18next.com/). This allows the bot to respond in multiple languages, providing a localized experience for users worldwide.

### Features

- Multi-language command names and descriptions
- Automatic translation of command responses
- Support for user/server language preferences
- Guild preferred language can be changed using the `/language` command
- Discord's locale detection integration

### Adding Languages

Languages are configured in the bot's config file. To add a new language:

1. Add language definition to the `i18n.languages` array in the config
2. Create translation files in the `locales` directory
3. Restart the bot to load the new language

The bot automatically detects available translations and will present commands and responses in the user's preferred language when available.

## Commands

> The bot works with command modules that can be enabled and disabled. To manage them, consult modules menu via the command `/modules`.

*   To get more details about how to use commands, do `/help <command>`.
*   `<>` means required command parameter.
*   `[]` means optional command parameter.

> **Note**: The image generation commands require the [RawGO API](https://github.com/dankerow/rawgo-api) to be deployed.
> 
> Clone the repository and follow the instructions in the [README](https://github.com/dankerow/rawgo-api/blob/main/README.md) to set it up.
> Once the API is running, update the field `apis.rawgo.baseUrl` in the `config` file with the API URL.
