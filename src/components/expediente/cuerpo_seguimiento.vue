<template>
	<div v-loading="loading">
		<div class="box box-success">
			<div class="box-body">
                <div class="row" v-if="seguimientos.length > 0">
                    <div class="col-md-12">
                        <ul class="timeline">
                        <template v-for="(item, index) in seguimientos">
                            <li class="time-label" v-bind:key="index"><span class="bg-blue">Traslado #{{ seguimiento.length - index }}</span> <span  class="bg-yellow"> Paso #{{item.numero_paso}} - {{item.nombre_paso}}</span></li>
                            <!-- <li class="time-label" v-bind:key="index"><span class="bg-blue">Paso #{{item.numero_paso}} - {{item.nombre_paso}}</span></li> -->
                            <li v-bind:key="index">
                            <i class="fa fa-file bg-blue"></i>

                            <div class="timeline-item">

                                <span class="time"><i class="fa fa-clock-o"></i> {{ item.created_at }}</span>
                                <h3 class="timeline-header"><a>Días transcurridos {{ item.dias }}</a></h3>
                                <div class="timeline-body">
                                <div class="row">
                                    <div class="col-md-1">
                                    </div>
                                    <div class="col-md-5" style="background: #F2F2F2; color: black;">
                                        <div class="content-left-container">
                                            <div class="content-left">
                                                <p>
                                                    <div class="row">
                                                        <div class="col-sm-4"><strong>Unidad envía:</strong></div>
                                                        <div class="col-sm-8">{{ item.unidad_envia }}</div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-sm-4"><strong>Persona envía:</strong></div>
                                                        <div class="col-sm-8">{{ item.usuario_envia }}</div>
                                                    </div>
                                                    <div class="row">

                                                    </div>
                                                    <div class="row">
                                                        <div class="col-sm-4"><strong>Fecha envía:</strong></div>
                                                        <div class="col-sm-8">{{ item.fecha_envia }}</div>
                                                    </div>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-5" style="border-left: thick solid #ff0000; background: #F2F2F2; color: black;">
                                        <div class="content-right-container">
                                            <div class="content-right">
                                                <p>
                                                    <div class="row">
                                                        <div class="col-sm-4"><strong>Unidad recibe:</strong></div>
                                                        <div class="col-sm-8">{{ item.unidad_recibe }}</div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-sm-4"><strong>Persona recibe:</strong></div>
                                                        <div class="col-sm-8">{{ item.usuario_recibe }}</div>
                                                    </div>
                                                    <div class="row">

                                                    </div>
                                                    <div class="row">
                                                        <div class="col-sm-4"><strong>Fecha recibe:</strong></div>
                                                        <div class="col-sm-8">{{ item.fecha_recibe }}</div>
                                                    </div>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-1"></div>
                                    <br>
                                    <br>
                                    <div class="col-md-12">
                                        <strong>Observación: </strong> <p v-html="item.observacion"></p>
                                    </div>
                                </div>
                                </div>
                                <div class="timeline-footer">
                                    <a class="btn btn-success btn-xs">Folios agregados <strong>0</strong></a>
                                    <a class="btn btn-default btn-xs" v-if="actuacion">Folios de la actuación <strong>{{ actuacion.folio_actual | currency('folios ', 2) }}</strong></a>
                                    <a class="btn btn-default btn-xs" v-if="expediente">Folios del expediente <strong>{{ expediente.folio_actual | currency('folios ', 2) }}</strong></a>
                                </div>
                            </div>
                            </li>
                        </template>
                        </ul>
                    </div>
                </div>
			</div>
		</div>
	</div>
</template>

<script>
import moment from "moment";
export default {
  name: "cuerpoSeguimientoExp",
  components: {},
  data() {
    return {
      loading: false,
      seguimientos: [],
    };
  },
  props: {
    seguimiento: Array,
  },
  created() {
    this.seguimientos = this.seguimiento
  },
  methods: {},
  mounted() {
    $("body").resize();
  },
};
</script>
