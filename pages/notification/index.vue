<template>
    <v-container id="notification">
        <loadingUI :customLoading="isLoading"></loadingUI>
        <v-alert v-model="alert" :color="msgType" v-if="msgType" dense text dismissible>{{ responseMsg }}</v-alert>
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
                            v-model="dateRangeText"
                            label="日期範圍"
                            prepend-icon="mdi-calendar"
                            v-bind="attrs"
                            v-on="on"
                            range
                            :disabled="disabled"
                        ></v-combobox>
                    </template>
                    <v-date-picker v-model="dates" range no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="
                                $refs.menu.save(dates);
                                getLineIdArry();
                            "
                        >
                            OK
                        </v-btn>
                    </v-date-picker>
                </v-menu>
            </v-col>

            <v-col class="d-flex" cols="12" sm="4">
                <v-select
                    v-model="collection"
                    :items="collectionsItems"
                    item-value="collection_id"
                    item-text="title"
                    label="商品種類"
                    dense
                    :disabled="disabled"
                    @change="getLineIdArry"
                ></v-select>
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
    </v-container>
</template>
<script>
import LoadingUI from "../../components/UI/loadingUI.vue";
export default {
    components: {
        LoadingUI,
    },
    async asyncData({ $axios }) {
        try {
            let collection = await $axios.get("/collection");
            return { collections: collection.data.collections };
        } catch (e) {
            //  console.log(e);
        }
    },
    data: () => ({
        isLoading: false,
        alert: false,
        msgType: null,
        customer: "所有人",
        customerItems: ["所有人", "購買", "檢視"],
        collection: "全部",
        collectionsItems: ["全部"],
        dates: [],
        menu: false,
        content: "",
        errorMsg: "",
        notifyFail: false,
        msgCount: 1,
        lineIdArry: [],
        responseMsg: "",
    }),
    computed: {
        dateRangeText() {
            return this.dates.join(" ~ ");
        },
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
            this.collectionsItems.push(item);
        });
        this.getLineIdArry(this.customer);
    },
    methods: {
        getLineIdArry() {
            let $vm = this;
            this.isLoading = true;
            var type = "ALL";
            if (this.customer == "檢視") {
                var type = "VIEW_PRODUCT";
            } else if (this.customer == "購買") {
                var type = "ORDER_PRODUCT";
            }
            var actionUrl = "/lineId?" + "type=" + type + "&dateRange=" + this.dates.sort() + "&collection=" + this.collection;
            $vm.lineIdArry = [];
            $vm.$axios
                .get(actionUrl)
                .then(function (response) {
                    response.data.forEach((item) => {
                        $vm.lineIdArry.push(item.lineUserId);
                    });
                })
                .finally(function (response) {
                    $vm.isLoading = false;
                });
        },
        clearError() {
            this.errorMsg = "";
            this.notifyFail = false;
        },
        submit() {
            let $vm = this;
            $vm.alert = true;
            if ($vm.content.length != 0) {
                $vm.$axios
                    .post("/sendMessage", {
                        lineIdArry: $vm.lineIdArry,
                        content: $vm.$data.content,
                    })
                    .then((response) => {
                        this.msgType = "success";
                        this.responseMsg = response.data.message;
                        this.content = "";
                    })
                    .catch((error) => {
                        this.msgType = "error";
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
