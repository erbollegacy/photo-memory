<template>
  <!-- Begin Page Content -->
  <div class="container-fluid">

    <div class="select-btn text-center">
      <h1 class="h3 mb-0 text-primary">Photo Memory</h1>
      <hr />
      <a href="#" @click.prevent="onClicked" class="btn btn-primary btn-icon-split btn-lg">
        <span class="icon text-white-50">
          <i class="fas fa-folder"></i>
        </span>
        <span class="text">Choose a folder</span>
      </a>
    </div>

  </div>
  <!-- /.container-fluid -->
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'choose-folder',
    methods: {
      ...mapActions([
        'chooseDirectory',
        'scanDirectory'
      ]),
      async onClicked () {
        await this.chooseDirectory()
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
