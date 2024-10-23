<template>
  <div class="content-wrapper" v-loading="loading" v-if="roles.length > 0">
    <section class="content">
      <div class="row ">
        <div class="col">
          <div class="box">
            <div>
              <div
                class="p-0 m-0 panel-body table-responsive"
                v-loading="loading"
              >
                <template>
                  <div class="p-0 m-0 col col-lg-12 col-sm-12">
                    <div class="row">
                      <div class="col-md-4">
                        <br />
                        <img
                          class="datos"
                          src="https://rrhhservicios.mem.gob.gt/api/imagenes_externo/logoMEM.webp"
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
                    <div class="mt-8 mb-8">
                      <div class="mr-2 box-header with-border">
                        <h3 class="box-title">
                          Buscar:
                        </h3>
                      </div>
                      <label class="mr-2 "></label>
                      <div class="d-flex">
                        <div style="width: 35%; display: inline-block;">
                          <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Buscar"
                            single-line
                            hide-details
                          ></v-text-field>
                        </div>
                        <label class="ml-8 mr-2">Fecha inicio:</label>
                        <date-picker v-model="startDate"></date-picker>
                        <label class="ml-8 mr-2">Fecha final:</label>
                        <date-picker v-model="endDate"></date-picker>
                        <button class="ml-2 btn btn-primary" @click="getAll()">
                          Buscar
                        </button>
                        <button
                          class="ml-2 btn btn-danger "
                          @click="limpiarFiltros()"
                        >
                          Limpiar filtros
                        </button>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <hr />
                      </div>
                    </div>
                    <b-row>
                      <div id="download-reports">
                      <div>
                        <b-button
                          @click="exportXlsx"
                          style="background-color: rgb(0, 156, 5);
                          color: white;
                        "
                          class="text-white btn btn-success bold fs-4 right"
                        >
                          <i class="fa fa-file-excel-o"></i>
                          Descargar Reporte XLSX
                        </b-button>
                      </div>
                    </div>
                  </b-row>
                    <b-row>
                      <b-col md="10" class="my-1 form-inline">
                        <label>Mostrando: </label>
                        <b-form-select
                          :options="pageOptions"
                          :class="'form-control'"
                          v-model="perPage"
                        />
                        <label>entradas </label>
                      </b-col>
                      <b-col md="2" class="my-1 form-inline">
                        <b-input-group> </b-input-group>
                      </b-col>
                      <div class="raw">
                        <div class="col-md-12">
                          <hr />
                        </div>
                      </div>
                    </b-row>

                    <div ref="document">
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
                        :bordered="false"
                        select-mode="single"
                        selectable
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <rechazado v-else></rechazado>
</template>

<script>
import "jspdf-autotable";
import pdf from "vue-pdf";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/es";
import moment from "moment";
import documentos from "../../shared/Documentos";
import Rechazado from "../../shared/Rechazado";
import { exportToXlsx } from "../../../utils/exportToXlsx";
import { writeFile } from "xlsx";

export default {
  name: "notf_data_table",
  components: {
    pdf,
    DatePicker,
    moment,
    documentos,
    Rechazado
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
        }
      ],
      items: [],
      itemsData: [],
      item: null,
      datos: null,
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      pageOptions: [5, 10, 25, 50, 100],
      showStringEmpty: "no hay registros que mostrar",
      isBordered: true,
      nombreDocumento: "",
      roles: [],
      startDate: "",
      endDate: "",
      search: ""
    };
  },
  created() {
    this.loading = true;
    this.rolesS();
    this.admin = this.$store.state.user.admin;
    this.getAll();
  },
  computed: {
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
      const data = this.items.map(item => {
          return {
            "No. Cédula": item.numero_cedula,
            "Fecha Ingreso": item.fecha_cedula,
            "Nombre a Notificar": item.notificar_a,
            "Fecha de Notificación": item.fecha_notificacion,
            "Fecha de Entregado": item.fecha_entregado,
            "Dirección que Remite": item.direccion,
            "Notificador": item.usuario,
            "No. Res./Prov.": item.numero_documento,
            "Expediente": item.numero_expediente,
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
        console.log('I have to study')
        console.log(e)
      }
    },

    
    async rolesS() {
      try {
        this.loading = true;
        let r = await this.$store.state.services.administracionexpedienteService.getRol();
        console.log("que es esto", r);
        if (r.data.length === 0) {
          this.roles = [
            { rol_id: 1, rol_nombre: "Adm", sistema_nombre: "DASH" }
          ];
        } else {
          this.roles = r.data.filter(
            x =>
              x.rol_nombre == "Viceministro" ||
              x.rol_nombre == "Jefe" ||
              x.rol_nombre == "Administrador" ||
              x.rol_nombre == "Ministro" ||
              x.rol_nombre == "Director"
          );
        }
        console.log("roles", this.roles);
        this.loading = false;
      } catch (error) {
        this.$toastr.error(
          "Ocurrio un problema al obtener los roles",
          "Mensaje"
        );
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

    limpiarFiltros() {
      this.search = "";
      this.startDate = "";
      this.endDate = "";

      this.getAll();
    },
    // Obtener todos los items
    getAll() {
      // format date to 2023-08-31 yyyy-mm-dd
      let startDate =
        this.startDate != "" ? moment(this.startDate).format("YYYY-MM-DD") : "";
        let endDate =
        this.endDate != "" ? moment(this.endDate).format("YYYY-MM-DD") : "";

      this.$store.state.services.reporteNotificacionesService
        .getAll(this.search, startDate, endDate )
        .then(r => {
          console.log("r.data");
          console.log(r.data);
          this.items = r.data;
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
