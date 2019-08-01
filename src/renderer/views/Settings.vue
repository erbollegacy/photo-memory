<template>
  <!-- Main Content -->
  <div id="content" class="mt-4" style="position: relative">

    <!-- Begin Page Content -->
    <div class="container-fluid">

      <!-- Page Heading -->
      <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Settings</h1>
      </div>

      <div class="row">

        <div class="col-lg-12">

          <!-- Basic Card Example -->
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">Paths</h6>
            </div>
            <div class="card-body">
              <b-form>
                <b-form-group
                    label="Source:"
                    label-for="saveTo"
                >
                  <b-form-file v-model="sourcePath" directory placeholder="Source path">
                    <template slot="file-name" slot-scope="{ files }">
                      <span>{{ files[0].path }}</span>
                    </template>
                  </b-form-file>
                </b-form-group>

                <b-form-group
                    label="Destination:"
                    label-for="saveTo"
                >
                  <b-form-file v-model="destinationPath" directory placeholder="Destination path">
                    <template slot="file-name" slot-scope="{ files }">
                      <span>{{ files[0].path }}</span>
                    </template>
                  </b-form-file>
                </b-form-group>
              </b-form>

            </div>
            <div class="card-footer">
              <b-button variant="primary" @click="save()">
                Save
              </b-button>
            </div>
          </div>

        </div>

      </div>

    </div>
    <!-- /.container-fluid -->
  </div>
</template>

<script>
  export default {
    name: 'landing-page'
  }
</script>

<style>

</style>
