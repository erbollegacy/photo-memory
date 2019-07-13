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
          <img v-for="image in images" v-lazy="image.path" :style="{width: image.width + 'px', height: image.height + 'px'}"
               :key="image.path" alt=""/>
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
        images: []
      }
    },
    methods: {
      ...mapActions([
        'scanDirectory'
      ])
    },
    mounted () {
      if (this.chosenDirectory) {
        this.scanDirectory(this.chosenDirectory)
          .then(images => {
            const sizesPromises = []
            const containerWidth = this.$refs.container.offsetWidth

            images.forEach(image => {
              let size = sharp(`${this.chosenDirectory}/${image}`)
                .metadata()
                .then(({ width, height }) => {
                  let columnWidth = (containerWidth / 3) - 7
                  let ratio = width / columnWidth
                  height = height / ratio
                  width = columnWidth

                  return { width, height, path: `thumb://${this.chosenDirectory}/${image}` }
                })
              sizesPromises.push(size)
            })

            Promise.all(sizesPromises)
              .then(sizes => {
                this.images = sizes
              })
          })
      } else {
        this.$router.push('/')
      }
    }
  }
</script>

<style scoped lang="scss">
  .gallery {
    column-count: 3;
    column-fill: auto;
    column-gap: 14px;
  }

  .gallery img {
    width: 100%;
    margin: 7px 0;
    background: #ccc;
  }

  @media (max-width: 500px) {
    .gallery {
      column-count: 1;
    }
  }

</style>
