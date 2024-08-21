'use client';

import config from '@/config';
import useModalsStore from '@/stores/modals';
import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import useGeneralStore from '@/stores/general';
import { t } from '@/stores/language';

export default function Status() {
  const openModal = useModalsStore(state => state.openModal);
  const closeModal = useModalsStore(state => state.closeModal);
  
  const summary = useGeneralStore(state => state.status.summary);
  const fetchSummary = useGeneralStore(state => state.status.fetchSummary);

  const [closedIncidents, setClosedIncidents] = useLocalStorage('closed-incidents', []);
  const [closedMaintenances, setClosedMaintenances] = useLocalStorage('closed-maintenances', []);

  useEffect(() => {
    fetchSummary();

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            description: t('status.incidentDescription'),
            content: t('status.incidentContent', { startedAt: new Date(incident.started, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) }),
            buttons: [
              {
                id: 'cancel',
                label: t('buttons.cancel'),
                variant: 'ghost',
                action: () => closeModal(`incident-${incident.id}`)
              },
              {
                id: 'open-incident',
                label: t('buttons.viewIncident'),
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
            description: t(`status.maintenanceDescription.${maintenance.status === 'NOTSTARTEDYET' ? 'planned' : 'started'}`),
            content: t(`status.maintenanceContent.${maintenance.status === 'NOTSTARTEDYET' ? 'planned' : 'started'}`, { date: new Date(maintenance.start).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) }),
            buttons: [
              {
                id: 'cancel',
                label: t('buttons.cancel'),
                variant: 'ghost',
                action: () => closeModal(`maintenance-${maintenance.id}`)
              },
              {
                id: 'open-maintenance',
                label: t('buttons.viewMaintenance'),
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