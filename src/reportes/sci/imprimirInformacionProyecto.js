

import Axios from 'axios'
import moment from 'moment'
import store from '../../store/index'

export default {

    imprimirInstituciones(context,data,imagen,proyecto,tipo){
        let self = this
        
            if(tipo === 'TI'){
                self.printInstituciones(context,data,imagen,proyecto)
            }else if(tipo === 'I'){
                self.printBoletaInstitucion(context,data,imagen,proyecto)
            }else{
                self.printProyecto(context,data,imagen,proyecto)
            }

    },

    printInstituciones(context,instituciones,imagen,proyecto){
        let self = this

        var pdfMake = require('pdfmake/build/pdfmake.js')

        if (pdfMake.vfs == undefined){
        var pdfFonts = require('pdfmake/build/vfs_fonts.js')
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        }

        var headers = {
            fila_0:{
                col_1:{ text: 'INSTITUCION', style: 'tableHeader', alignment: 'center'},
                col_2:{ text: 'DEPARTAMENTO', style: 'tableHeader', alignment: 'center' },
                col_3:{ text: 'MUNICIPIO', style: 'tableHeader', alignment: 'center' },
                col_4:{ text: 'TOTAL ASIGNADO', style: 'tableHeader', alignment: 'center' },
            }
        }

        var body = [] //cuerpo de la tabla que se llena con arrays

        for (var key in headers){
            if (headers.hasOwnProperty(key)){
                var header = headers[key]
                var row = new Array()
                row.push( header.col_1 )
                row.push( header.col_2 )
                row.push( header.col_3 )
                row.push( header.col_4 )
                body.push(row);
            }
        }

        for (var key in instituciones) 
        {
            if (instituciones.hasOwnProperty(key))
            {
                var data = instituciones[key]

                var municipio = data.institucion.municipio
                var institucion = data.institucion
                var departamento = data.institucion.municipio.municipio_departamento

                var row = new Array()
                row.push( {text: institucion.nombre.toString()} )
                row.push( {text: departamento.nombre_departamento.toString() })
                row.push( {text: municipio.nombre_municipio.toString() })
                row.push( {text: data.total.toString(), alignment: 'right'} )
                

                body.push(row);
            }
        }

        var docDefinition = {
            pageMargins: [20,70,20,55],
            pageOrientation: 'portraint',
            pageSize: "A4",

            header: function() {
                return {
                    columns: [
                        {
                            image: store.state.global.getLogo(),
                            width: 100,
                            height: 50
                        },
                        {
                            text: '\nMINISTERIO DE ENERGIA Y MINAS\n'+'DIRECCIÓN GENERAL DE ENERGÍA',
                            width: 400,
                            alignment: 'left'
                        },
                        {
                            text: '\n'+moment().format("MMMM Do YYYY, h:mm:ss a")
                        }
                    ]
                }
            },

            footer: function(currentPage, pageCount) {
                return { text:'Pagina '+ currentPage.toString() + ' de ' + pageCount, alignment: 'center',margin:[0,30,0,0] };
            },

            content: [
                 'Lista de instituciones asignadas al proyecto '+proyecto.nombre+'\n\n',               
                {
                    style: 'tableStyle',
                    table: {
                        widths: [ '*', '*', "*",70],
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
                myStyle:
                {   
                    alignment: 'justify'
                },
                tableStyle: {
                    fontSize: 9
                },
            }
        }

        pdfMake.createPdf(docDefinition).open()
    },

    printBoletaInstitucion(context,institucion,imagen,proyecto){
        let self = this

        var municipio = institucion.institucion.municipio
        var departamento = institucion.institucion.municipio.municipio_departamento

        var pdfMake = require('pdfmake/build/pdfmake.js')

        if (pdfMake.vfs == undefined){
        var pdfFonts = require('pdfmake/build/vfs_fonts.js')
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        }

        var headers = {
            fila_0:{
                col_1:{ text: 'ACTIVO', style: 'tableHeader', alignment: 'center'},
                col_2:{ text: 'NO INVENTARIO', style: 'tableHeader', alignment: 'center' },
                col_3:{ text: 'VALOR', style: 'tableHeader', alignment: 'center' }
            }
        }

        var body = [] //cuerpo de la tabla que se llena con arrays

        for (var key in headers){
            if (headers.hasOwnProperty(key)){
                var header = headers[key]
                var row = new Array()
                row.push( header.col_1 )
                row.push( header.col_2 )
                row.push( header.col_3 )
                body.push(row);
            }
        }

        var activos = institucion.activos

        for (var key in activos) 
        {
            if (activos.hasOwnProperty(key))
            {
                var data = activos[key]

                var row = new Array()
                row.push( {text: data.descripcion.toString()+ ' '+data.descripcion} )
                row.push( {text: data.no_bien_fisico.toString() })
                row.push( {text: data.valor.toString(), alignment: 'right' })
            
                body.push(row);
            }
        }

        var docDefinition = {
            pageMargins: [20,70,20,55],
            pageOrientation: 'portraint',
            pageSize: "A4",

            header: function() {
                return {
                    columns: [
                        {
                            image: store.state.global.getLogo(),
                            width: 100,
                            height: 50
                        },
                        {
                            text: '\nMINISTERIO DE ENERGIA Y MINAS\n'+'DIRECCIÓN GENERAL DE ENERGÍA',
                            width: 400,
                            alignment: 'left'
                        },
                        {
                            text: '\n'+moment().format("MMMM Do YYYY, h:mm:ss a")
                        }
                    ]
                }
            },

            footer: function(currentPage, pageCount) {
                return { text:'Pagina '+ currentPage.toString() + ' de ' + pageCount, alignment: 'center',margin:[0,30,0,0] };
            },

            content: [
                 'Proyecto: '+proyecto.nombre+'\n'
                 +'Institucion: '+institucion.institucion.nombre+'\n'  
                 +'Direccion: '+institucion.institucion.direccion+','+departamento.nombre_departamento+', municipio de '+municipio.nombre_municipio+'\n\n' 
                 +'Total asignado: Q '+institucion.total+'\n\n',             
                {
                    style: 'tableStyle',
                    table: {
                        widths: [250, '*', "*"],
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
                myStyle:
                {   
                    alignment: 'justify'
                },
                tableStyle: {
                    fontSize: 9
                },
            }
        }

        pdfMake.createPdf(docDefinition).open()
    },

    printProyecto(context,instituciones,imagen,proyecto){
        let self = this

        var pdfMake = require('pdfmake/build/pdfmake.js')

        if (pdfMake.vfs == undefined){
        var pdfFonts = require('pdfmake/build/vfs_fonts.js')
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        }

        var headers = {
            fila_0:{
                col_1:{ text: 'INSTITUCION', style: 'tableHeader',rowSpan: 2, alignment: 'center',margin: [0, 8, 0, 0] },
                col_2:{ text: 'ACTIVOS', style: 'tableHeader',colSpan: 3, alignment: 'center' }
            },
            fila_1:{
                col_1:{ text: 'Header 1', style: 'tableHeader', alignment: 'center' },
                col_2:{ text: 'DESCRIPCION', style: 'tableHeader', alignment: 'center' },
                col_3:{ text: 'NO INVENTARIO', style: 'tableHeader', alignment: 'center'},
                col_4:{ text: 'VALOR Q', style: 'tableHeader', alignment: 'center'}
            }
        }

        var body = [] //cuerpo de la tabla que se llena con arrays

        for (var key in headers){
            if (headers.hasOwnProperty(key)){
                var header = headers[key]
                var row = new Array()
                row.push( header.col_1 );
                row.push( header.col_2 );
                row.push( header.col_3 );
                row.push( header.col_4 );
                body.push(row);
            }
        }

        for (var key in instituciones) 
        {
            if (instituciones.hasOwnProperty(key))
            {
                var data = instituciones[key]

                var municipio = data.institucion.municipio
                var institucion = data.institucion
                var departamento = data.institucion.municipio.municipio_departamento
                

                var activos = data.activos

                for(var key2 in activos){
                    if(activos.hasOwnProperty(key2)){
                        var data2 = activos[key2]
                        var row = new Array()
                        row.push( {text: 'nombre: '+institucion.nombre.toString() 
                                        +'\ndireccion: '+institucion.direccion+', municipio de'+municipio.nombre_municipio
                                        +'del departamento de'+departamento.nombre_departamento
                                        +'\ntotal: Q '+data.total, rowSpan: activos.length} )

                        row.push( {text: data2.nombre.toString()+ ' '+data2.descripcion })
                        row.push( {text: data2.no_bien_fisico.toString() })
                        row.push( {text: data2.valor.toString(), alignment: 'right'} )
                    }
                    body.push(row);
                }
                
            }
        }

        var docDefinition = {
            pageMargins: [20,70,20,55],
            pageOrientation: 'landscape',
            pageSize: "C4",

            header: function() {
                return {
                    columns: [
                        {
                            image: store.state.global.getLogo(),
                            width: 100,
                            height: 50
                        },
                        {
                            text: '\nMINISTERIO DE ENERGIA Y MINAS\n'+'DIRECCIÓN GENERAL DE ENERGÍA',
                            width: 500,
                            alignment: 'center'
                        },
                        {
                            text: '\n'+moment().format("MMMM Do YYYY, h:mm:ss a"),
                            alignment: 'right'
                        }
                    ]
                }
            },

            footer: function(currentPage, pageCount) {
                return { text:'Pagina '+ currentPage.toString() + ' de ' + pageCount, alignment: 'center',margin:[0,30,0,0] };
            },

            content: [
                 'Informe de distribuicion de activos a instituciones del proyecto '+proyecto.nombre+'\n\n',               
                {
                    style: 'tableStyle',
                    table: {
                        widths: [ 300, '*', 80,60],
                        headerRows: 2,
                        // keepWithHeaderRows: 1,
                        body: body
                    },

                    layout: {
                        /*hLineColor: function (i, node) {
                            return (i === 0 || i===1 || i === node.table.body.length) ? 'black' : 'white';
                        }*/
                    }
                },
                {
                    alignment: 'right',
                    columns: [
                        {
                            text: '\ntotal: Q '+proyecto.total
                        }
                    ]
                },
            ],

            styles: {
                header: {
                    fontSize: 12,
                    bold: false
                },
                myStyle:
                {   
                    alignment: 'justify'
                },
                tableStyle: {
                    fontSize: 9
                },
            }
        }

        pdfMake.createPdf(docDefinition).open()
    },

    toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
            callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }
  }