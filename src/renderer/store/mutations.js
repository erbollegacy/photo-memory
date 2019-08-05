export default {
  setSourcePath: (state, directory) => {
    state.sourcePath = directory
  },

  setDestinationPath: (state, directory) => {
    state.destinationPath = directory
  },

  setDirectoryImages: (state, directory) => {
    state.directoryImages = directory
  }
}
