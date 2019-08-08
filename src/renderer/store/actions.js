import { remote } from 'electron'
import fs from 'fs'
import Swal from 'sweetalert2'
import sharp from 'sharp'

export default {
  chooseDirectory ({dispatch}) {
    return new Promise((resolve) => {
      remote.dialog.showOpenDialog({ properties: ['openDirectory'] }, (filePaths) => {
        if (!filePaths) {
          return resolve()
        }
        dispatch('setSourcePath', filePaths[0])
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
        commit('setScannedImages', withExtension)
        resolve(withExtension)
      })
    })
  },

  saveMemory ({getters, commit}, { selectedImagesNames, description }) {
    // copy images
    const fs = require('fs').promises
    const fsSync = require('fs')
    const path = require('path')
    const ops = []
    const imagesFolder = 'images'
    const imagesThumbFolder = 'thumb'
    const notes = getters.imageNotes
    let { sourcePath, destinationPath } = getters

    let subFolder = new Date().toISOString()
      .replace(/\.+.+/, '')
      .replace(/:/g, '-')
    destinationPath = path.join(destinationPath, subFolder)

    try {
      fsSync.mkdirSync(destinationPath)
    } catch (e) {
      console.log('sub folder already exists')
    }

    try {
      fsSync.mkdirSync(path.join(destinationPath, imagesFolder))
    } catch (e) {
      console.log('images folder already exists')
    }

    for (let image in selectedImagesNames) {
      const imagePath = path.join(sourcePath, image)
      const imgDestinationPath = path.join(destinationPath, imagesFolder, image)
      const imagePromise = fs.copyFile(imagePath, imgDestinationPath)
      ops.push(imagePromise)
    }

    fs.mkdir(path.join(destinationPath, imagesThumbFolder))
      .catch(() => console.log('thumbnails folder already exists'))

    // copy thumbnails
    for (let image in selectedImagesNames) {
      const imagePath = path.join(sourcePath, image)
      const imgDestinationPath = path.join(destinationPath, imagesThumbFolder, image)
      const thumbWidth = 350

      const thumbPromise = sharp(imagePath)
        .resize(thumbWidth)
        .jpeg({ quality: 100 })
        .toFile(imgDestinationPath)
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

        return fs.writeFile(path.join(destinationPath, 'index.html'), `<!DOCTYPE html>` + templateDom.documentElement.outerHTML)
          .catch(() => {
            console.log('unable to save generated HTML')
          })
      })
      .catch(() => {
        console.log('unable to read an HTML html')
      })
    ops.push(templatePromise)

    // remember saved images

    // remember generated memory

    return Promise.all(ops)
      .then(() => {
        Swal.fire({
          title: 'Good job!',
          html: `You have just created a new photo memory! <br> Reference name: <b>${subFolder}</b>`,
          type: 'success'
        })
      })
  },

  initSettings ({ commit }) {
    let sourcePath = localStorage.getItem('sourcePath')
    let destinationPath = localStorage.getItem('destinationPath')

    commit('setSourcePath', sourcePath)
    commit('setDestinationPath', destinationPath)
  },

  setSourcePath ({getters, commit}, directory) {
    localStorage.setItem('sourcePath', directory)
    commit('setSourcePath', directory)
  },

  setDestinationPath ({getters, commit}, directory) {
    localStorage.setItem('destinationPath', directory)
    commit('setDestinationPath', directory)
  },

  setImageNote ({getters, commit}, { image, note }) {
    commit('setImageNote', { image, note })
  },

  setActiveImage ({getters, commit}, name) {
    commit('setActiveImage', name)
  },

  toggleEditor ({getters, commit}, show) {
    commit('toggleEditor', show)
  }
}
