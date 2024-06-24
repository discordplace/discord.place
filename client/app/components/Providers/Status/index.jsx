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
  const [closedMaintenances, setClosedMaintenances] = useLocalStorage('closed-maintenances', []);

  useEffect(() => {
    getInstatusSummary()
      .then(setSummary)
      .catch(toast.error);
  }, []);

  useEffect(() => {
    if (!summary) return;

    const { activeIncidents, activeMaintenances } = summary;
    
    if ((activeIncidents || []).length > 0) {
      activeIncidents
        .filter(incident => !closedIncidents.includes(incident.id))
        .forEach(incident => {
          openModal(`incident-${incident.id}`, {
            title: incident.name,
            description: 'We are currently experiencing some issues. Check our status page for updates.',
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
    }

    if ((activeMaintenances || []).length > 0) {
      activeMaintenances
        .filter(maintenance => !closedMaintenances.includes(maintenance.id) && (maintenance.status === 'NOTSTARTEDYET' || maintenance.status === 'INPROGRESS'))
        .forEach(maintenance => {
          openModal(`maintenance-${maintenance.id}`, {
            title: maintenance.name,
            description: maintenance.status === 'NOTSTARTEDYET' ? 'We are planning to perform maintenance on our services.' : 'We are currently performing maintenance on our services. Check our status page for updates.',
            content: <>
              {maintenance.status === 'NOTSTARTEDYET' ? 'This maintenance is planned to start at' : 'This maintenance is started at'} {new Date(maintenance.start).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}.
            </>,
            buttons: [
              {
                id: 'cancel',
                label: 'Cancel',
                variant: 'ghost',
                action: () => closeModal(`maintenance-${maintenance.id}`)
              },
              {
                id: 'open-maintenance',
                label: 'Open Maintenance',
                variant: 'solid',
                action: () => {
                  window.open(`${config.instatus.baseUrl}/${maintenance.id}`, '_blank');
                  closeModal(`maintenance-${maintenance.id}`);
                }
              }
            ],
            events: {
              onClose: () => setClosedMaintenances(oldClosedMaintenances => [...oldClosedMaintenances, maintenance.id])
            }
          });
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary]);
  
  return null;
}