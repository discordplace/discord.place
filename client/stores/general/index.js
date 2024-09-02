import { create } from 'zustand';
import getInstatusSummary from '@/lib/request/getInstatusSummary';

const useGeneralStore = create(set => ({
  createQuarantineModal: {
    step: 0,
    setStep: step => set(state => ({ createQuarantineModal: { ...state.createQuarantineModal, step } })),
    type: null,
    setType: type => set(state => ({ createQuarantineModal: { ...state.createQuarantineModal, type } })),
    value: '',
    setValue: value => set(state => ({ createQuarantineModal: { ...state.createQuarantineModal, value } })),
    restriction: null,
    setRestriction: restriction => set(state => ({ createQuarantineModal: { ...state.createQuarantineModal, restriction } })),
    reason: '',
    setReason: reason => set(state => ({ createQuarantineModal: { ...state.createQuarantineModal, reason } })),
    time: '',
    setTime: time => set(state => ({ createQuarantineModal: { ...state.createQuarantineModal, time } }))
  },
  createProfileModal: {
    preferredHost: 'discord.place/p',
    setPreferredHost: preferredHost => set(state => ({ createProfileModal: { ...state.createProfileModal, preferredHost } })),
    slug: '',
    setSlug: slug => set(state => ({ createProfileModal: { ...state.createProfileModal, slug } }))
  },
  uploadEmojiToDiscordModal: {
    selectedGuildId: '',
    setSelectedGuildId: selectedGuildId => set(state => ({ uploadEmojiToDiscordModal: { ...state.uploadEmojiToDiscordModal, selectedGuildId } })),
    selectedEmojiURL: '',
    setSelectedEmojiURL: selectedEmojiURL => set(state => ({ uploadEmojiToDiscordModal: { ...state.uploadEmojiToDiscordModal, selectedEmojiURL } }))
  },
  uploadSoundToDiscordModal: {
    selectedGuildId: '',
    setSelectedGuildId: selectedGuildId => set(state => ({ uploadSoundToDiscordModal: { ...state.uploadSoundToDiscordModal, selectedGuildId } })),
    selectedSoundId: '',
    setSelectedSoundId: selectedSoundId => set(state => ({ uploadSoundToDiscordModal: { ...state.uploadSoundToDiscordModal, selectedSoundId } }))
  },
  createLinkModal: {
    name: '',
    setName: name => set(state => ({ createLinkModal: { ...state.createLinkModal, name } })),
    destinationURL: '',
    setDestinationURL: destinationURL => set(state => ({ createLinkModal: { ...state.createLinkModal, destinationURL } }))
  },
  sounds: {
    currentlyPlaying: '',
    setCurrentlyPlaying: soundId => set(state => ({ sounds: { ...state.sounds, currentlyPlaying: soundId } })),
    volume: 1,
    setVolume: volume => set(state => ({ sounds: { ...state.sounds, volume } }))
  },
  status: {
    summary: null,
    fetchSummary: async () => {
      const summary = await getInstatusSummary();

      set(state => ({ status: { ...state.status, summary } }));
    }
  },
  showFullPageLoading: true,
  setShowFullPageLoading: showFullPageLoading => set({ showFullPageLoading }),
  showReportableAreas: false,
  setShowReportableAreas: showReportableAreas => set({ showReportableAreas }),
  reportAreaModal: {
    reason: '',
    setReason: reason => set(state => ({ reportAreaModal: { ...state.reportAreaModal, reason } }))
  }
}));

export default useGeneralStore;