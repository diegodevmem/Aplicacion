<template>
  <div>
    <navHeader></navHeader>
    <div class="content-wrapper" v-loading="loading">
      <section class="content-header">
        <h1 class="label bg-primary">
          Cambio de Contraseña
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
          <li><i class="fa fa-bug active"></i>Cambio de Contraseña</li>
        </ol>
      </section>
      <br />
      <section class="content">
        <div class="row">
          <div class="col-sm-12 col-md-4 col-lg-4">
            <div class="box box-primary">
              <div class="box-header with-border">
                <h1 class="box-title">
                  <i class="fa fa-plus-square-o"></i> Cambio de Contraseña
                </h1>
              </div>

              <div class="box-body">
                <form role="form" autocomplete="off">
                  <div class="form-group">
                    <label for="nombre">CUI: {{ getCui }} </label>
                  </div>
                  <div class="form-group">
                    <label for="nombre">USUARIO: {{ empleado }} </label>
                  </div>
                  <div class="form-group">
                    <label for="nombre">Contraseña Anterior</label>
                    <input
                      type="password"
                      v-model="credentials.password"
                      class="form-control"
                      id="password"
                      placeholder="escribir contraseña anterior"
                      name="password"
                      v-validate="'required|min:6|max:12|regex:^[A-Za-z-][A-Za-z0-9-]*$'"
                      :class="{ input: true, 'has-errors': errors.has('password') }"
                    />
                    <span
                      class="glyphicon glyphicon-lock form-control-feedback"
                      @click="checkCapsLock"
                    ></span>
                    <span v-if="isUpper" class="text-danger">advertencia!! mayusculas activadas</span>
                    <FormError :attribute_name="'nombre'" :errors_form="errors">
                    </FormError>
                  </div>
                  <div class="form-group">
                    <label for="nombre">Contraseña Nueva</label>
                    <input
                      type="password"
                      v-model="credentials.newPassword"
                      class="form-control"
                      id="newPassword"
                      placeholder="escribir contraseña nueva"
                      name="newPassword"
                      v-validate="'required|min:6|max:12|regex:^[A-Za-z-][A-Za-z0-9-]*$'"
                      :class="{ input: true, 'has-errors': errors.has('newPassword') }"
                    />
                    <span
                      class="glyphicon glyphicon-lock form-control-feedback"
                      @click="checkCapsLock"
                    ></span>
                    <span v-if="isUpper" class="text-danger">advertencia!! mayusculas activadas</span>
                    <FormError :attribute_name="'newPassword'" :errors_form="errors">
                    </FormError>
                  </div>
                  <div class="form-group">
                    <label for="nombre">Confirmar Contraseña Nueva</label>
                    <input
                      type="password"
                      v-model="credentials.confirmPassword"
                      class="form-control"
                      ref="newPassword"
                      id="confirmPassword"
                      placeholder="confirmar contraseña nueva"
                      name="confirmPassword"
                      v-validate="'required|min:6|max:12|regex:^[A-Za-z-][A-Za-z0-9-]*$'"
                      :class="{ input: true, 'has-errors': errors.has('confirmPassword') }"
                    />
                    <span
                      class="glyphicon glyphicon-lock form-control-feedback"
                      @click="checkCapsLock"
                    ></span>
                    <span v-if="isUpper" class="text-danger">advertencia!! mayusculas activadas</span>
                    <FormError :attribute_name="'confirmPassword'" :errors_form="errors">
                    </FormError><br>
                    <span v-if="credentials.newPassword !== credentials.confirmPassword" class="text-danger">
                      ADVERTENCIA!! Las contraseñas NO CONCIDEN!
                    </span>
                  </div>
                </form>
              </div>
              <div class="box-footer">
                <button
                  type="button"
                  class="btn btn-success btn-sm pull-left"
                  @click="$router.push(`/panel`)"
                >
                  <i class="fa fa-undo"></i> Regresar al Panel
                </button>
                <button
                  type="button"
                  class="btn btn-primary btn-sm pull-right"
                  v-if="validar"
                  @click="update()"
                >
                  <i class="fa fa-save"></i> Actulizar Contraseña
                </button>
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
import navHeader from "@/components/shared/NavHeader";
import navegationmenu from "@/components/shared/NavegationMenu";
export default {
  name: "Password2",
  components: {
    FormError,
    navHeader,
    navegationmenu
  },
  data() {
    return {
      loading: false,
      isUpper: false,

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
    // self.getPromise();
  },
  computed: {
    validar(){
      let dato = this.credentials;
      let password = this.credentials.password;
      let newPassword = this.credentials.newPassword;
      let confirmPassword = this.credentials.confirmPassword;
      let cui = this.credentials.cui;
      return password === "" || newPassword === "" || confirmPassword === "" || cui === "" ||  newPassword !== confirmPassword ? false : true;
    },
    getCui() {
      let self = this;
      this.credentials.cui = self.$store.state.user.dpi;
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

    update() {
      let self = this;
      self.loading = true;
      console.log('this.credentials');
      console.log(this.credentials);

      self.$store.state.services.PasswordService
        .update(this.credentials)
        .then((r) => {
          if (r.data === 1) {
            this.$toastr.success("SU CONTRASEÑA HA SIDO ACTUALIZADA", "EXITO");
          } else {
            this.$toastr.error("A OCURRIDO UN ERROR AL INTENTAR ACTUALIZAR SU CONTRASEÑA", "ERROR");
          }
        self.loading = false;
        self.$router.push({ path: `/panel` });
        })
        .catch((r) => {
          this.$toastr.error("A OCURRIDO UN ERROR AL INTENTAR ACTUALIZAR SU CONTRASEÑA", "ERROR");
          self.loading = false;
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

  },
  mounted() {
    $("body").resize();
  },
};
</script>
