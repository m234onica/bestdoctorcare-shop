/** @format */

export const state = () => ({
    user: {},
});

export const mutations = {
    //要更動state都必須透過此function
    //使用 store.commit("setUser", { name: user.name }); 呼叫
    setUser(state, user = {}) {
        state.user = user;
    },
};

export const actions = {
    //異步事件範例
    //使用 store.dispatch('increment') 呼叫
    getUser({ commit }, { req }) {
        setTimeout(() => {
            commit("user", " req.session.user");
        }, 1000);
    },
};

export const getters = {
    //資料過濾層範例
    // doneTodos: (state) => {
    //     return state.todos.filter((todo) => todo.done);
    // },
};
