<template>
  <div class="content-wrapper">
    <section class="content-header">
      <h1 class="label bg-primary">
        Empresas
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
        <li><i class="fa fa-bug active"></i> Empresas</li>
      </ol>
    </section>
    <br />
    <section class="content" v-loading="loading">
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
                  <label for="razon_social">Razón Social</label>
                  <textarea
                    v-model="form.razon_social"
                    type="text"
                    class="form-control"
                    id="razon_social"
                    placeholder="escribir la razón social"
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

                <div class="form-group">
                  <label for="tipo_razon_social">Tipo Razón Social</label>
                  <multiselect
                    v-model="form.tipo_razon_social"
                    :options="tipos_razones"
                    placeholder="Seleccione uno por favor"
                    :searchable="false"
                    :allow-empty="true"
                    :preselect-first="false"
                    data-vv-name="tipo de razon social"
                    v-validate="'required'"
                    :show-labels="false"
                    :show-no-result="true"
                    label="nombre"
                    track-by="id"
                  >
                    <span slot="noResult">No se encontró información</span>
                  </multiselect>
                  <FormError
                    :attribute_name="'tipo de razon social'"
                    :errors_form="errors"
                  >
                  </FormError>
                </div>

                <div class="form-group">
                  <label for="nit">No. NIT</label>
                  <input
                    v-model="form.nit"
                    type="text"
                    class="form-control"
                    id="nit"
                    placeholder="escribir el NIT"
                    name="nit"
                    v-validate="
                      'required|min:5|max:15|regex:^[0-9]+(-?[0-9kK])?$'
                    "
                    :class="{ input: true, 'has-errors': errors.has('nit') }"
                    @input="form.nit = $event.target.value.toUpperCase()"
                  />
                  <FormError :attribute_name="'nit'" :errors_form="errors">
                  </FormError>
                </div>

                <div class="form-group">
                  <label for="patente"
                    >Número de registro de patente de empresa:</label
                  >
                  <input
                    v-model="form.patente"
                    type="text"
                    class="form-control"
                    placeholder="escribir el número de la patente"
                    name="número de la patente"
                    v-validate="'min:3|max:18'"
                    :class="{
                      input: true,
                      'has-errors': errors.has('número de la patente'),
                    }"
                    @input="form.patente = $event.target.value.toUpperCase()"
                  />
                  <FormError
                    :attribute_name="'número de la patente'"
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
import {
  EnhancedCheck,
  EnhancedCheckGroup,
  EnhancedCheckRadio,
  EnhancedToggle,
} from "vue-enhanced-check";
export default {
  name: "EmpresaExp",
  components: {
    FormError,
    EnhancedCheck,
    EnhancedCheckGroup,
    EnhancedCheckRadio,
    EnhancedToggle,
  },
  data() {
    return {
      loading: false,
      items: [],
      tipos_razones: [],

      fields: [
        { key: "razon_social", label: "Razón Social", sortable: true },
        {
          key: "tipo_razon_social",
          label: "Tipo Razón Social",
          sortable: true,
        },
        { key: "nit", label: "No. NIT", sortable: true },
        { key: "patente", label: "Patente", sortable: true },
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
        razon_social: null,
        tipo_razon_social: null,
        nit: null,
        patente: null,
      },
    };
  },

  created() {
    let self = this;
    self.getAll();
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
      Promise.all([this.getTipoRazonSocial()])
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$toastr.error("Ocurrió un error: " + error, "Error");
        });
    },

    getTipoRazonSocial() {
      this.tipos_razones = [];
      this.tipos_razones.push({
        id: "PERSONA INDIVIDUAL",
        nombre: "PERSONA INDIVIDUAL",
      });
      this.tipos_razones.push({
        id: "PERSONA JURIDICA",
        nombre: "PERSONA JURIDICA",
      });
      this.tipos_razones.push({
        id: "COOPROPIETARIO",
        nombre: "COOPROPIETARIO",
      });
    },

    async getAll() {
      this.loading = true;
      try {
        let r = await this.$store.state.services.empresaService.getAll();
        this.items = r.data.data;
        this.totalRows = this.items.length;
        await this.getNit();
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },

    async getNit() {
      try {
        let r = await this.$store.state.services.empresaService.get();
        this.$store.state.nits = r.data.data;
      } catch (error) {
        this.$toastr.error("Ocurrió un error: " + r, "Error");
        console.log(r);
      }
    },

    //funcion para guardar registro
    create() {
      let self = this;
      self.loading = true;

      self.$store.state.services.empresaService
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

      self.$store.state.services.empresaService
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
            self.$store.state.services.empresaService
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
        if (typeof self.form[key] === "string") self.form[key] = "";
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
      self.form.razon_social = data.razon_social;
      self.form.tipo_razon_social = data.tipo_razon_social;
      self.form.nit = data.nit;
      self.form.patente = data.patente;

      this.tipos_razones.forEach((element) => {
        if (element.id == data.tipo_razon_social) {
          this.form.tipo_razon_social = element;
        }
      });
    },

    //funcion, validar si se guarda o actualiza
    createOrEdit() {
      let self = this;
      //self.form.tipo_razon_social = 'PERSONA INDIVIDUAL';

      self.$validator.validateAll().then((result) => {
        if (result) {
          self.form.id > 0 && self.form.id !== null
            ? self.update()
            : self.create();
        } else {
          this.$toastr.error("Verificar los datos", "Mensaje");
        }
      });
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
