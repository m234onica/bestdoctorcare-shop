<template>
    <v-dialog v-model="editDialog" max-width="1000">
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
                    <rich-text-editor :content="item.content" @quillEdit="quillEdit"></rich-text-editor>
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
    props: ["editDialog", "item"],
    components: {
        richTextEditor,
    },
    data() {
        return {
            valid: false,
            titleRules: [(v) => !!v || "標題為必填欄位"],
        };
    },
    methods: {
        close() {
            this.$emit("close");
        },
        quillEdit(data) {
            this.item.content = data;
        },
        submit() {
            let $vm = this;
            let validate = $vm.$refs.form.validate();
            if (validate) {
                $vm.$axios
                    .post(`${process.env.APP_URL}/announce/` + $vm.item.id, {
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
