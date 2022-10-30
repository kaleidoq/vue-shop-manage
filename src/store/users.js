export default {
    state: {
        tagList: [
            // {
            // name: '首页',
            // path: '/'
            // },
        ],

    },
    getters: {},
    mutations: {
        setTag(state, tag) {
            if (tag.name !== '首页') {
                // 判断在列表中存不存在
                let index = state.tagList.findIndex(
                        item => item.name === tag.name)
                    // 如果不存在
                if (index === -1) {
                    state.tagList.push(tag)
                    console.log('添加数据')
                }
            }
        },
        // 删除vuex中面包屑的数据
        removeTag(state, index) {
            console.log(index)
                // const result = state.tabList.findIndex(val => index.name === val.name)
            state.tagList.splice(index, 1)
        },

    },
    actions: {},
    modules: {}
}