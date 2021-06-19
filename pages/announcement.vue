<template>
    <v-container>
        <div id="announcement">
            <h1 fixed>公告管理</h1>
            <template>
                <v-row>
                    <v-col :cols="10" class="pa-0">
                        <v-spacer></v-spacer>
                    </v-col>
                    <v-col>
                        <v-btn color="primary" @click.stop="createDialog = true">新增公告</v-btn>
                    </v-col>
                </v-row>
            </template>
            <create :createDialog="createDialog" @close="close"></create>
            <v-simple-table fixed-header class="mt-8" height="300px">
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-left">標題</th>
                            <th class="text-left">發布時間</th>
                            <th class="text-left">動作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in data" :key="item.id">
                            <td>{{ item.title }}</td>
                            <td>{{ new Date(item.createdAt).toLocaleString() }}</td>
                            <td>
                                <template>
                                    <v-btn color="teal accent-4" class="white--text" @click.stop="editDialog = true">編輯</v-btn>
                                </template>
                                <v-btn color="error">刪除</v-btn>
                            </td>
                            <edit :editDialog="editDialog" :item="item" @close="close"></edit>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>
    </v-container>
</template>

<script>
import create from "../components/post/create.vue";
import edit from "../components/post/edit.vue";
export default {
    components: {
        create,
        edit,
    },
    async asyncData({ $axios }) {
        const data = await $axios.$get(`${process.env.APP_URL}/announcements`);
        return { data: data };
    },
    middleware: "token",
    data() {
        return {
            createDialog: false,
            editDialog: false,
        };
    },
    methods: {
        close() {
            this.createDialog = false;
            this.editDialog = false;
        },
    },
};
</script>
