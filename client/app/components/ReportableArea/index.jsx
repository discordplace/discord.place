import Tooltip from '@/app/components/Tooltip';
import cn from '@/lib/cn';
import useGeneralStore from '@/stores/general';
import useModalsStore from '@/stores/modals';
import { t } from '@/stores/language';
import ReportAreaModal from '@/app/components/ReportableArea/ReportAreaModal';
import config from '@/config';
import { toast } from 'sonner';
import createReport from '@/lib/request/createReport';
import { useShallow } from 'zustand/react/shallow';

export default function ReportableArea(props) {
  const state_showReportableAreas = useGeneralStore(state => state.showReportableAreas);
  const showReportableAreas = props.active !== false && state_showReportableAreas;
  const setShowReportableAreas = useGeneralStore(state => state.setShowReportableAreas);

  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal,
    updateModal: state.updateModal
  })));

  function submitReport() {
    const reason = useGeneralStore.getState().reportAreaModal.reason;
    if (!reason) return toast.error(t('inAppReporting.reportModal.toast.noReason'));

    if (reason.length < config.reportReasonMinCharacters) return toast.error(t('inAppReporting.reportModal.toast.reasonTooShort', { minLength: config.reportReasonMinCharacters }));
    if (reason.length > config.reportReasonMaxCharacters) return toast.error(t('inAppReporting.reportModal.toast.reasonTooLong', { maxLength: config.reportReasonMaxCharacters }));

    disableButton('report-area', 'createReport');

    toast.promise(createReport(props.type, props.identifier, reason), {
      loading: t('inAppReporting.reportModal.toast.submittingReport'),
      success: () => {
        closeModal('report-area');
        setShowReportableAreas(false);

        return t('inAppReporting.reportModal.toast.reportSubmitted');
      },
      error: message => {
        enableButton('report-area', 'createReport');

        return message;
      }
    });
  }

  function handleReportClick() {
    openModal('report-area', {
      title: t('inAppReporting.reportModal.title'),
      description: t('inAppReporting.reportModal.description'),
      content: (
        <ReportAreaModal
          type={props.type}
          metadata={props.metadata}
        />
      ),
      buttons: [
        {
          id: 'cancel',
          label: t('buttons.cancel'),
          variant: 'ghost',
          actionType: 'close'
        },
        {
          id: 'createReport',
          label: t('buttons.createReport'),
          variant: 'solid',
          action: submitReport
        }
      ]
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
            'absolute z-10 w-[calc(100%_+_15px)] h-[calc(100%_+_15px)] -translate-y-[7.5px] -translate-x-[7.5px] rounded-xl left-0 top-0 transition-opacity',
            showReportableAreas ? 'animate-reportable-area cursor-pointer hover:opacity-60 opacity-100' : 'opacity-0 pointer-events-none'
          )}
          onClick={handleReportClick}
          ref={props.triggerButtonRef || null}
        />
      </Tooltip>

      {props.children}
    </div>
  );
}