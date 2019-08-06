<template>
  <!-- Main Content -->
  <div id="content" class="mt-4">
    <!-- Begin Page Content -->
    <div class="container-fluid">

      <div class="select-btn text-center">
        <h1 class="h3 mb-0 text-primary">Photo Memory</h1>
        <hr />
        <a href="#" @click.prevent="onClicked" class="btn btn-primary btn-icon-split btn-lg">
          <span class="icon text-white-50">
            <i class="fas fa-folder"></i>
          </span>
          <span class="text">Choose folders</span>
        </a>
      </div>

    </div>
  </div>
  <!-- /.container-fluid -->
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'choose-folder',
    computed: {
      ...mapGetters(['sourcePath'])
    },
    methods: {
      ...mapActions([
        'chooseDirectory',
        'scanDirectory'
      ]),
      async onClicked () {
        // await this.chooseDirectory()
        this.$router.push('settings')
      }
    },

    mounted () {
      if (this.sourcePath) {
        this.$router.push('select-photos')
      }
    }
  }
</script>

<style scoped lang="scss">
  .select-btn {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

</style>
