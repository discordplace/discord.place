# Changelog

## [1.12.1](https://github.com/discordplace/discord.place/compare/server@v1.12.0...server@v1.12.1) (2025-03-18)


### Bug Fixes

* **commands/ping:** correct formatting of server response time ([762ef91](https://github.com/discordplace/discord.place/commit/762ef915755558d9e35517cd925ad9620c69d331))
* **commands/ping:** refactor to use getServerResponseTime utility ([#179](https://github.com/discordplace/discord.place/issues/179)) ([ce7878a](https://github.com/discordplace/discord.place/commit/ce7878aec873104d03355a43ed296b66a2693b46))
* **dependencies:** move axios-retry from root to server folder ([68e8590](https://github.com/discordplace/discord.place/commit/68e859031721fcefa780bd2903d6c77f4f2d87e8))
* **sendVoteWebhook:** also add record for 2xx records ([123442b](https://github.com/discordplace/discord.place/commit/123442bb3f5a5ab1f30bf963a064c36fb4ca50c6))

## [1.12.0](https://github.com/discordplace/discord.place/compare/server@v1.11.0...server@v1.12.0) (2025-03-02)


### Features

* **Webhooks:** add language support for Discord webhooks ([#176](https://github.com/discordplace/discord.place/issues/176)) ([ba2a208](https://github.com/discordplace/discord.place/commit/ba2a20846c2c1bda39bb8f70de0687ae3e498cf1))
* **Webhooks:** add retry logic ([#177](https://github.com/discordplace/discord.place/issues/177)) ([66873ee](https://github.com/discordplace/discord.place/commit/66873ee83aaa7b4123e9a722fc6c3d498dbe8ff7))

## [1.11.0](https://github.com/discordplace/discord.place/compare/server@v1.10.1...server@v1.11.0) (2025-03-01)


### Features

* **server:** multiple proxy support ([#174](https://github.com/discordplace/discord.place/issues/174)) ([33d3eef](https://github.com/discordplace/discord.place/commit/33d3eef945c2e395a8049893ec7e3f54e98ff35b))
* **ServerSchema:** add totalVoters field to toPubliclySafe function ([65db2db](https://github.com/discordplace/discord.place/commit/65db2db03f5ee924f06a13c0b8c18f1098b95463))
* **server:** skip logging for OPTIONS requests in morgan middleware ([676a313](https://github.com/discordplace/discord.place/commit/676a313cfa8e9f43e6017348568462e88dffcadb))
* **Webhooks:** implement testing webhook button for bots and servers ([de28b64](https://github.com/discordplace/discord.place/commit/de28b64eff178dd699acfc7d058cc2c060425d38))
* **Webhooks:** support for Discord webhooks ([54a46a2](https://github.com/discordplace/discord.place/commit/54a46a227bdaea6cde82f1f57f50fd70f7e96dbd))


### Bug Fixes

* add WEBHOOKS_PROXY_SERVERS env check to whetever to use proxy agent or not ([c6b6bd3](https://github.com/discordplace/discord.place/commit/c6b6bd3e5e23bb1f8ed3217b09cad40e4b105c87))
* improve proxy server format validation in getProxyAgent function ([41d9745](https://github.com/discordplace/discord.place/commit/41d9745868a6f61a6fad4caee3f75a868ad05f33))
* remove dsc.wtf from custom hostnames in client and server configurations ([9036170](https://github.com/discordplace/discord.place/commit/90361700c8ce0d8d25f7952e0c53575ffd9105ae))

## [1.10.1](https://github.com/discordplace/discord.place/compare/server@v1.10.0...server@v1.10.1) (2025-02-24)


### Bug Fixes

* change request logic for client's server-side requests ([#172](https://github.com/discordplace/discord.place/issues/172)) ([0b447eb](https://github.com/discordplace/discord.place/commit/0b447eb67ed97c55e79d0e298cc5e51eddf2d1f0))
* **client:** add server_count to updateBotStats function ([79bf4d1](https://github.com/discordplace/discord.place/commit/79bf4d1bc08f28a30a2d5f9eff173cca6a66bcc0))
* **client:** ensure client is ready before updating activity ([#171](https://github.com/discordplace/discord.place/issues/171)) ([da2144f](https://github.com/discordplace/discord.place/commit/da2144f3cb24cd54667c39701788dea331048208))

## [1.10.0](https://github.com/discordplace/discord.place/compare/server@v1.9.0...server@v1.10.0) (2025-02-20)


### Features

* **middlewares:** add 'cf-connecting-ip' to headers check for IP retrieval ([2c694b3](https://github.com/discordplace/discord.place/commit/2c694b37ec506a8bc3b5936d45ddb1e90ed5491a))
* **server:** add custom morgan token for user identification in logs ([3a4da2d](https://github.com/discordplace/discord.place/commit/3a4da2ddcb917f3d01e26fa54af24014bffc8e97))
* **server:** customize morgan middleware for enhanced logging with user and IP details ([aa9f4b4](https://github.com/discordplace/discord.place/commit/aa9f4b4c2f5dd73adc8143714efa7a293014fab7))


### Bug Fixes

* **server/languages:** remove Azerbaijani language as it not supported by Discord ([7ef1a90](https://github.com/discordplace/discord.place/commit/7ef1a90c1b976808cd4545203d56c80d3d41504f))
* **server:** correct formatting of user and member details in logging output ([52c3544](https://github.com/discordplace/discord.place/commit/52c3544d02200d14e9add7fa7267e7a58f9b7e2f))
* update API URLs to use the new domain structure ([79f4898](https://github.com/discordplace/discord.place/commit/79f489826db8bd3b1bb5fb2dadba75fcd45a7877))

## [1.9.0](https://github.com/discordplace/discord.place/compare/server@v1.8.0...server@v1.9.0) (2025-02-17)


### Features

* **auth:** enhance applications entitlements scope handling and error messaging ([0e2d09e](https://github.com/discordplace/discord.place/commit/0e2d09e5f5f1f8a9609d20b8f47515325a37a81b))


### Bug Fixes

* **bots:** update error handling for unauthorized bot ownership check ([1ec2fa2](https://github.com/discordplace/discord.place/commit/1ec2fa23c5d1b57ed2bf04b881e2d830a0da7523))

## [1.8.0](https://github.com/discordplace/discord.place/compare/server@v1.7.0...server@v1.8.0) (2025-02-17)


### Features

* **bots:** add owner check when adding new bots ([#164](https://github.com/discordplace/discord.place/issues/164)) ([5406138](https://github.com/discordplace/discord.place/commit/54061388a9c7ad5232bb6f8b8604c7c5482ebf13))


### Bug Fixes

* **auth:** destructure access_token from getAccessToken response ([9e3339d](https://github.com/discordplace/discord.place/commit/9e3339d349e4f4edeb1f31a9ac67b99b79b1006e))

## [1.7.0](https://github.com/discordplace/discord.place/compare/server@v1.6.0...server@v1.7.0) (2025-02-04)


### Features

* **reviews:** implement actual pagination functionality ([#161](https://github.com/discordplace/discord.place/issues/161)) ([877e16c](https://github.com/discordplace/discord.place/commit/877e16cec5ee64d33003a6920f1919c2db33fe45))


### Bug Fixes

* **vote:** make sure human verification collector logic to properly handle success and failure cases ([9bf7a54](https://github.com/discordplace/discord.place/commit/9bf7a542898444b5af4890a06d68c6a90ed6bb77))

## [1.6.0](https://github.com/discordplace/discord.place/compare/server-v1.5.0...server@v1.6.0) (2025-02-04)


### Features

* add build and deploy workflow for client, server, and docs ([#91](https://github.com/discordplace/discord.place/issues/91)) ([74e68c4](https://github.com/discordplace/discord.place/commit/74e68c410d905a6f5ab08625eab9737adc56a477))
* Add initial configuration for commit linting and husky, update license format ([551f0a5](https://github.com/discordplace/discord.place/commit/551f0a5256b924ce2d6baed9bd475db11d1cacb6))
* add most voted badge to bot/server cards based on monthly votes ([#155](https://github.com/discordplace/discord.place/issues/155)) ([8b7f12e](https://github.com/discordplace/discord.place/commit/8b7f12e31e68f3fd4e131d5f3e25bb5379f59abd))
* **auth:** enhance JWT payload with nbf and jti claims, and add clock tolerance to verification ([3b56d4d](https://github.com/discordplace/discord.place/commit/3b56d4d353ae25fc561ea4354859151ecafc2860))
* **dashboard/bot-denies:** add restore functionality for bot denies ([137f2db](https://github.com/discordplace/discord.place/commit/137f2dba5faccedf23e3616b4d00963c9c8e26b0))
* **dashboard:** use promise all for improved performance and add new counts to use in extra tab ([1d7da4d](https://github.com/discordplace/discord.place/commit/1d7da4d1e94f7e6f9c9d91266328d99daa7dd66f))
* **routes/top-servers:** add is_listed field ([1b5127c](https://github.com/discordplace/discord.place/commit/1b5127c5e6c9169bbca76852104c7518bea1bba3))
* **server:** add quarantine check for user login tokens ([a409afb](https://github.com/discordplace/discord.place/commit/a409afba5027b831b7c08d477476f4b9ae954dd0))


### Bug Fixes

* **auth:** correct JWT issued at timestamp to use seconds instead of milliseconds ([97a3078](https://github.com/discordplace/discord.place/commit/97a30784dae143b9c7c5a87cd094ad7c08017b59))
* **Authentication:** correctly pass custom options to clear cookie calls ([9e70be3](https://github.com/discordplace/discord.place/commit/9e70be39fa2cc57a2baabdde2610d1fc12cd2471))
* **Authentication:** delete token cookie on logout ([#123](https://github.com/discordplace/discord.place/issues/123)) ([9083f14](https://github.com/discordplace/discord.place/commit/9083f14e90a45b9d5240d92feb353c330dfad5ed))
* **Authentication:** log error when token verification fails ([#122](https://github.com/discordplace/discord.place/issues/122)) ([b7c0fa0](https://github.com/discordplace/discord.place/commit/b7c0fa000c89223a04e6d3aef0fa5bd06d0ea1c8))
* **auth:** update JWT handling to use user ID as subject and remove id from token payload ([b3704f1](https://github.com/discordplace/discord.place/commit/b3704f1b403a3274208450df6c30a73ee4d1578f))
* **auth:** validate JWT format and ensure correct user ID extraction ([74b381b](https://github.com/discordplace/discord.place/commit/74b381b72d5663e81a333fff2c4e735c4a60d6fe))
* **blockedIp:** fix IP deletion logic ([a5d52db](https://github.com/discordplace/discord.place/commit/a5d52dbe83e3acb84cccec3d4cda55ee18da9f02))
* **blockedIp:** update import path for BlockedIp schema ([3cd8891](https://github.com/discordplace/discord.place/commit/3cd8891aed69bd61aaff473592cdf88930371a0f))
* **bot-denies/restore:** use publisher information instead of bot owner for embed author ([0dd41a7](https://github.com/discordplace/discord.place/commit/0dd41a75f407321aaab63986697012f4e5595c60))
* **client:** remove redundant IP deletion logic for expired blocked IPs ([b794e1f](https://github.com/discordplace/discord.place/commit/b794e1f92fbab9ae26ce12ff66f47e8271b004ee))
* **config:** increase bot description max length to 4096 characters ([e35408e](https://github.com/discordplace/discord.place/commit/e35408e32da036026be868b17e9b469d2955f9f2)), closes [#152](https://github.com/discordplace/discord.place/issues/152)
* correct user ID for most voted user in database, add is_most_vot… ([#154](https://github.com/discordplace/discord.place/issues/154)) ([e2e7165](https://github.com/discordplace/discord.place/commit/e2e7165bf1ddad3d590e4163d3d148142a8858cf))
* correct user ID for most voted user in database, add is_most_voted field ([e2e7165](https://github.com/discordplace/discord.place/commit/e2e7165bf1ddad3d590e4163d3d148142a8858cf))
* **guildDelete:** correct Promise.all syntax for deleting reviews and rewards ([d35b890](https://github.com/discordplace/discord.place/commit/d35b890f4c920a6cc260af2b853b90d622337494))
* **reminders:** add is_manually_deleted boolean to prevent sending message when deleting reminders ([d9f4e1c](https://github.com/discordplace/discord.place/commit/d9f4e1c9161e72698ff7ec0726049cb4612d4fd1))
* remove redundant permission from config ([#93](https://github.com/discordplace/discord.place/issues/93)) ([11e57cc](https://github.com/discordplace/discord.place/commit/11e57cce31dc9024b627e792272c3f4bd4b543a6))
* **server:** correct user ID reference in quarantine check for login tokens ([6d8803a](https://github.com/discordplace/discord.place/commit/6d8803a9198b2e879b6dbe22708f0969bd916163))
* **servers:** update monthly votes logic to slice last six entries ([0c4d220](https://github.com/discordplace/discord.place/commit/0c4d220044068069197616b55a7dd17454f1e44f))
* update message content to include theme denial reason correctly ([23678be](https://github.com/discordplace/discord.place/commit/23678be4c77bf043157f1717e5e42fbbb1b54437))
* update mongoose and related dependencies to latest versions ([5b4bff8](https://github.com/discordplace/discord.place/commit/5b4bff8fa2d81ad2917793d54dbfdcbc7ac08651))
* use verified field instead of approved field for bot document filtering in dashboard route ([affcabf](https://github.com/discordplace/discord.place/commit/affcabfe5f3e9278b60773ee2137d5507eecf97f))
* **vote/humanVerification:** simplify human verification logic ([4c1fec6](https://github.com/discordplace/discord.place/commit/4c1fec6cf60c7a46919f19283f6d88916f0d697d))

## [1.5.0](https://github.com/discordplace/discord.place/compare/server@v1.4.0...server@v1.5.0) (2025-01-14)


### Features

* **routes/top-servers:** add is_listed field ([1b5127c](https://github.com/discordplace/discord.place/commit/1b5127c5e6c9169bbca76852104c7518bea1bba3))
* **server:** add quarantine check for user login tokens ([a409afb](https://github.com/discordplace/discord.place/commit/a409afba5027b831b7c08d477476f4b9ae954dd0))


### Bug Fixes

* **reminders:** add is_manually_deleted boolean to prevent sending message when deleting reminders ([d9f4e1c](https://github.com/discordplace/discord.place/commit/d9f4e1c9161e72698ff7ec0726049cb4612d4fd1))
* **server:** correct user ID reference in quarantine check for login tokens ([6d8803a](https://github.com/discordplace/discord.place/commit/6d8803a9198b2e879b6dbe22708f0969bd916163))

## [1.4.0](https://github.com/discordplace/discord.place/compare/server@v1.3.0...server@v1.4.0) (2025-01-07)


### Features

* add most voted badge to bot/server cards based on monthly votes ([#155](https://github.com/discordplace/discord.place/issues/155)) ([8b7f12e](https://github.com/discordplace/discord.place/commit/8b7f12e31e68f3fd4e131d5f3e25bb5379f59abd))
* **dashboard/bot-denies:** add restore functionality for bot denies ([137f2db](https://github.com/discordplace/discord.place/commit/137f2dba5faccedf23e3616b4d00963c9c8e26b0))


### Bug Fixes

* **bot-denies/restore:** use publisher information instead of bot owner for embed author ([0dd41a7](https://github.com/discordplace/discord.place/commit/0dd41a75f407321aaab63986697012f4e5595c60))
* **config:** increase bot description max length to 4096 characters ([e35408e](https://github.com/discordplace/discord.place/commit/e35408e32da036026be868b17e9b469d2955f9f2)), closes [#152](https://github.com/discordplace/discord.place/issues/152)
* correct user ID for most voted user in database, add is_most_vot… ([#154](https://github.com/discordplace/discord.place/issues/154)) ([e2e7165](https://github.com/discordplace/discord.place/commit/e2e7165bf1ddad3d590e4163d3d148142a8858cf))
* correct user ID for most voted user in database, add is_most_voted field ([e2e7165](https://github.com/discordplace/discord.place/commit/e2e7165bf1ddad3d590e4163d3d148142a8858cf))

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
