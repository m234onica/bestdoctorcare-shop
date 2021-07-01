import Vue from 'vue';
import VueQuillEditor from 'vue-quill-editor';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize', ImageResize);
Vue.use(VueQuillEditor);
