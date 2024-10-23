<template>
  <v-app>
    <div
      class="p-0 m-0 panel-body table-responsive"
      id="listadoregistros"
      v-loading="loading"
    >
      <template>
        <div class="p-0 m-0 col-sm-12" v-if="gridMode">
          <div class="row">
            <div class="col-md-4">
              <br />
              <img
                class="datos"
                :src="require('../../assets/LogoLogin2.png')"
                width="60%"
              />
            </div>

            <div class="text-center col-md-4">
              <h2>
                <strong>Registro de notificaciones</strong>
              </h2>
              <h3>
                <strong>Ministerio de Energía y Minas</strong>
              </h3>
            </div>

            <div class="col-md-4 ">
              <br /><br />
              <h4 class="justify-end p-0 m-0 datos d-flex">
                Fecha: {{ fecha }} {{ hora }}
              </h4>
              <h4 class="justify-end p-0 m-0 datos d-flex">
                Usuario: {{ nombre }}
              </h4>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <hr />
            </div>
          </div>
          <div id="download-reports">
            <div>
              <b-button
                @click="exportXlsx"
                style="background-color: rgb(0, 156, 5);
                color: white;
              
              "
                class="text-white btn btn-success bold fs-4"
              >
                <i class="fa fa-file-excel-o"></i>
                Descargar Reporte XLSX
              </b-button>
            </div>
          </div>
          <b-row>
            <b-col md="8" class="my-1 form-inline">
              <label>Mostrando: </label>
              <b-form-select
                :options="pageOptions"
                :class="'form-control'"
                v-model="perPage"
              />
              <label>entradas </label>
            </b-col>
            <b-col md="4" class="my-1 form-inline">
              <v-text-field
                v-model="filter"
                append-icon="search"
                label="Buscar"
                single-line
                hide-details
              ></v-text-field>
            </b-col>

            <div class="row">
              <div class="col-md-12">
                <hr />
              </div>
            </div>
          </b-row>

          <div ref="document" class="mt-4">
            <b-table
              ref="selectableTable"
              tbody-tr-class="text-center"
              fixed
              responsive
              hover
              small
              flex
              :fields="fields"
              :items="items"
              :filter="filter"
              :current-page="currentPage"
              :per-page="perPage"
              
              @filtered="onFiltered"
              select-mode="single"
              selectable

              :striped="striped"
              :bordered="bordered"
              :borderless="borderless"
              :outlined="outlined"
              :dark="dark"
              :fixed="fixed"

            >
              <template slot="opcion" slot-scope="data">
                <div class="row" style="margin-top: 5px">
                  <button
                    v-if="data.item.fecha_notificacion === null"
                    class="btn btn-danger btn-lg btn-circle"
                    @click="abrirEnviarCorreo(data.item)"
                    v-tooltip.left="
                      'Al dar click podra enviar por correo la cedula de notificacion No. ' +
                        data.item.numero_cedula
                    "
                  >
                    <i class="fa fa-paper-plane-o"></i>
                  </button>
                </div>
                <div class="row">
                  <button
                    class="btn btn-info btn-lg btn-circle"
                    @click="getCedulaCopia(data.item)"
                    v-tooltip.left="
                      'Al dar click podra crear mas cédulas de notificación'
                    "
                  >
                    <i class="fa fa-plus-circle"></i>
                  </button>
                </div>
                <div class="row">
                  <button
                    class="btn btn-warning btn-lg btn-circle"
                    @click="verEditarCedulModal(data.item)"
                    v-tooltip.left="
                      'Al dar click el sistema le mostrará la información para editar la cédula'
                    "
                  >
                    <i class="fa fa-pencil"></i>
                  </button>
                </div>
                <div class="row">
                  <button
                    class="btn btn-success btn-lg btn-circle"
                    @click="verCedulaModal(data.item)"
                    v-tooltip.left="
                      'Al dar click verá los documentos que pertenecen a la cédula ' +
                        data.item.codigo_barra
                    "
                  >
                    <i class="fa fa-file"></i>
                  </button>
                </div>
              </template>
            </b-table>
            <br />
            <b-row>
              <b-col md="12" class="my-1">
                <label v-if="totalRows > 0"
                  >Total: {{ totalRows }} registros</label
                >
                <div class="text-center">
                  <label v-if="totalRows === 0"
                    >No hay registros que mostrar</label
                  >
                </div>
              </b-col>
              <b-col class="my-1 pull-right">
                <b-pagination
                  :total-rows="totalRows"
                  :per-page="perPage"
                  v-model="currentPage"
                  class="my-0 text-center"
                />
              </b-col>
            </b-row>
          </div>
        </div>
      </template>

      <!-- Modal para realizar la copia de la cedula -->
      <div
        :class="abrirModalCopiaCedula"
        data-backdrop="static"
        v-bind:style="styleObjectCopiaCedula"
        v-loading="loading"
      >
        <div class="modal-dialog modal-lg" style="width: 80%">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title">
                {{ title }}
                <button
                  type="button"
                  @click="cancel_showCopiaCedula"
                  class="btn btn-danger btn-xs pull-right"
                >
                  <i class="fa fa-close"></i>
                </button>
              </h2>
            </div>

            <div
              class="text-center modal-body"
              style="overflow-y: auto; height: 80%"
              v-if="modalCopiaCedula"
            >
              <notf-cedula
                :manual="false"
                :item="item"
                :copia="true"
                :datos="datos"
                v-on:copia="copia"
                v-on:carga="carga"
                @cerrar_modal="cancel_showCopiaCedula"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para mostrar los documentos agregados -->
      <div
        :class="abrirModalVerCedula"
        data-backdrop="static"
        v-bind:style="styleObjectVerCedula"
        v-loading="loading"
      >
        <div class="modal-dialog modal-lg" style="width: 80%">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title">
                {{ title
                }}<button
                  type="button"
                  @click="cancel_showVerCedula"
                  class="btn btn-danger btn-xs pull-right"
                >
                  <i class="fa fa-close"></i>
                </button>
              </h2>
            </div>

            <div
              class="text-center modal-body"
              style="overflow-y: auto; height: 100%"
              v-if="modalVerCedula"
            >
              <div class="row">
                <div class="col-md-12">
                  <multiselect
                    @input="verDocumento"
                    v-model="documento_seleccionado"
                    :options="documentosVer"
                    placeholder="Seleccione uno por favor"
                    :searchable="true"
                    :allow-empty="false"
                    :preselect-first="false"
                    :show-labels="false"
                    :show-no-result="true"
                    label="nombre"
                    track-by="id"
                  >
                    <span slot="noResult">No se encontró información</span>
                  </multiselect>
                </div>

                <div v-if="documento_seleccionado !== null" class="col-md-12">
                  <div class="alert alert-danger" role="alert">
                    <strong
                      >EL DOCUMENTO ES DEMASIADO GRANDE PARA SER
                      MOSTRADO</strong
                    >
                    <span>FAVOR DE DESCARGARLO </span>
                    <strong>
                      <a
                        :download="nombreDocumento"
                        :href="src"
                        title="Documento pdf"
                        >AQUI</a
                      >
                    </strong>
                  </div>
                </div>
              </div>
              <embed v-if="show" :src="src" height="100%" width="100%" />
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para enviar correo con los documentos -->
      <div
        :class="abrirModalEnviarCorreo"
        data-backdrop="static"
        v-bind:style="styleObjectEnviarCorreo"
        v-loading="loading"
      >
        <div class="modal-dialog modal-lg" style="width: 80%">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title">
                {{ title }}
                <button
                  type="button"
                  @click="cancel_showEnviarCorreo"
                  class="btn btn-danger btn-xs pull-right"
                >
                  <i class="fa fa-close"></i>
                </button>
              </h2>
            </div>

            <div
              class="text-center modal-body"
              style="overflow-y: auto; height: auto"
              v-if="modalEnviarCorreo"
            >
              <div class="row">
                <div class="col-md-12">
                  <documentos
                    :documentos="documentos"
                    :documentosGuardar="documentosGuardar"
                    :folios_correcion="correo.folios_correcion"
                    :botones="true"
                  />
                </div>
              </div>

              <div class="box-footer">
                <button
                  type="button"
                  class="btn btn-danger btn-lg pull-left"
                  @click="cancel_showEnviarCorreo"
                >
                  <i class="fa fa-ban"></i> Cancelar
                </button>
                <button
                  type="button"
                  class="btn btn-primary btn-lg pull-right"
                  @click="enviarCorreo()"
                >
                  <i class="fa fa-save"></i> Enviar Correo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para mostrar editar los datos de la cedula -->
      <div
        :class="abrirModalEditarCedula"
        data-backdrop="static"
        v-bind:style="styleObjectEditarCedula"
        v-loading="loading"
      >
        <div class="modal-dialog modal-lg" style="width: 80%">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title">
                {{ title
                }}<button
                  type="button"
                  @click="cancel_showEditarCedula"
                  class="btn btn-danger btn-xs pull-right"
                >
                  <i class="fa fa-close"></i>
                </button>
              </h2>
            </div>

            <div
              class="text-center modal-body"
              style="overflow-y: auto; height: auto"
              v-if="modalEditarCedula"
            >
              <!-- v-if="cedula.item.manual === true"  -->
              <div class="row">
                <!-- Fecha de Notificacion -->
                <div class="col-sm-12 col-md-5 col-lg-5">
                  <div class="form-group pull-right">
                    <label for="fecha_ingreso">Fecha de Notificación</label
                    ><br />
                    <label v-if="cedula.item.fecha_notificacion !== null">{{
                      cedula.item.fecha_notificacion
                    }}</label
                    ><br />
                    <div v-if="cedula.item.fecha_notificacion === null">
                      <date-picker
                        style="width: auto"
                        type="datetime"
                        v-model="cedula.fecha_notificacion"
                        value-type="date"
                        :input-props="{
                          class: 'form-control',
                          placeholder: 'seleccione la fecha de notificacion'
                        }"
                        format="DD/MM/YYYY hh:mm"
                        placeholder="seleccionar fecha"
                        data-vv-name="fecha de notificacion"
                        v-validate="'required|date_format:dd/MM/yyyy'"
                        show-caps
                      ></date-picker>
                      <br />
                      <FormError
                        :attribute_name="'fecha de notificacion'"
                        :errors_form="errors"
                      >
                      </FormError>
                    </div>
                  </div>
                </div>

                <!-- Fecha de Entregado -->
                <div class="col-sm-12 col-md-5 col-lg-5">
                  <div class="form-group pull-right">
                    <label for="fecha_ingreso">Fecha de Entregado</label><br />
                    <label v-if="cedula.item.fecha_entregado !== null">{{
                      cedula.item.fecha_entregado
                    }}</label
                    ><br />
                    <div v-if="cedula.item.fecha_entregado === null">
                      <date-picker
                        style="width: auto"
                        type="datetime"
                        :disabled-date="notAfterDate"
                        v-model="cedula.fecha_entregado"
                        value-type="date"
                        :input-props="{
                          class: 'form-control',
                          placeholder: 'seleccione la fecha de entregado'
                        }"
                        format="DD/MM/YYYY hh:mm"
                        placeholder="seleccionar fecha"
                        data-vv-name="fecha de entregado"
                        v-validate="'required|date_format:dd/MM/yyyy'"
                        show-caps
                      ></date-picker>
                      <br />
                      <FormError
                        :attribute_name="'fecha de entregado'"
                        :errors_form="errors"
                      >
                      </FormError>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Razón -->
              <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
                  <div class="form-group">
                    <label for="observacion">Razón</label><br />
                    <label v-if="cedula.item.razon_notificacion !== null">{{
                      cedula.item.razon_notificacion
                    }}</label>
                    <div v-if="cedula.item.razon_notificacion === null">
                      <textarea
                        v-model="cedula.razon"
                        class="form-control"
                        id="razon"
                        placeholder="escribir la razón"
                        name="razon"
                        v-validate="'max:250'"
                        :class="{
                          input: true,
                          'has-errors': errors.has('razon')
                        }"
                        @input="
                          cedula.razon = $event.target.value.toUpperCase()
                        "
                      ></textarea>
                      <FormError
                        :attribute_name="'razon'"
                        :errors_form="errors"
                      ></FormError>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="validarActualizar" class="box-footer">
                <button
                  type="button"
                  class="btn btn-danger btn-lg pull-left"
                  @click="cancel_showEditarCedula()"
                >
                  <i class="fa fa-ban"></i> Cancelar
                </button>
                <button
                  type="button"
                  class="btn btn-primary btn-lg pull-right"
                  @click="actualizarCedula()"
                >
                  <i class="fa fa-save"></i> Guardar Cédula
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import { utils, writeFile } from "xlsx";
import{ exportToXlsx }from '../../utils/exportToXlsx.js'
import FormError from "../../components/shared/FormError";
import jsPDF from "jspdf";
import "jspdf-autotable";
import pdf from "vue-pdf";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/es";
import moment from "moment";
import NotfCedula from "./notf_cedula.vue";
import documentos from "../shared/Documentos";
import {
  EnhancedCheck,
  EnhancedCheckGroup,
  EnhancedCheckRadio,
  EnhancedToggle
} from "vue-enhanced-check";
export default {
  name: "notf_data_table",
  components: {
    FormError,
    NotfCedula,
    EnhancedCheck,
    EnhancedCheckGroup,
    EnhancedCheckRadio,
    EnhancedToggle,
    pdf,
    DatePicker,
    moment,
    documentos
  },
  data() {
    return {
      title: "",

      documentosVer: [],
      documento_seleccionado: null,

      admin: false,
      src: null,
      show: false,

      // Modal Ver PDF CEDULA
      abrirModalVerCedula: "modal fade",
      styleObjectVerCedula: {},
      modalVerCedula: false,

      // Modal EDITAR DATOS CEDULA
      abrirModalEditarCedula: "modal fade",
      styleObjectEditarCedula: {},
      modalEditarCedula: false,

      // Modal ENVIAR CORREO
      abrirModalEnviarCorreo: "modal fade",
      styleObjectEnviarCorreo: {},
      modalEnviarCorreo: false,

      documentos: [
        {
          folio: 0,
          formato: ".PDF",
          formato_id: 1,
          megas: 200,
          requisito: "ADJUNTAR DOCUMENTO",
          estado: "primary"
        }
      ],

      correo: {
        cedula_id: null,
        documentos: null,
        folios_correcion: null
      },

      mover: null,

      documentosGuardar: [],

      cedula: {
        razon: null,
        fecha_notificacion: null,
        fecha_entregado: null,
        item: null
      },

      documento_principal: [],

      // Modal COPIA DE CEDULA
      abrirModalCopiaCedula: "modal fade",
      styleObjectCopiaCedula: {},
      modalCopiaCedula: false,

      // Modal paso
      abrirModal: "modal fade",
      styleObject: {},
      modal: false,

      // Variables de la tabla
      loading: false,
      loading_user: false,
      gridMode: true,
      filter: null,
      fields: [
        {
          key: "numero_cedula",
          label: "No. Cédula",
          sortable: true,
          class: "text-center"
        },
        {
          key: "fecha_cedula",
          label: "Fecha Ingreso",
          sortable: true,
          class: "text-center"
        },
        // { key: "codigo_barra", label: "Código", sortable: true, class: 'text-center' },
        {
          key: "notificar_a",
          label: "Nombre a Notificar",
          sortable: true,
          class: "text-center"
        },
        {
          key: "fecha_notificacion",
          label: "Fecha de Notificación",
          sortable: true,
          class: "text-center"
        },
        {
          key: "fecha_entregado",
          label: "Fecha de Entregado",
          sortable: true,
          class: "text-center"
        },
        {
          key: "direccion",
          label: "Dirección que Remite",
          sortable: true,
          class: "text-center"
        },
        {
          key: "usuario",
          label: "Notificador",
          sortable: true,
          class: "text-center"
        },
        {
          key: "numero_documento",
          label: "No. Res./Prov.",
          sortable: true,
          class: "text-center"
        },
        {
          key: "numero_expediente",
          label: "Expediente",
          sortable: true,
          class: "text-center"
        },
        {
          key: "lugar",
          label: "Lugar de Notificación",
          sortable: true,
          class: "text-center"
        },
        // { key: "razon_notificacion", label: "Razón de Notificación", sortable: true, class: 'text-center' },
        {
          key: "opcion",
          label: "Acciones",
          sortable: true,
          class: "text-center"
        }
      ],
      items: [],
      itemsData: [],
      allItems: [],
      item: null,
      datos: null,

      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      pageOptions: [5, 10, 25, 50, 100],
      showStringEmpty: "no hay registros que mostrar",
      isBordered: true,
      nombreDocumento: ""
    };
  },
  created() {
    this.loading = true;
    this.admin = this.$store.state.user.admin;
    this.getAll();
  },
  computed: {
    validarActualizar() {
      if (
        this.cedula.item.razon_notificacion !== null &&
        this.cedula.item.fecha_entregado !== null &&
        this.cedula.item.fecha_notificacion !== null
      ) {
        return false;
      } else {
        return true;
      }
    },

      // title(){
    //   return "CEDULA DE NOTIFICACION";
    // },

    alineacion() {
      return this.reporte === 3 ? 6 : 3;
    },

    hora() {
      let hoy = new Date(Date.now());
      let hora = hoy.getHours();
      let min = hoy.getMinutes();
      return hora + ":" + min;
    },
    fecha() {
      let hoy = new Date(Date.now());
      return hoy.toLocaleDateString();
    },
    nombre() {
      let nombre = this.$store.state.user.nombre;
      let apellido = this.$store.state.user.apellido;

      return nombre + " " + apellido;
    }
  },
  mounted() {
    $("body").resize();
  },
  methods: {
    

    async exportXlsx(){
      try{


      console.log("Exporting to xlsx...");
      const data = await this.items.map(item => {
        return {
          "No. Cédula": item.numero_cedula,
          "Fecha Ingreso": item.fecha_cedula,
          "Nombre a Notificar": item.notificar_a,
          "Fecha de Notificación": item.fecha_notificacion,
          "Fecha de Entregado": item.fecha_entregado,
          "Dirección que Remite": item.direccion,
          Notificador: item.usuario,
          "No. Res./Prov.": item.numero_documento,
          Expediente: item.numero_expediente,
          "Lugar de Notificación": item.lugar
        };
      });
      const exportResult =  exportToXlsx(data, "notificaciones");
      const workbook = exportResult[0];
      const filename = exportResult[1];
      writeFile(workbook, filename, {
        bookType: "xlsx",
        type: "buffer"
      });
    }catch(e){
        console.log(e)
      }
    },

    notAfterDate(date) {
      console.log("La fecha es");
      console.log(date);

      return date < this.cedula.fecha_notificacion - 1;
    },

    // COMUNICACION DE COMPONENTES
    carga(estado) {
      this.loading = estado;
    },

    copia() {
      this.cancel_showCopiaCedula();
      this.getAll();
    },

    // MODALES,
    verEditarCedulModal(item) {
      this.cedula.item = item;
      console.log("this.cedula");
      console.log(this.cedula);
      this.title = "Completar datos de la cédula No. " + item.numero_cedula;
      this.styleObjectEditarCedula.display = "block";
      this.abrirModalEditarCedula = "modal fade in";
      this.modalEditarCedula = true;
    },

    verCedulaModal(item) {
      this.$store.state.services.notificacionesService
        .getDocumentos(item.cedula_id)
        .then(r => {
          console.log("r.data DOCS CEDULA");
          console.log(r.data);
          console.log("item");
          console.log(item);
          this.documentosVer = [];
          this.documento_seleccionado = null;
          this.src = null;
          this.title = "Ver documentos de la cédula No. " + item.numero_cedula;
          this.documentosVer = r.data;
          this.documentosVer.push({
            id: 0,
            nombre: "Cedula " + item.numero_cedula,
            cedula_id: item.cedula_id
          });
          this.show = true;
          this.styleObjectVerCedula.display = "block";
          this.abrirModalVerCedula = "modal fade in";
          this.modalVerCedula = true;
        })
        .catch(r => {
          this.$toastr.error(r.message, "ERROR");
        });
    },

    getCedulaCopia(item) {
      this.loading = true;
      this.$store.state.services.notificacionesService
        .getCedulaCopia(item.cedula_id)
        .then(r => {
          console.log("r.data aqui es");
          console.log(r.data);
          r.data.documento_principal.forEach(x => {
            x.conservar = 1;
          });
          this.title = "Crear copia de la cedula No. " + item.numero_cedula;
          this.datos = r.data;
          this.item = item;
          this.styleObjectCopiaCedula.display = "block";
          this.abrirModalCopiaCedula = "modal fade in";
          this.modalCopiaCedula = true;
        })
        .catch(r => {
          this.$toastr.error(r.message, "ERROR");
        });
    },

    enviarCorreo() {
      this.correo.documentos = this.documentosGuardar;
      console.log("correo");
      console.log(this.correo);

      if (this.correo.documentos.length == 0) {
        this.$toastr.error("Por favor adjuntar la cédula de notificación");
        return;
      }
      this.loading = true;
      if (this.correo.item.manual) {
        this.$store.state.services.notificacionesService
          .enviarCorreoManual(this.correo)
          .then(r => {
            console.log(r);
            this.exitoFail(r);

            // if (r.status === 200 && r.data !== 1) {
            // this.mover = r.data;
            // this.mover.path = this.documentosGuardar[0].path;
            // this.mover.size = this.documentosGuardar[0].size;
            // console.log("this.mover");
            // console.log(this.mover);
            // this.traslado();
            // }
            this.loading = false;
            this.cancel_showEnviarCorreo();
          })
          .catch(r => {
            this.$toastr.error(r, "ERROR");

            this.loading = false;
          });
      } else {
        this.$store.state.services.notificacionesService
          .enviarCorreo(this.correo)
          .then(r => {
            console.log(r);

            this.exitoFail(r);
            // if (r.status === 200 && r.data !== 1) {
            // this.mover = r.data;
            // this.mover.path = this.documentosGuardar[0].path;
            // this.mover.size = this.documentosGuardar[0].size;
            // console.log("this.mover");
            // console.log(this.mover);
            // this.traslado();
            //}
            this.cancel_showEnviarCorreo();
            this.loading = false;
          })
          .catch(r => {
            this.$toastr.error(r, "ERROR");
            this.loading = false;
          });
      }
    },

    traslado() {
      let self = this;

      self.$store.state.services.seguimientoactuacionService
        .create(this.mover)
        .then(r => {
          self.loading = false;

          if (r.response) return;

          this.$toastr.success(r.data, "Mensaje");

          self.$swal({
            title: "Mensaje",
            text: r.data,
            type: "success",
            showCancelButton: false
          });
        })
        .catch(r => {
          console.log(r);
        });
    },

    exitoFail(r) {
      if (r.status === 200) {
        if (r.data.error != undefined) {
          this.$toastr.info(r.data.error, "Atención");
        } else {
          this.$toastr.success(r.data, "Atención");
        }
      } else {
        this.$toastr.error(
          "A OCURRIDO UN ERROR, POR FAVOR INTENTAR NUEVAMENTE",
          "ERROR"
        );
      }
    },

    abrirEnviarCorreo(item) {
      this.loading = true;
      this.correo.cedula_id = item.cedula_id;
      this.correo.item = item;
      this.title = "Envio de correo de la cedula No. " + item.numero_cedula;
      this.styleObjectEnviarCorreo.display = "block";
      this.abrirModalEnviarCorreo = "modal fade in";
      this.modalEnviarCorreo = true;
      this.loading = false;
    },

    cancel_showEditarCedula() {
      this.limpiarEditarCedula();
      this.styleObjectEditarCedula.display = "";
      this.abrirModalEditarCedula = "modal fade";
      this.modalEditarCedula = false;
    },

    cancel_showCopiaCedula() {
      this.styleObjectCopiaCedula.display = "";
      this.abrirModalCopiaCedula = "modal fade";
      this.modalCopiaCedula = false;
    },

    cancel_showEnviarCorreo() {
      this.correo = {
        cedula_id: null,
        documentos: null,
        folios_correcion: ""
      };
      this.correo.folios_correcion = 0;
      console.log("close enviar correo");
      this.styleObjectEnviarCorreo.display = "";
      this.abrirModalEnviarCorreo = "modal fade";
      this.modalEnviarCorreo = false;
    },

    cancel_showVerCedula() {
      this.styleObjectVerCedula.display = "";
      this.abrirModalVerCedula = "modal fade";
      this.modalVerCedula = false;
    },

    limpiarEditarCedula() {
      this.cedula.razon = "";
      this.cedula.item = null;
      this.cedula.fecha_notificacion = null;
      this.cedula.fecha_entregado = null;
    },

    // ACTUALIZACION DE DATOS
    actualizarCedula() {
      this.$store.state.services.notificacionesService
        .update(this.cedula)
        .then(r => {
          console.log("actualizar respuesta");
          console.log(r);
          if (r.data === 1) {
            this.$toastr.success("CEDULA ACTUALIZADA CON EXITO", "EXITO");
          } else {
            this.$toastr.error(
              "HA OCURRIDO UN ERROR AL INTENTAR GUARDAR LA CEDULA",
              "ERROR"
            );
          }
          this.getAll();
          this.cancel_showEditarCedula();
        })
        .catch(r => {
          this.$toastr.error(r.message, "ERROR");
        });
    },

    verDocumento(item) {
      this.loading = true;
      if (item.id !== 0) {
        this.$store.state.services.notificacionesService
          .verDocumento(item.path)
          .then(r => {
            this.nombreDocumento = item.nombre;
            if (item.size / 1024 < 2.5) {
              this.show = true;
            } else {
              this.show = false;
            }
            // this.show = true;
            this.src = r.data;
            this.loading = false;
          })
          .catch(r => {
            this.$toastr.error(r.message, "ERROR");
          });
      } else {
        console.log("item");
        console.log(item);
        this.$store.state.services.notificacionesService
          .getVerCedula(item.cedula_id)
          .then(r => {
            this.show = true;
            this.src = r.data;
            this.loading = false;
          })
          .catch(r => {
            this.$toastr.error(r.message, "ERROR");
          });
      }
    },

    // Metodo on filteres
    onFiltered(filteredItems) {
      console.log("filteredItems");
      console.log(filteredItems);
      console.log("this.items");
      console.log(this.items);
      this.allItems = filteredItems;
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    // Obtener todos los items
    getAll() {
      this.$store.state.services.notificacionesService
        .getAllReporte()
        .then(r => {
          console.log("r.data");
          console.log(r.data);
          this.items = r.data;
          this.allItems = r.data;
          r.data.forEach(x => {
            x.lugar = x.departamento + " / " + x.municipio;
          });
          this.totalRows = this.items.length;
          this.loading = false;
        })
        .catch(r => {
          this.$toastr.error(r.message, "ERROR");
        });
      this.items = [];
      this.loading = false;
    },

    // CLICKEAR
    showOptions(item) {
      let self = this;
      self.$refs.selectableTable.clearSelected();
      this.seguimientoExp(item[0]);
    },

    // REDIRECCIONAMIENTO
    seguimientoExp(item) {
      if (item !== undefined) {
        let self = this;
        let url =
          "/exp_mis_seguimiento/" +
          btoa(item.codigo_barra) +
          "/" +
          btoa(item.actuacion_id) +
          "/" +
          btoa(item.numero_expediente);

        self.$router.push({ path: url });
      }
    }
  }
};
</script>

<style scoped>
.amarillo {
  border-radius: 35px;
  color: #fcc419;
  background: #fcc419;
  font-size: 20px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
}

.rojo {
  border-radius: 35px;
  color: #f03e3e;
  background: #f03e3e;
  font-size: 20px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
}

.verde {
  border-radius: 35px;
  color: #82c91e;
  background: #82c91e;
  font-size: 20px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
}

.image {
  width: 50px;
  height: 50px;
}

.datos {
  float: center;
}

.btn-circle {
  width: 40px;
  height: 40px;
  padding: 6px 0px;
  margin-bottom: 5px;
  border-radius: 25px;
  text-align: center;
  font-size: 18px;
  line-height: 1.42857;
}

.btn-circle.btn-xl {
  width: 70px;
  height: 70px;
  padding: 10px 16px;
  border-radius: 35px;
  font-size: 24px;
  line-height: 1.33;
}
</style>
