<template>
  <aside
    class="main-sidebar"
    element-loading-text="cargando menú..."
    element-loading-spinner="el-icon-loading"
    v-loading="emptyMenu"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    id="menu_header"
  >
    <!-- sidebar: style can be found in sidebar.less -->
    <div class="slimScrollDiv">
      <section class="sidebar" style="height: 100%">
        <!-- sidebar menu: : style can be found in sidebar.less -->
        <ul class="sidebar-menu">
          <li>
            <a id="headerr">{{ ("menu-" + menuTitle) | uppercase }}</a>
          </li>

          <template v-for="(item, i) in itemsMenu">
            <!-- renderisar los items que no tengan sub items y no esten escondidos -->
            <template v-if="item.childrens.length === 0">
              <router-link tag="li" :to="'' + item.path" v-bind:key="i" exact>
                <a id="a">
                  <i :class="'fa fa-' + item.icon"></i>
                  <span>{{ item.text }}</span>
                </a>
              </router-link>
            </template>

            <!-- renderisar los items que tengan sub items y no esten escondidos -->
            <li
              class="treeview"
              v-if="item.childrens.length > 0"
              v-bind:key="i"
            >
              <a id="a" class="sidebar-toggle" href="#">
                <i :class="'fa fa-' + item.icon"></i>
                <span>{{ item.text }}</span>
                <i class="fa fa-angle-left pull-right-container"></i>
              </a>
              <ul class="treeview-menu">
                <template
                  v-for="(child, c) in item.childrens"
                  :index="i.toString() + c"
                >
                  <router-link
                    tag="li"
                    :to="'' + child.path"
                    exact
                    v-bind:key="c"
                  >
                    <a id="suba"
                      ><i :class="'fa fa-' + child.icon"></i>{{ child.text }}</a
                    >
                  </router-link>
                </template>
              </ul>
            </li>
          </template>

          <!-- crear usuarios, visible unicamente para super usuario y usuarios administradores-->
          <li v-if="isAdmin">
            <a id="a" class="sidebar-toggle" href="#">
              <i class="fa fa-universal-access"></i>
              <span>Acceso</span>
              <i class="fa fa-angle-left pull-right-container"></i>
            </a>
            <ul class="treeview-menu">
              <router-link tag="li" to="roles">
                <a id="suba"><i class="fa fa-users"></i>Roles</a>
              </router-link>
              <router-link tag="li" to="usuario">
                <a id="suba"><i class="fa fa-user"></i>Usuarios</a>
              </router-link>
            </ul>
          </li>

          <li>
            <a href="#/ayuda" id="a">
              <i class="fa fa-plus-square"></i> <span>Ayuda</span>
              <small class="label pull-right bg-red">PDF</small>
            </a>
          </li>
          <li>
            <a id="a" href="#/ayuda">
              <i class="fa fa-info-circle"></i> <span>Acerca De...</span>
              <small class="label pull-right bg-blue"
                ><i class="fa fa-info"></i
              ></small>
            </a>
          </li>
        </ul>
      </section>
    </div>
    <!-- /.sidebar -->
  </aside>
</template>

<script>
import auth from "../../auth";
export default {
  name: "NavegationMenu",
  data: () => ({
    menu: {
      title: "",
      items: [],
    },

    loading: false,

    items_menu: [],
    user: {},
    sistema: {},
    permisos: [],
  }),

  created() {
    let self = this;
    auth.user.sidebar = true;

    self.user = self.$store.state.user;
    self.sistema = self.$store.state.sistema;
  },

  methods: {
    redirect(path) {
      if (path === undefined) return;
      this.$router.push(path);
    },

    downloadFile(url) {
      this.$http.get(url, { responseType: "arraybuffer" }).then((response) => {
        let blob = new Blob([response.data], { type: "application/pdf" });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "test.pdf";
        link.click();
      });
    },
  },

  mounted() {
    let self = this;
    $("body").resize();
  },

  computed: {
    url() {
      let self = this;
      let url = self.$store.state.services.baseUrl;
      let nombre_sistema = self.$store.state.sistema.nombre;
      var roles = self.$store.state.roles;
      nombre_sistema !== undefined
        ? (nombre_sistema = nombre_sistema.toLowerCase())
        : "";
      return url + "manuales/" + nombre_sistema + "_manual_administrador.pdf";
    },

    itemsMenu() {
      let self = this;
      self.menu.items = self.$store.state.menu;
      // console.log('self.$store.state.menu');
      // console.log(self.$store.state.menu);
      return self.menu.items;
    },

    menuTitle() {
      let self = this;
      return self.user.admin
        ? self.sistema.nombre + "-super usuario"
        : self.sistema.nombre;
    },

    emptyMenu() {
      let self = this;
      return self.$store.state.menu.length === 0 ? true : false;
    },

    isAdmin() {
      let self = this;
      var roles = self.$store.state.roles;
      // console.log(roles);
      if (self.user.admin) {
        return true;
      }
      return roles.some(
        (item) => item.rol.nombre.toLowerCase() === "administrador"
      );
    },
  },
};
</script>

<style>
.slimScrollBar {
  background-color: white !important;
  opacity: 0.3 !important;
}
</style>
