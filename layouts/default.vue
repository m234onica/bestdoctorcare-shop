<template>
    <v-app light>
        <v-app-bar :clipped-left="clipped" fixed app flat>
            <v-toolbar-title v-text="title" />
        </v-app-bar>
        <v-row>
            <v-navigation-drawer permanent expand-on-hover fixed class="mt-16">
                <v-list nav dense>
                    <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
                        <v-list-item-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.title" />
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>
            <v-main class="mt-16">
                <v-container class="px-6">
                    <nuxt />
                </v-container>
            </v-main>
        </v-row>
    </v-app>
</template>

<script>
export default {
    data() {
        return {
            clipped: false,
            drawer: false,
            fixed: false,
            items: [
                {
                    icon: "mdi-apps",
                    title: "公告管理",
                    to: "/announcement",
                },
                {
                    icon: "mdi-chart-bubble",
                    title: "邀請碼管理",
                    to: "/discountCode",
                },
                {
                    icon: "mdi-bell",
                    title: "發送通知",
                    to: "/notification",
                },
            ],
            miniVariant: false,
            right: true,
            rightDrawer: false,
            title: "百漢中醫管理後台",
        };
    },
};
</script>
