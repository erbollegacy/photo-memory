<template>
  <!-- Begin Page Content -->
  <div class="container-fluid">

    <!-- Page Heading -->
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0 text-gray-800">Select Photos</h1>
    </div>

    <div class="col-md-12" ref="container">
      <div class="row">
        <div class="gallery">
          <div class="image-container" v-for="image in images" :key="image.path">
            <img v-lazy="image.path" :style="{width: image.width + 'px', height: image.height + 'px'}"/>
            <div class="cover">
              <div class="actions">

                <!--<a href="#" title="Add a note" class="btn btn-light btn-circle">-->
                  <!--<i class="fas fa-edit"></i>-->
                <!--</a>-->

                <a href="#" title="Select Photo" @click="select(image.path)" class="btn btn-light btn-circle" style="margin-left: 9px;">
                  <i class="fas fa-plus"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
  <!-- /.container-fluid -->
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import sharp from 'sharp'

  export default {
    name: 'choose-folder',
    computed: {
      ...mapGetters([
        'chosenDirectory',
        'directoryImages'
      ])
    },
    data () {
      return {
        images: [],
        selectedImages: {},
        resizeTimeout: null,
        resizeDelay: 200
      }
    },
    methods: {
      ...mapActions([
        'scanDirectory'
      ]),

      onResize () {
        clearTimeout(this.resizeTimeout)
        this.resizeTimeout = setTimeout(() => {
          this.updateImages()
        }, this.resizeDelay)
      },

      updateImages () {
        const sizesPromises = []
        const containerWidth = this.$refs.container.offsetWidth

        this.directoryImages.forEach(image => {
          let size = sharp(`${this.chosenDirectory}/${image}`)
            .metadata()
            .then(({ width, height }) => {
              let columnWidth = (containerWidth / 3) - 7
              let ratio = width / columnWidth
              height = height / ratio
              width = columnWidth

              return { width, height, path: `thumb://${this.chosenDirectory}/${image}?w=${parseInt(width)}` }
            })
          sizesPromises.push(size)
        })

        Promise.all(sizesPromises)
          .then(sizes => {
            this.images = sizes
          })
      },

      select (url) {
        this.selectedImages[url] = true
      },

      unselect (url) {
        delete this.selectedImages[url]
      }
    },

    mounted () {
      if (this.chosenDirectory) {
        this.scanDirectory(this.chosenDirectory)
          .then(() => this.updateImages())

        window.addEventListener('resize', this.onResize)
      } else {
        this.$router.push('/')
      }
    },

    destroyed () {
      window.removeEventListener('resize', this.onResize)
    }
  }
</script>

<style scoped lang="scss">
  .gallery {
    column-count: 3;
    column-fill: auto;
    column-gap: 14px;

    .image-container {
      position: relative;
      margin-bottom: 14px;

      img {
        width: 100%;
        background: #ccc;
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
        cursor: zoom-in;

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

      &:hover {
        .cover {
          opacity: 1;
        }
      }
    }
  }
</style>
