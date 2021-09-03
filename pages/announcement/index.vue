<template>
    <v-container id="announcement">
        <template>
            <v-row class="mt-3">
                <v-col :cols="10">
                    <h1 fixed>公告管理</h1>
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
                            <v-btn color="red darken-2" class="white--text" @click.stop="openDeleteDialog(index)">刪除</v-btn>
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
        <edit :item="dialogData" :editDialog="editDialog" @close="close"></edit>
        <v-dialog v-model="deleteDialog" max-width="290">
            <v-card>
                <v-card-title> 是否要刪除公告？ </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="fs-14" color="grey lighten-2" @click="deleteDialog = false"> 取消 </v-btn>
                    <v-btn
                        class="fs-14 white--text"
                        color="red"
                        @click="
                            deleteAnnounce(deleteId);
                            openUpdateDialog();
                        "
                    >
                        確定
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="updateDialog" max-width="290">
            <v-card>
                <v-card-title> 刪除公告完成！ </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="fs-14 white--text" color="primary" @click="closeUpdateDialog"> 確定 </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <div class="text-center">
            <v-pagination class="mt-4" relative v-model="page" :length="totalPages" @input="next" :total-visible="10"></v-pagination>
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
            deleteDialog: false,
            deleteId: null,

            updateDialog: false,
        };
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
        openDeleteDialog(index) {
            this.deleteDialog = true;
            this.deleteId = this.announcement[index].id;
        },
        openUpdateDialog() {
            this.deleteDialog = false;
            this.updateDialog = true;
        },
        closeUpdateDialog() {
            this.updateDialog = false;
            window.location.reload();
        },
        deleteAnnounce(id) {
            let $vm = this;
            $vm.$axios
                .post("/announce/delete/" + id, {})
                .then(function (response) {
                    $vm.openUpdateDialog();
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
