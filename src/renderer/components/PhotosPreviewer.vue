<template>
  <div class="wrapper">
    <div class="col-md-12" ref="container">
      <div class="row">
        <div class="preview gallery" @onBeforeSlide="beforeSlide" @onBeforeClose="beforeClose">
          <div @click="setActiveImageAndFocus(image.name)"
               class="image-container"
               :href="image.original"
               :style="{width: image.width + 'px', height: image.height + 'px'}"
               title="Click to open"
               v-for="image in thumbs">
            <img v-lazy="image.path" :key="image.path" :style="{width: image.width + 'px', height: image.height + 'px'}"/>
            <span class="icon-selected" title="This image has a description" v-if="imageNotes[image.name]">
              <i class="fas fa-quote-right"></i>
            </span>
            <div class="note-cover" v-if="imageNotes[image.name]"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import Masonry from 'masonry-layout'
  import 'lightgallery.js/dist/css/lightgallery.min.css'
  import 'lightgallery.js'
  import 'lg-zoom.js'
  import 'lg-autoplay.js'

  export default {
    name: 'photos-previewer',
    props: {
      images: Array
    },
    computed: {
      ...mapGetters([
        'imageNotes'
      ])
    },
    data () {
      return {
        photoTextEditor: null,

        thumbs: [],

        columnsCount: 3,
        columnIndent: 7,
        containerWidth: null,
        resizeTimeout: null,

        resizeDelay: 200,
        msnry: null,
        galleryInitialed: false
      }
    },
    methods: {
      ...mapActions([
        'toggleEditor',
        'setActiveImage'
      ]),

      beforeSlide (event) {
        let newSlide = window.lgData.lg0.items[event.detail.index]
        if (newSlide) {
          let name = newSlide.attributes.href.value.split('/').pop()
          this.setActiveImageAndFocus(name)
        }
      },

      beforeClose () {
        this.toggleEditor(false)
      },

      setActiveImageAndFocus (name) {
        this.setActiveImage(name)
        this.toggleEditor(true)
        document.querySelector('#createMemory').removeAttribute('tabIndex')

        setTimeout(() => {
          document.querySelector('.text-editor .ck-content').focus()
        }, 300)
      },

      initGallery () {
        if (this.msnry) {
          this.msnry.destroy()
        }

        /* eslint-disable no-new */
        this.msnry = new Masonry('.preview', {
          gutter: 10,
          itemSelector: '.image-container',
          resize: false
        })

        this.msnry.layout()

        if (this.galleryInitialed) {
          return
        }

        const gallery = document.querySelector('.preview')
        window.lightGallery(gallery)
        this.galleryInitialed = true
      },

      updateImages () {
        const containerWidth = this.$refs.container.offsetWidth
        if (containerWidth !== this.containerWidth) {
          this.containerWidth = containerWidth
        } else {
          return
        }

        this.thumbs = this.images.map(image => {
          let columnWidth = (containerWidth / this.columnsCount) - this.columnIndent
          let ratio = image.width / columnWidth
          let height = image.height / ratio
          let width = columnWidth

          return {
            width,
            height,
            path: image.path.replace(image.width, width),
            original: image.original,
            name: image.name
          }
        })

        setTimeout(() => {
          this.initGallery()
        }, 100)
      },

      onResize () {
        clearTimeout(this.resizeTimeout)
        this.resizeTimeout = setTimeout(() => {
          this.updateImages()
        }, this.resizeDelay)
      }
    },

    mounted () {
      setTimeout(() => {
        this.updateImages()
        window.addEventListener('resize', this.onResize)
      }, 100)
    },

    destroyed () {
      window.removeEventListener('resize', this.onResize)
      window.lgData.lg0.destroy(true)
      window.lgData.uid = 0
    }
  }
</script>

<style scoped lang="scss">
  .gallery {
    width: 100%;

    .image-container {
      position: relative;
      margin-bottom: 10px;
      width: 32%;
      cursor: zoom-in;

      img {
        width: 100%;
        background: #ccc;
      }

      .icon-selected {
        position: absolute;
        left: 24px;
        top: 26px;
        color: #fff;
        z-index: 2;
      }

      .cover {
        position: absolute;
        opacity: 0;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-image: linear-gradient(180deg,rgba(0,0,0,.2) 0,rgba(0,0,0,.199) 3.5%,rgba(0,0,0,.195) 7%,rgba(0,0,0,.19) 10.35%,rgba(0,0,0,.182) 13.85%,rgba(0,0,0,.174) 17.35%,rgba(0,0,0,.165) 20.85%,rgba(0,0,0,.155) 24.35%,rgba(0,0,0,.145) 27.85%,rgba(0,0,0,.135) 31.35%,rgba(0,0,0,.126) 34.85%,rgba(0,0,0,.118) 38.35%,rgba(0,0,0,.11) 41.85%,rgba(0,0,0,.105) 45.35%,rgba(0,0,0,.1) 48.85%,rgba(0,0,0,.103) 52.35%,rgba(0,0,0,.112) 55.85%,rgba(0,0,0,.126) 59.35%,rgba(0,0,0,.144) 62.85%,rgba(0,0,0,.165) 66.35%,rgba(0,0,0,.188) 69.85%,rgba(0,0,0,.213) 73.35%,rgba(0,0,0,.237) 76.85%,rgba(0,0,0,.262) 80.35%,rgba(0,0,0,.285) 83.85%,rgba(0,0,0,.306) 87.35%,rgba(0,0,0,.324) 90.85%,rgba(0,0,0,.338) 94.35%,rgba(0,0,0,.347) 97.85%,rgba(0,0,0,.35));
        transition: opacity 300ms;
        cursor: pointer;

        .actions {
          position: relative;
          display: flex;
          font-size: 12px;

          // aligned to left
          justify-content: flex-end;
          top: 20px;
          right: 20px;

          // aligned to center
          /*justify-content: center;*/
          /*height: 100%;*/
          /*align-items: center;*/

          .btn {
            background-color: hsla(0,0%,100%,.85);
            font-size: 14px;

            &:hover {
              background-color: #fff;
            }
          }
        }
      }

      &.selected {
        .select-cover {
          position: absolute;
          opacity: 0.5;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background: #4e73df;
          pointer-events: none;
        }
      }

      &:hover {
        .cover {
          opacity: 1;
        }
      }
    }
  }

  .wrapper {
    padding: 0;
    max-height: calc(100vh - 110px - 340px);
    overflow: auto;
  }
  .note-cover {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0, rgba(0, 0, 0, 0.199) 3.5%, rgba(0, 0, 0, 0.195) 7%, rgba(0, 0, 0, 0.19) 10.35%, rgba(0, 0, 0, 0.182) 13.85%, rgba(0, 0, 0, 0.174) 17.35%, rgba(0, 0, 0, 0.165) 20.85%, rgba(0, 0, 0, 0.155) 24.35%, rgba(0, 0, 0, 0.145) 27.85%, rgba(0, 0, 0, 0.135) 31.35%, rgba(0, 0, 0, 0.126) 34.85%, rgba(0, 0, 0, 0.118) 38.35%, rgba(0, 0, 0, 0.11) 41.85%, rgba(0, 0, 0, 0.105) 45.35%, rgba(0, 0, 0, 0.1) 48.85%, rgba(0, 0, 0, 0.103) 52.35%, rgba(0, 0, 0, 0.112) 55.85%, rgba(0, 0, 0, 0.126) 59.35%, rgba(0, 0, 0, 0.144) 62.85%, rgba(0, 0, 0, 0.165) 66.35%, rgba(0, 0, 0, 0.188) 69.85%, rgba(0, 0, 0, 0.213) 73.35%, rgba(0, 0, 0, 0.237) 76.85%, rgba(0, 0, 0, 0.262) 80.35%, rgba(0, 0, 0, 0.285) 83.85%, rgba(0, 0, 0, 0.306) 87.35%, rgba(0, 0, 0, 0.324) 90.85%, rgba(0, 0, 0, 0.338) 94.35%, rgba(0, 0, 0, 0.347) 97.85%, rgba(0, 0, 0, 0.35));
  }
</style>