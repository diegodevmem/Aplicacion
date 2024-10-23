<template>
  <div>
    <div class="row">
      <div class="col-md-1"></div>
      <div class="col-md-5">
        <input
          type="text"
          name="table_search"
          style="margin-right: 10px"
          class="form-control pull-right"
          placeholder="Buscar..."
          v-model="search"
          @input="search = $event.target.value.toUpperCase()"
        />
      </div>

      <div class="col-md-3">
        <button class="btn btn-success" @click="excel()">Reporte Excel</button>
      </div>

      <div class="col-md-3">
        <label class="pull-left"
          >mostrando:
          <b-form-select :options="pageOptions" v-model="perPage" />
        </label>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <b-table
          class="text-center"
          ref="selectableTable"
          responsive
          hover
          small
          flex
          stacked="md"
          :fields="titulos"
          :items="items"
          :filter="search"
          :current-page="currentPage"
          :per-page="perPage"
          @filtered="onFiltered"
          select-mode="single"
          selectable
          @row-selected="showOptions"
        >
          <template slot="nombre" slot-scope="data">
            <small>{{ data.item.nombre }} {{ data.item.apellido }} </small>
          </template>
          <template slot="direccion" slot-scope="data">
            <small>{{ data.item.direccion.toUpperCase() }}</small>
          </template>
          <template slot="unidadpertenece" slot-scope="data">
            <small>{{ data.item.unidadpertenece.toUpperCase() }}</small>
          </template>
          <template slot="fechaevaluacion" slot-scope="data">
            <small>{{
              data.item.fechaevaluacion
                .split(" ")[0]
                .split("-")
                .reverse()
                .join("/")
            }}</small>
          </template>
        </b-table>
        <div class="col-sm-12 col-md-12 col-lg-12">
          <label v-if="totalRows > 0"
            >Total: {{ totalRows }} registros en el sistema.</label
          >
          <div class="text-center">
            <label v-if="totalRows === 0">No hay registros que mostrar</label>
          </div>
        </div>
        <div class="col-sm-12 col-md-12 col-lg-12">
          <label class="pull-right"
            ><b-pagination
              :total-rows="totalRows"
              :per-page="perPage"
              v-model="currentPage"
              class="my-0"
          /></label>
        </div>
              
      </div>
    </div>

    <!-- MODAL PARA MOSTRAR LOS DATOS DE LA EVALUACION-->
    <div
      :class="abrirModal"
      data-backdrop="static"
      v-bind:style="styleObject"
      v-loading="loading"
    >
      <div class="modal-dialog modal-lg" style="width: 80%">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">
              {{ title
              }}<button
                type="button"
                @click="cancel_show"
                class="btn btn-danger btn-xs pull-right"
              >
                <i class="fa fa-close"></i>
              </button>
            </h2>
          </div>

          <div
            class="modal-body text-center"
            style="overflow-y: auto; height: 80%"
            v-if="modal"
          >
            <div>
              <!-- DATOS DE LA EVALUACION -->
              <div class="row">
                <div class="col-md-12 text-center">
                  <h3>
                    <strong>{{
                      item[0].nombre + " " + item[0].apellido
                    }}</strong>
                  </h3>
                </div>
              </div>
              <hr style="border: solid; border-radius: 5px; color: #a7a7a7" />
              <!-- NUMERO Y FECHA -->
              <div class="card">
                <div class="card-title" style="padding: 10px">
                  <!-- NOMBRE DEL EMPLEADO -->
                  <div class="row text-center">
                    <div class="col-md-6">
                      <h4>
                        <strong>Evaluacion No.: </strong><br />
                        {{ item[0].evaluacion_id }}
                      </h4>
                    </div>
                    <div class="col-md-6">
                      <h4>
                        <strong>Fecha de Evaluacion: </strong><br />
                        {{
                          item[0].fechaevaluacion
                            .split(" ")[0]
                            .split("-")
                            .reverse()
                            .join("/")
                        }}
                      </h4>
                    </div>
                  </div>
                  <hr />
                  <!-- PUESTOS -->
                  <div class="row text-center">
                    <div class="col-md-6">
                      <h4>
                        <strong>Puesto Nominal: </strong><br />
                        {{ item[0].puestonominal }}
                      </h4>
                    </div>
                    <div class="col-md-6">
                      <h4>
                        <strong>Puesto Funcional: </strong><br />
                        {{ item[0].puestofuncional }}
                      </h4>
                    </div>
                  </div>
                  <hr />

                  <!-- DEPARTAMENTO DIRECCION -->
                  <div class="row text-center">
                    <div class="col-md-6">
                      <h4>
                        <strong>Direccion: </strong><br />
                        {{ item[0].unidadpertenece }}
                      </h4>
                    </div>
                    <div class="col-md-6">
                      <h4>
                        <strong>Departamento: </strong><br />
                        {{ item[0].direccion }}
                      </h4>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
              <br />

              <!-- PUNTEOS -->
              <div class="card">
                <div class="card-title" style="padding: 10px">
                  <div class="row">
                    <div class="col-md-12 text-center">
                      <h3>
                        <strong>CALIFICACION TOTAL: </strong><br />{{
                          item[0].calificacion_total
                        }}
                        pts.
                      </h3>
                    </div>
                  </div>
                  <div class="row">
                    <!--       v-for="(x, i) in item[0].factores"
                      :key="i" -->
                    <div class="col-md-6">
                      <hr />
                      <h4>
                        <strong>{{ "COMPETENCIAS ACTITUDINALES" }}</strong
                        ><br />
                        {{ item[0].COMPETENCIAS_ACTITUDINALES }} pts.
                      </h4>
                    </div>
                    <div class="col-md-6">
                      <hr />
                      <h4>
                        <strong>{{ "COMPROMISO INSTITUCIONAL" }}</strong
                        ><br />
                        {{ item[0]["COMPROMISO_INSTITUCIONAL"] }} pts.
                      </h4>
                    </div>
                    <div class="col-md-6">
                      <hr />
                      <h4>
                        <strong>{{ "HABILIDADES Y CONOCIMIENTOS" }}</strong
                        ><br />
                        {{ item[0]["HABILIDADES_Y CONOCIMIENTOS"] }} pts.
                      </h4>
                    </div>
                    <div class="col-md-6">
                      <hr />
                      <h4>
                        <strong>{{
                          "RESPONSABILIDAD Y PRODUCTIVIDAD EN EL TRABAJO"
                        }}</strong
                        ><br />
                        {{
                          item[0][
                            "RESPONSABILIDAD_Y PRODUCTIVIDAD EN EL TRABAJO"
                          ]
                        }}
                        pts.
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <br />

              <!-- OBSERVACIONES -->
              <div class="card" style="margin-bottom: 20px">
                <div class="card-title" style="padding: 10px">
                  <div class="row text-center">
                    <div class="col-md-12">
                      <h4>
                        <strong>Observacion: </strong><br />
                        {{ item[0].observaciones }}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <pre>{{ item }}</pre> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";
export default {
  props: ["titulos", "items", "opcion"],
  data() {
    return {
      // Modal
      abrirModal: "modal fade",
      styleObject: {},
      modal: false,
      title: "",
      loading: false,
      item: null,

      // Variables de la tabla
      search: "",
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      pageOptions: [5, 10, 25, 100],
      showStringEmpty: "no hay registros que mostrar",
    };
  },

  created() {
    console.log("TABLA CREADA");
    this.totalRows = this.items.length;
  },
  watch: {
    items() {
      this.totalRows = this.items.length;
    },
  },
  methods: {
    excel() {
      console.log(this.items);
      let data = XLSX.utils.json_to_sheet(this.items);
      const workbook = XLSX.utils.book_new();
      // const workbook2 = XLSX.utils.book_new();
      const filename = "reporte";
      XLSX.utils.book_append_sheet(workbook, data, filename);
      // XLSX.utils.book_append_sheet(workbook, data, "hola");
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    },

    cancel_show() {
      this.styleObject.display = "";
      this.abrirModal = "modal fade";
      this.modal = false;
    },

    showOptions(item) {
      if (item.length === 1) {
        this.item = item;
      } else {
        item = this.item;
      }
      this.title = "Evaluacion No. " + item[0].evaluacion_id;
      this.styleObject.display = "block";
      this.abrirModal = "modal fade in";
      this.modal = true;
      console.log("item SELECTED");
      console.log(item);
    },

    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
};
</script>

<style scoped lang="scss">
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
