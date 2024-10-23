import Axios from 'axios'
import moment from 'moment'
import store from '../../store/index'

export default {
    print(reportes = []) {
        let self = this
        var pdfMake = require('pdfmake/build/pdfmake.js')
        var direccion = store.state.empleado.direccion

        if (pdfMake.vfs == undefined) {
            var pdfFonts = require('pdfmake/build/vfs_fonts.js')
            pdfMake.vfs = pdfFonts.pdfMake.vfs;
        }


        var content = []
        reportes.forEach(function(rep, index) {
            var page_break = index + 1 < reportes.length ? 'after' : ''

            content.push({
                    style: 'header',
                    margin: [-20, -80, 0, 0],
                    columns: [{
                            image: store.state.global.getLogo(),
                            height: 60,
                            alignment: 'center',
                            width: 200,
                            margin: [-20, 20, 0, 0]
                        },
                        {
                            text: '\nMINISTERIO DE ENERGIA Y MINAS\n' + direccion + '\nREPORTE DE LIBRO NO ' + rep.libro,
                            width: '*',
                            alignment: 'center'
                        },
                        {
                            text: 'NO FOLIOS: ' + rep.no_folios,
                            alignment: 'justify',
                            margin: [0, 0, -20, 0],
                            bold: true,
                            width: 'auto'
                        }
                    ]
                },

                '\n ACTIVOS DE ' + rep.categoria.toUpperCase() + '\n\n', {
                    style: 'tableExample',
                    table: { text: 'hola', widths: rep.content.widths, body: rep.content.body },
                    pageBreak: page_break
                }
            )
        })


        var docDefinition = {
            pageMargins: [40, 100, 40, 55],
            pageOrientation: 'landscape',
            pageSize: "C4",

            footer: function(currentPage, pageCount) {
                return { text: 'Pagina ' + currentPage.toString() + ' de ' + pageCount, alignment: 'center', margin: [0, 30, 0, 0] };
            },

            content: content,

            styles: {
                header: {
                    fontSize: 12,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, -40]
                },

                tableExample: {
                    margin: [-20, 0, -20, 0],
                    fontSize: 10,
                    alignment: 'center'
                },
                tableResume: {
                    fontSize: 9,
                    bold: true,
                    fillColor: '#a1dae7'
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

        //pdfMake.createPdf(docDefinition).download('marcajes_' + name)
    }
}