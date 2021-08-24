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
                    <quill-editor :content="item.content" v-model="item.content" ref="richTextEditor" :options="editorOption" style="height: 250px"></quill-editor>
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
                            // ["link", "image"],
                        ],
                    },
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
