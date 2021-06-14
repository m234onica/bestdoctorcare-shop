<template>
    <v-simple-table fixed-header height="300px">
        <template v-slot:default>
            <thead>
                <tr>
                    <th class="text-left">標題</th>
                    <th class="text-left">發布時間</th>
                    <th class="text-left">動作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in desserts" :key="item.name">
                    <td>{{ item.name }}</td>
                    <td>{{ item.createdAt }}</td>
                    <td>
                        <v-btn color="primary">編輯</v-btn>
                        <v-btn color="error">刪除</v-btn>
                    </td>
                </tr>
            </tbody>
        </template>
    </v-simple-table>
</template>

<script>
export default {
    data() {
        return {
            desserts: [
                {
                    name: "測試",
                    createdAt: "測試測試",
                },
            ],
        };
    },
};
</script>
