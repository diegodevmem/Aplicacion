<template>
  <div class="content-wrapper">
    <section class="content-header">
      <h1 class="label bg-primary">
        Expedientes
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
            <li><i class="fa fa-bug active"></i> Expediente</li>
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
                      'Al dar click le mostrará el formulario para crear un nuevo expediente'
                    "
                    class="btn btn-primary btn-lg pull-right"
                    @click="crear()"
                  >
                    <i class="fa fa-folder"></i> Crear nuevo expediente matriz
                  </button>
                </div>
              </div>
              <div class="row"><hr /></div>
              <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
                  <b-table
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
                    <template slot="opcion" slot-scope="data">
                      <a
                        class="btn btn-info btn-md"
                        @click="actuaciones(data.item)"
                        v-tooltip.botton="
                          'Al dar click verá las actuaciones que pertenecen al expediente ' +
                          data.item.numero_expediente
                        "
                        ><i class="fa fa-plus"></i
                      ></a>
                      <a
                        class="btn btn-primary btn-md"
                        @click="caratula(data.item)"
                        v-tooltip.botton="
                          'Al dar click imprimirá la caratula del expediente seleccionado ' +
                          data.item.numero_expediente
                        "
                        ><i class="fa fa-print"></i
                      ></a>
                      <a
                        v-if="limitar && !data.item.completado"
                        :class="
                          data.item.deleted_at
                            ? 'btn btn-md btn-success'
                            : 'btn btn-md btn-danger'
                        "
                        @click="destroy(data.item)"
                        v-tooltip.botton="
                          'Al dar click eliminará, desactivará o activara el expediente'
                        "
                        ><i
                          :class="
                            data.item.deleted_at
                              ? 'fa fa-thumbs-o-up'
                              : 'fa fa-thumbs-o-down'
                          "
                        ></i
                      ></a>
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

    <!-- Modal para mostrar los documentos de la actuacion seleccionada -->
    <div :class="abrirModalDocumento" data-backdrop="static" v-bind:style="styleObjectDocumento" v-loading="loading">
      <div class="modal-dialog modal-lg" style="width: 80%; height: 80%">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">
              Caratula
              <button
                type="button"
                @click="cancel_showDocumento"
                class="btn btn-danger btn-xs pull-right"
              >
                <i class="fa fa-close"></i>
              </button>
            </h2>
          </div>

          <div class="modal-body text-center" v-if="modalDocumento">
            <div class="row">
              <div class="col-md-12">
                <embed :src="src" type="application/pdf" width="100%" height="100%" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import FormError from "../shared/FormError";
export default {
  name: "ExpedienteExp",
  components: {
    FormError,
  },
  data() {
    return {
      loading: false,
      items: [],
      abrirModalDocumento: "modal fade",
      styleObjectDocumento: {},
      modalDocumento: false,
      src: "",

      fields: [
        {
          key: "numero_expediente",
          label: "Número de Expediente",
          sortable: true,
        },
        { key: "tipo_tramite", label: "Trámite", sortable: true },
        { key: "folio_actual", label: "Cantidad de Folios", sortable: true },
        {
          key: "folio_inicial",
          label: "Cantidad de Folios Inicial",
          sortable: true,
        },
        { key: "anio", label: "Año", sortable: true },
        { key: "fecha_ingreso", label: "Fecha de Ingreso", sortable: true },
        { key: "opcion", label: "Acciones" },
      ],

      search: "",
      filter: null,
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      pageOptions: [5, 10, 25, 100],
      showStringEmpty: "no hay registros que mostrar",
    };
  },
  created() {
    let self = this;
    self.getAll();
  },
  computed: {
    limitar() {
      return this.$store.state.roles.some(
        item => item.rol.nombre.toLowerCase() === "administrador"
      );
    }
  },
  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    getAll() {
      let self = this;
      self.loading = true;

      self.$store.state.services.expedienteService
        .getAll()
        .then((r) => {
          self.loading = false;
          self.items = r.data;
          self.totalRows = self.items.length;
        })
        .catch((r) => {});
    },

    //funcion para eliminar registro
    destroy(data) {
      let self = this;
      let title = !data.deleted_at ? "Desactivar" : "Activar";
      let type = !data.deleted_at ? "error" : "success";
      self
        .$swal({
          title: title,
          text: "¿Está seguro de realizar esta acción?",
          type: type,
          showCancelButton: true,
        })
        .then((result) => {
          if (result.value) {
            self.loading = true;
            self.$store.state.services.expedienteService
              .destroy(data)
              .then((r) => {
                self.loading = false;

                if (r.response) return;

                this.$toastr.success(r.data, "Mensaje");
                self.getAll();
              })
              .catch((r) => {
                console.log(r);
              });
          }
        });
    },

    crear() {
      let self = this;
      let id = btoa(0);
      let url = "/crear/expediente/" + id + "/" + id + "/matriz/" + id;
      console.log('url');
      console.log(url);
      self.$router.push({ path: url });
    },

    actuaciones(item) {
      let self = this;
      let url =
        "/exp_actuaciones/" +
        btoa(item.tipo_tramite_id) +
        "/" +
        btoa(item.numero_expediente.toLowerCase()) +
        "/" +
        btoa(item.id);
      self.$router.push({ path: url });
    },

    caratula(item) {
      let self = this;
      self.loading = true;
      self.$store.state.services.caratulaexpedienteService
        .getCaratulaExpediente(item.id)
        .then((r) => {
          this.src = r.data;
          self.styleObjectDocumento.display = "block";
          self.abrirModalDocumento = "modal fade in";
          self.modalDocumento = true;
          self.loading = false;
        })
        .catch((r) => {});
    },

    cancel_showDocumento() {
      let self = this;
      self.styleObjectDocumento.display = "";
      self.abrirModalDocumento = "modal fade";
      self.modalDocumento = false;
    },
  },
  mounted() {
    $("body").resize();
  },
};
</script>
