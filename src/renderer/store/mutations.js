import Vue from 'vue'

export default {
  setSourcePath: (state, directory) => {
    state.sourcePath = directory
  },

  setDestinationPath: (state, directory) => {
    state.destinationPath = directory
  },

  setScannedImages: (state, images) => {
    state.scannedImages = images
  },

  setImageNote: (state, { image, note }) => {
    Vue.set(state.imageNotes, image, note)
  },

  setActiveImage: (state, name) => {
    state.activeImage = name
  },

  toggleEditor: (state, show) => {
    state.showEditor = show
  },

  rememberHandledImages: (state, images) => {
    state.handledImages = Object.assign({}, images, state.handledImages)
  },

  setMemories: (state, memories) => {
    state.memories = memories
  }
}
