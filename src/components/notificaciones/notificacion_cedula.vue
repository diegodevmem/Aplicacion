<template>
  <v-app>
    <div class="p-8 box-body rounded-3" style="padding: 30px;">
      <!-- This is a cooler component. -->
      <div class="row">
        <div v-if="manual === false" class="col-sm-12 col-md-12 col-lg-12">
          <div class="mb-4 h4">
            <div v-if="copia === true" class="">
              <label>No. CÉDULA: </label
              ><span v-text="cedula.numero_cedula"></span><br />
              <label
                >DEPENDENCIA: <span v-text="cedula.direccionMEM"></span></label
              ><br />
              <label
                >No. EXPEDIENTE: <span v-text="cedula.numero_exp"></span></label
              ><br />
            </div>
            <div v-else>
              <label
                >DEPENDENCIA: <span v-text="cedula.direccionMEM"></span></label
              ><br />
              <label
                >No. EXPEDIENTE: <span v-text="cedula.numero_exp"></span></label
              ><br />
            </div>
          </div>
        </div>
      </div>

      <div v-if="copia === false" class="row justify-content-end">
        <!-- Switch de edición de fecha -->

        <!-- Tipo de Documento -->
        <div class=" col">
          <div class="h5">
            <label>Tipo de Documento</label>

            <multiselect
              id="tipo de documento"
              name="tipo de documento"
              style="width: auto"
              v-model="cedula.tipoDocumento"
              :options="tipo_cedula"
              placeholder="Seleccione uno por favor"
              :searchable="true"
              :allow-empty="false"
              :preselect-first="false"
              data-vv-name="tipo de documento"
              v-validate="'required'"
              data-vv-scope="representante"
              :show-labels="false"
              :show-no-result="true"
              label="descripcion"
              track-by="id"
            >
              <span slot="noResult">No se encontró información</span>
            </multiselect>
            <FormError
              :attribute_name="'tipo de documento'"
              :errors_form="errors"
            >
            </FormError>
          </div>
        </div>

        <!-- Fecha del Documento -->
        <div class=" col">
          <div class="h5">
            <label for="fecha_ingreso">Fecha del Documento</label><br />
            <date-picker
              style="width: auto"
              v-model="cedula.fecha_documento"
              value-type="date"
              :input-props="{
                class: '',
                placeholder: 'Seleccione fecha del documento'
              }"
              format="DD/MM/YYYY"
              placeholder="Seleccione fecha del documento"
              data-vv-name="fecha del documento"
              id="fecha del documento"
              name="fecha del documento"
              v-validate="'required|date_format:dd/MM/yyyy'"
              show-caps
              class="rounded"
            ></date-picker>

            <br />
            <FormError
              :attribute_name="'fecha del documento'"
              :errors_form="errors"
              style="color: red"
            >
            </FormError>
          </div>
        </div>
      </div>

      <!-- Número de Documento -->
      <div v-if="copia === false">
        <div class="">
          <div class="h5">
            <label for="numero de documento">Número de Documento</label>
            <input
              id="numero de documento"
              name="numero de documento"
              v-model="cedula.numero_documento"
              type="text"
              class="form-control"
              placeholder="Escribe el número del documento"
              v-validate="'required|min:3|max:100'"
              :class="'rounded ' +
                  {
                    input: true,
                    'has-errors': errors.has('numero_documento')
                  }
              "
              @input="
                cedula.numero_documento = $event.target.value.toUpperCase()
              "
            />

            <br />
            <FormError
              :attribute_name="'numero de documento'"
              :errors_form="errors"
              style="color: red"
            >
            </FormError>
          </div>
        </div>
        <div class="">
          <div class="h5">
            <label class="fs-2">Número de Documento (EN LETRAS):</label><br />
            <div
              v-if="cedula.numero_documento !== ''"
              class="rounded"
              style="padding: 8px 2px 2px 8px;border: 1px solid #006d80"
            >
              <label v-if="pasarAletras">{{
                cedula.numero_documento_letras
              }}</label>
            </div>
            <div v-else>
              <label>(NINGUNO)</label>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="mx-16 mt-4 text-center row d-flex">
        <v-checkbox
          class="px-8 col-6 justify-content-center d-flex"
          v-model="uploadDocument"
          label="Subir documento"
        ></v-checkbox>
        <v-checkbox
          class="px-4 col-6 justify-content-center d-flex"
          v-model="selectDocument"
          label="Seleccionar documento"
        ></v-checkbox>
      </div>

      <div class="row d-flex jusity-content-center">
        <div class="col-md-12" v-if="selectDocument">
          <multiselect
            @input="verDocumento"
            v-model="selectedDocumentForCedula"
            :options="documentosExp"
            placeholder="Seleccione un documento por favor"
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
          <br />
          <div class="row">
            <div class="text-center col-md-12">
              <div class="text-center">
                <label for="folio_inicial">Cantidad de folios</label>
                <h3>
                  <strong> {{ numPages }} </strong>
                </h3>
              </div>
            </div>
            <!-- <div class="col-8">
      <label for="folio_correcion"
        >Si la cantidad de folios es incorrecta, ingrese el número
        correcto:</label
      >
      <input
        v-model="folios_correcion"
        type="text"
        id="folio_correcion"
        placeholder="Cantidad de folios correcta"
        name="cantidad de folios correcta"
        :class="{
          input: true,
          'has-errors': errors.has('cantidad de folios correcta'),
        }"
      />
      <FormError
        :attribute_name="'cantidad de folios correcta'"
        :errors_form="errors"
      >
      </FormError>
    </div> -->
          </div>
        </div>
      </div>
      <div>
        <documentos
          @uploadOneDocumentInComponent="uploadOneDocumentInComponent"
          :documentos="documentos"
          :documentosGuardar="documentosGuardar"
          :folios_correcion="cedula.folios_correcion"
          :botones="true"
          v-if="uploadDocument"
        />
        <!-- <Documentos :documentos="documentos" :folios_correcion="cedula.folio_correcion" :botones="true"></Documentos> -->
      </div>

      <div>
        <!-- <hr /> -->
        <!-- DOCUMENTOS PREVIOS -->
        <div v-if="copia === true" class="row">
          <div class="col-sm-12 col-md-12 col-lg-12">
            <h3 for="">Documentos Agregados a la cedula previa:</h3>
            <br />
            <div class="row">
              <table style="margin: 0 auto">
                <tr v-for="(doc, i) in datos.documento_principal" :key="i">
                  <div v-if="doc.conservar === 1">
                    <td class="text-center">
                      <label
                        v-text="doc.nombre"
                        style="margin: 10px 10px 10px 0px"
                      ></label>
                    </td>
                    <td>
                      <button
                        @click="eliminarDocumento(doc)"
                        type="button"
                        class="btn btn-danger btn-circle"
                      >
                        <i class="fa fa-trash"></i>
                      </button>
                    </td>
                  </div>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <hr />

      <!-- COPIA LABEL -->
      <div v-if="copia === true" class="row">
        <div class="col-sm-4 col-md-4 col-lg-4">
          <div class="form-group">
            <label>Tipo de Documento:</label><br />
            <label v-text="cedula.tipoDocumento"></label>
          </div>
        </div>
        <div class="col-sm-4 col-md-4 col-lg-4">
          <div class="form-group">
            <label>Fecha del Documento:</label><br />
            <label v-text="cedula.fecha_documento"></label>
          </div>
        </div>
        <div class="col-sm-4 col-md-4 col-lg-4">
          <div class="form-group">
            <label>Número de Documento:</label><br />
            <label v-text="cedula.numero_documento"></label>
          </div>
        </div>
      </div>

      <!-- Representante Legal -->
      <div v-if="validarRepresentantes()">
        <div class="col-sm-12 col-md-12 col-lg-12">
          <div class="form-group">
            <label>Representante Legal *</label>
            <multiselect
              style="width: 100%"
              v-model="cedula.representante"
              :options="representantes"
              placeholder="Seleccione uno por favor"
              :searchable="true"
              :allow-empty="true"
              :preselect-first="false"
              data-vv-name="cedula.representante"
              v-validate
              data-vv-rules="required"
              data-vv-scope="representante"
              :show-labels="false"
              :show-no-result="true"
              label="nombre"
              @input="llenarCampos(cedula.representante)"
            >
              <span slot="noResult">No se encontró información</span>
            </multiselect>
            <FormError
              :attribute_name="'representante legal'"
              :errors_form="errors"
            >
            </FormError>
          </div>
        </div>
        <!-- <div v-if="manual === false" class="col-sm-12 col-md-4 col-lg-4">
                <div class="form-group">
                  <label>Tipo de Ingreso</label>
                  <enhanced-check
                    :label="ingresoManual ? 'MANUAL' : 'SELECCIÓN'"
                    subClass="success"
                    :animate="true"
                    :inline="false"
                    v-model="ingresoManual"
                    v-validate="'required'"
                    data-vv-name="asociar"
                  ></enhanced-check>
                  <FormError :attribute_name="'asociar'" :errors_form="errors">
                  </FormError>
                </div>
            </div> -->
      </div>

      <!-- Notifique a -->

      <div v-if="cedula.representante" class="col-sm-12 col-md-12 col-lg-12">
        <div class="form-group">
          <label for="observacion">Notifique a:</label>
          <textarea
            v-model="cedula.razon_social"
            class="form-control"
            id="Notificado"
            placeholder="Escribe a quién debe notificar"
            name="Notificado"
            v-validate="'max:250|required'"
            readonly
            :class="{
              input: true,
              'has-errors': errors.has('Notificado')
            }"
            @input="cedula.razon_social = $event.target.value.toUpperCase()"
          ></textarea>
          <FormError
            :attribute_name="'Notificado'"
            :errors_form="errors"
          ></FormError>
        </div>
      </div>

      <!-- E-mail -->

      <!-- <div class="col-sm-12 col-md-12 col-lg-12">
                <div class="form-group">
                    <label for="observacion">E-mail:</label>
                    <input v-model="cedula.email" type="email" class="form-control" id="email"
                        placeholder="Escribe el email al cual debe notificar" name="email" v-validate="'max:250|required'"
                        :class="{
                            input: true,
                            'has-errors': errors.has('email'),
                        }" />
                    <FormError :attribute_name="'email'" :errors_form="errors"></FormError>
                </div>
            </div> -->

      <div v-if="cedula.representante" class="col-sm-12 col-md-12 col-lg-12">
        <div class="form-group">
          <div>
            <label for="observacion">Correos que serán notificados:</label>
            <br />
            <div
              class="rounded"
              style="padding: 1px 1px 1px 1px;border: 1px solid rgb(193, 193, 193)"
            >
              <v-chip
                v-for="email in socialReasonsEmails"
                :key="email"
                class="mx-1 my-1"
              >
                <strong>{{ email }}</strong>
              </v-chip>
            </div>
          </div>
        </div>
      </div>

      <!-- E-mail ALTERNO-->
      <!-- 
            <div class="col-sm-12 col-md-12 col-lg-12">
                <div class="form-group">
                    <label for="observacion">E-mail Alterno:</label>
                    <input v-model="cedula.emailAlterno" type="email" class="form-control" id="email"
                        placeholder="Escribe el email al cual debe notificar" name="email alterno" v-validate="'max:250'"
                        :class="{
                            input: true,
                            'has-errors': errors.has('email alterno'),
                        }" />
                    <FormError :attribute_name="'email alterno'" :errors_form="errors"></FormError>
                </div>
            </div> -->

      <div v-if="cedula.representante" class="col-sm-12 col-md-12 col-lg-12">
        <label for="nombre">Departamento:</label>
        <multiselect
          v-model="cedula.dep_notificacion"
          :options="departamentos"
          placeholder="Seleccione uno por favor"
          :searchable="true"
          :allow-empty="false"
          :preselect-first="false"
          data-vv-name="tipo de documento"
          v-validate="'required'"
          data-vv-scope="representante"
          :show-labels="false"
          :show-no-result="true"
          label="nombre"
          track-by="id"
          :r="true"
          style=" pointer-events: none;"
          @close="setDep(cedula.dep_notificacion)"
        >
          <span slot="noResult">No se encontró información</span>
        </multiselect>
      </div>

      <br />

      <div v-if="cedula.representante" class="col-sm-12 col-md-12 col-lg-12">
        <label for="nombre">Municipio:</label>
        <multiselect
          v-model="cedula.mun_notificacion"
          :options="municipiosTemp"
          placeholder="Seleccione uno por favor"
          :searchable="true"
          :allow-empty="false"
          :preselect-first="false"
          data-vv-name="tipo de documento"
          v-validate="'required'"
          data-vv-scope="representante"
          :show-labels="false"
          :show-no-result="true"
          label="nombre"
          track-by="id"
          @close="setMun(cedula.mun_notificacion)"
          style=" pointer-events: none;"
        >
          <span slot="noResult">No se encontró información</span>
        </multiselect>
      </div>

      <!-- Dirección -->

      <div v-if="cedula.representante" class="col-sm-12 col-md-12 col-lg-12">
        <div class="form-group">
          <label for="observacion">Dirección</label>
          <textarea
            v-model="cedula.direccion"
            class="form-control"
            id="Dirección"
            placeholder="escribir la dirección"
            name="direccion"
            v-validate="'required'"
            @input="cedula.direccion = $event.target.value.toUpperCase()"
            readonly
          ></textarea>
          <FormError
            :attribute_name="'direccion'"
            :errors_form="errors"
          ></FormError>
        </div>
      </div>

      <!-- Razón -->

      <div v-if="cedula.representante" class="col-sm-12 col-md-12 col-lg-12">
        <div class="form-group">
          <label for="observacion">Razón</label>
          <textarea
            v-model="cedula.razon"
            class="form-control"
            id="razon"
            placeholder="Escriba la razón"
            name="razon"
            v-validate="'max:250'"
            :class="{
              input: true,
              'has-errors': errors.has('razon')
            }"
            @input="cedula.razon = $event.target.value.toUpperCase()"
          ></textarea>
          <FormError
            :attribute_name="'razon'"
            :errors_form="errors"
          ></FormError>
        </div>
      </div>
    </div>

    <!-- <pre>{{cedula}}</pre> -->
    <div class="mx-4 mb-8 box-footer">
      <button
        type="button"
        class="btn btn-lg pull-left"
        style="background-color: rgb(219, 20, 2); color:white"
        @click="limpiarCedula()"
      >
        <i class="fa fa-ban"></i> Cancelar
      </button>
      <button
        type="button"
        class="btn btn-lg pull-right"
        style="background-color: rgb(2, 139, 219); color:white"
        @click="guardarCedula()"
        :disabled="!cedula.representante"
      >
        <i class="fa fa-save"></i> Guardar Cédula
      </button>
    </div>
  </v-app>
</template>

<script>
import Documentos from "../shared/Documentos";
import FormError from "../../components/shared/FormError";
import pdf from "vue-pdf";
import DatePicker from "vue2-datepicker";
import { tramites_con_notificacion_electronica } from "../../components/expediente/crearExpediente/crear_expediente";

// import "vue2-datepicker/index.css";
// import "vue2-datepicker/locale/es/es";

import {
  EnhancedCheck,
  EnhancedCheckGroup,
  EnhancedCheckRadio,
  EnhancedToggle
} from "vue-enhanced-check";
export default {
  name: "notificacion_cedula",
  props: ["manual", "item", "copia", "datos", "loading"],
  components: {
    Documentos,
    FormError,
    EnhancedCheck,
    EnhancedCheckGroup,
    EnhancedCheckRadio,
    EnhancedToggle,
    pdf,
    DatePicker
  },
  data() {
    return {
      isDisabled: true,
      socialReasonsEmails: [],
      selectDocument: false,
      uploadDocument: false,
      representantes: [],
      // ingresoManual: false,
      src: null,
      numPages: null,
      editarFechavalue: false,
      loadingtabla: false,
      documentSelectedExp: null,

      documentos: [
        {
          folio: 0,
          formato: ".PDF",
          formato_id: 1,
          megas: 200,
          requisito: "ADJUNTAR DOCUMENTO",
          estado: "primary"
        }
      ],

      documentosGuardar: [],

      cedulaCopia: {
        numero_cedula: null,
        dependencia: null,
        numero_exp: null,
        numero_documento: null,
        fecha_cedula: null,
        tipo_cedula: null,
        fecha_documento: null
      },

      cedula: {
        tipoDocumento: null,
        item: null,
        fecha_ingreso: null,
        fecha_documento: null,
        numero_documento: "",
        numero_exp: "",
        representante: null,
        direccionMEM: null,
        direccion: "",
        manual: null,
        razon: null,
        razon_social: "",
        numero_documento_letras: "",
        departamento: null,
        municipio: null,
        mun_notificacion: null,
        direccion_notificacion: "",
        dep_notificacion: null,
        email: null,
        emailAlterno: null,
        documentos: [],
        folios: 0,
        folios_correcion: null,
        documentos_persisten: [],
        empresa: null,
        nombre_documento_seleccionado: null
      },
      documentosExp: [],

      direcciones: [
        { id: 2, nombre: "SECRETARIA GENERAL" },
        { id: 19, nombre: "DIRECCION GENERAL DE HIDROCARBUROS" },
        { id: 20, nombre: "DIRECCION GENERAL DE MINERIA" },
        { id: 21, nombre: "DIRECCION GENERAL ADMINISTRATIVA" },
        { id: 22, nombre: "DIRECCION GENERAL DE ENERGIA" }
      ],

      tipo_cedula: [],

      departamentos: [],
      municipios: [],
      municipiosTemp: [],

      //codConfirmarEdicion: "",
      cambiarEdicion: false,
      IDLE_TIMEOUT: 0, //TIEMPO DE SESSIÓN
      idleSecondsTimer: 0,
      idleSecondsCounter: 180,
      tiempoActual: "",
      selectedDocumentForCedula: null
    };
  },

  watch: {
    uploadDocument() {
      console.log(this.uploadDocument);
      if (this.uploadDocument) {
        this.selectedDocumentForCedula = null;
        this.selectDocument = false;
        this.documentosGuardar = [];
      }
    },
    selectDocument() {
      console.log(this.selectedDocumentForCedula);
      if (this.selectDocument) {
        console.log(this.selectedDocumentForCedula);
        this.documentosGuardar = [];
        this.uploadDocument = false;
      }
    },
    selectedDocumentForCedula() {
      this.documentosGuardar = [];
      this.getBase64Document(this.selectedDocumentForCedula);
    },

    documentosGuardar() {
      console.log(this.documentosGuardar);
      if (this.documentosGuardar.length > 0) {
        this.cedula.folios = this.documentosGuardar[0].cantidad_folio;
        console.log(this.cedula);
      }
    }
  },

  async created() {
    console.log("data inicial");
    console.log(this.cedula);
    // this.getPromise();
    await this.getAllManual();
    //Obtiene la fecha actual
    var f = new Date();
    let fecha_actual =
      ("0" + f.getDate()).slice(-2) +
      "/" +
      ("0" + (f.getMonth() + 1)).slice(-2) +
      "/" +
      f.getFullYear() +
      " " +
      f.getHours() +
      ":" +
      f.getMinutes() +
      ":" +
      f.getSeconds();
    let fecha_actual2 = "01/01/2020 10:31:50";

    console.log(fecha_actual, fecha_actual2, fecha_actual === fecha_actual2);
    this.cedula.fecha_ingreso = fecha_actual;
    console.log(this.cedula.fecha_ingreso);
    //http://127.0.0.1:8001/serviciosMEM/public/notificacion/informacion/persona/19176

    await this.getSocialReasonsFromCompany(this.item);
    if (this.manual === false && this.copia !== true) {
      this.cedula.item = this.item;
      this.cedula.direccionMEM = this.item.direccion;
      this.cedula.numero_exp = this.item.numero_expediente;
      console.log("get all");
      console.log(this.cedula.item);
      this.getAll(this.cedula.item.id);
    } else if (this.copia === true) {
      console.log("asignacion representante");
      console.log(this.datos);

      this.cedula.documentos_persisten = this.datos.documento_principal;
      this.cedula.item = this.item;
      this.cedula.numero_cedula = this.datos.numero_cedula;
      this.cedula.direccionMEM = this.item.direccion;
      this.cedula.numero_exp = this.item.numero_expediente;
      this.cedula.numero_documento = this.datos.cedula.numero_documento;
      this.cedula.fecha_ingreso = this.datos.cedula.fecha_cedula;
      this.cedula.fecha_documento = this.datos.cedula.fecha_documento;
      this.cedula.tipoDocumento = this.datos.tipo_cedula.descripcion;

      // let empresa = this.datos.repre.pop();
      // console.log(this.datos.representante);
      // console.log(this.datos.empresa);

      this.asignacionRepresentante(
        this.datos.representante,
        this.datos.empresa[0],
        this.representantes
      );
      this.$emit("carga", false);
    }

    this.seeDocumentsOfExp();
  },
  computed: {
    verMunicipios() {
      this.municipios = this.municipiosTemp;
      if (this.cedula.departamento !== null) {
        let mun = this.municipios.filter(
          x => x.departamento_id === this.cedula.departamento.id
        );
        this.municipios = mun;
        return true;
      } else {
        return false;
      }
    },
    pasarAletras() {
      let dato = { dato: "", letras: false };
      let datos = [];

      let numeros = this.cedula.numero_documento.split("-");
      numeros.forEach(x => {
        dato.dato = x;
        dato.letras = this.esLetra(x);
        datos.push(dato);
        dato = { dato: "", letras: false };
      });
      let letras = "";
      datos.forEach(x => {
        if (x.letras === false) {
          x.dato = this.numerosLetras(x.dato);
        }
      });
      for (let i = 0; i < datos.length; i++) {
        if (datos.length - 1 !== i) {
          letras = letras + datos[i].dato.toUpperCase() + " GUION ";
        } else {
          letras = letras + datos[i].dato.toUpperCase();
        }
      }
      this.cedula.numero_documento_letras = letras;
      return true;
    }
  },

  methods: {
    async getSocialReasonsFromCompany(expediente) {
      console.log(expediente);
      //http://127.0.0.1:8001/serviciosMEM/public/notificacion/informacion/persona/19176
      const r = await this.$store.state.services.notificacionesService.getDataFromCompany(
        expediente.id
      );

      const socialReasons = r.data.data[0].razones;
      console.log("Razones sociales")
      console.log(socialReasons);
        // this.socialReasonsEmails = socialReasons.map(
        //   socialReason => socialReason.razonSocial.correo[0].correo
        // );
          socialReasons.forEach(
           (socialReason) =>{
            socialReason.razonSocial.correo.forEach(
              (correo) =>{
                console.log(correo.correo)
                this.socialReasonsEmails.push(correo.correo)
              }
             )
           }
        );
      //   socialReasons.forEach(socialReason => {
      //     const item = socialReason.razonSocial;
      //     console.log(item);
      //     const representante = {
      //       continente: item.continente,
      //       departamento_id: item.municipio.departamento.id,
      //       departamento: item.municipio.departamento,
      //       nombre: item.razon_social,
      //       // direccion: item.direccion_notificacion,
      //       municipio_id: item.municipio.id,
      //       municipio: item.municipio,
      //       pais: item.pais,
      //       razon_social_id: item.razon_social_id,
      //       empresa: 0,
      //       razon_social: item.razon_social,
      //       nombre_notificar: item.razon_social,
      //       email: item.email,
      //       emailAlterno: item.email_alternativo
      //     };

      //     this.representantes.push(representante);
      //   });
      //   console.log(this.representantes);

      this.cedula.emailsToNotify = [...this.socialReasonsEmails];
      // PAGO DE REGALIAS
      if (
        tramites_con_notificacion_electronica.includes(
          r.data.data[0].actuacion.tipo_tramite_id
        )
      ) {
        this.cedula.emailsToNotify.push("oespadero@mem.gob.gt");
      }

      console.log(this.cedula, this.actuacion);
    },

    async getBase64Document(documentSelected) {
      console.log(documentSelected);
      this.cedula.nombre_documento_seleccionado = documentSelected.nombre;
      this.cedula.folios = documentSelected.cantidad_folio;
      await this.$store.state.services.documentoactuacionService
        .get(documentSelected.path)
        .then(r => {
          console.log(r);
          this.documentSelectedExp = {
            nombre: documentSelected.nombre,
            path: r.data,
            formato_documento_id: 1,
            formato: ".PDF",
            cantidad_folio: 1,
            size: documentSelected.size
          };
          // this.documentSelectedExp.path = r.data
          // this.documentSelectedExp.formato_documento_id = 1
          // this.documentSelectedExp.formato = ".PDF"
          this.numPages = documentSelected.cantidad_folio;
          this.documentosGuardar.push(this.documentSelectedExp);
          // this.documentosGuardar.push(this.documentSelectedExp)
          console.log(this.documentosGuardar);
          // this.documentosGuardar[1] = this.documentSelectedExp
          // this.nombreDocumento = this.selectedDocumentForCedula.nombre;
          // this.show = true;
          // this.documentSelectedExp = this._base64ToArrayBuffer(r.data);
          // console.log(this.documentSelectedExp)
          // let file = new Blob([pdfData], { type: "application/pdf" });
          // let fileUrl = URL.createObjectURL(file);
          // this.documentSelectedExp = fileUrl;

          // this.loading = false;
        })
        .catch(r => {});
      // this.selectedDocumentForCedula.formato_documento_id = 1
      // this.selectedDocumentForCedula.formato = ".PDF"
    },

    _base64ToArrayBuffer(base64) {
      let binary_string = atob(base64.toString().split(",")[1]);
      console.log(binary_string);
      let len = binary_string.length;
      let bytes = new Uint8Array(len);
      console.log(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes.buffer;
    },

    seeDocumentsOfExp() {
      // this.loading = true;
      // this.selectedDocumentForCedula = null;
      // this.actuacion_selected = item;
      // this.documentos.push({ id: 0, nombre: "Caratula" });
      this.$store.state.services.actuacionService
        .getDocument(this.cedula.item.id)
        .then(r => {
          this.documentosExp = r.data;
          console.log(r.data);
          this.documentosExp = this.documentosExp.map(x => {
            // "data:application/pdf;base64,"
            x.path = x.path;
            return x;
            // x.size = parseFloat(x.size) / 1024;
          });
          // this.documentos.push({ id: 0, nombre: "Caratula" });
          // this.styleObjectDocumento.display = "block";
          // this.abrirModalDocumento = "modal fade in";
          // this.modalDocumento = true;
          // this.loading = false;
        })
        .catch(r => {});
    },

    uploadOneDocumentInComponent(file) {
      //this.documentosGuardar[0] = file
      console.log(file);
      // this.documentosGuardar.push(file)
    },

    verDocumento(item) {
      console.log("Selecting the document: ");
      console.log(item);
      this.show = false;
      this.src = "";
      if (item) {
        let self = this;
        self.loading = true;
        if (item.id > 0) {
          self.$store.state.services.documentoactuacionService
            .get(item.path)
            .then(r => {
              this.nombreDocumento = item.nombre;
              this.show = true;
              let pdfData = this._base64ToArrayBuffer(r.data);
              let file = new Blob([pdfData], { type: "application/pdf" });
              let fileUrl = URL.createObjectURL(file);
              this.src = fileUrl;
              self.loading = false;
            })
            .catch(r => {});
        } else {
          self.$store.state.services.caratulaexpedienteService
            .getCaratulaActuacion(self.actuacion_selected.id)
            .then(r => {
              this.show = true;
              this.src = r.data;
              self.loading = false;
            })
            .catch(r => {});
        }
      }
    },

    total_folios() {
      this.cedula.folios = 0;

      //   this.documentosGuardar.forEach(x => {
      //     this.cedula.folios += x.cantidad_folio;
      //   });
    },
    validateState(ref) {
      if (
        this.veeFields[ref] &&
        (this.veeFields[ref].dirty || this.veeFields[ref].validated)
      ) {
        return !this.veeErrors.has(ref);
      }
      return null;
    },

    eliminarDocumento(doc) {
      this.datos.documento_principal.forEach(x => {
        if (x.id === doc.id) {
          x.conservar = 0;
        }
      });
    },

    llenarCampos(datos) {
      // let datos = this.cedula.representante;
      console.log("this.cedula.representante");
      console.log(this.cedula.representante);
      console.log("datos");
      console.log(datos);
      this.cedula.razon_social = datos.nombre_notificar;
      this.cedula.email = datos.email;
      this.cedula.emailAlterno = datos.emailAlterno;
      this.cedula.direccion = datos.direccion;
      this.cedula.dep_notificacion = {
        id: datos.departamento_id,
        nombre: datos.departamento
      };

      this.cedula.mun_notificacion = {
        id: datos.municipio_id,
        nombre: datos.municipio
      };
      this.cedula.empresa = datos.empresa;
    },

    validarRepresentantes() {
      if (this.datos !== undefined) {
        if (this.datos.representante.length === 0) {
          this.ingresoManual = true;
          return false;
        } else {
          return true;
        }
      } else {
        if (this.manual === false) {
          return true;
        } else {
          this.ingresoManual = true;
        }
      }
    },

    eliminarEspacio() {
      this.documentos.pop();
    },

    agregarEspacio() {
      this.documentos.push(this.documento);
    },

    onFileChange(e, item) {
      e.target.files;
      let files = e.target.files || e.dataTransfer.files;
      // console.log('tamanio');
      // console.log(parseFloat((files[0].size / 1024)/1000));
      item.megas = 150;
      // console.log('item');
      console.log(item);
      if (parseFloat(files[0].size / 1024 / 1000) > 150) {
        item.estado = "danger";
      }
      if (!files.length) {
        return;
      } else {
        this.validarDocumento(files[0], item);
      }
    },

    validarDocumento(file, item) {
      this.documentoGrande = false;
      let self = this;
      let reader = new FileReader();
      let tamanio = file.size;
      let formato = item.formato.toLowerCase();
      let equivalente = parseFloat(tamanio / 1048576);
      // console.log('file.size');
      // console.log(parseFloat((tamanio / 1024)/1000));
      // console.log(equivalente, tamanio);
      let extension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      this.numPages = 0;

      if (
        formato.substring(formato.lastIndexOf(".")) !== extension.toLowerCase()
      ) {
        self.$swal("El formato del documeto debe de ser " + formato);
      } else {
        if (equivalente < parseInt(item.megas)) {
          let objeto = new Object();
          reader.onload = e => {
            this.numPages = pdf.numPages;
            item.folio = this.numPages;

            objeto.cantidad_folio = this.numPages;
            objeto.nombre = file.name;
            objeto.path = e.target.result;
            // objeto.tramite_requisito_id = item.id;
            objeto.size = equivalente;
            // objeto.requisito_id = item.requisito_id;
            objeto.formato_documento_id = item.formato_id;

            self.$swal({
              position: "top-end",
              type: "success",
              title: "Documento agregado correctamente",
              showConfirmButton: false,
              timer: 1500
            });
          };

          reader.readAsDataURL(file);

          let reader2 = new FileReader();
          reader2.readAsBinaryString(file);
          reader2.onloadend = function() {
            let count = reader2.result.match(/\/Type[\s]*\/Page[^s]/g).length;
            this.numPages = count;
            objeto.cantidad_folio = count;
            item.folio = this.numPages;
            item.folio = count;
            this.documentosGuardar.push(objeto);
            console.log("Number of Pages:", count);
          };
        } else {
          self.$swal({
            html:
              '<a href="https://www.ilovepdf.com/es/comprimir_pdf" target="_blank"><h1>Dar clic aquí</h1></a> ',
            title:
              "El tamaño del documento debe de tener menos de " +
              item.megas +
              " MB y el documento tiene " +
              parseFloat(equivalente / 1000).toFixed(2) +
              " MB" +
              " " +
              "Le recomendamos usar la siguiente herramienta para comprimir sus archivos PDF"
          });
        }
      }
    },

    async getAllManual() {
      try {
        let r = await this.$store.state.services.notificacionesService.getAllManual();
        console.log("respuesta get all manual");
        console.log(r);
        this.departamentos = r.data.departamento;
        this.municipios = r.data.municipio;
        this.municipiosTemp = r.data.municipio;
        this.tipo_cedula = r.data.tipo_cedula;
      } catch (error) {
        this.$toastr.error(r.message, "ERROR");
      }
    },

    manualRepresentante() {
      if (this.manual !== true) {
        if (
          this.cedula.representante !== null &&
          this.ingresoManual === false
        ) {
          return true;
        } else {
          this.cedula.representante = null;
          return false;
        }
      } else {
        this.ingresoManual = true;
      }
    },

    numerosLetras(numero) {
      if (numero !== "") {
        if (numero !== "1") {
          if (numero === "2021") {
            return "DOS MIL VEINTIUNO";
          } else {
            let letras = convertir.NumerosALetras(numero);
            let numeros = letras.split(" Pesos ");
            return numeros[0];
          }
        } else if (numero === "1") {
          return "UNO";
        }
      } else {
        return "";
      }
    },

    esLetra(dato) {
      let ascii = dato.toUpperCase().charCodeAt(0);
      return ascii > 64 && ascii < 91;
    },

    validarCampos() {
      if (this.manual === false) {
        if (this.ingresoManual === false) {
          this.cedula.tipoDocumento !== null;
          this.cedula.item !== null;
          this.cedula.numero_exp !== null;
          this.cedula.direccionMEM !== null;
          this.cedula.fecha_ingreso !== null;
        }
      }
    },

    guardarCedula() {
      this.$validator.validateAll().then(result => {
        console.log(this.cedula);

        // console.log(result);
        if (result) {
          // console.log(this.cedula.direccionMEM, this.cedula.tipoDocumento, this.cedula.dep_notificacion, this.cedula.mun_notificacion);
          if (
            this.cedula.direccionMEM != null &&
            this.cedula.tipoDocumento != null &&
            this.cedula.dep_notificacion != null &&
            this.cedula.mun_notificacion != null
          ) {
            console.log(this.copia);
            console.log(this.manual);
            this.$emit("carga", true);
            this.cedula.manual = this.ingresoManual;
            this.cedula.documentos = this.documentosGuardar;
            this.total_folios();
            console.log(this.cedula.folios);
            if (this.copia === true) {
              console.log("guardar copia");
              this.guardarCopia();
            } else if (this.manual === false) {
              console.log("guardar");
              this.cedula.documentos = this.documentosGuardar;
              this.guardar();
            } else if (this.manual === true) {
              console.log("guardar manual");
              this.cedula.documentos = this.documentosGuardar;
              this.guardarManual();
            }
          } else {
            this.$toastr.warning(
              "Por favor revisa que los campos desplegables estén llenos",
              "Atención"
            );
          }
        }
      });
    },

    exitoFail(status) {
      if (status === 200) {
        this.$toastr.success("CEDULA GUARDADA EXITOSAMENTE", "EXITO");
      } else {
        this.$toastr.error(
          "A OCURRIDO UN ERROR AL INTENTAR GUARDAR LA CEDULA",
          "ERROR"
        );
      }
    },

    guardar() {
      console.log(this.cedula);
      this.$store.state.services.notificacionesService
        .saveNotificationCedula(this.cedula)
        .then(r => {
          this.exitoFail(r.status);
          this.$emit("carga", false);
          this.$emit("guardado");
          this.limpiarCedula();
        })
        .catch(r => {
          this.$toastr.error(r.message, "ERROR");
        });
    },

    guardarCopia() {
      console.log(this.cedula);
      this.$store.state.services.notificacionesService
        .saveCopia(this.cedula)
        .then(r => {
          this.exitoFail(r.status);
          this.$emit("carga", false);
          this.$emit("copia");
          this.limpiarCedula();
        })
        .catch(r => {
          this.$toastr.error(r.message, "ERROR");
        });
    },

    limpiarCedula() {
      this.documentosGuardar = [];
      this.src = null;
      this.cedula.tipoDocumento = null;
      this.cedula.item = null;
      this.cedula.fecha_ingreso = null;
      this.cedula.fecha_documento = null;
      this.cedula.numero_documento = "";
      this.cedula.numero_exp = " ";
      this.cedula.representante = null;
      this.cedula.direccionMEM = "";
      this.cedula.direccion = " ";
      this.cedula.manual = null;
      this.cedula.razon = null;
      this.cedula.razon_social = "";
      this.cedula.numero_documento_letras = "";
      this.cedula.departamento = null;
      this.cedula.municipio = null;
      this.cedula.email = null;
      this.cedula.documentos = null;
      this.cedula.folios = 0;
      this.cedula.folios_correcion = null;
      this.cedula.documentos = [];
      this.$emit("cerrar_modal");
    },

    guardarManual() {
      console.log(this.cedula);

      this.$store.state.services.notificacionesService
        .save(this.cedula)
        .then(r => {
          this.exitoFail(r.status);
          this.$emit("carga", false);
          this.$emit("guardado");
          this.limpiarCedula();
          //    this.$router.push({ path: `/notf_reg` });
        })
        .catch(r => {
          this.$toastr.error(r.message, "ERROR");
        });
    },

    asignacionRepresentante(representantes, empresa, objetivo) {
      console.log("representantes");
      console.log(representantes);

      if (representantes.length === 0) {
        // this.$toastr.error(
        //   "El expediente no cuenta con representantes",
        //   "Atención"
        // );
        return;
      }
      representantes.forEach(x => {
        objetivo.push({
          continente: x.continente,
          departamento_id: x.departamento_id,
          departamento: x.departamento,
          nombre: x.razon_social,
          direccion: x.direccion_notificacion,
          municipio_id: x.municipio_id,
          municipio: x.municipio,
          pais: x.pais,
          razon_social_id: x.razon_social_id,
          empresa: 0,
          razon_social: x.razon_social,
          nombre_notificar: x.razon_social,
          email: x.email,
          emailAlterno: x.email_alternativo
        });
      });

      // objetivo.push({
      //   continente: empresa.continente,
      //   departamento_id: empresa.departamento_id,
      //   departamento: empresa.departamento,
      //   nombre: empresa.empresa,
      //   direccion: empresa.direccion_notificacion,
      //   municipio_id: empresa.municipio_id,
      //   municipio: empresa.municipio,
      //   pais: empresa.pais,
      //   razon_social_id: empresa.razon_social_id,
      //   empresa: 1,
      //   razon_social: empresa.razon_social,
      //   nombre_notificar: empresa.empresa,
      //   email: empresa.email,
      //   emailAlterno: empresa.email_alternativo,
      // });
    },

    getAll(expediente_id) {
      this.$store.state.services.notificacionesService
        .getAll(expediente_id)
        .then(r => {
          this.departamentos = r.data.departamento;
          this.municipios = r.data.municipio;
          this.tipo_cedula = r.data.tipo_cedula;
          console.log("r get all");
          console.log(r);
          let rep = [];
          this.asignacionRepresentante(r.data.data, r.data.empresa[0], rep);
          this.representantes = rep;
          console.log("rep");
          console.log(rep);
          this.$emit("carga", false);
        })
        .catch(r => {
          this.$toastr.error(r.message, "ERROR");
        });
    },
    editarFecha() {
      if (this.editarFechavalue) {
        this.editarFechavalue = false;
        var f = new Date();
        let fecha_actual =
          ("0" + f.getDate()).slice(-2) +
          "/" +
          (f.getMonth() + 1) +
          "/" +
          f.getFullYear() +
          " " +
          ("0" + f.getHours()).slice(-2) +
          ":" +
          ("0" + f.getMinutes()).slice(-2);
        this.cedula.fecha_ingreso = fecha_actual;
      } else {
        this.$swal({
          title: "Envío de código de verificación",
          text: "Necesita un código de verificación",
          showCancelButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Enviar Código"
        }).then(result => {
          if (result.value) {
            console.log(result);
            this.idleSecondsTimer = window.setInterval(
              this.CheckIdleTime,
              1000
            );
            this.$toastr.success(
              "Confirmado",
              "Código enviado, tiene (3) minutos de válides, después de esto expirará",
              {
                progressBar: true,
                timeOut: 7000,
                closeMethod: "fadeOut",
                positionClass: "toast-bottom-right"
              }
            );

            this.$store.state.services.notificacionValidacionService
              .enviarCodigoVerificacion()
              .then(r => {
                console.log("enviado", r);
                this.validarCodigo();
              })
              .catch(r => {
                this.$toastr.error(r.message, "ERROR");
                this.editarFechavalue = false;
              });

            //console.log("valida",valida)
          } else {
            console.log("cancelado de enviar");
            this.cambiarEdicion = false;
            this.editarFechavalue = false;
          }
        });
      }
    },

    disabledBeforeTodayAndAfterAWeek(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today;
    },

    CheckIdleTime() {
      //valida tiempo de sesión
      this.idleSecondsCounter--;
      this.tiempoActual = this.convert(this.idleSecondsCounter);
      //console.log("segundos",this.idleSecondsCounter)

      if (this.idleSecondsCounter <= this.IDLE_TIMEOUT) {
        window.clearInterval(this.idleSecondsTimer);
        this.$toastr.warning("Tiempo", "El código a vencido", {
          progressBar: true,
          timeOut: 2000,
          closeMethod: "fadeOut",
          positionClass: "toast-bottom-right"
        });
        this.idleSecondsCounter = 180;
        this.tiempoActual = "";
      }
    },
    convert(value) {
      return Math.floor(value / 60) + ":" + (value % 60 ? value % 60 : "00");
    },

    validarCodigo() {
      this.$swal({
        title: "Confirmación de edición",
        text: "* Si no llega la notificación, favor intenta de nuevo",
        input: "text",
        showCancelButton: true,
        inputPlaceholder: "Escriba el código",
        inputAttributes: {
          autocapitalize: "off",
          autocorrect: "off"
        },
        cancelButtonText: "Cancelar",
        confirmButtonText: "Verificar"
      }).then(result => {
        if (result.value) {
          console.log(result);
          let token = { token: result.value };
          console.log("token", token);

          this.$store.state.services.notificacionValidacionService
            .validarCodigo(token)
            .then(r => {
              console.log(r);
              if (r.data == 1) {
                window.clearInterval(this.idleSecondsTimer);
                this.idleSecondsCounter = 180;
                this.tiempoActual = "";

                this.editarFechavalue = true;
                this.cambiarEdicion = true;
                this.$toastr.info("Código válido", "Puedes editar la fecha", {
                  progressBar: true,
                  timeOut: 3000,
                  closeMethod: "fadeOut",
                  positionClass: "toast-bottom-right"
                });
              } else {
                this.editarFechavalue = false;
                this.cambiarEdicion = false;
                this.$toastr.error("Código inválido", "Vuelve a intentarlo", {
                  progressBar: true,
                  timeOut: 3000,
                  closeMethod: "fadeOut",
                  positionClass: "toast-bottom-right"
                });
                if (this.idleSecondsCounter > 0) this.validarCodigo();
                else this.$swal.Close();
              }
            })
            .catch(r => {
              this.$toastr.error(r.message, "ERROR");
              this.editarFechavalue = false;
              this.cambiarEdicion = false;
            });
        } else {
          console.log("cancelado");
          window.clearInterval(this.idleSecondsTimer);
          this.idleSecondsCounter = 180;
          this.tiempoActual = "";
          this.cambiarEdicion = false;
          this.editarFechavalue = false;
        }
      });
    },

    async setDep(item) {
      console.log("item");
      console.log(item);
      item.departamento = item.nombre;
      item.departamento_id = item.id;
      this.municipiosTemp = this.municipios.filter(
        x => x.departamento_id === item.departamento_id
      );
      console.log(this.municipiosTemp);
    },

    async setMun(item) {
      console.log("item");
      console.log(item);
      item.municipio = item.nombre;
      item.municipio_id = item.id;
      // this.municipiosTemp = this.municipios.filter(x => x.departamento_id === item.departamento_id);
      // console.log(this.municipiosTemp);
    }
  },
  mounted() {
    $("body").resize();
  }
};
</script>

<style scoped>
.pure-material-switch {
  z-index: 0;
  position: relative;
  display: inline-block;
  color: rgba(var(--pure-material-onsurface-rgb, 0, 0, 0), 0.87);
  font-family: var(
    --pure-material-font,
    "Roboto",
    "Segoe UI",
    BlinkMacSystemFont,
    system-ui,
    -apple-system
  );
  font-size: 16px;
  line-height: 1.5;
}

/* Input */
.pure-material-switch > input {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  z-index: -1;
  position: absolute;
  right: 6px;
  top: -8px;
  display: block;
  margin: 0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  background-color: rgba(var(--pure-material-onsurface-rgb, 0, 0, 0), 0.38);
  outline: none;
  opacity: 0;
  transform: scale(1);
  pointer-events: none;
  transition: opacity 0.3s 0.1s, transform 0.2s 0.1s;
}

/* Span */
.pure-material-switch > span {
  display: inline-block;
  width: 100%;
  cursor: pointer;
}

/* Track */
.pure-material-switch > span::before {
  content: "";
  float: right;
  display: inline-block;
  margin: 5px 0 5px 10px;
  border-radius: 7px;
  width: 36px;
  height: 14px;
  background-color: rgba(var(--pure-material-onsurface-rgb, 0, 0, 0), 0.38);
  vertical-align: top;
  transition: background-color 0.2s, opacity 0.2s;
}

/* Thumb */
.pure-material-switch > span::after {
  content: "";
  position: absolute;
  top: 2px;
  right: 16px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background-color: rgb(var(--pure-material-onprimary-rgb, 255, 255, 255));
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  transition: background-color 0.2s, transform 0.2s;
}

/* Checked */
.pure-material-switch > input:checked {
  right: -10px;
  background-color: rgb(var(--pure-material-primary-rgb, 33, 150, 243));
}

.pure-material-switch > input:checked + span::before {
  background-color: rgba(var(--pure-material-primary-rgb, 33, 150, 243), 0.6);
}

.pure-material-switch > input:checked + span::after {
  background-color: rgb(var(--pure-material-primary-rgb, 33, 150, 243));
  transform: translateX(16px);
}

/* Hover, Focus */
.pure-material-switch:hover > input {
  opacity: 0.04;
}

.pure-material-switch > input:focus {
  opacity: 0.12;
}

.pure-material-switch:hover > input:focus {
  opacity: 0.16;
}

/* Active */
.pure-material-switch > input:active {
  opacity: 1;
  transform: scale(0);
  transition: transform 0s, opacity 0s;
}

.pure-material-switch > input:active + span::before {
  background-color: rgba(var(--pure-material-primary-rgb, 33, 150, 243), 0.6);
}

.pure-material-switch > input:checked:active + span::before {
  background-color: rgba(var(--pure-material-onsurface-rgb, 0, 0, 0), 0.38);
}

/* Disabled */
.pure-material-switch > input:disabled {
  opacity: 0;
}

.pure-material-switch > input:disabled + span {
  color: rgb(var(--pure-material-onsurface-rgb, 0, 0, 0));
  opacity: 0.38;
  cursor: default;
}

.pure-material-switch > input:disabled + span::before {
  background-color: rgba(var(--pure-material-onsurface-rgb, 0, 0, 0), 0.38);
}

.pure-material-switch > input:checked:disabled + span::before {
  background-color: rgba(var(--pure-material-primary-rgb, 33, 150, 243), 0.6);
}
</style>
