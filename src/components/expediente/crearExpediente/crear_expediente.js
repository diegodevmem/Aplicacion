import FormError from "../../shared/FormError";
import pdf from "vue-pdf";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/es";
import {
  EnhancedCheck,
  EnhancedCheckGroup,
  EnhancedCheckRadio,
  EnhancedToggle
} from "vue-enhanced-check";

// import Index from "../../panel/Index.vue";

export const tramites_con_notificacion_electronica = [
  966,
  965,
  964,
  963,
  962,
  961,
  960,
  959,
  958,
  957,
  956,
  955
];

export default {
  name: "CrearExpedienteExp",
  components: {
    FormError,
    EnhancedCheck,
    EnhancedCheckGroup,
    EnhancedCheckRadio,
    EnhancedToggle,
    pdf,
    DatePicker
    // Index,
  },
  data() {
    return {
      loading: false,
      personas: [],
      tipos_tramites: [],
      tipos_razones: [],
      municipios: [],
      municipiosaux: [],
      municipiosTemp1: [],
      municipiosTemp2: [],
      municipiosTemp3: [],
      departamentos: [],
      tipo_requisitos: [],
      representaciones: [],
      numero: null,
      numero_representante: null,
      esconder: false,
      esconder_representante: false,
      completar_titulo: "",
      categoria: "",
      numero_expediente: null,
      tipo_tramite: "",
      tipo_requisito: null,
      requisitos: [],
      expedienteAntiguo: {
        num_antiguo: ""
      },
      bloquearFormulario: false,
      src: "",
      numPages: undefined,
      ver_tags: false,
      ver_tags_representante: false,

      translations: {
        countrySelectorLabel: "Código de país",
        countrySelectorError: "Elige un país",
        phoneNumberLabel: "Número de teléfono",
        example: "Ejemplo :"
      },
      tramite_notificacion_electronica: false,
      //formulario de campos
      expediente_id: 0,
      form: {
        tipo_rep: false,
        tipo_rep2: false,
        tipo_tramite_id: null,
        folio_inicial: 0,
        folio_correcion: "",
        fecha_ingreso: null,
        nombre_expediente: "",
        observacion: "",
        nit: null,
        razon_social: "",
        tipo_razon_social: "",
        patente: "",
        numero: null,
        codigo_area: null,
        pais: null,
        url: null,
        notificar_telefono: true,
        email: "",
        notificar_email: true,
        municipio_id: null,
        nombre: "",
        notificar_direccion: true,
        requisitos: [],
        representantes: [],
        direccion_comercial: "",
        departamento_comercial: "",
        mun_comercial: "",
        departamento_propietario: "",
        mun_propietario: "",
        direccion_propietario: "",
        departamento_notificacion: "",
        mun_notificacion: "",
        direccion_notificacion: "",
        num_antiguo: "",
        notificacion_electronica: false,
        empresa_id: null
      },

      representante: {
        dpi: null,
        razon_social: "",
        numero: null,
        codigo_area: null,
        pais: null,
        url: null,
        notificar_telefono: true,
        email: "",
        emailAlterno: "",
        notificar_email: true,
        municipio_id: null,
        nombre: "",
        notificar_direccion: true,
        representacion: [],
        notificacion_correo: false,
        direccion_notificacion: ""
      },
      isActive: false,
      numberOk: true,
      aprobarAntiguo: false,

      bloquearCeldasPredeterminadonits: false,
      bloquearCeldasPredeterminadocuis: false,
      externalCompanies: []
    };
  },
  async created() {
    await this.getExternalCompanies();
    let self = this;
    // self.completar_titulo = self.$route.params.pantalla;
    // self.categoria = self.$route.params.categoria;
    // self.expediente_id = atob(self.$route.params.expediente_id);
    // self.tipo_tramite = atob(self.$route.params.tipo_tramite);
    // self.numero_expediente =
    //   self.$route.params.expediente_id != self.$route.params.numero_expediente
    //     ? atob(self.$route.params.numero_expediente)
    //     : null;

    // console.log('process.env');
    // console.log(process.env);

    self.completar_titulo = "Expediente";
    self.numero_expediente = 0;
    self.tipo_tramite = 0;
    self.categoria = "matriz";
    self.expediente_id = 0;

    self.getPromise();
    this.getAllCompanies();
  },
  computed: {
    total_folios() {
      this.form.folio_inicial = 0;

      this.form.requisitos.forEach(element => {
        this.form.folio_inicial += element.cantidad_folio;
      });

      return this.form.folio_inicial;
    }
  },
  watch: {
    "form.razon_social"() {
      if (this.representante.representacion !== null) {
        if (this.representante.representacion.id === 1) {
          this.representante.razon_social = this.form.razon_social;
          this.form.tipo_rep2 = true;
        }
      }
    },

    "form.tipo_tramite_id"() {
      if (this.form.tipo_tramite_id.antiguo) {
        this.bloquearFormulario = true;
      } else {
        this.bloquearFormulario = false;
      }
    },

    "form.num_antiguo"() {
      this.bloquearFormulario = true;
    },
    representante() {
      console.log("this.representante");
      console.log(this.representante);
    }
  },
  methods: {
    async getAllCompanies() {
      const response = await this.$store.state.services.empresaService.getAll();
      console.log(response.data);
    },

    setRepresentante() {
      if (this.representante.representacion.id === 1) {
        this.representante.razon_social = this.form.razon_social;
        this.form.tipo_rep2 = true;
      } else {
        this.representante.razon_social = null;
        this.form.tipo_rep2 = false;
      }
    },

    async getNit() {
      let r = await this.$store.state.services.empresaService.get();
      try {
        this.$store.state.nits = r.data.data;
      } catch (error) {
        this.$toastr.error("Ocurrió un error: " + r, "Error");
        console.log(r);
      }
    },

    async getCui() {
      try {
        let r = await this.$store.state.services.razonsocialService.get();
        this.$store.state.cuis = r.data;
      } catch (error) {
        this.$toastr.error("Ocurrió un error: " + r, "Error");
        console.log(r);
      }
    },

    notAfterToday(date) {
      return date > new Date(new Date().setHours(0, 0, 0, 0));
    },

    validar_numero(e) {
      if (e.isValid) {
        this.form.numero = e.phoneNumber;
        this.form.codigo_area = e.countryCallingCode;
        this.form.pais = e.countryCode;
        this.form.url = e.uri;
        this.esconder = true;
        this.numberOk = false; //number ok indica que el numero es valido según la extesión seleccionada
        this.isActive = false; //desactiva el bloqueo del boton
      } else if (
        !e.isValid &&
        String(e.phoneNumber).startsWith(1) &&
        String(e.phoneNumber).length === 9
      ) {
        this.form.numero = e.phoneNumber;
        this.form.codigo_area = e.countryCallingCode;
        this.form.pais = e.countryCode;
        this.form.url = e.uri;
        this.esconder = true;
        this.numberOk = false; //number ok indica que el numero es valido según la extesión seleccionada
        this.isActive = false; //desactiva el bloqueo del boton
      } else {
        this.form.numero = e.phoneNumber;
        this.form.codigo_area = e.countryCallingCode;
        this.form.pais = e.countryCode;
        this.form.url = e.uri;
        this.esconder = false;
        this.isActive = true;
        this.numberOk = true; //activa el bloqueo del boton al exister errores en el numero
      }
    },

    validar_numero_representante(e) {
      //console.log(String(e.phoneNumber))
      if (e.isValid) {
        this.representante.numero = e.phoneNumber;
        this.representante.codigo_area = e.countryCallingCode;
        this.representante.pais = e.countryCode;
        this.representante.url = e.uri;
        this.esconder_representante = true;
        this.numberOk = false; //number ok indica que el numero es valido según la extesión seleccionada
        this.isActive = false; //desactiva el bloqueo del boton
      } else if (
        !e.isValid &&
        String(e.phoneNumber).startsWith(1) &&
        String(e.phoneNumber).length === 9
      ) {
        this.form.numero = e.phoneNumber;
        this.form.codigo_area = e.countryCallingCode;
        this.form.pais = e.countryCode;
        this.form.url = e.uri;
        this.esconder_representante = true;
        this.numberOk = false; //number ok indica que el numero es valido según la extesión seleccionada
        this.isActive = false; //desactiva el bloqueo del boton
      } else {
        this.representante.numero = e.phoneNumber;
        this.representante.codigo_area = e.countryCallingCode;
        this.representante.pais = e.countryCode;
        this.representante.url = e.uri;
        this.esconder_representante = false;
        this.isActive = true;
        this.numberOk = true; //activa el bloqueo del boton al exister errores en el numero
      }
    },

    async getPromise() {
      this.loading = true;
      Promise.all([
        await this.getTipoRazonSocial(),
        await this.getTipoTramite(),
        await this.getAllManual(), //departamentos , municipios
        await this.getTipoRequisito(),
        await this.getRepresentacion()
      ])
        .then(() => {
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$toastr.error("Ocurrió un error: " + error, "Error");
        });
    },

    async getTipoRazonSocial() {
      this.tipos_razones = [];
      this.tipos_razones.push({
        id: "PERSONA INDIVIDUAL",
        nombre: "PERSONA INDIVIDUAL"
      });
      this.tipos_razones.push({
        id: "PERSONA JURIDICA",
        nombre: "PERSONA JURIDICA"
      });
      this.tipos_razones.push({
        id: "COOPROPIETARIO",
        nombre: "COOPROPIETARIO"
      });
    },

    async getTipoTramite() {
      let self = this;
      self.tipos_tramites = [];
      self.$store.state.services.tipotramiteService
        .getAll()
        .then(r => {
          //   console.log(r);
          if (self.tipo_tramite != 0) {
            r.data.data.forEach(element => {
              if (
                element.categoria.nombre == self.categoria.toUpperCase() &&
                element.padre_id == self.tipo_tramite &&
                !element.deleted_at
              )
                self.tipos_tramites.push(element);
            });
          } else {
            r.data.data.forEach(element => {
              if (
                element.categoria.nombre == self.categoria.toUpperCase() &&
                !element.deleted_at
              )
                self.tipos_tramites.push(element);
            });
          }
        })
        .catch(r => {
          this.$toastr.error("Ocurrió un error: " + r, "Error");
        });
    },

    async getMunicipio() {
      let self = this;
      self.$store.state.services.municipioService
        .getAll()
        .then(r => {
          self.municipios = r.data;
          // console.log(self.municipios);
        })
        .catch(r => {
          this.$toastr.error("Ocurrió un error: " + r, "Error");
        });
    },

    async getTipoRequisito() {
      let self = this;
      self.tipo_requisitos = [];
      self.$store.state.services.tiporequisitoService
        .getAll()
        .then(r => {
          r.data.data.forEach(element => {
            if (!element.deleted_at) self.tipo_requisitos.push(element);
          });
        })
        .catch(r => {
          this.$toastr.error("Ocurrió un error: " + r, "Error");
        });
    },

    async getRepresentacion() {
      let self = this;
      self.representaciones = [];
      self.$store.state.services.representacionService
        .getAll()
        .then(r => {
          self.representaciones = r.data.data;
        })
        .catch(r => {
          this.$toastr.error("Ocurrió un error: " + r, "Error");
        });
    },

    buscar_requisitos(tramite) {
      if (tramite.tramite && tramite.padre_id) {
        // Validating if tramite is the value selected from the tramites dropdowns. Bad practice to use the same @input events for two elemnents. Quick solution required.
        if (tramites_con_notificacion_electronica.includes(tramite.id)) {
          this.tramite_notificacion_electronica = true;
          this.form.notificacion_electronica = true;
        } else {
          this.form.notificacion_electronica = false;
          this.tramite_notificacion_electronica = false;
        }
      }

      if (this.form.tipo_requisito_id !== undefined) {
        if (this.form.tipo_requisito_id.id === 2) {
          this.representante.representacion = this.representaciones[1];
          this.form.tipo_rep = true;
        } else {
          this.representante.representacion = null;
          this.form.tipo_rep = false;
        }
      }

      let self = this;
      self.form.requisitos = [];
      if (self.form.tipo_tramite_id && self.form.tipo_requisito_id) {
        self.loading = true;
        self.$store.state.services.tramiterequisitoService
          .getRequisito(
            self.form.tipo_requisito_id.id,
            self.form.tipo_tramite_id.id
          )
          .then(r => {
            self.requisitos = r.data.data;
            self.requisitos.forEach(x => {
              x.estado = "primary";
            });
            self.loading = false;
          })
          .catch(r => {});
      }
    },

    async getAllManual() {
      this.$store.state.services.notificacionesService
        .getAllManual()
        .then(r => {
          this.departamentos = r.data.departamento;
          this.municipiosaux = r.data.municipio;
          this.municipios = r.data.municipio;
        })
        .catch(r => {
          this.$toastr.error(r.message, "ERROR");
        });
    },

    limpiarDirecciones(tipo_direccion) {
      //1 comercial , 2 notificar
      if (tipo_direccion == 1) {
        this.form.direccion_comercial = "";
        this.form.mun_comercial = "";
        this.form.departamento_comercial = "";
        this.municipiosTemp3 = [];
      } else if (tipo_direccion == 2) {
        this.form.direccion_notificacion = "";
        this.form.mun_notificacion = "";
        this.form.departamento_notificacion = "";
        this.municipiosTemp2 = [];
      }
    },

    setDep(item, tipo_direccion) {
      // 1 propietario , 2 notificacion , 3 comercial

      // console.log("item set departamento");
      // console.log(item, tipo_direccion);
      // console.log("item");
      // console.log(item);
      item.departamento = item.nombre;
      item.departamento_id = item.id;

      if (tipo_direccion == 1) {
        this.form.mun_propietario = "";
        this.municipiosTemp1 = [];
        this.municipiosTemp1 = this.municipiosaux.filter(
          x => x.departamento_id === item.departamento_id
        );
        console.log(this.municipiosTemp);
      } else if (tipo_direccion == 2) {
        this.form.mun_notificacion = "";
        this.municipiosTemp2 = [];
        this.municipiosTemp2 = this.municipiosaux.filter(
          x => x.departamento_id === item.departamento_id
        );
        console.log(this.municipiosTemp);
      } else if (tipo_direccion == 3) {
        this.form.mun_comercial = "";
        this.municipiosTemp3 = [];
        this.municipiosTemp3 = this.municipiosaux.filter(
          x => x.departamento_id === item.departamento_id
        );
      }
    },

    setMun(item) {
      // console.log("item");
      // console.log(item);
      item.municipio = item.nombre;
      item.municipio_id = item.id;
      // this.municipiosTemp = this.municipios.filter(x => x.departamento_id === item.departamento_id);
      // console.log(this.municipiosTemp);
    },

    //funcion para guardar registro
    create_expediente() {
      let self = this;
      self.loading = true;
      console.log("self.form");
      console.log(self.form);
      self.$store.state.services.expedienteService
        .create(self.form)
        .then(r => {
          self.loading = false;

          if (r.response) return;

          this.$toastr.success(r.data, "Mensaje");

          self
            .$swal({
              title: "Mensaje",
              text: "¿Desea agregar otro expediente?",
              type: "success",
              showCancelButton: true
            })
            .then(result => {
              if (result.value) {
                self.clearData();
                this.getCui();
                this.getNit();
              } else {
                self.$router.push({ path: `/exp_mis_expedientes` });
              }
            });
        })
        .catch(r => {
          console.log(r);
        });
    },

    create_actuacion() {
      let self = this;
      self.loading = true;
      self.form.expediente_id = self.expediente_id;

      self.$store.state.services.actuacionService
        .create(self.form)
        .then(r => {
          self.loading = false;

          if (r.response) return;

          this.$toastr.success(r.data.data, "Mensaje");

          self
            .$swal({
              title: "Mensaje",
              text:
                "¿Desea agregar otra actuación al número de expediente " +
                self.numero_expediente +
                "?",
              type: "success",
              showCancelButton: true
            })
            .then(result => {
              if (result.value) {
                self.clearData();
              } else {
                let url =
                  "/exp_actuaciones/" +
                  btoa(r.data.tipo_tramite_id) +
                  "/" +
                  btoa(r.data.numero_expediente.toLowerCase()) +
                  "/" +
                  btoa(r.data.expediente_id);
                self.$router.push({ path: url });
              }
            });
        })
        .catch(r => {
          console.log(r);
        });
    },

    //limpiar data de formulario
    clearData() {
      let self = this;

      Object.keys(self.form).forEach(function(key, index) {
        if (typeof self.form[key] === "string") self.form[key] = "";
        else if (typeof self.form[key] === "object") self.form[key] = null;
        else if (typeof self.form[key] === "boolean") self.form[key] = false;
        else if (typeof self.form[key] === "number") self.form[key] = 0;
      });

      self.requisitos = [];
      self.tipo_requisito = null;
      self.numero = null;
      self.form.requisitos = [];
      self.form.representaciones = [];
      self.form.representantes = [];
      self.form.notificar_direccion = true;
      self.form.notificar_telefono = true;
      self.form.notificar_email = true;
      self.esconder = false;
      self.$refs.inputFile.value = null;
      self.$validator.reset();
      self.$validator.reset();
    },

    //limpiar data de formulario
    clearDataR() {
      let self = this;

      // Object.keys(self.representante).forEach(function (key, index) {
      //   if (typeof self.representante[key] === "string")
      //     self.representante[key] = "";
      //   else if (typeof self.representante[key] === "object")
      //     self.representante[key] = null;
      //   else if (typeof self.representante[key] === "boolean")
      //     self.representante[key] = false;
      //   else if (typeof self.representante[key] === "number")
      //     self.representante[key] = 0;
      // });

      // this.representante = {
      (this.representante.nit = null),
        (this.representanterazon_social = ""),
        (this.representante.numero = null),
        (this.representante.codigo_area = null),
        (this.representante.pais = null),
        (this.representante.url = null),
        (this.representante.notificar_telefono = true),
        (this.representante.email = ""),
        (this.representante.emailAlterno = ""),
        (this.representante.notificar_email = true),
        (this.representante.municipio_id = null),
        (this.representante.nombre = ""),
        (this.representante.notificar_direccion = true),
        (this.representante.notificacion_correo = false),
        (this.representante.direccion_notificacion = ""),
        // },

        (self.numero_representante = null);
      self.esconder_representante = false;
      // self.representante.notificar_direccion = true;
      // self.representante.notificar_telefono = true;
      // self.representante.notificar_email = true;

      self.$validator.reset();
      self.$validator.reset();
    },

    mensaje(text, id) {
      let self = this;
      self
        .$swal({
          title: "Mensaje",
          text: text,
          type: "success",
          showCancelButton: true
        })
        .then(result => {
          if (result.value) {
            self.loading = true;
            id ? self.create_actuacion() : self.create_expediente();
          }
        });
    },

    limpiarRepresentantes(item) {
      this.form.representantes = [];
      if (item.nombre) {
        if (this.form.tipo_razon_social.nombre == "PERSONA INDIVIDUAL") {
          this.ver_tags_representante = true;
        } else {
          this.ver_tags_representante = false;
        }
      } else {
        this.ver_tags_representante = false;
      }
    },

    //funcion, validar si se guarda o actualiza
    createOrEdit() {
      let self = this;
      if (this.form.notificacion_electronica && this.form.empresa_id == null) {
        this.$toastr.error("Debe seleccionar una empresa", "Mensaje");
        return;
      }

      this.form.nombre_expediente = this.form.nombre_expediente.toUpperCase();
      this.form.folio_correcion = parseInt(this.form.folio_correcion);
      self.$validator.validateAll().then(result => {
        if (result) {
          if (self.form.tipo_razon_social.nombre == "PERSONA INDIVIDUAL") {
            self.$validator.validateAll("representante").then(ver => {
              if (ver) {
                self.representante.representacion = {
                  id: 1,
                  nombre: "PROPIETARIO"
                };
                self.form.representantes.push(self.representante);
                self.expediente_id > 0
                  ? self.mensaje("¿Desea guardar actuación?", true)
                  : self.mensaje("¿Desea guardar expediente?", false);
              } else {
                this.$toastr.error("Verificar los datos", "Mensaje");
                return;
              }
            });
          } else {
            if (self.form.representantes.length == 0) {
              let mensaje =
                self.form.tipo_razon_social.nombre == "PERSONA JURIDICA"
                  ? "Verificar los datos del representante #1"
                  : "Verificar los datos de los coopropietarios";
              this.$toastr.error(mensaje, "Mensaje");
              return;
            } else {
              self.expediente_id > 0
                ? self.mensaje("¿Desea guardar actuación?", true)
                : self.mensaje("¿Desea guardar expediente?", false);
            }
          }
        } else {
          this.$toastr.error("Verificar los datos", "Mensaje");
          self.isActive = true;
        }
      });
    },

    async validarExpedienteantiguo() {
      // console.log(this.expedienteAntiguo);
      this.form.num_antiguo = this.form.num_antiguo.toString().replace(" ", "");

      try {
        let r = await this.$store.state.services.buscarExpedienteService.verificarExpedienteAntiguo(
          { num_antiguo: this.form.num_antiguo }
        );
        // console.log("respuesta");
        // console.log(r);
        if (r.data.length != 0) {
          this.$toastr.error("El número de expediente ya existe", "Mensaje");
          this.aprobarAntiguo = false;
          this.bloquearFormulario = true;
        } else {
          this.$toastr.success(
            "El número de expediente puede ser usado",
            "Mensaje"
          );
          this.aprobarAntiguo = true;
          this.bloquearFormulario = false;
        }
      } catch (error) {
        console.log(error);
        this.aprobarAntiguo = false;
      }
    },

    agregarRepresentante(scope) {
      console.log("scope");
      console.log(scope);
      console.log("this.representante");
      console.log(this.representante);
      let self = this;
      self.$validator.validateAll(scope).then(result => {
        console.log("result");
        console.log(result);
        // if (result) {
        let objeto = new Object();
        objeto.dpi = self.representante.dpi;
        objeto.razon_social = self.representante.razon_social;
        objeto.numero = self.representante.numero;
        objeto.codigo_area = self.representante.codigo_area;
        objeto.pais = self.representante.pais;
        objeto.url = self.representante.url;
        objeto.notificar_telefono = self.representante.notificar_telefono;
        objeto.email = self.representante.email;
        objeto.emailAlterno = self.representante.emailAlterno;
        objeto.municipio_id = self.representante.municipio_id;
        objeto.nombre = self.representante.nombre;
        objeto.notificar_direccion = self.representante.notificar_direccion;
        objeto.notificar_email = self.representante.notificar_email;
        objeto.notificacion_correo = self.representante.notificacion_correo;
        objeto.representacion = self.representante.representacion;

        // if (this.form.tipo_razon_social.nombre == "COOPROPIETARIO") {
        //   objeto.representacion = { id: 1, nombre: "PROPIETARIO" };
        // } else {
        //   objeto.representacion = self.representante.representacion;
        // }
        console.log("objeto");
        console.log(objeto);
        self.form.representantes.push(objeto);
        self.clearDataR();
        // } else {
        //   this.$toastr.error(
        //     "Verificar los datos del representante #2",
        //     "Mensaje"
        //   );
        // }
      });
    },

    quitarRepresentante(item) {
      this.form.representantes.splice(
        this.form.representantes.indexOf(item),
        1
      );
    },

    onFileChange(e, item) {
      this.form.requisitos.forEach(element => {
        if (element.tramite_requisito_id == item.id) {
          this.form.requisitos.splice(this.form.requisitos.indexOf(element), 1);
          return;
        }
      });
      let files = e.target.files || e.dataTransfer.files;
      item.megas = 100;
      if (parseFloat(files[0].size / 1048576) > item.megas) {
        item.estado = "danger";
      }
      if (!files.length) {
        return;
      } else {
        console.log("validar documento");
        this.validarDocumento(files[0], item);
      }
    },

    validarDocumento(file, item) {
      let self = this;
      self.loading = true;
      this.loadingtabla = true;
      let reader = new FileReader();
      let tamanio = file.size;
      let formato = item.formato.toLowerCase();
      let equivalente = parseFloat(tamanio / 1048576);
      console.log(equivalente, tamanio);
      let extension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      this.numPages = 0;
      let objeto = new Object();

      if (
        formato.substring(formato.lastIndexOf(".")) !== extension.toLowerCase()
      ) {
        self.$swal("El formato del documeto debe de ser " + formato);
        self.loading = false;
      } else {
        if (equivalente < parseInt(item.megas)) {
          reader.onload = e => {
            // this.src = pdf.createLoadingTask(e.target.result.split(",")[1].toString());
            console.log("todo ok 839");

            // console.log(e.target.result);
            // objeto.cantidad_folio = this.numPages;
            objeto.nombre = file.name;
            objeto.path = e.target.result;
            objeto.tramite_requisito_id = item.id;
            objeto.size = equivalente;
            objeto.requisito_id = item.requisito_id;
            objeto.formato_documento_id = item.formato_id;

            self.$swal({
              position: "top-end",
              type: "success",
              title: "Documento agregado correctamente",
              showConfirmButton: false,
              timer: 1500
            });
            self.loading = false;
            // });
          };
          reader.readAsDataURL(file);

          let reader2 = new FileReader();
          reader2.readAsBinaryString(file);
          reader2.onloadend = function() {
            let count = reader2.result.match(/\/Type[\s]*\/Page[^s]/g).length;
            this.numPages = count;
            objeto.cantidad_folio = count;
            item.folio = this.numPages;
            item.folio = count;
            self.form.requisitos.push(objeto);
            console.log("Number of Pages:", count);
          };
        } else {
          self.$swal({
            html:
              '<a href="https://www.ilovepdf.com/es/comprimir_pdf" target="_blank"><h1>Dar clic aquí</h1></a> ',
            title:
              "El tamaño del documento debe de tener menos de " +
              item.megas +
              " MB y el documento tiene " +
              parseFloat(equivalente / 1048576).toFixed(2) +
              " MB" +
              " " +
              "Le recomendamos usar la siguiente herramienta para comprimir sus archivos PDF"
          });
          self.loading = false;
          console.log(this.form.requisitos);
        }
      }
    },

    buscar_nit(input) {
      let self = this;
      self.form.nit = null;
      return new Promise(resolve => {
        if (input.length < 3) {
          self.ver_tags = false;
          return resolve([]);
        }

        let datos = [];
        this.$store.state.nits.filter(x => {
          if (x.nit.search(input) != -1) {
            datos.push(x);
          }
        });
        self.ver_tags = datos.length > 0 ? false : true;
        self.form.nit = datos.length > 0 ? null : input.toUpperCase();
        resolve(datos);
      });
    },

    async seleccionarNIT(result) {
      if (result) {
        console.log(result);
        this.bloquearCeldasPredeterminadonits =
          result.id === 122 || result.id === 553 ? true : false;

        this.form.nit = result.nit;
        this.form.patente = result.patente;
        this.form.razon_social = result.razon_social;
        this.tipos_razones.forEach(element => {
          if (element.id == result.tipo_razon_social) {
            this.form.tipo_razon_social = element;
          }
        });
        this.ver_tags = true;

        if (result.mun_comercial != null) {
          let mun_comercial = this.municipiosaux.filter(
            x => x.id === result.mun_comercial
          );
          console.log("mun_comercial");
          console.log(mun_comercial);
          let dep_comercial = this.departamentos.filter(
            x => x.id === parseInt(mun_comercial[0].departamento_id)
          );
          console.log("dep_comercial");
          console.log(dep_comercial);
          await this.setDep(dep_comercial[0], 3);
          await this.setMun(mun_comercial[0]);
          this.form.departamento_comercial = dep_comercial[0];
          this.form.mun_comercial = mun_comercial[0];
        }

        if (result.mun_propietario != null) {
          let mun_propietario = this.municipiosaux.filter(
            x => x.id === result.mun_propietario
          );

          let dep_propietario = this.departamentos.filter(
            x => x.id === parseInt(mun_propietario[0].departamento_id)
          );

          await this.setDep(dep_propietario[0], 1);
          await this.setMun(mun_propietario[0]);
          this.form.departamento_propietario = dep_propietario[0];
          this.form.mun_propietario = mun_propietario[0];
        }

        if (result.mun_notificacion != null) {
          let mun_notificacion = this.municipiosaux.filter(
            x => x.id === result.mun_notificacion
          );

          let dep_notificacion = this.departamentos.filter(
            x => x.id === parseInt(mun_notificacion[0].departamento_id)
          );

          await this.setDep(dep_notificacion[0], 2);
          await this.setMun(mun_notificacion[0]);
          this.form.departamento_notificacion = dep_notificacion[0];
          this.form.mun_notificacion = mun_notificacion[0];
        }

        this.form.direccion_comercial = result.direccion_comercial;
        this.form.direccion_notificacion = result.direccion_notificacion;
        this.form.direccion_propietario = result.direccion_propietario;
      } else {
        this.form.patente = null;
        this.form.razon_social = null;
        this.form.tipo_razon_social = null;

        this.form.email = null;
        this.form.numero_representante = null;
        this.ver_tags = true;

        this.form.direccion_comercial = null;
        this.form.direccion_notificacion = null;
        this.form.direccion_propietario = null;

        this.bloquearCeldasPredeterminadonits = false;

        this.form.departamento_notificacion = null;
        this.form.mun_notificacion = null;

        this.form.departamento_propietario = null;
        this.form.mun_propietario = null;

        this.form.departamento_comercial = null;
        this.form.mun_comercial = null;
      }
    },

    async buscar_empresa_nombre(input) {
      input = input.toLowerCase();
      // search result in this.externalCompanies
      // this.form.razon_social = null;
      return new Promise(resolve => {
        if (input.length < 3) {
          return resolve([]);
        }

        let datos = [];
        console.log(this.externalCompanies);
        this.externalCompanies.filter(company => {
          if (company.nameAndNit.search(input) != -1) {
            datos.push(company);
          }
        });
        // this.ver_tags_empresa = datos.length > 0 ? false : true;
        // this.form.razon_social = datos.length > 0 ? null : input.toUpperCase();
        resolve(datos);
      });
    },

    async getExternalCompanies() {
      try {
        const response = await this.$store.state.services.empresaService.getExternalCompanies();
        if (response && response.data) {
          console.log(response.data);
          this.externalCompanies = response.data.data;
          //add a new attribute to the object called nameAndNit and there merge the name and the nit
          this.externalCompanies.forEach(company => {
            company.nameAndNit = company.razon_social + " - " + company.nit;
            company.nameAndNit = company.nameAndNit.toLowerCase();
          });
        }
      } catch (error) {
        this.$toastr.error("Ocurrió un error: " + error, "Error");
        console.log(error);
      }
    },

    async seleccionarNombreEmpresa(result) {
      this.form.empresa_id = result.id;
      console.log("The selected company id is: ", result.id);
    },

    buscar_nit_representante(input) {
      let self = this;
      self.representante.dpi = null;
      return new Promise(resolve => {
        if (input.length < 3) {
          self.ver_tags_representante = this.form.tipo_razon_social
            ? this.form.tipo_razon_social.nombre == "PERSONA INDIVIDUAL"
              ? true
              : false
            : false;
          return resolve([]);
        }
        let datos = [];
        this.$store.state.cuis.filter(x => {
          if (x.dpi.search(input) != -1) {
            datos.push(x);
          }
        });
        // self.$store.state.services.razonsocialService.get(input).then((r) => {
        self.ver_tags_representante = datos.length > 0 ? false : true;
        if (this.ver_tags_representante) {
          this.getMunicipio();
        }
        self.representante.dpi = datos.length > 0 ? null : input.toUpperCase();
        resolve(datos);
      });
      // });
    },

    seleccionarCUI(result) {
      console.log(result);
      if (result) {
        this.bloquearCeldasPredeterminadocuis =
          result.id === 217 || result.id === 365 ? true : false;

        console.log("this.representante.representacion");
        console.log(this.representante.representacion);

        console.log("this.form.razon_social");
        console.log(this.form.razon_social);

        if (this.representante.representacion.id === 1) {
          this.representante.razon_social = this.form.razon_social;
          this.form.tipo_rep2 = true;
        } else {
          this.representante.razon_social = result.razon_social;
          this.form.tipo_rep2 = false;
        }

        this.representante.dpi = result.dpi;
        this.representante.numero = result.numero;
        this.numero_representante = result.numero;
        this.representante.notificacion_correo = result.notificacion_correo;
        this.representante.codigo_area = result.codigo_area;
        this.representante.pais = result.pais;
        this.representante.url = result.url;
        this.representante.email = result.email;
        // this.representante.representacion = { id: result.representacion_id, nombre: result.representacion };
        this.municipios.forEach(element => {
          if (element.id == result.municipio_id) {
            this.representante.municipio_id = element;
          }
        });
        this.representante.nombre = result.nombre;
        console.log("result.nombre");
        console.log(result.nombre);
        this.ver_tags_representante = true;
      } else {
        console.log("this.representante.representacion");
        console.log(this.representante.representacion);

        this.bloquearCeldasPredeterminadocuis = false;
        this.representante.email = null;
        this.representante.numero_representante = null;

        if (this.representante.representacion.id === 1) {
          this.representante.razon_social = this.form.razon_social;
          this.form.tipo_rep2 = true;
        } else {
          this.representante.razon_social = null;
          this.form.tipo_rep2 = false;
        }
        if (this.form.tipo_razon_social) {
          if (this.form.tipo_razon_social.nombre == "PERSONA INDIVIDUAL") {
            this.ver_tags_representante = true;
          } else {
            // this.representante.nit = null;
            // this.representante.razon_social = null;
            // this.representante.numero = null;
            // this.numero_representante = null;
            // this.representante.codigo_area = null;
            // this.representante.pais = null;
            // this.representante.url = null;
            // this.representante.notificar_telefono = true;
            // this.representante.email = null;
            // this.representante.notificar_email = true;
            // this.representante.municipio_id = null;
            // this.representante.nombre = null;
            // this.representante.notificar_direccion = true;
            this.ver_tags_representante = false;
          }
        } else {
          this.ver_tags_representante = false;
        }
      }
    },

    getResultValue(result) {
      return result.nit;
    },

    getResultValueR(result) {
      return result.dpi;
    },

    getResultValueEmpresa(result) {
      return result.nameAndNit;
    }
  }
  //   mounted() {
  //     $("body").resize();
  //   },
};
