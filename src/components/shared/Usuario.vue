<template>
  <div>
    <div class="content-wrapper" v-loading="loading_user">
      <section class="content">
        <div class="row">
          <div class="col-md-12">
            <div class="box box-primary">
              <div class="box-header with-border">
                <h1 v-if="insertMode" class="box-title">
                  Asignacion de roles de acceso a usuario {{ usuario.nombre }}
                  {{ usuario.apellido }} en el sistema {{ getSystem }}
                </h1>
                <h1 v-if="!insertMode" class="box-title">
                  {{ getSystem }}
                </h1>
                <div class="box-tools pull-right"></div>
              </div>

              <div class="panel-body table-responsive" id="listadoregistros">
                
                  <div class="col-sm-12" v-if="gridMode">
                    <div class="row">
                      <div class="col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                          <label for="cui">Número de CUI</label>
                          <autocomplete
                            :search="buscar_cui"
                            placeholder="Buscar número de CUI"
                            aria-label="Buscar número de CUI"
                            @submit="seleccionarCUI"
                            :get-result-value="getResultValue"
                          >
                          </autocomplete>
                        </div>
                      </div>
                    </div>
                     <div class="row" v-if="ver_tags">
                      <div class="col-sm-12 col-md-6 col-lg-6">
                        <div class="form-group">
                          <label for="nombre">Nombre del usuario</label>
                          <input
                            v-model="form_user.nombre"
                            type="text"
                            class="form-control"
                            placeholder="escribir el nombre"
                            name="nombre"
                            v-validate="'required|min:3|max:50'"
                            data-vv-scope="form_user"
                            :class="{
                              input: true,
                              'has-errors': errors.has('form_user.nombre'),
                            }"
                            @input="
                              form_user.nombre = $event.target.value.toUpperCase()
                            "
                          />
                          <FormError
                            :attribute_name="'form_user.nombre'"
                            :errors_form="errors"
                          >
                          </FormError>
                        </div>
                      </div>
                      <div class="col-sm-12 col-md-6 col-lg-6">
                        <div class="form-group">
                          <label for="apellido">Apellido del usuario</label>
                          <input
                            v-model="form_user.apellido"
                            type="text"
                            class="form-control"
                            placeholder="escribir el apellido"
                            name="apellido"
                            v-validate="'required|min:3|max:50'"
                            data-vv-scope="form_user"
                            :class="{
                              input: true,
                              'has-errors': errors.has('form_user.apellido'),
                            }"
                            @input="
                              form_user.apellido = $event.target.value.toUpperCase()
                            "
                          />
                          <FormError
                            :attribute_name="'form_user.apellido'"
                            :errors_form="errors"
                          >
                          </FormError>
                        </div>
                      </div>
                      <div class="col-sm-12 col-md-3 col-lg-3">
                        <div class="form-group">
                          <label for="email">Correo electrónico</label>
                          <input
                            v-model="form_user.email"
                            type="text"
                            class="form-control"
                            placeholder="escribir el email"
                            name="email"
                            v-validate="'required|email|min:3|max:50'"
                            data-vv-scope="form_user"
                            :class="{
                              input: true,
                              'has-errors': errors.has('form_user.email'),
                            }"
                            @input="
                              form_user.email = $event.target.value.toLowerCase()
                            "
                          />
                          <FormError
                            :attribute_name="'form_user.email'"
                            :errors_form="errors"
                          >
                          </FormError>
                        </div>
                      </div>
                      <div
                        class="col-sm-12 col-md-3 col-lg-3 text-center"
                        v-if="isAdmin"
                      >
                        <label for="admin">¿Es Super Usuario?</label>
                        <enhanced-check
                          :label="
                            form_user.admin
                              ? 'SI ES SUPER USUARIO'
                              : 'NO ES SUPER USUARIO'
                          "
                          subClass="success"
                          :animate="true"
                          :inline="false"
                          v-model="form_user.admin"
                          v-validate="'required'"
                          data-vv-name="super usuario"
                          data-vv-scope="form_user"
                        ></enhanced-check>
                        <FormError
                          :attribute_name="'form_user.super usuario'"
                          :errors_form="errors"
                        >
                        </FormError>
                      </div>
                      <div class="col-sm-12 col-md-3 col-lg-3 text-center">
                        <label for="once_veintidos">¿Es Presupuestado?</label>
                        <enhanced-check
                          :label="
                            form_user.once_veintidos
                              ? 'SI ES PRESUPUESTADO'
                              : 'NO ES PRESUPUESTADO'
                          "
                          subClass="success"
                          :animate="true"
                          :inline="false"
                          v-model="form_user.once_veintidos"
                          v-validate="'required'"
                          data-vv-name="presupuestado"
                          data-vv-scope="form_user"
                        ></enhanced-check>
                        <FormError
                          :attribute_name="'form_user.presupuestado'"
                          :errors_form="errors"
                        >
                        </FormError>
                      </div>
                      <div class="col-sm-12 col-md-3 col-lg-3 text-center">
                        <label for="jefe">¿Es Jefe?</label>
                        <enhanced-check
                          :label="form_user.jefe ? 'SI ES JEFE' : 'NO ES JEFE'"
                          subClass="success"
                          :animate="true"
                          :inline="false"
                          v-model="form_user.jefe"
                          v-validate="'required'"
                          data-vv-name="jefe"
                          data-vv-scope="form_user"
                        ></enhanced-check>
                        <FormError
                          :attribute_name="'form_user.jefe'"
                          :errors_form="errors"
                        >
                        </FormError>
                      </div>
                      <div class="col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                          <label for="unidad_id">Unidad</label>
                          <multiselect
                            v-model="form_user.unidad_id"
                            :options="unidades"
                            placeholder="Seleccione uno por favor"
                            :searchable="true"
                            :allow-empty="true"
                            :preselect-first="true"
                            data-vv-name="unidad"
                            v-validate="'required'"
                            data-vv-scope="form_user"
                            :show-labels="false"
                            :show-no-result="true"
                            label="unidad"
                            track-by="id"
                          >
                            <span slot="noResult"
                              >No se encontró información</span
                            >
                          </multiselect>
                          <FormError
                            :attribute_name="'form_user.unidad'"
                            :errors_form="errors"
                          >
                          </FormError>
                        </div>
                      </div>
                      <div class="col-sm-12 col-md-12 col-lg-12">
                        <div class="box-footer">
                          <button
                            type="button"
                            class="btn btn-danger btn-block btn-large pull-left"
                            @click="clearDataU"
                          >
                            <i class="fa fa-ban"></i> Cancelar
                          </button>
                          <button
                            type="button"
                            class="btn btn-primary btn-block btn-large pull-right"
                            @click="guardarU('form_user')"
                          >
                            <i class="fa fa-save"></i> Guardar
                          </button>
                        </div>
                      </div>
                    </div>
              

                    <div class="row">
                      <div class="col-md-12">
                        <hr />
                      </div>
                    </div>

                    <b-row>
                      <b-col md="4" class="my-1 form-inline">
                        <label>Mostrando: </label>
                        <b-form-select
                          :options="pageOptions"
                          :class="'form-control'"
                          v-model="perPage"
                        />
                        <label>entradas </label>
                      </b-col>

                      <b-col class="my-1 form-group pull-right">
                        <b-input-group>
                          <b-form-input v-model="filter" placeholder="Buscar" />
                        </b-input-group>
                      </b-col>
                    </b-row>
                    <b-table
                      responsive
                      hover
                      small
                      flex
                      :fields="fields"
                      :items="items"
                      :filter="filter"
                      :current-page="currentPage"
                      :per-page="perPage"
                      :bordered="isBordered"
                      @filtered="onFiltered"
                    >
                      <!-- A virtual column -->
                      <template slot="id" slot-scope="data">
                        {{ data.item.id }}
                      </template>
                      <template slot="cui" slot-scope="data">
                        {{ data.item.dpi }}
                      </template>
                      <template slot="empleado" slot-scope="data">
                        {{ data.item.nombre + " " + data.item.apellido }}
                      </template>
                      <template slot="nombre_completo" slot-scope="data">
                        {{ data.item.unidad.nombre }}
                      </template>
                      <template slot="direccion" slot-scope="data">
                        {{ data.item.pertenece.nombre }}
                      </template>
                      <template slot="informacion" slot-scope="data">
                        <ul>
                          <li>
                            <small
                              >Fecha creación: {{ data.item.created_at }}
                            </small>
                          </li>
                          <li>
                            <small
                              >Fecha modifación: {{ data.item.updated_at }}
                            </small>
                          </li>
                          <li>
                            <small
                              >Fecha inactivo: {{ data.item.deleted_at }}
                            </small>
                          </li>
                        </ul>
                      </template>
                      <template slot="option" slot-scope="data">
                        <div class="btn-group-vertical">
                          <a
                            class="btn btn-info btn-lg"
                            @click="nuevo(data.item)"
                            v-tooltip.botton="
                              'Al dar click administrará los roles del usuario'
                            "
                            ><i class="fa fa-plus"></i> asignar roles</a
                          >
                          <a
                            class="btn btn-warning btn-lg"
                            @click="mapear(data.item)"
                            v-tooltip.botton="
                              'Al dar click editará la información del usuario'
                            "
                            ><i class="fa fa-pencil"></i> editar usuario</a
                          >
                          <a
                            :class="
                              data.item.deleted_at
                                ? 'btn btn-lg btn-success'
                                : 'btn btn-lg btn-danger'
                            "
                            @click="destroyUsario(data.item)"
                            v-tooltip.botton="
                              'Al dar click desactivará o activara el usuario'
                            "
                            ><i
                              :class="
                                data.item.deleted_at
                                  ? 'fa fa-thumbs-o-up'
                                  : 'fa fa-thumbs-o-down'
                              "
                            ></i>
                            {{ data.item.deleted_at ? 'Activar el usuario' : 'Desactivar el usuario' }}</a
                          >
                        </div>
                      </template>
                    </b-table>
                    <b-row>
                      <b-col md="12" class="my-1">
                        <label v-if="totalRows > 0"
                          >Total: {{ totalRows }} registros</label
                        >
                        <div class="text-center">
                          <label v-if="totalRows === 0"
                            >No hay registros que mostrar</label
                          >
                        </div>
                      </b-col>
                      <b-col class="my-1 pull-right">
                        <b-pagination
                          :total-rows="totalRows"
                          :per-page="perPage"
                          v-model="currentPage"
                          class="my-0 text-center"
                        />
                      </b-col>
                    </b-row>
                  </div>

                  <div v-if="insertMode">
                    <form role="form">
                      <div class="box-body">
                        <div class="row">
                          <div class="form-group col-md-12 col-sm-12 col-lg-12">
                            <label>Roles {{ getSystem }}</label>
                            <div
                              v-for="(rol, index) in roles"
                              v-bind:key="index"
                            >
                              <div class="form-inline col-md-4">
                                <input
                                  class="checkbox"
                                  type="checkbox"
                                  :value="rol.pivot.id"
                                  v-model="form.roles"
                                />
                                <label class="text-primary">
                                  {{ rol.nombre }}
                                </label>
                                <a
                                  class="btn btn-box-tool"
                                  @click="showDetails(rol)"
                                  ><i
                                    :class="
                                      !rol.showDetails
                                        ? 'fa fa-arrow-right'
                                        : 'fa fa-arrow-down'
                                    "
                                  ></i
                                ></a>
                                <div
                                  class="box box-solid"
                                  v-if="rol.showDetails"
                                  v-loading="loading"
                                >
                                  <div class="box-header with-border">
                                    <i class="fa fa-text-width"></i>
                                    <h4 class="box-title">Lista de permisos</h4>
                                    <br />
                                    <small class="text-info text-bold">{{
                                      rol.detalle
                                    }}</small>
                                  </div>

                                  <div class="box-body">
                                    <ul class="list-unstyled">
                                      <div
                                        v-for="(permiso, index) in permisos"
                                        v-bind:key="index"
                                      >
                                        <li>
                                          {{ permiso.text }}
                                          <ul
                                            v-for="(child,
                                            indexx) in permiso.childrens"
                                            v-bind:key="indexx"
                                          >
                                            <li>{{ child.text }}</li>
                                          </ul>
                                        </li>
                                      </div>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="box-footer pull-right">
                        <button
                          type="button"
                          class="btn btn-primary btn-sm"
                          @click="createOrEdit"
                        >
                          <i class="fa fa-save"></i> Guardar
                        </button>
                        <button
                          type="button"
                          class="btn btn-danger btn-sm"
                          @click="cancelar"
                        >
                          <i class="fa fa-undo"></i> Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
               
              </div>
                   
            </div>
          </div>
        </div>
      </section>
    </div>
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
  name: "Usuario",
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
      loading_user: false,
      expand: false,
      gridMode: true,
      insertMode: false,
      sistema: this.$store.state.sistema,
      usuario: {},
      roles: [],
      items: [],
      rol: {},
      permisos: [],
      fields: [
        { key: "id", label: "#", sortable: true },
        { key: "cui", label: "CUI", sortable: true },
        { key: "empleado", label: "Empleado", sortable: true },
        {
          key: "nombre_completo",
          label: "Unidad / Departamento",
          sortable: true,
        },
        { key: "direccion", label: "Dirección", sortable: true },
        { key: "informacion", label: "Información", sortable: true },
        { key: "option", label: "Opciones", sortable: false },
      ],

      isBordered: true,
      filter: null,
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      pageOptions: [5, 10, 25],
      showStringEmpty: "no hay registros que mostrar",

      unidades: [],
      ver_tags: false,

      form_user: {
        id: null,
        dpi: null,
        nombre: null,
        apellido: null,
        email: null,
        admin: false,
        once_veintidos: false,
        unidad_id: null,
        jefe: false,
      },

      form: {
        user_id: null,
        sistema_id: null,
        roles: [],
      },
    };
  },

  created() {
    let self = this;
    self.getAll();
    self.get(self.$store.state.sistema.id);
    self.user = self.$store.state.user;
  },

  methods: {
    //metodo on filteres
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    //obtener todos los items
    getAll() {
      let self = this;
      self.loading_user = true;
      self.$store.state.services.userService
        .getAll(self.sistema.id)
        .then((r) => {
          console.log(r.data);
          self.loading_user = false;
          self.items = r.data.data;
          self.unidades = r.data.unidades;
          self.items = self.items.filter((x) => !x.admin);
          self.totalRows = self.items.length;
          self.clearDataU();
        })
        .catch((r) => {});
    },

    //obtener todos los items
    get(id) {
      let self = this;
      self.loading = true;
      self.$store.state.services.sistemaService
        .getRoles(id)
        .then((r) => {
          console.log(r.data.data);
          r.data.data = r.data.data.map((obj) => ({
            ...obj,
            showDetails: false,
          }));
          self.roles = r.data.data;
          self.loading = false;
        })
        .catch((r) => {});
    },

    showDetails(data) {
      let self = this;
      if (data.showDetails) {
        data.showDetails = false;
        return;
      }
      self.roles.map((a) => (a.showDetails = false));
      data.showDetails = true;
      self.getMenuByRol(data);
    },

    getSistemaRol(id) {
      let self = this;
      self.loading = true;
      self.$store.state.services.userService
        .getSistemaRol(id, self.sistema.id)
        .then((r) => {
          console.log(r);
          self.form.roles = r.data.data.map((x) => x.id);
          self.loading = false;
        })
        .catch((r) => {});
    },

    //nuevo registro mostrar formulario esconder grid
    nuevo(data) {
      let self = this;
      self.form.roles = [];
      self.insertMode = true;
      self.gridMode = false;
      self.usuario = data;
      self.getSistemaRol(data.id);
    },

    createOrEdit() {
      let self = this;
      self.form.user_id = self.usuario.id;
      if (self.form.roles.length === 0) {
        self.$toastr.error("debe seleccionar al menos un rol", "error");
        return;
      } else {
        self.create();
      }
    },

    //funcion para guardar registro
    create() {
      let self = this;
      let data = self.form;
      data.sistema_id = self.sistema.id;

      self.loading = true;
      self.$store.state.services.userService
        .createRolUsuario(self.usuario.id, data)
        .then((r) => {
          self.loading = false;
          if (r.response) {
            this.$toastr.error(r.response.data.error, "error");
            return;
          }
          this.$toastr.success("roles asignados con éxito", "éxito");

          self.form.roles = [];
          self.insertMode = true;
          self.gridMode = false;
          self.nuevo(self.usuario);
        })
        .catch((r) => {});
    },

    //cancelar operacion
    cancelar() {
      let self = this;
      self.gridMode = true;
      self.insertMode = false;
      self.form.user_id = null;
      self.form.roles = null;
      self.form.sistema_id = null;
    },

    getMenuByRol(data) {
      let self = this;
      self.rol = data;
      self.loading = true;
      self.$store.state.services.rolSistemaService
        .getItemsMenu(data.pivot.id)
        .then((r) => {
          self.loading = false;
          self.mapMenu(r.data.data);
        })
        .catch((r) => {});
    },

    mapMenu(data) {
      let self = this;
      self.permisos = [];
      data.forEach(function (item) {
        if (item.padre_id === 0 && !item.escondido) {
          var object = new Object();
          object.icon = item.icon;
          object.text = item.text;
          object.path = item.path;
          object.childrens = [];

          data.forEach(function (child, i) {
            if (item.id === child.padre_id) {
              var object2 = new Object();
              object2.icon = child.icon;
              object2.text = child.text;
              object2.path = child.path;

              object.childrens.push(object2);
            }
          });
          self.permisos.push(object);
        }
      });
    },

    guardarU(scope) {
      let self = this;
      self.$validator.validateAll(scope).then((result) => {
        if (result) {
          self.form_user.id
            ? self.updateUsuario(self.form_user)
            : self.crearUsuario(self.form_user);
        } else {
          this.$toastr.error(
            "Verificar los datos del representante",
            "Mensaje"
          );
        }
      });
    },

    crearUsuario(data) {
      let self = this;
      self.loading = true;
      self.$store.state.services.userService
        .create(data)
        .then((r) => {
          self.loading = false;
          if (r.response) return;
          this.$toastr.success(r.data, "éxito");
          self.getAll();
        })
        .catch((r) => {});
    },

    updateUsuario(data) {
      let self = this;
      self.loading = true;
      self.$store.state.services.userService
        .update(data)
        .then((r) => {
          self.loading = false;
          if (r.response) return;
          this.$toastr.success(r.data, "éxito");
          self.getAll();
        })
        .catch((r) => {});
    },

    
    //funcion para eliminar registro
    destroyUsario(data) {
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
            self.$store.state.services.userService
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

    clearDataU() {
      let self = this;
      self.form_user.id = null;
      self.form_user.dpi = null;
      self.form_user.nombre = null;
      self.form_user.apellido = null;
      self.form_user.email = null;
      self.form_user.admin = false;
      self.form_user.once_veintidos = false;
      self.form_user.jefe = false;
      self.form_user.unidad_id = null;
      self.ver_tags = false;
      self.$validator.reset();
      self.$validator.reset();
    },

    mapear(item) {
      let self = this;
      self.form_user.id = item.id;
      self.form_user.dpi = item.dpi;
      self.form_user.nombre = item.nombre;
      self.form_user.apellido = item.apellido;
      self.form_user.email = item.email;
      self.form_user.admin = item.admin;
      self.form_user.once_veintidos = item.once_veintidos;
      self.unidades.forEach((element) => {
        if (element.id == item.unidad.id) {
          self.form_user.unidad_id = element;
        }
      });
      self.form_user.jefe = item.jefe;
      self.ver_tags = true;
    },

    buscar_cui(input) {
      let self = this;
      if (!isNaN(input)) {
        self.form_user.dpi = null;
        return new Promise((resolve) => {
          if (input.length < 3) {
            self.ver_tags = false;
            return resolve([]);
          }
          self.$store.state.services.userService.get(input).then((r) => {
            self.ver_tags = r.data.data.length > 0 ? false : true;
            self.form_user.dpi =
              r.data.data.length > 0 ? null : input.toUpperCase();
            resolve(r.data.data);
          });
        });
      } else {
        this.$toastr.error("Solo se aceptan números", "Mensaje");
      }
    },

    seleccionarCUI(result) {
      let self = this;
      if (result) {
        self.form_user.id = result.id;
        self.form_user.dpi = result.dpi;
        self.form_user.nombre = result.nombre;
        self.form_user.apellido = result.apellido;
        self.form_user.email = result.email;
        self.form_user.admin = result.admin;
        self.form_user.once_veintidos = result.once_veintidos;
        self.unidades.forEach((element) => {
          if (element.id == result.unidad.id) {
            self.form_user.unidad_id = element;
          }
        });
        self.form_user.jefe = result.jefe;
        this.ver_tags = true;
      } else {
        self.clearDataU();
      }
    },

    getResultValue(result) {
      if (result) {
        return result.dpi;
      }
    },
  },

  mounted() {
    $("body").resize();
  },

  computed: {
    getSystem() {
      let self = this;
      return (
        self.$store.state.sistema.nombre +
        " (" +
        self.$store.state.sistema.detalle +
        ")"
      );
    },

    isAdmin() {
      let self = this;
      if (self.user.admin) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
