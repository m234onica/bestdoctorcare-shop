<template>
    <v-container>
        <div id="notification">
            <h1 fixed>發送通知</h1>
            <v-row align="center" class="mt-8">
                <v-col class="d-flex" cols="12" sm="4">
                    <v-select v-model="customer" :items="customerItems" label="使用者" dense></v-select>
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
                    <v-select v-model="defaultCollection" :items="collectionsItems" label="商品種類" dense></v-select>
                </v-col>
            </v-row>
            <v-textarea outlined name="input-7-4" label="通知內容" value="" class="mb-0 pb-0" :messages="message"></v-textarea>
            <v-row>
                <v-spacer></v-spacer>
                <v-btn color="primary">送出</v-btn>
            </v-row>
        </div>
    </v-container>
</template>
<script>
import Collections from "../../graphQL/query/collections.gql";
export default {
    async asyncData({ app }) {
        const collections = await app.apolloProvider.defaultClient.query({
            query: Collections,
        });
        return {
            collections: collections.data.collections.edges,
        };
    },
    data: () => ({
        customer: "所有人",
        customerItems: ["所有人", "購買", "檢視"],
        defaultCollection: "全部",
        collectionsItems: ["全部"],
        dates: [],
        menu: false,
        msgCount: 0,
        totalMsgCount: 0,
        message: "",
    }),
    mounted() {
        this.collections.forEach((item) => {
            this.collectionsItems.push(item.node.handle);
        });
        this.message = "則數提醒：目前共 " + this.msgCount + " 則，發送給  人，共計送出 " + this.totalMsgCount + " 則";
    },
};
</script>
<style lang="scss">
.spacer {
    flex-grow: 0.989 !important;
}
</style>
