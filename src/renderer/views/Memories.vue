<template>
  <!-- Main Content -->
  <div id="content" class="mt-4" style="position: relative">
    <!-- Begin Page Content -->
    <div class="container-fluid">

      <!-- Page Heading -->
      <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Memories</h1>
      </div>

    </div>

    <div class="container">
      <!-- Page Heading -->
      <div class="cardList" v-for="memory of memories" @click="browse(memory.path)">
        <div class="card" v-for="thumb of memory.thumbs">
          <div class="card__bg" :style="{ backgroundImage: `url('thumb://${thumb}')` }"></div>
        </div>
        <span class="cardList__title">{{ memory.description | truncate(40, '...') }}</span>
      </div>
    </div>

    <div class="container no-image-container" v-if="!memories.length">
      <div class="no-image">
        <i class="fas fa-box-open"></i>
        <span class="no-image-text">no memories here</span>
      </div>
    </div>

    <!-- /.container-fluid -->
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import open from 'open'

  export default {
    name: 'landing-page',
    computed: {
      ...mapGetters([
        'memories'
      ]),

      hasSelectedItems () {
        if (this.selectedImages.names) {
          return Object.keys(this.selectedImages.names).length
        }
      }
    },

    filters: {
      truncate: function (text, length, clamp) {
        clamp = clamp || '...'
        let node = document.createElement('div')
        node.innerHTML = text
        let content = node.textContent
        return content.length > length ? content.slice(0, length) + clamp : content
      }
    },

    methods: {
      browse (memoryPath) {
        open(`${memoryPath}/index.html`)
      }
    }
  }
</script>

<style scoped lang="scss">
  .container {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    width: 100vw;
    max-width: 80vw;
    margin: auto;
  }
  .container h1 {
    -webkit-box-flex: 0;
    -ms-flex: none;
    flex: none;
    width: 100%;
    margin: 0 2% 2em 2%;
  }

  .cardList {
    position: relative;
    display: block;
    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    margin: 2%;
    -webkit-filter: none;
    filter: none;
    opacity: 1;
    -webkit-transition: 0.25s ease-in-out opacity, 0.25s ease-in-out filter;
    transition: 0.25s ease-in-out opacity, 0.25s ease-in-out filter;
    cursor: pointer;
    width: 21%;
    flex-grow: 0;
  }
  .cardList__title {
    display: block;
    padding-top: 70%;
    text-align: center;
    font-size: 0.8em;
    opacity: 0.8;
    z-index: 0;
  }
  .cardList:hover .card {
    box-shadow: 0 5px 25px 0 rgba(0, 0, 0, 0.5);
    -webkit-transition: 0.35s ease-out transform, 0.35s ease-out shadow;
    transition: 0.35s ease-out transform, 0.35s ease-out shadow;
  }
  .cardList:nth-child(2n + 1) .card:nth-child(1) {
    -webkit-transform: translate(-2%, -2%);
    transform: translate(-2%, -2%);
  }
  .cardList:nth-child(2n + 1) .card:nth-child(2) {
    -webkit-transform: translate(-2%, 2%) rotate(2deg);
    transform: translate(-2%, 2%) rotate(2deg);
  }
  .cardList:nth-child(2n + 1) .card:last-of-type {
    -webkit-transform: rotate(-2deg);
    transform: rotate(-2deg);
  }
  .cardList:nth-child(2n + 1):hover .card__bg {
    -webkit-filter: none;
    filter: none;
    opacity: 1;
  }
  .cardList:nth-child(2n + 1):hover .card:nth-child(1) {
    -webkit-transform: translate(30%, 45%) rotate(-2deg);
    transform: translate(30%, 45%) rotate(-2deg);
  }
  .cardList:nth-child(2n + 1):hover .card:nth-child(2) {
    -webkit-transform: translate(-50%, 35%) rotate(5deg);
    transform: translate(-50%, 35%) rotate(5deg);
  }
  .cardList:nth-child(2n + 1):hover .card:last-of-type {
    -webkit-transform: rotate(5deg) translate(0%, -40%);
    transform: rotate(5deg) translate(0%, -40%);
  }
  .cardList:nth-child(2n) .card:nth-child(1) {
    -webkit-transform: translate(2%, 2%);
    transform: translate(2%, 2%);
  }
  .cardList:nth-child(2n) .card:nth-child(2) {
    -webkit-transform: translate(2%, -2%) rotate(-2deg);
    transform: translate(2%, -2%) rotate(-2deg);
  }
  .cardList:nth-child(2n) .card:nth-child(3) {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg);
  }
  .cardList:nth-child(2n):hover .card:nth-child(1) {
    -webkit-transform: translate(2%, 50%) rotate(5deg);
    transform: translate(2%, 50%) rotate(5deg);
  }
  .cardList:nth-child(2n):hover .card:nth-child(2) {
    -webkit-transform: translate(50%, -30%) rotate(10deg);
    transform: translate(50%, -30%) rotate(10deg);
  }
  .cardList:nth-child(2n):hover .card:nth-child(3) {
    -webkit-transform: translate(-25%, -40%) rotate(-5deg);
    transform: translate(-25%, -40%) rotate(-5deg);
  }

  .card {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding-top: 60%;
    background-color: #ccc;
    -webkit-transition: 0.28s ease-out transform, 0.28s ease-out shadow;
    transition: 0.28s ease-out transform, 0.28s ease-out shadow;
    overflow: hidden;
    z-index: 5;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
  }
  .card__bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #ccc;
  }
  .card:not(:last-of-type) .card__bg {
    background-blend-mode: multiply;
    -webkit-filter: grayscale(100%);
    filter: grayscale(100%);
    opacity: 0.25;
    -webkit-transition: 0.25s ease-in-out filter, 0.25s ease-in-out opacity;
    transition: 0.25s ease-in-out filter, 0.25s ease-in-out opacity;
  }
  .cardList:hover .card:not(:last-of-type) .card__bg {
    background-blend-mode: normal;
    -webkit-filter: none;
    filter: none;
    opacity: 1;
  }

  .container:hover .cardList {
    -webkit-filter: grayscale(100%);
    filter: grayscale(100%);
    opacity: 0.25;
    z-index: 1;
  }
  .container:hover .cardList:hover {
    -webkit-filter: none;
    filter: none;
    opacity: 1;
    z-index: 100;
  }

  .no-image-container {
    justify-content: center;

    .no-image {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #ced4da;

      i {
        font-size: 100px
      }
      .no-image-text {
        color: darkgray;
        font-size: 20px;
        font-style: italic;
      }
    }
  }
</style>
