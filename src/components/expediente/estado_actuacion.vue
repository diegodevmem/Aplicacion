<template>
  <div class="content-wrapper" v-loading="loading">
    <section class="content-header">
      <h1 class="label bg-primary">
        Estado de los Expedientes
        <small style="color: white">Sistema de Expedientes</small>
      </h1>
    </section>
    <br />
    <section class="content" v-loading="loading">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12">
          <ol class="label breadcrumb bg-gray pull-right">
            <router-link tag="li" to="/exp_default" exact>
              <i class="fa fa-home"></i> Home
            </router-link>
            <router-link tag="li" to="/" exact>
              <i class="fa fa-dashboard"></i> Dashboard
            </router-link>
            <li><i class="fa fa-bug active"></i> Estado de los Expedientes</li>
          </ol>
        </div>
        <div class="col-sm-12 col-md-12 col-lg-12">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h1 class="box-title">
                <i class="fa fa-list"></i> Información ingresada en el sistema.
              </h1>
              <div class="box-tools" style="width: 25%">
                <form class="form-horizontal">
                  <div class="input-group input-group-sm">
                    <input
                      type="text"
                      name="table_search"
                      class="form-control pull-right"
                      placeholder="Search"
                      v-model="search"
                      @input="search = $event.target.value.toUpperCase()"
                    />
                    <div class="input-group-btn">
                      <button type="submit" class="btn btn-default">
                        <i class="fa fa-search"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div class="panel-body table-responsive">
              <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                  <label class="pull-left"
                    >mostrando:
                    <b-form-select :options="pageOptions" v-model="perPage" />
                  </label>
                </div>
              </div>
              <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <button
                    type="button"
                    v-tooltip.botton="
                      'Al dar click recargara la sección en donde se muestran los estados de los expedientes'
                    "
                    class="btn btn-primary btn-lg pull-right"
                    @click="getAll"
                  >Recargar</button>
                </div>
              </div>
              <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

                </div>
              </div>
              <div class="row"><hr /></div>
              <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
                  <b-table
                    ref="selectableTable"
                    responsive
                    hover
                    small
                    flex
                    :fields="fields"
                    :items="items"
                    :filter="search"
                    :current-page="currentPage"
                    :per-page="perPage"
                    @filtered="onFiltered"
                  >
                  <!-- A virtual column -->
                  <template slot="actividad" slot-scope="data">
                    <span v-if="data.item.completo === false && data.item.congelado === false">Activo</span>
                    <span v-if="data.item.completo === false && data.item.congelado === true">Congelado</span>
                    <span v-if="data.item.completo === true && data.item.congelado === false">Congelado</span>
                  </template>
                  <template slot="opcion" slot-scope="data">
                    <div class="btn-group-vertical">
                      <a
                        class="btn btn-info btn-lg"
                        @click="seguimiento(data.item)"
                        v-tooltip.botton="
                          'Al dar click verá los seguimientos que pertenecen a la actuación con código ' +
                          data.item.codigo_barra
                        "
                        ><i class="fa fa-eye"></i
                      ></a>
                    </div>
                  </template>
                  </b-table>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-12">
                  <label v-if="totalRows > 0"
                    >Total: {{ totalRows }} registros en el sistema.</label
                  >
                  <div class="text-center">
                    <label v-if="totalRows === 0"
                      >No hay registros que mostrar</label
                    >
                  </div>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-12">
                  <label class="pull-right"
                    ><b-pagination
                      :total-rows="totalRows"
                      :per-page="perPage"
                      v-model="currentPage"
                      class="my-0 text-center"
                  /></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import FormError from "../shared/FormError";
export default {
  name: "EstadoActuacion",
  components: {
    FormError,
  },
  data() {
    return {
      loading: false,
      items: [],
      unidades: [],
      unidad: null,

      fields: [
        {
          key: "expediente_numero_expediente",
          label: "Número de Expediente",
          sortable: true,
        },
        {
          key: "actuacion_codigo_barra",
          label: "Código del Expediente",
          sortable: true,
        },
        { key: "estado_actuacion_unidad", label: "Unidad", sortable: true },
        { key: "direccion", label: "Dirección", sortable: true },
        { key: "estado_actuacion_usuario", label: "Usuario", sortable: true },
        { key: "estado", label: "Estado del Expediente", sortable: false },
        { key: "estado_actuacion_dias", label: "Días", sortable: false },
        { key: "actividad", label: "Estatus", sortable: false },
        { key: "opcion", label: "Acciones" },
      ],

      search: "",
      filter: null,
      currentPage: 1,
      perPage: 25,
      totalRows: 0,
      pageOptions: [5, 10, 25, 100],
      showStringEmpty: "no hay registros que mostrar",
    };
  },
  created() {
    let self = this;
    self.getAll();
  },
  computed: {},
  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    getAll() {
      let self = this;
      self.loading = true;

      self.$store.state.services.estadoactualService
        .getAll()
        .then((r) => {
          self.loading = false;
          console.log('r.data.data');
          console.log(r.data.data);
          self.items = r.data.data;
          self.unidades = r.data.unidades
          self.totalRows = self.items.length;
        })
        .catch((r) => {});
    },

    seguimiento(item){
      let self = this;
      let url =
        "/exp_mis_seguimiento/" +
        btoa(item.actuacion_codigo_barra) +
        "/" +
        btoa(item.actuacion_id) +
        "/" +
        btoa(0);
      self.$router.push({ path: url });
    },
  },
  mounted() {
    $("body").resize();
  },
};
</script>
