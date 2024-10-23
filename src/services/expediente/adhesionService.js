class adhesionUsuario {
  axios;
  baseUrl;

  constructor(axios, baseUrl) {
    this.axios = axios;
    //this.baseUrl = `${baseUrl}mem_expediente/expediente`;
    this.baseUrl = `${baseUrl}`;
  }

  getAdhesionUsuario(dpi) {
    let self = this;
    return self.axios.get(`${self.baseUrl}api_externo/adhesion/${dpi}`);
    //return self.axios.get(`${self.baseUrl}/adhesion/${dpi}`);
    
  }

  addAdhesionUsuario(body){
    let self = this;
    //const url = `${self.baseUrl}`
    //const url = `${self.baseUrl}/adhesion`
    return self.axios.post(`${self.baseUrl}api_externo/adhesion/crear`, body);
  }

  getRazonesSociales(){
    let self = this;
    //const url = `${self.baseUrl}`
    //const url = `${self.baseUrl}/adhesion`
    return self.axios.get(`${self.baseUrl}api_externo/adhesion/razones_sociales`);    
  }

    // TERMS DOCUMENT FOR ADHESION STEP IN REGISTRATION OF A NEW USER
    getLiabilityTermsDocument(body) {
      let self = this;
      const url = `${self.baseUrl}api_externo/adhesion/doc/terminos_responsabilidad `
      return self.axios.get(url.toString(), body);
    }

  
}

export default adhesionUsuario;
