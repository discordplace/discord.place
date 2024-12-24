import INTERNAL_approveEmoji from '@/lib/request/emojis/approveEmoji';
import INTERNAL_denyEmoji from '@/lib/request/emojis/denyEmoji';
import INTERNAL_deleteEmoji from '@/lib/request/emojis/deleteEmoji';
import INTERNAL_approveBot from '@/lib/request/bots/approveBot';
import INTERNAL_denyBot from '@/lib/request/bots/denyBot';
import INTERNAL_deleteBot from '@/lib/request/bots/deleteBot';
import INTERNAL_approveTemplate from '@/lib/request/templates/approveTemplate';
import INTERNAL_denyTemplate from '@/lib/request/templates/denyTemplate';
import INTERNAL_deleteTemplate from '@/lib/request/templates/deleteTemplate';
import INTERNAL_approveSound from '@/lib/request/sounds/approveSound';
import INTERNAL_denySound from '@/lib/request/sounds/denySound';
import INTERNAL_deleteSound from '@/lib/request/sounds/deleteSound';
import INTERNAL_approveServerReview from '@/lib/request/servers/approveReview';
import INTERNAL_denyServerReview from '@/lib/request/servers/denyReview';
import INTERNAL_deleteServerReview from '@/lib/request/servers/deleteReview';
import INTERNAL_approveBotReview from '@/lib/request/bots/approveReview';
import INTERNAL_denyBotReview from '@/lib/request/bots/denyReview';
import INTERNAL_deleteBotReview from '@/lib/request/bots/deleteReview';
import INTERNAL_approveTheme from '@/lib/request/themes/approveTheme';
import INTERNAL_denyTheme from '@/lib/request/themes/denyTheme';
import INTERNAL_deleteTheme from '@/lib/request/themes/deleteTheme';
import INTERNAL_deleteBlockedIP from '@/lib/request/dashboard/deleteBlockedIP';
import INTERNAL_deleteLink from '@/lib/request/links/deleteLink';
import INTERNAL_deleteBotDenyRecord from '@/lib/request/bots/deleteBotDenyRecord';
import INTERNAL_deleteBotTimeout from '@/lib/request/bots/deleteTimeout';
import INTERNAL_deleteServerTimeout from '@/lib/request/servers/deleteTimeout';
import INTERNAL_deleteQuarantineRecord from '@/lib/request/dashboard/deleteQuarantineRecord';
import INTERNAL_restoreBot from '@/lib/request/bots/restoreBot';

import { toast } from 'sonner';
import useModalsStore from '@/stores/modals';

function sendRequest({ params, promise, successMessage, error, loadingMessage }) {
  toast.promise(typeof params === 'object' ? promise(...Object.values(params)) : promise(params), {
    loading: loadingMessage,
    success: successMessage,
    error: errorMessage => {
      error?.callback?.();

      return errorMessage;
    }
  });
}

const openModal = useModalsStore.getState().openModal;
const closeModal = useModalsStore.getState().closeModal;

export function showConfirmationModal(message, callback) {
  openModal('delete-confirmation', {
    title: 'Delete Confirmation',
    description: 'Are you really sure you want to delete?',
    content: message,
    buttons: [
      {
        id: 'cancel',
        label: 'Cancel',
        variant: 'ghost',
        actionType: 'close'
      },
      {
        id: 'confirm',
        label: 'Confirm',
        variant: 'solid',
        action: () => {
          closeModal('delete-confirmation');
          callback();
        }
      }
    ]
  });
}

export const approveEmoji = id => sendRequest({
  params: id,
  promise: INTERNAL_approveEmoji,
  successMessage: `Emoji ${id} approved successfully!`,
  loadingMessage: `Approving emoji ${id}..`
});

export const denyEmoji = (id, reason) => sendRequest({
  params: { id, reason },
  promise: INTERNAL_denyEmoji,
  successMessage: `Emoji ${id} denied successfully`,
  loadingMessage: `Denying emoji ${id}..`
});

export const deleteEmoji = id => sendRequest({
  params: id,
  promise: INTERNAL_deleteEmoji,
  successMessage: `Emoji ${id} deleted successfully!`,
  loadingMessage: `Deleting emoji ${id}..`
});

export const approveBot = id => sendRequest({
  params: id,
  promise: INTERNAL_approveBot,
  successMessage: `Bot ${id} approved successfully!`,
  loadingMessage: `Approving bot ${id}..`
});

export const denyBot = (id, reason) => sendRequest({
  params: { id, reason },
  promise: INTERNAL_denyBot,
  successMessage: `Bot ${id} denied successfully!`,
  loadingMessage: `Denying bot ${id}..`
});

export const deleteBot = id => sendRequest({
  params: id,
  promise: INTERNAL_deleteBot,
  successMessage: `Bot ${id} deleted successfully!`,
  loadingMessage: `Deleting bot ${id}..`
});

export const approveTemplate = id => sendRequest({
  params: id,
  promise: INTERNAL_approveTemplate,
  successMessage: `Template ${id} approved successfully!`,
  loadingMessage: `Approving template ${id}..`
});

export const denyTemplate = (id, reason) => sendRequest({
  params: { id, reason },
  promise: INTERNAL_denyTemplate,
  successMessage: `Template ${id} denied successfully!`,
  loadingMessage: `Denying template ${id}..`
});

export const deleteTemplate = id => sendRequest({
  params: id,
  promise: INTERNAL_deleteTemplate,
  successMessage: `Template ${id} deleted successfully!`,
  loadingMessage: `Deleting template ${id}..`
});

export const approveSound = id => sendRequest({
  params: id,
  promise: INTERNAL_approveSound,
  successMessage: `Sound ${id} approved successfully!`,
  loadingMessage: `Approving sound ${id}..`
});

export const denySound = (id, reason) => sendRequest({
  params: { id, reason },
  promise: INTERNAL_denySound,
  successMessage: `Sound ${id} denied successfully!`,
  loadingMessage: `Denying sound ${id}..`
});

export const deleteSound = id => sendRequest({
  params: id,
  promise: INTERNAL_deleteSound,
  successMessage: `Sound ${id} deleted successfully!`,
  loadingMessage: `Deleting sound ${id}..`
});

export const approveReview = (type, serverOrBotId, reviewId) => sendRequest({
  params: { serverOrBotId, reviewId },
  promise: type === 'server' ? INTERNAL_approveServerReview : INTERNAL_approveBotReview,
  successMessage: `Server review ${reviewId} approved successfully!`,
  loadingMessage: `Approving server review ${reviewId}..`
});

export const denyReview = (type, serverOrBotId, reviewId, reason) => sendRequest({
  params: { serverOrBotId, reviewId, reason },
  promise: type === 'server' ? INTERNAL_denyServerReview : INTERNAL_denyBotReview,
  successMessage: `Server review ${reviewId} denied successfully!`,
  loadingMessage: `Denying server review ${reviewId}..`
});

export const deleteReview = (type, serverOrBotId, reviewId) => sendRequest({
  params: { serverOrBotId, reviewId },
  promise: type === 'server' ? INTERNAL_deleteServerReview : INTERNAL_deleteBotReview,
  successMessage: `Server review ${reviewId} deleted successfully!`,
  loadingMessage: `Deleting server review ${reviewId}..`
});

export const approveTheme = id => sendRequest({
  params: id,
  promise: INTERNAL_approveTheme,
  successMessage: `Theme ${id} approved successfully!`,
  loadingMessage: `Approving theme ${id}..`
});

export const denyTheme = (id, reason) => sendRequest({
  params: { id, reason },
  promise: INTERNAL_denyTheme,
  successMessage: `Theme ${id} denied successfully!`,
  loadingMessage: `Denying theme ${id}..`
});

export const deleteTheme = id => sendRequest({
  params: id,
  promise: INTERNAL_deleteTheme,
  successMessage: `Theme ${id} deleted successfully!`,
  loadingMessage: `Deleting theme ${id}..`
});

export const deleteBlockedIP = ip => sendRequest({
  params: ip,
  promise: INTERNAL_deleteBlockedIP,
  successMessage: `Blocked IP ${ip} deleted successfully!`,
  loadingMessage: `Deleting blocked IP ${ip}..`
});

export const deleteLink = id => sendRequest({
  params: id,
  promise: INTERNAL_deleteLink,
  successMessage: `Link ${id} deleted successfully!`,
  loadingMessage: `Deleting link ${id}..`
});

export const deleteBotDenyRecord = id => sendRequest({
  params: id,
  promise: INTERNAL_deleteBotDenyRecord,
  successMessage: `Bot deny record ${id} deleted successfully!`,
  loadingMessage: `Deleting bot deny record ${id}..`
});

export const restoreBot = id => sendRequest({
  params: { id },
  promise: INTERNAL_restoreBot,
  successMessage: `Bot ${id} restored successfully! Please review it again.`,
  loadingMessage: `Restoring bot ${id}..`
});

export const deleteBotTimeout = (timeoutId, botId) => sendRequest({
  params: { timeoutId, botId },
  promise: INTERNAL_deleteBotTimeout,
  successMessage: `Bot timeout ${timeoutId} deleted successfully!`,
  loadingMessage: `Deleting bot timeout ${timeoutId}..`
});

export const deleteServerTimeout = (timeoutId, serverId) => sendRequest({
  params: { timeoutId, serverId },
  promise: INTERNAL_deleteServerTimeout,
  successMessage: `Server timeout ${timeoutId} deleted successfully!`,
  loadingMessage: `Deleting server timeout ${timeoutId}..`
});

export const deleteQuarantineRecord = id => sendRequest({
  params: id,
  promise: INTERNAL_deleteQuarantineRecord,
  successMessage: `Quarantine record ${id} deleted successfully!`,
  loadingMessage: `Deleting quarantine record ${id}..`
});