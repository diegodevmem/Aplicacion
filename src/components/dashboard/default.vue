<template>
  <div class="content-wrapper">
    <section class="content">
      <div class="row">
        <div v-if="altoMando" class="col-md-3 col-sm-12">
          <div @click="modalAltoMando()" class="card card-dir text-center">
            <img
              class="h-5 px-1"
              :src="require('../../assets/grafica.png')"
              alt="grafica"
            />
            <br />
            <span class="text-admin">Consolidado Expedientes</span>
          </div>
        </div>
        <div
          v-for="(dir, index) in direcciones"
          :key="index"
          class="col-md-3 col-sm-12"
        >
          <div @click="view(dir, 1, 0)">
            <!-- <pre>{{ dir }}</pre> -->
            <div class="card card-dir text-center" :class="card(dir)">
              <img
                class="h-5 px-1"
                :class="grises(dir)"
                :src="require('../../assets/' + dir.abreviatura + '.png')"
                :alt="dir.abreviatura"
              />
              <br />
              <span class="text-admin" v-bind:class="color(dir)">{{
                dir.nombre
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <br />

      <!-- <div id="accordion" v-if="user_pertenece_id === 2 || roles[0].rol_id === 1"> -->
      <!--Hidrocarburos -->
      <div
        v-if="
          user_pertenece_id === 19 ||
            (roles[0].rol_id === 1 && roles[0].sistema_id === 6)
        "
      >
        <div class="card" style="background-color: whitesmoke">
          <div
            class="card-header btn btn-link collapsed w-100"
            id="headingTwo"
            data-toggle="collapse"
            data-target="#collapseTwo"
            aria-expanded="false"
            aria-controls="collapseTwo"
          >
            <h4 class="mb-0">
              Unidades de la Dirección General de Hidrocarburos
            </h4>
          </div>
          <div
            id="collapseTwo"
            class="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordion"
          >
            <div class="row">
              <div
                v-for="(dir, index) in btnHidro"
                :key="index"
                class="col-md-3 col-sm-12"
              >
                <div v-if="unidadPertenece(dir)" @click="view(dir, 0, 19)">
                  <!-- <pre>{{ dir }}</pre> -->
                  <div id="suba" class="card card-dir text-center card-white">
                    <!-- <img class="h-5 px-1" :class="grises(dir)" :src="require('../../assets/' + dir.abreviatura + '.png')" :alt="dir.abreviatura"> -->
                    <br />
                    <span id="span" class="text" v-bind:class="color(dir)"
                      >{{ dir.nombre }} ({{ dir.abreviatura }})</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <hr />
          </div>
        </div>
      </div>
      <div
        v-if="
          user_pertenece_id === 22 ||
            (roles[0].rol_id === 1 && roles[0].sistema_id === 6)
        "
      >
        <div class="card" style="background-color: whitesmoke">
          <div
            class="card-header btn btn-link collapsed w-100"
            id="headingThree"
            data-toggle="collapse"
            data-target="#collapseThree"
            aria-expanded="false"
            aria-controls="collapseThree"
          >
            <h4 class="mb-0">Unidades de la Dirección General de Energia</h4>
          </div>
          <div
            id="collapseThree"
            class="collapse"
            aria-labelledby="headingThree"
            data-parent="#accordion"
          >
            <div class="row">
              <div
                v-for="(dir, index) in btnEner"
                :key="index"
                class="col-md-3 col-sm-12"
              >
                <div v-if="unidadPertenece(dir)" @click="view(dir, 0, 22)">
                  <div id="suba" class="card card-dir text-center card-white">
                    <!-- <img class="h-5 px-1" :class="grises(dir)" :src="require('../../assets/' + dir.abreviatura + '.png')" :alt="dir.abreviatura"> -->
                    <br />
                    <span id="span" class="text" v-bind:class="color(dir)"
                      >{{ dir.nombre }} ({{ dir.abreviatura }})</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <hr />
          </div>
        </div>
      </div>
      <!-- Section mineria -->
      <div
        v-if="
          user_pertenece_id === 20 ||
            (roles[0].rol_id === 1 && roles[0].sistema_id === 6)
        "
      >
        <div class="card" style="background-color: whitesmoke">
          <div
            class="card-header btn btn-link collapsed w-100"
            id="headingFour"
            data-toggle="collapse"
            data-target="#collapseFour"
            aria-expanded="false"
            aria-controls="collapseFour"
          >
            <h4 class="mb-0">Unidades de la Dirección General de Mineria</h4>
          </div>
          <div
            id="collapseFour"
            class="collapse"
            aria-labelledby="headingFour"
            data-parent="#accordion"
          >
            <div class="row">
              <div
                v-for="(dir, index) in btnMin"
                :key="index"
                class="col-md-3 col-sm-12"
              >
                <div v-if="unidadPertenece(dir)" @click="view(dir, 0, 20)">
                  <!-- <pre>{{ dir }}</pre> -->
                  <div class="card card-dir text-center card-white" id="suba">
                    <!-- <img class="h-5 px-1" :class="grises(dir)" :src="require('../../assets/' + dir.abreviatura + '.png')" :alt="dir.abreviatura"> -->
                    <br />
                    <span id="span" class="text" v-bind:class="color(dir)"
                      >{{ dir.nombre }} ({{ dir.abreviatura }})</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <hr />
          </div>
        </div>
      </div>
      <!-- Section Secretaria general -->
      <div
        class="card"
        v-if="
          user_pertenece_id === 2 ||
            (roles[0].rol_id === 1 && roles[0].sistema_id === 6)
        "
      >
        <div class="card" style="background-color: whitesmoke">
          <div
            class="card-header btn btn-link collapsed w-100"
            id="headingFive"
            data-toggle="collapse"
            data-target="#collapseFive"
            aria-expanded="false"
            aria-controls="collapseFive"
          >
            <h4 class="mb-0">Unidades de Secretaria General</h4>
          </div>
          <div
            id="collapseFive"
            class="collapse"
            aria-labelledby="headingFive"
            data-parent="#accordion"
          >
            <div class="row">
              <div
                v-for="(dir, index) in btnSG"
                :key="index"
                class="col-md-3 col-sm-12"
              >
                <div v-if="unidadPertenece(dir)" @click="view(dir, 0, 2)">
                  <!-- <pre>{{ dir }}</pre> -->
                  <div class="card card-dir text-center card-white" id="suba">
                    <!-- <img class="h-5 px-1" :class="grises(dir)" :src="require('../../assets/' + dir.abreviatura + '.png')" :alt="dir.abreviatura"> -->
                    <br />

                    <span id="span" class="text" v-bind:class="color(dir)"
                      >{{ dir.nombre }} ({{ dir.abreviatura }})</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- </div> -->

      <hr />
    </section>

    <!-- Modal de opciones de reportes -->
    <div
      :class="abrirModalDash"
      data-backdrop="static"
      v-bind:style="styleObjectDash"
      v-loading="loading"
    >
      <div class="modal-dialog modal-lg" style="width: 93%">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title text-center">
              <span v-if="consolidado === 1"> CONSOLIDADO DE EXPEDIENTES </span>
              <span v-else>
                {{ send.nombre | upper }} ({{ send.abreviatura }})
              </span>
              <button
                type="button"
                @click="cancel_showDash"
                class="btn btn-danger btn-xs pull-right"
              >
                <i class="fa fa-close"></i>
              </button>
            </h2>
          </div>

          <div
            class="modal-body text-center"
            style="overflow-y: auto; height: 80%"
            v-if="modalDash"
          >
            <!--opciones para filtrar los reportes del dashboard-->
            <div>
              <input
                type="radio"
                class="stv-radio-button"
                @click="openOptionFilter(1)"
                name="radioButtonTest"
                value="1"
                id="button1"
                checked
              />
              <label for="button1">Todo</label>
              <input
                type="radio"
                class="stv-radio-button"
                @click="openOptionFilter(2)"
                name="radioButtonTest"
                value="2"
                id="button2"
              />
              <label for="button2">Rango de fecha</label>
              <input
                type="radio"
                class="stv-radio-button"
                @click="openOptionFilter(3)"
                name="radioButtonTest"
                value="3"
                id="button3"
              />
              <label for="button3">Mensual</label>
            </div>
            <br />
            <!--Opcion que se despliega si y solo si optRango es verdadero-->

            <div v-if="optRango" class="row">
              <div class="col-md-6 col-sm-12 col-lg-6">
                <label for="fecha_incial">Fecha inicial</label>
                <br />
                <date-picker
                  v-model="form.fecha_inicial"
                  :input-props="{
                    class: 'form-control',
                    placeholder: 'seleccione la fecha de inicial'
                  }"
                  :disabled-date="notAfterToday"
                  format="DD-MM-YYYY"
                  placeholder="selecciona fecha incial"
                  data-vv-name="fecha inicial"
                  v-validate="'required|date_format:dd/MM/yyyy'"
                  show-caps
                ></date-picker>
                <br />
                <FormError
                  :attribute_name="'fecha inicial'"
                  :errors_form="errors"
                >
                </FormError>
              </div>
              <div class="col-md-6 col-sm-12 col-lg-6">
                <label for="fecha_final">Fecha final</label>
                <br />
                <date-picker
                  v-model="form.fecha_final"
                  :input-props="{
                    class: 'form-control',
                    placeholder: 'seleccione la fecha final'
                  }"
                  :disabled-date="notAfterToday"
                  format="DD-MM-YYYY"
                  placeholder="selecciona fecha final"
                  data-vv-name="fecha final"
                  v-validate="'required|date_format:dd/MM/yyyy'"
                  show-caps
                ></date-picker>
                <br />
                <FormError
                  :attribute_name="'fecha final'"
                  :errors_form="errors"
                >
                </FormError>
              </div>
            </div>

            <!--Opcion que se despliega si y solo si optMensual es verdadero-->

            <div v-if="optMensual" class="col">
              <label for="fecha_ingreso">Mes - Año</label>
              <date-picker
                v-model="form.fecha_inicial"
                :input-props="{
                  class: 'form-control',
                  placeholder: 'seleccione el mes y año'
                }"
                :disabled-date="notAfterToday"
                type="month"
                format="MM-YYYY"
                placeholder="selecciona el mes y año"
                data-vv-name="fecha mensual"
                v-validate="'required|date_format:dd/MM/yyyy'"
                show-caps
              ></date-picker>
              <br />
              <FormError
                :attribute_name="'fecha mensual'"
                :errors_form="errors"
              >
              </FormError>
            </div>

            <div class="content">
              <div class="row">
                <!--Inician las opciones de reportes (grafica, activos, cerrados, congelados)-->
                <div
                  v-for="(rep, i) in reportes"
                  :key="i"
                  class="col-md-4 col-sm-12 col-lg-3"
                >
                  <div @click="viewOpt(rep.id)" class="card card-dash">
                    <img
                      class="h-5 px-1"
                      :src="require('../../assets/' + rep.imagen + '.png')"
                      :alt="rep.imagen"
                    />
                    <br />
                    <span class="text"
                      ><strong>{{ rep.nombre }}</strong></span
                    >
                  </div>
                </div>
                <div class="col-md-4 col-sm-12 col-lg-3">
                  <div
                    class="card card-dash"
                    @click="$router.push('reporte_solicitudes_externas')"
                  >
                    <img
                      class="h-5 px-1"
                      :src="require('../../assets/SG' + '.png')"
                    />
                    <br />
                    <span class="text"
                      ><strong>Reporte de solicitudes</strong></span
                    >
                  </div>
                </div>
                <div class="col-md-4 col-sm-12 col-lg-3">
                  <div
                    class="card card-dash"
                    @click="$router.push('reporte_notificaciones')"
                  >
                    <img
                      class="h-5 px-1"
                      :src="require('../../assets/notificacion' + '.svg')"
                    />
                    <br />
                    <span class="text"
                      ><strong>Reporte de notificaciones</strong></span
                    >
                  </div>
                </div>
              </div>
            </div>
            <br /><br />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para mostrar el reporte seleccionado -->
    <div
      :class="abrirModalOpt"
      data-backdrop="static"
      v-bind:style="styleObjectOpt"
      v-loading="loading"
    >
      <div class="modal-dialog modal-lg" style="width: 95%">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title text-center">
              <span v-if="reporte === 1"
                ><strong>{{ reportes[0].nombre | upper }}</strong></span
              >
              <span v-if="reporte === 2"
                ><strong>{{ reportes[1].nombre | upper }}</strong></span
              >
              <span v-if="reporte === 3"
                ><strong>{{ reportes[2].nombre | upper }}</strong></span
              >
              <span v-if="reporte === 4"
                ><strong>{{ reportes[3].nombre | upper }}</strong></span
              >
              <button
                type="button"
                @click="cancel_showOpt"
                class="btn btn-danger btn-xs pull-right"
              >
                <i class="fa fa-close"></i>
              </button>
            </h2>
          </div>

          <div
            class="modal-body text-center"
            style="overflow-y: auto; height: 80%"
            v-if="modalOpt"
          >
            <!--Estos modales de reportes Estado de estos modales: inactivos-->
            <div class="content">
              <div class="row">
                <div v-if="reporte === 1">
                  <dash_grafica_semaforo
                    :tipo="direccion"
                    :unidad="send.id"
                    :consolidado="consolidado"
                  ></dash_grafica_semaforo>
                </div>
                <!-- <div v-if="reporte===2">
                  <dash_estatus_expediente :unidad="send.id" :consolidado="consolidado"></dash_estatus_expediente>
                </div> -->
                <div v-if="reporte === 2">
                  <dash_data_table
                    :reporte="2"
                    :pertenece="pertenece_id"
                    :fieldsActivos="fieldsActivos"
                    :tipo="direccion"
                    :unidad="send.id"
                    :consolidado="consolidado"
                  ></dash_data_table>
                </div>
                <div v-if="reporte === 3">
                  <dash_data_table
                    :reporte="3"
                    :pertenece="pertenece_id"
                    :tipo="direccion"
                    :unidad="send.id"
                    :consolidado="consolidado"
                    :fieldsCerrados="fieldsCerrados"
                  ></dash_data_table>
                </div>
                <div v-if="reporte === 4">
                  <dash_data_table
                    :reporte="4"
                    :pertenece="pertenece_id"
                    :tipo="direccion"
                    :fieldsCongelados="fieldsCongelados"
                    :unidad="send.id"
                    :consolidado="consolidado"
                  ></dash_data_table>
                </div>
              </div>
            </div>
            <br /><br />
          </div>
        </div>
      </div>
    </div>

    <!--Escenario para filtar por rango de fecha-->
  </div>
</template>

<script>
import FormError from "../shared/FormError";
import dash_grafica_semaforo from "./dash_grafica_semaforo";
import grafica_semaforo from "../expediente/graficas/grafica_semaforo";
import RptsEstatusExp from "../reportes/estatus_exp";
import dash_estatus_expediente from "./dash_estatus_expediente";
import dash_data_table from "./dash_data_table";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/es";

export default {
  name: "DefaultDash",
  components: {
    dash_grafica_semaforo,
    grafica_semaforo,
    RptsEstatusExp,
    dash_estatus_expediente,
    dash_data_table,
    FormError,
    DatePicker
  },
  data() {
    return {
      direccion: null,
      filtrarDirecciones: [
        { abr: "DGE" },
        { abr: "DGM" },
        { abr: "DGH" },
        { abr: "SG" }
      ],
      direcciones: [],
      btnHidro: [],
      btnEner: [],
      btnMin: [],
      btnSG: [],
      abrirModalDash: "modal fade",
      styleObjectDash: {},
      modalDash: false,
      user: null,

      reporte: 0,
      send: 0,
      consolidado: 0,
      reporteTitulo: "",

      abrirModalOpt: "modal fade",
      styleObjectOpt: {},
      modalOpt: false,

      loading: false,
      reportes: [
        {
          id: 1,
          nombre: "Gráfica de Expedientes",
          imagen: "barra_grafica",
          url: "grafica"
        },
        {
          id: 2,
          nombre: "Reporte Expedientes Activos",
          imagen: "tabla",
          url: "tabla_datos"
        },
        {
          id: 3,
          nombre: "Reporte Expedientes Cerrados",
          imagen: "cerrados",
          url: "tabla_cerrados"
        },
        {
          id: 4,
          nombre: "Reporte Expedientes Congelados",
          imagen: "congelados",
          url: "tabla_congelados"
        }
        // {
        //   id: 5,
        //   nombre: "Reporte de Solicitudes",
        //   imagen: "SG",
        //   url: "reporte_solicitudes_externas",
        // },
      ],

      fieldsActivos: [
        {
          key: "estado",
          label: "Estado del paso",
          sortable: true,
          class: "text-center"
        },
        {
          key: "congelado",
          label: "Congelado",
          sortable: true,
          class: "text-center"
        },
        // { key: "codigo_barra", label: "Código", sortable: true, class: 'text-center' },
        {
          key: "tipo_tramite",
          label: "Trámite",
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
          key: "fecha_ingreso",
          label: "Fecha de Ingreso",
          sortable: true,
          class: "text-center"
        },
        {
          key: "nombre_expediente",
          label: "Nombre",
          sortable: true,
          class: "text-center"
        },
        {
          key: "direccion",
          label: "Dirección",
          sortable: true,
          class: "text-center"
        },
        {
          key: "empleado",
          label: "Empleado",
          sortable: true,
          class: "text-center"
        },
        {
          key: "unidad",
          label: "Unidad",
          sortable: true,
          class: "text-center"
        },
        {
          key: "fecha_paso",
          label: "Fecha de Paso",
          sortable: true,
          class: "text-center"
        },
        {
          key: "paso",
          label: "Paso Actual",
          sortable: true,
          class: "text-center"
        },
        {
          key: "dias_limite",
          label: "Días del paso",
          sortable: true,
          class: "text-center"
        },
        {
          key: "dias_notificar",
          label: "Días para notificar",
          sortable: true,
          class: "text-center"
        },
        {
          key: "dias_transcurridos",
          label: "Días transcurridos del paso",
          sortable: true,
          class: "text-center"
        },
        {
          key: "dias_totales",
          label: "Total de días expediente",
          sortable: true,
          class: "text-center"
        },
        {
          key: "dias_congelado",
          label: "Días Congelado expediente",
          sortable: true,
          class: "text-center"
        }
      ],

      fieldsCerrados: [
        // { key: "codigo_barra", label: "Codigo", sortable: true, class: "text-center", },
        {
          key: "tipo_tramite",
          label: "Trámite",
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
          key: "fecha_ingreso",
          label: "Fecha de Ingreso",
          sortable: true,
          class: "text-center"
        },
        {
          key: "nombre_expediente",
          label: "Nombre",
          sortable: true,
          class: "text-center"
        },
        {
          key: "direccion",
          label: "Dirección",
          sortable: true,
          class: "text-center"
        },
        {
          key: "unidad",
          label: "Unidad",
          sortable: true,
          class: "text-center"
        },
        {
          key: "fecha_cerrado",
          label: "Fecha de Cierre",
          sortable: true,
          class: "text-center"
        },
        {
          key: "dias_totales",
          label: "Total de Días",
          sortable: true,
          class: "text-center"
        }
      ],

      fieldsCongelados: [
        {
          key: "tipo_congelacion",
          label: "Tipo Congelación",
          sortable: true,
          class: "text-center"
        },
        { key: "razon", label: "Razón", sortable: true, class: "text-center" },
        {
          key: "tipo_tramite",
          label: "Trámite",
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
          key: "nombre_expediente",
          label: "Nombre",
          sortable: true,
          class: "text-center"
        },
        {
          key: "unidad",
          label: "Unidad",
          sortable: true,
          class: "text-center"
        },
        {
          key: "direccion",
          label: "Dirección",
          sortable: true,
          class: "text-center"
        },
        {
          key: "usuario",
          label: "Empleado",
          sortable: true,
          class: "text-center"
        },
        {
          key: "fecha_congelacion",
          label: "Fecha congelado",
          sortable: true,
          class: "text-center"
        },
        {
          key: "paso",
          label: "Paso Actual",
          sortable: true,
          class: "text-center"
        },
        {
          key: "dias_congelado",
          label: "Días Congelado expediente",
          sortable: true,
          class: "text-center"
        }
      ],

      user_pertenece_id: null,
      pertenece_id: null,
      user_unidad_id: null,
      roles: [{ role_id: 0 }],
      jefe_unidad: [],
      optMensual: false,
      optRango: false,
      optTodo: true,

      form: {
        fecha_final: null,
        fecha_inicial: null
      }
    };
  },
  created() {
    this.getPromise();

    // this.user = this.$store.state.user;
    // this.user_pertenece_id = this.$store.state.user.pertenece_id;
    // this.user_unidad_id = this.$store.state.user.unidad_id;
    // let self = this;
    // this.rolesS();
    // this.unidades();
    // this.unidadReporte();
  },
  mounted() {
    $("body").resize();
  },
  filters: {
    upper: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.toUpperCase();
    }
  },
  computed: {
    altoMando() {
      return this.roles.find(
        x =>
          (x.rol_id === 1 && x.sistema_id === 6) ||
          (x.rol_id === 2 && x.sistema_id === 6)
      );
    }
  },
  methods: {
    notAfterToday(date) {
      return date > new Date(new Date().setHours(0, 0, 0, 0));
    },

    director() {
      if (this.roles.filter(x => x.role_id === 14 && x.sistema_id === 6) > 0) {
        return true;
      } else {
        return false;
      }
    },

    getPromise() {
      this.loading = true;
      Promise.all([this.rolesS(), this.unidades(), this.unidadReporte()])
        .then(() => {
          this.user = this.$store.state.user;
          this.user_pertenece_id = this.$store.state.user.pertenece_id;
          this.user_unidad_id = this.$store.state.user.unidad_id;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$toastr.error("Ocurrió un error: " + error, "Error");
        });
    },

    modalAltoMando() {
      self.styleObjectDash.display = "block";
      self.abrirModalDash = "modal fade in";
      self.modalDash = true;
      self.loading = false;
      this.consolidado = 1;
    },

    grises(dir) {
      return this.direc(dir) ? "" : "grises";
    },

    unidadPertenece(dir) {
      if (this.roles.find(x => x.role_id === 14 && x.sistema_id === 6)) {
        return true;
      } else {
        return this.direc(dir) ? true : false;
      }
    },

    deshabilitar(dir) {
      return this.direc(dir) ? true : false;
    },

    card(dir) {
      return this.direc(dir) ? "card-white" : "card-gray";
    },

    color(dir) {
      return this.direc(dir) ? "" : "gris";
    },

    direc(dir) {
      if (dir !== undefined) {
        if (this.roles.find(x => x.rol_id === 14 && x.sistema_id === 6)) {
          if (this.user_pertenece_id === dir.padre_id) {
            return true;
          } else {
            return false;
          }
        } else if (this.roles.find(x => x.rol_id === 4 && x.sistema_id === 6)) {
          for (let i = 0; i < this.jefe_unidad.length; i++) {
            const x = this.jefe_unidad[i];
            if (x.unidad_id === dir.id) {
              return true;
            }
          }
        } else if (this.roles.find(x => x.rol_id <= 3)) {
          return true;
        }
      }
    },

    unidadReporte() {
      self = this;
      self.$store.state.services.administracionexpedienteService
        .getUnidadReporte()
        .then(r => {
          this.direcciones = this.filtrarBotones(
            r.data,
            this.filtrarDirecciones
          );
        })
        .catch(r => {
          this.$toastr.error(
            "Ocurrio un problema al obtener los reportes: ",
            "Mensaje"
          );
        });
    },

    unidades() {
      self = this;
      self.$store.state.services.administracionexpedienteService
        .getUnidades()
        .then(r => {
          this.jefe_unidad = r.data.jefe_unidad;
          this.btnHidro = r.data.dgh;
          this.btnEner = r.data.dge;
          this.btnMin = r.data.dgm;
          this.btnSG = r.data.sg;
        })
        .catch(r => {
          this.$toastr.error(
            "Ocurrio un problema al obtener los reportes: ",
            "Mensaje"
          );
        });
    },

    filtrarBotones(datos, filtrar) {
      let guardar = [];
      filtrar.forEach(x => {
        datos.forEach(y => {
          if (y.abreviatura === x.abr) {
            guardar.push(y);
          }
        });
      });

      return guardar;
    },

    rolesS() {
      self = this;
      self.user_pertenece_id = this.$store.state.user.pertenece_id;
      self.$store.state.services.administracionexpedienteService
        .getRol()
        .then(r => {
          this.roles = r.data;
          if (r.data.length === 0) {
            this.roles = [
              {
                rol_id: 1,
                rol_nombre: "Adm",
                sistema_id: 6,
                sistema_nombre: "DASH"
              }
            ];
          }
        })
        .catch(r => {
          this.$toastr.error(
            "Ocurrio un problema al obtener los roles",
            "Mensaje"
          );
        });
    },

    cancel_showDash() {
      let self = this;
      self.styleObjectDash.display = "";
      self.abrirModalDash = "modal fade";
      self.modalDash = false;
      this.optTodo = true;
      this.optRango = false;
      this.optMensual = false;
    },

    cancel_showOpt() {
      let self = this;
      self.styleObjectOpt.display = "";
      self.abrirModalOpt = "modal fade";
      self.modalOpt = false;
      this.optTodo = true;
      this.optRango = false;
      this.optMensual = false;
    },

    view(dir, tipo, pertenece) {
      this.direccion = tipo;
      this.pertenece_id = pertenece;
      // this.user_pertenece_id = this.direc(dir) ? dir: this.user_pertenece_id
      if (this.deshabilitar(dir)) {
        this.send = dir;
        this.consolidado = 2;
        dir = dir.id;
        let self = this;
        self.loading = true;
        self.loading = false;

        self.styleObjectDash.display = "block";
        self.abrirModalDash = "modal fade in";
        self.modalDash = true;
        self.loading = false;
      } else {
        this.$toastr.error("No tienes acceso a estos reportes", "ERROR");
      }
    },

    viewOpt(id) {
      let self = this;
      self.loading = true;
      self.loading = false;

      //self.styleObjectOpt.display = "block";
      //self.abrirModalOpt = "modal fade in";
      //self.modalOpt = true;
      //self.loading = false;
      switch (id) {
        case 1:
          this.reporte = 1;
          this.validacionParametros(id);
          break;
        case 2:
          this.reporte = 2;
          this.validacionParametros(id);
          break;
        case 3:
          this.reporte = 3;
          this.validacionParametros(id);
          break;
        case 4:
          this.reporte = 4;
          this.validacionParametros(id);
          break;
        default:
          break;
      }
    },
    openOptionFilter(opt) {
      //metodo que muestra las opciones (todo, rango de fecha, mensual)
      switch (opt) {
        case 1:
          this.optTodo = true;
          this.optRango = false;
          this.optMensual = false;
          console.log("opcion 1");
          break;
        case 2:
          this.optTodo = false;
          this.optRango = true;
          this.optMensual = false;
          console.log("opcion 2");
          break;
        case 3:
          this.optTodo = false;
          this.optRango = false;
          this.optMensual = true;
          console.log("opcion 3");
          break;
        default:
          break;
      }
    },
    validacionParametros(reporte) {
      // valida los parametros de filtracion Todo, Rango o Mensual
      if (this.optRango) {
        console.log("Opcion rango");
        const dateA = new Date(this.form.fecha_inicial);
        const dateB = new Date(this.form.fecha_final);
        //conflictos con date-picker al obtener el día por eso se usa este metodo auxiliar
        let fecha1 = this.devovlerFechas(this.form.fecha_inicial);
        let fecha2 = this.devovlerFechas(this.form.fecha_final);
        //console.log(this.form);
        if (
          this.form.fecha_inicial === null ||
          this.form.fecha_final === null
        ) {
          this.$toastr.error("Debe indicar un rango de fecha", "error");
        } else if (dateA > dateB) {
          // do something if A is later than B
          this.$toastr.error(
            "La fecha limite debe ser mayor a la fecha inicial",
            "error"
          );
        } else if (dateA <= dateB) {
          this.$toastr.success("Procesando solicitud", "Rango de fecha");
          this.enrutamientos(reporte, 2, fecha1, fecha2); // filtro de rango
        }
        //limpiando variables
        this.form.fecha_inicial = null;
        this.form.fecha_final = null;
      } else if (this.optMensual) {
        console.log("Opcion mensual");
        const dateA = new Date(this.form.fecha_inicial);
        if (this.form.fecha_inicial === null) {
          this.$toastr.error("Debe indicar una fecha", "error");
        } else {
          console.log(dateA);
          this.$toastr.success("Procesando solicitud", "Fecha mensual");
          this.enrutamientos(
            reporte,
            3,
            dateA.getMonth() + 1,
            dateA.getFullYear()
          ); //filtro mensual
        }
        this.form.fecha_inicial = null;
        this.form.fecha_final = null;
      } else {
        this.$toastr.success("Procesando solicitud", "Todos los resultados");
        this.enrutamientos(reporte, 1, "nothing", "nothing"); // todos los datos
        this.form.fecha_inicial = null;
        this.form.fecha_final = null;
      }
    },

    /**
     * Enrutamientos segun reportes
     * 1. Grafica de expedientes Activos
     * 2. Reporte Expedientes Activos
     * 3. Reporte Expedientes Cerrados
     * 4. Reporte Expedientes Congelados
     */
    enrutamientos(reporte, optFiltro, dato1, dato2) {
      // dato 1 = fecha o mes Y dato 2 = fecha o año

      if (reporte === 1) {
        let data = this.send;
        if (data === 0) {
          data = null;
          let url =
            "dash_view_grafica/" +
            btoa("nothing") +
            "/" +
            btoa("nothing") +
            "/" +
            btoa(this.consolidado) +
            "/" +
            btoa(reporte) +
            "/" +
            btoa("Consolidados") +
            "/" +
            btoa(dato1) +
            "/" +
            btoa(dato2) +
            "/" +
            btoa(optFiltro);
          self.$router.push({ path: url });
        } else {
          let url =
            "dash_view_grafica/" +
            btoa(this.direccion) +
            "/" +
            btoa(data.id) +
            "/" +
            btoa(this.consolidado) +
            "/" +
            btoa(reporte) +
            "/" +
            btoa(data.abreviatura) +
            "/" +
            btoa(dato1) +
            "/" +
            btoa(dato2) +
            "/" +
            btoa(optFiltro);
          self.$router.push({ path: url });
        }

        this.optTodo = true;
        this.optRango = false;
        this.optMensual = false;
        //fin enrutamiento reporte === 1
      } else if (reporte === 2) {
        let data = this.send;
        let field = btoa(JSON.stringify(this.fieldsActivos));
        if (data === 0) {
          let url =
            "dash_view_datatable/" +
            btoa(this.reporte) +
            "/" +
            btoa("nothing") +
            "/" +
            field +
            "/" +
            btoa("nothing") +
            "/" +
            btoa(data) +
            "/" +
            btoa(this.consolidado) +
            "/" +
            btoa("Consolidados") +
            "/" +
            btoa(dato1) +
            "/" +
            btoa(dato2) +
            "/" +
            btoa(optFiltro);
          //console.log(url)
          self.$router.push({ path: url });
        } else {
          let url =
            "dash_view_datatable/" +
            btoa(this.reporte) +
            "/" +
            btoa(this.pertenece_id) +
            "/" +
            field +
            "/" +
            btoa(this.direccion) +
            "/" +
            btoa(data.id) +
            "/" +
            btoa(this.consolidado) +
            "/" +
            btoa(data.abreviatura) +
            "/" +
            btoa(dato1) +
            "/" +
            btoa(dato2) +
            "/" +
            btoa(optFiltro);
          //console.log(url)
          self.$router.push({ path: url });
        }
        this.optTodo = true;
        this.optRango = false;
        this.optMensual = false;
        //fin enrutamiento reporte === 2
      } else if (reporte === 3) {
        let data = this.send;
        let field = btoa(JSON.stringify(this.fieldsCerrados));
        if (data === 0) {
          let url =
            "dash_view_datatable/" +
            btoa(this.reporte) +
            "/" +
            btoa("nothing") +
            "/" +
            field +
            "/" +
            btoa("nothing") +
            "/" +
            btoa(data) +
            "/" +
            btoa(this.consolidado) +
            "/" +
            btoa("Consolidados") +
            "/" +
            btoa(dato1) +
            "/" +
            btoa(dato2) +
            "/" +
            btoa(optFiltro);
          //console.log(url)
          self.$router.push({ path: url });
        } else {
          let url =
            "dash_view_datatable/" +
            btoa(this.reporte) +
            "/" +
            btoa(this.pertenece_id) +
            "/" +
            field +
            "/" +
            btoa(this.direccion) +
            "/" +
            btoa(data.id) +
            "/" +
            btoa(this.consolidado) +
            "/" +
            btoa(data.abreviatura) +
            "/" +
            btoa(dato1) +
            "/" +
            btoa(dato2) +
            "/" +
            btoa(optFiltro);
          //console.log(url)
          self.$router.push({ path: url });
        }
        this.optTodo = true;
        this.optRango = false;
        this.optMensual = false;
        //fin enrutamiento reporte === 3
      } else if (reporte === 4) {
        let data = this.send;
        let field = btoa(JSON.stringify(this.fieldsCongelados));
        if (data === 0) {
          let url =
            "dash_view_datatable/" +
            btoa(this.reporte) +
            "/" +
            btoa("nothing") +
            "/" +
            field +
            "/" +
            btoa("nothing") +
            "/" +
            btoa(data) +
            "/" +
            btoa(this.consolidado) +
            "/" +
            btoa("Consolidados") +
            "/" +
            btoa(dato1) +
            "/" +
            btoa(dato2) +
            "/" +
            btoa(optFiltro);
          self.$router.push({ path: url });
        } else {
          let url =
            "dash_view_datatable/" +
            btoa(this.reporte) +
            "/" +
            btoa(this.pertenece_id) +
            "/" +
            field +
            "/" +
            btoa(this.direccion) +
            "/" +
            btoa(data.id) +
            "/" +
            btoa(this.consolidado) +
            "/" +
            btoa(data.abreviatura) +
            "/" +
            btoa(dato1) +
            "/" +
            btoa(dato2) +
            "/" +
            btoa(optFiltro);
          self.$router.push({ path: url });
        }
        this.optTodo = true;
        this.optRango = false;
        this.optMensual = false;
        //fin enrutamiento reporte === 4
      }
    },
    devovlerFechas(fecha) {
      let fecha_correcta = "";
      const data = new Date(fecha);
      let dataDia = String(fecha);
      let dia = dataDia.split(" ")[2];

      let mes = data.getMonth() + 1;

      let año = data.getFullYear();

      fecha_correcta = String(dia) + "-" + String(mes) + "-" + String(año);
      //console.log(fecha_correcta);

      return fecha_correcta;
      //console.log(datos[2]);
    }
  }
};
</script>

<style scoped>
.text {
  font-size: 1em;
  text-align: center;
}

.text-admin {
  font-size: 1.5em;
  text-align: center;
}

.card {
  margin-bottom: 20px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  width: 100%;
  border-radius: 5px;
}

.card-dir {
  padding: 20px;
  height: auto;
  background: white;
}

.card-dash {
  height: auto;
  padding: 20px;
}

.card-admin {
  height: auto;
  padding: 30px;
  background: white;
}

.card-gray {
  background: gray;
}

.card-white {
  background: white;
}

img {
  width: 30%;
  height: auto;
  padding: 2px 16px;
  padding-top: 10;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

img {
  border-radius: 5px 5px 0 0;
}

.container {
  padding: 2px 16px;
}

.gris {
  color: gainsboro;
}

.normal {
  color: black;
}

.grises {
  filter: grayscale(1);
  transition-property: filter;
  transition-duration: 5s;
}

#suba:hover {
  transform: scale(1.1);
  z-index: 100;
  background-color: #25bcff;
  font-weight: bold;
  color: white;
  box-shadow: rgba(60, 208, 228, 0.502) 0px 30px 60px -12px inset,
    rgba(0, 0, 0, 0.56) 0px 22px 70px 4px inset;
  border-radius: 15px;
  transition: transform 0.5s;
  cursor: pointer;
}

#suba span:hover {
  font-weight: bold;
  color: white;
}

/*
  Hide radio button (the round disc)
  we will use just the label to create pushbutton effect
*/
.stv-radio-button {
  display: none;
  margin: 10px;
}

/*
  Change the look'n'feel of labels (which are adjacent to radiobuttons).
  Add some margin, padding to label
*/
.stv-radio-button + label {
  display: inline-block;
  margin: -2px;
  padding: 4px 12px;
  background-color: #e7e7e7;
  border-color: #ddd;
  cursor: pointer;
}

.stv-radio-button + label:first-of-type {
  border-radius: 0.7em 0 0 0.7em;
}

.stv-radio-button + label:last-of-type {
  border-radius: 0 0.7em 0.7em 0;
}

/*
 Change background color for label next to checked radio button
 to make it look like highlighted button
*/
.stv-radio-button:checked + label {
  background-image: none;
  background-color: #216fb8;
  border: 2px solid rgba(0, 73, 133, 0.3);
  color: white;
  box-shadow: rgba(33, 105, 173, 0.502) 0px 30px 60px -12px inset,
    rgba(0, 0, 0, 0.56) 0px 22px 70px 4px inset;
}
</style>
