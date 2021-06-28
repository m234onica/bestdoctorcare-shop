<template>
    <v-dialog v-model="createDialog" max-width="1000">
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
                    <rich-text-editor v-model="content" @quillEdit="quillEdit"></rich-text-editor>
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
import richTextEditor from "../UI/richTextEditor.vue";
export default {
    props: ["createDialog"],
    components: {
        richTextEditor,
    },
    data() {
        return {
            valid: false,
            title: "",
            content: "",
            titleRules: [(v) => !!v || "標題為必填欄位"],
            contentRules: [(v) => !!v || "內容為必填欄位"],
        };
    },
    methods: {
        close() {
            this.$emit("close");
        },
        quillEdit(data) {
            this.content = data;
        },
        submit() {
            let $vm = this;
            let validate = $vm.$refs.form.validate();
            if (validate) {
                console.log(`${process.env}`);
                $vm.$axios
                    .post(`${process.env.APP_URL}/announce`, {
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
#preview_content {
    border-radius: 4px;
    min-height: 50px;
}
</style>
