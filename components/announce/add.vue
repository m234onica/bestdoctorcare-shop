<template>
    <v-dialog v-model="addDialog" max-width="1000">
        <v-card id="add_dialog">
            <v-card-title class="text-h5 px-10"
                >新增公告
                <v-btn color="darken-1" class="mr-4" absolute right icon @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text class="mt-5 px-10">
                <v-form id="login_input_field" ref="form" v-model="valid" lazy-validation>
                    <v-text-field v-model="title" label="標題" :rules="titleRules" outlined required dense></v-text-field>
                    <v-textarea v-model="content" label="內容" name="input-7-4" :rules="contentRules" class="mb-0 pb-0" outlined></v-textarea>
                    <v-row class="pr-4 mb-4">
                        <v-spacer></v-spacer>
                        <v-btn id="submit" color="primary" @click="submit()">送出</v-btn>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    props: ["addDialog"],
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
        submit() {
            let $vm = this;
            let validate = $vm.$refs.form.validate();
            if (validate) {
                console.log(`${process.env}`);
                $vm.$axios
                    .post(`${process.env.APP_URL}/announce/post`, {
                        data: $vm.$data,
                    })
                    .then(function (response) {
                        $vm.close();
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        },
    },
};
</script>
