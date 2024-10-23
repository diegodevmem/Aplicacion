class quejas {
    axios;
    baseUrl;
  
    constructor(axios, baseUrl) {
      this.axios = axios;
      this.baseUrl = `${baseUrl}`;
    }
  
    getComplaintsByDate(body) {
        console.log(body)
        const url = `${this.baseUrl}api_externo/quejas/get_quejas/dates?fecha_inicio=${body.fecha_inicio}&fecha_fin=${body.fecha_fin}`;
        return this.axios.get(url.toString());
        //return this.axios.get(`${this.baseUrl}api_externo/quejas/get_quejas/dates`);
        //http://172.22.1.34:8001/serviciosMEM/public/api_externo/quejas/get_quejas/dates
        //http://127.0.0.1:8001/ApiExpedientes/public/api_expediente/queja/index
        // return this.axios.get(`${self.baseUrl}api_externo/adhesion/${dpi}`);
      //return self.axios.get(`${self.baseUrl}/adhesion/${dpi}`);
      
    }

    getAllComplaints(){
        const url = `${this.baseUrl}api_externo/quejas/get_quejas`;
        return this.axios.get(url.toString());
    }

    getRazonesSociales(){
        const url = `${this.baseUrl}api_externo/quejas/razones_sociales`;
        return this.axios.get(url.toString());
        //http://172.22.1.34:8001/serviciosMEM/public/api_externo/quejas/razones_sociales
    }
    
  }
  
  export default quejas;
  