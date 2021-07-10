<template>
    <v-container>
        <div id="notification">
            <v-alert :color="type" v-if="type" dense text>{{ responseMsg }}</v-alert>
            <h1 fixed>發送通知</h1>
            <v-row align="center" class="mt-8">
                <v-col class="d-flex" cols="12" sm="4">
                    <v-select v-model="customer" :items="customerItems" label="使用者" @change="getLineIdArry(customer)" dense></v-select>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="dates"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-combobox
                                v-model="dates"
                                multiple
                                chips
                                small-chips
                                label="日期範圍"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                :disabled="disabled"
                            ></v-combobox>
                        </template>
                        <v-date-picker v-model="dates" multiple no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
                            <v-btn text color="primary" @click="$refs.menu.save(dates)"> OK </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>

                <v-col class="d-flex" cols="12" sm="4">
                    <v-select v-model="defaultCollection" :items="collectionsItems" label="商品種類" dense :disabled="disabled"></v-select>
                </v-col>
            </v-row>
            <span id="msg_count">則數提醒：目前共 {{ msgCount }} 則，發送給 {{ lineIdCount }} 人，共計送出 {{ totalMsgCount }} 則</span>
            <v-textarea
                outlined
                name="input-7-4"
                label="通知內容"
                v-model="content"
                class="mt-1 mb-0 pb-0"
                :error="notifyFail"
                :messages="errorMsg"
                @blur="clearError"
            ></v-textarea>

            <v-row>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="submit">送出</v-btn>
            </v-row>
        </div>
    </v-container>
</template>
<script>
export default {
    async asyncData({ $axios }) {
        try {
            let collection = await $axios.get("/collection");
            return { collections: collection.data.collections };
        } catch (e) {
            //  console.log(e);
        }
    },
    data: () => ({
        type: null,
        customer: "所有人",
        customerItems: ["所有人", "購買", "檢視"],
        defaultCollection: "全部",
        collectionsItems: ["全部"],
        dates: [],
        menu: false,
        content: "",
        errorMsg: "",
        notifyFail: false,
        msgCount: 1,
        lineIdArry: [],
        responseMsg: null,
    }),
    computed: {
        disabled() {
            var disabled = false;
            if (this.customer == "所有人") {
                disabled = true;
            }
            return disabled;
        },
        lineIdCount() {
            return this.lineIdArry.length;
        },
        totalMsgCount() {
            return this.lineIdCount * this.msgCount;
        },
    },
    mounted() {
        this.collections.forEach((item) => {
            this.collectionsItems.push(item.handle);
        });
        this.getLineIdArry(this.customer);
    },
    methods: {
        getLineIdArry(customer) {
            let $vm = this;
            $vm.lineIdArry = [];
            if (customer == "所有人") {
                $vm.$axios.get("/lineId").then(function (response) {
                    response.data.forEach((item) => {
                        $vm.lineIdArry.push(item.lineUserId);
                    });
                });
            } else if (customer == "檢視") {
            } else {
            }
        },
        clearError() {
            this.errorMsg = "";
            this.notifyFail = false;
        },
        submit() {
            let $vm = this;
            if ($vm.content.length != 0) {
                $vm.$axios
                    .post("/sendMessage", {
                        lineIdArry: $vm.lineIdArry,
                        content: $vm.$data.content,
                    })
                    .then((response) => {
                        this.type = "success";
                        this.responseMsg = response.data.message;
                    })
                    .catch((error) => {
                        this.type = "error";
                        console.log(error);
                        this.responseMsg = error.response.data.message;
                    });
            } else {
                $vm.errorMsg = "通知內容為必填";
                $vm.notifyFail = true;
            }
        },
    },
};
</script>
<style lang="scss">
.spacer {
    flex-grow: 0.989 !important;
}
#msg_count {
    font-size: 14px;
    color: gray;
}
#error_msg {
    display: block;
    color: red;
}
</style>
