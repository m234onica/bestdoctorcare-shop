<template>
    <v-container>
        <div id="announcement">
            <h1 fixed>公告管理</h1>
            <v-row>
                <v-spacer></v-spacer>
                <template>
                    <v-btn color="primary" class="mx-15" @click.stop="addDialog = true">新增公告</v-btn>
                </template>
                <add :addDialog="addDialog" @close="close"></add>
            </v-row>
            <v-simple-table fixed-header class="mt-8" height="300px">
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-left">標題</th>
                            <th class="text-left">發布時間</th>
                            <th class="text-center">動作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in data" :key="item.id">
                            <td>{{ item.title }}</td>
                            <td>{{ item.createdAt }}</td>
                            <td class="text-center">
                                <v-btn color="secondary">編輯</v-btn>
                                <v-btn color="error">刪除</v-btn>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>
    </v-container>
</template>

<script>
import add from "../components/announce/add.vue";
export default {
    components: {
        add,
    },
    async asyncData({ $axios }) {
        const data = await $axios.$get(`${process.env.APP_URL}/posts`);
        return { data: data };
    },
    middleware: "token",
    data() {
        return {
            addDialog: false,
        };
    },
    methods: {
        close() {
            this.addDialog = false;
        },
    },
};
</script>
