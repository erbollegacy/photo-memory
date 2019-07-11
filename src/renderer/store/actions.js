import { remote } from 'electron'
import fs from 'fs'

export default {
  setReceiptPreviewDimensions ({commit}, dimensions) {
    commit('setReceiptPreviewDimensions', {
      width: dimensions.width,
      height: dimensions.height
    })
  },

  chooseDirectory () {
    return new Promise((resolve) => {
      remote.dialog.showOpenDialog({ properties: ['openDirectory'] }, (filePaths) => {
        return resolve(filePaths[0])
      })
    })
  },

  scanDirectory ({commit}, directory) {
    return new Promise((resolve, reject) => {
      fs.readdir(directory, function (err, files) {
        if (err) {
          return reject(err)
        }
        const withExtension = files.filter(file => !file.startsWith('.') && file.split('.').length > 1)
        resolve(withExtension)
      })
    })
  }
}
