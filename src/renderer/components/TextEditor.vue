<template>
  <div class="text-editor">
    <ckeditor :editor="editor" v-model="value" @input="$emit('input', $event)" @change></ckeditor>
  </div>
</template>

<script>
  import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

  export default {
    data () {
      return {
        editor: ClassicEditor,
        value: ''
      }
    },
    methods: {
      setValue (value) {
        this.value = value
      }
    }
  }
</script>

<style lang="scss">
  .text-editor {
    margin: auto;
    transition: all 1s;

    /deep/ .ck-content {
      min-height: 100px;

      &.ck-focused {
        border-color: var(--ck-color-base-border) !important;
        box-shadow: none !important;
      }
    }
  }
</style>