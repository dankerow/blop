## Blop
A Discord bot made with discord.js

![GitHub package.json version](https://img.shields.io/github/package-json/v/dankerow/blop)
![GitHub License](https://img.shields.io/github/license/dankerow/blop)


## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install
# npm
npm install
# pnpm (default)
pnpm install
```

Rename the `.env.example` file to `.env` in the root directory and update the values:

```env
DISCORD_CLIENT_TOKEN=your_discord_bot_token
```

## Running

```bash
# yarn
yarn start
# npm
npm start
# pnpm
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
