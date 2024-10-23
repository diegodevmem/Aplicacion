<template>
  <div class="col-md-12 col-lg-12 col-sm-12" v-loading="loading">
    <highcharts :options="chartOptions" style="height: auto"></highcharts>
  </div>
</template>

<script>
import FormError from "../../shared/FormError";
import Highcharts from "highcharts";

export default {
  name: "grafica_semaforo",
  props: ['unidad'],
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
          height: 900 ,
        },
        title: {
          text: "Gráfica del Semaforo de Expedientes",
        },
        subtitle: {
          text:
            "La gráfica muestra la cantidad de estados en que se encuentran los trámites.",
        },
        series: [],
        xAxis: {
          categories: [
            '<div style="color: greenyellow; font-size: 20px; text-shadow: 1px 1px 1px black">VERDE</div>',
            '<div style="color: yellow; font-size: 20px; text-shadow: 1px 1px 1px black">AMARILLO</div>',
            '<div style="color: red; font-size: 20px; text-shadow: 1px 1px 1px black">ROJO</div>',
          ],
          title: {
            text: null,
          },
          allowDecimals: false,
        },
        yAxis: {
          min: 0,
          title: {
            text: "Ministerio de Energía y Minas",
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
          bar: {
            dataLabels: {
              enabled: true,
            },
          },
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
    };
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.loading = true;
      this.chartOptions.series = [];
      // self.unidad_id = this.$store.state.user.pertenece_id
      self.unidad_id = this.unidad === null || this.unidad === undefined ? this.$store.state.user.pertenece_id : this.unidad
      console.log('self.unidad_id');
      console.log(self.unidad_id);
      this.$store.state.services.graficaService.getAll(self.unidad_id)
        .then((r) => {
          self.archivos = r.data;
          // if (r.data > 0) {
            if (r.response) return;
            r.data.forEach(element => {
                let object = new Object
                object.name = element.name
                object.data = element.data
                this.chartOptions.series.push(object);
            });
          // } else {
          //   this.$toastr.warning("No se encontraron datos","Mensaje");
          // }
          this.loading = false;

        })
        .catch((r) => {
          this.loading = false;
        });
    },
  },
};
</script>
