import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import AttachmentList from "../AttachmentList/AttachmentList.vue";
// import Vue from 'vue'
// import pdf from "vue-pdf";
import XLSX from 'xlsx';
export default {
  name: "Attachment",
  props: ['tipo', 'index'],
  data() {
    return {
      registros: [],
      msg: "Welcome to Your Vue.js App",
      tempAttachments: [],
      attachments: [],
      folios: -1,
      base64: '',
      src: "",
      num: 0,
      loading: false,
      dropzoneOptions: {
        url: 'No se usa',
        paramName: function () {
          return "file[]";
        },
        maxFilesize: 1024000, // MB
        includeStyling: false,
        previewsContainer: false,
        uploadMultiple: false,
        parallelUploads: 20,
        autoProcessQueue: false,
      }
    };
  },
  
  components: {
    vueDropzone: vue2Dropzone,
    AttachmentList: AttachmentList
  },

  watch: {

  },
  methods: {

    sliceMe(f) {
      var file = f,
        fr = new FileReader,
        chunkSize = 2097152,
        chunks = Math.ceil(file.size / chunkSize),
        chunk = 0;

      function loadNext() {
        var start, end,
          blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice;

        start = chunk * chunkSize;
        end = start + chunkSize >= file.size ? file.size : start + chunkSize;

        fr.onload = function () {
          if (++chunk < chunks) {
            //console.info(chunk);
            loadNext(); // shortcut here
          }
        };
        fr.readAsBinaryString(blobSlice.call(file, start, end));
      }

      loadNext();
    },

    // function called for every file dropped or selected
    async fileAdded(file) {

      console.log("llenando file");
      this.loading = true;
      this.tempAttachments = [];
      console.log("File Dropped => ", file);
      // Construct your file object to render in the UI
      let attachment = {};

      if (file.size <= 30000000) {
        console.log("dadasd");
        console.log("attachment");
        console.log(attachment);
      } else {

        await this.$swal.fire({
          title: 'Vaya! , tu archivo ' + file.name + ' esto tomará varios minutos, no canceles la transacción, gracias por tu paciencia',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        })
      }

      let date = new Date();
      let mes = (date.getMonth() + 1);
      // let mes = 1;
      let mes_declaracion = (date.getMonth() + 1) - 1;
      let anio = date.getFullYear();
      mes === 1 ? (anio = anio - 1, mes_declaracion = 12) : console.log("anio: " + anio);

      let reader = new FileReader();
      try {
        let self = this;
        reader.onload = function (e) {
          var data = new Uint8Array(e.target.result);
          var workbook = XLSX.read(data, { type: 'array' });
          let sheetName = workbook.SheetNames[0]
          /* DO SOMETHING WITH workbook HERE */
          let worksheet = workbook.Sheets[sheetName];
          let datas = XLSX.utils.sheet_to_json(worksheet);
          if (self.tipo === 1) {
            if (file.type == "application/vnd.ms-excel") { // consulta
              let registro = [];
              datas.forEach(x => {
                let fecha_emision = x['Fecha de emisión'];
                // let fecha_emision = "2022-01-01T14:47:49-06:00";
                fecha_emision = (fecha_emision.split("T"))[0];
                let mes_emision = parseInt((fecha_emision.split("-"))[1]);
                let anio_emision = parseInt((fecha_emision.split("-"))[0]);
                // 2021-12-31T14:47:49-06:00
                if (mes_emision === mes_declaracion && anio_emision === anio) {
                  registro.push({
                    fecha_emision: x['Fecha de emisión'],
                    numero_autorizacion: x['Número de Autorización'],
                    tipo_dte: x['Tipo de DTE (nombre)'],
                    serie: x['Serie'],
                    numero_dte: x['Número del DTE'],
                    nit_emisor: x['NIT del emisor'],
                    nombre_emisor: x['Nombre completo del emisor'],
                    codigo_establesimiento: x['Código de establecimiento'],
                    nombre_establesimiento: x['Nombre del establecimiento'],
                    nit_receptor: x['ID del receptor'],
                    nombre_receptor: x['Nombre completo del receptor'],
                    nit_certificador: x['NIT del Certificador'],
                    nombre_certificador: x['Nombre completo del Certificador'],
                    moneda: x['Moneda'],
                    monto: x['Monto (Gran Total)'],
                    anulado: x['Marca de anulado'],
                    monto_iva: x['IVA (monto de este impuesto)'],
                    monto_petroleo: x['Petróleo (monto de este impuesto)'],
                    monto_turismo_hospedaje: x['Turismo Hospedaje (monto de este impuesto)'],
                    monto_turismo_pasajes: x['Turismo Pasajes (monto de este impuesto)'],
                    monto_timbre_prensa: x['Timbre de Prensa (monto de este impuesto)'],
                    monto_bomberos: x['Bomberos (monto de este impuesto)'],
                    monto_tasa_municipal: x['Tasa Municipal (monto de este impuesto)'],
                    monto_bebidas_alcoholicas: x['Bebidas alcohólicas (monto de este impuesto)'],
                    monto_tabaco: x['Tabaco (monto de este impuesto)'],
                    monto_cemento: x['Cemento (monto de este impuesto)'],
                    monto_bebidas_no_alcoholicas: x['Bebidas no Alcohólicas (monto de este impuesto)'],
                    monto_tarifa_portuaria: x['Tarifa Portuaria (monto de este impuesto)'],
                  })
                } else {
                  self.$toast.error("REGISTRO INVALIDO");
                }
              });
              // registro.length > 0 ? self.$emit('archivo', file) : console.log("ARCHIVO DENEGADO");
              self.$emit('registro', { registros: registro, tipo: self.tipo, archivo: file });
            } else {
              self.$toast.error(
                "EL DOCUMENTO INGRESADO ES INVALIDO"
              );
            }
          } else if (self.tipo === 2) {
            if (file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && self.tipo === 2) {
              let encabezado = {
                periodo_inicio: worksheet.B3.h,
                periodo_fin: worksheet.E3.h,
                // periodo_inicio: "01/12/2021",
                // periodo_fin: "31/12/2021",
                nit_retenido: worksheet.B4.h,
                nombres_contribuyente: (worksheet.D4.h).split(", ")[0],
                apellidos_contribuyente: (worksheet.D4.h).split(", ")[1],
                usuario: worksheet.F4.h,
                total_constancias: parseInt(worksheet.B5.h),
              };

              console.log("Periodo de inicio");
              console.log(encabezado);
              let mes_inicio = parseInt(encabezado.periodo_inicio.split("/")[1]);
              let anio_inicio = parseInt(encabezado.periodo_inicio.split("/")[2]);
              let mes_fin = parseInt(encabezado.periodo_fin.split("/")[1]);
              let anio_fin = parseInt(encabezado.periodo_fin.split("/")[2]);

              if ((mes_inicio === mes_declaracion && anio_inicio === anio) && (mes_fin === mes_declaracion && anio_inicio === anio_fin)) {
                worksheet.A1 = "nit_retenidor";
                worksheet.A2 = "";
                worksheet.A3 = "";
                worksheet.A4 = "";
                worksheet.A5 = "";
                worksheet.B3 = "";
                worksheet.B4 = "";
                worksheet.B5 = "";
                worksheet.C4 = "";
                worksheet.D3 = "";
                worksheet.D4 = "";
                worksheet.E3 = "";
                worksheet.E4 = "";
                worksheet.F4 = "";
                worksheet.B1 = "nombre_retenedor";
                worksheet.C1 = "estado_constancia";
                worksheet.D1 = "constancia";
                worksheet.E1 = "fecha_emision";
                worksheet.F1 = "total_factura";
                worksheet.G1 = "importe_neto";
                worksheet.H1 = "afecto_retencion";
                worksheet.I1 = "total_retencion";

                let datas = XLSX.utils.sheet_to_json(worksheet);
                datas = datas.reverse();

                let registros = [];
                datas.forEach((x, i) => {
                  if ((i + 1) <= encabezado.total_constancias) {
                    registros.push({
                      nit_retenedor: x[""],
                      nombre_retenedor: x._1,
                      estado_constancia: x._2,
                      constancia: x._3,
                      fecha_emision: x._4,
                      total_factura: x._5,
                      importe_neto: x._6,
                      afecto_retencion: x._7,
                      total_retencion: x._8,
                    });
                  }
                });
                let obj = {
                  encabezado: encabezado,
                  tipo: self.tipo,
                  registros: registros,
                  archivo: file
                }
                self.$emit('archivo', file);
                self.$emit('registro2', obj);
              } else {
                self.$toast.error(
                  "EL DOCUMENTO INGRESADO ES INVALIDO"
                );
              }

            } else {
              self.$toast.error(
                "EL DOCUMENTO INGRESADO ES INVALIDO"
              );
            }
          } else {
            self.$toast.error(
              "EL DOCUMENTO INGRESADO ES INVALIDO"
            );
          }

        };
      } catch (error) {
        self.$toast.error(
          "EL DOCUMENTO INGRESADO ES INVALIDO: " + error
        );
      }
      reader.readAsArrayBuffer(file);
    },

    async enviarDato(file, attachment) {
      this.$emit("archivo", file, attachment, this.index, this.folios, this.base64)
    },

    // a middle layer function where you can change the XHR request properties
    sendingFiles(files) {
      console.log(
        "if you want to change the upload time or add data to the formData you can do it here."
      );
      console.log("Files sending", files);
    },

    // function where we get the upload progress
    uploadProgress(file, progress) {
      console.log("File Upload Progress", progress);
      this.tempAttachments.map(attachment => {
        if (attachment.title === file.name) {
          attachment.progress = `${Math.floor(progress)}`;
          console.log(`${Math.floor(progress)}`);
        }
      });
    },

    remover_archivo(index) {
      this.tempAttachments = [];
      this.$emit("remover_archivo", index)
      console.log("index", index);
    },

  },
  computed: {
    getTempAttachments() {
      return this.tempAttachments;
    },
    getAttachments() {
      return this.attachments;
    },
  }
};