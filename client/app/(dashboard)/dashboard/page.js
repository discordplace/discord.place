'use client';

import { BiCloudDownload, BiSolidCategory } from 'react-icons/bi';
import { BsStars } from 'react-icons/bs';
import { CgBlock, CgFormatSlash } from 'react-icons/cg';
import { FaCompass, FaCrown, FaEye, FaUserCircle } from 'react-icons/fa';
import { FiArrowRightCircle, FiArrowUpRight, FiLink } from 'react-icons/fi';
import { HiTemplate } from 'react-icons/hi';
import { HiMiniIdentification } from 'react-icons/hi2';
import { IoMdCheckmarkCircle, IoMdCloseCircle, IoMdUndo } from 'react-icons/io';
import { MdAlternateEmail, MdEmojiEmotions, MdOpenInNew, MdRefresh, MdStarRate, MdTimer, MdVisibility } from 'react-icons/md';
import { PiWaveformBold } from 'react-icons/pi';
import { RiGroup2Fill, RiPencilFill } from 'react-icons/ri';
import { TbLockPlus } from 'react-icons/tb';
import useAuthStore from '@/stores/auth';
import { useEffect } from 'react';
import { useRouter } from 'next-nprogress-bar';
import Sidebar from '@/app/(dashboard)/components/Sidebar';
import Home from '@/app/(dashboard)/components/Home';
import useDashboardStore from '@/stores/dashboard';
import useThemeStore from '@/stores/theme';
import { motion, AnimatePresence } from 'framer-motion';
import MotionImage from '@/app/components/Motion/Image';
import Queue from '@/app/(dashboard)/components/Queue';
import downloadEmoji from '@/lib/utils/emojis/downloadEmoji';
import { showConfirmationModal, approveEmoji, denyEmoji, deleteEmoji, approveBot, denyBot, deleteBot, approveTemplate, denyTemplate, deleteTemplate, approveSound, denySound, deleteSound, approveReview, denyReview, deleteReview, approveTheme, denyTheme, deleteTheme, deleteLink, deleteBotDenyRecord, restoreBot, deleteBotTimeout, deleteServerTimeout, deleteQuarantineRecord } from '@/app/(dashboard)/dashboard/utils';
import DenyDropdown from '@/app/(dashboard)/components/Dropdown/Deny';
import config from '@/config';
import sleep from '@/lib/sleep';
import { useShallow } from 'zustand/react/shallow';
import CreateQuarantineModal from '@/app/(dashboard)//components/CreateQuarantineModal';
import useModalsStore from '@/stores/modals';
import { toast } from 'sonner';
import getHashes from '@/lib/request/general/getHashes';

export default function Page() {
  const user = useAuthStore(state => state.user);
  const loggedIn = useAuthStore(state => state.loggedIn);
  const router = useRouter();

  useEffect(() => {
    if (loggedIn && !user.can_view_dashboard) return router.push('/error?code=401');
  }, [loggedIn, user]);

  const { activeTab, loading, setLoading, data, selectedItems, setSelectedItems, setPage } = useDashboardStore(useShallow(state => ({
    activeTab: state.activeTab,
    data: state.data,
    loading: state.loading,
    selectedItems: state.selectedItems,
    setLoading: state.setLoading,
    setPage: state.setPage,
    setSelectedItems: state.setSelectedItems
  })));

  const openModal = useModalsStore(state => state.openModal);

  async function bulkAction(params) {
    const { selectedItems } = useDashboardStore.getState();
    const data = selectedItems;

    setSelectedItems([]);
    setPage(1);
    setLoading(true);

    if (data.length === 1) {
      const paramsToPass = data[0][0];

      await params.action(paramsToPass);

      setLoading(true);

      await sleep(config.dashboardRequestDelay);

      fetchData([params.fetchKey]);
    } else {
      for (const item of data) {
        params.action(item[0]);

        await sleep(config.dashboardRequestDelay);

        if (data.indexOf(item) === data.length - 1) fetchData([params.fetchKey]);
      }
    }
  }

  async function bulkActionWithConfirmationModal(params) {
    return showConfirmationModal(
      `You are about to delete ${selectedItems.length} ${params.name}${selectedItems.length > 1 ? 's' : ''}. This action is irreversible.`,
      async () => {
        bulkAction(params);
      }
    );
  }

  const tabs = [
    {
      component: <Home />,
      id: 'home',
      name: 'Home'
    },
    {
      data: {
        subtitle: 'Here you can see the all the users that have logged in to discord.place.',
        tableData: {
          tabs: [
            {
              actions: [
                {
                  action: () => {
                    const column = useDashboardStore.getState().selectedItems[0];

                    setSelectedItems([]);
                    setPage(1);

                    router.push(`/profile/u/${column[0].id}`);
                  },
                  icon: FaEye,
                  name: 'View User'
                },
                {
                  action: () => bulkAction({
                    action: item => {
                      toast.promise(getHashes(item.id), {
                        error: error => error,
                        loading: `Refreshing ${item.username}'s hashes...`,
                        success: `Successfully refreshed ${item.username}'s hashes.`
                      });
                    },
                    fetchKey: 'users'
                  }),
                  hide: !data.permissions?.canRefreshHashes,
                  icon: MdRefresh,
                  name: 'Refresh Hashes'
                }
              ],
              columns: data?.users?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(user => [
                {
                  avatar: user.avatar,
                  id: user.id,
                  searchValues: [user.username, user.id],
                  showId: true,
                  type: 'user',
                  username: user.username
                },
                {
                  type: 'userSubscription',
                  value: user.subscription || null
                },
                {
                  searchValues: [user.email],
                  type: 'email',
                  value: user.email || 'N/A'
                },
                {
                  type: 'date',
                  value: new Date(user.createdAt)
                },
                {
                  type: 'date',
                  value: new Date(user.lastLoginAt)
                },
                {
                  type: 'date',
                  value: new Date(user.lastLogoutAt)
                }
              ]),
              label: 'Users',
              rows: [
                {
                  icon: HiMiniIdentification,
                  name: 'User',
                  sortable: true
                },
                {
                  icon: BsStars,
                  name: 'Subscription',
                  sortable: true
                },
                {
                  icon: MdAlternateEmail,
                  name: 'Email',
                  sortable: true
                },
                {
                  icon: FiArrowRightCircle,
                  name: 'Date Added',
                  sortable: true
                },
                {
                  icon: FiArrowRightCircle,
                  name: 'Last Login',
                  sortable: true
                },
                {
                  icon: FiArrowRightCircle,
                  name: 'Last Logout',
                  sortable: true
                }
              ]
            }
          ]
        },
        title: 'Users',
        totalCount: data?.users?.length || 0
      },
      id: 'users',
      name: 'Users'
    },
    {
      data: {
        subtitle: 'Here you can see the all the guilds that have been added discord.place bot to.',
        tableData: {
          tabs: [
            {
              columns: data?.guilds?.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()).map(guild => [
                {
                  icon: guild.icon,
                  id: guild.id,
                  name: guild.name,
                  searchValues: [guild.name, guild.id],
                  showId: true,
                  type: 'server'
                },
                {
                  searchValues: [guild.memberCount],
                  type: 'number',
                  value: guild.memberCount
                },
                {
                  type: 'date',
                  value: new Date(guild.joinedAt)
                }
              ]),
              label: 'Guilds',
              rows: [
                {
                  icon: FaCompass,
                  name: 'Guild',
                  sortable: true
                },
                {
                  icon: RiGroup2Fill,
                  name: 'Members',
                  sortable: true
                },
                {
                  icon: FiArrowRightCircle,
                  name: 'Date Joined',
                  sortable: true
                }
              ]
            }
          ]
        },
        title: 'Guilds',
        totalCount: data?.guilds?.length || 0
      },
      id: 'guilds',
      name: 'Guilds'
    },
    {
      data: {
        subtitle: 'Here you can see the all the emojis that published on discord.place.',
        tableData: {
          tabs: [
            {
              actions: [
                {
                  action: () => {
                    const column = useDashboardStore.getState().selectedItems[0];

                    router.push(`/emojis/${column[0].emoji_ids ? 'packages/' : ''}${column[0].id}`);
                  },
                  icon: FaEye,
                  name: 'View Emoji'
                },
                {
                  action: () => bulkAction({
                    action: item => approveEmoji(item.id),
                    fetchKey: 'emojis'
                  }),
                  hide: !data.permissions?.canApproveEmojis,
                  icon: IoMdCheckmarkCircle,
                  name: 'Approve'
                },
                {
                  hide: !data.permissions?.canApproveEmojis,
                  icon: IoMdCloseCircle,
                  name: 'Deny',
                  trigger: DenyDropdown,
                  triggerProps: {
                    description: 'Please select a reason to deny.',
                    onDeny: reason => bulkAction({
                      action: item => denyEmoji(item.id, reason),
                      fetchKey: 'emojis'
                    }),
                    reasons: config.emojisDenyReasons
                  }
                }
              ],
              columns: data?.queue?.emojis?.filter(emoji => !emoji.approved).map(emoji => [
                {
                  animated: emoji.animated,
                  emoji_ids: emoji.emoji_ids,
                  id: emoji.id,
                  name: emoji.name,
                  searchValues: emoji.emoji_ids ?
                    [emoji.name, ...emoji.emoji_ids, emoji.emoji_ids.some(({ animated }) => animated) ? 'animated' : 'static'] :
                    [emoji.name, emoji.id, emoji.animated ? 'animated' : 'static'],
                  showId: true,
                  type: emoji.emoji_ids ? 'emojiPack' : 'emoji'
                },
                {
                  avatar: emoji.user.avatar,
                  id: emoji.user.id,
                  searchValues: [emoji.user.username, emoji.user.id],
                  showId: true,
                  type: 'user',
                  username: emoji.user.username
                },
                {
                  type: 'date',
                  value: new Date(emoji.created_at)
                }
              ]),
              label: 'Waiting Approval',
              rows: [
                {
                  icon: MdEmojiEmotions,
                  name: 'Emoji'
                },
                {
                  icon: FaUserCircle,
                  name: 'Publisher',
                  sortable: true
                },
                {
                  icon: FiArrowRightCircle,
                  name: 'Date Added',
                  sortable: true
                }
              ]
            },
            {
              actions: [
                {
                  action: () => {
                    const column = useDashboardStore.getState().selectedItems[0];

                    setSelectedItems([]);
                    setPage(1);

                    router.push(`/emojis/${column[0].emoji_ids ? 'packages/' : ''}${column[0].id}`);
                  },
                  icon: FaEye,
                  name: 'View Emoji'
                },
                {
                  action: () => {
                    const columns = useDashboardStore.getState().selectedItems;

                    setSelectedItems([]);
                    setPage(1);

                    columns.forEach(column => downloadEmoji(column[0]));
                  },
                  icon: BiCloudDownload,
                  name: 'Download'
                },
                {
                  action: () => bulkActionWithConfirmationModal({
                    action: item => deleteEmoji(item.id),
                    fetchKey: 'emojis',
                    name: 'emoji'
                  }),
                  hide: !data.permissions?.canDeleteEmojis,
                  icon: IoMdCloseCircle,
                  name: 'Delete'
                }
              ],
              columns: data?.queue?.emojis?.filter(emoji => emoji.approved).map(emoji => [
                {
                  animated: emoji.animated,
                  emoji_ids: emoji.emoji_ids,
                  id: emoji.id,
                  name: emoji.name,
                  searchValues: emoji.emoji_ids ?
                    [emoji.name, ...emoji.emoji_ids, emoji.emoji_ids.some(({ animated }) => animated) ? 'animated' : 'static'] :
                    [emoji.name, emoji.id, emoji.animated ? 'animated' : 'static'],
                  type: emoji.emoji_ids ? 'emojiPack' : 'emoji'
                },
                {
                  avatar: emoji.user.avatar,
                  id: emoji.user.id,
                  searchValues: [emoji.user.username, emoji.user.id],
                  showId: true,
                  type: 'user',
                  username: emoji.user.username
                },
                {
                  type: 'date',
                  value: new Date(emoji.created_at)
                }
              ]),
              label: 'Approved',
              rows: [
                {
                  icon: MdEmojiEmotions,
                  name: 'Emoji'
                },
                {
                  icon: FaUserCircle,
                  name: 'Publisher',
                  sortable: true
                },
                {
                  icon: FiArrowRightCircle,
                  name: 'Date Added',
                  sortable: true
                }
              ]
            }
          ]
        },
        title: 'Emojis Queue',
        totalCount: data?.queue?.emojis?.length || 0
      },
      id: 'emojisQueue',
      name: 'Emojis Queue'
    },
    {
      data: {
        subtitle: 'Here you can see the all the bots that listed on discord.place.',
        tableData: {
          tabs: [
            {
              actions: [
                {
                  action: () => {
                    const column = useDashboardStore.getState().selectedItems[0];

                    setSelectedItems([]);
                    setPage(1);

                    window.open(`https://discord.com/oauth2/authorize?client_id=${column[0].id}&permissions=0&integration_type=0&scope=bot+applications.commands&guild_id=${config.botTestGuildId}&disable_guild_select=true`, '_blank');
                  },
                  icon: FiArrowUpRight,
                  name: 'Invite Bot'
                },
                {
                  action: () => bulkAction({
                    action: item => approveBot(item.id),
                    fetchKey: 'bots'
                  }),
                  hide: !data.permissions?.canApproveBots,
                  icon: IoMdCheckmarkCircle,
                  name: 'Approve'
                },
                {
                  hide: !data.permissions?.canApproveBots,
                  icon: IoMdCloseCircle,
                  name: 'Deny',
                  trigger: DenyDropdown,
                  triggerProps: {
                    description: 'Please select a reason to deny.',
                    onDeny: reason => bulkAction({
                      action: item => denyBot(item.id, reason),
                      fetchKey: 'bots'
                    }),
                    reasons: config.botsDenyReasons
                  }
                }
              ],
              columns: data?.queue?.bots?.filter(bot => !bot.verified).map(bot => [
                {
                  avatar: bot.avatar,
                  discriminator: bot.discriminator,
                  id: bot.id,
                  searchValues: [bot.username, bot.id],
                  showId: true,
                  type: 'bot',
                  username: bot.username
                },
                {
                  avatar: bot.owner.avatar,
                  id: bot.owner.id,
                  searchValues: [bot.owner.username, bot.owner.id],
                  showId: true,
                  type: 'user',
                  username: bot.owner.username
                },
                {
                  iconsKey: 'botCategoriesIcons',
                  searchValues: bot.categories,
                  type: 'category',
                  value: bot.categories
                },
                {
                  type: 'date',
                  value: new Date(bot.created_at)
                }
              ]),
              label: 'Waiting Approval',
              rows: [
                {
                  icon: FaUserCircle,
                  name: 'Bot',
                  sortable: true
                },
                {
                  icon: FaCrown,
                  name: 'Owner',
                  sortable: true
                },
                {
                  icon: BiSolidCategory,
                  name: 'Categories',
                  sortable: true
                },
                {
                  icon: FiArrowRightCircle,
                  name: 'Date Added'
                }
              ]
            },
            {
              actions: [
                {
                  action: () => {
                    const column = useDashboardStore.getState().selectedItems[0];

                    setSelectedItems([]);
                    setPage(1);

                    router.push(`/bots/${column[0].id}`);
                  },
                  icon: FaEye,
                  name: 'View Bot'
                },
                {
                  action: () => bulkActionWithConfirmationModal({
                    action: item => deleteBot(item.id),
                    fetchKey: 'bots',
                    name: 'bot'
                  }),
                  hide: !data.permissions?.canDeleteBots,
                  icon: IoMdCloseCircle,
                  name: 'Delete'
                }
              ],
              columns: data?.queue?.bots?.filter(bot => bot.verified).map(bot => [
                {
                  avatar: bot.avatar,
                  discriminator: bot.discriminator,
                  id: bot.id,
                  searchValues: [bot.username, bot.id],
                  showId: true,
                  type: 'bot',
                  username: bot.username
                },
                {
                  avatar: bot.owner.avatar,
                  id: bot.owner.id,
                  searchValues: [bot.owner.username, bot.owner.id],
                  showId: true,
                  type: 'user',
                  username: bot.owner.username
                },
                {
                  iconsKey: 'botCategoriesIcons',
                  searchValues: bot.categories,
                  type: 'category',
                  value: bot.categories
                },
                {
                  type: 'date',
                  value: new Date(bot.created_at)
                }
              ]),
              label: 'Approved',
              rows: [
                {
                  icon: FaUserCircle,
                  name: 'Bot',
                  sortable: true
                },
                {
                  icon: FaCrown,
                  name: 'Owner',
                  sortable: true
                },
                {
                  icon: BiSolidCategory,
                  name: 'Categories',
                  sortable: true
                },
                {
                  icon: FiArrowRightCircle,
                  name: 'Date Added',
                  sortable: true
                }
              ]
            }
          ]
        },
        title: 'Bots Queue',
        totalCount: data?.queue?.bots?.length || 0
      },
      id: 'botsQueue',
      name: 'Bots Queue'
    },
    {
      data: {
        subtitle: 'Here you can see the all the templates that published on discord.place.',
        tableData: {
          tabs: [
            {
              actions: [
                {
                  action: () => {
                    const column = useDashboardStore.getState().selectedItems[0];

                    setSelectedItems([]);
                    setPage(1);

                    router.push(`/templates/${column[0].id}/preview`);
                  },
                  icon: FaEye,
                  name: 'Template Preview'
                },
                {
                  action: () => bulkAction({
                    action: item => approveTemplate(item.id),
                    fetchKey: 'templates'
                  }),
                  hide: !data.permissions?.canApproveTemplates,
                  icon: IoMdCheckmarkCircle,
                  name: 'Approve'
                },
                {
                  hide: !data.permissions?.canApproveTemplates,
                  icon: IoMdCloseCircle,
                  name: 'Deny',
                  trigger: DenyDropdown,
                  triggerProps: {
                    description: 'Please select a reason to deny.',
                    onDeny: reason => bulkAction({
                      action: item => denyTemplate(item.id, reason),
                      fetchKey: 'templates'
                    }),
                    reasons: config.templatesDenyReasons
                  }
                }
              ],
              columns: data?.queue?.templates?.filter(template => !template.approved).map(template => [
                {
                  id: template.id,
                  name: template.name,
                  searchValues: [template.name, template.id],
                  type: 'template'
                },
                {
                  avatar: template.user.avatar,
                  id: template.user.id,
                  searchValues: [template.user.username, template.user.id],
                  showId: true,
                  type: 'user',
                  username: template.user.username
                },
                {
                  iconsKey: 'templateCategoriesIcons',
                  searchValues: template.categories,
                  type: 'category',
                  value: template.categories
                },
                {
                  type: 'date',
                  value: new Date(template.created_at)
                }
              ]),
              label: 'Waiting Approval',
              rows: [
                {
                  icon: HiTemplate,
                  name: 'Template',
                  sortable: true
                },
                {
                  icon: FaUserCircle,
                  name: 'Publisher',
                  sortable: true
                },
                {
                  icon: BiSolidCategory,
                  name: 'Categories',
                  sortable: true
                },
                {
                  icon: FiArrowRightCircle,
                  name: 'Date Added',
                  sortable: true
                }
              ]
            },
            {
              actions: [
                {
                  action: () => {
                    const column = useDashboardStore.getState().selectedItems[0];

                    setSelectedItems([]);
                    setPage(1);

                    router.push(`/templates/${column[0].id}/preview`);
                  },
                  icon: FaEye,
                  name: 'Template Preview'
                },
                {
                  action: () => bulkActionWithConfirmationModal({
                    action: item => deleteTemplate(item.id),
                    fetchKey: 'templates',
                    name: 'template'
                  }),
                  hide: !data.permissions?.canDeleteTemplates,
                  icon: IoMdCloseCircle,
                  name: 'Delete'
                }
              ],
              columns: data?.queue?.templates?.filter(template => template.approved).map(template => [
                {
                  id: template.id,
                  name: template.name,
                  searchValues: [template.name, template.id],
                  type: 'template'
                },
                {
                  avatar: template.user.avatar,
                  id: template.user.id,
                  searchValues: [template.user.username, template.user.id],
                  showId: true,
                  type: 'user',
                  username: template.user.username
                },
                {
                  iconsKey: 'templateCategoriesIcons',
                  searchValues: template.categories,
                  type: 'category',
                  value: template.categories
                },
                {
                  type: 'date',
                  value: new Date(template.created_at)
                }
              ]),
              label: 'Approved',
              rows: [
                {
                  icon: HiTemplate,
                  name: 'Template',
                  sortable: true
                },
                {
                  icon: FaUserCircle,
                  name: 'Publisher',
                  sortable: true
                },
                {
                  icon: BiSolidCategory,
                  name: 'Categories',
                  sortable: true
                },
                {
                  icon: FiArrowRightCircle,
                  name: 'Date Added',
                  sortable: true
                }
              ]
            }
          ]
        },
        title: 'Templates Queue',
        totalCount: data?.queue?.templates?.length || 0
      },
      id: 'templatesQueue',
      name: 'Templates Queue'
    },
    {
      data: {
        subtitle: 'Here you can see the all the sounds that published on discord.place.',
        tableData: {
          tabs: [
            {
              actions: [
                {
                  action: () => {
                    const column = useDashboardStore.getState().selectedItems[0];

                    setSelectedItems([]);
                    setPage(1);

                    router.push(`/sounds/${column[0].id}`);
                  },
                  icon: FaEye,
                  name: 'View Sound'
                },
                {
                  action: () => bulkAction({
                    action: item => approveSound(item.id),
                    data: data.queue.sounds,
                    fetchKey: 'sounds'
                  }),
                  hide: !data.permissions?.canApproveSounds,
                  icon: IoMdCheckmarkCircle,
                  name: 'Approve'
                },
                {
                  hide: !data.permissions?.canApproveSounds,
                  icon: IoMdCloseCircle,
                  name: 'Deny',
                  trigger: DenyDropdown,
                  triggerProps: {
                    description: 'Please select a reason to deny.',
                    onDeny: reason => bulkAction({
                      action: item => denySound(item.id, reason),
                      fetchKey: 'sounds'
                    }),
                    reasons: config.soundsDenyReasons
                  }
                }
              ],
              columns: data?.queue?.sounds?.filter(sound => !sound.approved).map(sound => [
                {
                  id: sound.id,
                  name: sound.name,
                  searchValues: [sound.name, sound.id],
                  type: 'sound'
                },
                {
                  avatar: sound.publisher.avatar,
                  id: sound.publisher.id,
                  searchValues: [sound.publisher.username, sound.publisher.id],
                  showId: true,
                  type: 'user',
                  username: sound.publisher.username
                },
                {
                  iconsKey: 'soundCategoriesIcons',
                  searchValues: sound.categories,
                  type: 'category',
                  value: sound.categories
                },
                {
                  type: 'date',
                  value: new Date(sound.createdAt)
                }
              ]),
              label: 'Waiting Approval',
              rows: [
                {
                  icon: PiWaveformBold,
                  name: 'Sound',
                  sortable: true
                },
                {
                  icon: FaUserCircle,
                  name: 'Publisher',
                  sortable: true
                },
                {
                  icon: BiSolidCategory,
                  name: 'Categories',
                  sortable: true
                },
                {
                  icon: FiArrowRightCircle,
                  name: 'Date Added',
                  sortable: true
                }
              ]
            },
            {
              actions: [
                {
                  action: () => {
                    const column = useDashboardStore.getState().selectedItems[0];

                    setSelectedItems([]);
                    setPage(1);

                    router.push(`/sounds/${column[0].id}`);
                  },
                  icon: FaEye,
                  name: 'View Sound'
                },
                {
                  action: () => bulkActionWithConfirmationModal({
                    action: item => deleteSound(item.id),
                    fetchKey: 'sounds',
                    name: 'sound'
                  }),
                  hide: !data.permissions?.canDeleteSounds,
                  icon: IoMdCloseCircle,
                  name: 'Delete'
                }
              ],
              columns: data?.queue?.sounds?.filter(sound => sound.approved).map(sound => [
                {
                  id: sound.id,
                  name: sound.name,
                  searchValues: [sound.name, sound.id],
                  type: 'sound'
                },
                {
                  avatar: sound.publisher.avatar,
                  id: sound.publisher.id,
                  searchValues: [sound.publisher.username, sound.publisher.id],
                  showId: true,
                  type: 'user',
                  username: sound.publisher.username
                },
                {
                  iconsKey: 'soundCategoriesIcons',
                  searchValues: sound.categories,
                  type: 'category',
                  value: sound.categories
                },
                {
                  type: 'date',
                  value: new Date(sound.createdAt)
                }
              ]),
              label: 'Approved',
              rows: [
                {
                  icon: PiWaveformBold,
                  name: 'Sound',
                  sortable: true
                },
                {
                  icon: FaUserCircle,
                  name: 'Publisher',
                  sortable: true
                },
                {
                  icon: BiSolidCategory,
                  name: 'Categories',
                  sortable: true
                },
                {
                  icon: FiArrowRightCircle,
                  name: 'Date Added',
                  sortable: true
                }
              ]
            }
          ]
        },
        title: 'Sounds Queue',
        totalCount: data?.queue?.sounds?.length || 0
      },
      id: 'soundsQueue',
      name: 'Sounds Queue'
    },
    {
      data: {
        subtitle: 'Here you can see the all the reviews that published on discord.place.',
        tableData: {
          tabs: [
            {
              actions: [
                {
                  action: () => {
                    const [column] = useDashboardStore.getState().selectedItems[0];

                    setSelectedItems([]);
                    setPage(1);

                    router.push(`/${column.custom.type === 'server' ? 'servers' : 'bots'}/${column.value}`);
                  },
                  icon: FaEye,
                  name: 'View Server/Bot'
                },
                {
                  action: () => bulkAction({
                    action: item => approveReview(item.custom.type, item.value, item.custom.id),
                    data: data.queue.reviews,
                    fetchKey: 'reviews'
                  }),
                  hide: !data.permissions?.canApproveReviews,
                  icon: IoMdCheckmarkCircle,
                  name: 'Approve'
                },
                {
                  hide: !data.permissions?.canApproveReviews,
                  icon: IoMdCloseCircle,
                  name: 'Deny',
                  trigger: DenyDropdown,
                  triggerProps: {
                    customReason: true,
                    description: 'Add a custom reason to deny this review.',
                    onDeny: reason => bulkAction({
                      action: item => denyReview(item.custom.type, item.value, item.custom.id, reason),
                      fetchKey: 'reviews'
                    }),
                    reasons: {}
                  }
                }
              ],
              columns: data?.queue?.reviews?.filter(review => !review.approved).map(review => [
                {
                  custom: {
                    id: review._id,
                    type: review.server ? 'server' : 'bot'
                  },
                  searchValues: [review.server ? review.server.id : review.bot.id],
                  type: 'text',
                  value: review.server ? review.server.id : review.bot.id
                },
                {
                  avatar: review.user.avatar,
                  id: review.user.id,
                  searchValues: [review.user.username, review.user.id],
                  showId: true,
                  type: 'user',
                  username: review.user.username
                },
                {
                  searchValues: [`${review.rating} star${review.rating > 1 ? 's' : ''}`],
                  type: 'rating',
                  value: review.rating
                },
                {
                  searchValues: [review.content],
                  type: 'long-text',
                  value: review.content
                },
                {
                  type: 'date',
                  value: new Date(review.createdAt)
                }
              ]),
              label: 'Waiting Approval',
              rows: [
                {
                  icon: FaCompass,
                  name: 'Server/Bot ID'
                },
                {
                  icon: FaUserCircle,
                  name: 'User',
                  sortable: true
                },
                {
                  icon: MdStarRate,
                  name: 'Rating',
                  sortable: true
                },
                {
                  icon: FaEye,
                  name: 'Content'
                },
                {
                  icon: FiArrowRightCircle,
                  name: 'Date Added',
                  sortable: true
                }
              ]
            },
            {
              actions: [
                {
                  action: () => {
                    const [column] = useDashboardStore.getState().selectedItems[0];

                    setSelectedItems([]);
                    setPage(1);

                    router.push(`/${column.custom.type === 'server' ? 'servers' : 'bots'}/${column.value}`);
                  },
                  icon: FaEye,
                  name: 'View Server/Bot'
                },
                {
                  action: () => bulkActionWithConfirmationModal({
                    action: item => deleteReview(item.custom.type, item.value, item.custom.id),
                    fetchKey: 'reviews',
                    name: 'review'
                  }),
                  hide: !data.permissions?.canDeleteReviews,
                  icon: IoMdCloseCircle,
                  name: 'Delete'
                }
              ],
              columns: data?.queue?.reviews?.filter(review => review.approved).map(review => [
                {
                  custom: {
                    id: review._id,
                    type: review.server ? 'server' : 'bot'
                  },
                  searchValues: [review.server ? review.server.id : review.bot.id],
                  type: 'text',
                  value: review.server ? review.server.id : review.bot.id
                },
                {
                  avatar: review.user.avatar,
                  id: review.user.id,
                  searchValues: [review.user.username, review.user.id],
                  showId: true,
                  type: 'user',
                  username: review.user.username
                },
                {
                  searchValues: [`${review.rating} star${review.rating > 1 ? 's' : ''}`],
                  type: 'rating',
                  value: review.rating
                },
                {
                  searchValues: [review.content],
                  type: 'long-text',
                  value: review.content
                },
                {
                  type: 'date',
                  value: new Date(review.createdAt)
                }
              ]),
              label: 'Approved',
              rows: [
                {
                  icon: FaCompass,
                  name: 'Server/Bot ID'
                },
                {
                  icon: FaUserCircle,
                  name: 'User',
                  sortable: true
                },
                {
                  icon: MdStarRate,
                  name: 'Rating',
                  sortable: true
                },
                {
                  icon: FaEye,
                  name: 'Content'
                },
                {
                  icon: FiArrowRightCircle,
                  name: 'Date Added',
                  sortable: true
                }
              ]
            }
          ]
        },
        title: 'Reviews Queue',
        totalCount: data?.queue?.reviews?.length || 0
      },
      id: 'reviewsQueue',
      name: 'Reviews Queue'
    },
    {
      data: {
        subtitle: 'Here you can see the all the themes that published on discord.place.',
        tableData: {
          tabs: [
            {
              actions: [
                {
                  action: () => {
                    const column = useDashboardStore.getState().selectedItems[0];

                    setSelectedItems([]);
                    setPage(1);

                    router.push(`/themes/${column[0].id}`);
                  },
                  icon: FaEye,
                  name: 'View Theme'
                },
                {
                  action: () => bulkAction({
                    action: item => approveTheme(item.id),
                    fetchKey: 'themes'
                  }),
                  hide: !data.permissions?.canApproveThemes,
                  icon: IoMdCheckmarkCircle,
                  name: 'Approve'
                },
                {
                  hide: !data.permissions?.canApproveThemes,
                  icon: IoMdCloseCircle,
                  name: 'Deny',
                  trigger: DenyDropdown,
                  triggerProps: {
                    description: 'Please select a reason to deny.',
                    onDeny: reason => bulkAction({
                      action: item => denyTheme(item.id, reason),
                      fetchKey: 'themes'
                    }),
                    reasons: config.themesDenyReasons
                  }
                }
              ],
              columns: data?.queue?.themes?.filter(theme => !theme.approved).map(theme => [
                {
                  colors: theme.colors,
                  id: theme.id,
                  searchValues: [theme.colors.primary, theme.colors.secondary],
                  type: 'theme'
                },
                {
                  avatar: theme.publisher.avatar,
                  id: theme.publisher.id,
                  searchValues: [theme.publisher.username, theme.publisher.id],
                  showId: true,
                  type: 'user',
                  username: theme.publisher.username
                },
                {
                  iconsKey: 'themeCategoriesIcons',
                  searchValues: theme.categories,
                  type: 'category',
                  value: theme.categories
                },
                {
                  type: 'date',
                  value: new Date(theme.createdAt)
                }
              ]),
              label: 'Waiting Approval',
              rows: [
                {
                  icon: HiTemplate,
                  name: 'Theme',
                  sortable: true
                },
                {
                  icon: FaUserCircle,
                  name: 'Publisher',
                  sortable: true
                },
                {
                  icon: BiSolidCategory,
                  name: 'Categories',
                  sortable: true
                },
                {
                  icon: FiArrowRightCircle,
                  name: 'Date Added',
                  sortable: true
                }
              ]
            },
            {
              actions: [
                {
                  action: () => {
                    const column = useDashboardStore.getState().selectedItems[0];

                    setSelectedItems([]);
                    setPage(1);

                    router.push(`/themes/${column[0].id}`);
                  },
                  icon: FaEye,
                  name: 'View Theme'
                },
                {
                  action: () => bulkActionWithConfirmationModal({
                    action: item => deleteTheme(item.id),
                    fetchKey: 'themes',
                    name: 'theme'
                  }),
                  hide: !data.permissions?.canDeleteThemes,
                  icon: IoMdCloseCircle,
                  name: 'Delete'
                }
              ],
              columns: data?.queue?.themes?.filter(theme => theme.approved).map(theme => [
                {
                  colors: theme.colors,
                  id: theme.id,
                  searchValues: [theme.colors.primary, theme.colors.secondary],
                  type: 'theme'
                },
                {
                  avatar: theme.publisher.avatar,
                  id: theme.publisher.id,
                  searchValues: [theme.publisher.username, theme.publisher.id],
                  showId: true,
                  type: 'user',
                  username: theme.publisher.username
                },
                {
                  iconsKey: 'themeCategoriesIcons',
                  searchValues: theme.categories,
                  type: 'category',
                  value: theme.categories
                },
                {
                  type: 'date',
                  value: new Date(theme.createdAt)
                }
              ]),
              label: 'Approved',
              rows: [
                {
                  icon: HiTemplate,
                  name: 'Theme',
                  sortable: true
                },
                {
                  icon: FaUserCircle,
                  name: 'Publisher',
                  sortable: true
                },
                {
                  icon: BiSolidCategory,
                  name: 'Categories',
                  sortable: true
                },
                {
                  icon: FiArrowRightCircle,
                  name: 'Date Added',
                  sortable: true
                }
              ]
            }
          ]
        },
        title: 'Themes Queue',
        totalCount: data?.queue?.themes?.length || 0
      },
      id: 'themesQueue',
      name: 'Themes Queue'
    },
    {
      data: {
        subtitle: 'Here you can see the all the links that have been created.',
        tableData: {
          tabs: [
            {
              actions: [
                {
                  action: () => {
                    const column = useDashboardStore.getState().selectedItems[0];

                    setSelectedItems([]);
                    setPage(1);

                    window.open(column[0].redirectTo, '_blank');
                  },
                  icon: MdOpenInNew,
                  name: 'Visit'
                },
                {
                  action: () => bulkActionWithConfirmationModal({
                    action: item => deleteLink(item.id),
                    fetchKey: 'links',
                    name: 'link'
                  }),
                  hide: !data.permissions?.canDeleteLinks,
                  icon: IoMdCloseCircle,
                  name: 'Delete'
                }
              ],
              columns: data?.links?.map(item => [
                {
                  name: item.name,
                  redirectTo: item.redirectTo,
                  searchValues: [item.name, item.redirectTo],
                  type: 'link'
                },
                {
                  searchValues: [item.visits],
                  type: 'number',
                  value: item.visits
                },
                {
                  avatar: item.createdBy.avatar,
                  id: item.createdBy.id,
                  searchValues: [item.createdBy.username, item.createdBy.id],
                  showId: true,
                  type: 'user',
                  username: item.createdBy.username
                },
                {
                  type: 'date',
                  value: new Date(item.createdAt)
                }
              ]),
              label: 'Links',
              rows: [
                {
                  icon: FiLink,
                  name: 'URL',
                  sortable: true
                },
                {
                  icon: MdVisibility,
                  name: 'Visits',
                  sortable: true
                },
                {
                  icon: FaUserCircle,
                  name: 'Created By',
                  sortable: true
                },
                {
                  icon: FiArrowRightCircle,
                  name: 'Date Added',
                  sortable: true
                }
              ]
            }
          ]
        },
        title: 'Links',
        totalCount: data?.links?.length || 0
      },
      id: 'links',
      name: 'Links'
    },
    {
      data: {
        subtitle: 'Here you can see the all the bot denies that have been recorded. (last 7 days only)',
        tableData: {
          tabs: [
            {
              actions: [
                {
                  action: () => {
                    const column = useDashboardStore.getState().selectedItems[0];

                    setSelectedItems([]);
                    setPage(1);

                    router.push(`/bots/${column[0].id}`);
                  },
                  icon: FaEye,
                  name: 'View Bot'
                },
                {
                  action: () => bulkActionWithConfirmationModal({
                    action: item => deleteBotDenyRecord(item.id),
                    fetchKey: 'botdenies',
                    name: 'bot deny'
                  }),
                  hide: !data.permissions?.canDeleteBotDenies,
                  icon: IoMdCloseCircle,
                  name: 'Delete'
                },
                {
                  action: () => bulkAction({
                    action: item => restoreBot(item.id),
                    fetchKey: 'botdenies'
                  }),
                  hide: !data.permissions?.canRestoreBotDenies,
                  icon: IoMdUndo,
                  name: 'Restore'
                }
              ],
              columns: data?.botDenies?.map(item => [
                {
                  avatar: item.bot.avatar,
                  discriminator: item.bot.discriminator,
                  id: item.bot.id,
                  searchValues: [item.bot.username, item.bot.id],
                  showId: true,
                  type: 'bot',
                  username: item.bot.username
                },
                {
                  avatar: item.user.avatar,
                  id: item.user.id,
                  searchValues: [item.user.username, item.user.id],
                  showId: true,
                  type: 'user',
                  username: item.user.username
                },
                {
                  avatar: item.reviewer.avatar,
                  id: item.reviewer.id,
                  searchValues: [item.reviewer.username, item.reviewer.id],
                  showId: true,
                  type: 'user',
                  username: item.reviewer.username
                },
                {
                  searchValues: [item.reason],
                  type: 'reason',
                  value: item.reason
                },
                {
                  type: 'date',
                  value: new Date(item.createdAt)
                }
              ]),
              label: 'Denied Bots',
              rows: [
                {
                  icon: FaUserCircle,
                  name: 'Bot',
                  sortable: true
                },
                {
                  icon: FaUserCircle,
                  name: 'User',
                  sortable: true
                },
                {
                  icon: FaUserCircle,
                  name: 'Reviewer',
                  sortable: true
                },
                {
                  icon: RiPencilFill,
                  name: 'Reason'
                },
                {
                  icon: FiArrowRightCircle,
                  name: 'Date Added',
                  sortable: true
                }
              ]
            }
          ]
        },
        title: 'Bot Denies',
        totalCount: data?.botDenies?.length || 0
      },
      id: 'botDenies',
      name: 'Bot Denies'
    },
    {
      data: {
        subtitle: 'Here you can see the all the vote timeouts that have been recorded.',
        tableData: {
          tabs: [
            {
              actions: [
                {
                  action: () => {
                    const column = useDashboardStore.getState().selectedItems[0];

                    setSelectedItems([]);
                    setPage(1);

                    router.push(column[0].discriminator ? '/bots/' : `/servers/${column[0].id}`);
                  },
                  icon: FaEye,
                  name: 'View Server/Bot'
                },
                {
                  action: () => {
                    const column = useDashboardStore.getState().selectedItems[0];

                    setSelectedItems([]);
                    setPage(1);

                    router.push(`/profile/u/${column[1].id}`);
                  },
                  icon: FaEye,
                  name: 'View User'
                },
                {
                  action: () => bulkActionWithConfirmationModal({
                    action: item => (item.custom.type === 'bot' ? deleteBotTimeout(item.id, item.custom.userId) : deleteServerTimeout(item.id, item.custom.userId)),
                    fetchKey: 'timeouts',
                    name: 'timeout'
                  }),
                  hide: !data.permissions?.canDeleteTimeouts,
                  icon: IoMdCloseCircle,
                  name: 'Delete'
                }
              ],
              columns: data?.timeouts?.map(item => [
                typeof item.bot === 'object' ?
                  {
                    avatar: item.bot.avatar,
                    custom: {
                      type: 'bot',
                      userId: item.user.id
                    },
                    discriminator: item.bot.discriminator,
                    id: item.bot.id,
                    searchValues: [item.bot.username, item.bot.id],
                    showId: true,
                    type: 'bot',
                    username: item.bot.username
                  } :
                  {
                    custom: {
                      type: 'server',
                      userId: item.user.id
                    },
                    icon: item.guild.icon,
                    id: item.guild.id,
                    name: item.guild.name,
                    searchValues: [item.guild.name, item.guild.id],
                    showId: true,
                    type: 'server'
                  },
                {
                  avatar: item.user.avatar,
                  id: item.user.id,
                  searchValues: [item.user.username, item.user.id],
                  showId: true,
                  type: 'user',
                  username: item.user.username
                },
                {
                  type: 'date',
                  value: new Date(item.createdAt)
                },
                {
                  type: 'countdown',
                  value: new Date(item.createdAt).getTime() + 86_400_000
                }
              ]),
              label: 'Timeouts',
              rows: [
                {
                  icon: FaUserCircle,
                  name: 'Bot/Server',
                  sortable: true
                },
                {
                  icon: FaUserCircle,
                  name: 'User',
                  sortable: true
                },
                {
                  icon: FiArrowRightCircle,
                  name: 'Date Added',
                  sortable: true
                },
                {
                  icon: MdTimer,
                  name: 'Ends In',
                  sortable: true
                }
              ]
            }
          ]
        },
        title: 'Timeouts',
        totalCount: data?.timeouts?.length || 0
      },
      id: 'timeouts',
      name: 'Timeouts'
    },
    {
      data: {
        actionButton: {
          action: () => {
            openModal('create-quarantine-record', {
              content: <CreateQuarantineModal />,
              description: 'You are going to create a new quarantine record.',
              title: 'Create Quarantine Record'
            });
          },
          hide: !data.permissions?.canCreateQuarantines,
          icon: TbLockPlus,
          name: 'Create Quarantine'
        },
        subtitle: 'Here you can see the all the quarantines that have been created and not yet expired.',
        tableData: {
          tabs: [
            {
              actions: [
                {
                  action: () => bulkActionWithConfirmationModal({
                    action: item => deleteQuarantineRecord(item._id),
                    fetchKey: 'quarantines',
                    name: 'quarantine'
                  }),
                  hide: !data.permissions?.canDeleteQuarantines,
                  icon: IoMdCloseCircle,
                  name: 'Delete'
                }
              ],
              columns: data?.quarantines?.map(item => [
                item.type === 'USER_ID' ?
                  {
                    _id: item.id,
                    avatar: item.user.avatar,
                    id: item.user.id,
                    searchValues: [item.user.username, item.user.id],
                    showId: true,
                    type: 'user',
                    username: item.user.username
                  } :
                  {
                    _id: item.id,
                    icon: item.guild.icon,
                    id: item.guild.id,
                    name: item.guild.name,
                    searchValues: [item.guild.name, item.guild.id],
                    showId: true,
                    type: 'server'
                  },
                {
                  avatar: item.created_by.avatar,
                  id: item.created_by.id,
                  searchValues: [item.created_by.username, item.created_by.id],
                  showId: true,
                  type: 'user',
                  username: item.created_by.username
                },
                {
                  searchValues: [item.restriction],
                  type: 'restriction',
                  value: item.restriction
                },
                {
                  searchValues: [item.reason],
                  type: 'long-text',
                  value: item.reason
                },
                {
                  type: 'date',
                  value: new Date(item.created_at)
                },
                {
                  type: 'countdown',
                  value: item.expire_at ? new Date(item.expire_at).getTime() : null
                }
              ]),
              label: 'Quarantines',
              rows: [
                {
                  icon: FaUserCircle,
                  name: 'User/Server',
                  sortable: true
                },
                {
                  icon: FaUserCircle,
                  name: 'Created By',
                  sortable: true
                },
                {
                  icon: CgBlock,
                  name: 'Restriction'
                },
                {
                  icon: RiPencilFill,
                  name: 'Reason'
                },
                {
                  icon: FiArrowRightCircle,
                  name: 'Date Added',
                  sortable: true
                },
                {
                  icon: MdTimer,
                  name: 'Ends In',
                  sortable: true
                }
              ]
            }
          ]
        },
        title: 'Quarantines',
        totalCount: data?.quarantines?.length || 0
      },
      id: 'quarantines',
      name: 'Quarantines'
    }
  ];

  const fetchData = useDashboardStore(state => state.fetchData);

  useEffect(() => {
    setSelectedItems([]);

    switch (activeTab) {
      case 'home': {
        fetchData(['stats']);
        break;
      }
      case 'users': {
        fetchData(['users']);
        break;
      }
      case 'guilds': {
        fetchData(['guilds']);
        break;
      }
      case 'emojisQueue': {
        fetchData(['emojis']);
        break;
      }
      case 'botsQueue': {
        fetchData(['bots']);
        break;
      }
      case 'templatesQueue': {
        fetchData(['templates']);
        break;
      }
      case 'soundsQueue': {
        fetchData(['sounds']);
        break;
      }
      case 'reviewsQueue': {
        fetchData(['reviews']);
        break;
      }
      case 'themesQueue': {
        fetchData(['themes']);
        break;
      }
      case 'botDenies': {
        fetchData(['botdenies']);
        break;
      }
      case 'timeouts': {
        fetchData(['timeouts']);
        break;
      }
      case 'quarantines': {
        fetchData(['quarantines']);
        break;
      }
      case 'links': {
        fetchData(['links']);
        break;
      }
    }
  }, [activeTab]);

  const theme = useThemeStore(state => state.theme);
  const transition = { damping: 10, duration: 0.25, stiffness: 100, type: 'spring' };

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else document.body.style.overflow = 'auto';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [loading]);

  return (
    <div className='relative flex w-full overflow-x-clip bg-secondary'>
      <Sidebar />

      <div className='flex min-h-svh w-full py-4 pr-2 pl-4'>
        <div className='relative flex w-full flex-1 flex-col overflow-x-auto rounded-3xl border border-primary bg-background p-6 sm:p-8'>
          <div className='flex items-center text-sm font-medium'>
            <span className='text-tertiary'>
              Dashboard
            </span>

            <CgFormatSlash className='text-lg text-tertiary' />

            <span className='text-primary'>
              {tabs.find(tab => tab.id === activeTab)?.name}
            </span>
          </div>

          <div className='mt-4'>
            {tabs.find(tab => tab.id === activeTab)?.component || <Queue key={activeTab} {...tabs.find(tab => tab.id === activeTab)?.data} />}
          </div>

          {loading && (
            <AnimatePresence>
              <div className='absolute top-0 left-0 z-10 flex size-full max-h-[919px] flex-col items-center justify-center bg-background'>
                <MotionImage
                  className='size-[64px]'
                  src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'}
                  alt='discord.place Logo'
                  width={256}
                  height={256}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={transition}
                  priority={true}
                />

                <motion.div
                  className='relative mt-8 h-[6px] w-[150px] overflow-hidden rounded-full bg-tertiary'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={transition}
                >
                  <div
                    // oxlint-disable-next-line tailwindcss/no-unknown-classes
                    className='animate-loading absolute h-[6px] rounded-full bg-black dark:bg-white' style={{
                      transform: 'translateX(-100%)',
                      width: '50%'
                    }}
                  />
                </motion.div>
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}