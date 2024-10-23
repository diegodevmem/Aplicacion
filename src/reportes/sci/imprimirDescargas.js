import Axios from 'axios'
import moment from 'moment'
import store from '../../store/index'

export default {
    items: [],

    activo: {},
    empleado: {},
    tarjeta: {},

    printDescarga(context, descargas, imagen, fechas) {
        let self = this
        var direccion = store.state.empleado.direccion
        var pdfMake = require('pdfmake/build/pdfmake.js')

        if (pdfMake.vfs == undefined) {
            var pdfFonts = require('pdfmake/build/vfs_fonts.js')
            pdfMake.vfs = pdfFonts.pdfMake.vfs;
        }

        var headers = {
            fila_0: {
                col_1: { text: 'Fecha', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'Tarjeta', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'Activo', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'Razon', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'Empleado', style: 'tableHeader', alignment: 'center' }
            }
        }

        var body = [] //cuerpo de la tabla que se llena con arrays

        for (var key in headers) {
            if (headers.hasOwnProperty(key)) {
                var header = headers[key]
                var row = new Array()
                row.push(header.col_1)
                row.push(header.col_2)
                row.push(header.col_3)
                row.push(header.col_4)
                row.push(header.col_5)
                body.push(row);
            }
        }

        for (var key in descargas) {
            if (descargas.hasOwnProperty(key)) {
                var data = descargas[key]

                var activo = data.activo_tarjeta.activo
                var empleado = data.activo_tarjeta.tarjeta.empleado
                var tarjeta = data.activo_tarjeta.tarjeta

                var row = new Array()
                row.push(moment(data.fecha).format('DD/MM/YYYY'))
                row.push(store.state.global.formatCode(tarjeta.codigo))
                row.push(activo.nombre.toString())
                row.push(data.observaciones.toString())
                row.push(empleado.nombre1_empleado.toString() + ' ' + empleado.apellido1_empleado)

                body.push(row);
            }
        }

        var desde = fechas.desde
        var hasta = fechas.hasta

        var docDefinition = {
            pageMargins: [20, 70, 20, 55],
            pageOrientation: 'portraint',
            pageSize: "A4",

            header: function() {
                return {
                    style: "header",
                    columns: [{
                            image: store.state.global.getLogo(),
                            height: 60,
                            alignment: 'center',
                            width: 150,
                            margin: [-10, 20, 0, 0]
                        },
                        {
                            text: '\nMINISTERIO DE ENERGIA Y MINAS\n' + direccion,
                            width: 400,
                            alignment: 'center',
                            margin: [-10, 20, 0, 0]
                        },
                        {
                            text: moment().format("DD/MM/YYYY"),
                            alignment: 'center',
                            bold: true,
                            width: 'auto',
                            margin: [-60, 20, 0, 0]
                        }
                    ]
                }
            },

            footer: function(currentPage, pageCount) {
                return { text: 'Pagina ' + currentPage.toString() + ' de ' + pageCount, alignment: 'center', margin: [0, 30, 0, 0] };
            },

            content: [
                '\n\n',
                (fechas.desde != '' && fechas.hasta !== '') ? 'Informe de descargas del ' + desde + ' al ' + hasta + '\n\n' : 'Informe del total de descargas\n\n',

                {
                    style: 'tableStyle',
                    table: {
                        widths: [63, 50, "*", "*", "*"],
                        // keepWithHeaderRows: 1,
                        body: body
                    },

                    layout: {
                        /*hLineColor: function (i, node) {
                            return (i === 0 || i===1 || i === node.table.body.length) ? 'black' : 'white';
                        }*/
                    }
                }
            ],

            styles: {
                header: {
                    fontSize: 12,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, -40]
                },
                myStyle: {
                    alignment: 'justify'
                },
                tableStyle: {
                    fontSize: 9
                },
                tableHeader: {
                    bold: true,
                    fontSize: 9,
                    color: 'black',
                    fillColor: '#a1dae7'
                }
            }
        }

        pdfMake.createPdf(docDefinition).open()
    }
}