<template>
  <div>
    <div class="loading-overlay" v-if="isGeneratingReport === true">
      <div
        class=" flex-column d-flex justify-content-center align-items-center"
      >
        <div class="overlay-text  " style="color: rgb(24, 121, 185);">
          <span>
            Generando reporte, por favor espere...
          </span>
        </div>
        <div class="overlay-loader ">
          <!-- <v-progress-circular model-value="20"
      color="rgb(24, 121, 185)"
      indeterminate  :size="48" :width="6"
            ></v-progress-circular> -->
        </div>
      </div>
    </div>
    <div class="loading-overlay" v-if="loading">
      <div
        class=" flex-column d-flex justify-content-center align-items-center"
      >
        <div class="overlay-loader ">
          <v-progress-circular model-value="18"
      color="rgb(24, 121, 185)"
      indeterminate  :size="44" :width="5"
            ></v-progress-circular>
        </div>
      </div>
    </div>
    <v-app>
      <!-- <v-loading
      v-if="loading"
      :absolute="true"
      :background="true"
      color="primary"
    >
    </v-loading> -->

      <div>
        <div class="content-wrapper">
          <div class="p-10" v-if="roles.length > 0">
            <div
              class="v-banner text-center v-sheet theme--light primary"
              style="color: white; letter-spacing: 2px; font-weight: bold; font-size: 1.3rem; border-top-left-radius: 10px; border-top-right-radius: 10px;"
            >
              <div class="v-banner__wrapper">
                <div class="v-banner__content">
                  <div class="v-banner__text">
                    Reporte de Reasignaciones
                  </div>
                </div>
              </div>
            </div>
            <v-container>
              <v-divider></v-divider>
              <v-card-title>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
                <button
                  type="button"
                  @click="downloadPdfReport"
                  v-tooltip.right="'Descargar reporte en PDF'"
                  class="m-2 v-btn v-btn--is-elevated v-btn--fab v-btn--has-bg v-btn--round theme--light v-size--small"
                  style="background-color: rgb(255, 255, 255); border-color: rgb(255, 255, 255);"
                >
                  <span class="v-btn__content"
                    ><i
                      aria-hidden="true"
                      class="v-icon notranslate material-icons theme--light"
                      >picture_as_pdf</i
                    ></span
                  >
                </button>
                <button
                  type="button"
                  @click="downloadExcelReport"
                  v-tooltip.right="'Descargar reporte XLSX'"
                  class="m-2 v-btn v-btn--is-elevated v-btn--fab v-btn--has-bg v-btn--round theme--light v-size--small"
                  title=""
                  style="background-color: rgb(255, 255, 255); border-color: rgb(255, 255, 255);"
                >
                  <span class="v-btn__content"
                    ><i
                      aria-hidden="true"
                      class="v-icon notranslate material-icons theme--light"
                      >table_chart</i
                    ></span
                  >
                </button>
              </v-card-title>

              <v-data-table
                v-show="!isGeneratingReport"
                :headers="headers"
                :items="expedientes"
                :loading="loading"
                class="elevation-1"
                item-selectable="selectable"
                :search="search"
              >
                <template v-slot:item.notificacion_electronica="{ item }">
                  <strong>
                    <p style="text-align: center; justify-content: center;">
                      {{ item.notificacion_electronica === true ? "Si" : "No" }}
                    </p>
                  </strong>
                </template>
                <!-- <template v-slot:item.congelado="{ item }">
                                <td>
                                    <span :class="getStateTagClass(item.congelado)">
                                        {{ item.congelado ? "Congelado" : "Activo" }}
                                    </span>
                                </td>
                </template> -->
              </v-data-table>
            </v-container>
          </div>
          <VistaRestriccion v-if="roles.length == 0" />
        </div>
      </div>
    </v-app>
  </div>
</template>

<script>
import jsPDF from "jspdf";
import { utils, writeFile } from "xlsx";
import VistaRestriccion from "../shared/Rechazado";
export default {
  components: {
    VistaRestriccion
  },
  data: () => ({
    headers: [
      {
        value: "nombre_expediente",
        text: "Nombre del Expediente",
        sortable: true
      },
      {
        value: "numero_expediente",
        text: "Número de Expediente",
        sortable: true
      },
      { value: "usuario_anterio", text: "Usuario Anterior", sortable: true },
      { value: "usuario_nuevo", text: "Usuario Nuevo", sortable: true },

      {
        value: "usuario_reasigno",
        text: "Usuario que Reasignó",
        sortable: true
      },

      {
        value: "fecha_reasignacion",
        text: "Fecha de Reasignacion",
        sortable: true
      },
      { value: "razon", text: "Razón de Reasignación", sortable: true },
      {
        value: "notificacion_electronica",
        text: "Notificación Electrónica"
      }
    ],
    search: "",
    loading: false,
    expedientes: [],
    allExpedientes: [],
    expedientesReporte: [],
    isGeneratingReport: false,
    roles: ["default"],
    
  }),
  async created() {
    await this.getUserRoles();
    await this.getReassignations();

  },
  watch: {
    search(val) {
      console.log(val);
      if (val) {
        this.expedientes = this.allExpedientes.filter(
          item =>
            (item.exp_num && item.exp_num.includes(val)) ||
            (item.codigo_barra && item.codigo_barra.includes(val)) ||
            (item.u_nombre && item.u_nombre.includes(val)) ||
            (item.notificacion_electronica &&
              item.notificacion_electronica.toString().includes(val)) ||
            (item.nombre_expediente &&
              item.nombre_expediente
                .toLowerCase()
                .includes(val.toLowerCase())) ||
            (item.ubicacion && item.ubicacion.includes(val))
        );
      } else {
        this.expedientes = this.allExpedientes;
      }
    }
  },

  methods: {
    async downloadPdfReport() {
      this.isGeneratingReport = true;
      console.log(this.isGeneratingReport);
      try {
        await setTimeout(() => {
          this.generatePdfReport();
        }, 200);
      } catch (error) {
        this.$toastr.error(
          "No se ha podido generar el reporte",
          "Ha ocurrido un error"
        );
      } finally {
        setTimeout(() => {
          this.isGeneratingReport = false;
          console.log(this.isGeneratingReport);
        }, 1000);
      }
    },

    async generatePdfReport() {
      const doc = new jsPDF({ orientation: "landscape", format: [500, 500] });
      const title =
        "Reporte de Reasignaciones " + new Date().toLocaleDateString();
      //doc.setFontSize(18);
      await doc.text(title, 15, 15);

      // Set the table headers
      const headers = [
        "Nombre del Expediente",
        "Número de Expediente",
        "Usuario Anterior",
        "Usuario Nuevo",
        "Usuario que Reasignó",
        "Fecha de Reasignacion",
        "Razón de Reasignación",
        "Notificación Electrónica"
      ];

      // Extract the data from the selectedItems object
      //   const data = this.items.map(x => [
      const data = await this.expedientes.map(x => [
        x.nombre_expediente,
        x.exp_num,
        x.u_nombre,
        x.u_nombre_nuevo,
        x.u_nombre_reasigno,
        x.fecha_reasignacion,
        x.razon,
        x.notificacion_electronica ? "Si" : "No"
      ]);

      // Generate the table
      await doc.autoTable({
        head: [headers],
        body: data,
        startY: 20
      });

      const today = new Date();
      const dateString = today
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "_"); // Replace dashes with underscores

      // Save the PDF file
      await doc.save(`reporte_reasignaciones_${dateString}.pdf`);
    },

    async downloadExcelReport() {
      this.isGeneratingReport = true;
      try {
        await setTimeout(() => {
          this.generateXlsx();
        }, 200);
      } catch (error) {
        this.$toastr.error(
          "No se ha podido generar el reporte",
          "Ha ocurrido un error"
        );
      } finally {
        setTimeout(() => {
          this.isGeneratingReport = false;
          this.loading = false;
          console.log(this.isGeneratingReport);
        }, 1000);
      }
    },

    async generateXlsx() {
      let updatedData = [];
      this.loading = true;
      this.isGeneratingReport = true;
      console.log(this.isGeneratingReport);
      updatedData = await this.expedientes.map(item => {
        const updatedItem = {
          "Nombre del Expediente": item.nombre_expediente,
          "Número de Expediente": item.exp_num,
          "Usuario Anterior": item.u_nombre,
          "Usuario Nuevo": item.u_nombre_nuevo,
          "Usuario que Reasignó": item.u_nombre_reasigno,
          "Fecha de Reasignacion": item.fecha_reasignacion,
          "Razón de Reasignación": item.razon,
          "Notificación Electrónica": item.notificacion_electronica
            ? "Si"
            : "No"
        };
        return updatedItem;
      });

      // Create a new workbook
      const workbook = utils.book_new();

      // Convert the object data to a worksheet
      const worksheet = utils.json_to_sheet(updatedData);

      // Set the header styles
      const headerStyle = {
        font: { bold: true, sz: 14 }
      };

      // Apply styles to the header row
      Object.keys(worksheet).forEach(cell => {
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
        `reporte_reasignaciones_${dateString}.xlsx`,
        { bookType: "xlsx", type: "buffer" }
      );
    },

    async getReassignations() {
      this.loading = true;
      if (this.roles.length === 0) {
        this.loading = false;
        return;
      }
      const r = await this.$store.state.services.reasignacionService.getReassignationReportView();
      this.expedientes = r.data;
      this.allExpedientes = this.expedientes;
      this.loading = false;
    },

    async getUserRoles() {
      try {
        this.loading = true;
        let r = await this.$store.state.services.administracionexpedienteService.getRol();
        if (r.data.length === 0) {
          this.roles = [
            { rol_id: 1, rol_nombre: "Adm", sistema_nombre: "EXP" }
          ];
        } else {
          // Roles is actually validating if there's a valid role that has.
          this.roles = r.data;
          this.roles = r.data.filter(x => x.sistema_nombre === "EXP");
          this.roles = this.roles.filter(
            x =>
              x.rol_id < 5 || r.rol_id === 14 || x.rol_id == 6 || x.rol_id == 18
          );
        }
        this.loading = false;
      } catch (error) {
        this.$toastr.error(
          "Ocurrió un problema al obtener los roles",
          "Mensaje"
        );
      }
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  z-index: 999;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  background-color: rgba(237, 237, 237, 0.817);

  .overlay-text {
    font-size: 1.5rem;
    font-weight: bold;
    color: rgb(24, 121, 185);
    align-items: center;
    justify-content: center;
    display: flex;
  }

  .overlay-loader {
    margin-top: 1rem;
    align-items: center;
    justify-content: center;
    display: flex;
  }
}
</style>
