'use client';

import config from '@/config';
import getInstatusSummary from '@/lib/request/getInstatusSummary';
import useModalsStore from '@/stores/modals';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLocalStorage } from 'react-use';

export default function Status() {
  const openModal = useModalsStore(state => state.openModal);
  const closeModal = useModalsStore(state => state.closeModal);
  
  const [summary, setSummary] = useState(null);
  const [closedIncidents, setClosedIncidents] = useLocalStorage('closed-incidents', []);

  useEffect(() => {
    getInstatusSummary()
      .then(setSummary)
      .catch(toast.error);
  }, []);

  useEffect(() => {
    if (!summary) return;

    const { activeIncidents } = summary;
    if ((activeIncidents || []).length === 0) return;

    activeIncidents
      .filter(incident => !closedIncidents.includes(incident.id))
      .forEach(incident => {
        openModal(`incident-${incident.id}`, {
          title: incident.name,
          description: 'We are currently experiencing some issues. Please check back later for updates.',
          content: <>
            This incident is started at {new Date(incident.started).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}.
          </>,
          buttons: [
            {
              id: 'cancel',
              label: 'Cancel',
              variant: 'ghost',
              action: () => closeModal(`incident-${incident.id}`)
            },
            {
              id: 'open-incident',
              label: 'Open Incident',
              variant: 'solid',
              action: () => {
                window.open(`${config.instatus.baseUrl}/${incident.id}`, '_blank');
                closeModal(`incident-${incident.id}`);
              }
            }
          ],
          events: {
            onClose: () => setClosedIncidents(oldClosedIncidents => [...oldClosedIncidents, incident.id])
          }
        });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary]);
  
  return null;
}