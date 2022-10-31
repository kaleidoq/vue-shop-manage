import Vue from 'vue'
import Vuex from 'vuex'

import users from './users.js'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        users
    }

})