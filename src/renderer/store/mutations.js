export default {
  setSourcePath: (state, directory) => {
    state.sourcePath = directory
  },

  setDestinationPath: (state, directory) => {
    state.destinationPath = directory
  },

  setScannedImages: (state, images) => {
    state.scannedImages = images
  }
}
