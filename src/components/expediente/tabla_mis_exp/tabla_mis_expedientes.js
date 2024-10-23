import Documentos from "../../shared/Documentos.vue";
import FormError from "../../shared/FormError";
import NotfCedula from "../../notificaciones/notf_cedula.vue";
import NotificacionCedula from '../../notificaciones/notificacion_cedula.vue'
import pdf from "vue-pdf";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/es";
import moment from "moment";
import {
  EnhancedCheck,
  EnhancedCheckGroup,
  EnhancedCheckRadio,
  EnhancedToggle
} from "vue-enhanced-check";
export default {
  name: "tabla_mis_expedientes",
  props: [
    "actuacion",
    "fields",
    "opcion",
    "reasignacion",
    "cerrado",
    "congelados"
  ],
  components: {
    Documentos,
    NotfCedula,
    FormError,
    EnhancedCheck,
    EnhancedCheckGroup,
    EnhancedCheckRadio,
    EnhancedToggle,
    pdf,
    DatePicker,
    moment,
    NotificacionCedula
  },
  data() {
    return {
      direcciones: [],
      loadingtabla: true,
      rep: null,
      editData: false,
      departamentos: [],
      municipios: [],
      municipiosTemp: [],

      municipiosTemp1: [],
      municipiosTemp2: [],
      municipiosTemp3: [],

      // Parametros por ruta
      titleCrearNotif: "",
      expediente_id: 0,
      numero_expediente: "",
      tipo_tramite: null,
      loading: true,
      items: [],
      documentos: [],
      search: "",

      numero_representante: null,
      esconder_representante: false,
      barcode: "",

      // Modal paso
      abrirModal: "modal fade",
      styleObject: {},
      modal: false,

      // Modal Cedula Notificacion
      abrirModalCedulaNotf: "modal fade",
      styleObjectCedulaNotf: {},
      modalCedulaNotf: false,
      item: null,

      tiposDocumento: [
        { id: 1, nombre: "RESOLUCIÓN" },
        { id: 2, nombre: "PROVIDENCIA" },
        { id: 3, nombre: "ACUERDO" },
        { id: 4, nombre: "OFICIO" }
      ],

      cedula: {
        tipoDocumento: null,
        item: null,
        fecha_ingreso: null,
        fecha_documento: null,
        numero_documento: null,
        representante: null,
        direccion: null,
        razon: null
      },

      // Modal paso reasignacion
      abrirModalReasignacion: "modal fade",
      styleObjectReasignacion: {},
      modalReasignacion: false,
      usuariosReasignar: [],

      formReasignacion: {
        usuario: null,
        row: null,
        razon: " "
      },

      expediente: null,

      // Modal Descongelar
      abrirModalDescongelar: "modal fade",
      styleObjectDescongelar: {},
      modalDescongelar: false,

      datosDescongelar: null,
      razon_congelar: "",
      tipo_congelacion: "",

      // Modal razon Congelar
      abrirModalCongelar: "modal fade",
      styleObjectCongelar: {},
      modalCongelar: false,

      tipoCongelaciones: [],
      razonCongelaciones: [],
      congelacion: {
        tipo: null,
        razon: "",
        agregar: false,
        codigo_barra: null
      },

      // Modal Documento
      abrirModalDocumento: "modal fade",
      styleObjectDocumento: {},
      modalDocumento: false,

      documento_seleccionado: null,

      // Modal Editar
      abrirModalEditar: "modal fade",
      styleObjectEditar: {},
      modalEditar: false,

      // Modal Requisitos
      abrirModalRequisitos: "modal fade",
      styleObjectRequisitos: {},
      modalRequisitos: false,

      completo: false,

      requisitos: [],
      pendiente: [],
      cargado: [],

      filter: null,
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      pageOptions: [5, 10, 25, 100],
      showStringEmpty: "no hay registros que mostrar",
      numPages: undefined,

      actuacion_selected: null,
      municipios: [],
      representaciones: [],

      form: {
        id: 0,
        principal: false,
        fecha_ingreso: null,
        nombre_expediente: "",
        observacion: "",
        nit: null,
        direccion_notificacion: "",
        departamento_notificacion: "",
        mun_notificacion: "",
        direccion_comercial: "",
        departamento_comercial: "",
        mun_comercial: "",
        direccion_propietario: "",
        departamento_propietario: "",
        mun_propietario: "",
        razon_social: "",
        patente: "",
        representantes: [],
        tipo_razon_social: "",
        actuacion_id: null
      },

      defaultform: {
        id: 0,
        principal: false,
        fecha_ingreso: null,
        nombre_expediente: "",
        observacion: "",
        nit: null,
        direccion_notificacion: "",
        departamento_notificacion: "",
        mun_notificacion: "",
        direccion_comercial: "",
        departamento_comercial: "",
        mun_comercial: "",
        direccion_propietario: "",
        departamento_propietario: "",
        mun_propietario: "",
        razon_social: "",
        patente: "",
        representantes: [],
        tipo_razon_social: ""
      },

      forms: {
        folio_correcion: "",
        barcode: "",
        expediente: null,
        requisitos: [],
        folio_inicial: 0
      },

      ver_tags_representante: false,

      representante: {
        nit: null,
        razon_social: "",
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
        representacion: [],
        completo: ""
      },

      translations: {
        countrySelectorLabel: "Código de país",
        countrySelectorError: "Elige un país",
        phoneNumberLabel: "Número de teléfono",
        example: "Ejemplo :"
      },

      botones_siguiente: [],
      botones_atras: [],

      cerrados: [],

      show: false,
      src: "",

      nits: [],
      cuis: [],

      bloquearCamposnit: false,
      bloquearCamposcui: false,

      tipos_razones: [
        "PERSONA INDIVIDUAL",
        "PERSONA JURIDICA",
        "COOPROPIETARIO"
      ],

      indexx: null,

      // Modal paso reasignacion
      abrirModalExterna: "modal fade",
      styleObjectExterna: {},
      modalExterna: false,
      titleExterna: "",
      requisitos: [],
      requisitosSubidos: [],
      empresaExterna: null,
      representantesExternos: null,

      titulosExterna: [
        { key: "requisito.nombre", label: "Requisito", sortable: true },
        { key: "aprobar", label: "APROBAR" },
        { key: "denegar", label: "DENEGAR" },
        { key: "observacion", label: "OBSERVACIÓN" },
        { key: "ver", label: "VER" }
      ],

      currentPageExterna: 1,
      perPageExterna: 5,
      totalRowsExterna: 0,
      pageOptionsExterna: [5, 10, 25, 100],

      showExterno: false,
      srcExterno: null,
      empresa: null,
      nombreDocumento: "",
      nombreDocumentoExterno: "",
      noEditarRepresentantes: false,
      noEditarNit: false,

      formExterno: {
        solicitud_id: null,
        nombre_expediente: "",
        observacion: "",
        requisitos: []
      },
      userFromLawManagement: false,
      
    };
  },
  async created() {
    let self = this;
    this.loadingtabla = true;

    if (this.opcion === 7) {
      await this.solicitudExterna();
    } else {
      if (this.congelados) {
        // console.log("congelados");
        await this.getAllCongelados();
      } else if (this.actuacion) {
        await this.getAllCerrados();
      } else if (
        self.actuacion === false &&
        (this.reasignacion === false ||
          this.reasignacion === null ||
          this.reasignacion === undefined)
      ) {
        self.getAll();
      } else if (this.reasignacion === true) {
        await this.getAllManual();
        await this.getInfoExp();
      }
      // this.getMunicipio();
    }
    this.verifyUserUnit();
    this.loading = false;
  },
  computed: {
    total_folios() {
      this.forms.requisitos.forEach(element => {
        this.forms.folio_inicial += element.cantidad_folio;
      });
      return this.forms.folio_inicial;
    },
    title() {
      let message = "";
      message = this.actuacion_selected
        ? "Opciones de la Actuación " + this.actuacion_selected.codigo_barra
        : "";
      return message;
    },
    titleDocumento() {
      let message = "";
      message = this.actuacion_selected
        ? "Documentos de la Actuación " + this.actuacion_selected.codigo_barra
        : "";
      return message;
    },
    limitar() {
      return this.$store.state.roles.some(
        item => item.rol.nombre.toLowerCase() === "administrador"
      );
    },
    titleEditar() {
      let message = "";
      message = this.actuacion_selected
        ? "Información disponible para actualizar en la actuación " +
          this.actuacion_selected.codigo_barra
        : "";
      return message;
    }
  },
  methods: {
    // async showCreateProvidenceButton(expediente){
    //     const userFromLawManagement = await this.verifyUserUnit();
    //     const electronicNotification = expediente.notificacion_electronica ? expediente.notificacion_electronica : false;

    //     console.log(userFromLawManagement && electronicNotification)
    //     return (userFromLawManagement && electronicNotification);
    // },

    async createProvidenceButton(expediente_seleccionado) {
      try {
        console.log("expediente_seleccionado");

        console.log(expediente_seleccionado);
        this.$store.dispatch('setExpedienteSeleccionado', expediente_seleccionado)
        this.$router.push("/exp_providencia/");
      }catch
        (error) {
          console.log(error);
        this.$toastr.error(
          "A ocurrido un error al intentar crearla providencia"
        );
      }
    },


    async verifyUserUnit() {
      const userUnidadId = sessionStorage.getItem("userUnidadId");
      const GestionLegalUnidadesId = [68, 25, 38, 42];
      this.userFromLawManagement = GestionLegalUnidadesId.includes(
        parseInt(userUnidadId)
      );
      // return this.userFromLawManagement;
      // const userFromLawManagement = GestionLegalUnidadesId.includes(
      //   parseInt(userUnidadId)
      // );
      // return userFromLawManagement;

    },



    onPerPageChanged(perPage) {
      console.log("perpage");
      console.log(perPage);
      this.perPage = perPage;
    },

    agregarRazonSocial() {
      this.form.representantes.push({
        razon_social_id: null,
        dpi: null,
        razon_social: null,
        empresa: null,
        email: null,
        email_alternativo: null,
        notificacion_correo: false,
        fecha_aceptacion: null,
        representacion_id: null,
        representacion: null,
        numero: null,
        direccion_propietario: null,
        mun_propietario: null,
        direccion_notificacion: null,
        mun_notificacion: null,
        direccion_comercial: null,
        mun_comercial: null,
        rep: null,
        dep: null,
        mun: null,
        editar: true,
        quitar: true
      });
    },

    async eliminarRep(x) {
      this.$swal({
        title: "Advertencia",
        text: "El representante se eliminara en este momento. Desea continuar?",
        type: "warning",
        showCancelButton: true
      }).then(result => {
        if (result.value) {
          this.loading = true;
          this.eliminaRepresentante(x);
          this.loading = false;
        }
      });
    },

    async eliminaRepresentante(x) {
      try {
        let r = await this.$store.state.services.razonSocialNewService.eliminarRepresentante(
          this.form.actuacion_id,
          x.dpi
        );
        console.log("r.data ELIMINAR REP");
        console.log(r);
        if (r.status === 200) {
          this.form.representantes = this.form.representantes.filter(
            y => y != x
          );
          this.$toastr.success(
            "El representante se ha eliminado exitosamente",
            "EXITO"
          );
        } else {
          this.$toastr.error(
            "HA OCURRIDO UN ERROR AL INTENTAR ELIMINAR EL REPRESENTANTE",
            "ERROR"
          );
        }
      } catch (error) {
        this.$toastr.error(
          "HA OCURRIDO UN ERROR AL INTENTAR ELIMINAR EL REPRESENTANTE: " +
            error,
          "ERROR"
        );
      }
    },

    editarDatosRepresentantes(x) {
      x.editar = true;

      console.log("x");
      console.log(x);
      let depart = this.departamentos.filter(y => y.id == x.departamento_id);
      let munic = this.municipios.filter(y => y.id == x.municipio_id);
      x.dep = depart[0];
      x.mun = munic[0];
      let repre = this.representaciones.filter(
        y => y.id == x.representacion_id
      );
      x.rep = repre[0];
      console.log(this.form.representantes);
      let representantesaux = this.representantes;
      this.representantes = [];
      console.log(representantesaux);
      this.representantes = representantesaux;
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
      if (this.showExterno === true) {
        // this.showExterno = false;
      } else {
        try {
          let r = await this.$store.state.services.solicitudService.documento(
            17
          );
          console.log("r.data");
          console.log(r.data);
          if (r.status === 200) {
            this.nombreDocumentoExterno = item.requisito.nombre;
            this.srcExterno = r.data;
            this.showExterno = true;
            // this.$toastr.success("SE HA ACEPTADO LA NOTIFICACION VIA CORREO ELECTRONICO", "EXITO");
          } else {
            this.$toastr.error(
              "HA OCURRIDO UN ERROR AL OBTENER EL DOCUMENTO DE LA SOLICITUD",
              "ERROR"
            );
          }
        } catch (error) {
          this.$toastr.error(
            "HA OCURRIDO UN ERROR AL OBTENER EL DOCUMENTO DE LA SOLICITUD: " +
              error,
            "ERROR"
          );
        }
      }
    },

    aprobar(item) {
      item.aprobado = true;
      console.log("item");
      console.log(item);
    },

    denegar(item) {
      item.aprobado = false;
      console.log("item");
      console.log(item);
    },

    cancel_showExterna() {
      this.srcExterno = null;
      this.showExterno = false;
      this.styleObjectExterna.display = "";
      this.abrirModalExterna = "modal fade";
      this.modalExterna = false;
    },

    async buscarSolicitud(item) {
      try {
        console.log("item");
        console.log(item);
        let r = await this.$store.state.services.solicitudService.buscar(
          item.solicitud.id
        );
        if (r.status === 200) {
          console.log("r.data");
          console.log(r.data);
          this.empresaExterna = r.data.empresa;
          this.representantesExternos = r.data.razon_social;
          this.requisitosSubidos = r.data.requisitos;
          r.data.requisitos.filter(x => {
            x.aprobado = null;
            x.observacion = null;
          });
          this.totalRowsExterna = r.data.requisitos.length;
        } else {
          this.$toastr.error(
            "HA OCURRIDO UN ERROR AL OBTENER LOS DATOS DE LA SOLICITUD",
            "ERROR"
          );
        }
      } catch (error) {
        this.$toastr.error(
          "HA OCURRIDO UN ERROR AL OBTENER LOS DATOS DE LA SOLICITUD: " + error,
          "ERROR"
        );
        console.log(r);
      }
    },

    async verSolicitudesExternas(item) {
      await this.buscarSolicitud(item);
      this.titleExterna =
        "Datos de la solitictud " + item.solicitud.numero_solicitud;
      this.styleObjectExterna.display = "block";
      this.abrirModalExterna = "modal fade in";
      this.modalExterna = true;
    },

    getIndex(indexx) {
      console.log(indexx);
      this.indexx = indexx;
      console.log("indexx");
    },

    getResultValueR(result) {
      return result.nit;
    },

    seleccionarNITRR(result) {
      console.log("result");
      console.log(result);
      if (result) {
        // console.log(this.form.representantes[this.indexx]);
        this.form.representantes[this.indexx].razon_social_id = result.id;
        this.form.representantes[this.indexx].dpi = result.dpi;
        this.form.representantes[this.indexx].razon_social =
          result.razon_social;
        this.form.representantes[this.indexx].numero = result.numero;
        this.form.representantes[this.indexx].email = result.email;
        this.form.representantes[this.indexx].email_alterno =
          result.email_alterno;
        this.form.representantes[this.indexx].direccion = result.nombre;
        if (this.form.tipo_razon_social != "PERSONA JURIDICA") {
          //Debería validarse con el id pero solamente retorna el nombre
          this.form.representantes[this.indexx].representacion_id =
            result.representacion_id;
          this.form.representantes[this.indexx].representacion =
            result.representacion;
          this.form.representantes[this.indexx].rep = {
            id: result.representacion_id,
            nombre: result.representacion
          };
        } else {
          this.form.representantes[this.indexx].representacion_id = 2;
          this.form.representantes[this.indexx].representacion =
            "REPRESENTANTE LEGAL";
          this.form.representantes[this.indexx].rep = {
            id: 2,
            nombre: "REPRESENTANTE LEGAL"
          };
        }
      } else {
        this.form.representantes[this.indexx].razon_social_id = null;
        this.form.representantes[this.indexx].razon_social = null;
        this.form.representantes[this.indexx].numero = null;
        this.form.representantes[this.indexx].email = null;
        this.form.representantes[this.indexx].email_alterno = null;
        this.form.representantes[this.indexx].direccion = null;
        this.form.representantes[this.indexx].representacion_id = null;
        this.form.representantes[this.indexx].representacion = null;
      }
    },

    buscar_nit_representante(input) {
      // this.representante.nit = null;
      return new Promise(resolve => {
        if (input.length < 3) {
          // self.ver_tags = false;
          return resolve([]);
        }
        let datos = [];
        this.$store.state.cuis.filter(x => {
          if (x.dpi.search(input) != -1) {
            datos.push(x);
          } else {
            this.form.representantes[this.indexx].dpi = input;
            this.form.representantes[this.indexx].razon_social = null;
            this.form.representantes[this.indexx].numero = null;
            this.form.representantes[this.indexx].email = null;
            this.form.representantes[this.indexx].email_alterno = null;
            this.form.representantes[this.indexx].direccion = null;
          }
        });
        // self.ver_tags_representante = datos.length > 0 ? false : true;
        // if (this.ver_tags_representante){
        //   this.getMunicipio();
        // }
        this.representante.nit = datos.length > 0 ? null : input.toUpperCase();
        resolve(datos);
      });
    },

    getResultValue(result) {
      return result.nit;
    },

    async seleccionarNIT(result) {
      if (result) {
        console.log("result NIT");
        console.log(result);

        if (result.id === 122 || result.id === 553) {
          this.bloquearCamposnit = true;
        } else {
          this.bloquearCamposnit = false;
        }
        this.form.nit = result.nit;
        this.form.patente = result.patente;
        this.form.razon_social = result.razon_social;
        this.form.tipo_razon_social = result.tipo_razon_social;

        if (result.mun_comercial != null) {
          let mun_comercial = this.municipios.filter(
            x => x.id === result.mun_comercial
          );

          let dep_comercial = this.departamentos.filter(
            x => x.id === mun_comercial[0].departamento_id
          );
          await this.setDepaux(dep_comercial[0], 3);
          await this.setMunaux(mun_comercial[0]);
          this.form.departamento_comercial = dep_comercial[0];
          this.form.mun_comercial = mun_comercial[0];
        }

        if (result.mun_propietario != null) {
          let mun_propietario = this.municipios.filter(
            x => x.id === result.mun_propietario
          );

          let dep_propietario = this.departamentos.filter(
            x => x.id === mun_propietario[0].departamento_id
          );

          await this.setDepaux(dep_propietario[0], 1);
          await this.setMunaux(mun_propietario[0]);
          this.form.departamento_propietario = dep_propietario[0];
          this.form.mun_propietario = mun_propietario[0];
        }

        if (result.mun_notificacion != null) {
          let mun_notificacion = this.municipios.filter(
            x => x.id === result.mun_notificacion
          );

          let dep_notificacion = this.departamentos.filter(
            x => x.id === mun_notificacion[0].departamento_id
          );

          await this.setDepaux(dep_notificacion[0], 2);
          await this.setMunaux(mun_notificacion[0]);
          this.form.departamento_notificacion = dep_notificacion[0];
          this.form.mun_notificacion = mun_notificacion[0];
        }

        this.form.direccion_comercial = result.direccion_comercial;
        this.form.direccion_notificacion = result.direccion_notificacion;
        this.form.direccion_propietario = result.direccion_propietario;
      } else {
        this.bloquearCamposnit = false;
        this.form.nit = null;
        this.form.patente = null;
        this.form.razon_social = null;
        this.form.tipo_razon_social = null;
      }
    },

    buscar_nit(input) {
      // let self = this;
      // this.form.nit = null;
      return new Promise(resolve => {
        if (input.length < 3) {
          // self.ver_tags = false;
          return resolve([]);
        }

        let datos = [];
        this.$store.state.nits.filter(x => {
          if (x.nit.search(input) != -1) {
            datos.push(x);
          } else {
            this.form.nit = null;
            this.form.patente = null;
            this.form.razon_social = null;
            this.form.tipo_razon_social = null;
          }
        });
        // self.ver_tags = datos.length > 0 ? false : true;
        this.form.nit = datos.length > 0 ? null : input.toUpperCase();
        resolve(datos);
      });
    },

    async solicitudExterna() {
      try {
        let r = await this.$store.state.services.solicitudService.getAll();
        if (r.status === 200) {
          this.items = r.data;
          this.totalRows = r.data.length;
          console.log("r.data SOLICITUD");
          console.log(r.data);
          this.$toastr.success("Solicitudes Obtenidas Exitosamente", "EXITO");
          this.loadingtabla = false;
        } else {
          this.$toastr.error(
            "A OCURRIDO UN ERROR AL INTENTAR OBTENER LAS SOLICITUDES",
            "ERROR"
          );
        }
      } catch (error) {
        this.$toastr.error(
          "A OCURRIDO UN ERROR AL INTENTAR OBTENER LAS SOLICITUDES: " + error,
          "ERROR"
        );
      }
    },

    setRepresentacion(item) {
      item.representacion = item.rep.nombre;
      item.representacion_id = item.rep.id;
      console.log("item");
      console.log(item);
    },

    setDepaux(item, tipo_direccion) {
      // 1 propietario , 2 notificacion , 3 comercial
      item.departamento = item.nombre;
      item.departamento_id = item.id;

      if (tipo_direccion == 1) {
        this.form.mun_propietario = "";
        this.municipiosTemp1 = [];
        this.municipiosTemp1 = this.municipios.filter(
          x => x.departamento_id === item.departamento_id
        );
        // console.log(this.municipiosTemp);
      } else if (tipo_direccion == 2) {
        this.form.mun_notificacion = "";
        this.municipiosTemp2 = [];
        this.municipiosTemp2 = this.municipios.filter(
          x => x.departamento_id === item.departamento_id
        );
        // console.log(this.municipiosTemp);
      } else if (tipo_direccion == 3) {
        this.form.mun_comercial = "";
        this.municipiosTemp3 = [];
        this.municipiosTemp3 = this.municipios.filter(
          x => x.departamento_id === item.departamento_id
        );
      }
    },

    async setMunaux(item) {
      item.municipio = item.nombre;
      item.municipio_id = item.id;
    },

    async setDep(item) {
      console.log("item");
      console.log(item);
      item.departamento = item.dep.nombre;
      item.departamento_id = item.dep.id;
      this.municipiosTemp = this.municipios.filter(
        x => x.departamento_id === item.departamento_id
      );
      console.log(this.municipiosTemp);
    },

    async setMun(item) {
      console.log("item");
      console.log(item);
      item.municipio = item.mun.nombre;
      item.municipio_id = item.mun.id;
      // this.municipiosTemp = this.municipios.filter(x => x.departamento_id === item.departamento_id);
      // console.log(this.municipiosTemp);
    },

    verFlujo(data) {
      console.log("ver flujo");
      console.log(data);
      let datasString = JSON.stringify(data);
      data = btoa(unescape(encodeURIComponent(datasString)));
      this.$router.push("/exp_actuacion_flujo/" + data);
    },

    redirectActuacion(data) {
      console.log("data");
      console.log(data);
      let datasString = JSON.stringify(data);
      console.log("datasString");
      console.log(datasString);
      let converted = this.toBinary(datasString);
      let encoded = btoa(converted);
      data = encoded;
      console.log("/exp_actuacion_movimiento/" + data);
      this.$router.push("/exp_actuacion_movimiento/" + data);
    },

    toBinary(string) {
      const codeUnits = new Uint16Array(string.length);
      for (let i = 0; i < codeUnits.length; i++) {
        codeUnits[i] = string.charCodeAt(i);
      }
      const charCodes = new Uint8Array(codeUnits.buffer);
      let result = "";
      for (let i = 0; i < charCodes.byteLength; i++) {
        result += String.fromCharCode(charCodes[i]);
      }
      return result;
    },

    carga(estado) {
      this.loading = estado;
    },

    guardado() {
      this.cancel_showCrearCedula();
      //this.$router.push("/notf_reg");
    },

    redirecDocs(item) {
      this.$router.push({ path: "/notf_docs" });
    },

    crearCedulaNotificacion(item) {
      this.loading = true;
      this.titleCrearNotif =
        "No. " +
        item.numero_expediente;
      // this.getRepresentantes(item.expediente_id);
      this.styleObjectCedulaNotf.display = "block";
      this.item = item;
      this.abrirModalCedulaNotf = "modal fade in";
      this.modalCedulaNotf = true;
       this.loading = false;
    },

    // getRepresentantes(expediente_id){
    //   this.$store.state.services.notificacionesService
    //     .getRepresentantes(expediente_id)
    //     .then((r) => {
    //       console.log("REPRESENTANTES");
    //       console.log(r.data);
    //     })
    //     .catch((r) => {
    //       this.$toastr.error(r.message, "ERROR");
    //     });
    // },

    cancel_showCrearCedula() {
      this.actuacion_selected = null;
      this.styleObjectCedulaNotf.display = "";
      this.abrirModalCedulaNotf = "modal fade";
      this.modalCedulaNotf = false;
    },

    async guardarReasignacion() {
      let self = this;
      self.loading = true;
      self.$store.state.services.reasignacionService
        .save(this.formReasignacion)
        .then(r => {
          // console.log(r);
          let mensaje =
            r.data === 1
              ? "Expediente Reasignado Exitosamente"
              : "A ocurrido un error al intentar reasignar el expediente";
          let opcion = r.data === 1 ? "ÉXITO" : "ERROR";
          r.data === 1
            ? this.$toastr.success(mensaje, opcion)
            : this.$toastr.error(mensaje, opcion);
          this.getInfoExp();
          this.cancel_showReasignacion();
          self.loading = false;
        })
        .catch(r => {
          this.$toastr.error(r.message, "ERROR");
        });
    },

    async getInfoExp() {
      // let self = this;

      try {
        let r = await this.$store.state.services.reasignacionService.getAll();
        console.log(r);
        this.items = r.data;
        this.items.forEach(x => {
          x.usuario = x.u_nombre + " " + x.u_apellido;
          // x.ubicacion = x.ubicacion+', '+x.municipio+', '+x.departamento+', GUATEMALA'
        });
        this.totalRows = this.items.length;
        this.loadingtabla = false;
      } catch (error) {
        this.$toastr.error(
          "A ocurrido un error al obtener el expediente congelado"
        );
      }
    },

    async getUsuariosReasignacion(actuacion_id) {
      try {
        let r = await this.$store.state.services.reasignacionService.getUsuarios(
          actuacion_id
        );
        this.direcciones = r.data.razon_social;
        this.usuariosReasignar = r.data.usuarios;
        let mun_notificacion = "";
        let dep_notificacion = "";

        if (this.direcciones[0].mun_notificacion != null) {
          mun_notificacion = this.municipios.filter(
            x => x.id === this.direcciones[0].mun_notificacion
          );
          dep_notificacion = this.departamentos.filter(
            x => x.id === mun_notificacion[0].departamento_id
          );
          console.log(mun_notificacion, dep_notificacion);
          this.direcciones[0].nombre_municipio = mun_notificacion[0].nombre;
          this.direcciones[0].nombre_departamento = dep_notificacion[0].nombre;
        }

        //  console.log("this.direcciones");
        //  console.log(this.direcciones);

        this.usuariosReasignar.forEach(x => {
          x.usuario = x.nombre + " " + x.apellido;
        });
        this.loading = false;
      } catch (error) {
        this.$toastr.error(
          "A ocurrido un error al obtener los datos del expediente"
        );
      }
    },

    openModalDescongelar(barcode) {
      let self = this;
      self.styleObjectDescongelar.display = "block";
      self.abrirModalDescongelar = "modal fade in";
      self.modalDescongelar = true;
      self.barcode = barcode;
      this.datosModalDescongelar(barcode);
    },

    datosModalDescongelar(barcode) {
      let self = this;
      self.$store.state.services.descongelacionNuevoService
        .descongelar(barcode)
        .then(r => {
          this.razon_congelar = r.data[0].razon;
          this.tipo_congelacion = r.data[0].tipo_congelacion;
        })
        .catch(r => {
          this.$toastr.error(
            "A ocurrido un error al obtener el expediente congelado"
          );
        });
    },

    descongelar(barcode) {
      let self = this;
      self.loading = true;
      let data = {
        barcode: null
      };
      data.barcode = barcode;
      self.$store.state.services.descongelacionNuevoService
        .update(data)
        .then(r => {
          let text =
            r.data === 1
              ? "Se a descongelado el expediente exitosamente"
              : "A ocurrido un error al intentar descongelar el expediente";
          self.loading = false;
          r.data === 1 ? this.$toastr.success(text) : this.$toastr.error(text);
          self.items = [];
          this.getAll();
          this.cancel_showDescongelar();
          self.loading = false;
        })
        .catch(r => {
          this.$toastr.error(
            "A ocurrido un error al obtener el expediente congelado"
          );
        });
    },

    cleanCongelacion() {
      this.congelacion.razon = "";
      this.congelacion.agregar = false;
      this.congelacion.tipo = null;
    },

    tipos() {
      let self = this;
      self.loading = true;
      self.$store.state.services.congelacionNuevoService
        .getAll()
        .then(r => {
          this.tipoCongelaciones = r.data[1];
          this.razonCongelaciones = r.data[0];
          self.loading = false;
        })
        .catch(r => {});
    },

    congelar(item) {
      this.barcode = item.codigo_barra;
      let self = this;
      self.loading = true;

      self.tipos();
      self.congelacion.codigo_barra = self.barcode;

      self.styleObjectCongelar.display = "block";
      self.abrirModalCongelar = "modal fade in";
      self.modalCongelar = true;
      self.loading = false;
    },

    async reasignar(item) {
      // this.barcode = item.codigo_barra
      let self = this;
      self.loading = true;
      this.styleObjectReasignacion.display = "block";
      this.abrirModalReasignacion = "modal fade in";
      console.log("item actuacion id");
      console.log(item.actuacion_id);
      await this.getUsuariosReasignacion(item.actuacion_id);
      this.modalReasignacion = true;
      this.loading = false;
      this.formReasignacion.row = item;
      console.log("item");
      console.log(item);
    },

    getPromise() {
      this.loading = true;
      Promise.all([
        this.getAll(),
        this.getMunicipio(),
        this.getRepresentacion()
      ])
        .then(() => {
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$toastr.error("Ocurrió un error: " + error, "Error");
        });
    },

    guardarCongelacion() {
      let self = this;
      self.loading = true;
      self.$store.state.services.congelacionNuevoService
        .create(self.congelacion)
        .then(r => {
          self.loading = false;
          let text =
            r.data === 1
              ? "Se a congelado el expediente exitosamente"
              : "A ocurrido un error al intentar congelar el expediente";
          // self.items = r.data;
          // self.totalRows = self.items.length;
          this.getAll();
          this.cancel_showCongelar();
          (self.congelacion.razon = ""), (self.congelacion.agregar = false);
          self.congelacion.tipo = null;
          r.data === 1 ? this.$toastr.success(text) : this.$toastr.error(text);
        })
        .catch(r => {
          this.$toastr.error("A ocurrido un error al obtener el expediente");
        });
    },

    async updateRequisitos() {
      let self = this;
      this.loadingtabla = true;
      console.log(this.forms.requisitos);
      if (this.forms.requisitos.length === 0) {
        this.$toastr.info("Aún no hay ningún documento a adjuntar");
        this.loadingtabla = false;
        return;
      }
      let formData = new FormData();
      try {
        const requisitos = [];
        let requisitos_contador = 0;
        let array_requisitos = [];
        this.forms.requisitos.forEach((document, i) => {
          console.log(document);
          let requisito = {};
          requisito.nombre = document.nombre;
          requisito.file = document.archivo_original;
          requisito.tramite_requisito_id = document.tramite_requisito_id;
          requisito.requisito_id = document.requisito_id;
          requisito.size = document.size;
          requisito.formato_documento_id = document.formato_documento_id;
          requisito.cantidad_folio = document.cantidad_folio;
          formData.append("requisito_" + i, document.archivo_original);
          requisitos.push(requisito);
          requisitos_contador++;
          array_requisitos.push(document.archivo_original)
        });
        formData.append("requisitos_contador", requisitos_contador);
        formData.append("requisitos", JSON.stringify(requisitos));
        formData.append("barcode", this.forms.barcode);
        formData.append("folio_inicial", this.forms.folio_inicial);
        formData.append("folio_correcion", this.forms.folio_correcion);
        formData.append("expediente",JSON.stringify(this.forms.expediente[0]))

        const response = await self.$store.state.services.requisitospendientesService.update(
          formData
        );

        if (response.status === 200) {
          this.clearReq();
          self.styleObjectRequisitos.display = "";
          self.abrirModalRequisitos = "modal fade";
          self.modalRequisitos = false;
          this.getAll();
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingtabla = false;
      }
    },

    base64ToBlob(base64) {
      const binary = atob(base64);
      const array = new Uint8Array(new ArrayBuffer(binary.length));

      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }

      return new Blob([array], { type: "application/octet-stream" });
    },

    clearReq() {
      this.forms.barcode = "";
      this.forms.expediente = null;
      // while (A.length > 0) {
      //   A.pop();
      // }
    },

    onFileChange(e, item) {
      this.forms.requisitos.forEach(element => {
        if (element.tramite_requisito_id == item.id) {
          this.forms.requisitos.splice(
            this.forms.requisitos.indexOf(element),
            1
          );
          return;
        }
      });
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      } else {
        this.folio_inicial = 0;
        // console.log('files[0]');
        // console.log(files[0]);
        this.validarDocumento(files[0], item);
      }
      this.loading = false;
    },

    validarDocumento(file, item) {
      let self = this;
      self.loading = true;
      let reader = new FileReader();
      let tamanio = file.size;
      // let formato = item.formato.toLowerCase();
      let equivalente = parseFloat(tamanio / 1024);
      console.log(equivalente, tamanio);
      let extension = file.name.substring(file.name.lastIndexOf("."));
      //.toLowerCase();
      this.numPages = 0;

      // if (
      //   formato.substring(formato.lastIndexOf(".")) !== extension.toLowerCase()
      // ) {
      //   self.$swal("El formato del documeto debe de ser " + formato);
      //   self.loading = false;
      // } else {
      // if (equivalente < parseInt(item.megas) * 1024) {
      reader.onload = e => {
        this.src = pdf.createLoadingTask(e.target.result);
        this.src.promise.then(pdf => {
          this.numPages = pdf.numPages;
          item.folio = this.numPages;
          let objeto = new Object();
          objeto.cantidad_folio = this.numPages;
          objeto.nombre = file.name;
          objeto.path = e.target.result;
          objeto.tramite_requisito_id = item.tramite_requisito_id;
          objeto.size = equivalente;
          // objeto.requisito_id = item.requisito_id;
          objeto.requisito_id = item.id;
          // objeto.formato = undefined;
          objeto.formato_documento_id = item.formato_documento_id;
          this.forms.folio_inicial = 0;
          self.forms.requisitos.push(objeto);

          self.$swal({
            position: "top-end",
            type: "success",
            title: "Documento agregado correctamente",
            showConfirmButton: false,
            timer: 1500
          });
          self.loading = false;
        });
      };

      reader.readAsDataURL(file);
      // } else {
      //   self.$swal(
      //     "El el tamaño del documento debe de tener menos de " +
      //       item.megas +
      //       " MB y el documento tiene " +
      //       equivalente +
      //       " MB"
      //   );
      //   self.loading = false;
      // }
      // }
    },

    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    async getAll() {
      try {
        let r = await this.$store.state.services.actuacionService.getAll();
        // console.log(r);
        this.items = r.data.data;
        this.totalRows = this.items.length;
        this.loadingtabla = false;
      } catch (error) {
        console.log(error);
        this.loadingtabla = false;
      }
    },

    async getAllCerrados() {
      this.loadingtabla = true;
      try {
        let r = await this.$store.state.services.actuacionService.getAllCerrados();
        // console.log(r);
        this.items = r.data;
        this.loadingtabla = false;
        this.totalRows = this.items.length;
      } catch (error) {
        console.log(error);
      }
    },

    async getAllCongelados() {
      this.loadingtabla = true;
      try {
        let r = await this.$store.state.services.actuacionService.getAllCongelados();
        // console.log(r);
        this.items = r.data.data;
        this.loadingtabla = false;
        this.totalRows = this.items.length;
      } catch (error) {
        console.log(error);
      }
    },

    //funcion para eliminar registro
    destroy(data) {
      let self = this;
      let title = !data.deleted_at ? "Desactivar" : "Activar";
      let type = !data.deleted_at ? "error" : "success";
      self
        .$swal({
          title: title,
          text: "¿Está seguro de realizar esta acción?",
          type: type,
          showCancelButton: true
        })
        .then(result => {
          if (result.value) {
            self.loading = true;
            self.$store.state.services.actuacionService
              .destroy(data)
              .then(r => {
                self.loading = false;

                if (r.response) return;

                this.$toastr.success(r.data, "Mensaje");
                self.getAll();
              })
              .catch(r => {
                console.log(r);
              });
          }
        });
    },

    showOptions(item) {
      let self = this;
      if (!item.completo) {
        self.botones_siguiente = [];
        self.botones_atras = [];
        if (item[0]) {
          self.loading = true;
          self.actuacion_selected = item[0];
          self.$refs.selectableTable.clearSelected();
          if (
            item[0].congelado === false &&
            (this.reasignacion === false ||
              this.reasignacion === null ||
              this.reasignacion === undefined)
          ) {
            console.log("item BOTONES");
            console.log(item);
            self.$store.state.services.unidadtramiteService
              .getBotones(item[0].tipo_tramite_id, item[0].id)
              .then(r => {
                self.loading = false;

                if (r.response) return;

                if (r.data.finalizado) {
                  this.$toastr.warning(
                    r.data.message_s.toUpperCase(),
                    "Mensaje"
                  );
                  return;
                }

                if (r.data.message_s) {
                  this.$toastr.warning(
                    r.data.message_s.toUpperCase(),
                    "Mensaje"
                  );
                }

                if (r.data.message_a) {
                  this.$toastr.warning(
                    r.data.message_a.toUpperCase(),
                    "Mensaje"
                  );
                }

                r.data.siguiente.filter(x => {
                  if (
                    x.unidad_id === 66 &&
                    (item[0].direccion_notificacion === null ||
                      item[0].direccion_notificacion == "")
                  ) {
                    x.desactivado = true;
                  } else {
                    x.desactivado = false;
                  }
                });

                self.botones_siguiente = r.data.siguiente;
                console.log("r.data.siguiente");
                console.log(r.data.siguiente);
                self.expediente = item[0];
                if (self.actuacion === false) {
                  self.expediente_id = self.expediente.expediente_id;
                  self.numero_expediente = self.expediente.numero_expediente;
                  self.tipo_tramite = self.expediente.tipo_tramite_id;
                }

                self.botones_atras = r.data.atras;
                self.styleObject.display = "block";
                self.abrirModal = "modal fade in";
                self.modal = true;
              })
              .catch(r => {});
          } else if (
            item[0].congelado === true &&
            (this.reasignacion === false ||
              this.reasignacion === null ||
              this.reasignacion === undefined)
          ) {
            this.$toastr.error(
              "EL EXPEDIENTE CONGELADO NO PUEDE SER MOVIDO A OTRO PASO",
              "Mensaje"
            );
          } else if (this.reasignacion === true) {
            console.log("HOLA MUNDO");
          }
        }
      }
    },

    cancel_show() {
      let self = this;
      this.actuacion_selected = null;
      self.styleObject.display = "";
      self.abrirModal = "modal fade";
      self.modal = false;
      this.$refs.selectableTable.clearSelected();
    },

    cancel_showReasignacion() {
      let self = this;
      this.actuacion_selected = null;
      self.styleObjectReasignacion.display = "";
      self.abrirModalReasignacion = "modal fade";
      self.modalReasignacion = false;
      this.$refs.selectableTable.clearSelected();
      this.usuariosReasignar = [];
      this.formReasignacion.usuario = null;
      this.formReasignacion.row = null;
    },

    cancel_showDescongelar() {
      let self = this;
      this.actuacion_selected = null;
      self.styleObjectDescongelar.display = "";
      self.abrirModalDescongelar = "modal fade";
      self.modalDescongelar = false;
      this.$refs.selectableTable.clearSelected();
    },

    cancel_showCongelar() {
      let self = this;
      this.actuacion_selected = null;
      self.styleObjectCongelar.display = "";
      self.abrirModalCongelar = "modal fade";
      self.modalCongelar = false;
      this.$refs.selectableTable.clearSelected();
    },

    async buscar_documento(item) {
      // console.log('item');
      // console.log(item);
      let self = this;
      this.loading = true;
      this.documento_seleccionado = null;
      this.actuacion_selected = item;
      this.documentos.push({ id: 0, nombre: "Caratula" });
      await self.$store.state.services.actuacionService
        .getDocument(item.id)
        .then(r => {
          self.documentos = r.data;
          self.documentos.forEach(x => {
            x.size = parseFloat(x.size) / 1024;
          });
          self.documentos.push({ id: 0, nombre: "Caratula" });
          self.styleObjectDocumento.display = "block";
          self.abrirModalDocumento = "modal fade in";
          self.modalDocumento = true;
          self.loading = false;
        })
        .catch(r => {});
    },

    aceptarEdicionRepresentante(x) {
      if (
        x.representacion_id != "" &&
        x.representacion_id != null &&
        x.razon_social != "" &&
        x.razon_social != null &&
        x.numero != "" &&
        x.numero != null &&
        x.email != "" &&
        x.email != null &&
        x.dpi != "" &&
        x.dpi != null
      ) {
        x.editar = false;
      } else {
        this.$toastr.error(
          "Por favor debe completar los datos, el email alternativo, no es obligatorio",
          "ADVERTENCIA"
        );
      }
    },

    cancel_showDocumento() {
      let self = this;
      self.actuacion_selected = null;
      self.styleObjectDocumento.display = "";
      self.abrirModalDocumento = "modal fade";
      self.modalDocumento = false;
      this.src = "";
    },

    verDocumento(item) {
      this.show = false;
      this.src = "";
      if (item) {
        let self = this;
        self.loading = true;
        if (item.id > 0) {
          self.$store.state.services.documentoactuacionService
            .get(item.path)
            .then(r => {
              this.nombreDocumento = item.nombre;
              this.show = true;
              let pdfData = this._base64ToArrayBuffer(r.data);
              let file = new Blob([pdfData], { type: "application/pdf" });
              let fileUrl = URL.createObjectURL(file);
              this.src = fileUrl;

              self.loading = false;
            })
            .catch(r => {});
        } else {
          self.$store.state.services.caratulaexpedienteService
            .getCaratulaActuacion(self.actuacion_selected.id)
            .then(r => {
              this.show = true;
              this.src = r.data;
              self.loading = false;
            })
            .catch(r => {});
        }
      }
    },

    crear(id) {
      let self = this;
      let url =
        "/crear/actuacion/" +
        btoa(this.numero_expediente) +
        "/" +
        btoa(this.tipo_tramite) +
        "/actuacion/" +
        btoa(id);
      self.$router.push({ path: url });
    },

    seguimiento(item) {
      this.actuacion === true
        ? this.seguimientoAct(item)
        : this.seguimientoExp(item);
      if (
        this.actuacion === true &&
        (this.reasignacion === false || this.reasignacion === undefined)
      ) {
        if (this.actuacion === true && item.completo === true) {
          this.seguimientoExp(item);
        } else {
          this.seguimientoAct(item);
        }
      } else if (
        this.actuacion === false &&
        (this.reasignacion === false || this.reasignacion === undefined)
      ) {
        this.seguimientoExp(item);
      } else if (this.reasignacion === true) {
        this.seguimientoReasig(item);
      }
    },

    seguimientoExp(item) {
      // let datasString = JSON.stringify(item);
      // let data = btoa(datasString);
      let self = this;
      let url =
        "/exp_mis_seguimiento/" +
        btoa(item.codigo_barra) +
        "/" +
        btoa(item.id) +
        "/" +
        btoa(this.expediente_id);

      self.$router.push({ path: url });
    },

    seguimientoReasig(item) {
      // console.log('item');
      // console.log(item);
      let self = this;
      let url =
        "/exp_mis_seguimiento/" +
        btoa(item.codigo_barra) +
        "/" +
        btoa(item.actuacion_id) +
        "/" +
        btoa(this.exp_id);

      self.$router.push({ path: url });
    },

    seguimientoAct(item) {
      let self = this;
      let url =
        "/exp_seguimiento/" +
        btoa(this.tipo_tramite) +
        "/" +
        btoa(this.numero_expediente.toLowerCase()) +
        "/" +
        btoa(item.codigo_barra) +
        "/" +
        btoa(item.id) +
        "/" +
        btoa(this.expediente_id);
      self.$router.push({ path: url });
    },

    seguimiento_siguiente(item) {
      if (item.desactivado) {
        this.$toastr.warning(
          "DEBE INGRESAR DIRECCION DE NOTIFICACION PARA CONTINUAR",
          "ADVERTENCIA"
        );
      } else {
        console.log("item");
        console.log(item);
        let self = this;
        let url =
          "/exp_seguimiento_siguiente/" +
          btoa(item.nombre) + //nombre del paso
          "/" +
          btoa(item.unidad) + //nombre de la unidad
          "/" +
          btoa(item.siguiente_paso) + //número de paso
          "/" +
          btoa(item.codigo_barra) + //código de actuación
          "/" +
          btoa(item.actuacion_id) + //id de la actuación
          "/" +
          btoa(item.id) + //id del paso al que va
          "/" +
          btoa(this.tipo_tramite) + //tipo de trámite
          "/" +
          btoa(this.numero_expediente.toLowerCase()) + //número de expediente
          "/" +
          btoa(this.expediente_id) + //id del expediente
          "/" +
          btoa(item.adjuntar); //necesitar adjuntar documento

        self.$router.push({ path: url });
      }
    },

    seguimiento_atras(item) {
      let self = this;
      let url =
        "/exp_seguimiento_atras/" +
        btoa(item.nombre) + //nombre del paso
        "/" +
        btoa(item.unidad) + //nombre de la unidad
        "/" +
        btoa(item.atras_paso) + //número de paso
        "/" +
        btoa(item.codigo_barra) + //código de actuación
        "/" +
        btoa(item.actuacion_id) + //id de la actuación
        "/" +
        btoa(item.id) + //id del paso al que va
        "/" +
        btoa(this.tipo_tramite) + //tipo de trámite
        "/" +
        btoa(this.numero_expediente.toLowerCase()) + //número de expediente
        "/" +
        btoa(this.expediente_id) + //id del expediente
        "/" +
        btoa(item.adjuntar); //necesitar adjuntar documento

      self.$router.push({ path: url });
    },

    agregarRequisitos(item) {
      let self = this;
      self.loading = true;
      this.barcode = item.codigo_barra;
      self.forms.barcode = self.barcode;
      this.completo = item.completo;
      // this.completo = true;

      self.$store.state.services.requisitospendientesService
        .get(this.barcode)
        .then(r => {
          self.loading = false;
          self.pendiente = r.data.pendiente;
          self.cargado = r.data.cargado;

          let temp = 0;

          self.pendiente.forEach(i => {
            self.cargado.forEach(j => {
              i.id === j.requisito_id ? (temp = 1) : "";
            });
            if (temp === 0) {
              // console.log('i: ');
              // console.log(i);
              i.folio = 0;
              i.estado = "primary";
              i.requisito = i.nombre;
              i.formato = ".PDF";
              self.requisitos.push(i);
            } else {
              temp = 0;
            }
            // temp === 0 ? (self.requisitos.push(i)) : temp = 0;
          });

          this.completo = true;

          self.forms.barcode = self.barcode;
          self.forms.expediente = r.data.expediente;

          if (this.completo !== true) {
            self.totalRows = self.requisitos.length;
            self.styleObjectRequisitos.display = "block";
            self.abrirModalRequisitos = "modal fade in";
            self.modalRequisitos = true;
            self.loading = false;
          } else {
            self.forms.expediente[0].tipo_requisito_id = 0;
            self.forms.expediente[0].tipo_tramite_id = 0;
            self.requisitos.push({
              folio: 0,
              formato: ".PDF",
              formato_id: 1,
              megas: 200,
              requisito: "ADJUNTAR DOCUMENTO",
              estado: "primary",
              tramite_requisito_id: null,
              formato_documento_id: null,
              id: null
            });
            // self.requisitos.push(documento);
            self.styleObjectRequisitos.display = "block";
            self.abrirModalRequisitos = "modal fade in";
            self.modalRequisitos = true;
            self.loading = false;
          }
        })
        .catch(r => {});
    },

    quitarRepresentante(x) {
      this.form.representantes = this.form.representantes.filter(y => y != x);
    },

    async getAllRepresentantes(expediente_id) {
      try {
        let r = await this.$store.state.services.notificacionesService.getAll(
          expediente_id
        );
        console.log("r representantes");
        console.log(r);
        this.form.representantes = r.data.data;
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
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

    async editarA(item) {
      console.log(item);
      this.form.actuacion_id = item.id;
      this.loading = true;
      this.styleObjectEditar.display = "block";
      this.abrirModalEditar = "modal fade in";
      this.modalEditar = true;
      await this.getAllManual();
      await this.getRepresentacion();
      this.form.representantes = [];
      await this.getAllRepresentantes(item.id);

      this.form.fecha_ingreso = moment(
        item.fecha_ingreso,
        "YYYY-MM-DD"
      ).toDate();

      if (item.empresa_id === 122 || item.empresa_id === 553) {
        this.bloquearCamposnit = true;
      } else {
        this.bloquearCamposnit = false;
      }

      this.form.id = item.id;
      this.form.principal = item.principal;
      this.form.nombre_expediente = item.nombre_expediente;
      this.form.nit = item.nit;
      this.form.razon_social = item.razon_social;
      this.form.observacion = item.observacion;
      this.form.tipo_razon_social = item.tipo_razon_social;
      this.form.patente = item.patente;
      this.actuacion_selected = item;
      if (item.mun_comercial != null) {
        let mun_comercial = this.municipios.filter(
          x => x.id === item.mun_comercial
        );

        let dep_comercial = this.departamentos.filter(
          x => x.id === mun_comercial[0].departamento_id
        );
        await this.setDepaux(dep_comercial[0], 3);
        await this.setMunaux(mun_comercial[0]);
        this.form.departamento_comercial = dep_comercial[0];
        this.form.mun_comercial = mun_comercial[0];
      }

      if (item.mun_propietario != null) {
        let mun_propietario = this.municipios.filter(
          x => x.id === item.mun_propietario
        );

        let dep_propietario = this.departamentos.filter(
          x => x.id === mun_propietario[0].departamento_id
        );

        await this.setDepaux(dep_propietario[0], 1);
        await this.setMunaux(mun_propietario[0]);
        this.form.departamento_propietario = dep_propietario[0];
        this.form.mun_propietario = mun_propietario[0];
      }

      if (item.mun_notificacion != null) {
        let mun_notificacion = this.municipios.filter(
          x => x.id === item.mun_notificacion
        );

        let dep_notificacion = this.departamentos.filter(
          x => x.id === mun_notificacion[0].departamento_id
        );

        await this.setDepaux(dep_notificacion[0], 2);
        await this.setMunaux(mun_notificacion[0]);
        this.form.departamento_notificacion = dep_notificacion[0];
        this.form.mun_notificacion = mun_notificacion[0];
      }

      // await this.getCui();
      // await this.getNit();

      this.form.direccion_comercial = item.direccion_comercial;
      this.form.direccion_notificacion = item.direccion_notificacion;
      this.form.direccion_propietario = item.direccion_propietario;
      this.loading = false;
    },

    async getNit() {
      try {
        let r = await this.$store.state.services.empresaService.get();
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

    cancel_showRequisitos() {
      this.forms.barcode = "";
      this.forms.folio_correcion = "";
      this.forms.expediente = null;
      this.forms.requisitos = [];
      this.forms.folio_inicial = 0;
      this.pendiente = [];
      this.cargado = [];
      this.requisitos = [];
      let self = this;
      self.actuacion_selected = null;
      self.styleObjectRequisitos.display = "";
      self.abrirModalRequisitos = "modal fade";
      self.modalRequisitos = false;
    },

    cancel_showEditar() {
      let self = this;
      this.editData = false;
      (this.form = {
        id: 0,
        principal: false,
        fecha_ingreso: null,
        nombre_expediente: "",
        observacion: "",
        nit: null,
        razon_social: "",
        patente: "",
        representantes: [],
        tipo_razon_social: "",
        direccion_notificacion: "",
        departamento_notificacion: "",
        mun_notificacion: "",
        direccion_comercial: "",
        departamento_comercial: "",
        mun_comercial: "",
        direccion_propietario: "",
        departamento_propietario: "",
        mun_propietario: ""
      }),
        (self.actuacion_selected = null);
      self.styleObjectEditar.display = "";
      self.abrirModalEditar = "modal fade";
      self.modalEditar = false;
      this.forms.representantes = [];
    },

    quitarRepresentante(item) {
      this.form.representantes.splice(
        this.form.representantes.indexOf(item),
        1
      );
    },

    seleccionarNITR(result) {
      if (result) {
        this.representante.nit = result.dpi;
        this.representante.razon_social = result.razon_social;
        this.representante.numero = result.numero;
        this.numero_representante = result.numero;
        this.representante.codigo_area = result.codigo_area;
        this.representante.pais = result.pais;
        this.representante.url = result.url;
        this.representante.email = result.email;
        this.municipios.forEach(element => {
          if (element.id == result.municipio_id) {
            this.representante.municipio_id = element;
          }
        });
        this.representante.nombre = result.nombre;
        this.ver_tags_representante = true;
      } else {
        this.clearR();
      }
    },

    clearR() {
      this.representante.nit = null;
      this.representante.razon_social = null;
      this.representante.numero = null;
      this.numero_representante = null;
      this.representante.codigo_area = null;
      this.representante.pais = null;
      this.representante.url = null;
      this.representante.notificar_telefono = true;
      this.representante.email = null;
      this.representante.notificar_email = true;
      this.representante.municipio_id = null;
      this.representante.nombre = null;
      this.representante.notificar_direccion = true;
      this.ver_tags_representante = false;
    },

    getResultValueR(result) {
      return result.dpi;
    },

    validar_numero_representante(e) {
      if (e.isValid) {
        this.representante.numero = e.phoneNumber;
        this.representante.codigo_area = e.countryCallingCode;
        this.representante.pais = e.countryCode;
        this.representante.url = e.uri;
        this.esconder_representante = true;
      } else {
        this.representante.numero = e.phoneNumber;
        this.representante.codigo_area = e.countryCallingCode;
        this.representante.pais = e.countryCode;
        this.representante.url = e.uri;
        this.esconder_representante = false;
      }
    },

    async getRepresentacion() {
      try {
        this.representaciones = [];
        let r = await this.$store.state.services.representacionService.getAll();
        this.representaciones = r.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getAllManual() {
      try {
        let r = await this.$store.state.services.notificacionesService.getAllManual();
        this.departamentos = r.data.departamento;
        this.municipios = r.data.municipio;
      } catch (error) {
        console.log(error);
        console.log("revisar departamentos y municipios");
      }
    },

    getMunicipio() {
      let self = this;

      self.$store.state.services.municipioService
        .getAll()
        .then(r => {
          // console.log('r.data MUNICIPIOS');
          // console.log(r.data);
          self.municipios = r.data;
        })
        .catch(r => {});
    },

    async saveEdit() {
      console.log("representantes");
      console.log(this.form.representantes);
      let valida = this.form.representantes.filter(x => x.editar != false);
      if (valida.length > 0) {
        this.$toastr.error(
          "Por favor verifica que los datos no estén en edición",
          "ERROR"
        );
        return;
      }

      try {
        // console.log("this.form");
        // console.log(this.form);
        let r = await this.$store.state.services.newExpedienteService.update(
          this.form
        );
        console.log("RESPUESTA ACTUALIZAR");
        console.log(r.data);
        if (r.status === 200) {
          this.$toastr.success("DATOS ACTUALIZADOS EXITOSAMENTE", "EXITO");
        } else {
          this.$toastr.error(
            "A OCURRIDO UN ERROR AL INTENTAR ACTUALIZAR LOS DATOS",
            "ERROR"
          );
        }
        // this.editData = false;
        // // Abrir modal
        this.styleObjectEditar.display = "";
        this.abrirModalEditar = "modal fade";
        this.modalEditar = false;
        this.loading = false;
        this.cancel_showEditar();
        await this.getNit();
        await this.getCui();
      } catch (error) {
        this.$toastr.error(error.message, "ERROR");
        // this.cancel_showEditar();
      }
      await this.getAll();
    },

    updateExpediente(data) {
      let self = this;
      self.loading = true;
      self.$store.state.services.expedienteService
        .update(data)
        .then(r => {
          self.loading = false;
          if (r.response) return;
          this.$toastr.success(r.data, "Mensaje");
          self.getPromise();
          self.cancel_show();
          self.cancel_showDocumento();
          self.cancel_showEditar();
          self.clearDataR();
        })
        .catch(r => {
          console.log(r);
        });
    },

    updateActuacion(data) {
      let self = this;
      self.loading = true;

      self.$store.state.services.actuacionService
        .update(data)
        .then(r => {
          self.loading = false;

          if (r.response) return;

          this.$toastr.success(r.data, "Mensaje");
          self.getPromise();
          self.cancel_show();
          self.cancel_showDocumento();
          self.cancel_showEditar();
          self.clearDataR();
        })
        .catch(r => {
          console.log(r);
        });
    },

    agregarRepresentante(scope) {
      let self = this;
      self.$validator.validateAll(scope).then(result => {
        if (result) {
          let objeto = new Object();
          objeto.nit = self.representante.nit;
          objeto.razon_social = self.representante.razon_social;
          objeto.numero = self.representante.numero;
          objeto.codigo_area = self.representante.codigo_area;
          objeto.pais = self.representante.pais;
          objeto.url = self.representante.url;
          objeto.notificar_telefono = self.representante.notificar_telefono;
          objeto.email = self.representante.email;
          objeto.municipio_id = self.representante.municipio_id;
          objeto.nombre = self.representante.nombre;
          objeto.notificar_direccion = self.representante.notificar_direccion;
          objeto.notificar_email = self.representante.notificar_email;
          objeto.completo =
            self.representante.municipio_id.nombre +
            ", " +
            self.representante.nombre;

          if (this.form.tipo_razon_social.nombre == "COOPROPIETARIO") {
            objeto.representacion = { id: 1, nombre: "PROPIETARIO" };
          } else {
            objeto.representacion = self.representante.representacion;
          }

          self.form.representantes.push(objeto);
          self.clearDataR();
        } else {
          this.$toastr.error(
            "Verificar los datos del representante",
            "Mensaje"
          );
        }
      });
    },

    //limpiar data de formulario
    clearDataR() {
      let self = this;

      Object.keys(self.representante).forEach(function(key, index) {
        if (typeof self.representante[key] === "string")
          self.representante[key] = "";
        else if (typeof self.representante[key] === "object")
          self.representante[key] = null;
        else if (typeof self.representante[key] === "boolean")
          self.representante[key] = false;
        else if (typeof self.representante[key] === "number")
          self.representante[key] = 0;
      });

      self.numero_representante = null;
      self.esconder_representante = false;
      self.representante.notificar_direccion = true;
      self.representante.notificar_telefono = true;
      self.representante.notificar_email = true;
      self.$validator.reset();
      self.$validator.reset();
    }
  },

  mounted() {
    $("body").resize();
  }
};
