import Axios from 'axios'
import moment from 'moment'
import store from '../../store'

export default {
    user: {
        authenticated: false,
        permited: false,
        sidebar: false,
        username: ''
    },

    items: [],

    //traer y verificar si el usuario tiene acceso a este sistema
    getData(context, tarjeta) {
        let self = this
        context.$store.state.services.tarjetaService
            .getActivosByTarjeta(tarjeta.id)
            .then(r => {
                self.loading = false
                self.items = r.data.data

                self.printTarget(tarjeta, self.items)

            })
            .catch(r => {});
    },

    formatCodigo(cod) {
        let self = this
        if (cod < 10) {
            return '000' + cod
        } else if (cod < 100) {
            return '00' + cod
        } else {
            return '0' + cod
        }
        return cod
    },


    printTarget(tarjeta, data_tarjeta) {
        let self = this

        var pdfMake = require('pdfmake/build/pdfmake.js')

        if (pdfMake.vfs == undefined) {
            var pdfFonts = require('pdfmake/build/vfs_fonts.js')
            pdfMake.vfs = pdfFonts.pdfMake.vfs;
        }

        var headers = {
            fila_0: {
                col_1: { text: 'FECHA', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'NO BIEN SICOÍN', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'DESCRIPCION', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'No. DE INVENTARIO', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'VALOR Q.', style: 'tableHeader', alignment: 'center' },
                col_6: { text: 'FIRMA', style: 'tableHeader', alignment: 'center' },
                col_7: { text: 'OBSERVACIONES', style: 'tableHeader', alignment: 'center' }
            }
        }

        var body = [];
        for (var key in headers) {
            if (headers.hasOwnProperty(key)) {
                var header = headers[key];
                var row = new Array();
                row.push(header.col_1);
                row.push(header.col_2);
                row.push(header.col_3);
                row.push(header.col_4);
                row.push(header.col_5);
                row.push(header.col_6);
                row.push(header.col_7);
                body.push(row);
            }
        }

        for (var key in data_tarjeta) {
            var firma = ''
            if (data_tarjeta.hasOwnProperty(key)) {
                var data = data_tarjeta[key];
                var row = new Array();
                row.push({ text: moment(data.pivot.fecha).format('DD/MM/YYYY'), alignment: 'center' });
                row.push({ text: data.no_bien_sicoin, alignment: 'center' });
                row.push({ text: data.nombre + ' ' + data.descripcion, alignment: 'center' });
                row.push({ text: data.no_bien_fisico, alignment: 'center' });
                row.push({ text: store.state.global.formatPrice(data.valor), alignment: 'right' });
                row.push({ text: firma });
                if (data.pivot.cargado) {
                    row.push('');
                } else {
                    row.push('Descargado ' + data.descarga)
                }
                body.push(row);
            }
        }

        var tipo = ""
        var empleado = store.state.empleado

        if (tarjeta.tipo === 'I') {
            tipo = 'TARJETAS PARA EL CONTROL DE INVENTARIO DE MOBILIARIO Y EQUIPO'
        } else {
            tipo = 'TARJETAS PARA EL CONTROL DE BIENES FUNGIBLES'
        }
        var puesto = tarjeta.puesto !== null ? tarjeta.puesto.nombre_funcional : ''


        var docDefinition = {
            pageMargins: [40, 155, 40, 55],
            pageOrientation: 'landscape',
            pageSize: "C4",
            content: [{
                    stack: [
                        'MINISTERIO DE ENERGÍA Y MINAS \n' + empleado.direccion + '\n',
                        tipo + '\n\n',
                        'NOMBRE: ' + store.state.global.getFullName(tarjeta.empleado) + '                       CARGO: ' + puesto + '                                              No. ' + self.formatCodigo(tarjeta.codigo) + '\n\n',
                        'DEPARTAMENTO: ' + tarjeta.unidad
                    ],
                    style: 'header'
                },

                {
                    style: 'tableExample',
                    table: {
                        widths: [63, 90, '*', 75, 60, 63, 100],
                        // keepWithHeaderRows: 1,
                        body: body
                    },

                    layout: {
                        hLineColor: function(i, node) {
                            return (i === 0 || i === 1 || i === node.table.body.length) ? 'black' : 'white';
                        }
                    }
                }
            ],

            styles: {
                header: {
                    fontSize: 12,
                    bold: false,
                    alignment: 'center',
                    margin: [0, -120, 0, 80]
                },
                subheader: {
                    fontSize: 11,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableExample: {
                    margin: [-20, -50, -20, 0],
                    fontSize: 8
                },
                tableHeader: {
                    bold: true,
                    fontSize: 9,
                    color: 'black',
                    margin: [0, 0, 0, 0]
                }
            }


        }

        //pdfMake.createPdf(docDefinition).open()

        pdfMake.createPdf(docDefinition).download('tarjeta_' + tarjeta.codigo + '_' + moment().format())
    }
}