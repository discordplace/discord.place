import { create } from 'zustand';

const useGeneralStore = create(set => ({
  createLinkModal: {
    destinationURL: '',
    name: '',
    setDestinationURL: destinationURL => set(state => ({ createLinkModal: { ...state.createLinkModal, destinationURL } })),
    setName: name => set(state => ({ createLinkModal: { ...state.createLinkModal, name } }))
  },
  createProfileModal: {
    preferredHost: 'discord.place/p',
    setPreferredHost: preferredHost => set(state => ({ createProfileModal: { ...state.createProfileModal, preferredHost } })),
    setSlug: slug => set(state => ({ createProfileModal: { ...state.createProfileModal, slug } })),
    slug: ''
  },
  createQuarantineModal: {
    reason: '',
    restriction: null,
    setReason: reason => set(state => ({ createQuarantineModal: { ...state.createQuarantineModal, reason } })),
    setRestriction: restriction => set(state => ({ createQuarantineModal: { ...state.createQuarantineModal, restriction } })),
    setStep: step => set(state => ({ createQuarantineModal: { ...state.createQuarantineModal, step } })),
    setTime: time => set(state => ({ createQuarantineModal: { ...state.createQuarantineModal, time } })),
    setType: type => set(state => ({ createQuarantineModal: { ...state.createQuarantineModal, type } })),
    setValue: value => set(state => ({ createQuarantineModal: { ...state.createQuarantineModal, value } })),
    step: 0,
    time: '',
    type: null,
    value: ''
  },
  header: {
    hoveringHeaderTab: null,
    lastMouseOut: 0,
    setHoveringHeaderTab: hoveringHeaderTab => set(state => ({ header: { ...state.header, hoveringHeaderTab } })),
    setLastMouseOut: lastMouseOut => set(state => ({ header: { ...state.header, lastMouseOut } }))
  },
  reportAreaModal: {
    reason: '',
    setReason: reason => set(state => ({ reportAreaModal: { ...state.reportAreaModal, reason } }))
  },
  setShowFullPageLoading: showFullPageLoading => set({ showFullPageLoading }),
  setShowReportableAreas: showReportableAreas => set({ showReportableAreas }),
  showFullPageLoading: true,
  showReportableAreas: false,
  sounds: {
    currentlyPlaying: '',
    setCurrentlyPlaying: soundId => set(state => ({ sounds: { ...state.sounds, currentlyPlaying: soundId } })),
    setVolume: volume => set(state => ({ sounds: { ...state.sounds, volume } })),
    volume: 1
  },
  uploadEmojiToDiscordModal: {
    selectedEmojiURL: '',
    selectedGuildId: '',
    setSelectedEmojiURL: selectedEmojiURL => set(state => ({ uploadEmojiToDiscordModal: { ...state.uploadEmojiToDiscordModal, selectedEmojiURL } })),
    setSelectedGuildId: selectedGuildId => set(state => ({ uploadEmojiToDiscordModal: { ...state.uploadEmojiToDiscordModal, selectedGuildId } }))
  },
  uploadSoundToDiscordModal: {
    selectedGuildId: '',
    selectedSoundId: '',
    setSelectedGuildId: selectedGuildId => set(state => ({ uploadSoundToDiscordModal: { ...state.uploadSoundToDiscordModal, selectedGuildId } })),
    setSelectedSoundId: selectedSoundId => set(state => ({ uploadSoundToDiscordModal: { ...state.uploadSoundToDiscordModal, selectedSoundId } }))
  }
}));

export default useGeneralStore;