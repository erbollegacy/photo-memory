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
    opacity: 0.1;
    margin: auto;
    transition: all 1s;

    &:hover {
      opacity: 0.8;
    }

    /deep/ .ck-content {
      min-height: 100px;

      &.ck-focused {
        border-color: var(--ck-color-base-border) !important;
      }
    }
  }
</style>