# Changelog

## [1.3.0](https://github.com/discordplace/discord.place/compare/server@v1.2.4...server@v1.3.0) (2024-12-21)


### Features

* **auth:** enhance JWT payload with nbf and jti claims, and add clock tolerance to verification ([3b56d4d](https://github.com/discordplace/discord.place/commit/3b56d4d353ae25fc561ea4354859151ecafc2860))
* **dashboard:** use promise all for improved performance and add new counts to use in extra tab ([1d7da4d](https://github.com/discordplace/discord.place/commit/1d7da4d1e94f7e6f9c9d91266328d99daa7dd66f))


### Bug Fixes

* **auth:** correct JWT issued at timestamp to use seconds instead of milliseconds ([97a3078](https://github.com/discordplace/discord.place/commit/97a30784dae143b9c7c5a87cd094ad7c08017b59))

## [1.2.4](https://github.com/discordplace/discord.place/compare/server@v1.2.3...server@v1.2.4) (2024-12-18)


### Bug Fixes

* **auth:** update JWT handling to use user ID as subject and remove id from token payload ([b3704f1](https://github.com/discordplace/discord.place/commit/b3704f1b403a3274208450df6c30a73ee4d1578f))
* **auth:** validate JWT format and ensure correct user ID extraction ([74b381b](https://github.com/discordplace/discord.place/commit/74b381b72d5663e81a333fff2c4e735c4a60d6fe))

## [1.2.3](https://github.com/discordplace/discord.place/compare/server@v1.2.2...server@v1.2.3) (2024-12-17)


### Bug Fixes

* update mongoose and related dependencies to latest versions ([5b4bff8](https://github.com/discordplace/discord.place/commit/5b4bff8fa2d81ad2917793d54dbfdcbc7ac08651))

## [1.2.2](https://github.com/discordplace/discord.place/compare/server@v1.2.1...server@v1.2.2) (2024-11-24)


### Bug Fixes

* update message content to include theme denial reason correctly ([23678be](https://github.com/discordplace/discord.place/commit/23678be4c77bf043157f1717e5e42fbbb1b54437))
* use verified field instead of approved field for bot document filtering in dashboard route ([affcabf](https://github.com/discordplace/discord.place/commit/affcabfe5f3e9278b60773ee2137d5507eecf97f))

## [1.2.1](https://github.com/discordplace/discord.place/compare/server@v1.2.0...server@v1.2.1) (2024-11-01)


### Bug Fixes

* **Authentication:** correctly pass custom options to clear cookie calls ([9e70be3](https://github.com/discordplace/discord.place/commit/9e70be39fa2cc57a2baabdde2610d1fc12cd2471))
* **Authentication:** delete token cookie on logout ([#123](https://github.com/discordplace/discord.place/issues/123)) ([9083f14](https://github.com/discordplace/discord.place/commit/9083f14e90a45b9d5240d92feb353c330dfad5ed))
* **Authentication:** log error when token verification fails ([#122](https://github.com/discordplace/discord.place/issues/122)) ([b7c0fa0](https://github.com/discordplace/discord.place/commit/b7c0fa000c89223a04e6d3aef0fa5bd06d0ea1c8))

## [1.2.0](https://github.com/discordplace/discord.place/compare/server@v1.1.0...server@v1.2.0) (2024-10-23)


### Features

* add build and deploy workflow for client, server, and docs ([#91](https://github.com/discordplace/discord.place/issues/91)) ([74e68c4](https://github.com/discordplace/discord.place/commit/74e68c410d905a6f5ab08625eab9737adc56a477))


### Bug Fixes

* remove redundant permission from config ([#93](https://github.com/discordplace/discord.place/issues/93)) ([11e57cc](https://github.com/discordplace/discord.place/commit/11e57cce31dc9024b627e792272c3f4bd4b543a6))

## [1.1.0](https://github.com/discordplace/discord.place/compare/server-v1.0.0...server@v1.1.0) (2024-10-22)


### Features

* Add initial configuration for commit linting and husky, update license format ([551f0a5](https://github.com/discordplace/discord.place/commit/551f0a5256b924ce2d6baed9bd475db11d1cacb6))
