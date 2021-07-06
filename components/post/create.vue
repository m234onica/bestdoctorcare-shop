<template>
    <v-dialog v-model="createDialog" fullscreen persistent>
        <v-card id="create_dialog">
            <v-card-title class="text-h5 px-10 pt-8"
                >新增公告
                <v-btn color="darken-1" class="mr-4" absolute right icon @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text class="mt-5 px-10">
                <v-form id="login_input_field" ref="form" v-model="valid" lazy-validation>
                    <v-text-field v-model="title" label="標題" :rules="titleRules" outlined required dense></v-text-field>
                    <quill-editor v-model="content" ref="richTextEditor" :options="editorOption" style="height: 500px"></quill-editor>
                </v-form>
            </v-card-text>
            <v-card-actions class="mt-5 py-5 px-10">
                <v-spacer></v-spacer>
                <v-btn id="submit" color="primary" @click="submit()">送出</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    props: ["createDialog"],
    data() {
        return {
            valid: false,
            title: "",
            content: "",
            titleRules: [(v) => !!v || "標題為必填欄位"],
            contentRules: [(v) => !!v || "內容為必填欄位"],
            editorOption: {
                theme: "snow", // 可換
                modules: {
                    imageResize: {
                        //添加
                        displayStyles: {
                            //添加
                            backgroundColor: "black",
                            border: "none",
                            color: "white",
                        },
                        modules: ["Resize", "DisplaySize", "Toolbar"], //添加
                    },
                    toolbar: [
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
                },
            },
        };
    },
    methods: {
        close() {
            this.$emit("close");
        },
        submit() {
            let $vm = this;
            let validate = $vm.$refs.form.validate();
            if (validate) {
                $vm.$axios
                    .post("/announce", {
                        data: $vm.$data,
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
<style lang="scss" scpoed>
#create_dialog {
    .v-card__text {
        min-height: 600px;
    }
}
</style>
