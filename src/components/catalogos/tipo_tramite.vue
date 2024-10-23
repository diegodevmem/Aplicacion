<template>
  <div class="content-wrapper" v-loading="loading">
    <section class="content-header">
      <h1 class="label bg-primary">
        Tipo de Trámite
        <small style="color: white">Sistema de Catálogo</small>
      </h1>
      <br /><br />
      <ol class="label breadcrumb bg-gray">
        <router-link tag="li" to="/cat_default" exact>
          <i class="fa fa-home"></i> Home
        </router-link>
        <router-link tag="li" to="/" exact>
          <i class="fa fa-dashboard"></i> Dashboard
        </router-link>
        <li><i class="fa fa-bug active"></i> Tipo Trámite</li>
      </ol>
    </section>
    <br />
    <section class="content">
      <div class="row">
        <div class="col-sm-12 col-md-4 col-lg-4">
          <div :class="color">
            <div class="box-header with-border">
              <h1 class="box-title">
                <i class="fa fa-plus-square-o"></i> {{ titulo }}
              </h1>
            </div>

            <div class="box-body">
              <form role="form" autocomplete="off">
                <div class="form-group">
                  <label for="categoria_tramite_id"
                    >Categoría del Trámite</label
                  >
                  <multiselect
                    v-model="form.categoria_tramite_id"
                    @input="showPadre"
                    :options="categorias"
                    placeholder="Seleccione uno porfavor"
                    :searchable="true"
                    :allow-empty="false"
                    data-vv-name="categoría del trámite"
                    v-validate="'required'"
                    :show-labels="false"
                    label="nombre"
                    track-by="id"
                  >
                    <span slot="noResult">Ningún registro encontrado</span>
                  </multiselect>
                  <FormError
                    :attribute_name="'categoría del trámite'"
                    :errors_form="errors"
                  >
                  </FormError>
                </div>
                <div class="form-group">
                  <label for="tramite_id">Trámite</label>
                  <multiselect
                    v-model="form.tramite_id"
                    @input="getAsociacion"
                    :options="tramites"
                    placeholder="Seleccione uno porfavor"
                    :searchable="true"
                    :allow-empty="false"
                    data-vv-name="trámite"
                    v-validate="'required'"
                    :show-labels="false"
                    label="nombre"
                    track-by="id"
                  >
                    <span slot="noResult">Ningún registro encontrado</span>
                  </multiselect>
                  <FormError :attribute_name="'trámite'" :errors_form="errors">
                  </FormError>
                </div>
                <div class="form-group">
                  <label for="nombre">Nombre</label>
                  <textarea
                    cols="30"
                    rows="10"
                    v-model="form.nombre"
                    type="text"
                    class="form-control"
                    id="nombre"
                    placeholder="escribir el nombre"
                    name="nombre"
                    v-validate="'required|min:3|max:150'"
                    :class="{ input: true, 'has-errors': errors.has('nombre') }"
                    @input="form.nombre = $event.target.value.toUpperCase()"
                  />
                  <FormError :attribute_name="'nombre'" :errors_form="errors">
                  </FormError>
                </div>
                <div class="form-group" v-if="form.es_padre">
                  <label for="padre_id">Asociar tipo de trámite</label>
                  <multiselect
                    v-model="form.padre_id"
                    :options="asociaciones"
                    placeholder="Seleccione uno porfavor"
                    :searchable="true"
                    :allow-empty="false"
                    data-vv-name="asociar"
                    v-validate="'required'"
                    :show-labels="false"
                    label="nombre"
                    track-by="id"
                  >
                    <span slot="noResult">Ningún registro encontrado</span>
                  </multiselect>
                  <FormError :attribute_name="'asociar'" :errors_form="errors">
                  </FormError>
                </div>
              </form>
            </div>
            <div class="box-footer">
              <button
                type="button"
                class="btn btn-danger btn-sm pull-left"
                @click="clearData"
              >
                <i class="fa fa-ban"></i> Cancelar
              </button>
              <button
                type="button"
                class="btn btn-primary btn-sm pull-right"
                @click="createOrEdit"
              >
                <i class="fa fa-save"></i> Guardar
              </button>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-8 col-lg-8">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h1 class="box-title">
                <i class="fa fa-list"></i> Información ingresada en el sistema.
              </h1>
            </div>
            <div class="panel-body table-responsive" id="listadoregistros">
              <div class="row">
                
                <!-- <b-col class="my-1 form-group pull-right">
                  <b-input-group> -->
                    <!-- <b-form-input v-model="filter" placeholder="Buscar" /> -->
                  <!-- </b-input-group>
                </b-col> -->
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-4 pull-right">
                  <b-form-input v-model="filter" placeholder="Buscar Tramite" />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                  <label class="pull-left"
                    >mostrando:
                    <b-form-select :options="pageOptions" v-model="perPage" />
                  </label>
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
                    :filter="filter"
                    :fields="fields"
                    :items="items"
                    :current-page="currentPage"
                    :per-page="perPage"
                    @filtered="onFiltered"
                  >
                    <!-- A virtual column -->
                    <template slot="opcion" slot-scope="data">
                      <a class="btn btn-warning btn-md" @click="edit(data.item)"
                        ><i class="fa fa-pencil"></i
                      ></a>
                      <a
                        class="btn btn-info btn-sm"
                        @click="cog_proceso(data.item)"
                        >Configurar proceso</a
                      >
                      <a
                        class="btn btn-info btn-sm"
                        @click="cog_requisito(data.item)"
                        >Configurar requisito</a
                      >
                      <a
                        :class="
                          data.item.deleted_at
                            ? 'btn btn-md btn-success'
                            : 'btn btn-md btn-danger'
                        "
                        @click="destroy(data.item)"
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
  </div>
</template>

<script>
import LoginVue from '../login/Login.vue';
import FormError from "../shared/FormError";
export default {
  name: "TipoTramiteCat",
  components: {
    FormError,
  },
  data() {
    return {
      loading: false,
      items: [],
      categorias: [],
      tramites: [],
      asociaciones: [],

      fields: [
        { key: "categoria.nombre", label: "Categoría", sortable: true },
        { key: "tramite.nombre", label: "Trámite", sortable: true },
        { key: "nombre", label: "Nombre", sortable: true },
        { key: "opcion", label: "Acciones" },
      ],

      filter: null,
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      pageOptions: [5, 10, 25, 100],
      showStringEmpty: "no hay registros que mostrar",

      //formulario de campos
      form: {
        id: null,
        nombre: "",
        tramite_id: null,
        categoria_tramite_id: null,
        es_padre: false,
        padre_id: null,
      },
    };
  },
  created() {
    let self = this;
    self.getPromise();
  },
  computed: {
    titulo() {
      return !this.form.id
        ? "Formulario de Registro para Crear"
        : "Formulario de Registro para Editar";
    },
    color() {
      return !this.form.id ? "box box-primary" : "box box-warning";
    },
  },
  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    getPromise() {
      this.loading = true;
      Promise.all([this.getAll(), this.getCategoria(), this.getTramite()])
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$toastr.error("Ocurrió un error: " + error, "Error");
        });
    },

    getAll() {
      let self = this;
      self.loading = true;

      self.$store.state.services.tipotramiteService
        .getAll()
        .then((r) => {
          self.loading = false;
          self.items = r.data.data;
          self.totalRows = self.items.length;
        })
        .catch((r) => {});
    },

    getCategoria() {
      let self = this;
      self.categorias = [];
      self.$store.state.services.categoriatramiteService
        .getAll()
        .then((r) => {
          r.data.data.forEach((element) => {
            if (!element.deleted_at) self.categorias.push(element);
          });
        })
        .catch((r) => {});
    },

    getTramite() {
      let self = this;
      self.tramites = [];
      self.$store.state.services.tramiteService
        .getAll()
        .then((r) => {
          r.data.data.forEach((element) => {
            if (!element.deleted_at) self.tramites.push(element);
          });
        })
        .catch((r) => {});
    },

    getAsociacion() {
      let self = this;
      self.asociaciones = [];
      if (this.form.tramite_id) {
        self.$store.state.services.tipotramiteService
          .getAll()
          .then((r) => {
            r.data.data.forEach((element) => {
              if (
                !element.deleted_at &&
                element.tramite_id == this.form.tramite_id.id &&
                !element.categoria.necesita_padre
              )
                self.asociaciones.push(element);
            });
          })
          .catch((r) => {});
      }
    },

    showPadre() {
      let self = this;
      self.form.es_padre = false;
      if (this.form.categoria_tramite_id) {
        if (this.form.categoria_tramite_id.necesita_padre)
          self.form.es_padre = true;
      }
    },

    //funcion para guardar registro
    create() {
      let self = this;
      self.loading = true;

      self.$store.state.services.tipotramiteService
        .create(self.form)
        .then((r) => {
          self.loading = false;

          if (r.response) return;

          this.$toastr.success(r.data, "Mensaje");
          self.getAll();
          self.clearData();
        })
        .catch((r) => {
          console.log(r);
        });
    },

    //funcion para actualizar registro
    update() {
      let self = this;
      self.loading = true;

      self.$store.state.services.tipotramiteService
        .update(self.form)
        .then((r) => {
          self.loading = false;

          if (r.response) return;

          this.$toastr.success(r.data, "Mensaje");
          self.getAll();
          self.clearData();
        })
        .catch((r) => {
          console.log(r);
        });
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
            self.$store.state.services.tipotramiteService
              .destroy(data)
              .then((r) => {
                self.loading = false;

                if (r.response) return;

                this.$toastr.success(r.data, "Mensaje");
                self.getAll();
                self.clearData();
              })
              .catch((r) => {
                console.log(r);
              });
          }
        });
    },

    //limpiar data de formulario
    clearData() {
      let self = this;

      Object.keys(self.form).forEach(function (key, index) {
        if (typeof self.form[key] === "string") self.form[key] = null;
        else if (typeof self.form[key] === "boolean") self.form[key] = false;
        else if (typeof self.form[key] === "number") self.form[key] = null;
      });

      this.form.tramite_id = null;
      this.form.categoria_tramite_id = null;
      this.form.es_padre = false;
      this.form.padre_id = null;

      self.$validator.reset();
      self.$validator.reset();
    },

    //editar registro
    edit(data) {
      let self = this;
      self.mapData(data);
    },

    //mapear datos a formulario
    mapData(data) {
      let self = this;
      self.form.es_padre = false;
      self.form.id = data.id;
      self.form.nombre = data.nombre;
      self.form.categoria_tramite_id = data.categoria;
      self.form.tramite_id = data.tramite;
      self.form.padre_id = data.padre;
      if (data.padre.id != data.id) {
        self.form.es_padre = true;
      }
    },

    //funcion, validar si se guarda o actualiza
    createOrEdit() {
      let self = this;
      self.$validator.validateAll().then((result) => {
        if (result) {
          self.form.id > 0 && self.form.id !== null
            ? self.update()
            : self.create();
        }
      });
    },

    //Redirecciones
    cog_proceso(item) {
      let self = this;
      self.$router.push({
        path: `cat_unidad_tramite/${item.id}`,
      });
    },

    cog_requisito(item) {
      let self = this;
      self.$router.push({
        path: `cat_tramite_requisito/${item.id}`,
      });
    },
  },
  mounted() {
    $("body").resize();
  },
};
</script>
