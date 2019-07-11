<template>
  <!-- Begin Page Content -->
  <div class="container-fluid">

    <!-- Page Heading -->
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0 text-gray-800">Select Photos</h1>
    </div>

    <div class="gallery">
      <figure v-for="image in directoryImages">
        <img :src="`atom://${chosenDirectory}/${image}`" alt="" />
      </figure>
    </div>

  </div>
  <!-- /.container-fluid -->
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'choose-folder',
    computed: {
      ...mapGetters([
        'chosenDirectory',
        'directoryImages'
      ])
    },
    methods: {
      ...mapActions([
        'scanDirectory'
      ])
    },
    mounted () {
      if (this.chosenDirectory) {
        this.scanDirectory(this.chosenDirectory)
      } else {
        this.$router.push('/')
      }
    }
  }
</script>

<style scoped lang="scss">
  .gallery {
    position: relative;
    z-index: 2;
    padding: 10px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-flow: row wrap;
    flex-flow: row wrap;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-transition: all .5s ease-in-out;
    transition: all .5s ease-in-out;
  }
  .gallery.pop {
    -webkit-filter: blur(10px);
    filter: blur(10px);
  }
  .gallery figure {
    -ms-flex-preferred-size: 33.333%;
    flex-basis: 33.333%;
    padding: 10px;
    overflow: hidden;
    border-radius: 10px;
    cursor: pointer;
  }
  .gallery figure img {
    width: 100%;
    border-radius: 10px;
    -webkit-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
  }
  .gallery figure figcaption {
    display: none;
  }

</style>
