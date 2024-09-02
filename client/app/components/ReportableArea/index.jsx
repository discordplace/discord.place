import Tooltip from '@/app/components/Tooltip';
import cn from '@/lib/cn';
import useGeneralStore from '@/stores/general';
import useModalsStore from '@/stores/modals';
import { t } from '@/stores/language';
import ReportAreaModal from '@/app/components/ReportableArea/ReportAreaModal';
import config from '@/config';
import { toast } from 'sonner';
import reportArea from '@/lib/request/reportArea';
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
    if (!reason) return toast.error('Please provide a reason for reporting this.');

    if (reason.length < config.reportReasonMinCharacters) return toast.error(`Reason must be at least ${config.reportReasonMinCharacters} characters long.`);
    if (reason.length > config.reportReasonMaxCharacters) return toast.error(`Reason must be at most ${config.reportReasonMaxCharacters} characters long.`);
  
    disableButton('report-area', 'createReport');

    toast.promise(reportArea(props.type, props.identifier, reason), {
      loading: 'Your report is being submitted..',
      success: () => {
        closeModal('report-area');
        setShowReportableAreas(false);

        return 'Thank you for reporting this. We will review it shortly. You don\'t get a message from us if we take action.';
      },
      error: message => {
        enableButton('report-area', 'createReport');
        
        return message;
      }
    });
  }

  function handleReportClick() {
    openModal('report-area', {
      title: 'Report Area',
      description: 'You are about to report this.',
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
            'absolute z-10 w-[calc(100%_+_15px)] h-[calc(100%_+_15px)] rounded-xl top-[-10px] left-[-10px] transition-opacity',
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