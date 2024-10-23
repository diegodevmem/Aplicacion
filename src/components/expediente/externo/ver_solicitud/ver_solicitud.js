// import pdf from 'vue-pdf'
import VuePdfEmbed from "vue-pdf-embed/dist/vue2-pdf-embed";

export default {
  components: {
    // pdf,
    VuePdfEmbed
  },
  data() {
    return {
      empresaExterna: [],
      allAccepted: false,
      just_save: false,
      input_required: false,
      counter_requisitos: 0,
      counter_just_save: 0,
      representantesExternos: [],
      requisitosSubidos: [],
      showExterno: false,
      srcExterno: "",
      formExterno: {
        solicitud_id: null,
        numero_solicitud: null,
        numero_expediente: null,
        nombre_expediente: "",
        observacion: "",
        requisitos: [],
        expediente_id: null,
        tipo_tramite: {
          nombre: ""
        }
      },
      pendingRequirements: [],
      numero_expediente_exist: false,
      titulosExterna: [
        { value: "nombre", text: "Requisito", sortable: true },
        { value: "revision", text: "APROBAR/RECHAZAR" },
        { value: "razon_rechazo", text: "OBSERVACIÓN" },
        { value: "ver", text: "VER" }
      ],
      headersPendingDocs: [
        { value: "tipo_requisito", text: "Requisito", sortable: true },
      ],
      search: "",
      totalRows: "",
      currentPageExterna: 1,
      nombreDocumentoExterno: "",
      loading: false,
      create_loading: false,
      save_loading: false,
      validate_loading: false,
      existe_expediente: null,
      item: null,
      show: true,

      isLoading: true,
      page: 1,
      pageCount: 1,

      showAllPages: false,

      columnas_representantes: [
        { text: "DPI", value: "dpi" },
        { text: "Nombre", value: "razon_social" },
        { text: "Representacion", value: "representacion.descripcion" }
      ],

      IsExist: false,
      labelButton: "",
      loading_info_expediente: false
    };
  },

  async created() {
    let info = this.$route.params.datos_solicitud;
    let item = JSON.parse(atob(info));
    console.log("Data url");
    console.log(item);
    await this.buscarSolicitud(item);
    console.log(this.requisitosSubidos, "  requisitosSubidos");
    this.formExterno.solicitud_id = item.solicitud.id;
  },

  watch: {
    showAllPages() {
      this.page = this.showAllPages ? null : 1;
    },

    showExterno(val) {
      val || this.close();
    }
  },

  methods: {
    close() {
      console.log("Close");
      this.srcExterno = "";
      this.showExterno = false;
      this.nombreDocumentoExterno = "";
    },

    handleDocumentRender() {
      try {
        this.pageCount = this.$refs.pdfRef.pageCount;
      } catch (error) {
        console.log(error);
        this.pageCount = 1;
      }
    },

    async buscarSolicitud(item) {
      try {
        console.log("item");
        console.log(item);
        this.loading_info_expediente = true;
        let r = await this.$store.state.services.solicitudService.buscar(
          item.solicitud.id
        );
        console.log("que esta pasando");
        console.log(r);
        if (r.data.expediente_interno !== null &&  r.data.expediente_interno.numero_expediente     ) {
          this.numero_expediente_exist = true;
          this.numero_expediente = r.data.expediente_interno.numero_expediente;
        }
        this.docs_require_length = r.data.requisitos.length;
        console.log("docs_require_length " + this.docs_require_length);

        if (r.status === 200) {
          const userApplication = r.data; 
          userApplication.requisitos.filter(x => {
            // x.aceptado = null;
            x.razon_rechazo = "";
            x.loading = false;
          });

          if(userApplication.pendiente && userApplication.pendiente.length > 0){
            this.pendingRequirements = userApplication.pendiente
          }
          // numero_expediente brings the number of expediente if it exists
          // expediente_cerrado brings the id of expediente if it exists. It's not named correctly but what can I do.
          if((userApplication.numero_expediente !== null || userApplication.expediente_cerrado !== null)){
            this.labelButton = "Crear actuación" 
          }else{
            this.labelButton = "Crear expediente"
          }

          this.formExterno.numero_solicitud = item.solicitud.numero_solicitud;
          this.formExterno.tipo_tramite.nombre = item.tipo_tramite.nombre;
          // si existe el campo existe_expediente en la respuesta, y este campo es igual a false
          console.log("userApplication.existe_expediente", userApplication.existe_expediente );
          if (userApplication.existe_expediente == false) {
            this.existe_expediente = true;
            console.log(
              "EXISTE EXPEDIENTE, NO SE PUEDE HABILITAR EL BOTON DE GUARDAR"
            );
            this.formExterno.numero_expediente =
              userApplication.expediente.numero_expediente;
          }else if (userApplication.existe_expediente == true) {
            this.existe_expediente = false
          }
          console.log({
            respuesta: r,
            formExterno: this.formExterno
          });
          this.empresaExterna = userApplication.empresa;
          this.representantesExternos = userApplication.razon_social;
          this.requisitosSubidos = userApplication.requisitos;
          let requisitos = this.requisitosSubidos;
          let counter = 0;
          requisitos.forEach(element => {
            if (element.aceptado === null) {
              counter++;
            }
            if (counter === requisitos.length) {
              this.just_save = false;
            }
          });
          this.totalRows = this.requisitosSubidos.length;

          // if (r.data.actuacion.length != 0) {
          //   console.log("entro al length");
          //   this.formExterno.nombre_expediente =
          //     r.data.actuacion.nombre_expediente;
          //   this.formExterno.expediente_id = r.data.actuacion.expediente_id;
          //   this.IsExist = true;
          // } else {
          //   console.log("entro al else");
          //   this.IsExist = false;
          // }
          this.loading_info_expediente = false;
          console.log("loading_info_expediente");
          console.log(this.loading_info_expediente);
        } else {
          this.loading_info_expediente = false;
          this.$toastr.error(
            "HA OCURRIDO UN ERROR AL OBTENER LOS DATOS DE LA SOLICITUD",
            "ERROR"
          );
        }
      } catch (error) {
        this.loading_info_expediente = false;
        this.$toastr.error(
          "HA OCURRIDO UN ERROR AL OBTENER LOS DATOS DE LA SOLICITUD: " + error,
          "ERROR"
        );
        console.log(error)
      }
    },

    _base64ToArrayBuffer(base64) {
      console.log("llego");
      let binary_string = atob(base64.toString().split(",")[1]);
      console.log(binary_string);
      let len = binary_string.length;
      let bytes = new Uint8Array(len);
      console.log(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }

      return bytes.buffer;
    },

    async verDocumentoExterno(item) {
      try {
        this.nombreDocumentoExterno = item.nombre;
        item.loading = true;
        console.log(item);
        let r = await this.$store.state.services.solicitudService.documento(
          item.id
        );

        if (r.status === 200) {
          let pdfData = this._base64ToArrayBuffer(r.data);
          let file = new Blob([pdfData], { type: "application/pdf" });
          let fileUrl = URL.createObjectURL(file);
          this.srcExterno = fileUrl;
          this.showExterno = true;
          item.loading = false;
        } else {
          item.loading = false;

          this.$toastr.error(
            "HA OCURRIDO UN ERROR AL OBTENER EL DOCUMENTO DE LA SOLICITUD",
            "ERROR"
          );
        }
      } catch (error) {
        item.loading = false;

        this.$toastr.error(
          "HA OCURRIDO UN ERROR AL OBTENER EL DOCUMENTO DE LA SOLICITUD: " +
            error,
          "ERROR"
        );
      }
    },

    aprobar(item) {
      let documentos = this.requisitosSubidos;

      item.razon_rechazo = "";
      let aceptados = this.requisitosSubidos;
      console.log(this.requisitosSubidos)
      let sum_between_counters = 0;
      this.counter_requisitos = 0;
      aceptados.forEach(element => {
        if (element.aceptado == true) {
          this.counter_requisitos++;
        }
      });
      console.log("Soy documentos aceptados fuera del if");
      console.log(this.counter_requisitos);
      if (this.counter_requisitos === aceptados.length) {
        console.log("Soy documentos aceptados");
        console.log(this.counter_requisitos);
        this.allAccepted = true;
        this.input_required = true;
        this.just_save = false;
      } else {
        sum_between_counters = this.counter_requisitos + this.counter_just_save;

        if (sum_between_counters === aceptados.length) {
          console.log("Soy resultado de suma entre rechazados y aceptados");
          console.log(sum_between_counters);
          this.allAccepted = false; // This is holding whether or not button "create expediente" should appear.

          const allDifferentThanNull = documentos.every(
            x => x.aceptado !== null
          );
          console.log(allDifferentThanNull)

          if (allDifferentThanNull !== false) {
            this.just_save = true;
          }
        }
      }

      console.log("SOY DOCUMENTOS ACEPTADOS");
      console.log(aceptados);
    },

    denegar(item) {
      let documentos = this.requisitosSubidos;
      const reqLength = documentos.length;
      console.log("hola")
      let sum_between_counters = 0;
      this.counter_just_save = 0;
      documentos.forEach(element => {
        if (element.aceptado == false) {
          this.counter_just_save++;
          if (this.counter_requisitos === documentos.length) {
            this.counter_requisitos--;
          }
        }
      });
      sum_between_counters = this.counter_requisitos + this.counter_just_save;

      if (this.counter_requisitos < documentos.length) {
        this.allAccepted = false;
        // This counter if all have an state it's working
        const allDifferentThanNull = documentos.every(
          x => x.aceptado !== null
        );
        console.log(allDifferentThanNull)
        if (allDifferentThanNull !== false) {
          this.just_save = true;
        }else{
          // this.just_save = false;
        }
      }

      // item.razon_rechazo = "";
    },

    async procesarSolicitudExterna() {
      this.formExterno.requisitos = this.requisitosSubidos;
      let val = [];
      let data = this.formExterno.requisitos;
      data.forEach(element => {
        if (element.aceptado != null) {
          val.push(element);
        }
      });

      if (val.length == 0) {
        this.$toastr.error("Debe aprobar al menos un documento");
        return;
      }

      if (!this.$refs.form.validate()) {
        this.$toastr.error("Debecompletar los campos obligatorios");
        return;
      }

      try {
        this.loading = true;
        let r = await this.$store.state.services.solicitudService.procesarSolicitudExterna(
          this.formExterno
        );
        console.log("Insertar procesar solicitud");
        console.log(r.response);
        if (r.status === 200) {
          this.$toastr.success(r.data, "Atención");
          this.$router.push("/exp_solicitud_ext");
        } else if(r.response.data.error && r.response.data.error == "Correo de la razon social no esta confirmado."){
          console.log("Correo de la razon social no esta confirmado.")
          this.$toastr.warning(
            "El correo de la razon social no esta confirmado.",
            "La solicitud no se ha podido procesar"
          );
        } else {
          this.$toastr.error(
            "No es posible procesar esta solicitud",
            "Atención"
          );
        }
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.$toastr.error(
          "No ha sido posible procesar esta solicitud",
          "Error"
        );

        this.loading = false;
      }

      // api_externo/expediente/insertar
    },

    async agregarDocumentosSolicitudExterno() {
      this.formExterno.requisitos = this.requisitosSubidos;
      let val = [];
      let data = this.formExterno.requisitos;
      data.forEach(element => {
        if (element.aceptado != null) {
          val.push(element);
        }
      });

      if (val.length == 0) {
        this.$toastr.error("Debe aprobar al menos un documento");
        return;
      }

      if (!this.$refs.form.validate()) {
        this.$toastr.error("Debecompletar los campos obligatorios");
        return;
      }

      try {
        this.loading = true;
        let r = await this.$store.state.services.solicitudService.agregarDocumentosSolicitudExterno(
          this.formExterno
        );
        console.log("Insertar procesar solicitud");
        console.log(r);
        if (r.status === 200) {
          this.$toastr.success(r.data, "Atención");
          this.loading = false;
          this.$router.push("/exp_solicitud_ext");
        } else {
          this.$toastr.error(
            "No es posible procesar esta solicitud",
            "Atención"
          );
          this.loading = false;
        }
      } catch (error) {
        console.log(error);
        this.$toastr.error(
          "No es posible procesar esta solicitud",
          "Error Fatal"
        );
        this.loading = false;
      }
    }
  }
};
