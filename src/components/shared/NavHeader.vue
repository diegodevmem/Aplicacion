<template>
	  <header id="navheader" class="main-header">
        <!-- Logo -->
        <a href="#" id="navheader" class="logo">
          <!-- mini logo for sidebar mini 50x50 pixels -->
          <span class="logo-mini"><b>{{title}}</b></span>
          <!-- logo for regular state and mobile devices -->
          <span class="logo-lg" @click="$router.push(`/panel`)"><b>MEM_{{title}}</b></span>
        </a>

        <!-- Header Navbar: style can be found in header.less -->
        <nav class="navbar navbar-static-top" >
          <!-- Sidebar toggle button-->
          <!-- <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
            <span class="sr-only">NavegaciÃ³n</span>
          </a> -->
          <!-- <a href="#" style="float: left;color:white;font-size:15px;background-color: transparent;background-image: none;padding: 15px 15px;">
            <span>Derechos Mineros</span>
          </a> -->
          <!-- Navbar Right Menu -->
          <div class="navbar-custom-menu">
            <ul class="nav navbar-nav">
              <!-- Messages: style can be found in dropdown.less-->
        <!--   <li class="dropdown tasks-menu" v-if="userInfo.admin == 'true'">
            <a @click="toAdmin"  href="#" class="dropdown-toggle" data-toggle="dropdown">
              <i class="fa fa-list"></i>
              <span class="label label-success">Admin</span>
            </a>
          </li>-->
              <!-- User Account: style can be found in dropdown.less -->
              <li class="dropdown user user-menu">

                <a id="navheader" href="#" class="dropdown-toggle" data-toggle="dropdown">
                 <div class="dis">
                    <img                     
                      class="user-image" 
                      alt="User Image"
                      :src="userInfo.url"                                                            
                   />
                  </div>
                  <span class="dis">{{empleado}}</span>
                </a>
                <ul class="dropdown-menu">
                  <!-- User image -->
             
                  <li id="fondo_li" >
                   <!--:src="userInfo.url ||  require('../../assets/mem.jpg')" -->
                   <img
                      class="img-center"
                      :src="userInfo.url"                                                            
                      alt="User Avatar"
                      id="fondo_user"
                    />
                      <img  src="../../assets/fondo_inicio_index.png" id="fondo_imagen1"
                      />             

                    <br>
                    <br>
                    
                    <p id="p_cui">
                      {{ cui }}
                    </p>
                   
                  </li>
                  
                  <li class="user-body text-center">
                    <p>
                      {{ direccion }} <br>
                      {{ unidad }} <br>
                      <small>{{ email }}</small>
                    </p>
                  </li>
                  
                  <!-- Menu Footer-->
                  <li class="user-footer">
                    <div class="row">
                      <div class="col-md-6">
                        <button @click="$router.push(`/panel`)" class="btn btn-success "><i class="fa fa-undo"></i> Panel</button>
                      </div>
                      <div v-if="false" class="col-md-4">
                        <button @click="$router.push(`/perfil`)" class="btn btn-info "><i class="fa fa-user"></i> Perfil</button>
                      </div>
                      <div class="col-md-6">
                        <button @click="logout" class="btn btn-danger "><i class="fa fa-sign-out"></i> Salir</button>
                      </div>
                    </div>
                  </li>
                </ul>
              </li>
              
            </ul>
          </div>

        </nav>
      </header>
</template>

<script>
import auth from '../../auth'

import { debug } from 'util';

export default {
  name: 'NavHeader',
  data(){
    return {
      userInfo: this.$store.state.user,
    }
  },

  created(){
    let self = this
  },
  
  methods: {
    logout() {
      let self = this;
      auth.logout(self)
    },

    toAdmin(){
      auth.user.sidebar = true
      this.$router.push('/')
    }
  },
  mounted(){
  },
  computed: {
    empleado(){
      let self = this;
      self.user = self.$store.state.user;
      return self.$store.state.user.nombre+" "+self.$store.state.user.apellido;
    },

    direccion(){
      let self = this;
      return self.$store.state.user.pertenece.nombre;
    },

    unidad(){
      let self = this;
      return self.$store.state.user.unidad.nombre;
    },

    email(){
      let self = this;
      return self.$store.state.user.email;
    },

    cui(){
      let self = this;
      return self.$store.state.user.dpi;
    },

    title(){
      let self = this
      let nombre = self.$store.state.sistema.nombre 
      return nombre === undefined ? 'USER' : nombre;
    }
  }
}
</script>
<style scoped >
@import '../../dist/css/desing_profile/diseno_nav_show.css';
</style>

<style scoped>
#fondo_li{    
    background-size: cover;
}

.dis{
  display: inline;
}
</style>