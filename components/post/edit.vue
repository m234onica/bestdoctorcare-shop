<template>
    <v-dialog v-model="editDialog" max-width="1000" persistent>
        <v-card id="edit_dialog">
            <v-card-title class="text-h5 px-10 pt-8"
                >編輯公告
                <v-btn color="darken-1" class="mr-4" absolute right icon @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text class="mt-5 px-10">
                <v-form id="login_input_field" ref="form" v-model="valid" lazy-validation>
                    <v-text-field v-model="item.title" label="標題" :rules="titleRules" outlined required dense></v-text-field>
                    <quill-editor :content="item.content" v-model="item.content" ref="richTextEditor" @ready="onEditorReady($event)" :options="editorOption" style="height: 250px"></quill-editor>
                </v-form>
            </v-card-text>
            <v-card-actions class="py-5 px-10">
                <v-spacer></v-spacer>
                <v-btn id="submit" color="primary" @click="submit()">送出</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    props: ["editDialog", "item"],
    data() {
        return {
            valid: false,
            titleRules: [(v) => !!v || "標題為必填欄位"],
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
                            [{ size: ["small", false, "large", "huge"] }],
                            [{ color: [] }, { background: [] }],
                            [{ align: [] }],
                            ["clean"],
                            ["link", "image"],
                        ],
                        handlers: {
                            image: this.imageHandler,
                        },
                    },
                },
            },
        };
    },
    methods: {
        close() {
            this.$emit("close");
        },
        onEditorReady(editor) {
            if (this.value) {
                this.content = this.value;
            }
            this.editor = editor;
        },
        imageHandler() {
            this.imageFail = false;
            if (this.isUploading) {
                this.imageFail = true;
                this.errorMsg = "正在上傳...";
                return;
            }
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.click();
            // Listen upload local image and save to server
            input.onchange = () => {
                const file = input.files[0];
                const formData = new FormData();
                const maxSize = 5120 * 1024;

                formData.set("file", file);
                if (file.size > maxSize) {
                    this.imageFail = true;
                    this.errorMsg = "圖片尺寸過大！";
                    return;
                }
                // file type is only image.
                if (/^image\//.test(file.type)) {
                    this.uploadImage(formData, "item");
                } else {
                    console.log(103);
                    this.imageFail = true;
                    this.errorMsg = "圖片格式不正確";
                }
            };
        },
        insertToEditor(url) {
            // push image url to rich editor.
            const range = this.editor.getSelection();
            this.editor.insertEmbed((range && range.index) || 1, "image", url);
        },
        async uploadImage(file, type) {
            this.isUploading = true;
            let $vm = this;
            try {
                await $vm.$axios
                    .post("/upload", file, {
                        headers: {
                            "content-type": "multipart/form-data", // do not forget this
                        },
                    })
                    .then(function (response) {
                        $vm.insertToEditor(response.data);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                this.isUploading = false;
            } catch (err) {
                this.errorMsg = "上傳失敗";
                this.isUploading = false;
            }
        },
        submit() {
            let $vm = this;
            let validate = $vm.$refs.form.validate();
            if (validate) {
                $vm.$axios
                    .post("/announce/" + $vm.item.id, {
                        data: $vm.item,
                    })
                    .then(function (response) {
                        $vm.close();
                        window.location.reload();
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        },
    },
};
</script>
<style lang="scss">
#edit_dialog {
    .v-card__text {
        min-height: 370px;
    }
}
</style>
