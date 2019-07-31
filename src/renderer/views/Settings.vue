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

        <div class="col-lg-6">

          <!-- Basic Card Example -->
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">Paths</h6>
            </div>
            <div class="card-body">
              <b-form>
                <b-form-group
                    label="Save to:"
                    label-for="saveTo"
                    description="Please choose a path where you'd like to save your Photo Memory"
                >
                  <b-form-file v-model="saveTo" directory placeholder="Destination path">
                    <template slot="file-name" slot-scope="{ files }">
                      <span>{{ files[0].path }}</span>
                    </template>
                  </b-form-file>
                </b-form-group>
              </b-form>

              <b-button :disabled="!saveTo" variant="primary" @click="ok()">
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
