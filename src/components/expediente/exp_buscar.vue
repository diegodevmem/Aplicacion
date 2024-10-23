<template>
  <div class="content-wrapper">
    <section class="content-header">
      <h1 class="label bg-primary">
        Consulta de Expediente
        <small style="color: white">Sistema de Expedientes</small>
      </h1>
      <br /><br />
      <ol class="label breadcrumb bg-gray">
        <router-link tag="li" to="/cat_default" exact>
          <i class="fa fa-home"></i> Home
        </router-link>
        <router-link tag="li" to="/" exact>
          <i class="fa fa-dashboard"></i> Dashboard
        </router-link>
        <li><i class="fa fa-bug active"></i> Consulta de Expediente</li>
      </ol>
    </section>
    <br />
    <section class="content" v-loading="loading">
      <div class="row">

        <!-- TABLA EXPEDIENTES -->
        <div class="col-sm-12 col-md-12 col-lg-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h1 class="box-title">
                <i class="fa fa-list"></i> Actuaciones ingresadas en el sistema.
              </h1>
            </div>
            <div class="panel-body table-responsive" id="listadoregistros">
              <div class="row">
                <div class="col-sm-12 col-md-9">
                  <b-col class="my-1 form-inline">
                    <b-input-group>
                      <b-form-input v-model="filter" placeholder="Buscar" />
                    </b-input-group>
                  </b-col>
                </div>
                <div class="col-sm-12 col-md-2">
                  <label class="pull-left"
                    >mostrando:
                    <b-form-select :options="pageOptions" v-model="perPage" />
                  </label>
                </div>
              </div>
              <div class="row"><hr /></div>
              <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12 text-center">
                  <b-table
                    class="text-center"
                    ref="selectableTable"
                    responsive
                    tbody-tr-class="text-center"
                    hover
                    stacked="md"
                    small
                    flex
                    :fields="fields"
                    :items="items"
                    :bordered="false"
                    select-mode="single"
                    selectable
                    :current-page="currentPage"
                    :per-page="perPage"
                    @filtered="onFiltered"
                    :filter="filter"
                    @row-selected="showOptions"
                  >

                    <!-- A virtual column -->
                    <template slot="fecha_ingreso" slot-scope="data">
                      <span>{{ fecha(data.item.fecha_ingreso) }}</span>
                    </template>
                    <template slot="notificacion_electronica" slot-scope="data">
                      <b-badge class="mt-2" v-if="data.item.notificacion_electronica" pill style="background: #39d64f">SI</b-badge>
                      <b-badge class="mt-2" v-if="!data.item.notificacion_electronica" pill style="background: #F33758">NO</b-badge>
                    </template>
                  </b-table>
                  <div class="col-sm-12 col-md-12 col-lg-12">
                  <label v-if="totalRows > 0"
                    >Total: {{ totalRows }} registros en el sistema.</label
                  >
                  <div class="text-center">
                    <label v-if="totalRows === 0"
                      >No hay registros que mostrar</label
                    >
                  </div>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-12">
                  <label class="pull-right"
                    ><b-pagination
                      :total-rows="totalRows"
                      :per-page="perPage"
                      v-model="currentPage"
                      class="my-0 text-center"
                  /></label>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TABLA ACTUACIONES -->
        <div v-if="act" class="col-sm-12 col-md-12 col-lg-12">
          <div class="box box-primary">
            <!-- TITULO -->
            <div class="box-header with-border">
              <h1 class="box-title">
                <i class="fa fa-list"></i> Actuaciones ingresadas en el sistema.
              </h1>
            </div>
            <div class="panel-body table-responsive" id="listadoregistros">
              <!-- OPCINES -->
              <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                  <label class="pull-left"
                    >mostrando:
                    <b-form-select :options="pageOptions" v-model="perPage" />
                  </label>
                  <span class="mx-3"><strong>{{ numero_expediente }}</strong></span>
                </div>
              </div>
              <div class="row"><hr /></div>
              <div class="row">
                <!-- TABLA -->
                <div class="col-sm-12 col-md-12 col-lg-12 text-center">
                  <b-table
                    responsive
                    hover
                    small
                    flex
                    :fields="fieldsActuacion"
                    :items="itemsActuacion"
                    :current-page="currentPage"
                    :per-page="perPage"
                  >
                    <!-- A virtual column -->
                    <template slot="opcion" slot-scope="data">
                      <button
                        class="btn btn-info btn-circle-md"
                        @click="seguimientoExp(data.item)"
                        v-tooltip.botton="
                          'Al dar click verá los seguimientos que pertenecen a la actuación con código ' +
                          data.item.codigo_barra"
                      >
                        <i class="fa fa-eye"></i>
                      </button>
                    </template>
                    <template slot="estado" slot-scope="data">
                      <b-badge class="mt-2" v-if="data.item.completo" pill style="background: #F33758">CERRADO</b-badge>
                      <b-badge class="mt-2" v-if="data.item.congelado" pill style="background: #37bdf3">CONGELADO</b-badge>
                      <b-badge class="mt-2" v-if="data.item.congelado === false && data.item.completo === false" style="background: #39d64f">ACTIVO</b-badge>

                    </template>
                  </b-table>
                </div>
                <!-- TOTAL REGISTROS -->
                <div class="col-sm-12 col-md-12 col-lg-12 text-center">
                  <label v-if="totalRowsAct > 0"
                    >Total: {{ totalRowsAct }} registros en el sistema.</label
                  >
                  <div class="text-center">
                    <label v-if="totalRowsAct === 0"
                      >No hay registros que mostrar</label
                    >
                  </div>
                </div>
                <!-- PAGINACION -->
                <div class="col-sm-12 col-md-12 col-lg-12">
                  <label class="pull-right"
                    ><b-pagination
                      :total-rows="totalRowsAct"
                      :per-page="perPageAct"
                      v-model="currentPageAct"
                      class="my-0 text-center"
                  /></label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TABLA NOTIFICACIONES -->
        <div v-if="notf" class="col-sm-12 col-md-12 col-lg-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h1 class="box-title">
                <i class="fa fa-list"></i> Notificación electronica aceptada.
              </h1>
            </div>
            <div class="panel-body table-responsive" id="listadoregistros">
              <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                  <label class="pull-left"
                    >mostrando:
                    <b-form-select :options="pageOptions2" v-model="perPage2" />
                  </label>
                </div>
              </div>
              <div class="row"><hr /></div>
              <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12 text-center">
                  <b-table
                    responsive
                    tbody-tr-class="text-center"
                    hover
                    small
                    flex
                    :fields="fieldsEmail"
                    :items="representantes"
                    :current-page="currentPage2"
                    :per-page="perPage2"
                  >
                    <!-- A virtual column -->
                    <template slot="opcion" slot-scope="data">
                      <button
                        v-if="validarCambio(data.item)"
                        class="btn btn-primary btn-circle-md"
                        @click="agregarDocumentos(data.item)"
                        v-tooltip.botton="
                          'Al dar click podra completar los requisitos o agregar documentos al expediente ' +
                          data.item.codigo_barra
                        "
                      >
                        <i class="fa fa-upload"></i>
                      </button>
                    </template>
                    <template slot="notificacion_correo" slot-scope="data">
                      <span v-if="data.item.notificacion_correo">Sí</span>
                      <label v-else class="pure-material-switch">
                        <input
                          @click="cambioEstado(data.item)"
                          type="checkbox"
                        />
                        <span v-if="form.notificacion_correo">Sí</span>
                        <span v-else>No</span>
                      </label>
                    </template>
                    <template slot="email" slot-scope="data">
                      <small><span v-text="data.item.email"></span></small>
                    </template>
                    <template slot="fecha_aceptacion" slot-scope="data">
                      <small v-if="data.item.fecha_aceptacion"
                        ><span>
                          {{ fecha(data.item.fecha_aceptacion) }}
                        </span></small
                      >
                      <small
                        v-if="
                          data.item.notificacion_correo &&
                          data.item.fecha_aceptacion === null
                        "
                        ><span>
                          {{ fechaActual }}
                        </span></small
                      >
                    </template>
                    <template slot="email_alternativo" slot-scope="data">
                      <small
                        ><span v-text="data.item.email_alternativo"></span
                      ></small>
                    </template>
                    <template slot="razon_social" slot-scope="data">
                      <small
                        ><span v-text="data.item.razon_social"></span
                      ></small>
                    </template>
                  </b-table>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-12 text-center">
                  <label v-if="totalRows2 > 0"
                    >Total: {{ totalRows2 }} registros en el sistema.</label
                  >
                  <div class="text-center">
                    <label v-if="totalRows2 === 0"
                      >No hay registros que mostrar</label
                    >
                  </div>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-12">
                  <label class="pull-right"
                    ><b-pagination
                      :total-rows="totalRows2"
                      :per-page="perPage2"
                      v-model="currentPage2"
                      class="my-0 text-center"
                  /></label>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Modal AGREGAR DOCUMENTOS -->
    <div
      :class="abrirModalDocumentos"
      data-backdrop="static"
      v-bind:style="styleObjectDocumentos"
      v-loading="loading"
    >
      <div class="modal-dialog modal-lg" style="width: 80%; height: 60%">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">
              Agregar documentos a la actuación
              <button
                type="button"
                @click="cancel_showDocumentos"
                class="btn btn-danger btn-xs pull-right"
              >
                <i class="fa fa-close"></i>
              </button>
            </h2>
          </div>
          <div
            class="modal-body text-center"
            style="overflow-y: auto; height: 100%"
            v-if="modalDocumentos"
          >
            <h3 class="text-center">AGREGAR DOCUMENTOS<br /></h3>
            <br /><br />
            <div>
              <button
                type="button"
                class="btn btn-primary btn-block btn-lg pull-right mx-3 px-3"
              >
                <i class="fa fa-save"></i> Agregar documento
              </button>
            </div>
            <documentos
              :documentos="documentos"
              :documentosGuardar="documentosGuardar"
              :folios_correcion="form.folios_correcion"
              :botones="false"
            />
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary btn-block btn-lg pull-right"
              @click="guardar"
            >
              <i class="fa fa-save"></i> Agregar documento
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormError from "../shared/FormError";
import documentos from "../shared/Documentos";
import {
  EnhancedCheck,
  EnhancedCheckGroup,
  EnhancedCheckRadio,
  EnhancedToggle,
} from "vue-enhanced-check";
export default {
  name: "exp_buscar",
  components: {
    FormError,
    EnhancedCheck,
    EnhancedCheckGroup,
    EnhancedCheckRadio,
    EnhancedToggle,
    documentos,
  },
  data() {
    return {
      loading: true,
      numero_expediente: null,
      filter: null,

      act: false,
      notf: false,
      items: [],
      itemsActuacion: [],
      fieldsActuacion: [
        { key: "codigo_barra", label: "Codigo de barras", sortable: true },
        {
          key: "nombre_expediente",
          label: "Nombre de la Actuación",
          sortable: true,
        },
        { key: "razon_social", label: "Razon Social", sortable: true },
        { key: "estado", label: "Estado", sortable: true },
        { key: "opcion", label: "Acciones", sortable: true },
      ],

      fields: [
        { key: "numero_expediente", label: "Numero del Expediente", sortable: true },
        { key: "nombre_expediente", label: "Nombre del Expediente", sortable: true },
        { key: "tipo_tramite", label: "Tipo Tramite", sortable: true },
        { key: "fecha_ingreso", label: "Fecha de Ingreso", sortable: true },
        { key: "notificacion_electronica", label: "Notificación Electrónica", sortable: true}
        // { key: "opcion", label: "Acciones", sortable: true },
      ],

      fieldsEmail: [
        { key: "razon_social", label: "Representante", sortable: true },
        { key: "email", label: "Email", sortable: true },
        {
          key: "email_alternativo",
          label: "Email Alternativo",
          sortable: true,
        },
        {
          key: "notificacion_correo",
          label: "¿Acepta ser notificado via correo electronico?",
          sortable: true,
        },
        {
          key: "fecha_aceptacion",
          label: "Fecha de aceptación",
          sortable: true,
        },
        { key: "opcion", label: "Acciones", sortable: true },
      ],

      filter: null,
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      pageOptions: [5, 10, 25, 100],
      showStringEmpty: "no hay registros que mostrar",

      currentPageAct: 1,
      perPageAct: 5,
      totalRowsAct: 0,
      pageOptionsAct: [5, 10, 25, 100],
      showStringEmptyAct: "no hay registros que mostrar",

      currentPage2: 1,
      perPage2: 5,
      totalRows2: 0,
      pageOptions2: [5, 10, 25, 100],
      showStringEmpty2: "no hay registros que mostrar",

      representantes: [],

      // Modal Documentos
      abrirModalDocumentos: "modal fade",
      styleObjectDocumentos: {},
      modalDocumentos: false,

      documentos: [
        {
          folio: 0,
          formato: ".PDF",
          formato_id: 1,
          megas: 200,
          requisito: "ADJUNTAR DOCUMENTO",
          estado: "primary",
        },
      ],

      form: {
        //representante: null,
        notificacion_correo: false,
        actuacion_id: null,
        documentos: null,
        folios_correcion: null,
        razon_social_id: null,
      },

      documentosGuardar: [],
      //folios_correcion: null,
      cambio: {
        estado: false,
        id: null,
      },
    };
  },
  computed: {
    fechaActual() {
      let hoy = new Date();
      return (
        hoy.getDate() + "/" + (hoy.getMonth() + 1) + "/" + hoy.getFullYear()
      );
    },
  },
  created() {
    let self = this;
    console.log('this.$store.state.user');
    console.log(this.$store.state.user.unidad);

    self.getPromise();
  },
  methods: {

    buscarActuacion(numero_expediente){
      this.$store.state.services.buscarExpedienteService
        .getActuacion(numero_expediente)
        .then((r) => {
          console.log('r.data[0]');
          console.log(r.data);
          this.form.actuacion_id = r.data[0].actuacion_id;
          console.log('this.$store.state.user');
          console.log(this.$store.state.user);
          if (this.$store.state.user.unidad.id === 66 || this.$store.state.user.admin === true) {
            // this.notf = true;
            this.getAllRepresentantes(this.form.actuacion_id);
          }
          this.itemsActuacion = r.data;
          this.act = true;
          this.totalRowsAct = this.itemsActuacion.length;
          if (this.items.length === 0) {
            this.$toastr.error("EL EXPEDIENTE BUSCADO NO EXISTE", "ERROR");
            this.loading = false;
          }
        })
        .catch((r) => {
          this.$toastr.error(r.message, "ERROR");
          this.loading = false;
        });
    },

    showOptions(item) {
      this.act = false;
      this.notf = false;
      this.numero_expediente = item[0].numero_expediente;
      this.buscarActuacion(item[0].numero_expediente);
    },

    getPromise() {
      this.loading = true;
      Promise.all([this.getExp()])
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$toastr.error("Ocurrió un error: " + error, "Error");
        });
    },

    getExp(){
      this.$store.state.services.buscarExpedienteService
        .getExpediente()
        .then((r) => {
          this.items = r.data;
          this.totalRows = this.items.length;
          this.loading = false;
        })
        .catch((r) => {
          this.$toastr.error(r.message, "ERROR");
          this.loading = false;
        });
    },

    tableDashConsolidadoSemaforo() {
      //consolidado todo activos
      let self = this;
      self.$store.state.services.administracionexpedienteService
        .getExpTableDashConsolidadoSemaforoTodo()
        .then((r) => {
          this.items = r.data;
          console.log('r.data');
          console.log(r.data);
          self.totalRows = self.items.length;
          self.loading = false;
          // self.loading_user = false;
        })
        .catch((r) => {});
    },

    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    validarCambio(item) {
      if (
        item.notificacion_correo === true &&
        this.cambio.estado === true &&
        item.razon_social_id === this.cambio.id
      ) {
        return true;
      } else {
        return false;
      }
    },

    cambioEstado(item) {
      console.log("item");
      console.log(item);
      console.log("CAMBIO");
      item.notificacion_correo = true;
      this.cambio.estado = true;
      this.cambio.id = item.razon_social_id;
    },

    fecha(fecha) {
      let data = fecha.split("-").reverse().join("/");
      return data;
    },

    guardar() {
      this.form.documentos = this.documentosGuardar;
      this.form.notificacion_correo = this.representantes.filter(
        (x) => x.razon_social_id === this.form.razon_social_id
      )[0].notificacion_correo;
      // this.form.representantes = this.representantes;
      console.log("this.form");
      console.log(this.form);
      this.$store.state.services.documentoactuacionService
        .notificacion(this.form)
        .then((r) => {
          if (r.status === 200) {
            this.$toastr.success(
              "SE HA ACEPTADO LA NOTIFICACION VIA CORREO ELECTRONICO",
              "EXITO"
            );
          } else {
            this.$toastr.error(
              "A OCURRIDO UN ERROR AL INTENTAR ACEPTAR LA NOTIFICACION VIA CORREO ELECTRONICO",
              "ERROR"
            );
          }
          this.cancel_showDocumentos();
        })
        .catch((r) => {
          this.$toastr.error(r.message, "ERROR");
          this.loading = false;
        });
    },

    cancel_showDocumentos() {
      this.form = {
        notificacion_correo: false,
        actuacion_id: null,
        documentos: null,
        folios_correcion: null,
        razon_social_id: null,
      };
      this.cambio = {
        estado: false,
        id: null,
      };
      this.styleObjectDocumentos.display = "";
      this.abrirModalDocumentos = "modal fade";
      this.modalDocumentos = false;
    },

    agregarDocumentos(item) {
      console.log("item");
      console.log(item);
      this.form.razon_social_id = item.razon_social_id;
      this.loading = true;
      this.styleObjectDocumentos.display = "block";
      this.abrirModalDocumentos = "modal fade in";
      this.modalDocumentos = true;
      this.loading = false;
    },

    busqueda() {
      this.loading = true;
      this.buscar();
    },

    getAllRepresentantes(expediente_id) {
      this.$store.state.services.notificacionesService
        .getAll(expediente_id)
        .then((r) => {
 
          this.representantes = r.data.data;
          this.notf = true;
          // this.form.representantes = this.representantes;
          this.totalRows2 = this.representantes.length;
          this.loading = false;
        })
        .catch((r) => {
          // this.$toastr.error(r.message, "ERROR");
          this.loading = false;
        });
    },

    seguimientoExp(item) {
      let self = this;
      let url =
        "/exp_mis_seguimiento/" +
        btoa(item.codigo_barra) +
        "/" +
        btoa(item.actuacion_id) +
        "/" +
        btoa(item.numero_expediente);

      self.$router.push({ path: url });
    },

    buscar() {
      if (this.numero_expediente === null) {
        this.$toastr.error("DEBE DE INGRESAR UN NUMERO DE EXPEDIENTE", "ERROR");
        this.loading = false;
      } else {
        this.$store.state.services.buscarExpedienteService
          .get(this.numero_expediente)
          .then((r) => {
            console.log("r.data[0]");
            console.log(r.data[0]);
            this.form.actuacion_id = r.data[0].actuacion_id;
            this.getAllRepresentantes(this.form.actuacion_id);
            this.items = r.data;
            this.totalRows = this.items.length;
            if (this.items.length === 0) {
              this.$toastr.error("EL EXPEDIENTE BUSCADO NO EXISTE", "ERROR");
              this.loading = false;
            }
          })
          .catch((r) => {
            this.$toastr.error(r.message, "ERROR");
            this.loading = false;
          });
      }
    },
  },
  mounted() {
    $("body").resize();
  },
};
</script>
