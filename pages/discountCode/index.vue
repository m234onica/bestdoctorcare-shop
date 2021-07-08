<template>
    <v-container>
        <div id="discountCode">
            <h1 fixed>折扣碼管理</h1>
            <template>
                <v-row>
                    <v-col :cols="10" class="pa-0">
                        <v-spacer></v-spacer>
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
        </div>
        <div class="text-center">
            <v-pagination absolute v-model="page" :length="totalPages" @input="next"></v-pagination>
        </div>
    </v-container>
</template>

<script>
export default {
    components: {},
    async asyncData({ $axios, query}) {
        try {
            const page = query.page || 1;
            let data = await $axios.get("/discounts?page=" + page);
            let discounts = data.data.list;
            discounts.forEach((item) => {
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
            discountLists: [],
        };
    },
    methods: {
        next() {
            this.$router.push({ query: { page: this.page } });
        },
    },
};
</script>

<style lang="scss">
.v-data-table__wrapper {
    height: calc(100% - 44px);
}
.v-pagination {
    position: absolute;
    bottom: 10px;
    right: 0px;
}
</style>
