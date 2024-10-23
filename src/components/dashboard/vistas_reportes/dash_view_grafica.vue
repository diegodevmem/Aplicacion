<template>
  <div class="content-wrapper">
   <section class="content">  
      <div class="row"> 
        <div class="col">
            <div class="box">
              <dash_grafica_semaforo
                    :tipo="tipo"
                    :unidad="unidad"
                    :consolidado="consolidado"
                    :fechaInicial="fecha_inicial"
                    :fechaFinal="fecha_final"
                    :filtroFecha="tipo_reporte"
                    :mes="mes"
                    :anio="anio"
                    :nombre_tipo="nombre_tipo"
               >
              </dash_grafica_semaforo>    
            </div>                               
          </div>
        </div>
    </section> 
  </div>
</template>

<script>
//import grafica_semaforo from "../expediente/graficas/grafica_semaforo";
import dash_grafica_semaforo from "../../dashboard/dash_grafica_semaforo";
export default {
  name: 'dash_view_grafica',
  components: {
    dash_grafica_semaforo,
  },
  data () {
    return {
      tipo:null,
      unidad:null,
      consolidado:null,
      reporte:null,
      abreviatura: null,
      fecha_inicial:null,
      fecha_final:null,
      tipo_reporte:null,
      mes:null,
      anio:null,
      nombre_tipo:null,
      reportes: [
        { id: 1, nombre: "Grafica de Expedientes Activos"},
      ],
      tipo_reportes: [
        { id: 1, nombre: "Todos los resultados de expedientes"},//se puede usar si se desea
        { id: 2, nombre: "Del:"},
        { id: 3, nombre: "De:"}
      ],
      meses : [
        "opcion nula","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio",
        "Agosto","Septiembre","Octubre","Noviembre","Diciembre"
      ]
    }
  },
  created(){
    let self = this
    self.tipo= atob(self.$route.params.tipo);
    self.unidad = atob(self.$route.params.unidad);
    self.consolidado = Number(atob(self.$route.params.consolidado));
    self.reporte = Number(atob(self.$route.params.reporte));
    self.abreviatura = atob(self.$route.params.abreviatura);

    self.fecha_inicial = atob(self.$route.params.fechaInicial);
    self.fecha_final = atob(self.$route.params.fechaFinal);
    self.tipo_reporte = Number(atob(self.$route.params.tipo_reporte));//tipo reporte referencia a (1: Todo 2: Rango de fehca 3: mensual)

    self.mes = atob(self.$route.params.fechaInicial); //aplica lo mismo para fecha_inicial y final
    self.anio = atob(self.$route.params.fechaFinal); // aplica lo mismo para fecha_inicial y final
    
    if(self.tipo === "nothing"){
      //si aplica para este caso la asignacion de null y undefined ya que son parte del consolidado
      self.tipo = null;
      self.unidad = undefined;
    }

    //valida el nombre del tipo de reporte
    if(this.tipo_reporte === 1 ){
      this.nombre_tipo = "";
    }else if(this.tipo_reporte === 2){
      this.nombre_tipo = this.tipo_reportes[1].nombre + " " + this.fecha_inicial + " a " + this.fecha_final;  
    }else if(this.tipo_reporte === 3){
      this.nombre_tipo = this.tipo_reportes[2].nombre + " " + this.meses[this.mes] + " del " + this.anio;
    }



  },
  mounted(){
    $("body").resize()
  },
  filters: {
    upper: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.toUpperCase();
    },
  },
  methods:{
    regresa_dash(){
      console.log("retorno")
      let url = "/dash_default"
      self.$router.push({path:url});
    }
  }
}
</script>
