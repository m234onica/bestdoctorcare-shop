<template>
    <v-container>
        <div id="discountCode">
            <h1 fixed>折扣碼管理</h1>
            <v-simple-table fixed-header class="mt-8" height="300px">
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
                        <tr v-for="item in discountLists" :key="item.name">
                            <td>{{ item.createdAt }}</td>
                            <td>{{ item.userId }}</td>
                            <td>{{ item.title }}</td>
                            <td>{{ item.status }}</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>
    </v-container>
</template>

<script>
export default {
    components: {},
    async asyncData({ $axios }) {
        const data = await $axios.$get(`${process.env.APP_URL}/discounts`);
        return { data: data };
    },
    middleware: "token",
    data() {
        return {
            discountLists: [],
        };
    },
    methods: {
        getdiscountLists() {
            this.data.forEach((item) => {
                if (item.usedAt != null) {
                    item.status = "已使用";
                } else {
                    item.status = "尚未使用";
                }
                this.discountLists.push(item);
            });
        },
    },
    mounted() {
        this.getdiscountLists();
    },
};
</script>
