<template>
  <div class="page">
    <!-- Main Content -->
    <div id="content" class="mt-4">
      <!-- Begin Page Content -->
      <div class="container-fluid">

        <!-- Page Heading -->
        <div class="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 class="h3 mb-0 text-gray-800">Select Photos</h1>
        </div>

        <div class="col-md-12" ref="container">
          <div class="row">
            <div class="gallery">
              <div class="image-container" v-for="image in images" :key="image.path" :class="{selected: selectedImages[image.name]}">
                <img v-lazy="image.path" :style="{width: image.width + 'px', height: image.height + 'px'}"/>
                <span class="icon-selected" v-if="selectedImages[image.name]">
                  <i class="fas fa-check-circle"></i>
                </span>
                <div class="cover">
                  <div class="actions">

                    <!--<a href="#" title="Add a note" class="btn btn-light btn-circle">-->
                    <!--<i class="fas fa-edit"></i>-->
                    <!--</a>-->

                    <a v-if="!selectedImages[image.name]" href="#" title="Select Photo" @click.prevent="select(image.name)" class="btn btn-light btn-circle btn-select">
                      <i class="fas fa-plus"></i>
                    </a>
                    <a v-else href="#" title="Unselect Photo" @click.prevent="unselect(image.name)" class="btn btn-light btn-circle btn-select">
                      <i class="fas fa-minus"></i>
                    </a>
                  </div>
                </div>
                <div class="select-cover"></div>
              </div>
            </div>
          </div>
        </div>

        <b-spinner v-if="showLoading" class="loading-spinner" type="grow" variant="primary" label="Loading..."></b-spinner>
      </div>
      <!-- /.container-fluid -->
    </div>
    <!-- End of Main Content -->

    <!-- Footer -->
    <footer class="footer" v-if="images.length">
      <div class="container-fluid">
        <a href="#" @click.prevent="showModal" :class="{disabled: !hasSelectedItems}" title="Create a Memory" class="btn btn-primary btn-circle">
          <i class="fas fa-plus"></i>
        </a>
      </div>
    </footer>
    <!-- End of Footer -->

    <b-modal id="createMemory" okTitle="Save" scrollable size="xl" title="Create a Memory" @ok="onSave()">
      <b-form>
        <b-form-group
            label="Save to:"
            label-for="saveTo"
            description="Please choose a path where you'd like to save your Photo Memory"
        >
          <b-form-file v-model="saveTo" directory :placeholder="saveTo ? saveTo.path : 'Destination path'">
            <template slot="file-name" slot-scope="{ files }">
              <span>{{ files[0].path }}</span>
            </template>
          </b-form-file>
        </b-form-group>
        <b-form-group label="Description:">
          <ckeditor :editor="editor" v-model="description"></ckeditor>
        </b-form-group>
      </b-form>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button :disabled="!saveTo || showLoading" variant="primary" @click="ok()">
          Save
        </b-button>
        <b-button @click="cancel()">
          Cancel
        </b-button>
      </template>
    </b-modal>

  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
  import sharp from 'sharp'

  export default {
    name: 'choose-folder',
    computed: {
      ...mapGetters([
        'chosenDirectory',
        'directoryImages'
      ]),

      hasSelectedItems () {
        if (this.selectedImages) {
          return Object.keys(this.selectedImages).length
        }
      }
    },
    data () {
      return {
        images: [],
        selectedImages: {},
        notes: {},
        description: '',
        saveTo: null,
        resizeTimeout: null,
        resizeDelay: 200,
        editor: ClassicEditor,
        showLoading: false
      }
    },
    methods: {
      ...mapActions([
        'scanDirectory',
        'saveMemory'
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

              return {
                width,
                height,
                path: `thumb://${this.chosenDirectory}/${image}?w=${parseInt(width)}`,
                name: image
              }
            })
            .catch(() => {
              console.log(`${image} is not a valid image`)
            })
          sizesPromises.push(size)
        })

        Promise.all(sizesPromises)
          .then(sizes => {
            this.images = sizes.filter(size => size)
          })
      },

      select (url) {
        this.$set(this.selectedImages, url, true)
      },

      unselect (url) {
        this.$delete(this.selectedImages, url)
      },

      showModal () {
        this.$bvModal.show('createMemory')
      },

      onSave () {
        this.showLoading = true
        this.saveMemory({
          selectedImages: this.selectedImages,
          notes: this.notes,
          description: this.description,
          saveTo: this.saveTo.path
        })
          .then(() => {
            this.showLoading = false
          })
          .catch(() => {
            this.showLoading = false
          })
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
  .footer {
    height: 64px;
    display: flex;
    align-items: center;
    box-shadow: 0 -0.30rem 1.75rem 0 rgba(58, 59, 69, 0.15);
    text-align: center;
  }
  /deep/ .ck-editor__editable_inline {
    min-height: 140px;

    p {
      margin-top: 8px;
      margin-bottom: 8px;
    }
  }
  .loading-spinner {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 9999;
    bottom: 50%;
    width: 5rem;
    height: 5rem;
  }
  .page {
    position: relative;
  }
</style>
