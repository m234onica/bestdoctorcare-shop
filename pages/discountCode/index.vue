<template>
    <v-container id="discountCode">
        <loadingUI :customLoading="isLoading"></loadingUI>
        <template>
            <v-row class="mt-3">
                <v-col :cols="10">
                    <h1 fixed>邀請碼管理</h1>
                </v-col>
                <v-col>
                    <v-btn color="primary" @click.stop="exportData()">匯出CSV檔</v-btn>
                </v-col>
            </v-row>
        </template>
        <v-simple-table fixed-header class="mt-8">
            <template v-slot:default>
                <thead>
                    <tr>
                        <th class="text-left">發送日期</th>
                        <th class="text-left">獲得者</th>
                        <th class="text-left">發送因由</th>
                        <th class="text-left">狀態</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in data" :key="item.name">
                        <td>{{ item.createdAt }}</td>
                        <td>{{ item.customerName }}</td>
                        <td>{{ item.title }}</td>
                        <td>{{ item.status }}</td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
        <div class="text-center">
            <v-pagination class="my-4" relative v-model="page" :length="totalPages" @input="next" :total-visible="10"></v-pagination>
        </div>
    </v-container>
</template>

<script>
import moment from "moment";
import LoadingUI from "../../components/UI/loadingUI.vue";

export default {
    components: {
        LoadingUI,
    },
    async asyncData({ $axios, query }) {
        try {
            const page = query.page || 1;
            let data = await $axios.get("/discounts?page=" + page);
            let discounts = data.data.list;
            discounts.forEach((item) => {
                item.createdAt = moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss");
                if (item.usedAt != null) {
                    item.status = "已使用";
                } else {
                    item.status = "尚未使用";
                }
            });
            return {
                data: discounts,
                page: parseInt(data.data.page),
                totalPages: data.data.totalPages,
            };
        } catch (e) {
            // console.log(e);
        }
    },
    middleware: "token",
    watchQuery: ["page"],
    data() {
        return {
            isLoading: false,
            discountLists: [],
        };
    },
    methods: {
        next() {
            this.$router.push({ query: { page: this.page } });
        },
        exportData() {
            let $vm = this;
            this.isLoading = true;
            $vm.$axios
                .get("/export", { responseType: "blob" })
                .then(function (response) {
                    const timeStamp = Date.now();
                    if (!window.navigator.msSaveOrOpenBlob) {
                        // BLOB NAVIGATOR
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", "export_" + timeStamp + ".csv");
                        document.body.appendChild(link);
                        link.click();
                    } else {
                        // BLOB FOR EXPLORER 11
                        const url = window.navigator.msSaveOrOpenBlob(new Blob([response.data]), "export_" + timeStamp + ".csv");
                    }
                    $vm.isLoading = false;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
    },
};
</script>

<style lang="scss">
.v-data-table__wrapper {
    height: 70vh;
    min-height: 65vh;
    max-height: 80vh;
    table {
        margin-bottom: 28px;
    }
}
.v-pagination {
    position: absolute;
    bottom: 10px;
    right: 0px;
    background-color: white;
}
</style>
