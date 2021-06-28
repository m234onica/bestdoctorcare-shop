<template>
    <quill-editor :content="editedContent" @change="onEditorChange($event)" style="height: 250px"> </quill-editor>
</template>
<script>
import { debounce } from "vue-debounce";
export default {
    // 如果是編輯文章，則會從parent收到文章當前的content
    props: {
        content: {
            type: String,
            default: () => "",
        },
    },
    data() {
        return {
            editedContent: this.content,
            // 所有文本編輯器功能設定均寫在editorOption
            editorOption: {
                theme: "snow", // 可換
                modules: {
                    toolbar: {
                        // container這裡是個大坑，[]表分群
                        container: [
                            ["bold", "italic", "underline", "strike", "code"],
                            ["blockquote", "code-block"],
                            [{ header: [1, 2, 3, 4, 5, 6, false] }],
                            [{ list: "ordered" }, { list: "bullet" }],
                            [{ indent: "-1" }, { indent: "+1" }],
                            [{ color: [] }, { background: [] }],
                            [{ align: [] }],
                            ["clean"],
                            ["link", "image", "video"],
                        ],
                    },
                },
            },
        };
    },
    methods: {
        onEditorChange({ editor, html, text }) {
            this.$emit("quillEdit", html);
        },
    },
};
</script>
