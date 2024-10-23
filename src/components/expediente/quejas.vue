<template>
  <v-app>
    <div v-if="roles.length > 0">
      <div class="content-wrapper" v-loading="loading">
        <section class="content-header">
          <h1 class="label bg-primary">
            Quejas
            <small style="color: white">Sistema de Expedientes</small>
          </h1>
        </section>
        <v-container>
          <div class="row">
            <div class="col-md-6"></div>
            <div class="col-md-6"></div>
          </div>
          <div class="m-4">
            <div class="form-group">
              <div class="box-header with-border">
                <h3 class="box-title">
                  DPI Razón Social:
                </h3>
              </div>
              <autocomplete
                ref="dpi_input"
                :search="search_dpi"
                placeholder="Buscar número de DPI"
                aria-label="Buscar número de DPI"
                @submit="seleccionarRazonSocial"
                :get-result-value="getResultValue"
              >
              </autocomplete>
            </div>
            <div class="mb-8 mt-8">
              <div class="box-header with-border">
                <h3 class="box-title">
                  Buscar por rango de fechas:
                </h3>
              </div>
              <label class="mr-2 "></label>
              <div class="">
                <label class="ml-8 mr-2">Fecha inicio:</label>
                <date-picker v-model="startDate"></date-picker>

                <label class="ml-8 mr-2">Fecha fin:</label>
                <date-picker v-model="endDate"></date-picker>

                <button class="btn btn-primary ml-2" @click="filterByDate">
                  Buscar
                </button>
              </div>
            </div>
          </div>
          <v-divider></v-divider>
          <div class="text-center">
            <button class="btn btn-warning ml-auto mb-4" @click="clearFilters">
              Limpiar filtros
            </button>
          </div>
          <v-card-title>
            <v-chip
              color=""
              style="font-weight: bolder; cursor: pointer"
              @click="downloadXlsx()"
            >
              <span class="mr-1">Descargar xlsx</span><v-icon>download</v-icon>
            </v-chip>
            <v-chip
              color="ml-4 bg-primary text-white"
              style="font-weight: bolder; cursor: pointer"
              @click="downloadPdfReport()"
            >
              <span class="mr-1">Descargar Reporte en PDF</span
              ><v-icon>download</v-icon>
            </v-chip>

            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              clearable
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="complaints"
            :loading="loading"
            :search="search"
            class="elevation-1"
          >
          </v-data-table>
        </v-container>
      </div>
    </div>
    <rechazado v-else></rechazado>
  </v-app>
</template>
<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/es";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Rechazado from "../shared/Rechazado";

export default {
  components: { DatePicker, Rechazado },
  data: () => ({
    loading: false,
    search: "",
    complaints: [],
    hola: [],
    all_complaints: [],
    headers: [
      { value: "fecha", text: "Fecha", sortable: true },
      { value: "direccion", text: "Direccion", sortable: true },
      { value: "nombre_tipo_tramite", text: "Tipo de Trámite", sortable: true },
      { value: "razon_social.razon_social", text: "Nombre Razón Social" },
      { value: "razon_social.dpi", text: "DPI Razón Social" },
      { value: "comentario", text: "Comentario" }
    ],
    startDate: null,
    endDate: null,
    DPIentered: null,
    roles: []
  }),

  async created() {
    this.rolesS();
    // this.getComplaints();
    // this.getRazonesSociales();
  },

  watch: {},

  computed: {},

  methods: {
    async rolesS() {
      try {
        this.loading = true;
        let r = await this.$store.state.services.administracionexpedienteService.getRol();
        console.log("que es esto", r);
        if (r.data.length === 0) {
          this.roles = [
            { rol_id: 1, rol_nombre: "Adm", sistema_nombre: "EXP" }
          ];
        } else {
          this.roles = r.data.filter( x =>
            x.rol_nombre == "Auditoria Interna"
          );
        }
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.$toastr.error(
          "Ocurrio un problema al obtener los roles",
          "Mensaje"
        );
      }
    },

    async getComplaints() {
      try {
        this.loading = true;
        const r = await this.$store.state.services.quejasService.getAllComplaints();
        this.all_complaints = r.data.data;
        this.all_complaints = this.all_complaints.map(item => {
          if (item.tipo_tramite !== null) {
            return {
              ...item,
              nombre_tipo_tramite: item.tipo_tramite.nombre
            };
          } else {
            return { ...item };
          }
        });
        this.complaints = this.all_complaints.sort((a, b) => {
          const fechaA = new Date(a.fecha);
          const fechaB = new Date(b.fecha);
          return fechaB - fechaA;
        });
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },

    async filterByDate() {
      // Create the formatted date string in the desired format
      if (this.startDate === null || this.endDate === null) {
        return;
      }
      const formattedStartDate = this.formatDate(this.startDate);
      const formattedEndDate = this.formatDate(this.endDate);
      const dates = {
        fecha_inicio: formattedStartDate,
        fecha_fin: formattedEndDate
      };
      try {
        const r = await this.$store.state.services.quejasService.getComplaintsByDate(
          dates
        );
        if (r == null) {
          this.complaints = [];
          this.$toastr.warning(
            "No se encontraron datos en el rango de fechas",
            ""
          );
          return;
        }

        this.complaints = r.data.data;
        this.complaints = this.complaints.map(item => {
          if (item.tipo_tramite !== null) {
            return {
              ...item,
              nombre_tipo_tramite: item.tipo_tramite.nombre
            };
          } else {
            return { ...item };
          }
        });
      } catch (error) {
        console.log(error);
      }
    },

    formatDate(date) {
      // Extract the year, month, and day components from the date
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      // Create the formatted date string in the desired format
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    },

    getRazonesSociales() {
      this.$store.state.services.quejasService
        .getRazonesSociales()
        .then(response => {
          this.razones_sociales = response.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },

    search_dpi(searchValue) {
      if (searchValue.length > 6) {
        //Numerical
        return this.razones_sociales.filter(item => {
          const dpi = item.dpi.toLowerCase();
          return dpi.includes(searchValue);
        });
      } else {
        return [];
      }
    },

    getResultValue(option) {
      return option.razon_social + " - " + option.dpi;
    },

    async seleccionarRazonSocial(razon_social) {
      this.complaints = this.complaints.filter(item => {
        if (item.razon_social !== null) {
          const razon_social_dpi = item.razon_social.dpi;
          return razon_social_dpi === razon_social.dpi;
        } else {
          return;
        }
      });
    },

    clearFilters() {
      this.complaints = this.all_complaints;
      this.search = "";
      this.$refs.dpi_input = null;
      this.startDate = null;
      this.endDate = null;
    },

    async downloadXlsx() {
      console.log(this.all_complaints);
      const updatedData = this.all_complaints.map(item => {
        const updatedItem = {
          Fecha: new Date(item.fecha).toLocaleString(),
          Direccion: item.direccion,
          "Tipo de Trámite": item.nombre_tipo_tramite,
          "Nombre Razón Social": item.razon_social.razon_social,
          "DPI Razón Social": item.razon_social.dpi,
          Comentario: item.comentario
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
        `reporte_quejas_${dateString}.xlsx`,
        { bookType: "xlsx", type: "buffer" }
      );
    },

    async downloadPdfReport() {
      const doc = new jsPDF({ orientation: "landscape" });
      const title = "REPORTE DE QUEJAS " + new Date().toLocaleDateString();

      //doc.setFontSize(18);
      doc.text(title, 15, 15);

      // Set the table headers
      const headers = [
        "Fecha",
        "Direccion",
        "Tipo de Trámite",
        "Nombre Razón Social",
        "DPI Razón Social",
        "Comentario"
      ];

      // Extract the data from the selectedItems object
      const data = this.all_complaints.map(item => [
        new Date(item.fecha).toLocaleString(),
        item.direccion,
        item.nombre_tipo_tramite,
        item.razon_social.razon_social,
        item.razon_social.dpi,
        item.comentario
      ]);

      // Generate the table
      doc.autoTable({
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
      doc.save(`reporte_quejas_${dateString}.pdf`);
    }
  }
};
</script>
