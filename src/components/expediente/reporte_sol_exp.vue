<template>
  <div class="content-wrapper" v-loading="loading">
    <v-app>
      <section class="content">
        <div class="row ">
          <div class="col">
            <div class="box">
              <div>
                <div
                  class="panel-body table-responsive p-0 m-0"
                  v-loading="loading"
                >
                  <template>
                    <div class="col col-lg-12 col-sm-12 m-0 p-0">
                      <div class="row">
                        <div
                          class="col col-md-2 col-lg-2"
                          style="text-align: right"
                        >
                          <br />
                          <div class="row"></div>
                          <div>
                            <!-- <b-button @click="enviarReporte()" class="btn-sm datos m-0 p-0"
                                                            variant="primary">Enviar Reporte</b-button> -->
                            <b-button
                              @click="exportXlsx()"
                              class="btn-sm datos m-0 p-0"
                              variant="success"
                              >Imprimir Reporte XLSX</b-button
                            >
                            <b-button
                              @click="downloadPdfReport()"
                              class="btn-sm datos m-0 p-0"
                              variant="danger"
                              >Imprimir Reporte PDF</b-button
                            >
                          </div>
                        </div>

                        <div class="col col-md-8 col-lg-8">
                          <h2 class="text-center">
                            <strong
                              >Sistema de Control de Expedientes Web</strong
                            >
                          </h2>
                          <h3 class="text-center">
                            <strong>Reporte solicitudes - expedientes</strong>
                          </h3>
                          <!-- <h4 class="text-center">
                  <strong>{{ nombre_tipo }}</strong>
                </h4> -->
                        </div>

                        <div
                          class="col col-md-2 col-lg-2"
                          style="text-align: left"
                        >
                          <div class="row">
                            <b-button
                              @click="regresa_dash()"
                              class="btn-sm datos m-0 p-0"
                              variant="success"
                            >
                              <i class="fa fa-arrow-circle-left"></i>
                              <span>Regresar</span>
                            </b-button>
                          </div>

                          <div class="row m-0 p-0">
                            <h5 class="datos m-0 p-0">
                              <strong> Fecha: {{ fecha }} {{ hora }}</strong>
                            </h5>
                            <h5 class="datos m-0 p-0">
                              <strong>Usuario: {{ nombre }}</strong>
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div
                        class="row"
                        style="display: flex; justify-content: center; align-items: center;"
                      >
                        <div class="col-md-4">
                          <h5>Fecha de inicio</h5>
                          <input type="date" v-model="fecha_inicio" />
                        </div>
                        <div class="col-md-4">
                          <h5>Fecha de final</h5>
                          <input type="date" v-model="fecha_fin" />
                        </div>
                        <div class="col-md-2">
                          <button
                            class="btn btn-success"
                            @click="getSolicitudesExpedientes()"
                          >
                            <strong>Buscar</strong>
                          </button>
                        </div>
                        <div class="col-md-2">
                          <button
                            class="btn btn-danger"
                            @click="
                              fecha_inicio = '';
                              fecha_fin = '';
                              getSolicitudesExpedientes();
                            "
                          >
                            <strong>Limpiar</strong>
                          </button>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-12">
                          <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Buscar"
                            single-line
                            hide-details
                          ></v-text-field>
                          <hr />
                        </div>
                      </div>

                      <v-data-table
                        :headers="headers"
                        :items="tramites"
                        :loading="loading"
                        :search="search"
                        class="elevation-1 "
                        style="z-index: 100;"
                        :items-per-page="10"
                        :footer-props="{
                          itemsPerPageOptions: [10, 20, 30, -1],
                        }"
                      >
                      </v-data-table>
                      <div class="row">
                        <div md="12" class="col my-1">
                          <label v-if="totalRows > 0"
                            >Total: {{ totalRows }} registros</label
                          >
                          <div class="text-center">
                            <label v-if="totalRows === 0"
                              >No hay registros que mostrar</label
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </v-app>
  </div>

  <!-- <rechazado v-else></rechazado> -->
</template>
<script>
import jsPDF from "jspdf";
import "jspdf-autotable";
import { utils, writeFile } from "xlsx";

import Rechazado from "../shared/Rechazado";

export default {
  components: { Rechazado },
  data: () => ({
    loading: false,
    headers: [
      {
        value: "solicitud_interna",
        text: "No. Solicitud",
        sortable: false,
      },
      {
        value: "numero_expediente_externo",
        text: "No. Expediente",
        sortable: false,
        align: "center",
      },
      { text: "Fecha Ingreso", value: "fecha_ingreso", sortable: false },
      { text: "Usuario asignado", value: "usuario_asignado", sortable: false },
    ],

    search: "",
    tramites: [],
    roles: [],
    total: 0,
    mostrarDialog: false,
    expedientesAsignados: {},
    panel: [],
    fecha_inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    menu_inicio: false,
    fecha_fin: new Date().toISOString().split("T")[0],
    menu_fin: false,
  }),

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
    },
  },

  // write a watch to listen where panel changes, reset the search
  watch: {
    panel() {
      this.search = "";
    },
  },
  created() {
    this.rolesS();
    this.getSolicitudesExpedientes();
  },

  methods: {
    async rolesS() {
      try {
        this.loading = true;
        // let r = await this.$store.state.services.administracionexpedienteService.getRol();
        // console.log("que es esto", r);
        // if (r.data.length === 0) {
        //   this.roles = [
        //     { rol_id: 1, rol_nombre: "Adm", sistema_nombre: "DASH" },
        //   ];
        // } else {
        //   this.roles = r.data.filter(
        //     (x) => x.rol_nombre == "Viceministro" || x.rol_nombre == "Ministro" || x.rol_nombre == "Administrador"
        //   );
        // }
        // console.log("roles", this.roles);
        this.loading = false;
      } catch (error) {
        this.$toastr.error(
          "Ocurrio un problema al obtener los roles",
          "Mensaje"
        );
      }
    },
    async getSolicitudesExpedientes() {
      try {
        this.loading = true;
        const r = await this.$store.state.services.reportesService.solicitudesExternasExpediente(
          { fecha_inicio: this.fecha_inicio, fecha_fin: this.fecha_fin }
        );
        if (r.status === 200) {
          this.tramites = r.data.data;
          console.log("getSolicitud esExpedientes", r.data.data);
        } else {
          this.tramites = [];
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    async downloadPdfReport() {
      const doc = new jsPDF({ orientation: "landscape", format: [500, 500] });
      const title =
        "REPORTE DE EXPEDIENTES POR TRAMITE " + new Date().toLocaleDateString();

      //doc.setFontSize(18);
      doc.text(title, 15, 15);

      // Set the table headers
      const headers = ["Id", "Nombre", "Cantidad"];

      // Extract the data from the selectedItems object
      const data = this.tramites.map((x) => [x.id, x.nombre, x.count]);

      // Generate the table
      doc.autoTable({
        head: [headers],
        body: data,
        startY: 20,
      });

      const today = new Date();
      const dateString = today
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "_"); // Replace dashes with underscores

      // Save the PDF file
      doc.save(`reporte_exp_tramite_${dateString}.pdf`);
    },
    async exportXlsx() {
      let updatedData = [];

      updatedData = this.tramites.map((item) => {
        const updatedItem = {
          //   id: item.id,
          "No. Solicitud": item.solicitud_interna,
          "No. Expediente": item.numero_expediente_externo,
          "Fecha": item.fecha_ingreso,
          "Usuario asignado": item.usuario_asignado,
        };
        return updatedItem;
      });
      1;
      // Create a new workbook
      const workbook = utils.book_new();

      // Convert the object data to a worksheet
      const worksheet = utils.json_to_sheet(updatedData);

      // Set the header styles
      const headerStyle = {
        font: { bold: true, sz: 14 },
      };

      // Apply styles to the header row
      Object.keys(worksheet).forEach((cell) => {
        if (cell.startsWith("A1:")) {
          worksheet[cell].s = headerStyle;
        }
      });

      // Add the worksheet to the workbook
      utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // Generate the Excel file
      const today = new Date();
      const dateString = today
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "_"); // Replace dashes with underscores

      const excelBuffer = writeFile(
        workbook,
        `reporte_sol_exp_${dateString}.xlsx`,
        { bookType: "xlsx", type: "buffer" }
      );
    },

    regresa_dash() {
      console.log("retorno");
      let url = "/dash_default";
      self.$router.push({ path: url });
    },
  },
};
</script>
