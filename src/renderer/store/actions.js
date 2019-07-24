import { remote } from 'electron'
import fs from 'fs'
import Swal from 'sweetalert2'
import sharp from 'sharp'

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

  saveMemory ({getters, commit}, { selectedImagesNames, notes, description, saveTo }) {
    // copy images
    const fs = require('fs').promises
    const path = require('path')
    const ops = []
    const imagesFolder = 'images'
    const imagesThumbFolder = 'thumb'
    const { chosenDirectory } = getters

    fs.mkdir(path.join(saveTo, imagesFolder))
      .catch(() => console.log('images folder already exists'))

    for (let image in selectedImagesNames) {
      const imagePath = path.join(chosenDirectory, image)
      const destinationPath = path.join(saveTo, imagesFolder, image)
      const imagePromise = fs.copyFile(imagePath, destinationPath)
      ops.push(imagePromise)
    }

    fs.mkdir(path.join(saveTo, imagesThumbFolder))
      .catch(() => console.log('thumbnails folder already exists'))

    // copy thumbnails
    for (let image in selectedImagesNames) {
      const imagePath = path.join(chosenDirectory, image)
      const destinationPath = path.join(saveTo, imagesThumbFolder, image)
      const thumbWidth = 350

      const thumbPromise = sharp(imagePath)
        .resize(thumbWidth)
        .jpeg({ quality: 100 })
        .toFile(destinationPath)
        .catch(() => {
          console.log('unable to create a thumbnail')
        })
      ops.push(thumbPromise)
    }

    // generate HTML
    let templatePromise = fs.readFile(path.join(__static, '/template.html'), 'utf8')
      .then(template => {
        const oParser = new DOMParser()
        const templateDom = oParser.parseFromString(template, 'text/html')
        const gridEl = templateDom.querySelector('#grid')
        const descriptionEl = templateDom.querySelector('#description')

        for (let image in selectedImagesNames) {
          const imageItemTemplate = `<a href="#"><img src="./${imagesThumbFolder}/${image}"></a>`
          const li = document.createElement('li')
          li.setAttribute('data-src', `./${imagesFolder}/${image}`)
          if (notes[image]) {
            li.setAttribute('data-sub-html', notes[image])
          }
          li.innerHTML = imageItemTemplate
          gridEl.appendChild(li)
        }
        descriptionEl.innerHTML = description

        return fs.writeFile(path.join(saveTo, 'index.html'), `<!DOCTYPE html>` + templateDom.documentElement.outerHTML)
          .catch(() => {
            console.log('unable to save generated HTML')
          })
      })
      .catch(() => {
        console.log('unable to read an HTML html')
      })
    ops.push(templatePromise)

    return Promise.all(ops)
      .then(() => {
        Swal.fire(
          'Good job!',
          'You have just created the photo memory!',
          'success'
        )
      })
  }
}
