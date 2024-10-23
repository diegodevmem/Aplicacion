class UserService {
    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}usuario`
    }

    getAll(){
        let self = this
        return self.axios.get(`${self.baseUrl}`);
    }

    get(dpi) {
      let self = this
      return self.axios.get(`${self.baseUrl}/${dpi}`);
    }

    getSystems(user_id) {
        let self = this
        return self.axios.get(`${self.baseUrl}/${user_id}/rol_sistema_menu`);
    }

    getRolSistemaUsuario(user_id, sistema_id){
        let self = this
        return self.axios.get(`${self.baseUrl}/${user_id}/rol_sistema_menu/${sistema_id}`);
    }

    getSistemaRol(user_id, sistema_id){
        let self = this
        return self.axios.get(`${self.baseUrl}/${user_id}/sistema_rol/${sistema_id}`);
    }

    create(model) {
        let self = this;
        return self.axios.post(`${self.baseUrl}`, model);
    }

    //Esta funcion representa un UPDATE
    update(data) {
      let self = this;
      return self.axios.put(`${self.baseUrl}/${data.id}`, data)
    }

    //Esta funcion representa DESTROY
    destroy(data) {
      let self = this
      return self.axios.delete(`${self.baseUrl}/${data.id}`)
    }

    createRolUsuario(user_id, model){
        let self = this
        return self.axios.post(`${self.baseUrl}/${user_id}/sistema_rol`,model);
    }

    changePassword(model) {
        let self = this;
        return self.axios.post(`${self.baseUrl}_change_password`, model);
    }

}

export default UserService
