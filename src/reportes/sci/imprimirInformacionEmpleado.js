import Axios from 'axios'
import moment from 'moment'
import store from '../../store/index'

export default {
    items: [],

    activo: {},
    empleado: {},
    tarjeta: {},
    direccion: store.state.empleado.direccion,

    imprimirInformacionEmpleado(context, data, imagen, empleado, tipo) {
        let self = this

        tipo === 'D' ? self.printDescarga(context, data, imagen, empleado) : self.imprimirActivos(context, data, imagen, empleado)
    },

    printDescarga(context, activos, imagen, empleado) {
        let self = this
        var pdfMake = require('pdfmake/build/pdfmake.js')

        if (pdfMake.vfs == undefined) {
            var pdfFonts = require('pdfmake/build/vfs_fonts.js')
            pdfMake.vfs = pdfFonts.pdfMake.vfs;
        }

        var headers = {
            fila_0: {
                col_1: { text: 'FECHA DESCARGA', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'MOTIVO', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'CODIGO TARJETA', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'ACTIVO', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'NO INVENTARIO', style: 'tableHeader', alignment: 'center' },
                col_6: { text: 'VALOR ACTIVO', style: 'tableHeader', alignment: 'center' }
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
                row.push(header.col_6)
                body.push(row);
            }
        }

        for (var key in activos) {
            if (activos.hasOwnProperty(key)) {
                var data = activos[key]

                var activo = data.activo
                var descarga = data.descarga
                var tarjeta = data.tarjeta

                var row = new Array()
                row.push(descarga.fecha.toString())
                row.push(descarga.observaciones.toString())
                row.push(store.state.formatCode(tarjeta.codigo))
                row.push(activo.nombre.toString())
                row.push(activo.no_bien_fisico.toString())
                row.push(store.state.global.formatPrice(activo.valor))

                body.push(row);
            }
        }

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
                            text: '\nMINISTERIO DE ENERGIA Y MINAS\n' + self.direccion,
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
                'Informe del total de activos descargados \n nombres: ' +
                empleado.nombre1_empleado + ' ' + empleado.nombre2_empleado + '\n cui: ' +
                empleado.cui_empleado + '\n\n',

                {
                    style: 'tableStyle',
                    table: {
                        widths: [63, 150, 50, "*", '*', '*'],
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
                    bold: false
                },
                myStyle: {
                    alignment: 'justify'
                },
                tableStyle: {
                    fontSize: 9
                },
            }
        }

        pdfMake.createPdf(docDefinition).open()
    },

    imprimirActivos(context, activos, imagen, empleado) {
        let self = this

        var pdfMake = require('pdfmake/build/pdfmake.js')

        if (pdfMake.vfs == undefined) {
            var pdfFonts = require('pdfmake/build/vfs_fonts.js')
            pdfMake.vfs = pdfFonts.pdfMake.vfs;
        }

        var headers = {
            fila_0: {
                col_1: { text: 'FECHA ASIGNACION', style: 'tableHeader', alignment: 'center' },
                col_2: { text: 'CODIGO TARJETA', style: 'tableHeader', alignment: 'center' },
                col_3: { text: 'ACTIVO', style: 'tableHeader', alignment: 'center' },
                col_4: { text: 'NO INVENTARIO', style: 'tableHeader', alignment: 'center' },
                col_5: { text: 'VALOR ACTIVO', style: 'tableHeader', alignment: 'center' }
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

        for (var key in activos) {
            if (activos.hasOwnProperty(key)) {
                var data = activos[key]

                var activo = data.activo
                var tarjeta = data.tarjeta

                var row = new Array()
                row.push(data.fecha.toString())
                row.push(tarjeta.codigo.toString())
                row.push(activo.nombre.toString())
                row.push(activo.no_bien_fisico.toString())
                row.push(activo.valor.toString())

                body.push(row);
            }
        }

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
                            text: '\nMINISTERIO DE ENERGIA Y MINAS\n' + self.direccion,
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
                'Informe del total de activos cargados \n nombres: ' +
                empleado.nombre1_empleado + ' ' + empleado.nombre2_empleado + '\n cui: ' +
                empleado.cui_empleado + '\n\n',
                {
                    style: 'tableStyle',
                    table: {
                        widths: [63, 40, '*', 50, 50],
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
    },

    printActivos(context, data, imagen, emplead) {

    }
}