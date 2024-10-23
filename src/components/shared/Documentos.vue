<template>
  <div>
    <!-- VISTA PREVIA DEL DOCUMENTO -->
    <!-- <div
      v-if="src !== null"
      class="col-sm-12 col-md-12 col-lg-12"
    >
      <pdf
        v-for="i in numPages"
        :key="i"
        :src="src"
        :page="i"
        style="display: inline-block; width: 10%"
      ></pdf>
      <br /><br />
    </div> -->
    <div class="row" v-if="loadingtabla">
      <div class="col-md-12">
        <span
          >{{ mensaje }}
          <div class="loadingclass">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </span>
      </div>
    </div>

    <!-- ADJUNTAR LOS DOCUMENTOS -->
    <template v-for="(item, index) in documentos">
      <div v-bind:key="index" class="col-sm-12 col-md-12 col-lg-12">
        <label for="file">{{ item.requisito }}</label>
        <div class="input-group input-group-lg">
          <div class="input-group-btn">
            <button
              type="button"
              :class="'btn btn-' + item.estado + ' btn-small btn-disabled'"
            >
              Adjuntar documento |
              <small>Páginas {{ item.folio }}</small>
            </button>
          </div>
          <input
            type="file"
            accept="application/pdf"
            :data-vv-name="item.requisito"
            v-validate="'mimes:application/pdf'"
            :name="item.requisito"
            @change="onFileChange($event, item)"
            ref="inputFile"
            class="form-control inputfile inputfile-6"
          />
          <FormError :attribute_name="item.requisito" :errors_form="errors">
          </FormError>
        </div>

        <br />
      </div>
    </template>
    <br />

    <!-- BOTONES AGREGAR O QUITAR DOCUMENTOS -->

    <div class="col-md-12">
      <button
        @click="agregarEspacio()"
        type="button"
        class="btn btn-success btn-circle"
        v-tooltip.botton="
          'Al dar click podra agregar espacio para adjuntar documentos'
        "
      >
        <i class="fa fa-plus"></i>
      </button>
      <button
        v-if="documentos.length > 1"
        @click="eliminarEspacio()"
        type="button"
        class="btn btn-danger btn-circle"
        v-tooltip.botton="
          'Al dar click podra eliminar espacio para adjuntar documentos'
        "
      >
        <i class="fa fa-minus"></i>
      </button>
    </div>

    <!-- FOLIOS DEL DOCUMENTO -->

    <div class="col-md-2">
      <div class="text-center">
        <label for="folio_inicial">Cantidad de folios</label>
        <h3>
          <strong> {{ numPages }} </strong>
        </h3>
      </div>
    </div>
    <div class="col-sm-12 col-md-10 col-lg-10">
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
    </div>
  </div>
</template>

<script>
import FormError from "./FormError";
import pdf from "vue-pdf";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/es/es";
import moment from "moment";
import { PDFDocument } from 'pdf-lib';
import {
  EnhancedCheck,
  EnhancedCheckGroup,
  EnhancedCheckRadio,
  EnhancedToggle,
} from "vue-enhanced-check";
export default {
  name: "Documentos",
  props: ["documentos", "documentosGuardar", "folios_correcion", "botones", "uploadOneDocumentInComponent"],
  // props: ['documentos', 'botones', 'folios_correcion'],
  components: {
    FormError,
    EnhancedCheck,
    EnhancedCheckGroup,
    EnhancedCheckRadio,
    EnhancedToggle,
    pdf,
    DatePicker,
    moment,
  },
  data() {
    return {
      loadingtabla: false,
      loading: false,
      // folios_correcion: 0,
      folios_t: 0,
      src: null,
      numPages: null,
      doc: {
        folio: 0,
        formato: ".PDF",
        formato_id: 1,
        megas: 200,
        requisito: "ADJUNTAR DOCUMENTO",
        estado: "primary",
      },
      mensaje: "",
    };
  },
  created() {
    console.log("attachments")
    console.log(this.documentos);
    this.numPages = 0;
  },
  computed: {},
  methods: {
    eliminarEspacio() {
      this.documentos.pop();
      this.documentosGuardar.pop();
      this.src = null;
      // this.total_folios();
    },

    agregarEspacio() {
      // this.doc.folio = 0;
      this.documentos.push({
        folio: 0,
        formato: ".PDF",
        formato_id: 1,
        megas: 200,
        requisito: "ADJUNTAR DOCUMENTO",
        estado: "primary",
        tramite_requisito_id: null,
        id: null,
      });
    },

    onFileChange(e, item) {
      item.estado = "primary";
      
      this.mensaje = "Cargando archivo ...";
      this.loadingtabla = true;
      e.target.files;
      let files = e.target.files || e.dataTransfer.files;
      item.megas = 200;
      if (parseFloat(files[0].size / 1048576) >= 200) {
        item.estado = "danger";
        item.folio = 0;
      }
      if (!files.length) {
        return;
      } else {
        this.validarDocumento(files[0], item);
      }
    },

    async validarDocumento(file, item) {
      this.loadingtabla = true;
      this.documentoGrande = false;
      let self = this;
      let reader = new FileReader();
      let tamanio = file.size;
  
      if (item.formato !== undefined) {
        item.formato.toLowerCase();
      }

      let equivalente = parseFloat(tamanio / 1048576);

      let extension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      this.numPages = 0;
      let objeto = new Object();

      if (equivalente <= parseInt(item.megas)) {
        reader.onload = (e) => {
          objeto.nombre = file.name;
          objeto.path = e.target.result;
          objeto.tramite_requisito_id = item.tramite_requisito_id;
          objeto.requisito_id = item.id;
          objeto.size = equivalente;
          objeto.formato_documento_id = item.formato_documento_id;
          item.formato_id === undefined
            ? (objeto.formato_documento_id = 1)
            : (objeto.formato_documento_id = item.formato_id);

          self.$swal({
            position: "top-end",
            type: "success",
            title: "Documento agregado correctamente",
            showConfirmButton: false,
            timer: 1500,
          });

          this.loadingtabla = false;
        };

        reader.readAsDataURL(file);

        let reader2 = new FileReader();
        reader2.readAsBinaryString(file);
        reader2.onloadend = async ()  => {
          const pagesCount = await this.getPageCount(file);
          objeto.cantidad_folio = pagesCount;
          objeto.archivo_original = file;
          objeto.folio = pagesCount;
          item.folio = pagesCount;
          this.numPages = pagesCount;
          console.log("Number of Pages:", pagesCount);
          this.documentosGuardar.push(objeto);
        };
        this.$emit("uploadOneDocumentInComponent", objeto);

      } else {
        
        this.loadingtabla = false;
        file = null;

        self.$swal({
          html: '<a href="https://www.ilovepdf.com/es/comprimir_pdf" target="_blank"><h1>Dar clic aquí</h1></a> ',
          title:
            "El tamaño del documento debe de tener menos de " +
            item.megas +
            " MB y el documento tiene " +
            parseFloat(equivalente).toFixed(2) +
            " MB" +
            " " +
            "Le recomendamos usar la siguiente herramienta para comprimir sus archivos PDF",
        });
      }
      // }
    },
    
    async getPageCount(file){

      const arrayBuffer = await this.readFile(file);

      const pdf = await PDFDocument.load(arrayBuffer);

      return pdf.getPageCount();
    },


    async readFile (file) {
      return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);

        reader.readAsArrayBuffer(file);
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.loadingclass {
  $colors: #7ef9ff, #89cff0, #4682b4, #0f52ba, #000080;
  display: flex;
  margin-left: 40%;

  .dot {
    position: relative;
    width: 2em;
    height: 2em;
    margin: 0.8em;
    border-radius: 50%;

    &::before {
      position: absolute;
      content: "";
      width: 100%;
      height: 100%;
      background: inherit;
      border-radius: inherit;
      animation: wave 2s ease-out infinite;
    }

    @for $i from 1 through 5 {
      &:nth-child(#{$i}) {
        background: nth($colors, $i);

        &::before {
          animation-delay: $i * 0.2s;
        }
      }
    }
  }
}

@keyframes wave {
  50%,
  75% {
    transform: scale(2.5);
  }

  80%,
  100% {
    opacity: 0;
  }
}
</style>