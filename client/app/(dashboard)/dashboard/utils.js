import INTERNAL_approveBot from '@/lib/request/bots/approveBot';
import INTERNAL_approveBotReview from '@/lib/request/bots/approveReview';
import INTERNAL_deleteBot from '@/lib/request/bots/deleteBot';
import INTERNAL_deleteBotDenyRecord from '@/lib/request/bots/deleteBotDenyRecord';
import INTERNAL_deleteBotReview from '@/lib/request/bots/deleteReview';
import INTERNAL_deleteBotTimeout from '@/lib/request/bots/deleteTimeout';
import INTERNAL_denyBot from '@/lib/request/bots/denyBot';
import INTERNAL_denyBotReview from '@/lib/request/bots/denyReview';
import INTERNAL_deleteBlockedIP from '@/lib/request/dashboard/deleteBlockedIP';
import INTERNAL_deleteQuarantineRecord from '@/lib/request/dashboard/deleteQuarantineRecord';
import INTERNAL_approveEmoji from '@/lib/request/emojis/approveEmoji';
import INTERNAL_deleteEmoji from '@/lib/request/emojis/deleteEmoji';
import INTERNAL_denyEmoji from '@/lib/request/emojis/denyEmoji';
import INTERNAL_deleteLink from '@/lib/request/links/deleteLink';
import INTERNAL_approveServerReview from '@/lib/request/servers/approveReview';
import INTERNAL_deleteServerReview from '@/lib/request/servers/deleteReview';
import INTERNAL_deleteServerTimeout from '@/lib/request/servers/deleteTimeout';
import INTERNAL_denyServerReview from '@/lib/request/servers/denyReview';
import INTERNAL_approveSound from '@/lib/request/sounds/approveSound';
import INTERNAL_deleteSound from '@/lib/request/sounds/deleteSound';
import INTERNAL_denySound from '@/lib/request/sounds/denySound';
import INTERNAL_approveTemplate from '@/lib/request/templates/approveTemplate';
import INTERNAL_deleteTemplate from '@/lib/request/templates/deleteTemplate';
import INTERNAL_denyTemplate from '@/lib/request/templates/denyTemplate';
import INTERNAL_approveTheme from '@/lib/request/themes/approveTheme';
import INTERNAL_deleteTheme from '@/lib/request/themes/deleteTheme';
import INTERNAL_denyTheme from '@/lib/request/themes/denyTheme';
import useModalsStore from '@/stores/modals';
import { toast } from 'sonner';

function sendRequest({ error, loadingMessage, params, promise, successMessage }) {
  toast.promise(typeof params === 'object' ? promise(...Object.values(params)) : promise(params), {
    error: errorMessage => {
      error?.callback?.();

      return errorMessage;
    },
    loading: loadingMessage,
    success: successMessage
  });
}

const openModal = useModalsStore.getState().openModal;
const closeModal = useModalsStore.getState().closeModal;

export function showConfirmationModal(message, callback) {
  openModal('delete-confirmation', {
    buttons: [
      {
        actionType: 'close',
        id: 'cancel',
        label: 'Cancel',
        variant: 'ghost'
      },
      {
        action: () => {
          closeModal('delete-confirmation');
          callback();
        },
        id: 'confirm',
        label: 'Confirm',
        variant: 'solid'
      }
    ],
    content: message,
    description: 'Are you really sure you want to delete?',
    title: 'Delete Confirmation'
  });
}

export const approveEmoji = id => sendRequest({
  loadingMessage: `Approving emoji ${id}..`,
  params: id,
  promise: INTERNAL_approveEmoji,
  successMessage: `Emoji ${id} approved successfully!`
});

export const denyEmoji = (id, reason) => sendRequest({
  loadingMessage: `Denying emoji ${id}..`,
  params: { id, reason },
  promise: INTERNAL_denyEmoji,
  successMessage: `Emoji ${id} denied successfully`
});

export const deleteEmoji = id => sendRequest({
  loadingMessage: `Deleting emoji ${id}..`,
  params: id,
  promise: INTERNAL_deleteEmoji,
  successMessage: `Emoji ${id} deleted successfully!`
});

export const approveBot = id => sendRequest({
  loadingMessage: `Approving bot ${id}..`,
  params: id,
  promise: INTERNAL_approveBot,
  successMessage: `Bot ${id} approved successfully!`
});

export const denyBot = (id, reason) => sendRequest({
  loadingMessage: `Denying bot ${id}..`,
  params: { id, reason },
  promise: INTERNAL_denyBot,
  successMessage: `Bot ${id} denied successfully!`
});

export const deleteBot = id => sendRequest({
  loadingMessage: `Deleting bot ${id}..`,
  params: id,
  promise: INTERNAL_deleteBot,
  successMessage: `Bot ${id} deleted successfully!`
});

export const approveTemplate = id => sendRequest({
  loadingMessage: `Approving template ${id}..`,
  params: id,
  promise: INTERNAL_approveTemplate,
  successMessage: `Template ${id} approved successfully!`
});

export const denyTemplate = (id, reason) => sendRequest({
  loadingMessage: `Denying template ${id}..`,
  params: { id, reason },
  promise: INTERNAL_denyTemplate,
  successMessage: `Template ${id} denied successfully!`
});

export const deleteTemplate = id => sendRequest({
  loadingMessage: `Deleting template ${id}..`,
  params: id,
  promise: INTERNAL_deleteTemplate,
  successMessage: `Template ${id} deleted successfully!`
});

export const approveSound = id => sendRequest({
  loadingMessage: `Approving sound ${id}..`,
  params: id,
  promise: INTERNAL_approveSound,
  successMessage: `Sound ${id} approved successfully!`
});

export const denySound = (id, reason) => sendRequest({
  loadingMessage: `Denying sound ${id}..`,
  params: { id, reason },
  promise: INTERNAL_denySound,
  successMessage: `Sound ${id} denied successfully!`
});

export const deleteSound = id => sendRequest({
  loadingMessage: `Deleting sound ${id}..`,
  params: id,
  promise: INTERNAL_deleteSound,
  successMessage: `Sound ${id} deleted successfully!`
});

export const approveReview = (type, serverOrBotId, reviewId) => sendRequest({
  loadingMessage: `Approving server review ${reviewId}..`,
  params: { reviewId, serverOrBotId },
  promise: type === 'server' ? INTERNAL_approveServerReview : INTERNAL_approveBotReview,
  successMessage: `Server review ${reviewId} approved successfully!`
});

export const denyReview = (type, serverOrBotId, reviewId, reason) => sendRequest({
  loadingMessage: `Denying server review ${reviewId}..`,
  params: { reason, reviewId, serverOrBotId },
  promise: type === 'server' ? INTERNAL_denyServerReview : INTERNAL_denyBotReview,
  successMessage: `Server review ${reviewId} denied successfully!`
});

export const deleteReview = (type, serverOrBotId, reviewId) => sendRequest({
  loadingMessage: `Deleting server review ${reviewId}..`,
  params: { reviewId, serverOrBotId },
  promise: type === 'server' ? INTERNAL_deleteServerReview : INTERNAL_deleteBotReview,
  successMessage: `Server review ${reviewId} deleted successfully!`
});

export const approveTheme = id => sendRequest({
  loadingMessage: `Approving theme ${id}..`,
  params: id,
  promise: INTERNAL_approveTheme,
  successMessage: `Theme ${id} approved successfully!`
});

export const denyTheme = (id, reason) => sendRequest({
  loadingMessage: `Denying theme ${id}..`,
  params: { id, reason },
  promise: INTERNAL_denyTheme,
  successMessage: `Theme ${id} denied successfully!`
});

export const deleteTheme = id => sendRequest({
  loadingMessage: `Deleting theme ${id}..`,
  params: id,
  promise: INTERNAL_deleteTheme,
  successMessage: `Theme ${id} deleted successfully!`
});

export const deleteBlockedIP = ip => sendRequest({
  loadingMessage: `Deleting blocked IP ${ip}..`,
  params: ip,
  promise: INTERNAL_deleteBlockedIP,
  successMessage: `Blocked IP ${ip} deleted successfully!`
});

export const deleteLink = id => sendRequest({
  loadingMessage: `Deleting link ${id}..`,
  params: id,
  promise: INTERNAL_deleteLink,
  successMessage: `Link ${id} deleted successfully!`
});

export const deleteBotDenyRecord = id => sendRequest({
  loadingMessage: `Deleting bot deny record ${id}..`,
  params: id,
  promise: INTERNAL_deleteBotDenyRecord,
  successMessage: `Bot deny record ${id} deleted successfully!`
});

export const deleteBotTimeout = (timeoutId, botId) => sendRequest({
  loadingMessage: `Deleting bot timeout ${timeoutId}..`,
  params: { botId, timeoutId },
  promise: INTERNAL_deleteBotTimeout,
  successMessage: `Bot timeout ${timeoutId} deleted successfully!`
});

export const deleteServerTimeout = (timeoutId, serverId) => sendRequest({
  loadingMessage: `Deleting server timeout ${timeoutId}..`,
  params: { serverId, timeoutId },
  promise: INTERNAL_deleteServerTimeout,
  successMessage: `Server timeout ${timeoutId} deleted successfully!`
});

export const deleteQuarantineRecord = id => sendRequest({
  loadingMessage: `Deleting quarantine record ${id}..`,
  params: id,
  promise: INTERNAL_deleteQuarantineRecord,
  successMessage: `Quarantine record ${id} deleted successfully!`
});