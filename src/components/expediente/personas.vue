<template>
  <div class="content-wrapper" v-loading="loading">
    <section class="content-header">
      <h1 class="label bg-primary">
        Personas
        <small style="color: white">Sistema de Expedientes</small>
      </h1>
      <br /><br />
      <ol class="label breadcrumb bg-gray">
        <router-link tag="li" to="/cat_default" exact>
          <i class="fa fa-home"></i> Home
        </router-link>
        <router-link tag="li" to="/" exact>
          <i class="fa fa-dashboard"></i> Dashboard
        </router-link>
        <li><i class="fa fa-bug active"></i> Personas</li>
      </ol>
    </section>
    <br />
    <section class="content">
      <div class="row">
        <div class="col-sm-12 col-md-4 col-lg-4">
          <div :class="color" id="p1">
            <div class="box-header with-border">
              <h1 class="box-title">
                <i class="fa fa-plus-square-o"></i> {{ titulo }}
              </h1>
            </div>

            <div class="box-body">
              <form role="form" autocomplete="off">
                <div class="form-group">
                  <label for="dpi">No. DPI</label>
                  <input
                    v-model="form.dpi"
                    type="text"
                    class="form-control"
                    id="dpi"
                    placeholder="escribir el dpi"
                    name="dpi"
                    v-validate="
                      'required|min:5|max:20|regex:^[A-Z0-9]+(-?[0-9kK])?$'
                    "
                    :class="{ input: true, 'has-errors': errors.has('dpi') }"
                    @input="form.dpi = $event.target.value.toUpperCase()"
                  />
                  <FormError :attribute_name="'dpi'" :errors_form="errors">
                  </FormError>
                </div>
                <div class="form-group">
                  <label for="razon_social">Nombre</label>
                  <textarea
                    v-model="form.razon_social"
                    type="text"
                    class="form-control"
                    id="razon_social"
                    placeholder="escribir el nombre"
                    name="razon_social"
                    v-validate="'required|min:3|max:100'"
                    :class="{
                      input: true,
                      'has-errors': errors.has('razon_social'),
                    }"
                    @input="
                      form.razon_social = $event.target.value.toUpperCase()
                    "
                  />
                  <FormError
                    :attribute_name="'razon_social'"
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
                v-if="esconder"
                class="btn btn-primary btn-sm pull-right"
                @click="createOrEdit"
              >
                <i class="fa fa-save"></i> Guardar
              </button>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-8 col-lg-8">
          <div class="box box-primary" id="p1">
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

                      <a
                        class="btn btn-info btn-md"
                        @click="mant_tel(data.item)"
                        ><i class="fa fa-phone"></i
                      ></a>

                      <a
                        class="btn btn-info btn-md"
                        @click="mant_correo(data.item)"
                        ><i class="fa fa-envelope-open"></i
                      ></a>

                      <!-- <a class="btn btn-info btn-md" @click="mant_direccion(data.item)"
                        ><i class="fa fa-home"></i
                      ></a>                                             -->
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
  name: "PersonasExp",
  components: {
    FormError,
  },
  data() {
    return {
      loading: false,
      items: [],
      esconder: false,

      fields: [
        { key: "dpi", label: "No. DPI", sortable: true },
        { key: "razon_social", label: "Nombre", sortable: true },
        { key: "opcion", label: "Acciones" },
      ],

      filter: null,
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      pageOptions: [5, 10, 25, 100],
      showStringEmpty: "no hay registros que mostrar",

      //formulario de campos
      form: {
        id: "",
        dpi: "",
        razon_social: "",
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

  watch: {
    "form.dpi"() {
      if (this.form.dpi != "" && this.form.razon_social != "") {
        this.esconder = true;
      } else {
        this.esconder = false;
      }
    },
    "form.razon_social"() {
      if (this.form.dpi != "" && this.form.razon_social != "") {
        this.esconder = true;
      } else {
        this.esconder = false;
      }
    },
  },
  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    getPromise() {
      this.loading = true;
      Promise.all([this.getAll()])
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$toastr.error("Ocurrió un error: " + error, "Error");
        });
    },

    async getAll() {
      this.loading = true;
      try {
        let r = await this.$store.state.services.personasService.getAll();
        this.items = r.data.data;
        this.totalRows = this.items.length;
        this.loading = false;
        await this.getCui();
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },

    async getCui() {
      try {
        let r = await this.$store.state.services.razonsocialService.get();
        this.$store.state.cuis = r.data;
      } catch (error) {
        this.$toastr.error("Ocurrió un error: " + r, "Error");
        console.log(r);
      }
    },

    //funcion para guardar registro
    create() {
      let self = this;
      self.loading = true;

      self.$store.state.services.personasService
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

      self.$store.state.services.personasService
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
            self.$store.state.services.personasService
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

      self.$validator.reset();
      self.$validator.reset();

      self.esconder = false;
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
      self.form.dpi = data.dpi;
      self.form.razon_social = data.razon_social;

      self.esconder = true;
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
    mant_tel(item) {
      let self = this;
      self.$router.push({
        path: `exp_telefono/${item.id}/${item.razon_social}`,
      });
      console.log(item);
    },

    mant_correo(item) {
      let self = this;
      self.$router.push({
        path: `exp_correo/${item.id}/${item.razon_social}`,
      });
      console.log(item);
    },

    mant_direccion(item) {
      let self = this;
      self.$router.push({
        path: `exp_direccionrs/${item.id}/${item.razon_social}`,
      });
      console.log(item);
    },
  },

  mounted() {
    $("body").resize();
  },
};
</script>

<style scoped >
@import "../../dist/css/desing_profile/diseno.css";
</style>
