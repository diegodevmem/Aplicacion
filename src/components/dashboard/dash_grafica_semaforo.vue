<template>

  <div style="background-color:#FFFFFF;" class="col-md-12 col-lg-12 col-sm-12" v-loading="loading">
    <div class="row">
      <div class="col col-md-2 col-lg-2">
        <img class="datos" :src="require('../../assets/LogoLogin2.png')" width="60%">
      </div>

      <div class="col col-md-8 col-lg-8">
        <h2 class="text-center"> <strong>Sistema de Control de Expedientes Web</strong></h2>
        <h3 class="text-center"> <strong>Ministerio de Energía y Minas</strong></h3>
        <h4 class="text-center"> <strong>{{ nombre_tipo }}</strong></h4>
      </div>

      <div class="col col-md-2 col-lg-2" style="text-align: left;">
        <div class="row">
          
          <b-button @click="regresa_dash()" class="btn-sm datos m-0 p-0" variant="success">
            <i class="fa fa-arrow-circle-left"></i>
            <span>Regresar</span>
          </b-button>
        </div>

        <div class="row m-0 p-0">
          <h5 class="datos m-0 p-0"><strong> Fecha: {{ fecha }} {{ hora }}</strong> </h5>
          <h5 class="datos m-0 p-0"><strong>Usuario: {{ nombre }}</strong></h5>
        </div>
      </div>
    </div>
    <highcharts :options="chartOptions" style="height: auto"></highcharts>
  </div>
</template>

<script>
import FormError from "../shared/FormError";
import Highcharts from "highcharts";

export default {
  name: "dash_grafica_semaforo",
  props: ['unidad','consolidado', 'reporte', 'tipo','fechaInicial','fechaFinal','filtroFecha','mes','anio','nombre_tipo'],
  components: {
    FormError,
  },
  data() {
    return {
      loading: false,
      hcInstance: Highcharts,
      chartOptions: {
        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
             '#FF9655', '#FFF263', '#6AF9C4'],
        chart: {
          type: "bar",
          height: 675 ,
        },
        title: {
          text: "",
        },
        // subtitle: {
        //   text:
        //     "La gráfica muestra el estado en que se encuentran los expedientes.",
        // },
        series: [],
        xAxis: {
          type: 'category',
          max: 2,
          labels: {
            useHTML: true,
            animate: true,
            formatter () {
              let datos = [
                {
                  name: 'VERDE',
                  flag: "estado_verde",
                }, {
                  name: 'AMARILLO',
                  flag: "estado_amarillo",
                }, {
                  name: 'ROJO',
                  flag: "estado_rojo",
                }
              ];
              var value = this.value,
                    output;

                datos.forEach(x => {
                  if (x.name === value) {
                    output = x.flag;
                    }
                });

                return '<span><img src="'+require('../../assets/' + output + '.png')+'" style="width: 60px; height: 60px;"/><br></span>';
            }
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: "",
            align: "high",
          },
          labels: {
            overflow: "justify",
          },
          allowDecimals: false,
        },
        tooltip: {
          valueSuffix: " expedientes",
        },
        plotOptions: {
          series: {
              borderWidth: 0,
              dataLabels: {
                  enabled: true,
                  format: '{point.y} expedientes'
              }
          }
        },
        legend: {
          layout: "vertical",
          align: "right",
          verticalAlign: "top",
          x: -40,
          y: 80,
          floating: true,
          borderWidth: 1,
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || "#FFFFFF",
          shadow: true,
        },
        credits: {
          enabled: false,
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 200,
                maxWidth: 500,
              },
              chartOptions: {
                legend: {
                  enabled: false,
                },
              },
            },
          ],
        },
      },
      archivos: null,

      // Separar por color
      series: [],
      verde: [
        {y: 0},
        {y: 0},
        {y: 0},
        {y: 0},
      ],
      amarillo: [
        {y: 0},
        {y: 0},
        {y: 0},
        {y: 0},
      ],
      rojo: [
        {y: 0},
        {y: 0},
        {y: 0},
        {y: 0},
      ],

      categories: [
        'DGE',
        'DGH',
        'DGM',
        'SG',
      ],
    };
  },

  created() {
    this.initialize();
  },
  computed: {
    hora(){
      let hoy = new Date(Date.now());
      let hora = hoy.getHours();
      let min = hoy.getMinutes();
      return hora+':'+min;
    },
    fecha(){
      let hoy = new Date(Date.now());
      return hoy.toLocaleDateString();
    },
    nombre(){
      let nombre = this.$store.state.user.nombre;
      let apellido = this.$store.state.user.apellido;

      return nombre+' '+apellido;
    }
  },
  methods: {
    recorrer(entrada, salida){
      entrada.forEach(x => {
        switch (x.abreviatura) {
          case "DGE":
            salida[0].y=x.cantidad;
          break;

          case "DGH":
            salida[1].y=x.cantidad;
          break;

          case "DGM":
            salida[2].y=x.cantidad;
          break;

          case "SG":
            salida[3].y=x.cantidad;
          break;
        }
      });
    },

    cambiarX(){
      this.chartOptions.chart.type = 'column';
      this.chartOptions.xAxis.max = 3;
      this.chartOptions.xAxis.labels = {
        useHTML: true,
        animate: true,
        formatter () {
          let datos = [
            { name: 'DGE',flag: "DGE" },
            { name: 'DGH',flag: "DGH" },
            { name: 'DGM',flag: "DGM" },
            { name: 'SG',flag: "SG" },
          ];
          var value = this.value,
                output;

            datos.forEach(x => {
              if (x.name === value) {
                output = x.flag;
                }
            });
            return '<span><img src="'+require('../../assets/' + output + '.png')+'" style="width: 60px; height: 60px;"/><br><span style="text-align: center;align-items: center;font-size: 1.5em;"><strong style="text-align: center;align-items: center;font-size: 1.5em;">'+output+'</strong></span><br></span>';
        }
      }
      this.chartOptions.xAxis.categories = this.categories;
    },

    cambiarGrafica(data){
      this.recorrer(data.verde, this.verde);
      this.recorrer(data.amarillo, this.amarillo);
      this.recorrer(data.rojo, this.rojo);

      this.chartOptions.series.push({ color: '#82c91e', name: 'VERDE', data: this.verde });
      this.chartOptions.series.push({ color: '#fcc419', name: 'AMARILLO', data: this.amarillo });
      this.chartOptions.series.push({ color: '#f03e3e', name: 'ROJO', data: this.rojo });
    },

    graficaDir(data){
      this.recorrerData(data.verde, "verde");
      this.recorrerData(data.amarillo, "amarillo");
      this.recorrerData(data.rojo, "rojo");
    },

    recorrerData(entrada, color){
      entrada.forEach(y => {
        console.log(y);
        let datos=[0,0,0];
        switch (color) {
          case "verde":
            datos[0] = y.cantidad;
          break;

          case "amarillo":
            datos[1] = y.cantidad;
          break;

          case "rojo":
            datos[2] = y.cantidad;
          break;
        }

        let object = new Object
        object.name = y.nombre;
        object.data = datos;
        this.chartOptions.series.push(object);
      });
    },

    initialize() {
      this.chartOptions.series = [];
      self.unidad_id = this.unidad;
      if (this.consolidado !== 1 && this.reporte === 1) {
        this.$store.state.services.graficaService.getAll()
        .then((r) => {

          this.chartOptions.xAxis.categories = ['VERDE', 'AMARILLO', 'ROJO'];
          this.graficaDir(r.data);
          this.loading = false;
        })
        .catch((r) => {
          this.loading = false;
        });

      }
      // INICIO DE CONSUMO DE ENDPOINTS DEL CONSOLIDADO
      if(this.consolidado === 1 && this.filtroFecha === 1){//todo los resultados consolidado de grafica
        this.cambiarX();
        this.$store.state.services.graficaService.getAllConsolidadoTodo()
        .then((r) => {
          this.cambiarGrafica(r.data);
          this.loading = false;
        })
        .catch((r) => {
          this.loading = false;
        });
      }else if(this.consolidado === 1 && this.filtroFecha === 2){//todo los resultados consolidado de grafica rango de fecha
        this.cambiarX();
        this.$store.state.services.graficaService.getAllConsolidadoRango(this.fechaInicial,this.fechaFinal)
        .then((r) => {
          this.cambiarGrafica(r.data);
          this.loading = false;
        })
        .catch((r) => {
          this.loading = false;
        });
      }else if(this.consolidado === 1 && this.filtroFecha === 3){//todo los resultados consolidado de grafica mensual
        this.cambiarX();
        this.$store.state.services.graficaService.getAllConsolidadoMensual(this.mes,this.anio)
        .then((r) => {
          this.cambiarGrafica(r.data);
          this.loading = false;
        })
        .catch((r) => {
          this.loading = false;
        });

      // INICIO CONSUMO DE ENDPOINTS DE DIRECCIONES
      }else if(this.consolidado !== 1 && (this.reporte === 0 || this.reporte===undefined) && this.filtroFecha === 1  ){
        console.log(' direccion: '+this.tipo, "todo direccion 1");
        this.$store.state.services.graficaService.getAllDashTodo(self.unidad_id, this.tipo)
          .then((r) => {
            this.chartOptions.xAxis.categories = ['VERDE', 'AMARILLO', 'ROJO'];

            this.graficaDir(r.data);
            this.loading = false;
          })
          .catch((r) => {
            this.loading = false;
          });
      }else if(this.consolidado !== 1 && (this.reporte === 0 || this.reporte===undefined)){
        console.log(' direccion: '+this.tipo, "rango direccion 2");
        this.$store.state.services.graficaService.getAllDashRango(self.unidad_id, this.tipo,this.fechaInicial,this.fechaFinal)
          .then((r) => {
            this.chartOptions.xAxis.categories = ['VERDE', 'AMARILLO', 'ROJO'];

            this.graficaDir(r.data);
            this.loading = false;
          })
          .catch((r) => {
            this.loading = false;
          });
      }else if(this.consolidado !== 1 && (this.reporte === 0 || this.reporte===undefined)){
        console.log(' direccion: '+this.tipo, "mensual direccion 3");
        this.$store.state.services.graficaService.getAllDashMensual(self.unidad_id, this.tipo, this.mes, this.anio)
          .then((r) => {
            this.chartOptions.xAxis.categories = ['VERDE', 'AMARILLO', 'ROJO'];

            this.graficaDir(r.data);
            this.loading = false;
          })
          .catch((r) => {
            this.loading = false;
          });
      }
    },
    //RETORNO DASHBOARD
    regresa_dash(){
      console.log("retorno")
      let url = "/dash_default"
      self.$router.push({path:url});
    }
  },
};
</script>

<style scoped>
.datos {
  float: center;
  /* margin-right: 5%; */
}
</style>