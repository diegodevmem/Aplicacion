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
                            <strong>Reporte de solicitudes</strong>
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
                      <div class="row">
                        <div class="col-md-12">
                          <hr />
                        </div>
                      </div>
                      <v-card-title>
                        <h2>Total de solicitudes: {{ total }}</h2>
                      </v-card-title>
                      <v-data-table
                        :headers="headers"
                        :items="solicitudes"
                        :loading="loading"
                        class="elevation-1 "
                        style="z-index: 100;"
                        :items-per-page="5"
                        :footer-props="{ itemsPerPageOptions: [5, 10, -1] }"
                      >
                        <template v-slot:item.usuarios="{ item }">
                          <div
                            class="text-center"
                            v-if="item.hasOwnProperty('estado_id')"
                          >
                            <button
                              @click="mostrarModalUsuarios(item)"
                              type="button"
                              class="btn btn-primary btn-sm"
                              style="color: white !important;"
                            >
                              <i class="fa fa-eye"></i> Ver usuarios asignados
                            </button>
                            <!-- <b-button
                              @click="mostrarModalUsuarios(item)"
                              class="btn-sm datos m-0 p-0"
                              variant="primary"
                              >{{ "Ver usuarios asignados" }}</b-button
                            > -->
                          </div>
                        </template>
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
                      <v-dialog
                        max-width="60%"
                        max-height="34rem"
                        v-model="mostrarDialog"
                      >
                        <v-card class="p-4" height="auto" v-if="mostrarDialog">
                          <div class="d-flex align-items-center ">
                            <v-card-title
                              class="mr-auto ml-auto mt-4 p-2 text-center"
                            >
                              <span class="text-h5 text-center"
                                >Usuarios asignados a solicitudes en estado:
                                <span
                                  ><strong>
                                    {{ infoUsuariosAsignados.estado }}</strong
                                  ></span
                                >
                              </span>
                            </v-card-title>
                            <b-button
                              @click="exportXlsxUsuariosAsignador()"
                              class="btn-sm datos m-0 p-0 mt-3 mb-3 mr-1 "
                              style="height: 2.3rem;"
                              variant="success"
                              >Imprimir Reporte XLSX</b-button
                            >
                            <v-btn
                              small
                              class="btn bg-red btn-circle btn-sm pull-right mr-2 mt-2"
                              @click="mostrarDialog = false"
                            >
                              <v-icon>cancel</v-icon>
                            </v-btn>
                          </div>

                          <v-card-text class="text-center">
                            <v-expansion-panels accordion v-model="panel">
                              <v-expansion-panel
                                v-for="(item,
                                i) in infoUsuariosAsignados.usuarios"
                                :key="i + item.nombre"
                              >
                                <v-expansion-panel-header
                                  >{{ item.nombre }} -
                                  <span
                                    style="margin-left: 10px; font-weight: bold;"
                                    >{{ item.cantidad }} solicitudes</span
                                  ></v-expansion-panel-header
                                >
                                <v-expansion-panel-content>
                                  <h4>Expedientes asignados</h4>
                                  <v-text-field
                                    v-model="search"
                                    append-icon="mdi-magnify"
                                    label="Buscar"
                                    single-line
                                    hide-details
                                  ></v-text-field>
                                  <v-data-table
                                    :headers="asignadosHeaders"
                                    :items="item.asignados"
                                    :search="search"
                                    :items-per-page="5"
                                    class="elevation-1"
                                  ></v-data-table>
                                </v-expansion-panel-content>
                              </v-expansion-panel>
                            </v-expansion-panels>
                          </v-card-text>

                          <div class="mt-4"></div>
                        </v-card>
                      </v-dialog>
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
      { value: "direccion", text: "Dirección", sortable: false },
      { value: "desc", text: "Tipo de solicitud", sortable: false },
      { value: "cantidad", text: "Cantidad", sortable: false, align: "center" },
      { value: "usuarios", text: "Usuarios", sortable: false, align: "center" },
    ],
    asignadosHeaders: [
      { text: "No. Solicitud", value: "numero_solicitud" },
      { text: "Tipo Trámite", value: "tipo_tramite" },
      { text: "Fecha Ingreso", value: "fecha_ingreso" },
      { text: "Fecha Actualizacion", value: "fecha_actualizacion" },
    ],
    search: "",
    solicitudes: [],
    roles: [],
    total: 0,
    mostrarDialog: false,
    infoUsuariosAsignados: {},
    panel: [],
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
    this.getSolicitudes();
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
    async getSolicitudes() {
      console.log("getSolicitudes");
      try {
        this.loading = true;
        const r = await this.$store.state.services.reporteSolicitudesService.solicitudes();
        if (r.status === 200) {
          let solicitudes = [];
          r.data.data.forEach((sol) => {
            let direccion = [
              {
                direccion: sol.abreviatura,
                direccion_id: sol.direccion_id,
                desc: "En revisión de documentos",
                cantidad: sol.revision.cantidad,
                estado_id: sol.revision.estado_id,
              },
              {
                direccion: sol.abreviatura,
                direccion_id: sol.direccion_id,
                desc: "Aceptadas",
                cantidad: sol.aceptada.cantidad,
                estado_id: sol.aceptada.estado_id,
              },
              {
                direccion: sol.abreviatura,
                direccion_id: sol.direccion_id,
                desc: "Requisitos pendientes",
                cantidad: sol.pendientes.cantidad,
                estado_id: sol.pendientes.estado_id,
              },
              {
                direccion: sol.abreviatura,
                desc: "Rechazadas ",
                cantidad: sol.rechazada.cantidad,
                direccion_id: sol.direccion_id,
                estado_id: sol.rechazada.estado_id,
              },
              {
                direccion: sol.abreviatura,
                desc: "Total",
                cantidad:
                  sol.revision.cantidad +
                  sol.aceptada.cantidad +
                  sol.pendientes.cantidad +
                  sol.rechazada.cantidad,
              },
            ];
            console.log("direccion", direccion);
            solicitudes = solicitudes.concat(direccion);
            this.total +=
              sol.revision.cantidad +
              sol.aceptada.cantidad +
              sol.pendientes.cantidad +
              sol.rechazada.cantidad;
          });
          this.solicitudes = solicitudes;
        } else {
          this.solicitudes = [];
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
        "REPORTE DE SOLICITUDES EXTERNAS " + new Date().toLocaleDateString();

      //doc.setFontSize(18);
      doc.text(title, 15, 15);

      // Set the table headers
      const headers = ["Dirección", "Descripcion", "Cantidad"];

      // Extract the data from the selectedItems object
      const data = this.solicitudes.map((x) => [
        x.direccion,
        x.desc,
        x.cantidad,
      ]);

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
      doc.save(`reporte_sol_ext_${dateString}.pdf`);
    },
    async exportXlsx() {
      let updatedData = [];

      updatedData = this.solicitudes.map((item) => {
        const updatedItem = {
          direccion: item.direccion,
          desc: item.desc,
          cantidad: item.cantidad,
        };
        return updatedItem;
      });

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
        `reporte_solicitudes_ext_${dateString}.xlsx`,
        { bookType: "xlsx", type: "buffer" }
      );
    },

    async exportXlsxUsuariosAsignador(){
      // this.infoUsuariosAsignados.usuarios
      console.log("infoUsuariosAsignados", this.infoUsuariosAsignados);
      // let updatedData = [];
      let books = this.infoUsuariosAsignados.usuarios.map((item) => {
        const updatedItem = {
          nombre: item.nombre,
          data: item.asignados
        };
        return updatedItem;
      });

      // Create a new workbook
      const workbook = utils.book_new();


      books.map(item => {
        const worksheet = utils.json_to_sheet(item.data);
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
        utils.book_append_sheet(workbook, worksheet, item.nombre.slice(0, 30));
      });

      // Generate the Excel file
      const today = new Date();
      const dateString = today
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "_"); // Replace dashes with underscores

      const excelBuffer = writeFile(
        workbook,
        `reporte_solicitudes_usuarios_ext_${dateString}.xlsx`,
        { bookType: "xlsx", type: "buffer" }
      );
    },
    regresa_dash() {
      console.log("retorno");
      let url = "/dash_default";
      self.$router.push({ path: url });
    },
    async mostrarModalUsuarios(item) {
      console.log("DIALOG ITEM", item);
      this.infoUsuariosAsignados = item;
      try {
        this.loading = true;
        const r = await this.$store.state.services.reporteSolicitudesService.solicitudUsuario(
          item.estado_id,
          item.direccion_id
        );
        if (r.status === 200) {
          console.log("RESULT", r.data);
          if (r.data.data.length == 0) {
            this.loading = false;
            return this.$toastr.error(
              "No hay usuarios asignados a esta solicitud",
              "Mensaje"
            );
          }
          this.mostrarDialog = true;
          this.infoUsuariosAsignados.usuarios = r.data.data;
          this.infoUsuariosAsignados.estado = r.data.data[0].estado;

          // this.infoUsuariosAsignados.direccion = r.data.data[0].direccion
        } else {
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
  },
};
</script>
