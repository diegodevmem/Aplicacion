<template>
  <div class="content-wrapper">
    <section class="content-header">
      <h1 class="label bg-primary">
        Seguimiento del código de Actuación {{ codigo_barra }}
        <small style="color: white">Sistema de Expedientes</small>
      </h1>
    </section>
    <br />
    <section class="content" v-loading="loading">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12">
          <ol class="label breadcrumb bg-gray pull-right">
            <router-link tag="li" to="/exp_default" exact>
              <i class="fa fa-home"></i> Home
            </router-link>
            <router-link tag="li" to="/" exact>
              <i class="fa fa-dashboard"></i> Dashboard
            </router-link>
            <router-link tag="li" to="/exp_expediente" exact>
              <i class="fa fa-circle-o"></i> Expedientes
            </router-link>
            <router-link tag="li" :to="url" exact>
              <i class="fa fa-circle-o"></i> Actuaciones del Expediente
              {{ numero_expediente }}
            </router-link>
            <li>
              <i class="fa fa-bug active"></i> Seguimiento de la Actuación
            </li>
          </ol>
        </div>
        <div class="col-sm-12 col-md-12 col-lg-12">
          <div class="box box-primary">
            <div class="panel-body">
              <div class="row">
                <div class="col-12 text-center">
                  <h1>
                    Número de Expediente <br />
                    <strong>{{ numero_expediente }}</strong> <br />
                    Código de Actuación <br />
                    <strong> {{ codigo_barra }} </strong>
                  </h1>
                  <hr />
                  <a class="btn btn-success" @click="buscar_documento()"
                    ><strong>Ver Documentos</strong></a
                  >
                  <!-- <a
                      class="btn btn-info text-white rounded-pill"
                      @click="verFlujo()"
                    >
                      <strong>Ver Paso actual</strong>
                    </a> -->
                </div>
              </div>
              <div class="row"><hr /></div>
              <div class="row" v-if="expediente">
                <div class="col-sm-12 col-md-6 col-lg-6 table-responsive">
                  <h2>Información del Expediente</h2>
                  <table class="table">
                    <tbody>
                      <tr>
                        <td width="30%">
                          <strong>Número de Expediente</strong>
                        </td>
                        <td
                          class="text-left"
                          v-text="expediente.numero_expediente"
                        ></td>
                      </tr>
                      <tr>
                        <td width="30%">
                          <strong>Nombre del Expediente</strong>
                        </td>
                        <td
                          class="text-left"
                          v-text="expediente.nombre_expediente"
                        ></td>
                      </tr>
                      <tr>
                        <td width="30%"><strong>Tipo de Trámite</strong></td>
                        <td
                          class="text-left"
                          v-text="actuacion.tipo_tramite"
                        ></td>
                      </tr>
                      <tr>
                        <td width="30%"><strong>Fecha de Creación</strong></td>
                        <td
                          class="text-left"
                          v-text="expediente.fecha_ingreso"
                        ></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="col-sm-12 col-md-6 col-lg-6 table-responsive">
                  <h2>Información de la Actuación</h2>
                  <table class="table" v-if="actuacion">
                    <tbody>
                      <tr>
                        <td width="30%"><strong>Código</strong></td>
                        <td
                          class="text-left"
                          v-text="actuacion.codigo_barra"
                        ></td>
                      </tr>
                      <tr>
                        <td width="30%">
                          <strong>Nombre de la Actuación</strong>
                        </td>
                        <td
                          class="text-left"
                          v-text="actuacion.nombre_expediente"
                        ></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  class="col-sm-12 col-md-12 col-lg-12 text-center"
                  v-if="actuacion.congelado"
                >
                  <hr />
                  <strong style="font-size: 2vw" class="label label-primary">
                    CONGELADO: {{ congelacion.dias }} DIAS </strong
                  ><br /><br />
                  <strong style="font-size: 1.5em" class="label label-primary">
                    TIPO: {{ congelacion.tipo }} </strong
                  ><br /><br />
                  <strong style="font-size: 1.5em" class="label label-primary">
                    RAZÓN: {{ congelacion.razon }}
                  </strong>
                </div>
              </div>
              <div class="row"><hr /></div>
            </div>
          </div>
        </div>
      </div>

      <div class="row" v-if="seguimientos.length > 0">
        <div class="col-sm-12 col-md-12 col-lg-12">
          <cuerpo :seguimiento="seguimientos"></cuerpo>
        </div>
      </div>
    </section>

    <!-- Modal para mostrar los documentos de la actuacion seleccionada -->
    <div
      :class="abrirModalDocumento"
      data-backdrop="static"
      v-bind:style="styleObjectDocumento"
      v-loading="loading"
    >
      <div class="modal-dialog modal-lg" style="width: 80%; height: 80%">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">
              {{ titleDocumento }}
              <button
                type="button"
                @click="cancel_showDocumento"
                class="btn btn-danger btn-xs pull-right"
              >
                <i class="fa fa-close"></i>
              </button>
            </h2>
          </div>

          <div
            class="modal-body text-center"
            style="overflow-y: auto; height: 100%"
            v-if="modalDocumento"
          >
            <div class="row">
              <div class="col-md-12">
                <multiselect
                  @input="verDocumento"
                  v-model="documento_seleccionado"
                  :options="documentos"
                  placeholder="Seleccione uno por favor"
                  :searchable="true"
                  :allow-empty="true"
                  :preselect-first="false"
                  :show-labels="false"
                  :show-no-result="true"
                  label="nombre"
                  track-by="id"
                >
                  <span slot="noResult">No se encontró información</span>
                </multiselect>
              </div>

              <iframe
                v-if="show"
                :src="src"
                style="width: 100%; height: 70vh; border: none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cuerpo from "./cuerpo_seguimiento";
export default {
  name: "SeguimientoExp",
  components: {
    cuerpo,
  },
  data() {
    return {
      datosFlujo: {
        numero_expediente: null,
        codigo_barra: null,
        tipo_tramite: null,
      },
      loading: false,
      seguimientos: [],
      actuacion: null,
      expediente: null,
      expediente_id: 0,
      actuacion_id: 0,
      numero_expediente: "",
      codigo_barra: "",
      url: "",
      tipo_tramite_id: "",
      congelacion: {
        razon: " ",
        tipo: " ",
        dias: 0,
      },
      dias_congelado: null,

      // Modal Documento
      abrirModalDocumento: "modal fade",
      styleObjectDocumento: {},
      modalDocumento: false,

      documentos: [],
      documento_seleccionado: null,

      show: false,
      src: "",

      titleDocumento: "",
      nombreDocumento: "",
    };
  },
  created() {
    let self = this;
    self.actuacion_id = atob(self.$route.params.actuacion_id);
    self.expediente_id = atob(self.$route.params.expediente_id);
    self.codigo_barra = atob(self.$route.params.codigo_barra);
    self.numero_expediente = atob(
      self.$route.params.numero_expediente
    ).toUpperCase();
    self.tipo_tramite_id = atob(self.$route.params.tipo_tramite);
    self.url =
      "/exp_actuaciones/" +
      btoa(self.tipo_tramite_id) +
      "/" +
      btoa(self.numero_expediente.toLowerCase()) +
      "/" +
      btoa(self.expediente_id);
    self.getAll();
  },
  computed: {},
  methods: {
    verFlujo() {
      let datasString = JSON.stringify(this.datosFlujo);
      let data = btoa(datasString);
      this.$router.push("/exp_actuacion_flujo/" + data);
    },

    getAll() {
      let self = this;
      self.loading = true;

      self.$store.state.services.seguimientoactuacionService
        .get(self.actuacion_id)
        .then((r) => {
          console.log("r.data");
          console.log(r.data);
          // self.dias_congelado = r.data.dias_congelado;
          if (r.data.congelacion.length > 0) {
            self.congelacion.razon = r.data.congelacion[0].razon;
            self.congelacion.dias = r.data.congelacion[0].dias_congelado;
            self.congelacion.tipo = r.data.congelacion[0].tipo_congelacion;
          }
          self.seguimientos = r.data.seguimiento;
          self.actuacion = r.data.actuacion;
          self.expediente = r.data.expediente;
          this.datosFlujo.numero_expediente = this.expediente.numero_expediente;
          this.datosFlujo.codigo_barra = this.actuacion.codigo_barra;
          this.datosFlujo.tipo_tramite = this.actuacion.tipo_tramite;
          self.loading = false;
        })
        .catch((r) => {});
    },

    buscar_documento() {
      this.titleDocumento =
        "Documentos de la Actuación " + this.actuacion.codigo_barra;
      let self = this;
      self.loading = true;
      self.documento_seleccionado = null;
      // self.actuacion_selected = item;
      self.documentos.push({ id: 0, nombre: "Caratula" });
      self.$store.state.services.actuacionService
        .getDocument(this.actuacion.id)
        .then((r) => {
          self.documentos = r.data.filter((x) => x.confidencial === false);
          // self.documentos = r.data;
          console.log("self.documentos");
          console.log(self.documentos);
          self.documentos.push({ id: 0, nombre: "Caratula" });
          self.styleObjectDocumento.display = "block";
          self.abrirModalDocumento = "modal fade in";
          self.modalDocumento = true;
          self.loading = false;
        })
        .catch((r) => {});
    },

    verDocumento(item) {
      this.show = false;
      this.src = "";
      if (this.actuacion) {
        let self = this;
        self.loading = true;
        if (item.id > 0) {
          self.$store.state.services.documentoactuacionService
            .get(item.path)
            .then((r) => {
              console.log("item.size");
              console.log(item.size);
              this.nombreDocumento = item.nombre;
              // if ((item.size/1024) < 2.5) {
              this.show = true;
              // }
              // else{
              //   this.show = false;
              //   this.loading = false;
              // }
              // this.show = true;
              this.src = r.data;
              self.loading = false;
            })
            .catch((r) => {});
        } else {
          self.$store.state.services.caratulaexpedienteService
            .getCaratulaActuacion(this.actuacion.id)
            .then((r) => {
              this.show = true;
              this.src = r.data;
              self.loading = false;
            })
            .catch((r) => {});
        }
      }
    },

    cancel_showDocumento() {
      let self = this;
      self.actuacion_selected = null;
      self.styleObjectDocumento.display = "";
      self.abrirModalDocumento = "modal fade";
      self.modalDocumento = false;
      this.src = "";
    },
  },
  mounted() {
    $("body").resize();
  },
};
</script>
