<template>
    <div class="content-wrapper">
    <!-- Main content -->
    <section class="content">

      <!-- Default box -->
      <div class="box">
        <div class="box-header with-border">
          <h3 class="box-title">MANUALES DE USUARIO {{sistema.nombre | uppercase}} {{sistema.detalle | uppercase}}</h3>

          <div class="box-tools pull-right">
            <button type="button" class="btn btn-box-tool" data-widget="collapse" data-toggle="tooltip" title="" data-original-title="Collapse">
              <i class="fa fa-minus"></i></button>
          </div>
        </div>
        <div class="box-body" v-if="sistema.nombre == 'SEF'">
          Manuales de usuario {{sistema.nombre}}
          <ul>
              <li v-if="isAdmin">
                <a :href="url('administrador')" target="_blank"> manual de usuario</a>
              </li>
              <li v-if="isJefe">
                  <a :href="url('jefe')" target="_blank"> manual de usuario</a>
              </li>
              <li v-if="isEmpleado">
                  <a :href="url('empleado')" target="_blank"> manual de usuario</a>
              </li>
          </ul>
        </div>
        <div class="box-body" v-if="sistema.nombre == 'CATS'">
          <ul>
              <li>
                <a :href="url('general')" target="_blank"> manual de usuario para uso del sistema - versión 1</a>
              </li>
          </ul>
        </div>
        <div class="box-body" v-if="sistema.nombre == 'EXP'">
          <ul>
              <li>
                <a :href="url('general')" target="_blank"> manual de usuario para uso del sistema - versión 1</a>
              </li>
          </ul>
        </div>
        <div class="box-body" v-if="sistema.nombre == 'DASH'">
          <ul>
              <li>
                <a :href="url('general')" target="_blank"> manual de usuario para uso del sistema - versión 1</a>
              </li>
          </ul>
        </div>
        <div class="box-body" v-if="sistema.nombre == 'RRHH'">
          <ul>
              <li>
                <a :href="url('general')" target="_blank"> manual de usuario para uso del sistema - versión 1</a>
              </li>
          </ul>
        </div>
        <div class="box-body" v-if="sistema.nombre == 'RPTS'">
          <ul>
              <li>
                <a :href="url('general')" target="_blank"> manual de usuario para uso del sistema - versión 1</a>
              </li>
          </ul>
        </div>
        <div class="box-body" v-if="sistema.nombre == 'SAC'">
          <ul>
              <li v-if="isAdmin">
                <a :href="url('administrador')" target="_blank"> manual administrador</a>
            </li>
          </ul>
        </div>
        <div class="box-body" v-if="sistema.nombre == 'SFE'">
          <ul>
              <li v-if="isAdmin">
                <a :href="url('administrador')" target="_blank"> manual administrador</a>
            </li>
          </ul>
        </div>
        <div class="box-body" v-if="sistema.nombre == 'SIM'">
          <ul>
              <li v-if="isAdmin">
                <a :href="url('administrador')" target="_blank"> manual administrador</a>
            </li>
          </ul>
        </div>
        <div class="box-body" v-if="sistema.nombre == 'SAU'">
          <ul>
              <li v-if="isAdmin">
                <a :href="url('tecnico')" target="_blank"> manual técnico</a>
            </li>
          </ul>
        </div>
        <!-- /.box-footer-->
      </div>
      <!-- /.box -->

    </section>
    <!-- /.content -->
  </div>
</template>

<script>
export default {
  name: 'Default',
  components: {

  },

  data(){
      return {
          sistema: this.$store.state.sistema,
          user: this.$store.state.user
      }
  },

  created(){
    let self = this
  },

  methods: {
      url(rol){
        let self = this
        let url = self.$store.state.base_url
        let nombre_sistema = self.sistema.nombre
        nombre_sistema = nombre_sistema.toLowerCase()
        return url+'manuales/'+nombre_sistema+'/'+nombre_sistema+'_manual_'+rol+'.pdf'
    },

  },
  mounted(){
      $("body").resize()
  },

  computed: {
    isAdmin(){
      let self = this
      if(self.user.admin){
        return true
      }
      var roles = self.$store.state.roles
      return roles.some(item => item.rol.nombre.toLowerCase() === 'administrador')
    },

    isJefe(){
      let self = this
      if(self.user.admin){
        return true
      }
      var roles = self.$store.state.roles
      return roles.some(item => item.rol.nombre.toLowerCase() === 'jefe')
    },

    isEmpleado(){
      let self = this
      if(self.user.admin){
        return true
      }
      var roles = self.$store.state.roles
      return roles.some(item => item.rol.nombre.toLowerCase() === 'empleado')
    }
  }
}
</script>
