<template>
  <section class="content">
      <div class="row">
        <div class="col-12">
          <div class="content">
            <div v-if="this.expedientes.length > 0" class="row">
              <h4 v-text="this.expedientes.length+' Expedientes Encontrados'"></h4>
            </div>
            <div class="row">
              <input type="text" v-model="buscar" class="form-control" placeholder="Buscar Expediente..."/>
            </div>
            <br>
            <div class="box">
              <ul>
                <li @click="itemClick(element)" v-for="(element, index) in items" :key="index">
                  <span class="fa fa-archive"></span>
                  {{ element.numero_expediente }} - {{element.codigo_barra}} | {{element.nombre_direccion}} |
                  {{element.anio}} | {{ date(element.fecha_ingreso) }}
                </li>
              </ul>
            </div>

          </div>
        </div>
    </div>
  </section>
</template>

<script>
import VJstree from "vue-jstree";
import moment from 'moment'
export default {
  name: 'dash_estatus_expediente',
  components: {
    VJstree
  },
  props: ['unidad', 'consolidado'],
  data() {
    return {
      asyncData: [],
      expedientes: [],
      buscar: '',
    }
  },
  created(){
    let self = this
    this.loadData();
  },
  mounted(){
    $("body").resize()
  },
  computed: {
    items() {
      return this.expedientes.filter(item => {
        return item.numero_expediente.toLowerCase().includes(this.buscar.toLowerCase());
      });
    }
  },
  methods: {
    date(fecha) {
      return moment(String(fecha)).format('MM/DD/YYYY');
    },
    itemClick(item) {
      let self = this;
      // let url =
        // "/exp_seguimiento/" +
        // btoa(item.tipo_tramite) +
        // "/" +
        // btoa(item.numero_expediente.toLowerCase()) +
        // "/" +
        // btoa(item.codigo_barra) +
        // "/" +
        // btoa(item.actuacion_id) +
        // "/" +
        // btoa(item.id);

      let url =
        "/exp_mis_seguimiento/" +
        btoa(item.codigo_barra) +
        "/" +
        btoa(item.actuacion_id) +
        "/" +
        btoa(item.id);

      self.$router.push({ path: url });
    },

    cancel_showDocumento() {
      let self = this;
      self.documento = null;
      self.styleObjectDocumento.display = "";
      self.abrirModalDocumento = "modal fade";
      self.modalDocumento = false;
      self.clear();
    },

    clear() {
      let self = this;

      Object.keys(self.form).forEach(function (key, index) {
        if (typeof self.form[key] === "string") self.form[key] = "";
        else if (typeof self.form[key] === "object") self.form[key] = null;
        else if (typeof self.form[key] === "boolean") self.form[key] = false;
        else if (typeof self.form[key] === "number") self.form[key] = 0;
      });

      self.$validator.reset();
      self.$validator.reset();
    },

    loadData() {
      let self = this;
      self.unidad_id = this.unidad;
      if(this.consolidado === 1 ){
        self.$store.state.services.administracionexpedienteService
        .getExpConsolidado()
        .then((r) => {
          r.data.forEach((element) => {
            this.expedientes.push(element);
          });
        })
        .catch((r) => {
          this.$toastr.error(
            "Ocurrio un problema al obtener los expedientes",
            "Mensaje"
          );
        });
      }else{
        self.$store.state.services.administracionexpedienteService
        .getExpDash(self.unidad_id)
        .then((r) => {
          r.data.forEach((element) => {
            this.expedientes.push(element);
          });
        })
        .catch((r) => {
          this.$toastr.error(
            "Ocurrio un problema al obtener los expedientes",
            "Mensaje"
          );
        });
      }
    },
  },
}
</script>


<style scoped>

  .box ul li {
    list-style: none;
    padding: 10px;
    width: 100%;
    background: #fff;
    box-shadow: 0 5px 25px rgba(0, 0, 0, .1);
    transition: transform 0.5s;
  }

  .box ul li:hover {
    transform: scale(1.1);
    z-index: 100;
    background: #25bcff;
    box-shadow: 0 5px 25px rgba(0, 0, 0, .2);
    color: #fff;
  }

  .box ul li span{
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    background: #25bcff;
    color: #fff;
    display: inline-block;
    border-radius: 50px;
    margin-right: 10px;
    font-size: 12px;
    font-weight: 600;
    transform: translateY(-2px);
  }

  .box ul li:hover span {
    background: #25bcff;
    color: #fff;
  }

</style>
