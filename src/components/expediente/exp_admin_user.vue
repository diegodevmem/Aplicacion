<template>
  <div class="content-wrapper" v-loading="loading">
    <div v-if="mostrar">
      <section class="content-header">
        <h1 class="label bg-primary">
          Administrar Usuarios
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
          <li><i class="fa fa-bug active"></i> Tipo Trámite</li>
        </ol>
      </section>
      <br />
      <section class="content">
        <div class="row">
          <div class="col-md-12">
            <div :class="color" id="p0">
              <div class="box-header with-border">
                <h1 class="box-title">
                  <i class="fa fa-plus-square-o"></i> Administracion de Usuarios
                </h1>
              </div>

              <div class="box-body" >
                <form role="form" autocomplete="off">
                  <div class="form-group">
                    <label for="categoria_tramite_id"
                      >Usuario</label
                    >
                    <multiselect
                      v-model="form.usuario"
                      @input="show"
                      :options="usuarios"
                      placeholder="Seleccione uno porfavor"
                      :searchable="true"
                      :allow-empty="false"
                      data-vv-name="categoría del trámite"
                      v-validate="'required'"
                      :show-labels="false"
                      label="text"
                      track-by="id"
                    >
                      <span slot="noResult">Ningún registro encontrado</span>
                    </multiselect>
                    <FormError
                      :attribute_name="'Usuario'"
                      :errors_form="errors"
                    >
                    </FormError><br>
                    <div v-if="form.usuario !== null" class="row">
                      <div class="col-md-3">
                        <label>NOMBRE: </label><br>
                        <span v-text="form.usuario.nombre+' '+form.usuario.apellido"></span><br><br>
                      </div>
                      <div class="col-md-3">
                        <label>DPI: </label><br>
                        <span v-text="form.usuario.dpi"></span><br><br>
                      </div>
                      <div class="col-md-3">
                        <label>DIRECCION: </label><br>
                        <span v-text="form.usuario.direccion+' ('+form.usuario.abreviatura+')'"></span><br><br>
                      </div>
                      <div class="col-md-3">
                        <label>UNIDAD: </label><br>
                        <span v-text="form.usuario.unidad"></span><br><br>
                      </div>
                    </div>

                    <div v-if="activo" class="row">
                      <div class="col-md-12">
                        <label>ESTADO: </label><br><br>
                      </div>

                      <div class="col-md-3">
                        <label class="radios">ACTIVO
                          <input type="radio" @click="seleccion(1)" :checked="this.form.estados[0].activo" name="radio">
                          <span class="checkmark"></span>
                        </label>
                      </div>
                      <div class="col-md-3">
                        <label class="radios">INACTIVO
                          <input type="radio" @click="seleccion(2)" :checked="this.form.estados[0].inactivo" name="radio">
                          <span class="checkmark"></span>
                        </label>
                      </div>
                      <div class="col-md-3">
                        <label class="radios">DE BAJA
                          <input type="radio" @click="seleccion(0)" :checked="this.form.estados[0].baja" name="radio">
                          <span class="checkmark"></span>
                        </label>
                      </div>
                    </div>

                    <div v-if="fechas" class="row">
                      <br>
                      <!-- <div class="col-md-3"></div> -->
                      <div class="col-md-3">
                        <label>FECHA INICIO: </label><br>
                        <date-picker
                          v-model="form.fechaInicio"
                          :disabled-date="notAfterToday"
                          placeholder="Seleccione fecha de inicio"
                          value-type="date"
                          v-validate="'required'"
                          data-vv-name="fecha inicio"
                          format="YYYY-MM-DD">
                        </date-picker>
                        <br>
                        <span style="color: red">ESTA FECHA ES REQUERIDA</span>
                        <br>
                        <FormError
                          :attribute_name="'fecha inicio'"
                          :errors_form="errors"
                        >
                        </FormError>
                      </div>
                      <div class="col-md-6">
                        <label>FECHA FIN: </label><br>
                        <date-picker
                          v-model="form.fechaFin"
                          placeholder="Seleccione fecha de fin"
                          :disabled-date="notAfterDate"
                          value-type="date"
                          v-validate="'required'"
                          data-vv-name="fecha fin"
                          format="YYYY-MM-DD">
                        </date-picker>
                        <br>
                        <span style="color: red">ESTA FECHA ES REQUERIDA</span>
                        <br>
                        <FormError
                          :attribute_name="'fecha fin'"
                          :errors_form="errors"
                        >
                        </FormError>
                      </div>
                    </div>

                    <div v-if="text">
                      <br>
                      <label>Razon: </label><br>
                      <textarea
                        cols="30"
                        rows="10"
                        v-model="form.razon"
                        type="text"
                        class="form-control"
                        id="razon"
                        placeholder="escribe la razon"
                        name="razon"
                        data-vv-name="razon"
                        v-validate="'required|min:3|max:200'"
                      />
                      <FormError
                        :attribute_name="'razon'"
                        :errors_form="errors"
                      >
                      </FormError>
                    </div>
                  </div>
                </form>
              </div>
              <div class="box-footer">
                <button
                  type="button"
                  class="btn btn-danger btn-sm pull-left"
                  @click="clearData()"
                >
                  <i class="fa fa-ban"></i> Cancelar
                </button>
                <button
                  v-if="((form.estados[0].inactivo === true && form.fechaInicio !== null && form.fechaFin !== null)
                    || (form.estados[0].baja === true)) && form.razon.length > 3 || form.estados[0].activo === true"
                  type="button"
                  class="btn btn-primary btn-sm pull-right"
                  @click="save()"
                >
                  <i class="fa fa-save"></i> Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <rechazado v-else></rechazado>
  </div>
</template>

<script>
import FormError from "../shared/FormError";
import Rechazado from "../shared/Rechazado";
import DatePicker from "vue2-datepicker";
export default {
  name: "exp_admin_user",
  components: {
    FormError,
    DatePicker,
    Rechazado
  },
  data() {
    return {
      loading: false,
      usuarios: [],
      text: false,
      activo: false,
      fechas: false,
      mostrar: false,
      roles: [],

      //formulario de campos
      form: {
        usuario: null,
        estados: [
          { activo: null, inactivo: null,  baja: null },
        ],
        razon: "",
        fechaInicio: null,
        fechaFin: null,
      },
    };
  },
  created() {
    let self = this;
    self.getPromise();
  },
  computed: {
    color () {
      return this.mostrar===true ? 'box box-primary' : 'box box-danger'
    },
  },
  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    rolesS(){
      self = this;
      self.loading = true;
      // self.user_pertenece_id = this.$store.state.user.pertenece_id;
      self.$store.state.services.administracionexpedienteService
      .getRol()
      .then((r) => {
        this.roles = r.data;
        if(r.data.length === 0){
          this.roles = [
            {rol_id: 1, rol_nombre: 'Adm', sistema_id: 6, sistema_nombre: 'EXP'}
          ]
        }
        let rol = this.roles.find(x => (x.rol_id === 4 && x.sistema_nombre === "EXP") || (x.rol_id === 1 && x.sistema_nombre === "EXP"));
        rol === null || rol === undefined ? this.mostrar = false : this.mostrar = true;
        self.loading = false;
      })
      .catch((r) => {
        this.$toastr.error(
          "Ocurrio un problema al obtener los roles",
          "Mensaje"
        );
      });
    },

    getPromise() {
      this.loading = true;
      Promise.all([this.getUsuarios(), this.rolesS()])
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$toastr.error("Ocurrió un error: " + error, "Error");
        });
    },

    getUsuarios() {
      let self = this;
      self.usuarios = [];
      self.$store.state.services.userAdmService
        .getAll()
        .then((r) => {
          this.usuarios = r.data;
          console.log('this.usuarios');
          console.log(this.usuarios);
          r.data.forEach(x => {
            x.text = x.dpi+' - '+x.nombre+' '+x.apellido
            // this.usuarios.push(x);
          });
        })
        .catch((r) => {});
    },

    estados(user){
      if (user.baja !== null) {
        this.form.estados[0].activo = false;
        this.form.estados[0].inactivo = false;
        this.form.estados[0].baja = true;
      } else {
        if (user.status === true) {
          this.form.estados[0].activo = true;
          this.form.estados[0].inactivo = false;
          this.form.estados[0].baja = false;
        } else {
          this.form.estados[0].activo = false;
          this.form.estados[0].inactivo = true;
          this.form.estados[0].baja = false;
        }
      }
    },

    seleccion(numero){
      switch (numero) {
        case 1:
          this.form.estados[0].activo = true;
          this.form.estados[0].inactivo = false;
          this.form.estados[0].baja = false;
          this.text = true;
          this.fechas = false;
        break;

        case 2:
          this.form.estados[0].activo = false;
          this.form.estados[0].inactivo = true;
          this.form.estados[0].baja = false;
          this.text = true;
          this.fechas = true;
        break;

        case 0:
          this.form.estados[0].activo = false;
          this.form.estados[0].inactivo = false;
          this.form.estados[0].baja = true;
          this.text = true;
          this.fechas = false;
        break;
      }
      // this.textarea = true;
    },

    show() {
      this.estados(this.form.usuario);
      this.activo = true;
    },

    notAfterDate(date) {
      return date < this.form.fechaInicio;
    },

    notAfterToday(date) {
      return date <= new Date(new Date().setHours(0, 0, 0, 0));
    },

    //funcion para guardar registro
    save() {
      let self = this;
      self.loading = true;

      self.$store.state.services.userAdmService
        .create(this.form)
        .then((r) => {
          let mensaje = r.data === 1 ? "Estatus actualizado exitosamente" : "A ocurrido un error al intentar actualizar el estatus";
          let opcion = r.data === 1 ? "EXITO" : "ERROR";
          r.data === 1 ? this.$toastr.success(mensaje, opcion) : this.$toastr.error(mensaje, opcion);
          this.clearData();
          this.getUsuarios();
          self.loading = false;
        })
        .catch((r) => {
          console.log(r);
          this.$toastr.error("A ocurrido un error al intentar actualizar el estatus", "error");
        });
    },

    clearData(){
      this.form = {
        usuario: null,
        estados: [
          { activo: null, inactivo: null,  baja: null },
        ],
        razon: "",
        fechaInicio: null,
        fechaFin: null,
      };
      this.text= false;
      this.activo= false;
      this.fechas= false;
    },
  },
  mounted() {
    $("body").resize();
  },
};
</script>

<style scoped>
  .radios {
    display: inline-block;
    position: relative;
    padding-left: 35px;
    padding-right: 10px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 1em;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Hide the browser's default radio button */
  .radios input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  /* Create a custom radio button */
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;
    border-radius: 50%;
  }

  /* On mouse-over, add a grey background color */
  .radios:hover input ~ .checkmark {
    background-color: #ccc;
  }

  /* When the radio button is checked, add a blue background */
  .radios input:checked ~ .checkmark {
    background-color: #2196F3;
  }

  /* Create the indicator (the dot/circle - hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the indicator (dot/circle) when checked */
  .radios input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the indicator (dot/circle) */
  .radios .checkmark:after {
    top: 9px;
    left: 9px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
  }

  .text{
    text-align: center;
    padding: 0px;
  }

  .image{
    display: block;
    margin: auto;
    align-items: center;
    padding-bottom: 20px;
    padding-top: 20px;
  }
</style>


<style scoped >
@import '../../dist/css/desing_profile/diseno.css';
</style>
