<template>
  <div
    class="panel-body table-responsive p-0 m-0"
    id="listadoregistros"
    v-loading="loading"
  >
    <template>
      <div class="col col-lg-12 col-sm-12 m-0 p-0" v-if="gridMode">
        <div class="row">
          <div class="col col-md-2 col-lg-2" style="text-align: right">
            <div class="row">
              <img
                class="datos"
                :src="require('../../assets/LogoLogin2.png')"
                width="60%"
              />
            </div>
            <br />
            <div
              v-if="
                this.fieldsCerrados === null ||
                this.fieldsCerrados === undefined
              "
            >
              <div v-if="admin" class="row">
                <b-button
                  @click="enviarReporte()"
                  class="btn-sm datos m-0 p-0"
                  variant="primary"
                  >Enviar Reporte</b-button
                >
                <b-button
                  v-if="reporte === 4"
                  @click="exportPDFCongelados()"
                  class="btn-sm datos m-0 p-0"
                  variant="danger"
                  >Imprimir Reporte PDF</b-button
                >

                <b-button
                  v-if="reporte === 3"
                  @click="exportPDFCerrados()"
                  class="btn-sm datos m-0 p-0"
                  variant="danger"
                  >Imprimir Reporte PDF</b-button
                >

                <b-button
                  v-if="reporte === 2"
                  @click="exportPDFActivos()"
                  class="btn-sm datos m-0 p-0"
                  variant="danger"
                  >Imprimir Reporte PDF</b-button>

           
                  
              </div >
              <div class="row">
                <b-button
                  @click="exportXlsx(reporte)"
                  class="btn-sm datos m-0 p-0"
                  variant="success"
                  >Imprimir Reporte XLSX</b-button>
              </div>
              <div v-if="admin === false" class="row">
                <b-button
                  v-if="reporte === 4"
                  @click="exportPDFCongelados()"
                  class="btn-sm datos m-0 p-0"
                  variant="danger"
                  >Imprimir Reporte PDF</b-button
                >
                <b-button
                  v-if="reporte === 3"
                  @click="exportPDFCerrados()"
                  class="btn-sm datos m-0 p-0"
                  variant="danger"
                  >Imprimir Reporte PDF</b-button
                >
                <b-button
                  v-if="reporte === 2"
                  @click="exportPDFActivos()"
                  class="btn-sm datos m-0 p-0"
                  variant="danger"
                  >Imprimir Reporte PDF</b-button
                >
              </div>
            </div>

            <div
              v-if="
                this.fieldsCerrados != null || this.fieldsCerrados != undefined
              "
            >
                <b-button
                  @click="exportXlsx(reporte)"
                  class="btn-sm datos m-0 p-0"
                  variant="success"
                  >Imprimir Reporte XLSX</b-button>
              <b-button
                v-if="reporte === 4"
                @click="exportPDFCongelados()"
                class="btn-sm datos m-0 p-0"
                variant="danger"
                >Imprimir Reporte PDF</b-button
              >
              <b-button
                v-if="reporte === 3"
                @click="exportPDFCerrados()"
                class="btn-sm datos m-0 p-0"
                variant="danger"
                >Imprimir Reporte PDF</b-button
              >
              <b-button
                v-if="reporte === 2"
                @click="exportPDFActivos()"
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
            <h4 class="text-center">
              <strong>{{ nombre_tipo }}</strong>
            </h4>
          </div>

          <div class="col col-md-2 col-lg-2" style="text-align: left">
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

        <div class="row">
          <div :md="alineacion" class="col my-1 form-inline">
            <label>Mostrando: </label>
            <b-form-select
              :options="pageOptions"
              :class="'form-control'"
              v-model="perPage"
            />
            <label>entradas </label>
          </div>

          <div v-if="reporte === 4" md="3" class="col my-1 form-inline">
            <multiselect
              v-model="seleccionCongelacion"
              @input="showTipoCongelacion"
              :options="tipo_congelado"
              placeholder="Seleccione un Tipo de Congelacion"
              :searchable="true"
              :allow-empty="true"
              data-vv-name="categoría del trámite"
              v-validate="'required'"
              :show-labels="false"
              label="nombre"
              track-by="id"
            >
              <span slot="noResult">Ningún registro encontrado</span>
            </multiselect>
          </div>

          <div v-if="reporte === 4" md="3" class="col my-1 form-inline">
            <multiselect
              v-model="seleccionRazon"
              @input="showRazonCongelacion"
              :options="razon_congelado"
              placeholder="Seleccione una Razón de Congelacion"
              :searchable="true"
              :allow-empty="true"
              data-vv-name="categoría del trámite"
              v-validate="'required'"
              :show-labels="false"
              label="nombre"
              track-by="id"
            >
              <span slot="noResult">Ningún registro encontrado</span>
            </multiselect>
          </div>

          <div v-if="reporte === 2  && is_reporte_by_user == false" md="3" class="col my-1 form-inline">
            <multiselect
              v-model="seleccionEstadoPaso"
              @input="showEstadoPaso"
              :options="estadosPaso"
              placeholder="Seleccione un Estado del paso"
              :searchable="true"
              :allow-empty="true"
              data-vv-name="categoría del trámite"
              v-validate="'required'"
              :show-labels="false"
              label="estado"
              track-by="id"
            >
              <span slot="noResult">Ningún registro encontrado</span>
            </multiselect>
          </div>

          <div v-if="reporte === 2  && is_reporte_by_user == false" md="3" class="col my-1 form-inline">
            <multiselect
              v-model="seleccionEstadoCongelado"
              @input="showEstadoCongelacion"
              :options="estadosCongelado"
              placeholder="Seleccione si esta Congelado o Descongelado"
              :searchable="true"
              :allow-empty="true"
              data-vv-name="categoría del trámite"
              v-validate="'required'"
              :show-labels="false"
              label="estado"
              track-by="id"
            >
              <span slot="noResult">Ningún registro encontrado</span>
            </multiselect>
          </div>

          <div :md="alineacion" class="col my-1 form-inline">
            <b-input-group>
              <b-form-input v-model="filter" placeholder="Buscar" />
            </b-input-group>
          </div>

          <div class="row">
            <div class="col-md-12">
              <hr />
            </div>
          </div>
        </div>

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
            @filtered="onFiltered"
            select-mode="single"
            selectable
            @row-selected="showOptions"
          >
            <!-- A virtual column -->
            <template class="text-center" slot="estado" slot-scope="data">
              <img
                :src="
                  require('../../assets/estado_' + data.item.estado + '.png')
                "
                width="50px"
                height="50px"
              />
            </template>
            <template class="text-center" slot="congelado" slot-scope="data">
              <div v-if="data.item.congelado === true">
                <img
                  :src="require('../../assets/congelado.svg')"
                  width="50px"
                  height="50px"
                />
              </div>
            </template>
          </b-table>
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
            <div class="col my-1 pull-right">
              <b-pagination
                :total-rows="totalRows"
                :per-page="perPage"
                v-model="currentPage"
                class="my-0 text-center"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
// import { jsPDF } from 'jspdf';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { utils, writeFile } from "xlsx";

import html2canvas from "html2canvas";
export default {
  name: "dash_data_table",
  props: [
    "unidad",
    "consolidado",
    "fieldsCerrados",
    "fieldsCongelados",
    "fieldsActivos",
    "tipo",
    "reporte",
    "pertenece",
    "fechaInicial",
    "fechaFinal",
    "filtroFecha",
    "mes",
    "anio",
    "nombre_reporte",
    "nombre_tipo",
    "is_reporte_by_user",
  ],
  data() {
    return {
      admin: false,

      // Variables de la tabla
      loading: false,
      loading_user: false,
      gridMode: true,
      filter: null,
      fields: null,

      estadosPaso: [
        { id: "rojo", estado: "ROJO" },
        { id: "amarillo", estado: "AMARILLO" },
        { id: "verde", estado: "VERDE" },
      ],

      estadosCongelado: [
        { id: true, estado: "CONGELADO" },
        { id: false, estado: "DESCONGELADO" },
      ],
      allDataInTable: [],
      items: [],
      itemsData: [],
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      pageOptions: [5, 10, 25, 50, 100],
      showStringEmpty: "no hay registros que mostrar",
      isBordered: true,

      tipo_congelado: [],
      tipo_tramite: [],
      razon_congelado: [],
      seleccionCongelacion: null,
      seleccionRazon: null,
      seleccionTramite: null,

      seleccionEstadoPaso: null,
      seleccionEstadoCongelado: null,
      expedientes_for_xlsx: [],
      expedientes_congelados: [],
      expedientes_cerrados: [],
      expedientes_activos: [],

      documento: null,

      items_rojo: [],
      items_amarillo: [],
      items_verde: [],
    };
  },
  created() {
    this.items = this.fieldsActivos;
    console.log(this.fields);
    this.admin = this.$store.state.user.admin;
    if(this.is_reporte_by_user == undefined){
      this.is_reporte_by_user = false;
    }
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
    },
  },
  mounted() {
    $("body").resize();
  },
  methods: {
    // REPORTES PDF
    exportPDFCongelados() {
      let data = [];
      let fields = [
        [
          "Tipo Congelacion",
          "Razon",
          "Expediente",
          "Nombre",
          "Unidad",
          "Dirección",
          "Empleado",
          "Paso Actual",
          "Días Congelado expediente",
          "Fecha de Congelación",
        ],
      ];

      this.items.forEach((x) => {
        let array = [
          x.tipo_congelacion,
          x.razon,
          x.numero_expediente,
          x.nombre_expediente,
          x.unidad,
          x.direccion,
          x.usuario,
          x.paso,
          x.dias_congelado,
          x.fecha_congelacion,
        ];
        data.push(array);
      });

      var doc = new jsPDF("p", "mm", [400, 400]);

      doc.setFontSize(40);
      doc.setFillColor(102, 199, 207);
      doc.rect(25, 20, 350, 30, "F");
      doc.setTextColor(255, 255, 255);
      doc.text("Sistema de Control de Expedientes Web", 65, 35);

      doc.setFontSize(30);
      doc.setTextColor(255, 255, 255);
      doc.text("Reporte de Expedientes Congelados", 108, 46);

      doc.setFontSize(20);
      doc.setFillColor(60, 132, 134);
      doc.rect(25, 50, 350, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.text(this.nombre_tipo, 35, 57);

      doc.autoTable({ head: fields, body: data, startY: 65 });
            // Generate the Excel file
            const today = new Date();
      const dateString = today
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "_"); // Replace dashes with underscores

      //doc.output("dataurlnewwindow");
      doc.save(`reporte_exp_congelados_${dateString}.pdf`);
    },

    async exportXlsx(tipo_reporte){
      console.log(tipo_reporte)
      let updatedData = []
      if(tipo_reporte==4){
        // updatedData = this.expedientes_congelados.map((item) =>{
          updatedData =  this.items.map((item) => {
          const updatedItem = {
          "Tipo Congelacion": item.tipo_congelacion,
          "Razon": item.razon,
          "Expediente": item.numero_expediente,
          "Nombre": item.nombre_expediente,
          "Unidad": item.unidad,
          "Dirección": item.direccion,
          "Empleado": item.usuario,
          "Paso Actual": item.paso,
          "Días Congelado expediente": item.dias_congelado,
          "Fecha de Congelación": item.fecha_congelacion,
        };
       
        return updatedItem;
        })
      }else if(tipo_reporte==2){
        // updatedData =  this.expedientes_activos.map((item) => {
        updatedData =  this.items.map((item) => {
          const updatedItem = {
          "Estado del paso": item.estado,
          "Congelado": item.congelado,
          "Código": item.codigo_barra,
          "Expediente": item.numero_expediente,
          "Nombre": item.nombre_expediente,
          "Dirección": item.direccion,
          "Empleado": item.empleado,
          "Unidad": item.unidad,
          "Paso Actual": item.paso,
          "Días del paso": item.dias_limite,
          "Días para notificar": item.dias_notificar,
          "Días transcurridos del paso": item.dias_transcurridos,
          "Total de días expediente": item.dias_totales,
          "Días Congelado expediente": item.dias_congelado,
          "Fecha de Paso": item.fecha_paso,
        }
        return updatedItem;
      });

      }else if(tipo_reporte==3){
        // updatedData = this.expedientes_cerrados.map((item) => {
        updatedData =  this.items.map((item) => {
        const updatedItem = {
          "Codigo": item.codigo_barra,
          "Expediente": item.numero_expediente,
          "Nombre": item.nombre_expediente,
          "Fecha de Ingreso": item.fecha_ingreso,
          "Direccion": item.direccion,
          "Unidad": item.unidad,
          "Fecha de Cierre": item.fecha_cerrado,
        };
        return updatedItem;
      }); 
      }
      console.log(updatedData)
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
      const dateString = today.toISOString().split("T")[0].replace(/-/g, "_"); // Replace dashes with underscores

      if(tipo_reporte==4){
          const excelBuffer = writeFile(
          workbook,
          `reporte_expedientes_congelados_${dateString}.xlsx`,
          { bookType: "xlsx", type: "buffer" }
          );
      }else if(tipo_reporte==2){
          const excelBuffer = writeFile(
          workbook,
          `reporte_expedientes_activos_${dateString}.xlsx`,
          { bookType: "xlsx", type: "buffer" }
          );
        }else if(tipo_reporte==3){
          const excelBuffer = writeFile(
          workbook,
          `reporte_expedientes_cerrados_${dateString}.xlsx`,
          { bookType: "xlsx", type: "buffer" }
          );
        }
   

    },

    exportPDFCerrados() {
      let data = [];
      let fields = [
        [
          "Codigo",
          "Expediente",
          "Nombre",
          "Direccion",
          "Unidad",
          "Fecha de Cierre",
        ],
      ];

      this.items.forEach((x) => {
        let array = [
          x.codigo_barra,
          x.numero_expediente,
          x.nombre_expediente,
          x.direccion,
          x.unidad,
          x.fecha_cerrado,
        ];
        data.push(array);
      });

      var doc = new jsPDF("p", "mm", [300, 300]);
      doc.setFontSize(35);
      doc.setFillColor(224, 124, 124);
      doc.rect(25, 20, 250, 30, "F");
      doc.setTextColor(255, 255, 255);
      doc.text("Sistema de Control de Expedientes Web", 40, 35);

      doc.setFontSize(25);
      doc.setTextColor(255, 255, 255);
      doc.text("Reporte de Expedientes Cerrados", 82, 46);

      doc.setFontSize(20);
      doc.setFillColor(60, 132, 134);
      doc.rect(25, 50, 250, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.text(this.nombre_tipo, 35, 57);
      doc.autoTable({ head: fields, body: data, startY: 65 });

            // Generate the Excel file
            const today = new Date();
      const dateString = today
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "_"); // Replace dashes with underscores

      //doc.output("dataurlnewwindow");
      doc.save(`reporte_exp_cerrados_${dateString}.pdf`);
    },

    exportPDFActivos() {
      let data = [];
      let fields = [
        [
          "Estado del paso",
          "Congelado",
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
          "Fecha de Paso",
        ],
      ];

      this.items.forEach((x) => {
        x.congelado === true ? (x.congelado = "SI") : (x.congelado = "");
        let array = [
          x.estado,
          x.congelado,
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
          x.fecha_paso,
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
        13: { halign: "center" },
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
        didParseCell: (data) => {
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
        },
      });
      // Generate the Excel file
      const today = new Date();
      const dateString = today
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "_"); // Replace dashes with underscores

      //doc.output("dataurlnewwindow");
      doc.save(`reporte_exp_activos_${dateString}.pdf`);
    },

    // Filtrados de Reportes
    // ACTIVOS, ESTADO PASO - R,A,V
    showEstadoPaso() {
      if (
        this.seleccionEstadoPaso !== null &&
        this.seleccionEstadoCongelado === null
      ) {
        this.items = this.itemsData.filter(
          (x) => x.estado === this.seleccionEstadoPaso.id
        );
      } else if (
        this.seleccionEstadoPaso !== null &&
        this.seleccionEstadoCongelado !== null
      ) {
        this.items = this.itemsData.filter(
          (x) =>
            x.estado === this.seleccionEstadoPaso.id &&
            x.congelado === this.seleccionEstadoCongelado.id
        );
      } else {
        this.items = this.itemsData;
      }
      this.totalRows = this.items.length;
      this.loading = false;
      this.loading_user = false;
    },

    // ACTIVOS, congelado, descongelado
    showEstadoCongelacion() {
      // this.itemsData = this.items;
      if (
        this.seleccionEstadoCongelado !== null &&
        this.seleccionEstadoPaso === null
      ) {
        this.items = this.itemsData.filter(
          (x) => x.congelado === this.seleccionEstadoCongelado.id
        );
      } else if (
        this.seleccionEstadoPaso !== null &&
        this.seleccionEstadoCongelado !== null
      ) {
        this.items = this.itemsData.filter(
          (x) =>
            x.estado === this.seleccionEstadoPaso.id &&
            x.congelado === this.seleccionEstadoCongelado.id
        );
      } else {
        this.items = this.itemsData;
      }
      this.totalRows = this.items.length;
      this.loading = false;
      this.loading_user = false;
    },

    // CONGELADOS, interna, externa, por interesado
    showTipoCongelacion() {
      if (this.seleccionCongelacion !== null) {
        this.items = this.itemsData.filter(
          (x) => x.tipo_congelacion_id === this.seleccionCongelacion.id
        );
      } else {
        this.items = this.itemsData;
      }
      this.totalRows = this.items.length;
      this.loading = false;
      this.loading_user = false;
    },

    // CONGELADOS, razon de congelacion
    showRazonCongelacion() {
      if (this.seleccionRazon !== null) {
        this.items = this.itemsData.filter(
          (x) => x.razon_id === this.seleccionRazon.id
        );
      } else {
        this.items = this.itemsData;
      }
      this.totalRows = this.items.length;
      this.loading = false;
      this.loading_user = false;
    },

    // BOTON DE ENVIO DE REPORTES
    enviarReporte() {
      if (this.consolidado === 1) {
        let self = this;
        self.$store.state.services.reporteEmailService
          .consolidado()
          .then((r) => {
            self.loading = false;
            self.loading_user = false;
            this.$toastr.success("REPORTE ENVIADO EXITOSAMENTE", "EXITO");
          })
          .catch((r) => {
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
          .then((r) => {
            self.loading = false;
            self.loading_user = false;
            this.$toastr.success("REPORTE ENVIADO EXITOSAMENTE", "EXITO");
          })
          .catch((r) => {
            this.$toastr.error(
              "HA OCURRIDO AL INTENTAR ENVIAR EL REPORTE",
              "ERROR"
            );
          });
      }
    },

    // Metodo on filteres
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    // Obtener todos los items
    getAll() {

      if(this.consolidado !== undefined && this.reporte !== undefined){

        let self = this;
        self.loading_user = true;
        self.loading = true;
        this.fieldsCerrados === undefined || this.fieldsCerrados === null
          ? ""
          : (self.fields = self.fieldsCerrados);
          //crashing
        console.log(this.consolidado)        
        console.log(this.reporte)
        if (this.consolidado === 1 && this.reporte === 2) {
        // consolidado, activos
        if (this.filtroFecha === 1) {
          this.tableDashConsolidadoSemaforo(); //no
        } else if (this.filtroFecha === 2) {
          this.tableDashConsolidadoSemaforoRango(
            this.fechaInicial,
            this.fechaFinal
          );
        } else if (this.filtroFecha === 3) {
          this.tableDashConsolidadoSemaforoMensual(this.mes, this.anio);
        }
      } else if (this.consolidado !== 1 && this.reporte === 2) {
        //direcciones activos
        if (this.filtroFecha === 1) {
          this.tableDashSemaforo();
        } else if (this.filtroFecha === 2) {
          this.tableDashSemaforoRango(this.fechaInicial, this.fechaFinal);
        } else if (this.filtroFecha === 3) {
          this.tableDashSemaforoMensual(this.mes, this.anio);
        }
      } else if (this.consolidado !== 1 && this.reporte === 3) {
        //direcciones cerrado
        if (this.filtroFecha === 1) {
          this.tableDashCerrados();
        } else if (this.filtroFecha === 2) {
          this.tableDashCerradosRango(this.fechaInicial, this.fechaFinal);
        } else if (this.filtroFecha === 3) {
          this.tableDashCerradosMensual(this.mes, this.anio);
        }
        //Crashing
      } else if (this.consolidado === 1 && this.reporte === 3) {
        //consolidado, cerrado;
        if (this.filtroFecha === 1) {
          this.tableDashCerradosConsolidados(); //no
        } else if (this.filtroFecha === 2) {
          this.tableDashCerradosConsolidadosRango(
            this.fechaInicial,
            this.fechaFinal
          );
        } else if (this.filtroFecha === 3) {
          this.tableDashCerradosConsolidadosMensual(this.mes, this.anio);
        }
      } else if (this.consolidado === 1 && this.reporte === 4) {
        //consolidado, congelados
        if (this.filtroFecha === 1) {
          this.tableDashCongeladosConsolidados();
        } else if (this.filtroFecha === 2) {
          this.tableDashCongeladosConsolidadosRango(
            this.fechaInicial,
            this.fechaFinal
          );
        } else if (this.filtroFecha === 3) {
          this.tableDashCongeladosConsolidadosMensual(this.mes, this.anio);
        }
      } else if (this.consolidado !== 1 && this.reporte === 4) {
        //direcciones congelados
        if (this.filtroFecha === 1) {
          this.tableDashCongelados();
        } else if (this.filtroFecha === 2) {
          this.tableDashCongeladosRango(this.fechaInicial, this.fechaFinal);
        } else if (this.filtroFecha === 3) {
          this.tableDashCongeladosMensual(this.mes, this.anio);
        }
      }
      }

    },

    // METODOS PARA REALIZAR CONSUMO SEGUN PROPS
    //------------------------ENDPOINTS CONSOLIDADOS CERRADOS-----------------------

    tableDashCerradosConsolidados() {
      let self = this;
      self.$store.state.services.administracionexpedienteService
        .getExpTableDashCerradosConsolidadosTodo()
        .then((r) => {
          console.log("r.data - CERRADOS CONS");
          console.log(r.data);
          self.items = r.data;
          self.expedientes_cerrados = self.items
          self.totalRows = self.items.length;
          self.loading = false;
          self.loading_user = false;
        })
        .catch((r) => {});
    },
    tableDashCerradosConsolidadosRango(inicio, fin) {
      let self = this;
      self.$store.state.services.administracionexpedienteService
        .getExpTableDashCerradosConsolidadosRango(inicio, fin)
        .then((r) => {
          console.log("r.data - CERRADOS CONS");
          console.log(r.data);
          self.items = r.data;
          self.totalRows = self.items.length;
          self.loading = false;
          self.loading_user = false;
        })
        .catch((r) => {});
    },
    tableDashCerradosConsolidadosMensual(mes, anio) {
      let self = this;
      self.$store.state.services.administracionexpedienteService
        .getExpTableDashCerradosConsolidadosMensual(mes, anio)
        .then((r) => {
          console.log("r.data - CERRADOS CONS");
          console.log(r.data);
          self.items = r.data;
          self.totalRows = self.items.length;
          self.loading = false;
          self.loading_user = false;
        })
        .catch((r) => {});
    },
    //------------------------FIN ENDPOINTS CONSOLIDADOS CERRADOS-----------------------

    //------------------------ENDPOINTS CONSOLIDADOS CONGELADOS-----------------------

    tableDashCongeladosConsolidados() {
      let self = this;
      self.$store.state.services.administracionexpedienteService
        .getExpTableDashCongeladosConsolidados()
        .then((r) => {
          this.fields = this.fieldsCongelados;
          console.log("r.data - CONGELADOS CONS");
          console.log(r.data);
          this.expedientes_congelados = r.data.congelados
          self.expedientes_for_xlsx = self.items
          this.razon_congelado = r.data.razon;
          this.tipo_congelado = r.data.tipo_congelado;
          self.items = r.data.congelados;
          self.itemsData = r.data.congelados;
          self.totalRows = self.items.length;
          self.loading = false;
          self.loading_user = false;
        })
        .catch((r) => {});
    },
    tableDashCongeladosConsolidadosRango(inicio, fin) {
      let self = this;
      self.$store.state.services.administracionexpedienteService
        .getExpTableDashCongeladosConsolidadosRango(inicio, fin)
        .then((r) => {
          this.fields = this.fieldsCongelados;
          console.log("r.data - CONGELADOS CONS");
          console.log(r.data);
          this.razon_congelado = r.data.razon;
          this.tipo_congelado = r.data.tipo_congelado;
          self.items = r.data.congelados;
          self.itemsData = r.data.congelados;
          self.totalRows = self.items.length;
          self.loading = false;
          self.loading_user = false;
        })
        .catch((r) => {});
    },
    tableDashCongeladosConsolidadosMensual(mes, anio) {
      let self = this;
      self.$store.state.services.administracionexpedienteService
        .getExpTableDashCongeladosConsolidadosMensual(mes, anio)
        .then((r) => {
          this.fields = this.fieldsCongelados;
          console.log("r.data - CONGELADOS CONS");
          console.log(r.data);
          this.razon_congelado = r.data.razon;
          this.tipo_congelado = r.data.tipo_congelado;
          self.items = r.data.congelados;
          self.itemsData = r.data.congelados;
          self.totalRows = self.items.length;
          self.loading = false;
          self.loading_user = false;
        })
        .catch((r) => {});
    },

    //------------------------FIN ENDPOINTS CONSOLIDADOS CONGELADOS-----------------------

    //------------------------ENDPOINTS CONSOLIDADOS ACTIVOS-----------------------
    tableDashConsolidadoSemaforo() {
      //consolidado todo activos
      this.$store.state.services.administracionexpedienteService
        .getExpTableDashConsolidadoSemaforoTodo()
        .then((r) => {
          console.log("r.data- todo ok - ACTIVOS CONS");
          console.log(r.data);
          this.recorrer(r.data, "verde");
          this.items = this.items.filter((x) => !x.admin);
          this.expedientes_activos = r.data
          this.itemsData = this.items;
          this.totalRows = this.items.length;
          this.loading = false;
          this.loading_user = false;
        })
        .catch((r) => {});
    },

    tableDashConsolidadoSemaforoRango(inicio, fin) {
      //consolidado por rango activos
      console.log("consumiendo consolidados por rango", inicio, fin);
      let self = this;
      self.$store.state.services.administracionexpedienteService
        .getExpTableDashConsolidadoSemaforoRango(inicio, fin)
        .then((r) => {
          console.log("r.data - ACTIVOS CONS RANGO");
          console.log(r.data);
          self.recorrer(r.data, "");
          self.items = self.items.filter((x) => !x.admin);
          this.itemsData = this.items;
          self.totalRows = self.items.length;
          self.loading = false;
          self.loading_user = false;
        })
        .catch((r) => {});
    },
    tableDashConsolidadoSemaforoMensual(mes, anio) {
      //consolidado por mes activos
      console.log("consumiendo consolidados por mes", mes, anio);
      let self = this;
      self.$store.state.services.administracionexpedienteService
        .getExpTableDashConsolidadoSemaforoMensual(mes, anio)
        .then((r) => {
          console.log("r.data - ACTIVOS CONS MENSUAL");
          console.log(r.data);
          self.recorrer(r.data, "");
          self.items = self.items.filter((x) => !x.admin);
          this.itemsData = this.items;
          self.totalRows = self.items.length;
          self.loading = false;
          self.loading_user = false;
        })
        .catch((r) => {});
    },
    //------------------------FIN ENDPOINTS CONSOLIDADOS-----------------------

    //------------------------ENDPOINTS ACTIVOS CERRADOS CONGELADOS DIRECCIONES-----------------------
    //------------------------------- INICIO ACTIVOS UNIDADES DIRECCIONES ----------------------------
    tableDashSemaforo() {
      let self = this;
      self.$store.state.services.administracionexpedienteService
        .getExpTableDashSemaforoTodo(this.unidad, this.tipo)
        .then((r) => {
          console.log("r.data - ACTIVOS DIRECCIONES ");
          console.log(r.data);
          self.recorrer(r.data, "");
          this.items = this.items.filter((x) => !x.admin);
          this.itemsData = this.items;
          this.totalRows = this.items.length;
          this.loading = false;
          this.loading_user = false;
        })
        .catch((r) => {});
    },
    tableDashSemaforoRango(inicio, fin) {
      let self = this;
      self.$store.state.services.administracionexpedienteService
        .getExpTableDashSemaforoRango(this.unidad, this.tipo, inicio, fin)
        .then((r) => {
          console.log("r.data - ACTIVOS RANGO DIRECCIONES");
          console.log(r.data);
          self.recorrer(r.data, "");
          this.items = this.items.filter((x) => !x.admin);
          this.itemsData = this.items;
          this.totalRows = this.items.length;
          this.loading = false;
          this.loading_user = false;
        })
        .catch((r) => {});
    },
    tableDashSemaforoMensual(mes, anio) {
      let self = this;
      self.$store.state.services.administracionexpedienteService
        .getExpTableDashSemaforoMensual(this.unidad, this.tipo, mes, anio)
        .then((r) => {
          console.log("r.data - ACTIVOS MENSUAL DIRECCIONES");
          console.log(r.data);
          self.recorrer(r.data, "");
          this.items = this.items.filter((x) => !x.admin);
          this.itemsData = this.items;
          this.totalRows = this.items.length;
          this.loading = false;
          this.loading_user = false;
        })
        .catch((r) => {});
    },
    //------------------------------- FIN ACTIVOS UNIDADES DIRECCIONES ----------------------------
    //------------------------------- INICIO CERRADOS UNIDADES DIRECCIONES ----------------------------
    tableDashCerrados() {
      let self = this;
      self.$store.state.services.administracionexpedienteService
        .getExpTableDashCerrados(this.unidad)
        .then((r) => {
          self.items = r.data;
          self.totalRows = self.items.length;
          self.loading = false;
          self.loading_user = false;
        })
        .catch((r) => {});
    },
    tableDashCerradosRango(inicio, fin) {
      let self = this;
      self.$store.state.services.administracionexpedienteService
        .getExpTableDashCerradosRango(this.unidad, inicio, fin)
        .then((r) => {
          self.items = r.data;
          self.totalRows = self.items.length;
          self.loading = false;
          self.loading_user = false;
        })
        .catch((r) => {});
    },
    tableDashCerradosMensual(mes, anio) {
      let self = this;
      self.$store.state.services.administracionexpedienteService
        .getExpTableDashCerradosMensual(this.unidad, mes, anio)
        .then((r) => {
          self.items = r.data;
          self.totalRows = self.items.length;
          self.loading = false;
          self.loading_user = false;
        })
        .catch((r) => {});
    },
    //------------------------------- FIN CERRADOS UNIDADES DIRECCIONES ----------------------------
    //------------------------------- INICIO CONGELADOS UNIDADES DIRECCIONES ----------------------------
    tableDashCongelados() {
      let self = this;
      self.$store.state.services.administracionexpedienteService
        .getExpTableDashCongelados(this.unidad, this.tipo, this.pertenece)
        .then((r) => {
          this.fields = this.fieldsCongelados;
          this.razon_congelado = r.data.razon;
          self.itemsData = r.data.congelados;
          self.items = r.data.congelados;
          this.tipo_congelado = r.data.tipo_congelado;
          this.tipo_tramite = r.data.tipo_tramite;
          self.totalRows = self.items.length;
          self.loading = false;
          self.loading_user = false;
        })
        .catch((r) => {});
    },
    tableDashCongeladosRango(inicio, fin) {
      let self = this;
      self.$store.state.services.administracionexpedienteService
        .getExpTableDashCongeladosRango(
          this.unidad,
          this.tipo,
          this.pertenece,
          inicio,
          fin
        )
        .then((r) => {
          this.fields = this.fieldsCongelados;
          this.razon_congelado = r.data.razon;
          self.itemsData = r.data.congelados;
          self.items = r.data.congelados;
          this.tipo_congelado = r.data.tipo_congelado;
          this.tipo_tramite = r.data.tipo_tramite;
          self.totalRows = self.items.length;
          self.loading = false;
          self.loading_user = false;
        })
        .catch((r) => {});
    },
    tableDashCongeladosMensual(mes, anio) {
      let self = this;
      self.$store.state.services.administracionexpedienteService
        .getExpTableDashCongeladosMensual(
          this.unidad,
          this.tipo,
          this.pertenece,
          mes,
          anio
        )
        .then((r) => {
          this.fields = this.fieldsCongelados;
          this.razon_congelado = r.data.razon;
          self.itemsData = r.data.congelados;
          self.items = r.data.congelados;
          this.tipo_congelado = r.data.tipo_congelado;
          this.tipo_tramite = r.data.tipo_tramite;
          self.totalRows = self.items.length;
          self.loading = false;
          self.loading_user = false;
        })
        .catch((r) => {});
    },
    //------------------------------- FIN CONGELADOS UNIDADES DIRECCIONES ----------------------------
    //------------------------ FIN ENDPOINTS ACTIVOS CERRADOS CONGELADOS DE DIRECCIONES-----------------------

    // ORDENAR DATOS DEL CONSUMO   <- aqui revisar para cambiar las columnas que llegan
    recorrer(array, coloring) {
      console.log("Coloring");

      array.filter((x) => {
        if (x.dias_transcurridos >= x.dias_limite) {
          x.estado = "rojo";
        } else if (x.dias_transcurridos > x.dias_notificar) {
          x.estado = "amarillo";
        } else {
          x.estado = "verde"; //todo al día
        }
      });

      // console.log('array');
      // console.log(array);
      this.items = array;
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
    },
    //RETORNO DASHBOARD
    regresa_dash() {
      console.log("retorno");
      let url = "/dash_default";
      self.$router.push({ path: url });
    },
  },
  watch:{
    filter(search){
      console.log(search)
      if(this.allDataInTable.length === 0){
        this.allDataInTable = this.items
      }
        console.log(this.allDataInTable)
      const filter = search.toLowerCase();
      this.items = this.allDataInTable.filter((x)=>{
        console.log(x)
        // it must be (x.nombre_expediente && x.nombre_expediente.toLowerCase().includes(filter) || (x.numero_expediente && x.numero_expediente.toLowerCase().includes(filter) || (x.codigo_barra && x.codigo_barra.toLowerCase().includes(filter) || (x.direccion && x.direccion.toLowerCase().includes(filter) || (x.empleado && x.empleado.toLowerCase().includes(filter) || (x.unidad && x.unidad.toLowerCase().includes(filter) || (x.paso && x.paso.toLowerCase().includes(filter) || (x.fecha_paso && x.fecha_paso.includes(filter)
        if((x.nombre_expediente && x.nombre_expediente.toLowerCase().includes(filter))
        || (x.numero_expediente && x.numero_expediente.toLowerCase().includes(filter))
        || (x.codigo_barra && x.codigo_barra.toLowerCase().includes(filter)) 
        || (x.direccion && x.direccion.toLowerCase().includes(filter)) 
        || (x.empleado && x.empleado.toLowerCase().includes(filter)) 
        || (x.unidad && x.unidad.toLowerCase().includes(filter)) 
        || (x.paso && x.paso.toLowerCase().includes(filter)) 
        || (x.fecha_paso && x.fecha_paso.includes(filter))){
          return x
        }
        
      })
      console.log(this.items)
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
</style>
