# Changelog

## [1.18.0](https://github.com/discordplace/discord.place/compare/client@v1.17.0...client@v1.18.0) (2025-05-01)


### Features

* add new custom hostnames and remove old ones ([afea73a](https://github.com/discordplace/discord.place/commit/afea73a2d59d85deb1344942b600770311656e61))
* **client:** add Sentry configuration ([7d14b2c](https://github.com/discordplace/discord.place/commit/7d14b2c387c670ea6f4e1d1936433af214f1848f))
* **Header/ServicesDropdown:** add upcoming service ([7dacc08](https://github.com/discordplace/discord.place/commit/7dacc08929a0738a68ce18f98fbde8c6d7085ae5))
* integrate ReportableArea component into emoji, sound, and theme content pages ([aa5309d](https://github.com/discordplace/discord.place/commit/aa5309df420221c9c7cc86506642894f9e4e4b4b))
* redesign theme cards ([8c90807](https://github.com/discordplace/discord.place/commit/8c908070d7751e6bdeb83a75454cbf4f21b3c94e))
* redesign theme cards and update server side logging ([#185](https://github.com/discordplace/discord.place/issues/185)) ([8c90807](https://github.com/discordplace/discord.place/commit/8c908070d7751e6bdeb83a75454cbf4f21b3c94e))
* reduce react-icons bundle size ([#184](https://github.com/discordplace/discord.place/issues/184)) ([f2ec941](https://github.com/discordplace/discord.place/commit/f2ec941dcb914d9b664868459e22191c7ec2887e))
* remove Cloudflare integration and related IP blocking functionality ([31af96f](https://github.com/discordplace/discord.place/commit/31af96fb79ae48ce0de86565b146813af41579e1))
* some visual updates ([7f2fd8f](https://github.com/discordplace/discord.place/commit/7f2fd8f00f4649993677ccc64433a706baca62ac))


### Bug Fixes

* add forgotten CreateReminder endpoint ([6046884](https://github.com/discordplace/discord.place/commit/60468845fe934a93d6059d11330296b3de90a9de))
* add max width to error state in active timeouts section ([1eef7dd](https://github.com/discordplace/discord.place/commit/1eef7dd67b7cf83b6a2b3984ec0bbf98fbc90c5d))
* always return errors in toast promises ([6d070e4](https://github.com/discordplace/discord.place/commit/6d070e465f37fb1145334f72b19d3e08d681e9eb))
* **Dashboard:** reset page after actions ([5660cd6](https://github.com/discordplace/discord.place/commit/5660cd65c422fcc6af020cb29074a2ece3935f4e))
* **dashboard:** update success and loading messages for review actions ([7986618](https://github.com/discordplace/discord.place/commit/7986618e615e6b8946c1aae8723319b2e59d04a4))
* disable unoptimized loading images (GIF's excluded) ([850c0ea](https://github.com/discordplace/discord.place/commit/850c0ea619c2892c2a5c6c9e2f3b5a471ca3ac2d))
* do not return errors in promise toasts ([26969e8](https://github.com/discordplace/discord.place/commit/26969e86fb7966757dfcabc2210157b2ac8d1fb9))
* enable unoptimized image loading for ServerIcon component ([6eda2e7](https://github.com/discordplace/discord.place/commit/6eda2e7231c68c01abf8c470a1c12afaaf575689))
* **getUser:** update import to use ServerRequestClient for user requests ([fd506c7](https://github.com/discordplace/discord.place/commit/fd506c79ed6477667f465891e7139cbbbe091aba))
* **locales:** add missing toast messages for profile editing actions ([5cd23cc](https://github.com/discordplace/discord.place/commit/5cd23cc0f58851b7dedc2752be20c043ddf8b8f5))
* **locales:** update fileSizeExceeded message to use {{size}} instead of {{maxSize}} ([e3f3bc9](https://github.com/discordplace/discord.place/commit/e3f3bc92536433979a53a677652f606f9232ae25))
* make unoptimized github repository owner avatar urls ([26d3b3c](https://github.com/discordplace/discord.place/commit/26d3b3c513ab44970f0e1e1f9fc1d673f82f480e))
* **Pagination:** don't change page if input is invalid ([cfa6bbb](https://github.com/discordplace/discord.place/commit/cfa6bbbec490a68c70369e808ad6b98f825b4e7a))
* remove nested css usage ([786323c](https://github.com/discordplace/discord.place/commit/786323cc82c12683610d02c8f383e0ee3311ab2d))
* remove toast error handling from response interceptor ([b809815](https://github.com/discordplace/discord.place/commit/b809815be2e54d7a1274bef7754225ed17fabce5))
* resolve layout shift issue with radix-ui ([32a3b25](https://github.com/discordplace/discord.place/commit/32a3b25bd1fbb3fd1f8c0641c4029c914c1a73de))
* **ThemeCard:** add localization ([fe89d54](https://github.com/discordplace/discord.place/commit/fe89d54bea0cd2f5dfaa2bdea59b948858a48c13))
* **ThemeCard:** add missing message input placeholder localization ([2c79ddf](https://github.com/discordplace/discord.place/commit/2c79ddf2824f64c9f16da6b37fb97451fe2d71a0))
* **ThemeCard:** change layout from grid to flex for user flags display ([ffa5950](https://github.com/discordplace/discord.place/commit/ffa5950301fcad93f66921478c049d21b6bc2557))
* **ThemeCard:** replace hardcoded quote with correct translations ([3aecf89](https://github.com/discordplace/discord.place/commit/3aecf89a32bca5f8bfa06dd4051d4e42fc11a381))
* **Themes:** remove duplicates ([2f1b035](https://github.com/discordplace/discord.place/commit/2f1b035c55a62780ce6a523cdd581a3ebd3c7594))
* **Themes:** use not equal operator for active reportable area condition ([4aa5e3d](https://github.com/discordplace/discord.place/commit/4aa5e3d0cdd808ed9f20c11027e72e50ea494f11))
* **webhook:** improve error handling for test webhook failures ([543c5cc](https://github.com/discordplace/discord.place/commit/543c5cc2a7a9f182b3924f9232e7100d3e484ac0))
* wrap most voted badge label in a truncate span ([6dfbb40](https://github.com/discordplace/discord.place/commit/6dfbb40c78ec2fd8a803d29993edd5878161dc58))


### Reverts

* "fix: do not return errors in promise toasts" ([0d4ea96](https://github.com/discordplace/discord.place/commit/0d4ea9616ff97d0dd0b8da22e6b3dd008abf6307))

## [1.17.0](https://github.com/discordplace/discord.place/compare/client@v1.16.0...client@v1.17.0) (2025-03-18)


### Features

* add custom iframe component to markdown rendering ([5e3dfd9](https://github.com/discordplace/discord.place/commit/5e3dfd95e4f40ccd21a401524185c855ca0b2c68))
* Add initial configuration for commit linting and husky, update license format ([551f0a5](https://github.com/discordplace/discord.place/commit/551f0a5256b924ce2d6baed9bd475db11d1cacb6))
* add localization support for markdown iframe component ([98db092](https://github.com/discordplace/discord.place/commit/98db09255af12a415b9a7e00a338e7dfea6ef4dc))
* add most voted badge to bot/server cards based on monthly votes ([#155](https://github.com/discordplace/discord.place/issues/155)) ([8b7f12e](https://github.com/discordplace/discord.place/commit/8b7f12e31e68f3fd4e131d5f3e25bb5379f59abd))
* add rehype-sanitize for allowing iframes ([90c730c](https://github.com/discordplace/discord.place/commit/90c730c5687d8d614753c8809130e103fb0f5115))
* add snowfall effect to LayoutContent ([53b450f](https://github.com/discordplace/discord.place/commit/53b450f7f1aea2e7dc653135f72bdc7d79b32a69))
* add unique keys for avatars, icons and banners ([#109](https://github.com/discordplace/discord.place/issues/109)) ([9caca83](https://github.com/discordplace/discord.place/commit/9caca8354b0571d345753838ed21f6b1e24deb9e))
* add unique keys for avatars, icons and banners in ImageFromHash components ([9caca83](https://github.com/discordplace/discord.place/commit/9caca8354b0571d345753838ed21f6b1e24deb9e))
* **analytics:** move to Plausible Analytics ([92f80a3](https://github.com/discordplace/discord.place/commit/92f80a39da79701ff3ed4fdb58ac466ac0f66b82))
* **auth:** enhance applications entitlements scope handling and error messaging ([0e2d09e](https://github.com/discordplace/discord.place/commit/0e2d09e5f5f1f8a9609d20b8f47515325a37a81b))
* **bots:** add owner check when adding new bots ([#164](https://github.com/discordplace/discord.place/issues/164)) ([5406138](https://github.com/discordplace/discord.place/commit/54061388a9c7ad5232bb6f8b8604c7c5482ebf13))
* **bots:** allowing iframe in markdowns ([#168](https://github.com/discordplace/discord.place/issues/168)) ([e9c9188](https://github.com/discordplace/discord.place/commit/e9c918831b5ba534d0e7270ea234b7d33bd67baf))
* **client/locales:** update webhook subtitles to include IPv6 support notice ([6916a51](https://github.com/discordplace/discord.place/commit/6916a510999efd7de7855dd431b4e7f7475f9b3e))
* **client:** set axios defaults to include credentials in requests ([25a44fe](https://github.com/discordplace/discord.place/commit/25a44febcbbdf3a809f842ab9ecd48392a60ad70))
* **config:** increase bot description max length to 8192 characters ([336d4e3](https://github.com/discordplace/discord.place/commit/336d4e3d50313a127a28289142821c4e13dd49ea))
* **dashboard/bot-denies:** add restore functionality for bot denies ([137f2db](https://github.com/discordplace/discord.place/commit/137f2dba5faccedf23e3616b4d00963c9c8e26b0))
* **dashboard/sidebar:** add new color options to badges ([2ca0f56](https://github.com/discordplace/discord.place/commit/2ca0f56489f3fde5a789bddf7d8917bc20036b4d))
* **dashboard/sidebar:** update analytics link to use Plausible Analytics ([ae45e07](https://github.com/discordplace/discord.place/commit/ae45e075dcd8af061663111aeb12a74ee6d7b570))
* **home:** make server card clickable for listed servers ([9577b3e](https://github.com/discordplace/discord.place/commit/9577b3e7245a228c9c350bf3b6ac3576aed26ebf))
* implement custom iframe component ([50ca944](https://github.com/discordplace/discord.place/commit/50ca9444753379f6b5008721033c518bd7b5a0e3))
* **markdown:** add tooltip support for Discord emojis ([d075969](https://github.com/discordplace/discord.place/commit/d075969e3420c0b5c79a09fca48c343e28d94130))
* **markdown:** support for Discord emojis and render emojis using twemoji ([7960c73](https://github.com/discordplace/discord.place/commit/7960c7365375415e55210aad50be8f8c87cac353))
* **markdown:** support for Discord emojis and render emojis using twemojis ([#169](https://github.com/discordplace/discord.place/issues/169)) ([7960c73](https://github.com/discordplace/discord.place/commit/7960c7365375415e55210aad50be8f8c87cac353))
* **profile/socials:** update styles ([#158](https://github.com/discordplace/discord.place/issues/158)) ([359831b](https://github.com/discordplace/discord.place/commit/359831bc818538ad650a988c39ae81dfe13e9a58))
* redesign Active Reminders page with expandable details ([#104](https://github.com/discordplace/discord.place/issues/104)) ([c226257](https://github.com/discordplace/discord.place/commit/c226257b13349e4437219774b74ce57788b36af9))
* redesign avatar/icon/banner components logic's ([#106](https://github.com/discordplace/discord.place/issues/106)) ([cfd5344](https://github.com/discordplace/discord.place/commit/cfd53441ee79e26ef4d0ff1f51ccd928630f9135))
* redesign Tooltip usage in premium page ([#102](https://github.com/discordplace/discord.place/issues/102)) ([f191366](https://github.com/discordplace/discord.place/commit/f1913661481fc5cd80b11e39a88d89b24b838460))
* remove snowfall effect ([#153](https://github.com/discordplace/discord.place/issues/153)) ([e8e146d](https://github.com/discordplace/discord.place/commit/e8e146d59d967b507b8220a0be76a0384bffa613))
* **reviews:** implement actual pagination functionality ([#161](https://github.com/discordplace/discord.place/issues/161)) ([877e16c](https://github.com/discordplace/discord.place/commit/877e16cec5ee64d33003a6920f1919c2db33fe45))
* **sounds:** add loud sound warning modal ([#180](https://github.com/discordplace/discord.place/issues/180)) ([d1cc003](https://github.com/discordplace/discord.place/commit/d1cc003b4878682077655fd9f40aa93cd4f0dab4))
* update report something button to use Link for redirecting github issues ([b0267bb](https://github.com/discordplace/discord.place/commit/b0267bb6ce93a22a3535e774cfa3c77aeb5d0fef))
* **Webhooks:** add language support for Discord webhooks ([#176](https://github.com/discordplace/discord.place/issues/176)) ([ba2a208](https://github.com/discordplace/discord.place/commit/ba2a20846c2c1bda39bb8f70de0687ae3e498cf1))
* **Webhooks:** add retry logic ([#177](https://github.com/discordplace/discord.place/issues/177)) ([66873ee](https://github.com/discordplace/discord.place/commit/66873ee83aaa7b4123e9a722fc6c3d498dbe8ff7))
* **Webhooks:** implement testing webhook button for bots and servers ([de28b64](https://github.com/discordplace/discord.place/commit/de28b64eff178dd699acfc7d058cc2c060425d38))
* **Webhooks:** support for Discord webhooks ([54a46a2](https://github.com/discordplace/discord.place/commit/54a46a227bdaea6cde82f1f57f50fd70f7e96dbd))


### Bug Fixes

* **account:** localize create profile modal title and description ([3df5440](https://github.com/discordplace/discord.place/commit/3df5440961510b5c158b169f6e50a5688034cce7))
* add FetchPresences endpoint and update fetchPresences function to use it ([b47fbcc](https://github.com/discordplace/discord.place/commit/b47fbcc5f8fab07ecb0b288bc50de2a472bc8839))
* add styles for recent deliveries section to improve responsiveness ([6269e2d](https://github.com/discordplace/discord.place/commit/6269e2dddb7b9056607fecfb478fa963dfc39b6d))
* adjust max width of container for better layout ([8469430](https://github.com/discordplace/discord.place/commit/84694305eb2f413489b047be5787592b1f2987c9))
* adjust max-width for reminder text in ActiveReminders component ([#110](https://github.com/discordplace/discord.place/issues/110)) ([8fc0c6d](https://github.com/discordplace/discord.place/commit/8fc0c6da39eaf9030738c5883fe62c260a1378bd))
* **Authentication:** delete token cookie on logout ([#123](https://github.com/discordplace/discord.place/issues/123)) ([9083f14](https://github.com/discordplace/discord.place/commit/9083f14e90a45b9d5240d92feb353c330dfad5ed))
* change request logic for client's server-side requests ([#172](https://github.com/discordplace/discord.place/issues/172)) ([0b447eb](https://github.com/discordplace/discord.place/commit/0b447eb67ed97c55e79d0e298cc5e51eddf2d1f0))
* **client/markdown:** allow line breaks in rendered markdown content ([#95](https://github.com/discordplace/discord.place/issues/95)) ([21ec323](https://github.com/discordplace/discord.place/commit/21ec3237f3091dbba8a5435a6eab373caf923fc9))
* **client:** update default avatar image source to use environment port ([7911616](https://github.com/discordplace/discord.place/commit/791161608543a8d6f40e2e1a161f1917dae1f196))
* **client:** update default avatar image source to use environment port ([1427a38](https://github.com/discordplace/discord.place/commit/1427a38bbeca3a495f8fa942dfdebc7f968f597e))
* **config:** increase bot description max length to 4096 characters ([e35408e](https://github.com/discordplace/discord.place/commit/e35408e32da036026be868b17e9b469d2955f9f2)), closes [#152](https://github.com/discordplace/discord.place/issues/152)
* **config:** update analytics URL to use Plausible Analytics ([70912b4](https://github.com/discordplace/discord.place/commit/70912b423ab24f39a21c6181ffdb5d08bdd99648))
* **config:** update websiteId for analytics ([656a271](https://github.com/discordplace/discord.place/commit/656a2710b29a34dacc0f0fa46c9a43476d043ccc))
* correct hash extraction logic in getHashFromURL function ([#108](https://github.com/discordplace/discord.place/issues/108)) ([ed2c5bc](https://github.com/discordplace/discord.place/commit/ed2c5bc75ffbf484151b153990ece78c6e498b6e))
* **dashboard/sidebar:** remove unnecessary badge count added to bot denies tab name ([37d14bf](https://github.com/discordplace/discord.place/commit/37d14bff1977c3c999a87e7f8437fa9ae487fbc5))
* **dashboard/utils:** remove unnecessary restoreBot function parameter ([1d0681a](https://github.com/discordplace/discord.place/commit/1d0681a01893eb78903c79043885c322998a5539))
* **dashboard:** update bot routing to use correct bot ID ([a2dcaf7](https://github.com/discordplace/discord.place/commit/a2dcaf793eb4632326d2bb98200d73e417ea5004))
* deny dropdown is not working on mobile devices ([42f4882](https://github.com/discordplace/discord.place/commit/42f4882c6d2f5e2e89aca012304d1187b38b67a7))
* **DenyDropdown:** increase z-index ([7621289](https://github.com/discordplace/discord.place/commit/76212894f857db3f91cfef63a3487a8ddcfddb79))
* **ImageFromHash:** show default avatar while current source loading ([#115](https://github.com/discordplace/discord.place/issues/115)) ([84fc408](https://github.com/discordplace/discord.place/commit/84fc408e5717f3cbfed56af1343ee2b76610bb14))
* **ImageFromHash:** show default avatar while current source loading to prevent framer motion bugs ([84fc408](https://github.com/discordplace/discord.place/commit/84fc408e5717f3cbfed56af1343ee2b76610bb14))
* improve error handling for webhook test failures ([48f5971](https://github.com/discordplace/discord.place/commit/48f5971a651291459395a8a7e4970f375b8a7939))
* **markdownComponents:** update iframe consent messages and improve responsiveness ([3328857](https://github.com/discordplace/discord.place/commit/33288574a4cf35cf61c3a8f1c00f053e2d871a22))
* **markdownComponents:** validate iframe src URL before rendering ([9124730](https://github.com/discordplace/discord.place/commit/91247306f684a18496c0a7a80593b3f53d31be3a))
* **pagination:** close input on blur and update page number ([#98](https://github.com/discordplace/discord.place/issues/98)) ([901c182](https://github.com/discordplace/discord.place/commit/901c18217a24cc79483820d1ddf6ea434807f5f4))
* **pagination:** restrict input to numeric characters in pagination input ([66160af](https://github.com/discordplace/discord.place/commit/66160af51f048f88e6d34e79a902ad40283d83ee))
* **pagination:** set input type to text and input mode to numeric for pagination ([7294171](https://github.com/discordplace/discord.place/commit/72941717c2f924345de9e5e1314a700c3c20eaae))
* remove dsc.wtf from custom hostnames in client and server configurations ([9036170](https://github.com/discordplace/discord.place/commit/90361700c8ce0d8d25f7952e0c53575ffd9105ae))
* remove fixed height from Markdown components for better responsiveness ([20c0329](https://github.com/discordplace/discord.place/commit/20c032990cca3dc2cc8adfb55d24f27c86adff58))
* revalidate after successfully webhook test ([d92e8a0](https://github.com/discordplace/discord.place/commit/d92e8a0569f4459c8568b258dbfe76444ae30a7e))
* **servers/monthly-votes-graph:** adjust x-axis range for monthly votes graph ([3954db4](https://github.com/discordplace/discord.place/commit/3954db4dda533d5441077b8bcd7ed93d5c536395))
* **servers/monthly-votes-graph:** update x-axis date format to short month ([caf0e64](https://github.com/discordplace/discord.place/commit/caf0e643a64946c4093d69cb8169fa81792689a8))
* **Tabs:** update disabled condition to use totalVoters field instead of votes field ([4b6cb40](https://github.com/discordplace/discord.place/commit/4b6cb40db01905af8687226e2e0a502dc474b7e6))
* **templates-previews:** use useMemo for performance optimization Members component ([8cc5f63](https://github.com/discordplace/discord.place/commit/8cc5f63ecd5902cc4a56bb2f5f0a40e4255521db))
* **ThemeCard:** update class names to fix pointer events handling ([#117](https://github.com/discordplace/discord.place/issues/117)) ([7762745](https://github.com/discordplace/discord.place/commit/77627450da06ef19354b1a5204716ad3aaa6bbf3))
* update API URL to use relative path for production ([d5d3752](https://github.com/discordplace/discord.place/commit/d5d37529a21ed9f1d901683680e7092bf729a231))
* update API URLs to use the new domain structure ([79f4898](https://github.com/discordplace/discord.place/commit/79f489826db8bd3b1bb5fb2dadba75fcd45a7877))
* update createBot function to accept botId parameter for endpoint construction ([72ed08b](https://github.com/discordplace/discord.place/commit/72ed08bc231a20b660ed4be460a6d063c2967d72))
* update FetchPresences endpoint to use HTTPS ([0520dd5](https://github.com/discordplace/discord.place/commit/0520dd5ad5cf176f4f39d9fc4abcc2b62809b2f3))
* update getPlans function to support server-side requests ([33b8bff](https://github.com/discordplace/discord.place/commit/33b8bff4d9a3def87aeb9bcd0e684b2d5c0d1ca9))
* update GitHub regex to allow hyphens in usernames ([f560ecd](https://github.com/discordplace/discord.place/commit/f560ecdab543dcad652a2740c99a4e8b62bef009))
* update import path for ServerRequestClient in getThemeMetadata ([38274f7](https://github.com/discordplace/discord.place/commit/38274f7d3399ec34a369224404e3e133efad6b26))
* update stroke-width to strokeWidth in CollapseIcon components ([7e16434](https://github.com/discordplace/discord.place/commit/7e1643466f64b7761a31fcdd59044fb86c945485))
* use avatar_url instead of avatar in user profile page ([#112](https://github.com/discordplace/discord.place/issues/112)) ([2e056fa](https://github.com/discordplace/discord.place/commit/2e056fa0df34ba599f1f2a511243c565688267aa))
* use theme-based color for Snowfall component in LayoutContent ([3afe142](https://github.com/discordplace/discord.place/commit/3afe1421718392b7ceefab8d88589b1fb09c5605))
* **UserPage:** update avatar URL property to use camelCase ([#118](https://github.com/discordplace/discord.place/issues/118)) ([5ee91b8](https://github.com/discordplace/discord.place/commit/5ee91b83142b1fa7a4ab19b1192f73f9bc41ef0a))
* **UserProfile:** add missing parameters to getHashFromURL function calls ([#120](https://github.com/discordplace/discord.place/issues/120)) ([3caed84](https://github.com/discordplace/discord.place/commit/3caed84e1a9050894febcc8fc8d62911a3e86278))
* **Webhooks:** always use status success for Discord webhooks ([0a7c441](https://github.com/discordplace/discord.place/commit/0a7c441ccd26ef10ec86466a1eccab9cd520653b))

## [1.16.0](https://github.com/discordplace/discord.place/compare/client@v1.15.0...client@v1.16.0) (2025-03-18)


### Features

* **sounds:** add loud sound warning modal ([#180](https://github.com/discordplace/discord.place/issues/180)) ([d1cc003](https://github.com/discordplace/discord.place/commit/d1cc003b4878682077655fd9f40aa93cd4f0dab4))


### Bug Fixes

* **account:** localize create profile modal title and description ([3df5440](https://github.com/discordplace/discord.place/commit/3df5440961510b5c158b169f6e50a5688034cce7))
* improve error handling for webhook test failures ([48f5971](https://github.com/discordplace/discord.place/commit/48f5971a651291459395a8a7e4970f375b8a7939))
* revalidate after successfully webhook test ([d92e8a0](https://github.com/discordplace/discord.place/commit/d92e8a0569f4459c8568b258dbfe76444ae30a7e))

## [1.15.0](https://github.com/discordplace/discord.place/compare/client@v1.14.0...client@v1.15.0) (2025-03-02)


### Features

* **Webhooks:** add language support for Discord webhooks ([#176](https://github.com/discordplace/discord.place/issues/176)) ([ba2a208](https://github.com/discordplace/discord.place/commit/ba2a20846c2c1bda39bb8f70de0687ae3e498cf1))
* **Webhooks:** add retry logic ([#177](https://github.com/discordplace/discord.place/issues/177)) ([66873ee](https://github.com/discordplace/discord.place/commit/66873ee83aaa7b4123e9a722fc6c3d498dbe8ff7))


### Bug Fixes

* **Webhooks:** always use status success for Discord webhooks ([0a7c441](https://github.com/discordplace/discord.place/commit/0a7c441ccd26ef10ec86466a1eccab9cd520653b))

## [1.14.0](https://github.com/discordplace/discord.place/compare/client@v1.13.0...client@v1.14.0) (2025-03-01)


### Features

* **client/locales:** update webhook subtitles to include IPv6 support notice ([6916a51](https://github.com/discordplace/discord.place/commit/6916a510999efd7de7855dd431b4e7f7475f9b3e))
* update report something button to use Link for redirecting github issues ([b0267bb](https://github.com/discordplace/discord.place/commit/b0267bb6ce93a22a3535e774cfa3c77aeb5d0fef))
* **Webhooks:** implement testing webhook button for bots and servers ([de28b64](https://github.com/discordplace/discord.place/commit/de28b64eff178dd699acfc7d058cc2c060425d38))
* **Webhooks:** support for Discord webhooks ([54a46a2](https://github.com/discordplace/discord.place/commit/54a46a227bdaea6cde82f1f57f50fd70f7e96dbd))


### Bug Fixes

* add FetchPresences endpoint and update fetchPresences function to use it ([b47fbcc](https://github.com/discordplace/discord.place/commit/b47fbcc5f8fab07ecb0b288bc50de2a472bc8839))
* add styles for recent deliveries section to improve responsiveness ([6269e2d](https://github.com/discordplace/discord.place/commit/6269e2dddb7b9056607fecfb478fa963dfc39b6d))
* remove dsc.wtf from custom hostnames in client and server configurations ([9036170](https://github.com/discordplace/discord.place/commit/90361700c8ce0d8d25f7952e0c53575ffd9105ae))
* **Tabs:** update disabled condition to use totalVoters field instead of votes field ([4b6cb40](https://github.com/discordplace/discord.place/commit/4b6cb40db01905af8687226e2e0a502dc474b7e6))
* update createBot function to accept botId parameter for endpoint construction ([72ed08b](https://github.com/discordplace/discord.place/commit/72ed08bc231a20b660ed4be460a6d063c2967d72))
* update FetchPresences endpoint to use HTTPS ([0520dd5](https://github.com/discordplace/discord.place/commit/0520dd5ad5cf176f4f39d9fc4abcc2b62809b2f3))
* update getPlans function to support server-side requests ([33b8bff](https://github.com/discordplace/discord.place/commit/33b8bff4d9a3def87aeb9bcd0e684b2d5c0d1ca9))
* update GitHub regex to allow hyphens in usernames ([f560ecd](https://github.com/discordplace/discord.place/commit/f560ecdab543dcad652a2740c99a4e8b62bef009))
* update import path for ServerRequestClient in getThemeMetadata ([38274f7](https://github.com/discordplace/discord.place/commit/38274f7d3399ec34a369224404e3e133efad6b26))

## [1.13.0](https://github.com/discordplace/discord.place/compare/client@v1.12.0...client@v1.13.0) (2025-02-24)


### Features

* **markdown:** add tooltip support for Discord emojis ([d075969](https://github.com/discordplace/discord.place/commit/d075969e3420c0b5c79a09fca48c343e28d94130))
* **markdown:** support for Discord emojis and render emojis using twemoji ([7960c73](https://github.com/discordplace/discord.place/commit/7960c7365375415e55210aad50be8f8c87cac353))
* **markdown:** support for Discord emojis and render emojis using twemojis ([#169](https://github.com/discordplace/discord.place/issues/169)) ([7960c73](https://github.com/discordplace/discord.place/commit/7960c7365375415e55210aad50be8f8c87cac353))


### Bug Fixes

* change request logic for client's server-side requests ([#172](https://github.com/discordplace/discord.place/issues/172)) ([0b447eb](https://github.com/discordplace/discord.place/commit/0b447eb67ed97c55e79d0e298cc5e51eddf2d1f0))

## [1.12.0](https://github.com/discordplace/discord.place/compare/client@v1.11.0...client@v1.12.0) (2025-02-20)


### Features

* add custom iframe component to markdown rendering ([5e3dfd9](https://github.com/discordplace/discord.place/commit/5e3dfd95e4f40ccd21a401524185c855ca0b2c68))
* add localization support for markdown iframe component ([98db092](https://github.com/discordplace/discord.place/commit/98db09255af12a415b9a7e00a338e7dfea6ef4dc))
* add rehype-sanitize for allowing iframes ([90c730c](https://github.com/discordplace/discord.place/commit/90c730c5687d8d614753c8809130e103fb0f5115))
* **analytics:** move to Plausible Analytics ([92f80a3](https://github.com/discordplace/discord.place/commit/92f80a39da79701ff3ed4fdb58ac466ac0f66b82))
* **bots:** allowing iframe in markdowns ([#168](https://github.com/discordplace/discord.place/issues/168)) ([e9c9188](https://github.com/discordplace/discord.place/commit/e9c918831b5ba534d0e7270ea234b7d33bd67baf))
* **client:** set axios defaults to include credentials in requests ([25a44fe](https://github.com/discordplace/discord.place/commit/25a44febcbbdf3a809f842ab9ecd48392a60ad70))
* **dashboard/sidebar:** update analytics link to use Plausible Analytics ([ae45e07](https://github.com/discordplace/discord.place/commit/ae45e075dcd8af061663111aeb12a74ee6d7b570))
* implement custom iframe component ([50ca944](https://github.com/discordplace/discord.place/commit/50ca9444753379f6b5008721033c518bd7b5a0e3))


### Bug Fixes

* **client:** update default avatar image source to use environment port ([7911616](https://github.com/discordplace/discord.place/commit/791161608543a8d6f40e2e1a161f1917dae1f196))
* **client:** update default avatar image source to use environment port ([1427a38](https://github.com/discordplace/discord.place/commit/1427a38bbeca3a495f8fa942dfdebc7f968f597e))
* **config:** update analytics URL to use Plausible Analytics ([70912b4](https://github.com/discordplace/discord.place/commit/70912b423ab24f39a21c6181ffdb5d08bdd99648))
* **markdownComponents:** update iframe consent messages and improve responsiveness ([3328857](https://github.com/discordplace/discord.place/commit/33288574a4cf35cf61c3a8f1c00f053e2d871a22))
* **markdownComponents:** validate iframe src URL before rendering ([9124730](https://github.com/discordplace/discord.place/commit/91247306f684a18496c0a7a80593b3f53d31be3a))
* remove fixed height from Markdown components for better responsiveness ([20c0329](https://github.com/discordplace/discord.place/commit/20c032990cca3dc2cc8adfb55d24f27c86adff58))
* update API URL to use relative path for production ([d5d3752](https://github.com/discordplace/discord.place/commit/d5d37529a21ed9f1d901683680e7092bf729a231))
* update API URLs to use the new domain structure ([79f4898](https://github.com/discordplace/discord.place/commit/79f489826db8bd3b1bb5fb2dadba75fcd45a7877))

## [1.11.0](https://github.com/discordplace/discord.place/compare/client@v1.10.0...client@v1.11.0) (2025-02-17)


### Features

* **auth:** enhance applications entitlements scope handling and error messaging ([0e2d09e](https://github.com/discordplace/discord.place/commit/0e2d09e5f5f1f8a9609d20b8f47515325a37a81b))

## [1.10.0](https://github.com/discordplace/discord.place/compare/client-v1.9.1...client@v1.10.0) (2025-02-17)


### Features

* Add initial configuration for commit linting and husky, update license format ([551f0a5](https://github.com/discordplace/discord.place/commit/551f0a5256b924ce2d6baed9bd475db11d1cacb6))
* add most voted badge to bot/server cards based on monthly votes ([#155](https://github.com/discordplace/discord.place/issues/155)) ([8b7f12e](https://github.com/discordplace/discord.place/commit/8b7f12e31e68f3fd4e131d5f3e25bb5379f59abd))
* add snowfall effect to LayoutContent ([53b450f](https://github.com/discordplace/discord.place/commit/53b450f7f1aea2e7dc653135f72bdc7d79b32a69))
* add unique keys for avatars, icons and banners ([#109](https://github.com/discordplace/discord.place/issues/109)) ([9caca83](https://github.com/discordplace/discord.place/commit/9caca8354b0571d345753838ed21f6b1e24deb9e))
* add unique keys for avatars, icons and banners in ImageFromHash components ([9caca83](https://github.com/discordplace/discord.place/commit/9caca8354b0571d345753838ed21f6b1e24deb9e))
* **bots:** add owner check when adding new bots ([#164](https://github.com/discordplace/discord.place/issues/164)) ([5406138](https://github.com/discordplace/discord.place/commit/54061388a9c7ad5232bb6f8b8604c7c5482ebf13))
* **dashboard/bot-denies:** add restore functionality for bot denies ([137f2db](https://github.com/discordplace/discord.place/commit/137f2dba5faccedf23e3616b4d00963c9c8e26b0))
* **dashboard/sidebar:** add new color options to badges ([2ca0f56](https://github.com/discordplace/discord.place/commit/2ca0f56489f3fde5a789bddf7d8917bc20036b4d))
* **home:** make server card clickable for listed servers ([9577b3e](https://github.com/discordplace/discord.place/commit/9577b3e7245a228c9c350bf3b6ac3576aed26ebf))
* **profile/socials:** update styles ([#158](https://github.com/discordplace/discord.place/issues/158)) ([359831b](https://github.com/discordplace/discord.place/commit/359831bc818538ad650a988c39ae81dfe13e9a58))
* redesign Active Reminders page with expandable details ([#104](https://github.com/discordplace/discord.place/issues/104)) ([c226257](https://github.com/discordplace/discord.place/commit/c226257b13349e4437219774b74ce57788b36af9))
* redesign avatar/icon/banner components logic's ([#106](https://github.com/discordplace/discord.place/issues/106)) ([cfd5344](https://github.com/discordplace/discord.place/commit/cfd53441ee79e26ef4d0ff1f51ccd928630f9135))
* redesign Tooltip usage in premium page ([#102](https://github.com/discordplace/discord.place/issues/102)) ([f191366](https://github.com/discordplace/discord.place/commit/f1913661481fc5cd80b11e39a88d89b24b838460))
* remove snowfall effect ([#153](https://github.com/discordplace/discord.place/issues/153)) ([e8e146d](https://github.com/discordplace/discord.place/commit/e8e146d59d967b507b8220a0be76a0384bffa613))
* **reviews:** implement actual pagination functionality ([#161](https://github.com/discordplace/discord.place/issues/161)) ([877e16c](https://github.com/discordplace/discord.place/commit/877e16cec5ee64d33003a6920f1919c2db33fe45))


### Bug Fixes

* adjust max width of container for better layout ([8469430](https://github.com/discordplace/discord.place/commit/84694305eb2f413489b047be5787592b1f2987c9))
* adjust max-width for reminder text in ActiveReminders component ([#110](https://github.com/discordplace/discord.place/issues/110)) ([8fc0c6d](https://github.com/discordplace/discord.place/commit/8fc0c6da39eaf9030738c5883fe62c260a1378bd))
* **Authentication:** delete token cookie on logout ([#123](https://github.com/discordplace/discord.place/issues/123)) ([9083f14](https://github.com/discordplace/discord.place/commit/9083f14e90a45b9d5240d92feb353c330dfad5ed))
* **client/markdown:** allow line breaks in rendered markdown content ([#95](https://github.com/discordplace/discord.place/issues/95)) ([21ec323](https://github.com/discordplace/discord.place/commit/21ec3237f3091dbba8a5435a6eab373caf923fc9))
* **config:** increase bot description max length to 4096 characters ([e35408e](https://github.com/discordplace/discord.place/commit/e35408e32da036026be868b17e9b469d2955f9f2)), closes [#152](https://github.com/discordplace/discord.place/issues/152)
* **config:** update websiteId for analytics ([656a271](https://github.com/discordplace/discord.place/commit/656a2710b29a34dacc0f0fa46c9a43476d043ccc))
* correct hash extraction logic in getHashFromURL function ([#108](https://github.com/discordplace/discord.place/issues/108)) ([ed2c5bc](https://github.com/discordplace/discord.place/commit/ed2c5bc75ffbf484151b153990ece78c6e498b6e))
* **dashboard/sidebar:** remove unnecessary badge count added to bot denies tab name ([37d14bf](https://github.com/discordplace/discord.place/commit/37d14bff1977c3c999a87e7f8437fa9ae487fbc5))
* **dashboard/utils:** remove unnecessary restoreBot function parameter ([1d0681a](https://github.com/discordplace/discord.place/commit/1d0681a01893eb78903c79043885c322998a5539))
* **dashboard:** update bot routing to use correct bot ID ([a2dcaf7](https://github.com/discordplace/discord.place/commit/a2dcaf793eb4632326d2bb98200d73e417ea5004))
* deny dropdown is not working on mobile devices ([42f4882](https://github.com/discordplace/discord.place/commit/42f4882c6d2f5e2e89aca012304d1187b38b67a7))
* **DenyDropdown:** increase z-index ([7621289](https://github.com/discordplace/discord.place/commit/76212894f857db3f91cfef63a3487a8ddcfddb79))
* **ImageFromHash:** show default avatar while current source loading ([#115](https://github.com/discordplace/discord.place/issues/115)) ([84fc408](https://github.com/discordplace/discord.place/commit/84fc408e5717f3cbfed56af1343ee2b76610bb14))
* **ImageFromHash:** show default avatar while current source loading to prevent framer motion bugs ([84fc408](https://github.com/discordplace/discord.place/commit/84fc408e5717f3cbfed56af1343ee2b76610bb14))
* **pagination:** close input on blur and update page number ([#98](https://github.com/discordplace/discord.place/issues/98)) ([901c182](https://github.com/discordplace/discord.place/commit/901c18217a24cc79483820d1ddf6ea434807f5f4))
* **pagination:** restrict input to numeric characters in pagination input ([66160af](https://github.com/discordplace/discord.place/commit/66160af51f048f88e6d34e79a902ad40283d83ee))
* **pagination:** set input type to text and input mode to numeric for pagination ([7294171](https://github.com/discordplace/discord.place/commit/72941717c2f924345de9e5e1314a700c3c20eaae))
* **servers/monthly-votes-graph:** adjust x-axis range for monthly votes graph ([3954db4](https://github.com/discordplace/discord.place/commit/3954db4dda533d5441077b8bcd7ed93d5c536395))
* **servers/monthly-votes-graph:** update x-axis date format to short month ([caf0e64](https://github.com/discordplace/discord.place/commit/caf0e643a64946c4093d69cb8169fa81792689a8))
* **templates-previews:** use useMemo for performance optimization Members component ([8cc5f63](https://github.com/discordplace/discord.place/commit/8cc5f63ecd5902cc4a56bb2f5f0a40e4255521db))
* **ThemeCard:** update class names to fix pointer events handling ([#117](https://github.com/discordplace/discord.place/issues/117)) ([7762745](https://github.com/discordplace/discord.place/commit/77627450da06ef19354b1a5204716ad3aaa6bbf3))
* update stroke-width to strokeWidth in CollapseIcon components ([7e16434](https://github.com/discordplace/discord.place/commit/7e1643466f64b7761a31fcdd59044fb86c945485))
* use avatar_url instead of avatar in user profile page ([#112](https://github.com/discordplace/discord.place/issues/112)) ([2e056fa](https://github.com/discordplace/discord.place/commit/2e056fa0df34ba599f1f2a511243c565688267aa))
* use theme-based color for Snowfall component in LayoutContent ([3afe142](https://github.com/discordplace/discord.place/commit/3afe1421718392b7ceefab8d88589b1fb09c5605))
* **UserPage:** update avatar URL property to use camelCase ([#118](https://github.com/discordplace/discord.place/issues/118)) ([5ee91b8](https://github.com/discordplace/discord.place/commit/5ee91b83142b1fa7a4ab19b1192f73f9bc41ef0a))
* **UserProfile:** add missing parameters to getHashFromURL function calls ([#120](https://github.com/discordplace/discord.place/issues/120)) ([3caed84](https://github.com/discordplace/discord.place/commit/3caed84e1a9050894febcc8fc8d62911a3e86278))

## [1.9.1](https://github.com/discordplace/discord.place/compare/client@v1.9.0...client@v1.9.1) (2025-02-13)


### Bug Fixes

* **dashboard:** update bot routing to use correct bot ID ([a2dcaf7](https://github.com/discordplace/discord.place/commit/a2dcaf793eb4632326d2bb98200d73e417ea5004))

## [1.9.0](https://github.com/discordplace/discord.place/compare/client@v1.8.0...client@v1.9.0) (2025-02-04)


### Features

* **reviews:** implement actual pagination functionality ([#161](https://github.com/discordplace/discord.place/issues/161)) ([877e16c](https://github.com/discordplace/discord.place/commit/877e16cec5ee64d33003a6920f1919c2db33fe45))

## [1.8.0](https://github.com/discordplace/discord.place/compare/client-v1.7.0...client@v1.8.0) (2025-02-04)


### Features

* Add initial configuration for commit linting and husky, update license format ([551f0a5](https://github.com/discordplace/discord.place/commit/551f0a5256b924ce2d6baed9bd475db11d1cacb6))
* add most voted badge to bot/server cards based on monthly votes ([#155](https://github.com/discordplace/discord.place/issues/155)) ([8b7f12e](https://github.com/discordplace/discord.place/commit/8b7f12e31e68f3fd4e131d5f3e25bb5379f59abd))
* add snowfall effect to LayoutContent ([53b450f](https://github.com/discordplace/discord.place/commit/53b450f7f1aea2e7dc653135f72bdc7d79b32a69))
* add unique keys for avatars, icons and banners ([#109](https://github.com/discordplace/discord.place/issues/109)) ([9caca83](https://github.com/discordplace/discord.place/commit/9caca8354b0571d345753838ed21f6b1e24deb9e))
* add unique keys for avatars, icons and banners in ImageFromHash components ([9caca83](https://github.com/discordplace/discord.place/commit/9caca8354b0571d345753838ed21f6b1e24deb9e))
* **dashboard/bot-denies:** add restore functionality for bot denies ([137f2db](https://github.com/discordplace/discord.place/commit/137f2dba5faccedf23e3616b4d00963c9c8e26b0))
* **dashboard/sidebar:** add new color options to badges ([2ca0f56](https://github.com/discordplace/discord.place/commit/2ca0f56489f3fde5a789bddf7d8917bc20036b4d))
* **home:** make server card clickable for listed servers ([9577b3e](https://github.com/discordplace/discord.place/commit/9577b3e7245a228c9c350bf3b6ac3576aed26ebf))
* **profile/socials:** update styles ([#158](https://github.com/discordplace/discord.place/issues/158)) ([359831b](https://github.com/discordplace/discord.place/commit/359831bc818538ad650a988c39ae81dfe13e9a58))
* redesign Active Reminders page with expandable details ([#104](https://github.com/discordplace/discord.place/issues/104)) ([c226257](https://github.com/discordplace/discord.place/commit/c226257b13349e4437219774b74ce57788b36af9))
* redesign avatar/icon/banner components logic's ([#106](https://github.com/discordplace/discord.place/issues/106)) ([cfd5344](https://github.com/discordplace/discord.place/commit/cfd53441ee79e26ef4d0ff1f51ccd928630f9135))
* redesign Tooltip usage in premium page ([#102](https://github.com/discordplace/discord.place/issues/102)) ([f191366](https://github.com/discordplace/discord.place/commit/f1913661481fc5cd80b11e39a88d89b24b838460))
* remove snowfall effect ([#153](https://github.com/discordplace/discord.place/issues/153)) ([e8e146d](https://github.com/discordplace/discord.place/commit/e8e146d59d967b507b8220a0be76a0384bffa613))


### Bug Fixes

* adjust max width of container for better layout ([8469430](https://github.com/discordplace/discord.place/commit/84694305eb2f413489b047be5787592b1f2987c9))
* adjust max-width for reminder text in ActiveReminders component ([#110](https://github.com/discordplace/discord.place/issues/110)) ([8fc0c6d](https://github.com/discordplace/discord.place/commit/8fc0c6da39eaf9030738c5883fe62c260a1378bd))
* **Authentication:** delete token cookie on logout ([#123](https://github.com/discordplace/discord.place/issues/123)) ([9083f14](https://github.com/discordplace/discord.place/commit/9083f14e90a45b9d5240d92feb353c330dfad5ed))
* **client/markdown:** allow line breaks in rendered markdown content ([#95](https://github.com/discordplace/discord.place/issues/95)) ([21ec323](https://github.com/discordplace/discord.place/commit/21ec3237f3091dbba8a5435a6eab373caf923fc9))
* **config:** increase bot description max length to 4096 characters ([e35408e](https://github.com/discordplace/discord.place/commit/e35408e32da036026be868b17e9b469d2955f9f2)), closes [#152](https://github.com/discordplace/discord.place/issues/152)
* **config:** update websiteId for analytics ([656a271](https://github.com/discordplace/discord.place/commit/656a2710b29a34dacc0f0fa46c9a43476d043ccc))
* correct hash extraction logic in getHashFromURL function ([#108](https://github.com/discordplace/discord.place/issues/108)) ([ed2c5bc](https://github.com/discordplace/discord.place/commit/ed2c5bc75ffbf484151b153990ece78c6e498b6e))
* **dashboard/sidebar:** remove unnecessary badge count added to bot denies tab name ([37d14bf](https://github.com/discordplace/discord.place/commit/37d14bff1977c3c999a87e7f8437fa9ae487fbc5))
* **dashboard/utils:** remove unnecessary restoreBot function parameter ([1d0681a](https://github.com/discordplace/discord.place/commit/1d0681a01893eb78903c79043885c322998a5539))
* deny dropdown is not working on mobile devices ([42f4882](https://github.com/discordplace/discord.place/commit/42f4882c6d2f5e2e89aca012304d1187b38b67a7))
* **DenyDropdown:** increase z-index ([7621289](https://github.com/discordplace/discord.place/commit/76212894f857db3f91cfef63a3487a8ddcfddb79))
* **ImageFromHash:** show default avatar while current source loading ([#115](https://github.com/discordplace/discord.place/issues/115)) ([84fc408](https://github.com/discordplace/discord.place/commit/84fc408e5717f3cbfed56af1343ee2b76610bb14))
* **ImageFromHash:** show default avatar while current source loading to prevent framer motion bugs ([84fc408](https://github.com/discordplace/discord.place/commit/84fc408e5717f3cbfed56af1343ee2b76610bb14))
* **pagination:** close input on blur and update page number ([#98](https://github.com/discordplace/discord.place/issues/98)) ([901c182](https://github.com/discordplace/discord.place/commit/901c18217a24cc79483820d1ddf6ea434807f5f4))
* **pagination:** restrict input to numeric characters in pagination input ([66160af](https://github.com/discordplace/discord.place/commit/66160af51f048f88e6d34e79a902ad40283d83ee))
* **pagination:** set input type to text and input mode to numeric for pagination ([7294171](https://github.com/discordplace/discord.place/commit/72941717c2f924345de9e5e1314a700c3c20eaae))
* **servers/monthly-votes-graph:** adjust x-axis range for monthly votes graph ([3954db4](https://github.com/discordplace/discord.place/commit/3954db4dda533d5441077b8bcd7ed93d5c536395))
* **servers/monthly-votes-graph:** update x-axis date format to short month ([caf0e64](https://github.com/discordplace/discord.place/commit/caf0e643a64946c4093d69cb8169fa81792689a8))
* **templates-previews:** use useMemo for performance optimization Members component ([8cc5f63](https://github.com/discordplace/discord.place/commit/8cc5f63ecd5902cc4a56bb2f5f0a40e4255521db))
* **ThemeCard:** update class names to fix pointer events handling ([#117](https://github.com/discordplace/discord.place/issues/117)) ([7762745](https://github.com/discordplace/discord.place/commit/77627450da06ef19354b1a5204716ad3aaa6bbf3))
* update stroke-width to strokeWidth in CollapseIcon components ([7e16434](https://github.com/discordplace/discord.place/commit/7e1643466f64b7761a31fcdd59044fb86c945485))
* use avatar_url instead of avatar in user profile page ([#112](https://github.com/discordplace/discord.place/issues/112)) ([2e056fa](https://github.com/discordplace/discord.place/commit/2e056fa0df34ba599f1f2a511243c565688267aa))
* use theme-based color for Snowfall component in LayoutContent ([3afe142](https://github.com/discordplace/discord.place/commit/3afe1421718392b7ceefab8d88589b1fb09c5605))
* **UserPage:** update avatar URL property to use camelCase ([#118](https://github.com/discordplace/discord.place/issues/118)) ([5ee91b8](https://github.com/discordplace/discord.place/commit/5ee91b83142b1fa7a4ab19b1192f73f9bc41ef0a))
* **UserProfile:** add missing parameters to getHashFromURL function calls ([#120](https://github.com/discordplace/discord.place/issues/120)) ([3caed84](https://github.com/discordplace/discord.place/commit/3caed84e1a9050894febcc8fc8d62911a3e86278))

## [1.7.0](https://github.com/discordplace/discord.place/compare/client@v1.6.0...client@v1.7.0) (2025-01-14)


### Features

* **home:** make server card clickable for listed servers ([9577b3e](https://github.com/discordplace/discord.place/commit/9577b3e7245a228c9c350bf3b6ac3576aed26ebf))
* **profile/socials:** update styles ([#158](https://github.com/discordplace/discord.place/issues/158)) ([359831b](https://github.com/discordplace/discord.place/commit/359831bc818538ad650a988c39ae81dfe13e9a58))


### Bug Fixes

* **servers/monthly-votes-graph:** adjust x-axis range for monthly votes graph ([3954db4](https://github.com/discordplace/discord.place/commit/3954db4dda533d5441077b8bcd7ed93d5c536395))
* **servers/monthly-votes-graph:** update x-axis date format to short month ([caf0e64](https://github.com/discordplace/discord.place/commit/caf0e643a64946c4093d69cb8169fa81792689a8))

## [1.6.0](https://github.com/discordplace/discord.place/compare/client@v1.5.1...client@v1.6.0) (2025-01-07)


### Features

* add most voted badge to bot/server cards based on monthly votes ([#155](https://github.com/discordplace/discord.place/issues/155)) ([8b7f12e](https://github.com/discordplace/discord.place/commit/8b7f12e31e68f3fd4e131d5f3e25bb5379f59abd))
* **dashboard/bot-denies:** add restore functionality for bot denies ([137f2db](https://github.com/discordplace/discord.place/commit/137f2dba5faccedf23e3616b4d00963c9c8e26b0))
* remove snowfall effect ([#153](https://github.com/discordplace/discord.place/issues/153)) ([e8e146d](https://github.com/discordplace/discord.place/commit/e8e146d59d967b507b8220a0be76a0384bffa613))


### Bug Fixes

* **config:** increase bot description max length to 4096 characters ([e35408e](https://github.com/discordplace/discord.place/commit/e35408e32da036026be868b17e9b469d2955f9f2)), closes [#152](https://github.com/discordplace/discord.place/issues/152)
* **dashboard/utils:** remove unnecessary restoreBot function parameter ([1d0681a](https://github.com/discordplace/discord.place/commit/1d0681a01893eb78903c79043885c322998a5539))

## [1.5.1](https://github.com/discordplace/discord.place/compare/client@v1.5.0...client@v1.5.1) (2024-12-21)


### Bug Fixes

* **dashboard/sidebar:** remove unnecessary badge count added to bot denies tab name ([37d14bf](https://github.com/discordplace/discord.place/commit/37d14bff1977c3c999a87e7f8437fa9ae487fbc5))

## [1.5.0](https://github.com/discordplace/discord.place/compare/client@v1.4.0...client@v1.5.0) (2024-12-21)


### Features

* **dashboard/sidebar:** add new color options to badges ([2ca0f56](https://github.com/discordplace/discord.place/commit/2ca0f56489f3fde5a789bddf7d8917bc20036b4d))

## [1.4.0](https://github.com/discordplace/discord.place/compare/client@v1.3.5...client@v1.4.0) (2024-12-17)


### Features

* add snowfall effect to LayoutContent ([53b450f](https://github.com/discordplace/discord.place/commit/53b450f7f1aea2e7dc653135f72bdc7d79b32a69))


### Bug Fixes

* adjust max width of container for better layout ([8469430](https://github.com/discordplace/discord.place/commit/84694305eb2f413489b047be5787592b1f2987c9))
* **templates-previews:** use useMemo for performance optimization Members component ([8cc5f63](https://github.com/discordplace/discord.place/commit/8cc5f63ecd5902cc4a56bb2f5f0a40e4255521db))
* update stroke-width to strokeWidth in CollapseIcon components ([7e16434](https://github.com/discordplace/discord.place/commit/7e1643466f64b7761a31fcdd59044fb86c945485))
* use theme-based color for Snowfall component in LayoutContent ([3afe142](https://github.com/discordplace/discord.place/commit/3afe1421718392b7ceefab8d88589b1fb09c5605))

## [1.3.5](https://github.com/discordplace/discord.place/compare/client@v1.3.4...client@v1.3.5) (2024-11-20)


### Bug Fixes

* **config:** update websiteId for analytics ([656a271](https://github.com/discordplace/discord.place/commit/656a2710b29a34dacc0f0fa46c9a43476d043ccc))

## [1.3.4](https://github.com/discordplace/discord.place/compare/client@v1.3.3...client@v1.3.4) (2024-11-03)


### Bug Fixes

* deny dropdown is not working on mobile devices ([42f4882](https://github.com/discordplace/discord.place/commit/42f4882c6d2f5e2e89aca012304d1187b38b67a7))
* **DenyDropdown:** increase z-index ([7621289](https://github.com/discordplace/discord.place/commit/76212894f857db3f91cfef63a3487a8ddcfddb79))

## [1.3.3](https://github.com/discordplace/discord.place/compare/client@v1.3.2...client@v1.3.3) (2024-11-01)


### Bug Fixes

* **Authentication:** delete token cookie on logout ([#123](https://github.com/discordplace/discord.place/issues/123)) ([9083f14](https://github.com/discordplace/discord.place/commit/9083f14e90a45b9d5240d92feb353c330dfad5ed))
* **UserProfile:** add missing parameters to getHashFromURL function calls ([#120](https://github.com/discordplace/discord.place/issues/120)) ([3caed84](https://github.com/discordplace/discord.place/commit/3caed84e1a9050894febcc8fc8d62911a3e86278))

## [1.3.2](https://github.com/discordplace/discord.place/compare/client@v1.3.1...client@v1.3.2) (2024-10-27)


### Bug Fixes

* **ImageFromHash:** show default avatar while current source loading ([#115](https://github.com/discordplace/discord.place/issues/115)) ([84fc408](https://github.com/discordplace/discord.place/commit/84fc408e5717f3cbfed56af1343ee2b76610bb14))
* **ImageFromHash:** show default avatar while current source loading to prevent framer motion bugs ([84fc408](https://github.com/discordplace/discord.place/commit/84fc408e5717f3cbfed56af1343ee2b76610bb14))
* **ThemeCard:** update class names to fix pointer events handling ([#117](https://github.com/discordplace/discord.place/issues/117)) ([7762745](https://github.com/discordplace/discord.place/commit/77627450da06ef19354b1a5204716ad3aaa6bbf3))
* use avatar_url instead of avatar in user profile page ([#112](https://github.com/discordplace/discord.place/issues/112)) ([2e056fa](https://github.com/discordplace/discord.place/commit/2e056fa0df34ba599f1f2a511243c565688267aa))
* **UserPage:** update avatar URL property to use camelCase ([#118](https://github.com/discordplace/discord.place/issues/118)) ([5ee91b8](https://github.com/discordplace/discord.place/commit/5ee91b83142b1fa7a4ab19b1192f73f9bc41ef0a))

## [1.3.1](https://github.com/discordplace/discord.place/compare/client@v1.3.0...client@v1.3.1) (2024-10-25)


### Bug Fixes

* adjust max-width for reminder text in ActiveReminders component ([#110](https://github.com/discordplace/discord.place/issues/110)) ([8fc0c6d](https://github.com/discordplace/discord.place/commit/8fc0c6da39eaf9030738c5883fe62c260a1378bd))

## [1.3.0](https://github.com/discordplace/discord.place/compare/client@v1.2.0...client@v1.3.0) (2024-10-25)


### Features

* add unique keys for avatars, icons and banners ([#109](https://github.com/discordplace/discord.place/issues/109)) ([9caca83](https://github.com/discordplace/discord.place/commit/9caca8354b0571d345753838ed21f6b1e24deb9e))
* add unique keys for avatars, icons and banners in ImageFromHash components ([9caca83](https://github.com/discordplace/discord.place/commit/9caca8354b0571d345753838ed21f6b1e24deb9e))
* redesign avatar/icon/banner components logic's ([#106](https://github.com/discordplace/discord.place/issues/106)) ([cfd5344](https://github.com/discordplace/discord.place/commit/cfd53441ee79e26ef4d0ff1f51ccd928630f9135))


### Bug Fixes

* correct hash extraction logic in getHashFromURL function ([#108](https://github.com/discordplace/discord.place/issues/108)) ([ed2c5bc](https://github.com/discordplace/discord.place/commit/ed2c5bc75ffbf484151b153990ece78c6e498b6e))

## [1.2.0](https://github.com/discordplace/discord.place/compare/client@v1.1.3...client@v1.2.0) (2024-10-24)


### Features

* redesign Active Reminders page with expandable details ([#104](https://github.com/discordplace/discord.place/issues/104)) ([c226257](https://github.com/discordplace/discord.place/commit/c226257b13349e4437219774b74ce57788b36af9))
* redesign Tooltip usage in premium page ([#102](https://github.com/discordplace/discord.place/issues/102)) ([f191366](https://github.com/discordplace/discord.place/commit/f1913661481fc5cd80b11e39a88d89b24b838460))

## [1.1.3](https://github.com/discordplace/discord.place/compare/client@v1.1.2...client@v1.1.3) (2024-10-24)


### Bug Fixes

* **pagination:** close input on blur and update page number ([#98](https://github.com/discordplace/discord.place/issues/98)) ([901c182](https://github.com/discordplace/discord.place/commit/901c18217a24cc79483820d1ddf6ea434807f5f4))

## [1.1.2](https://github.com/discordplace/discord.place/compare/client@v1.1.1...client@v1.1.2) (2024-10-23)


### Bug Fixes

* **pagination:** restrict input to numeric characters in pagination input ([66160af](https://github.com/discordplace/discord.place/commit/66160af51f048f88e6d34e79a902ad40283d83ee))
* **pagination:** set input type to text and input mode to numeric for pagination ([7294171](https://github.com/discordplace/discord.place/commit/72941717c2f924345de9e5e1314a700c3c20eaae))

## [1.1.1](https://github.com/discordplace/discord.place/compare/client@v1.1.0...client@v1.1.1) (2024-10-23)


### Bug Fixes

* **client/markdown:** allow line breaks in rendered markdown content ([#95](https://github.com/discordplace/discord.place/issues/95)) ([21ec323](https://github.com/discordplace/discord.place/commit/21ec3237f3091dbba8a5435a6eab373caf923fc9))

## [1.1.0](https://github.com/discordplace/discord.place/compare/client-v1.0.0...client@v1.1.0) (2024-10-22)


### Features

* Add initial configuration for commit linting and husky, update license format ([551f0a5](https://github.com/discordplace/discord.place/commit/551f0a5256b924ce2d6baed9bd475db11d1cacb6))
