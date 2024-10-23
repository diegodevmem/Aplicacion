<template>
  <v-app>
  <div class="content-wrapper">
    <div v-if="roles.length > 0">
      <section class="content">
        <div class="row">
          <div class="row">
            <div class="col-sm-12 col-md-12 col-lg-12">
              <div v-if="estado === 0" class="row" style="margin: 10px">
                <div class="col-md-12">
                  <div class="card text-center">
                    <div
                      class="card-title"
                      style="padding-top: 10px; padding-bottom: 20px"
                    >
                      <h3 class="text-center">
                        Reportes de Evaluación del Desempeño
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div class="box box-primary" id="p0">
                <div class="box-body">
                  <br />
                  <div v-if="estado === 0" class="row">
                    <div class="col-md-12">
                      <div class="col-md-12">
                        <div class="row" style="margin: 0px 10px 0px 10px">
                          <div
                            v-for="(x, i) in reportes1"
                            :key="i"
                            class="col-md-4 col-sm-12"
                          >
                            <div
                              class="card text-center"
                              style="cursor: pointer"
                              @click="verReporte(x)"
                            >
                              <div class="card-body">
                                <img
                                  class="h-5 px-1 report"
                                  :src="require('../../assets/tabla.png')"
                                  alt="grafica"
                                /><br />
                                <span class="text-admin">{{ x.text }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <br />
                        <!-- <div class="row" style="margin: 0px 10px 10px 10px">
                          <div
                            v-for="(x, i) in reportes2"
                            :key="i"
                            class="col-md-4 col-sm-12"
                          >
                            <div
                              class="card text-center"
                              style="cursor: pointer"
                              @click="verReporte(x)"
                            >
                              <div class="card-body">
                                <img
                                  class="h-5 px-1 report"
                                  :src="require('../../assets/tabla.png')"
                                  alt="grafica"
                                /><br />
                                <span class="text-admin">{{ x.text }}</span>
                              </div>
                            </div>
                          </div>
                        </div> -->
                      </div>
                    </div>
                  </div>
                  <div v-if="estado !== 0">
                    <!-- ENCABEZADO -->
                    <div class="card">
                      <div class="card-title">
                        <div class="row">
                          <!-- IMAGEN GOBIERNO GUATEMALA -->
                          <div class="col-md-4 text-center">
                            <br />
                            <br />
                            <div>
                              <img
                                :src="require('../../assets/LogoLogin2.png')"
                                width="60%"
                              />
                            </div>
                          </div>

                          <!-- TITULOS -->
                          <div class="col-md-4">
                            <h2 class="text-center">
                              {{ titulo }}
                            </h2>
                          </div>

                          <!-- FECHA CODIGO -->
                          <div class="col-md-4">
                            <div class="row mx-3 px-3 text-center">
                              <br /><br />
                              <h4 class="datos m-0 p-0">Fecha: {{ fecha }}</h4>
                              <h4 class="datos m-0 p-0">Hora: {{ hora }}</h4>
                            </div>
                          </div>
                        </div>
                        <br />
                        <div v-if="estado === 2" class="row">
                          <div class="col-md-1"></div>
                          <div class="col-md-10">
                            <!-- <multiselect
                              style="width: auto"
                              v-model="select"
                              :options="options"
                              placeholder="Seleccione uno por favor"
                              :searchable="true"
                              :allow-empty="true"
                              :preselect-first="false"
                              :show-labels="false"
                              :show-no-result="true"
                              label="unidadpertenece"
                              track-by="id"
                              @input="busquedaDireccionGeneral()"
                            >
                              <span slot="noResult"
                                >No se encontró información</span
                              >
                            </multiselect> -->
                            <v-autocomplete
                              v-model="select"
                              :items="options"
                              dense
                              filled
                              label="Dirección"
                              item-text="unidadpertenece"
                              @change="busquedaDireccionGeneral()"
                            ></v-autocomplete>
                          </div>
                          <div class="col-md-1"></div>
                        </div>
                        <div v-if="estado === 3" class="row">
                          <div class="col-md-1"></div>
                          <div class="col-md-10">
                            <multiselect
                              style="width: auto"
                              v-model="select"
                              :options="options"
                              placeholder="Seleccione uno por favor"
                              :searchable="true"
                              :allow-empty="true"
                              :preselect-first="false"
                              :show-labels="false"
                              :show-no-result="true"
                              label="nombreunidad"
                              track-by="id"
                              @input="busquedaDepartamentoGeneral()"
                            >
                              <span slot="noResult"
                                >No se encontró información</span
                              >
                            </multiselect>
                          </div>
                          <div class="col-md-1"></div>
                        </div>
                        <br />
                        <div class="panel-body table-responsive">
                          <report_data_table
                            :titulos="titulos"
                            :items="items"
                            :opcion="estado"
                          ></report_data_table>

                          <!-- <div class="col-md-6">
                              <div class="container">
                                <Barra
                                  :chart-data="datacollection"
                                  :options="options"
                                  :height="400"
                                ></Barra>
                              </div>
                            </div> -->
                        </div>
                      </div>
                    </div>

                    <br />

                    <!-- BOTONES -->
                    <div class="card">
                      <div class="card-title">
                        <div class="row" style="padding: 20px 0px 20px 0px">
                          <div class="col-md-12 text-center">
                            <button class="btn btn-info" @click="regresar()">
                              Regresar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <rechazado v-else></rechazado>
  </div>
  </v-app>
</template>

<script>
import report_data_table from "./data_table.vue";
import Rechazado from "../shared/Rechazado.vue";
import Barra from "./grafico.js";
export default {
  components: {
    report_data_table,
    Rechazado,
    Barra,
  },
  data() {
    return {
      select: null,
      options: [],

      items: null,
      titulos: null,
      estado: 0,
      titulo: "",
      reportes1: [
        {
          id: 1,
          text: "Reporte General de todos los empleados del Ministerio de Energía y Minas",
        },
        { id: 2, text: "Reporte por Dirección General o Unidad de Apoyo" },
        { id: 3, text: "Reporte por Departamento" },
      ],
      reportes2: [
        {
          id: 4,
          text: "Reporte de Directores Generales y Jefes de Unidades de Apoyo",
        },
        {
          id: 5,
          text: "Reporte de Jefes de Departamento de las diferentes Direcciones Generales o Unidades de Apoyo",
        },
      ],
      items: [],
      titulos: [
        { key: "evaluacion_id", label: "Evaluacion No.", sortable: true },
        { key: "dpi", label: "DPI", sortable: true },
        { key: "nombre", label: "Nombre", sortable: true },
        // { key: "apellido", label: "Apellido", sortable: true },
        { key: "direccion", label: "Departamento", sortable: true },
        { key: "unidadpertenece", label: "Direccion", sortable: true },
        { key: "fechaevaluacion", label: "Fecha evaluacion", sortable: true },
        {
          key: "calificacion_total",
          label: "Calificacion total",
          sortable: true,
        },
        // { key: "factores", label: "Calificacion Factores", sortable: true },
        // { key: "opcion", label: "Acciones" },
      ],

      roles: [],

      // chartdata: {
      //   labels: ["January", "February"],
      //   datasets: [
      //     {
      //       label: "Data One",
      //       backgroundColor: "#f87979",
      //       data: [40, 20],
      //     },
      //   ],
      // },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        position: "relative",
      },

      datacollection: null,
    };
  },
  computed: {
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
  },
  async created() {
    await this.rolesS();
    this.fillData();
  },
  methods: {
    fillData() {
      this.datacollection = {
        labels: [
          "COMPETENCIAS ACTITUDINALES",
          "COMPROMISO INSTITUCIONAL",
          "HABILIDADES Y CONOCIMIENTOS",
          "RESPONSABILIDAD Y PRODUCTIVIDAD EN EL TRABAJO",
        ],
        datasets: [
          {
            label: "Promedio de evaluaciones ordenados por factor",
            backgroundColor: "#f87979",
            data: [50, 100, 50, 30],
          },
          // {
          //   label: "Data One",
          //   backgroundColor: "#f87979",
          //   data: [this.getRandomInt(), this.getRandomInt()],
          // },
        ],
      };
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },

    async rolesS() {
      // self = this;
      // self.user_pertenece_id = this.$store.state.user.pertenece_id;

      try {
        this.loading = true;
        let r =
          await this.$store.state.services.administracionexpedienteService.getRol();

        // console.log(r);
        if (r.data.length === 0) {
          this.roles = [
            { rol_id: 1, rol_nombre: "Adm", sistema_nombre: "EXP" },
          ];
        } else {
          this.roles = r.data.filter((x) => x.rol_id === 15);
        }
        // console.log(this.roles);
        this.loading = false;
      } catch (error) {
        this.$toastr.error(
          "Ocurrio un problema al obtener los roles",
          "Mensaje"
        );
      }
    },

    async verReporte(item) {
      console.log("item");
      console.log(item);
      this.titulo = item.text;
      switch (item.id) {
        case 1:
          await this.listadoEvaluacion();
          break;
        case 2:
          await this.direccionGeneral();
          break;
        case 3:
          this.departamentoGeneral();
          break;
      }
    },

    async listadoEvaluacion() {
      try {
        let r =
          await this.$store.state.services.reporteListadoService.listadoEvaluacion();
        this.estado = 1;

        this.items = r.data.filter(
          (x) => (
            (x[x.factores[0].descripcion.replace(" ", "_").replace('"', "")] =
              x.factores[0].nota),
            (x[x.factores[1].descripcion.replace(" ", "_").replace('"', "")] =
              x.factores[1].nota),
            (x[x.factores[2].descripcion.replace(" ", "_").replace('"', "")] =
              x.factores[2].nota),
            (x[x.factores[3].descripcion.replace(" ", "_").replace('"', "")] =
              x.factores[3].nota),
            delete x["factores"]
          )
        );
      } catch (error) {
        this.$toastr.error(
          "HA OCURRIDO UN ERROR AL OBTENER LOS DATOS DEL REPORTE"
        );
      }
    },

    async direccionGeneral() {
      try {
        let r =
          await this.$store.state.services.reporteListadoService.direccionGeneral();
        console.log("r.data direccionGeneral");
        console.log(r.data);
        this.estado = 2;
        this.options = r.data;
      } catch (error) {
        this.$toastr.error(
          "HA OCURRIDO UN ERROR AL OBTENER LOS DATOS DEL REPORTE: " + error,
          "ERROOR"
        );
      }
    },

    async busquedaDireccionGeneral() {
      console.log(this.select);
      this.estado = 2;
      try {
        let r =
          await this.$store.state.services.reporteListadoService.busquedaDireccionGeneral(
            this.select
          );
        console.log("r.data busquedaDireccionGeneral");
        console.log(r.data);
        this.items = r.data;
      } catch (error) {
        this.$toastr.error(
          "HA OCURRIDO UN ERROR AL OBTENER LOS DATOS DEL REPORTE: " + error,
          "ERROOR"
        );
      }
    },

    async departamentoGeneral() {
      try {
        let r =
          await this.$store.state.services.reporteListadoService.departamentoGeneral();
        console.log("r.data departamentoGeneral");
        console.log(r.data);
        this.estado = 3;
        this.options = r.data;
      } catch (error) {
        this.$toastr.error(
          "HA OCURRIDO UN ERROR AL OBTENER LOS DATOS DEL REPORTE: " + error,
          "ERROOR"
        );
      }
    },

    async busquedaDepartamentoGeneral() {
      try {
        let r =
          await this.$store.state.services.reporteListadoService.busquedaDepartamentoGeneral(
            this.select.nombreunidad
          );
        console.log("r.data busquedaDepartamentoGeneral");
        console.log(r.data);
        this.estado = 3;
        this.items = r.data;
      } catch (error) {
        this.$toastr.error(
          "HA OCURRIDO UN ERROR AL OBTENER LOS DATOS DEL REPORTE: " + error,
          "ERROOR"
        );
      }
    },

    async regresar() {
      this.estado = 0;
      this.options = [];
      this.select = null;
      this.items = [];
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../dist/css/desing_profile/diseno.css";
.report {
  width: 30%;
  height: auto;
  padding: 2px 16px;
  padding-top: 10;
}

.text-admin {
  font-size: 1.5em;
  text-align: center;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.2);
  width: auto;
}
.card-body-title {
  height: auto;
  justify-content: center;
  padding: 2.5%;
}

.card-body {
  height: auto;
  justify-content: center;
  padding: 10%;
}
</style>
