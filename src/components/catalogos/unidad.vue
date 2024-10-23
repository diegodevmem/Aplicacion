<template>
  <div class="content-wrapper" v-loading="loading">
    <section class="content-header">
      <h1 class="label bg-primary">
        Unidades
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
        <li><i class="fa fa-bug active"></i> Unidad</li>
      </ol>
    </section>
    <br />
    <section class="content">
      <div class="row">
        <div class="col-sm-12 col-md-4 col-lg-4">
          <div :class="color">
            <div class="box-header with-border">
              <h1 class="box-title">
                <i class="fa fa-plus-square-o"></i>
                {{ titulo }}
              </h1>
            </div>

            <div class="box-body">
              <form role="form" autocomplete="off">
                <div class="form-group">
                  <label for="nombre_unidad">Nombre de la Unidad</label>
                  <input
                    v-model="form.nombre"
                    type="text"
                    class="form-control"
                    id="nombre"
                    v-validate="'required'"
                    placeholder="escribir el nombre de la unidad"
                    name="nombre"
                    :class="{ input: true, 'has-errors': errors.has('nombre') }"
                  />
                  <FormError :attribute_name="'nombre'" :errors_form="errors">
                  </FormError>
                </div>

                <div class="form-group">
                  <label for="abreviatura">Abreviatura</label>
                  <input
                    v-model="form.abreviatura"
                    type="text"
                    class="form-control"
                    id="abreviatura"
                    v-validate="'required'"
                    placeholder="escribir la abreviatura de la unidad"
                    name="abreviatura"
                    :class="{
                      input: true,
                      'has-errors': errors.has('abreviatura'),
                    }"
                    @input="
                      form.abreviatura = $event.target.value.toUpperCase()
                    "
                  />
                  <FormError
                    :attribute_name="'abreviatura'"
                    :errors_form="errors"
                  >
                  </FormError>
                </div>

                <div class="form-group">
                  <label for="padre_id">Nombre del Padre</label>
                  <multiselect
                    v-model="form.padre_id"
                    :options="nombrepadre"
                    placeholder="Seleccione uno porfavor"
                    :searchable="true"
                    :allow-empty="false"
                    data-vv-name="padre"
                    v-validate="'required'"
                    :show-labels="false"
                    label="nombre"
                    track-by="id"
                  >
                    <span slot="noResult">Ningún registro encontrado</span>
                  </multiselect>
                  <FormError :attribute_name="'padre'" :errors_form="errors">
                  </FormError>
                </div>
                <div class="form-group">
                  <label for="direccion_id">Nombre de la Direccion</label>
                  <multiselect
                    v-model="form.direccion_id"
                    :options="nombredireccion"
                    placeholder="Seleccione uno porfavor"
                    :searchable="true"
                    :allow-empty="false"
                    data-vv-name="direccion"
                    v-validate="'required'"
                    :show-labels="false"
                    label="nombre"
                    track-by="id"
                  >
                    <span slot="noResult">Ningún registro encontrado</span>
                  </multiselect>
                  <FormError
                    :attribute_name="'direccion'"
                    :errors_form="errors"
                  >
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
                    :current-page="currentPage"
                    :per-page="perPage"
                    @filtered="onFiltered"
                  >
                    <!-- A virtual column -->
                    <template slot="opcion" slot-scope="data">
                      <a class="btn btn-warning btn-md" @click="edit(data.item)"
                        ><i class="fa fa-pencil"> </i
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
  name: "UnidadCat",
  components: {
    FormError,
  },
  data() {
    return {
      loading: false,
      items: [],
      nombrepadre: [],
      nombredireccion: [],

      fields: [
        { key: "abreviatura", label: "Abreviatura", sortable: true },
        { key: "nombre", label: "Nombre", sortable: true },
        { key: "padre", label: "Padre", sortable: true },
        { key: "direccion", label: "Direccion", sortable: true },
        { key: "opcion", label: "Acciones" },
      ],

      filter: null,
      currentPage: 1,
      perPage: 15,
      totalRows: 0,
      pageOptions: [15, 25, 100],
      showStringEmpty: "no hay registros que mostrar",

      //formulario de campos
      form: {
        id: null,
        nombre: "",
        abreviatura: null,
        padre_id: null,
        id_padre: null,
        direccion_id: null,
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
      Promise.all([this.getAll(), this.getPadre(), this.getDireccion()])
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$toastr.error("Ocurrió un error: " + error, "Error");
        });
    },

    //funcion para mostrar todo
    getAll() {
      let self = this;
      self.loading = true;
      self.$store.state.services.unidadService
        .getAll()
        .then((r) => {
          self.loading = false;
          self.items = r.data.data;
          self.totalRows = self.items.length;
        })
        .catch((r) => {
          console.log(r);
        });
    },

    getPadre() {
      let self = this;
      self.nombrepadre = [];
      self.$store.state.services.unidadpadreService
        .getAll()
        .then((r) => {
          r.data.data.forEach((element) => {
            if (!element.deleted_at) self.nombrepadre.push(element);
          });
        })
        .catch((r) => {});
    },

    getDireccion() {
      let self = this;
      self.nombredireccion = [];
      self.$store.state.services.unidaddireccionService
        .getAll()
        .then((r) => {
          r.data.data.forEach((element) => {
            if (!element.deleted_at) self.nombredireccion.push(element);
          });
        })
        .catch((r) => {});
    },

    //funcion para guardar registro
    create() {
      let self = this;
      self.loading = true;
      self.$store.state.services.unidadService
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
      self.$store.state.services.unidadService
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
            self.$store.state.services.unidadService
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
        else if (typeof self.form[key] === "object") self.form[key] = null;
        else if (typeof self.form[key] === "boolean") self.form[key] = false;
        else if (typeof self.form[key] === "number") self.form[key] = null;
      });

      this.form.id = null;
      this.form.abreviatura = null;
      this.form.nombre = null;
      this.form.padre_id = null;
      this.form.direccion_id = null;

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
      let padre = { id: data.padre_id, nombre: data.padre };
      let direccion = { id: data.direccion_id, nombre: data.direccion };
      self.form.id = data.id;
      self.form.abreviatura = data.abreviatura;
      self.form.nombre = data.nombre;
      self.form.padre_id = padre;
      self.form.direccion_id = direccion;
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
