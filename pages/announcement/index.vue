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
            <v-simple-table fixed-header class="mt-8">
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-left">標題</th>
                            <th class="text-left" width="300">發布時間</th>
                            <th class="text-left" width="200">動作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in announcement" :key="item.id">
                            <td>{{ item.title }}</td>
                            <td>{{ item.createdAt }}</td>
                            <td>
                                <template>
                                    <v-btn color="deep-purple" class="white--text" @click.stop="openEditDialog(index)">編輯</v-btn>
                                </template>
                                <v-btn color="red darken-2" class="white--text" @click="deleteAnnounce(item.id)">刪除</v-btn>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>
        <edit :item="dialogData" :editDialog="editDialog" @close="close"></edit>
        <div class="text-center">
            <v-pagination absolute v-model="page" :length="totalPages" @input="next" :total-visible="10"></v-pagination>
        </div>
    </v-container>
</template>

<script>
import create from "../../components/post/create";
import edit from "../../components/post/edit";
import moment from "moment";

export default {
    components: {
        create,
        edit,
    },
    async asyncData({ $axios, query }) {
        try {
            const page = query.page || 1;
            let data = await $axios.get("/announcements?page=" + page);
            const announcement = data.data.list;
            announcement.forEach((item) => {
                item.createdAt = moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss");
            });
            return {
                announcement: announcement,
                page: parseInt(data.data.page),
                totalPages: data.data.totalPages,
            };
        } catch (e) {
            //  console.log(e); display errors
        }
    },
    middleware: "token",
    watchQuery: ["page"],
    data() {
        return {
            loading: true,
            createDialog: false,
            editDialog: [],
            post: {
                id: null,
                title: null,
                content: null,
            },
            editDialog: false,
            dialogData: {
                id: null,
                title: null,
                content: null,
            },
        };
    },
    mounted() {
        this.loading = false;
    },
    methods: {
        next() {
            this.$router.push({ query: { page: this.page } });
        },
        close() {
            this.createDialog = false;
            this.editDialog = false;
        },
        openEditDialog(index) {
            this.editDialog = true;
            this.dialogData = this.announcement[index];
        },
        deleteAnnounce(id) {
            let $vm = this;
            $vm.$axios
                .post("/announce/delete/" + id, {})
                .then(function (response) {
                    window.location.reload();
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
    height: calc(100% - 44px);
}
.v-pagination {
    position: absolute;
    bottom: 10px;
    right: 0px;
}
</style>
