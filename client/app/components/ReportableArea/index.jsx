import Tooltip from '@/app/components/Tooltip';
import cn from '@/lib/cn';
import useGeneralStore from '@/stores/general';
import useModalsStore from '@/stores/modals';
import { useTranslation } from 'react-i18next';
import ReportAreaModal from '@/app/components/ReportableArea/ReportAreaModal';
import config from '@/config';
import { toast } from 'sonner';
import createReport from '@/lib/request/general/createReport';
import { useShallow } from 'zustand/react/shallow';

export default function ReportableArea(props) {
  const { t } = useTranslation();
  const state_showReportableAreas = useGeneralStore(state => state.showReportableAreas);
  const showReportableAreas = props.active !== false && state_showReportableAreas;
  const setShowReportableAreas = useGeneralStore(state => state.setShowReportableAreas);

  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    closeModal: state.closeModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    openModal: state.openModal,
    updateModal: state.updateModal
  })));

  function submitReport() {
    const { reason } = useGeneralStore.getState().reportAreaModal;
    if (!reason) return toast.error(t('inAppReporting.reportModal.toast.noReason'));

    if (reason.length < config.reportReasonMinCharacters) return toast.error(t('inAppReporting.reportModal.toast.reasonTooShort', { minLength: config.reportReasonMinCharacters }));
    if (reason.length > config.reportReasonMaxCharacters) return toast.error(t('inAppReporting.reportModal.toast.reasonTooLong', { maxLength: config.reportReasonMaxCharacters }));

    disableButton('report-area', 'createReport');

    toast.promise(createReport(props.type, props.identifier, reason), {
      error: error => {
        enableButton('report-area', 'createReport');

        return error;
      },
      loading: t('inAppReporting.reportModal.toast.submittingReport'),
      success: () => {
        closeModal('report-area');
        setShowReportableAreas(false);

        return t('inAppReporting.reportModal.toast.reportSubmitted');
      }
    });
  }

  function handleReportClick() {
    openModal('report-area', {
      buttons: [
        {
          actionType: 'close',
          id: 'cancel',
          label: t('buttons.cancel'),
          variant: 'ghost'
        },
        {
          action: submitReport,
          id: 'createReport',
          label: t('buttons.createReport'),
          variant: 'solid'
        }
      ],
      content: (
        <ReportAreaModal
          type={props.type}
          metadata={props.metadata}
        />
      ),
      description: t('inAppReporting.reportModal.description'),
      title: t('inAppReporting.reportModal.title')
    });
  }

  return (
    <div
      className={cn(
        'relative',
        showReportableAreas && 'select-none'
      )}
      data-reportable-area={true}
    >
      <Tooltip content='Report this area'>
        <div
          className={cn(
            'absolute top-0 left-0 z-10 size-[calc(100%+15px)] translate-x-[-7.5px] translate-y-[-7.5px] rounded-xl transition-opacity',
            showReportableAreas ? 'animate-reportable-area cursor-pointer opacity-100 hover:opacity-60' : 'pointer-events-none opacity-0'
          )}
          onClick={handleReportClick}
          ref={props.triggerButtonRef || null}
        />
      </Tooltip>

      {props.children}
    </div>
  );
}