class PasswordService{

    axios
    baseUrl

    constructor(axios, baseUrl) {
        this.axios = axios
        this.baseUrl = `${baseUrl}password`
    }

    update(data){
      let self = this
      return self.axios.put(`${self.baseUrl}/${data.id}`, data);
    }

}
export default PasswordService
