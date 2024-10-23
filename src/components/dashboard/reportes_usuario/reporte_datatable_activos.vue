<template>
  <div class="content-wrapper" v-loading="loading">
    <section class="content">
      <div class="row">
        <div class="col">
          <div class="box">
            <div class="row">
              <div
                class="panel-body table-responsive p-0 m-0"
                id="listadoregistros"
                v-loading="loading"
              >
                <template>
                  <div class="col col-lg-12 col-sm-12 m-0 p-0" v-if="gridMode">
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
                          <strong>Sistema de Control de Expedientes Web</strong>
                        </h2>
                        <h3 class="text-center">
                          <strong>{{ nombre_reporte }}</strong>
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
                      :items="items"
                      :loading="loading"
                      :search="search"
                      class="elevation-1"
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
  </div>
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";
import { utils, writeFile } from "xlsx";

import dash_data_table from "../../dashboard/dash_data_table";
export default {
  name: "dash_view_data_table",
  components: {
    dash_data_table
  },
  data() {
    return {
      loading: false,
      items: [],
      search: "",
      gridMode: true,
      totalRows: 0,
      // tipo_reporte:null,
      // nombre_tipo:null,

      headers: [
        {
          value: "numero_expediente",
          text: "Numero Expediente",
          sortable: true
        },
        { value: "codigo_barra", text: "Codigo Barra", sortable: true },
        {
          value: "nombre_expediente",
          text: "Nombre Expediente",
          sortable: true
        },
        { value: "empleado", text: "Empleado", sortable: true },
        { value: "unidad", text: "Unidad", sortable: true },
        { value: "direccion", text: "Direccion", sortable: true },
        {
          value: "dias_transcurridos",
          text: "Dias Transcurridos",
          sortable: true
        },
        { value: "dias_notificar", text: "Dias Notificar", sortable: true },
        { value: "dias_limite", text: "Dias Limite", sortable: true },
        { value: "congelado", text: "Congelado", sortable: true },
        { value: "restantes", text: "Restantes", sortable: true },
        { value: "paso", text: "Paso", sortable: true },
        { value: "actuacion_id", text: "Actuacion Id", sortable: true },
        { value: "dias_totales", text: "Dias Totales", sortable: true },
        { value: "dias_congelado", text: "Dias Congelado", sortable: true },
        { value: "fecha_ingreso", text: "Fecha Ingreso", sortable: true },
        { value: "fecha_paso", text: "Fecha Paso", sortable: true },
        { value: "tipo_tramite", text: "Tipo Tramite", sortable: true },
        { value: "estado", text: "Estado", sortable: true }
      ],
      nombre_reporte: "Reporte Expedientes Activos",
      is_reporte_by_user: true
    };
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
  created() {
    try {
      //Await the Promise returned by getExpedientesActivos()
      const data = this.getExpedientesActivos();
      console.log(data);

      this.items = data.data;

      // Do something with the fetched data
    } catch (error) {
      // Handle error
      console.error(error);
    }
  },
  mounted() {
    //$("body").resize()
  },
  filters: {
    //   upper: function (value) {
    //     if (!value) return "";
    //     value = value.toString();
    //     return value.toUpperCase();
    //   },
  },
  methods: {
    regresa_dash() {

      console.log("retorno");
      let url = "/rpts_default";
      this.$router.push({ path: url });
    },
    async getExpedientesActivos() {
      this.loading = true;
      const r = await this.$store.state.services.administracionexpedienteService.getExpActivos();
      if (r.data) {
        console.log(r);
        this.items = r.data;
        this.loading = false;
        if (this.items.length > 0) {
          this.totalRows = this.items.length;
        }

      }
    },
    enviarReporte() {
      if (this.consolidado === 1) {
        let self = this;
        self.$store.state.services.reporteEmailService
          .consolidado()
          .then(r => {
            self.loading = false;
            self.loading_user = false;
            this.$toastr.success("REPORTE ENVIADO EXITOSAMENTE", "EXITO");
          })
          .catch(r => {
            this.$toastr.error(
              "HA OCURRIDO AL INTENTAR ENVIAR EL REPORTE",
              "ERROR"
            );
          });
      } else if (
        this.consolidado !== 1 &&
        (this.fieldsCerrados === null || this.fieldsCerrados === undefined)
      ) {
        self.$store.state.services.reporteEmailService
          .jefe(this.tipo)
          .then(r => {
            self.loading = false;
            self.loading_user = false;
            this.$toastr.success("REPORTE ENVIADO EXITOSAMENTE", "EXITO");
          })
          .catch(r => {
            this.$toastr.error(
              "HA OCURRIDO AL INTENTAR ENVIAR EL REPORTE",
              "ERROR"
            );
          });
      }
    },
    exportPDFActivos() {
      let data = [];
      let fields = [
        [
          "Código",
          "Expediente",
          "Nombre",
          "Dirección",
          "Empleado",
          "Unidad",
          "Paso Actual",
          "Días del paso",
          "Días para notificar",
          "Días transcurridos del paso",
          "Total de días expediente",
          "Días Congelado expediente",
          "Fecha de Paso"
        ]
      ];
      console.log(this.items);
      this.items.forEach(x => {
        x.congelado === true ? (x.congelado = "SI") : (x.congelado = "");
        let array = [
          x.codigo_barra,
          x.numero_expediente,
          x.nombre_expediente,
          x.direccion,
          x.empleado,
          x.unidad,
          x.paso,
          x.dias_limite,
          x.dias_notificar,
          x.dias_transcurridos,
          x.dias_totales,
          x.dias_congelado,
          x.fecha_paso
        ];
        data.push(array);
      });
      let columns = {
        0: { halign: "center" },
        1: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "center" },
        5: { halign: "center" },
        6: { halign: "center" },
        7: { halign: "center" },
        8: { halign: "center" },
        9: { halign: "center" },
        10: { halign: "center" },
        11: { halign: "center" },
        12: { halign: "center" },
        13: { halign: "center" }
      };

      var doc = new jsPDF("p", "mm", [500, 500]);

      doc.setFontSize(40);
      doc.setFillColor(30, 176, 96);
      doc.rect(25, 20, 450, 30, "F");
      doc.setTextColor(255, 255, 255);
      doc.text("Sistema de Control de Expedientes Web", 110, 35);

      doc.setFontSize(30);
      doc.setTextColor(255, 255, 255);
      doc.text("Reporte de Expedientes Activos", 161, 46);

      doc.setFontSize(20);
      doc.setFillColor(60, 132, 134);
      doc.rect(25, 50, 450, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.text(this.nombre_tipo, 35, 57);

      doc.autoTable({
        columnStyles: columns,
        head: fields,
        body: data,
        startY: 65,
        // theme: 'grid',
        didParseCell: data => {
          if (data.section === "body" && data.column.index === 0) {
            if (data.cell.raw === "rojo") {
              data.cell.styles.fillColor = "red";
              data.cell.styles.textColor = "red";
            } else if (data.cell.raw === "amarillo") {
              data.cell.styles.fillColor = "yellow";
              data.cell.styles.textColor = "yellow";
            } else if (data.cell.raw === "verde") {
              data.cell.styles.fillColor = "#82c91e";
              data.cell.styles.textColor = "#82c91e";
            }
          } else if (data.section === "body" && data.column.index === 1) {
            if (data.cell.raw === "SI") {
              // data.cell.styles.textColor = "white";
              data.cell.styles.fontSize = 30;
              // data.cell.styles.fillColor = "#0ddde4";
            }
          }
        }
      });

      doc.output("dataurlnewwindow");
    },
    async downloadPdfReport() {
      const doc = new jsPDF({ orientation: "landscape", format: [500, 500] });
      const title =
        "REPORTE DE EXPEDIENTES ACTIVOS " + new Date().toLocaleDateString();

      //doc.setFontSize(18);
      doc.text(title, 15, 15);

      // Set the table headers
      const headers = [
        "Código",
        "Expediente",
        "Nombre",
        "Dirección",
        "Empleado",
        "Unidad",
        "Paso Actual",
        "Días del paso",
        "Días para notificar",
        "Días transcurridos del paso",
        "Total de días expediente",
        "Días Congelado expediente",
        "Fecha de Paso"
      ];

      // Extract the data from the selectedItems object
      const data = this.items.map(x => [
        // new Date(item.fecha).toLocaleString(),
        x.codigo_barra,
        x.numero_expediente,
        x.nombre_expediente,
        x.direccion,
        x.empleado,
        x.unidad,
        x.paso,
        x.dias_limite,
        x.dias_notificar,
        x.dias_transcurridos,
        x.dias_totales,
        x.dias_congelado,
        new Date(x.fecha_paso).toLocaleString()
        //     new Date(x.fecha_paso).toLocaleString(),
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
      doc.save(`reporte_exp_activos_${dateString}.pdf`);
    },
    async exportXlsx(tipo_reporte) {
      let updatedData = [];

      updatedData = this.items.map(item => {
        const updatedItem = {
          Código: item.codigo_barra,
          Expediente: item.numero_expediente,
          Nombre: item.nombre_expediente,
          Dirección: item.direccion,
          Empleado: item.empleado,
          Unidad: item.unidad,
          "Paso Actual": item.paso,
          "Días del paso": item.dias_limite,
          "Días para notificar": item.dias_notificar,
          "Días transcurridos del paso": item.dias_transcurridos,
          "Total de días expediente": item.dias_totales,
          "Días Congelado expediente": item.dias_congelado,
          "Fecha de Paso": item.fecha_paso
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
        `reporte_expedientes_activos_${dateString}.xlsx`,
        { bookType: "xlsx", type: "buffer" }
      );
    }
  }
};
</script>
