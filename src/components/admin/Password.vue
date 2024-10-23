<template>
  <div class="content-wrapper" v-loading="loading">
    <div class="col-md-3" >
      <!-- Widget: user widget style 1 -->
      <div class="box box-primary" id="p0">
        <div class="box-header ui-sortable-handle">
          <i class="fa fa-user"></i>
          <h3 class="box-title">Datos del usuario</h3>
          <!-- /. tools -->
        </div>
        <div class="col-md-12">
          <form action="#">
            <div class="form-group has-feedback">
              <label for="">CUI: {{ getCui }}</label>
            </div>
            <div class="form-group has-feedback">
              <label for="">USUARIO: {{ empleado }}</label>
            </div>

            <div class="form-group has-feedback">
              <input
                :type="input_type"
                v-model="credentials.password"
                name="password"
                class="form-control"
                id="password"
                placeholder="Contraseña"
                v-validate="'required|min:6'"
                :class="{ input: true, 'has-errors': errors.has('password') }"
              />
              <span
                class="glyphicon glyphicon-lock form-control-feedback"
                @click="checkCapsLock"
              ></span>
              <span v-if="isUpper" class="text-danger">
                advertencia!! mayusculas activadas</span
              >
              <FormError :attribute_name="'password'" :errors_form="errors">
              </FormError>
            </div>

            <div class="form-group has-feedback">
              <input
                :type="input_type"
                v-model="credentials.newPassword"
                name="newPassword"
                class="form-control"
                id="newPassword"
                placeholder="Nueva Contraseña"
                v-validate="'required|min:6'"
                ref="newPassword"
                :class="{
                  input: true,
                  'has-errors': errors.has('newPassword'),
                }"
              />
              <span
                class="glyphicon glyphicon-lock form-control-feedback"
                @click="checkCapsLock"
              ></span>
              <span v-if="isUpper" class="text-danger">
                advertencia!! mayusculas activadas</span
              >
              <FormError :attribute_name="'newPassword'" :errors_form="errors">
              </FormError>
            </div>

            <div class="form-group has-feedback">
              <input
                :type="input_type"
                v-model="credentials.confirmPassword"
                name="confirmPassword"
                class="form-control"
                id="confirmPassword"
                placeholder="Confirmar Nueva Contraseña"
                v-validate="'required|min:6|confirmed:newPassword'"
                :class="{
                  input: true,
                  'has-errors': errors.has('confirmPassword'),
                }"
              />
              <span
                class="glyphicon glyphicon-lock form-control-feedback"
                @click="checkCapsLock"
              ></span>
              <span v-if="isUpper" class="text-danger">
                advertencia!! mayusculas activadas</span
              >
              <FormError
                :attribute_name="'confirmPassword'"
                :errors_form="errors"
              >
              </FormError>
            </div>

            <div class="row">
              <div class="col-md-4">
                <button @click="$router.push(`/panel`)" class="btn btn-success btn-flat btn-sm"><i class="fa fa-undo"></i> Panel</button>
              </div>
              <div class="col-md-4">
                <button @click="updatePass" class="btn btn-primary btn-flat btn-sm">Cambiar contraseña</button>
              </div>
            </div>

            <!-- <div class="row row justify-content-center">
              <div class="col-xs-4 pull-center">
                <button @click="$router.push(`/panel`)" class="btn btn-success btn-flat btn-sm"><i class="fa fa-undo"></i> Panel</button>
                <br>
                <br>
                <a
                  v-if="!loading"
                  class="btn btn-primary btn-flat"
                  @click="updatePass"
                  >Cambiar contraseña</a
                >
              </div>
            </div> -->
          </form>
        </div>
        <div class="box-body">
          <form role="form">
            <div class="form-group">
              <label id="nombre"> </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FormError from "../shared/FormError";
export default {
  name: "Password",
  components: {
    FormError,
  },
  data() {
    return {
      isUpper: false,
      loading: false,
      items: [],
      input_type: "password",

      credentials: {
        password: "",
        newPassword: "",
        confirmPassword: "",
        cui: ""
      },
    };
  },

  created() {
    let self = this;
    // this.$route.params.self.getPromise();
  },
  computed: {
    getCui() {
      let self = this;
      return self.$store.state.user.dpi;
    },
    empleado() {
      let self = this;
      self.user = self.$store.state.user;
      return (
        self.$store.state.user.nombre + " " + self.$store.state.user.apellido
      );
    },
  },
  methods: {
    // redirectPanel(){
    //   self.$router.push({ path: `/panel` });
    // },
    //funcion para mostrar todo
    // getAll() {
    //   let self = this;
    //   self.loading = true;

    //   self.$store.state.services.admin_user.PasswordService.getAll(this.getCui)
    //     .then((r) => {
    //       console.log(r);
    //       self.loading = false;
    //       // $("#id").append(r);
    //     })
    //     .catch((r) => {
    //       console.log(r);
    //     });
    // },

    updatePass() {
      let self = this;
      self.loading = true;
      self.credentials.cui = this.getCui;
      console.log('this.credentials');
      console.log(this.credentials);
      this.$store.state.services.PasswordService
      .update(self.credentials)
      .then((r) => {
        if (r.data === 1) {
          this.$toastr.success("Su contraseña a sido actualizada");
        } else {
          this.$toastr.error("A occurido un error al intentar actualizar su contraseña");
        }
        // self.$router.push({ path: `/panel` });
        self.loading = false;
        // $("#id").append(r);
      })
      .catch((r) => {
        console.log(r);
      });
    },
    checkCapsLock(e) {
      let self = this;
      if (e.getModifierState("CapsLock")) {
        self.isUpper = true;
      } else {
        self.isUpper = false;
      }
    },

    config_error() {
      let self = this;

      let dict = {
        custom: {
          password: {
            required: "La contraseña es requerida",
            min: (field, params) =>
              `La contraseña debe contener al menos ${params[0]} caracteres`,
          },
          newPassword: {
            required: "La contraseña es requerida",
            min: (field, params) =>
              `La contraseña debe contener al menos ${params[0]} caracteres`,
          },
          confirmPassword: {
            required: "La contraseña es requerida",
            min: (field, params) =>
              `La contraseña debe contener al menos ${params[0]} caracteres`,
          },
        },
      };

      self.$validator.localize("es", dict);
    },
  },
};
</script>

<style scoped >
@import '../../dist/css/desing_profile/diseno.css';
</style>
