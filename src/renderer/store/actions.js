import { remote } from 'electron'
import fs from 'fs'
import Swal from 'sweetalert2'

export default {
  chooseDirectory ({commit}) {
    return new Promise((resolve) => {
      remote.dialog.showOpenDialog({ properties: ['openDirectory'] }, (filePaths) => {
        commit('setChosenDirectory', filePaths[0])
        resolve(filePaths[0])
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
        commit('setDirectoryImages', withExtension)
        resolve(withExtension)
      })
    })
  },

  saveMemory ({getters, commit}, { selectedImages, notes, description, saveTo }) {
    // copy images
    const fs = require('fs').promises
    const path = require('path')
    const ops = []
    const imagesFolder = 'images'
    const { chosenDirectory } = getters

    fs.mkdir(path.join(saveTo, imagesFolder))
      .catch(() => console.log('folder already exists'))

    for (let image in selectedImages) {
      const imagePath = path.join(chosenDirectory, image)
      const destinationPath = path.join(saveTo, imagesFolder, image)
      const promise = fs.copyFile(imagePath, destinationPath)
      ops.push(promise)
    }
    Promise.all(ops)
      .then(() => {
        console.log('image copied')
      })

    // copy thumbnails
    // TODO

    // generate HTML
    let templatePromise = fs.readFile(path.join(__static, '/template.html'), 'utf8')
    templatePromise.then(template => {
      const oParser = new DOMParser()
      const templateDom = oParser.parseFromString(template, 'text/html')
      const grid = templateDom.querySelector('#grid')

      for (let image in selectedImages) {
        const imageItemTemplate = `<a href="#"><img src="./${imagesFolder}/${image}"></a>`
        const li = document.createElement('li')
        li.innerHTML = imageItemTemplate
        grid.appendChild(li)
      }

      fs.writeFile(path.join(saveTo, 'index.html'), templateDom.documentElement.outerHTML)
        .then(() => {
          Swal.fire(
            'Good job!',
            'You have just created the photo memory!',
            'success'
          )
        })
    })
  }
}
