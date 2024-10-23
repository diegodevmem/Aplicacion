<template>
  <div class="content-wrapper">
    <section class="content-header">
      <h1 class="label bg-primary">
        Pasos
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
        <li><i class="fa fa-bug active"></i> Pasos</li>
      </ol>
    </section>
    <br />
    <section class="content" v-loading="loading">
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
                  <label for="nombre">Nombre</label>
                  <textarea
                    cols="30"
                    rows="10"
                    v-model="form.nombre"
                    type="textarea"
                    class="form-control"
                    id="nombre"
                    placeholder="escribir el nombre"
                    name="nombre"
                    v-validate="'required|min:3|max:60'"
                    :class="{ input: true, 'has-errors': errors.has('nombre') }"
                    @input="form.nombre = $event.target.value.toUpperCase()"
                  />               
                  <FormError :attribute_name="'nombre'" :errors_form="errors">
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
                    :fields="fields"
                    :items="items"
                    :filter="form.nombre"
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
import FormError from "../shared/FormError";
export default {
  name: "PasoCat",
  components: {
    FormError,
  },
  data() {
    return {
      loading: false,
      items: [],

      fields: [
        { key: "nombre", label: "Nombre", sortable: true },
        { key: "direccion.nombre", label: "Dirección", sortable: true },
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
      },
    };
  },
  created() {
    let self = this;
    self.getAll();
  },
  computed: {
      titulo () {
          return !this.form.id ? 'Formulario de Registro para Crear' : 'Formulario de Registro para Editar'
      },
      color () {
          return !this.form.id ? 'box box-primary' : 'box box-warning'
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

      self.$store.state.services.pasoService
        .getAll()
        .then((r) => {
          self.loading = false;
          self.items = r.data.data;
          self.totalRows = self.items.length;
        })
        .catch((r) => {});
    },

    //funcion para guardar registro
    create() {
      let self = this;
      self.loading = true;

      self.$store.state.services.pasoService
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

      self.$store.state.services.pasoService
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
            self.$store.state.services.pasoService
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
      self.form.id = data.id;
      self.form.nombre = data.nombre;
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
  },
  mounted() {
    $("body").resize();
  },
};
</script>