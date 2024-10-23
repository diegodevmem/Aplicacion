<template>
  <div
    class="hold-transition lockscreen"
    style="height: 100%; min-height: 100%"
    element-loading-text="cargando..."
    element-loading-spinner="el-icon-loading"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <section class="content">
      <div class="row" v-if="showContent">
        <div class="col-md-3">
          <!-- Widget: user widget style 1 -->
          <div class="box box-primary" id="p0">
            <div class="box-header ui-sortable-handle">
              <i class="fa fa-user"></i>
              <h3 class="box-title">Datos del usuario</h3>
              <!-- /. tools -->
            </div>
            <div class="box-body">
              <div class="box box-widget widget-user-2">
                <!-- Add the bg color to the header using any of the bg-* classes -->
                <!--
                <div id="fondo_index"  :style="'background-image:'+require('../../assets/fondo_inicio_index.png')">
                -->
                <div>
                  <br />

                  <img
                    :src="user.url || require('../../assets/mem.jpg')"
                    id="fondo_user"
                  />
                  <img
                    src="../../assets/fondo_inicio_index.png"
                    id="fondo_imagen1"
                  />

                  <div id="fondo_texto">
                    <h3>{{ empleado }}</h3>
                    <br />
                  </div>
                  <!-- /.widget-user-image -->
                </div>
                <div class="box-footer no-padding">
                  <ul class="nav nav-stacked">
                    <li>
                      <a href="#">
                        <b>CUI:</b>
                        {{ user.dpi }}
                      </a>
                    </li>
                    <li v-if="user.pertenece">
                      <a href="#">
                        <b>Pertenece a:</b>
                        {{ user.pertenece.nombre }}
                      </a>
                    </li>
                    <li v-if="user.unidad">
                      <a href="#">
                        <b>Unidad:</b>
                        {{ user.unidad.nombre }}
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="box-footer pull-right">
                  <a
                    v-if="false"
                    class="btn btn-success"
                    @click="$router.push(`/perfil`)"
                    v-tooltip.top="'Perfil de usuario'"
                  >
                    <i class="fa fa-user"></i> Perfil
                  </a>
                  <a
                    class="btn btn-primary"
                    @click="password"
                    v-tooltip.top="'Cambiar Contraseña'"
                  >
                    <i class="fa fa-key"></i> Cambiar Contraseña
                  </a>
                  <a
                    class="btn btn-danger"
                    @click="logout"
                    v-tooltip.top="'Cerrar sesión'"
                  >
                    <i class="fa fa-power-off"></i> Cerrar sesión
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xs-12 col-lg-9 col-sm-9 col-md-9">
          <div class="box box-primary" id="p0">
            <div class="box-header ui-sortable-handle">
              <i class="fa fa-file"></i>
              <h3 class="box-title">
                Sistemas de información del Ministerio de Energía y Minas
              </h3>
              <!-- /. tools -->
            </div>
            <div class="box-body">
              <div class="box-group" id="accordion">
                <template v-for="(item, index) in items">
                  <div class="panel box box-primary" v-bind:key="index">
                    <div class="box-header with-border">
                      <h4 class="box-title">
                        <a
                          data-toggle="collapse"
                          data-parent="#accordion"
                          v-bind:href="'#' + item.id"
                          aria-expanded="false"
                          class="collapsed"
                          >{{ item.propietario }}</a
                        >
                      </h4>
                    </div>
                    <div
                      v-bind:id="item.id"
                      class="panel-collapse collapse"
                      aria-expanded="false"
                      style="height: 0px"
                    >
                      <div  style="text-align: center;">
                        <div
                          v-for="(sistema, indexx) in item.sistemas"
                          class="col-lg-4 col-xs-12 col-md-4"
                          v-bind:key="indexx"
                        >
                          <div
                            class="small-box bg-aqua" 
                            style="border-radius: 20px; cursor: pointer; height: 150px;"
                            @click="showSistema(sistema)"
                            id="p0"
                          >
                            <div class="inner">
                              <h3>{{ sistema.nombre }}</h3>

                              <p>{{ sistema.detalle }}</p>
                            </div>
                            <div class="icon">
                              <i :class="'fa fa-' + sistema.icon"></i>
                            </div>
                    
                              <a
                                style="color: white"
                                v-tooltip.botton="
                                  'Ingresar a ' + sistema.detalle
                                "
                              >
                                Ingresar
                                <i class="fa fa-arrow-circle-right"></i>
                              </a>
                     
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import auth from "../../auth";
import { isNullOrUndefined } from "util";
export default {
  name: "panel",
  data() {
    return {
      user: this.$store.state.user,
      items: [],
      loading: false,
      class: "",
      items_menu: [],
      menu: [],
      permisos: [],
      sistema: {},
      sistemas_propietarios: [],
      foto: "",
    };
  },

  async created() {
    let self = this;
    await self.$store.dispatch("setSistema", {});
    auth.user.sidebar = false;
    if (!isNullOrUndefined(self.user.id)) {
      await self.llenarpropietarios(self.user);
    }
    events.$on("set_user_panel", self.listenEvent);
    // console.log("permisos");
    // console.log(this.$store.state.permisos);
    // console.log("roles");
    // console.log(this.$store.state.roles);
  },

  beforeDestroy() {
    let self = this;
    events.$off("set_user_panel", self.listenEvent);
  },

  methods: {
    async llenarpropietarios(user) {
      let self = this;
      try {
        let r =
          await self.$store.state.services.sistemaPropietarioService.getAll();
        self.sistemas_propietarios = r.data.datos;
        // self.foto = atob(r.data.foto);
        user.admin
          ? await self.getSystemsAdmin(user.id)
          : await self.getSystems(user.id);
      } catch (error) {
        console.log(error);
      }

      // self.$store.state.services.sistemaPropietarioService
      //   .getAll()
      //   .then((r) => {
      //     // console.log('DATOS');
      //     // console.log(r.data.foto);
      //     self.sistemas_propietarios = r.data.datos;
      //     // self.foto = atob(r.data.foto);
      //     user.admin ? self.getSystemsAdmin(user.id) : self.getSystems(user.id);
      //   })
      //   .catch((r) => {
      //     console.log();
      //   });
    },

    listenEvent() {
      let self = this;
      self.user = self.$store.state.user;
      self.llenarpropietarios(self.user);
    },

    async getSystems(user_id) {
      let self = this;
      let registro = { id: "", propietario: "", sistemas: [] };
      self.loading = true;

      try {
        let r = await self.$store.state.services.userService.getSystems(
          user_id
        );
        self.items = [];
        self.sistemas_propietarios.forEach(function (item) {
          registro.id = item.id;
          registro.propietario = item.nombre;
          item.propietarios.forEach(function (system) {
            r.data.data.forEach(function (data) {
              if (system.sistema_id == data.id) {
                registro.sistemas.push({
                  id: data.id,
                  nombre: data.nombre,
                  detalle: data.detalle,
                  icon: data.icon,
                  path: data.path,
                });
                r.data.data.splice(r.data.data.indexOf(data), 1);
              }
            });
          });

          if (registro.sistemas.length != 0) {
            self.items.push(registro);
          }
          registro = { propietario: "", sistemas: [] };
        });
        self.loading = false;
      } catch (error) {
        console.log(error);
        self.loading = false;
      }

      // self.$store.state.services.userService
      //   .getSystems(user_id)
      //   .then((r) => {
      //     self.items = [];
      //     self.sistemas_propietarios.forEach(function (item) {
      //       registro.id = item.id;
      //       registro.propietario = item.nombre;
      //       item.propietarios.forEach(function (system) {
      //         r.data.data.forEach(function (data) {
      //           if (system.sistema_id == data.id) {
      //             registro.sistemas.push({
      //               id: data.id,
      //               nombre: data.nombre,
      //               detalle: data.detalle,
      //               icon: data.icon,
      //               path: data.path,
      //             });
      //             r.data.data.splice(r.data.data.indexOf(data), 1);
      //           }
      //         });
      //       });

      //       if (registro.sistemas.length != 0) {
      //         self.items.push(registro);
      //       }

      //       registro = { propietario: "", sistemas: [] };
      //     });
      //     self.loading = false;
      //   })
      //   .catch((r) => {
      //     self.loading = false;
      //   });
    },

    async getSystemsAdmin(user_id) {
      let self = this;
      let registro = { id: "", propietario: "", sistemas: [] };
      self.loading = true;
      try {
        let r = await self.$store.state.services.sistemaService.getAll(user_id);
        self.items = [];
        self.sistemas_propietarios.forEach(function (item) {
          registro.id = item.id;
          registro.propietario = item.nombre;
          item.propietarios.forEach(function (system) {
            r.data.data.forEach(function (data) {
              if (system.sistema_id == data.id) {
                registro.sistemas.push({
                  id: data.id,
                  nombre: data.nombre,
                  detalle: data.detalle,
                  icon: data.icon,
                  path: data.path,
                });
                r.data.data.splice(r.data.data.indexOf(data), 1);
              }
            });
          });

          if (registro.sistemas.length != 0) {
            self.items.push(registro);
          }

          registro = { propietario: "", sistemas: [] };
        });
        self.loading = false;
      } catch (error) {
        console.log(error);
        self.loading = false;
      }
    },

    showSistema(data) {
      let self = this;
      self.sistema = data;
      self.$store.dispatch("setMenu", []);
      self.$store.dispatch("setSistema", data);
      self.permisos = [];
      self.user.admin ? self.getSistemaMenu(data) : self.getSistemaRol(data);
    },

    getSistemaMenu(data) {
      let self = this;
      self.loading = true;
      self.$store.state.services.sistemaService
        .getItemsMenu(data.id)
        .then((r) => {
          self.items_menu = r.data.data;
          self.mapMenu(r.data.data);
          self.loading = false;
        })
        .catch((r) => {
          self.loading = false;
        });
    },

    getRolSistemaMenu(data) {
      let self = this;
      self.loading = true;
      self.$store.state.services.userService
        .getRolSistemaUsuario(self.user.id, data.id)
        .then((r) => {
          self.loading = false;
          //self.items_menu = r.data.data
          if (r.data.data.length === 0) {
            self.$toastr.warning(
              "rol asignado no tiene permisos a ninguna funcionalidad del sistema seleccionado, por favor comuniquese con el departamento de informatica para los permisos respectivos",
              "información"
            );
            self.$store.dispatch("setSistema", {});
            return;
          }
          self.mapMenu(r.data.data);
          self.lading = false;
        })
        .catch((r) => {});
    },

    getSistemaRol(data) {
      let self = this;
      self.$store.state.services.userService
        .getSistemaRol(self.user.id, data.id)
        .then((r) => {
          self.$store.dispatch("setRoles", r.data.data);
          self.getRolSistemaMenu(data);
        })
        .catch((r) => {});
    },

    mapMenu(data) {
      let self = this;
      if (data.length === 0) {
        self.$store.dispatch("setSistema", {});
      }
      var hash = {};
      data = data.filter(function (current) {
        var exists = !hash[current.id] || false;
        hash[current.id] = true;
        return exists;
      });

      data.forEach(function (item) {
        self.permisos.push(item.path);

        if (item.padre_id === 0 && !item.escondido) {
          var object = new Object();
          object.icon = item.icon;
          object.text = item.text;
          object.path = item.path;
          object.childrens = [];
          data.forEach(function (child, i) {
            if (item.id === child.padre_id && !child.escondido) {
              var object2 = new Object();
              object2.icon = child.icon;
              object2.text = child.text;
              object2.path = child.path;

              object.childrens.push(object2);
            }
          });
          self.menu.push(object);
        }
      });

      self.$store.dispatch("setMenu", self.menu);
      var roles = self.$store.state.roles;
      var isAdmin = roles.some(
        (item) => item.rol.nombre.toLowerCase() === "administrador"
      );
      if (isAdmin) {
        self.permisos.push("roles");
        self.permisos.push("usuario");
      }
      self.$store.dispatch("setPermisos", self.permisos);
      self.$router.push(self.sistema.path);
    },

    logout() {
      let self = this;
      auth.logout(self);
    },

    //Redirecciones
    password() {
      let self = this;

      self.$router.push({
        path: `password/`,
      });
      // console.log(item);
    },
  },

  computed: {
    empleado() {
      let self = this;
      self.user = self.$store.state.user;
      return (
        self.$store.state.user.nombre + " " + self.$store.state.user.apellido
      );
    },

    showContent() {
      let self = this;
      return _.isEmpty(self.$store.state.sistema);
    },
  },

  mounted() {
    let self = this;
    $("body").resize();
  },
};
</script>

<style scoped >
@import "../../dist/css/desing_profile/diseno.css";
@import "../../dist/css/desing_profile/fondos.css";
</style>

