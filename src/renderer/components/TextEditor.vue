<template>
  <div class="text-editor" @keyup.right.left.stop>
    <ckeditor :editor="editor" :config="editorConfig" v-model="value"></ckeditor>
  </div>
</template>

<script>
  import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'text-editor',
    computed: {
      ...mapGetters([
        'activeImage',
        'imageNotes'
      ]),
      value: {
        get () {
          return this.imageNotes[this.activeImage]
        },
        set (value) {
          this.setImageNote({image: this.activeImage, note: value})
        }
      }
    },
    data () {
      return {
        editor: ClassicEditor,
        editorConfig: {
          toolbar: [
            'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'undo', 'redo'
          ]
        }
      }
    },
    methods: {
      ...mapActions([
        'setImageNote'
      ])
    }
  }
</script>

<style lang="scss">
  .text-editor {
    margin: auto;
    transition: all 1s;
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 9999999;

    /deep/ .ck-content {
      min-height: 100px;

      &.ck-focused {
        border-color: var(--ck-color-base-border) !important;
        box-shadow: none !important;
      }
    }
  }
</style>