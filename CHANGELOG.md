# Changelog


## v0.2.1

[compare changes](https://github.com/dankerow/blop/compare/v0.2.0...v0.2.1)

### 🚀 Enhancements

- Implement command interaction cooldown (rate limit) ([#12](https://github.com/dankerow/blop/pull/12))
- Add possibility to disable commands ([1fc48a6](https://github.com/dankerow/blop/commit/1fc48a6))
- **commands:** Add help command ([260203c](https://github.com/dankerow/blop/commit/260203c))
- **commands:** Add avatar command ([777cb2f](https://github.com/dankerow/blop/commit/777cb2f))
- **utils:** Add trimArray function ([451268a](https://github.com/dankerow/blop/commit/451268a))
- **commands:** Add guild command ([fadfbac](https://github.com/dankerow/blop/commit/fadfbac))
- **utils:** Add getSystemUptime function ([847ec56](https://github.com/dankerow/blop/commit/847ec56))
- **commands:** Add uptime command ([84fe228](https://github.com/dankerow/blop/commit/84fe228))

### 🩹 Fixes

- Resolve promise correctly in maintainers fetching ([3f22575](https://github.com/dankerow/blop/commit/3f22575))
- Unnecessary type assertion ([782a07b](https://github.com/dankerow/blop/commit/782a07b))

### 💅 Refactors

- Update Event class handle method signature ([2d4dae6](https://github.com/dankerow/blop/commit/2d4dae6))

### 📖 Documentation

- Update add package.json version badge ([ec8e1a4](https://github.com/dankerow/blop/commit/ec8e1a4))
- Add GitHub license ([29bad6c](https://github.com/dankerow/blop/commit/29bad6c))
- Add instructions to setup the env file ([16d030c](https://github.com/dankerow/blop/commit/16d030c))
- Add instructions to run the bot ([572c200](https://github.com/dankerow/blop/commit/572c200))

### 🏡 Chore

- Update eslint configuration ([922f41a](https://github.com/dankerow/blop/commit/922f41a))

### ❤️ Contributors

- Dan <danker.twist@gmail.com>

## v0.2.0


### 🚀 Enhancements

- Add configuration loader using c12 ([ee76b73](https://github.com/dankerow/blop/commit/ee76b73))
- Ensure config file satisfies Config interface ([72e565a](https://github.com/dankerow/blop/commit/72e565a))
- ⚠️  Refactor Blop class to use ResolvedConfig ([1ed9ab7](https://github.com/dankerow/blop/commit/1ed9ab7))
- **structures:** Add Command base class ([c1d3461](https://github.com/dankerow/blop/commit/c1d3461))
- **Blop:** Add commands loading functionality ([4022d65](https://github.com/dankerow/blop/commit/4022d65))
- **Blop:** Add command registration to Discord API ([a48570b](https://github.com/dankerow/blop/commit/a48570b))
- Add about command ([7037525](https://github.com/dankerow/blop/commit/7037525))
- Migrate to eslint v9 ([4fa6572](https://github.com/dankerow/blop/commit/4fa6572))
- Add events default directory to config ([ec6d12c](https://github.com/dankerow/blop/commit/ec6d12c))
- **structures:** Add Event base class ([3e55689](https://github.com/dankerow/blop/commit/3e55689))
- **client:** Add events loading functionality ([0d4808e](https://github.com/dankerow/blop/commit/0d4808e))
- **events:** Add ready event ([7102ce8](https://github.com/dankerow/blop/commit/7102ce8))
- **events:** Add interactionCreate event ([1e4ea84](https://github.com/dankerow/blop/commit/1e4ea84))

### 🩹 Fixes

- File import not working on windows ([db5dde6](https://github.com/dankerow/blop/commit/db5dde6))
- Wrong env name for discord client token ([eca627d](https://github.com/dankerow/blop/commit/eca627d))
- Do not resolve config default directories ([ec38bd5](https://github.com/dankerow/blop/commit/ec38bd5))

### 💅 Refactors

- Use Blop class logger for logging ([b7f3594](https://github.com/dankerow/blop/commit/b7f3594))
- Remove trailing comma ([189e271](https://github.com/dankerow/blop/commit/189e271))
- Remove extra semicolon ([699fa59](https://github.com/dankerow/blop/commit/699fa59))
- Remove unused import ([6e7f67d](https://github.com/dankerow/blop/commit/6e7f67d))

### 📖 Documentation

- Add JSDoc comments to resolveConfig and loadConfig functions ([d7e88de](https://github.com/dankerow/blop/commit/d7e88de))

### 🏡 Chore

- Init ([4b8af5b](https://github.com/dankerow/blop/commit/4b8af5b))
- Add renovate config file ([d9b3697](https://github.com/dankerow/blop/commit/d9b3697))
- Add bug report template ([4503636](https://github.com/dankerow/blop/commit/4503636))
- Add feature request template ([78aabbf](https://github.com/dankerow/blop/commit/78aabbf))
- Update bug_report.md ([f798bce](https://github.com/dankerow/blop/commit/f798bce))
- Add pull request template ([208be53](https://github.com/dankerow/blop/commit/208be53))
- Rename DiscordClientConfig interface to Config ([cb430d6](https://github.com/dankerow/blop/commit/cb430d6))
- Add default directories to Config interface ([41c2536](https://github.com/dankerow/blop/commit/41c2536))
- Rename DiscordClientConfig interface to Config ([bdf446f](https://github.com/dankerow/blop/commit/bdf446f))
- **.gitignore:** Ignore specific config.ts file ([f67a5b3](https://github.com/dankerow/blop/commit/f67a5b3))
- Delete config.ts ([455ad7a](https://github.com/dankerow/blop/commit/455ad7a))
- Create command output type ([98cdcf8](https://github.com/dankerow/blop/commit/98cdcf8))
- **command:** Ignore eslint unused vars rule for execute method parameters ([757bc4a](https://github.com/dankerow/blop/commit/757bc4a))
- Lint ([01c05c4](https://github.com/dankerow/blop/commit/01c05c4))

#### ⚠️ Breaking Changes

- ⚠️  Refactor Blop class to use ResolvedConfig ([1ed9ab7](https://github.com/dankerow/blop/commit/1ed9ab7))

### ❤️ Contributors

- Dan <danker.twist@gmail.com>

