import Axios from 'axios'
import router from '../router'
import store from '../store/index'

export default {
    
    user: {
        authenticated: false,
        sidebar: true,
    },

    data_refresh_token: {
        grant_type: 'refresh_token',
        refresh_token: '',
        client_id: ''
    },

    getRefreshToken() {
        var token_data = $cookies.get('refresh_token')
        this.data_refresh_token.refresh_token = token_data
        this.data_refresh_token.client_id = store.state.client_id,
        this.data_refresh_token.client_secret = store.state.client_secret

        return this.data_refresh_token
    },

    saveToken(token) {
        store.dispatch('guardarToken', token)
    },

    login(context, creds, redirect) {
        context.loading = true;
        context.$store.state.services.authService
            .login(creds)
            .then(r => {
                // if(r && r.status === 401){
                //     context.$toastr.error("Usuario y/o contraseña incorrecto(s)")
                //     return
                // }else{

                   
                if (r.response !== undefined) {
                    context.$toastr.error(r.response.data.error, 'error')
                    context.loading = false;
                    return
                }
                r.data.user.url = atob(r.data.foto);
                $cookies.set('token_data', r.data.access_token)
                $cookies.set('refresh_token', r.data.refresh_token)
                // console.log(r.data.user);
                localStorage.setItem('userUnidadId',  r.data.user.unidad_id )
                // console.log("localStorage.getItem('userUnidadId')", localStorage.getItem('userUnidadId'));
                sessionStorage.setItem('userUnidadId', r.data.user.unidad_id)
                // console.log("sessionStorage.getItem('userUnidadId')", sessionStorage.getItem('userUnidadId'));
                store.dispatch("setUser", r.data)
                this.user.authenticated = true

                //guardamos el token authorization en el header
                Axios.defaults.headers.common.Authorization = `Bearer ${r.data.access_token}`

                context.$router.push(redirect) 
                // }

            })
            .catch(r => {
                console.log(r);
                console.log("verificando ");
                context.$toastr.error("Usuario y/o contraseña incorrecto(s)")
                context.loading = false;
                return;
            });
    },

    logout(context) {
        context.$store.state.services.authService
            .logout()
            .then(r => {
                this.noAcceso()
            })
            .catch(r => {});
    },

    checkAuth() {
        var token = localStorage.hasOwnProperty('token')

        if (token) {
            this.user.authenticated = true
            this.user.sidebar = true
            router.push('/panel')

            store.state.services.authService.get()
                .then(r => {
                    store.dispatch("setUser", r.data)
                    events.$emit("set_user_panel", r.data.user)
                }).catch(e => {

                })
        } else {
            this.user.authenticated = false
            this.noAcceso()
        }
    },

    noAcceso() {
        this.user.authenticated = false
        $cookies.remove('token_data')
        $cookies.remove('refresh_token')
        window.location.reload();

        this.user.authenticated = false
        this.user.sidebar = false
    },
}