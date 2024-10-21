import { createStore } from 'vuex'
import menu from './menu'
import craetePersistedstate from 'vuex-persistedstate'

export default createStore({
    plugins: [new craetePersistedstate({
        key:'pz_v3pz'
    })],
    modules: {
        menu
    }
})