import Vue from 'vue'
import Vuex from 'Vuex'
import services from './services'
import global from '../sharedjs/global'
import roles_expedientes from '../sharedjs/roles'

Vue.use(Vuex)

const state = {
        global,
        services,
        user: {},
        sistema: {},
        menu: [],
        permisos: [],
        roles: [],
        roles_expedientes,
        cuis: [],
        nits: [],
        expediente_seleccionado: {},
        //base url para desarrollo local
        // base_url: 'http://127.0.0.1:8001/serviciosMEM/public/',
        // base_url: 'http://172.22.1.34:8001/serviciosMEM/public/',
        // base_url: 'http://192.168.1.56:8008/',
        // base_url: 'http://172.22.1.8:8008/',

        client_id: 2,
        client_secret: 't6LqVNQoiMx7aYceb44vBupKptrzXLF9MJ5OGdOD'
    },

    mutations = {
        setUser(state, user_info) {
            state.user = user_info.user
        },

        setMenu(state, menu) {
            state.menu = []
            state.menu = menu
        },

        setPermisos(state, permisos) {
            state.permisos = []
            state.permisos = permisos
        },

        setSistema(state, sistema) {
            state.sistema = sistema
        },

        setRoles(state, roles) {
            state.roles = []
            state.roles = roles
        },

        setExpedienteSeleccionado(state, expediente) {
            state.expediente_seleccionado = expediente
        },

        resetExpedienteSeleccionado(state) {
            state.expediente_seleccionado = {}
        }

    },

    actions = {
        guardarToken(data_user) {
            Axios.defaults.headers.common.Authorization = `Bearer ${data_user.access_token}`
            $cookies.set('token_data', data_user.access_token)
            $cookies.set('refresh_token', data_user.refresh_token)
        },
        setUser({ commit }, user) {
            commit("setUser", user)
        },
        setMenu({ commit }, menu) {
            commit("setMenu", menu)
        },
        setPermisos({ commit }, permisos) {
            commit("setPermisos", permisos)
        },
        setSistema({ commit }, sistema) {
            commit("setSistema", sistema)
        },
        setRoles({ commit }, roles) {
            commit("setRoles", roles)
        },

        setExpedienteSeleccionado({ commit }, expediente) {
            commit("setExpedienteSeleccionado", expediente)
        },
        resetExpedienteSeleccionado({ commit }) {
            commit("setExpedienteSeleccionado", {})
        }
    }

export default new Vuex.Store({
    state,
    mutations,
    actions
})
