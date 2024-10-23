import moment from 'moment'
export default {

    //funcion para convertir decimales a horas, si no se envia los paramtros opciones devuelve hora completa
    decimalToHour(a, only_hour = false, only_minutes = false) {
        var hrs = parseInt(Number(a))
        var min = Math.round((Number(a) - hrs) * 60)
        hrs < 10 ? hrs = '0' + hrs : hrs
        min < 10 ? min = '0' + min : min
        return only_hour ? hrs : only_minutes ? min : hrs + ':' + min
    },

    getHoursByMinutes(mins) {
        var decimals = mins / 60
        return this.decimalToHour(decimals)
    },

    formatPrice(value, symbol = 'Q') {
        let val = (value / 1).toFixed(2).replace('.', '.')
        return symbol + ' ' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },

    //obtener mes por numero
    getMonthByNumber(number) {
        var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
    },

    timeStringToFloat(time) {
        var hoursMinutes = time.split(/[.:]/);
        var hours = parseInt(hoursMinutes[0], 10);
        var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        return hours + minutes / 60;
    },

    //funcion para rendondear decimales
    precise_round(num, dec) {
        if ((typeof num !== 'number') || (typeof dec !== 'number'))
            return false

        var num_sign = num >= 0 ? 1 : -1
        return (Math.round((num * Math.pow(10, dec)) + (num_sign * 0.0001)) / Math.pow(10, dec)).toFixed(dec)
    },

    returnMes(mes) {
        let self = this
        return moment().month(mes - 1).format('MMMM')
    },

    //formatear codigo para tarjeta de reponsabilidades
    formatCode(n, len = 4) {
        return (new Array(len + 1).join('0') + n).slice(-len)
    },

    //retornar color style
    colorHex(color){
        return {
            textWeight: 'bold',
            background: color,
            color: 'white',
            padding: '5px',
            borderRadius: '5px',            
          }
    },
    //obtener full name
    getFullName(data, tercer_nombre = false) {
        Object.keys(data).forEach(function(key) {
            if (data[key] === null) {
                data[key] = '';
            }
        })
        var pn = data.nombre1_empleado
        var sn = data.nombre2_empleado
        var tn = tercer_nombre ? data.nombre3_empleado : ''
        var pa = data.apellido1_empleado
        var sa = data.apellido2_empleado
        var name = pn + ' ' + sn + ' ' + tn + ' ' + pa + ' ' + sa
        return name.replace(/\s+/g, " ").replace(/^\s|\s$/g, "");
    },

    //funcion para convertir numeros a letras
    numeroALetras(num) {
        var data = {
            numero: num,
            enteros: Math.floor(num),
            centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
            letrasCentavos: "",
            letrasMonedaPlural: '', //"PESOS", 'Dólares', 'etcs'
            letrasMonedaSingular: '', //"PESO", 'Dólar', 'etc'

            letrasMonedaCentavoPlural: "CENTAVOS",
            letrasMonedaCentavoSingular: "CENTAVO"
        };

        if (data.centavos > 0) {
            data.letrasCentavos = "CON " + (function() {
                if (data.centavos == 1)
                    return this.Millones(data.centavos) + " " + data.letrasMonedaCentavoSingular
                else
                    return this.Millones(data.centavos) + " " + data.letrasMonedaCentavoPlural
            })();
        };

        if (data.enteros == 0)
            return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos
        if (data.enteros == 1)
            return this.Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos
        else
            return this.Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos
    },


    Unidades(num) {

        switch (num) {
            case 1:
                return "UN"
            case 2:
                return "DOS"
            case 3:
                return "TRES"
            case 4:
                return "CUATRO"
            case 5:
                return "CINCO"
            case 6:
                return "SEIS"
            case 7:
                return "SIETE"
            case 8:
                return "OCHO"
            case 9:
                return "NUEVE"
        }

        return "";
    },

    Decenas(num) {

        var decena = Math.floor(num / 10);
        var unidad = num - (decena * 10);

        switch (decena) {
            case 1:
                switch (unidad) {
                    case 0:
                        return "DIEZ"
                    case 1:
                        return "ONCE"
                    case 2:
                        return "DOCE"
                    case 3:
                        return "TRECE"
                    case 4:
                        return "CATORCE"
                    case 5:
                        return "QUINCE"
                    default:
                        return "DIECI" + this.Unidades(unidad);
                }
            case 2:
                switch (unidad) {
                    case 0:
                        return "VEINTE"
                    default:
                        return "VEINTE Y " + this.Unidades(unidad)
                }
            case 3:
                return this.DecenasY("TREINTA Y", unidad)
            case 4:
                return this.DecenasY("CUARENTA Y", unidad)
            case 5:
                return this.DecenasY("CINCUENTA Y", unidad)
            case 6:
                return this.DecenasY("SESENTA Y", unidad)
            case 7:
                return this.DecenasY("SETENTA Y", unidad)
            case 8:
                return this.DecenasY("OCHENTA Y", unidad)
            case 9:
                return this.DecenasY("NOVENTA Y", unidad)
            case 0:
                return this.Unidades(unidad)
        }
    },

    DecenasY(strSin, numUnidades) {
        if (numUnidades > 0)
            return strSin + " Y " + this.Unidades(numUnidades)

        return strSin;
    },

    Centenas(num) {
        var centenas = Math.floor(num / 100);
        var decenas = num - (centenas * 100);

        switch (centenas) {
            case 1:
                if (decenas > 0)
                    return "CIENTO " + this.Decenas(decenas)
                return "CIEN";
            case 2:
                return "DOSCIENTOS " + this.Decenas(decenas)
            case 3:
                return "TRESCIENTOS " + this.Decenas(decenas)
            case 4:
                return "CUATROCIENTOS " + this.Decenas(decenas)
            case 5:
                return "QUINIENTOS " + this.Decenas(decenas)
            case 6:
                return "SEISCIENTOS " + this.Decenas(decenas)
            case 7:
                return "SETECIENTOS " + this.Decenas(decenas)
            case 8:
                return "OCHOCIENTOS " + this.Decenas(decenas)
            case 9:
                return "NOVECIENTOS " + this.Decenas(decenas)
        }

        return this.Decenas(decenas);
    },

    Seccion(num, divisor, strSingular, strPlural) {
        var cientos = Math.floor(num / divisor)
        var resto = num - (cientos * divisor)

        var letras = "";

        if (cientos > 0)
            if (cientos > 1)
                letras = this.Centenas(cientos) + " " + strPlural
            else
                letras = strSingular

        if (resto > 0)
            letras += ""

        return letras;
    },

    Miles(num) {
        var divisor = 1000;
        var cientos = Math.floor(num / divisor)
        var resto = num - (cientos * divisor)

        var strMiles = this.Seccion(num, divisor, "UN MIL", "MIL")
        var strCentenas = this.Centenas(resto)

        if (strMiles == "")
            return strCentenas

        return strMiles + " " + strCentenas
    },

    Millones(num) {
        var divisor = 1000000;
        var cientos = Math.floor(num / divisor)
        var resto = num - (cientos * divisor)

        var strMillones = this.Seccion(num, divisor, "UN MILLON DE", "MILLONES DE");
        var strMiles = this.Miles(resto);

        if (strMillones == "")
            return strMiles;

        return strMillones + " " + strMiles;
    },

    getLogo() {
        return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCACNAPEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACikZtilvQZ4FMFyrLkK35Y/nQBJRUbXSqOcj+lRjU4zIV2twQvGDnPHY5H44o32C6LFFRJeK8zR/MGX1HWpWbaufSgAoqvJqMUSszHAQZPfA+gp32xNhboo7kildATUjNsUsegGTTFu43GQ2foc02adTC+5W27TnPcf59ad1ewEGqa3b6ZZtJcFljztbjOM+teI6H411r4g/E429tMtvLZzyywOqsYYF8tVKk4wy7Cp9Q7NxjmvS/iZfS2fg+6+y3JhaGOTO5VLSbQSQNxGWABI9dvWuC+AtpG939rVWZpLbdbK8xVXMgR5MIAR1ccsRgbeOuPz3iLEV8TmuFy+lNxjdSlbTZ3tf5Ja21ku6PYwMYRw1Ss1d7eh2MvxX0vw7p0kfiCT+yZ4c+bFIpZUAz8wI6hhyB1xWL8UfFLavotndaTazao0M6+bB9mlUSQvjLRsyYLDC4DFV65IFbXxi8AwePfB81rMvmRrKk427ckIeTuyOgzXkN38J9S0ybzk8R695OMrt1SRY4wOihVBxXyfH/EWPwdSWU4imqlGpBNSs1J+8731S0XK9Fq7q3fbL6NGdq0XaSe3Q9Q8G+Np9EggtrxWS2UtndkzW+OeR3XHftkVX8c+NW8X+H/ALRo4uo9Ntin2y4eNlydw2KmMlmBwSQMAEc9qwvhl8LWk1J5NU1PVtQdrb90bi8ll2SZx97jsFOCvTNdT4XvBq/gHUIppmiXTWeAyt+7yqqHDfdOPvYIwchfz24Xx+Y4rL44KvU/dzhPkbd53hZOMmu101o20mm0XiKdGnV9rFapq/bX8yj8B/iXJ4jt20+6kjjlWZmg2HfvXzH35PYB1dVPQgL3OK9Ur56+F01xofxXjsXvNsblLi7P2hd0ZYhMAgfMGlgSM5O4ktyQa99GpRs2PmzkrgjBJHBwO/4V91wXmFbFZcvrF+aLa1301/Db5NnBm1GFOv7mzsyxRULXaqPuv+WP50G9RY9zbgByeM4/KvrOZPY816bk1FV11NDt+ST5iQPlz3xU+7joaadwFooDZFQSajHF13dM5A464xnpnNMCeioUvo5HCj7xXfjI+769enanNchRnDFe5HQUroCSimJOJPujcvqCMfzp9MAooooAKRm2qTgtgZwO9LSOcI2fSgDyj9rb9sTwn+xx8N7PxJ4sh1a5s9R1BNLhh0+KOSdpnillUEO6DBWFhnPUjjuPlXX/APguz4XkDJ4f+H+uXisCFa/vorM57f6sS4/Ctj/gvN+8/ZL8LMpwP+EytOqA/wDLlfV+YPh6MAL9RX6hwjwrl2OwEcTi4tyu+rS0fkfn/E2fYzC13Sw8klZPZPf1P0Tj/wCC0upalAyr8ONN8tgQyTa1JNvHoT5I6/Q0y1/4KeeP/HfxC8J/2fDpPh+xa+Fvqdt5P20anFIY1U7m2NDIh3lSrFcvypxg/EuhDdHivSfhU+fGugf7GoW5P/f1a+qq8I5RCnKUaKvZ7tvp5tnwT4szZVIx9s7NrpFdV2R+uvg/xjfahDGt3IrSMfm2IMHkg/yNdTcyf6IzMAysCNpHB+tcF4LH71f+mfX8Wau6uf8AkHCvwVn74tThfixp2ueMNDtbPRfE1x4RvIbhZWvLawt75pUBGY9k6kKCBjK4I7V+evjX/gov8XtE1m+tI/FUf+jXEsQf+ybPMuxmCsf3XByucDIr9HtTIEy5IUZ5J6Cvxv8Aic4PjLWM4VY7u4Z3Y4RR5jnO7oeo4HNfonh/gcPinWhiKcZqKVrxT35r7ryR+ceIGMxGF9hOhUlDmcr2k1e3LZaNd2df4p/4KRfG3UNy/wDCeahDvBG23sbOLOfcQ5H4c14x47/ai+I3j/WoY9Y8feL9QgllVHSbVZhCMnBCgsI8+wxXafDn9ln4gftC3Rj8IeGdS1SH7pvTF5VkmeMmd9sZx6Bi3oK+lvhJ/wAEJtU1u5t7nx54ysbBRhzp+iWnnOCMcPcvtAPsqH/er7jGYzI8uTU+SMu0Yxb+5K54OUUM1xjUrzku7k7fi/yPvf4pQSP4Z2yQo9vGA8rxMd0DHgEDaQVPzKTkHDdK5L9nBrTSYbi0kbdfSBmiMx/eOqM4OQMhV54weR1xgV6frujXF5pMqqlrPIUw0czsI5BjBUlRkeoODz2rwvW5dY8D+LofK0+aJre7BVBhd+0FtnmDJMbsQuQCRzkCv4v4uqSyzN8NmvLzU17stHeN29U9I7N6N8zeiurJf0FlsVWwssNez3X4Hd/tA/FPUfhJ4Yg1iz02bVIWulsrmySNVRUYFmlZ8kqFC44DHJHHWvObr4kWepq0g2wmYI8sUqmXezHgZGApXrXZGxj+NnxAtZ9S0+4bQtFiWRDczAW81zhcBo8/OPmzyMH5PU4z9b+Ha/HK+eXSbWx0nRdP8yKK7W1Qz6hMcqRjaB5I6H+I4OK8viHBY7O6rxWFrL2b0pQcXeVkuaaf2Ytuyvo3t8SNsLOlhl7Oa13b7eXqZPhT4gwC7t47Q2ltqBk80ysHkWPHy5ZSRn5M8A8nj3r0b4WiPT/DWoaheskaSXDyzTLCY4yEQBjsJO0Z3/lXD3i2PiTw5deHr3w3FoviC1nS3uksYUiEsZz5cyPtOVbB5ByCrZxg4ju/E2reHfB//CO31jq32iykMgdCC9wjMRtODyjSMSWOPkyeoxXl5XWhk2L568+enCMrWi0lVnypQkns0o7PXo+h0Vqf1mFo6OTV79k913I/C0kLfENry2kjhUXEdtCzurwwPsJXcBywAkG3JDFihwCTt+ef+C5fjTV/h/4d+FN5oep6lotz9vvt1xY3j20iHy4WGGQ5zkkgdfSvrD4QymfXMtcWLXiMFuVaB45EYjJEQb5VXJ55YkHtgVzH7eH7Bdn+3B4S0mxu/EF5oN14fllubOWGJZonkkXafMjONwwB0I/Cv2LwolSwc6eMxTXJOTk0ldK6a/X7+r3Pl+LadSvRnQofEkkn6H5dfD79vn40eFI4xafEjxRJHuGPt032zd/3/Vs16t4Z/wCCmfxpwrTeLobnaQf3ukWnP/fMYrP+Lf8AwSR+LfwgMk2l2tj430eHLCXSW23S49beTac8dELE9smvH4dDvvDGrSabqdndabfRHElvdJ5UsZ90bDfpX9QYejkuPtKjCnU/7di391rn4LmlbNcDLlqTnC396SX33sfoX+xN8a/id+0klzqesePJrK38OalarJa22j2ZXUomy7xSM0ZdAwUruRgwzkEHmvsSx1iS5ZeF25Ga+If+CTzMfBfi/wDdyLm/tGyy4UDy5B977pPsCT7V9p6P0r8b4qjCnmdWjSioxjZJJJJXin0S6vqfqfCNSdTK6dWpJylK92229JNdW+iLHiC8e1i3KxXI4I6ivj3/AIKd/tjeNP2Zfhzo914Pn02x1DXr/wCxG6ns/tH2RPKMp2IWCli4HzHp6HpX154r/wCPUV+dn/BbmT/i1/gn31w/+kzVjw1h6WIzShSrRUotu6foejnVadLBVKlN2aWj+ZFpn/BdTxFcAf8AFudFfqGY6vIpk5H/AEyO3PJI5APrXYeFf+C2Et9s+3fDiOPLDP2XWdx/AGBcn8RX5w6B9xa7Lw8SNu07WyMH0r9k/wBS8mlFr2KXo5L8mfkeI4qzWD92q/mov80fqZ8Gf+Covg74seLtJ0OXw/4k0rUtWvYbK3D+TJEJJHCLubzAcZYZwp+lfUlfjx+y1iT9oj4e4G5/+El00lm/6+o6/YevzHjLJMLltanDCppSTbu79T7rgnPMVmVGrLFNNxaSsrdAooor40+2Cmzf6pvoadTZv9U30NAHwv8A8F3/APk0bwt/2ONp/wCkN9X5h+H/ALq/UV+nn/Bd/wD5NG8Lf9jjaf8ApDfV+Yfh/wC6v1FfuXAf/Ipj6v8AM/JeMP8Aen6I7XQOg+tejfCr/keNF/6/4P8A0Ytec6BkgYG454A716P8LUaPxnobHG038A3bhtB8xeM9M+wOa+rxTXspej/I/OZfxYeq/NH6yeCziaT/AID/AOhNXb3L/wDEtHDdK47wXps4uDujZd20gkdRuzn9a7p4SluuF3GPnHrX8xy3t/W5/T0dv67I5m60q5vZF8lVVv4S+QAe2cc/lXlXw1/4JwfDvwJqM2pahpsfirVZp2uPO1cCaKJmbcdsIAj47FlLe9e9i42ybdnQbjgjj9c0pvEDbf17D8a6aGNxFCMqdGbipWvbS9r2216s5sRgcPiJwnWgpOF7XV7Xt8uiKltoMVhDFDbxwxW0KbI4lQKsYHTaBwB7dKsGxB2cIqowbaBxmnfboyuRz1PBHbr37U43SiXZ378jj9c1x8qvfqda0VkOkG6Nh6ivO/ib8O9W1PVbG/0e/s7JbOLZKtxnagByWXg8nJznGeK7+O/WV9qhuPcemR37imXk8TKY2ZA0g2hWI5z7V5ucZRQzLCywuIvyvs7Wa2Zth8RKjNThufM/jfSb67u5IRNPJalWRrbTZTJd3ExyFKjhcf6sYz/DXoU3x/0zwd4dsbG6WSx1aONVkt7qB7do1yFDBSMtkn+AMT2B4Fd+PCGmTan9uSzs/tCfKGCqdvv/AJGaXWfC0OvxzR3SKftCqrsi7ZHjRw+wtjlT0IHUE/Wvgcn4KzHK41pUMR701ZaNpJNtbu6ettLpJvfQ9TEZjRrcqcNFueB6hfXPiHV5JNQ/tq0vY2lvLe4njks7YQ4ULHvxkIEJzkD5lboApG94d8F654g0Ob7DcaauoTRJHfJNfvMWRQQOAm0hgev3ueoPNetal4Q0rXvKe6srW5MK7YWBxIgGeh4Ixn9TVyysYdFtVaNJJFhYqm59zKucdSST+eaMH4cpVprF1OenK73d23u30bvsyq2br2ajShZ/eVfAGjX2l+FrG21CeG4u4FG+VU24IPQDHTtk810LrvRh6jHNQTlfMVm3cMOg/KiPUY5Av3hvAI6Hvjsa/S8NQhQpRo072irK7b283c8WpJyk5S6iG0d3JOwNjh+pPseOn41y3xU+A3hX416W1r4o0DS9Yj2FVaZMSxZ7pIPmU+hUgg85rrkufMTcqseccEcfrTVuwzbdjBu4JHHT39xXVRqTpS56T5X3Ts/wOetRp1Y8lSKa7NX/ADPGfgh+yDpX7N8+rr4duruax1iWKaS3updzQGNXACOoBYZYcNnIHWvUNMgaD73yn0Nask+D91uPcYHT396idlnnCyRsknUZIx29/f8AQ1eIxFSvUdWtLmk7Xb30SX5InDYalh6apUY8sVeyXm2/zZn+KRutlHrX50/8Ftzv+GHgX/pprjY/C2av0g13TJLu23KyjyxuOc9voK/N/wD4Lbr5fw08Axn/AFia64ZSNrDNu2ODyfXjPFe9wjrnGHt3f5Hn8Qf8i+t6L8z4O0I4VfrXZ+Hv4fqK4vQQ0hwqsSpy2RtwPxxXaeHv4fqK/oSOx+DYz4j2j9lL/k4r4f8A/Yyad/6VR1+xFfjv+yl/ycV8P/8AsZNO/wDSqOv2Ir8f8SP95o/4X+Z+h+Gf+74j/EvyCiiivzc/Tgps3+qb6GnU2WPzYmU9GBBoA+Ff+C8j+V+yJ4VJ7+Mbb8MWN+TmvzF8PKzKvyNjbvBI2q30J4r9nP8Agod+xlrP7aHwe8O+F9J1nT9Bm0nxHDq0tzcB5F8lLa5iOFUfO26ZTtJUEA/MK4H4If8ABF/4b/DDy7/xNd6l441ONQzreuLeyyOfljjGcezM341+pcNcUYDLsrjTrtuV37qWu/fZHwOfZBisbi26StGy1bPz1+Dfws8R/F3WxpvhnRdQ1u8BUSR2kXmCDJ6yN92Me7lR+Ffcn7NX/BLm/wBD1PTdc8dapHZtZzR3MWl6enmyB0YMBLNgDGRyqqeP4u9e/fFr48fD39i3wJaxXEFvpsePK0rRNNgjWa8k252xopA5/vfKD0+ZiqnL8KfED40fE/w6NYsPBfgnwnZXCmS20/X9SuLi+ZDyryeVHtTI/hBJFZ47ibNcbQ9phoxo0ZaKUmk5d0m2vm0rHhYfJ8mwmM+q15SxFeNm4Qi5KHZy5V7t+ilJN9Ez3S0mKTLH5e0J8q8j7uRj37VB8QPGun/DbwHrfiLVpGh0vQLCfUryRV3NHDDG0jkDuQqk4rwL4Zftla9YftEWXwx8deDF8P65qkckun32n3j3mn6ikcbykx71UrlY3wOTkYIHFe/eIU0/xFoeoabqFql3ZXkD2tzbzJujmjdSrIw5+VlODkdGr4HG5bXwU4xxK0klJNNNOLb1TTa6NevQ/QsnzzCZpRnVwcm+WTjJNOLjJJNxaaTVk0/Rp3Z57d/tC3OlPpOn32kWcOueIL2CysNOj1YSzJJLbz3O2cop8spDbTOxUOpCfIz5Gedm/bGt7W/8PxyaHe7tVur2xuEF2nmWk9rqNvp7pGuNsoaS5jkViQDFkj5sIestvgBodpA8hOpTXcUltPHey3zy3Fs9urLBskcc7I5HQs+4yK7+YW3MTV1X9nbwp4gezW4s75I7SK5hdFvJFW/S7u47m4EwyFbzpoo5HJAZsFc7S6tMK2BvrFtdenR+emtvPz1O2pTxXK+VmPb/ALUclxq2m2cGj2sQ1LUtT09JLm/8mN3s9QisgBhT+8lMoKo20EjDFaqWH7Yy6lo/iy8h8O30y+E9QFpOlpMLiZ1S+urWfauNxmjW0lnEJAYxPEfvPsHWx/AvRLfUo7m3a9hvLa4v50dL2TcDfXKXF0mQw+WR41wvGztTfD/wB8O+ENbvL6xs7i1uLy4a4uJFvZf9IU3s9/lu3y3N1cuBjjzSAcbQt+0wXJpB/wDAu/zViJLEJ6yVv+AY9z+1EosZ5LPRIdUTS9NvNauvsd+HUWUM0kMTQuyqHedYpmjB2oQhJkUc10HjD40y6dP4Rh0XT49cPjRHlsQ179lHlrbm4zu2NyyDCg4yxGSoywztO/Z48GW2kx6VY6bPpdmttfWQtrWYxLLa3U5mngJPPl+YchVxsDELgEit/wAafCvTPGEmlzzSXkEmhs7WRtbyW3+zs8L27Y8tgwxGzgbSDlsjBANc/tMPzKFn1X4aP7zTlr/C3rp/X3HJ/Cv9qm1+LPjTSbHS7CK303VNEs9filubjZcm1uoZXQeUFI3o0RDgvxuGNwDFdrUPjX9i07x9drpF5I/gGX7MipOGfU3NnBdhIwcKGZbiNBuP3/8AZ2szvDvwn0XwX4gtbzTILjTZI4LSyjtIbuRLcQW0cscUXlBipWOOSQgYwxx0KoRJN8FNJfXNS1J21RX1O+h1G5i/tGT7PdTxrbqjtGxxhRawDb0O1v7zbqlUwjnz0k+R28+qv+ooe35LXTld/wDAKfxG/aKsfBfwf0nxlbLY3Gm6o1kUnvL37PBBFdMoEryKjAIobJPYA1gp+1ZPeatcWv8AYH2WWHQ4tcksry8EN7HFJZyz+V5W0jfG0YWQgnaXXG7PHYWfwW0DTfBel6AltdTaTodxHcWcH2p3x5UnmRISxyY1OAEJ2kAAjHFZelfs2+HNE0wWVtca9DY3VhDpDwNq08ge2jtpbaJWZmLMVjlb5mJZn2uxd1VhdKWEUWpRd7u33q34E1PrHNo16ei3OZ0H9py4+IWm2P8AZumtYtc6dqOrJLFcpLHdJp89qJYkkCfdk+0CPdgFSsnAKAmPWP2zI9C1vx/YzaBIs3gnT9S1TMV+rJdJYQWs0qMCoMZcXabcA58t9+z5N/oWqfAPSNSuNGl/0yFtA0+bSLVkvHZms5vKE0EhYHerCCE5bLZjGGU5JwNb/Zw8JeK77WmurC5uv+EgF5FfxnUJ9rfbLZYLnZhvk3RRxoCu0oASpBLBqhXwXN78Haz0876fgTKnirWjLX/gafiN8e/tIQ+A/GE+ky6PdXFxb2WnTWzQz4S4n1C8NnbwncABmYcu2Nq89flrV1H4zN4T8R+FdI1zS/suqeKLm4tYfssrXEMRjieUEsyqwV1jCjcqkt8uMldzbj9nTw/qt7Ne3y32qXlxaQWbXEt9M8hWG5a6iZWLEo6XDM6kEFdsYHEaYmvPgho2upazahcapqk0U9vfiea9fzElhuPtMTx7SBGofAKqArIqoRsypzlUwlkkn93kv1uzXlr6v+t/8rGT8Rf2iG+G/jXWLG40iOTS/D+n2OpX94l8FlSC5uZ7fKwsu1hF9nLv84bYRsDt8taXwc+Mc3xT8Qa1C1ha250S9ubF9t4ZJU8m7nttzJsCgObcuuGJ2k52n5SvjD4OeGvGHim41TUo5Ly4vba0guLf7VIkN/HaTyXMCsikK4SSWQnghg+GGK1fAfw20/wZeXE9i15Gt5PPO0T3DuqvPctcysVZiMtK7HgfLkgcVFSphlT5VF82mtvJX+d7v0Y4xrc929DsJ0aSF1U7WZSAfQ14b+3J+xFpP7a/w5stF1LWNQ0G40W5N7p99bBZPIkKFGDxkfOhUnI3AnPUV7ox2rn0rl/ij8TbP4bfDjX9euo5Gh0WwnvHjJC7wkZbGc98AfiKeBrV6WIhPDNqd1a3foGOlQjh5yxPwJNy9Fq3+B+RHx2/4JjfE/8AZwlkuP7Jh8T6CCXTUNFV5CiDkmaAjzEbHJ2qyj+9XmWjWclsfnjddjhG+U4Vs/dJ6bv9nr7V+zH7Lvxmh/aG+B2g+KrdFt5NWiBuURvlS4Vtkg9Th1YjnoRkc4pnxj/Yw+Hvx2uPtXiHwzp82qbCg1O2za3gyP78YBYezEg+lfpWE4+xGGrSwua0vei3GTjumtNV/kfnOM4Po5hQjjcrq3jNKUU9mmrqz9O5+Zn7Jkqz/tBeAZRkKvibTk5Hf7VHx6V+xVfHWif8Eqj8Ofi/4Z8ReHfFkl5p+jazaahLZatHumSOKZJGWOZBycKQAyjP94da+xa8HjTOMLmFWlVwsrpJ3urNanrcD5Pi8up16eLjZuSa1umrBRRRXxJ90FFFFACO2xC390ZrM8W+JrLwn4Z1DUtQkMVjY20txcPx8kaIWY/kDWlIN0bD2ryD9te5uIv2RviIYF3TDw5PgHocxuCPyrqwNBV8TToS+3JL73Y4M1xbwuCrYqKu4RlK3eyufG37Ey3X7bf7cmrfEfxJC11aaDCs1rZyEtBa7pGFmgBzgJ+8c46yANkndu/RaSzYSqfLIVshsNyo9PQ5+or4P/4IjeX9m+IhjZhILjT1MbdUQrdMM/Qkj/gNfbnxAu9W0TwzcXGjaVa61qEOWtrKW6NrHP6gybXAY8gZXGepHUfaeI1R/wBuSwFKyp0YwhBbJLkjL5Xcm/Pqz8w8GYr/AFVhmle8qteVSpUla8pS9pKPq9IrRenrz/j34H6X43+IHg/xPdzNDqHgu4up7YRY2yLPbvE6MD1GWRh6GPH8Rrxv/gonJ4q+Gfw+tPih4X+IXiTw7ceB5EU6DCttcaVrAuJBbN9pV4jK20zB0CyqFaNT6g5Wu/8ABTuTw58V4/h/ffDXxBb+M5LiK0bTYr+1dEklKiLEnTDblIJwMEZxV7/goDrOva9/wTq8VXPiLRbfw7qUslkZLCG8W8EQ+3wFSXCqNxHXGQOcZrmy3JsfSzHAU8zinTnKCim4SUoSnfSN5XTbbv5mudcSZTicozWpklSXtqcKkpyipwcakKfKuZtJKSUUrXvptpc7n9ijVPFnxL+COkeNfFHiy81q58RWe8WRs7a3t7Fg7jKGKJZGzgfeY9Kzv2h9B8faR8U/BcXhv4jaroOm+MtYOl3Nsum2Fx/Z8SWU0+bdpLdm3H7OxPmFwDJ0wK2f+CfBx+xT4C/68W/9GSVsftAbf+FkfB/g/wDI0y9P+wRqFc1eUKee4mMYR5YuskuSLVoKXLo1bSy1tfzPSo0Z1uFsHOdSpzSjQbl7Sak3OUFL3lLms1J6XsuiN/xn4ij+F3w3vNW1TULq+t/DtjLd3U1wIkkuvJQuWbYFQbgvAVR1ryD/AIJyftFX3x0/Z6/tDXtQjuNY0W/uoL6fHOwkyxHH9zbJgHgny+ldZ+1NKviqDwh4EX7OzeLNfsxeRSSbWfTrQm8ucj+64gEJ9ROB34+af2FJ1/Z4/b2+JXw0lTydP1ySRtPj/hBjJmt15x1t5ZOmfuL9R1ZXldLFZFina9eNqsdvgg5Rl6Xu9u3kebn3EOIwPFWBjF2wz5qEr/8APypFShfu0ow1bv7zPTf2fvA/xI8YfDTXvGN5461zwtZ+JtRvdb0fRLewspWtYZZHli8554ZGwy4YxqR8hT5g2QOT/YH+IXxN/bC+G3ibUtc+J2tafcaXfrbW62ek6YI5FMO871Nsc5YnjPIr691y2U+EtQbyVXdZyOBnAUbTxjtjqB+FfH//AARHGfg54yx1/tiP/wBJhXoYXGLFZLj8dUpU1KEqXL7kLxTk01flu7pJO97nBisqlgOIspymNerKnOnWc17WolOUVFp2Uly6ybSVktkO08/EvwF8BPjF4k1Dx3qUHirwrr1yzXcen2zW+rRRWtp5O6OWJtqbMYWEooaU5B5rpv2PoPit+0r8BbLxhqHxf1bTbzVJZoxBb6Dprwx+U7J0aHJBK9M8j0r1D9uS1+z/ALIHxGZvLVG0iaUhRjBwvfv+PQfSvDf2Bf2mrH4Tfsf6TZ3HhP4gax9ge9ne40jw/LeWzr5zNxIMLwGGckAYPNbUZTx+SVMZhMPT9r7aMV+7g7RdO7SvF6XV/LZHm1sPQyviajluNxdX2H1ac3etVXNL2qSbtO/Motq61bV3dno/7Ng+KS/ET4keD/HfiptUXTbPT5tF1i3sIrU+XP8AalMioIxGzqYR8jqw3IcgqRnxfw1+2N8QPhj+37a/D/xR4sfxP4Qj1VNIae50m1t5WmkiQpl4lQZWWSMV9Lfsl/Ga5+Pvwet/G123kJq2o3wt0aIJ5NrHdSxwI3+2qbck8khhjvXyJ+3N8Kp9X+FXijx1ZNNb6h4b+JV7meNfnW3kjt4N+R1IubeMDPTea24dpYbE5ticDmdGEVNey0jG0ajtFSjZaNyXSy1J4srYvC5DhM0yXE1Zezbr+9Um+ejd1HCV5PmSjNK8ruyP0Y1LV4baxuGlaSGOOJneTIGwYPOfbFfB37Kv7UfxF/az/ac17Q4/F1z4b8MwwT6nYWsGlWcjiBLiNbeIyPGXKlH3bgQ3oR1r1/4i/HuT4sfsXeHbrTLpYda+KCWvh22deBDPdnyLluMkCICdsgEgp0A5ryX9mXSrXwV/wVm8eaTp1utvZ2ehva29ug+RFjSyAA/AcfU1x8O5XToZfmE8VTTqxpz5bpPl9m4qTSaerlJJO32Xqejxhn1fFZtlUMFVlGhKpT5uWTjz+1jOUU3FrRKF2tnzRPuS9uBp9hdS3MwWC3h3zSNwCFBLPxjHH8q+Z/8AgnP+1DdftJ6N42bUJJJri01+4uLZW+V4bC4ZmijwD0Qq4z2AH4eiftdarLD8IG0CGaaK/wDHV5B4bt/J/wBYVu5NkhX0KwCVs9AFyTivmH4VWUf7Jv8AwVX1Tw7CosfD3xAgJt49wESm5HnRhOnyrcQyxL/v8DmvPyHJ8Nisrxan/GcXOHpScXK3+JSaSXbyPW4u4gxWBz7AOm/9njNU6mu8qylGnf0cE3f+dH05+2DceJvB3wi1zxZ4d8UXmgz+GbOa8NvFaW1xb6gFCNiVZY2YHCsAUdfvc56Dkv8Agnx448a/tBfDi18e+KfFl1fSXFxc2f8AZMNja29moSZdr7li84sB28zbntiu3/bVuBcfskfEThl/4kl1972Vq4H/AIJHf8md6b/2E73/ANGilhaFL/VWtiOSPOq0YqXLHm5XFtq9r9tb3NcVWr/69UcL7WfsnQnPk558vNGaSfLe2z2tZ7tXPp24ZUt5C33QpJx6V83f8FBLbVvHnwpsfh3oBWLXPG15JEm9ju+zWkL3kmNoP3nihj9xN74r6QvZfJs5n/uoTz9K+SfFv7Tfgfwx+3fqt54t8R2Gi6b4H8PR6dYrdFiJbm6kWeaVSoPzCOONCDg/MBg848rhnD1pY36zh4OcqMXUsk5NtaR0W/vuPyv2Pe46xOGjlv1LFVFTjiJKk5NqK5ZJupq7L+Gp287LqcP/AMEWfia2p+C/Eng26kjaTSbqLVLNHO1jFL8sxA/2ZEX8ZPevvKvyp+APxa8OfBz/AIKX/bPC+r2t54S8Sau2mi4QFYZobzbJGoyBhY5doz0yh7cn9ThqKl0XZJmQ4HA/x7V9B4lYFUc2WNjFxjiIxqWas02kmnfrezfqfJ+C2ZSq5FLLaslKeEqTpNp3UkndSTWjTTaTXSKLFFFFfn5+vBRRRQAUUUUAI43IfpXPfEvwHb/EX4e65oN02211qwmspSOqq6MuR9M5romO0VXubhigSNW3yoxU44U47/5NaU6koSU4bp3XqZV6MKtOVKorxkmmu6ejR+aP/BMHxJdfs6ftZ+Ivh/4nj/s261eP+z5Vk4JvLZi0fPdXWWXYw4bcoHLAV+kU1+kdrIvzHzFby1/ibj0rxj9qL9hjQv2lbmz1b7VJ4d8WaWVNlrFopaVNpyokHBcKSWXkFW6Hlsw+BvDv7QngrQjpt/ffC3xc1v8AJb6jc3V7p88ij7nmxpDIrEd8NzX3HEWKw+f1I5lSqRp1pJKcJaaxSXNFvRppbXT+R+VcG5fjeFqc8lrU51MOpSlSqQXM+WT5uWcV70ZRbdmlyu/RnyF8Xn83/gsBYpHM0m3xFo8fzIMhRb2o2k4Gcj5vYH14r6p/4KgxtcfsPeMojGq7TZFBndnbewk44HpWZ8Hv+Ce99pXx7k+Kfj3xFaeIvFslwbqGzsrZrewsnIAG0n5pNigKpYDhRnFe/fEj4Z6b8WfAeqeG9ct1utL1m1a1uUBKsAwPKkcggnIPBBFdmd8R4T6/llSg+dYWFJSaVk3CSbUb2b0Xo+j6nncN8GZi8pzmliYqnLHzrSgm9YqcWo81r2d5a7tWeh5Z/wAE7tahv/2LPAaw75StnIjbRnayzyoyn3DAj8K1/jvqKah8TvhDbqj+Y3iS4fa237q6Rf574P3h+YBxkV578Hf2WPi9+zFplxoPg/xR4L8Q+E5Lpri2tNetrmC4sVZsuivFvDhuWO4feJ4xXdaR8CfHF54kbxRrniLwzceJ7OykstFjg0qb+zdGWUqZm8sy+ZM8nlxgsXTAUgDk14+ZewWaV8bSqxlTqOo473/eKSV42urXTk30+HmPfyn6/LJcNlVbDTjVpKkp/Dy/unBtxlzWlzcvuWvq1zKKu1xfiLwjZftNftearb3Goa5pumfDHRILWOXTL6Wzl+23jNO5Dxt8y+RFESvbcQRXz3+238KY/wBjL49/DT4geH77xBe2Zu0e9n1K6+3TboXGUE0rfeeCR4wpPReor6n+Bf7L3jb4Q+MtY1K88a6Hrdv4k1F9V1JDoc0Fw0zR42xS/aWCRhlTClW+Vcd6h/bB/Y51r9r3Q7HRLzxVp+g6HYzxXoSDSGuLx51V1Yec0ygRkN02E8da9jJ88o4HNaVGWITwihyS92TTTj7/ALvLdtzbkvU+f4g4YxmY5HXxFPCOOPdX2kLuF01O8Pe9o48saaUH7yd1sesa14pg1DwBdXkW5rW6s5HWQL8rAxkq2f4QevzY6468V8jf8ESX8n4P+MtysMaxEQBzkG2XB47f4V7R4K/Zv+I/gj4IWvg63+ImiTTaci2lnqlx4baSeO1VJFVWX7QFd1BiVWPRY+dxORjfsp/sO+Iv2ULy4t9N8c6bq2h6lcrcX9pceH2illZUIBSVbg7TnH8JA9+/BhcRgcPlGOwCrpyqSg4aT1UJNvXlsm01a/U9jGYXNsXxDleazwklGlCoqnvU/dlUSVlao3JJrVq+mqu3ZdT+3FqkNz+x38Qmwdv9jzIeQ3IC8ZU9+nXjviuN/wCCYMjWf7GHh3/V7obm+CgSNJlRdSg8H6Doa9C/aZ+Bfij49+B7zw3p3ijS/Duk6pavb34k0ZryefdtGEczIEUgEEbWJrkfgX+yZ8QP2evhePCOifELwze6XA8klsb7wpN5sRdtzfNHeoOpPY/Q1yYfEYWXD08vdZRqSqqdmp7KLjrJRt22bN8XgcwjxdTzWGGnKjGhKm5KVLWTmp6RlUT7q7S1O0+GVv4Z+FXiN/Aem3lxNqN4b/xItnIu7yLae7LtggbVjEkuxRyxxx61x3gD4Xn4u/s6/ETQbxSy+K/EHiOOKT5T5J/tG4jifk9VeMOO+VFV/hd+yR4++H/jjxt4uuviBpOseLPFUNraW11daLI1tpsEUm5oxCs6gqVwqqhjAPzHeRg9F+zX+zp4w+AttJpV94y0rxFoEk9xfbBorWd0LmeYTO28TMm0MZCAULfN1rOtOjRhUrYfE81W9Od2pJykk5SavHS0mkr6tp9DfBUcbiZ0aGMwLp0eWrT5U6dowk4xgpWqNtuEW5cqaSkkndM+UP8AglQmuePvHOn6FrMZXR/hR9u1CFW5P2u82wqjjsU2XZGOjP8AjXSfCa5a2/4LL+Nise1p7CUBWYDk2tu3OM4zt7Zr6u8Ffs+WnwuXxvceG5ILLUvGmozarJNcQedFDO6AKDGNpeNX3PsDLnzGGRnNeM6V/wAE+PGGl/HeX4nL8TNPPjK6V0uM+Gj9gmV4/LZfKFyGHy4Gd2a+slxNgcXjMdXlNUoVaDpwTUm+eTjJt2T0c7tvzPh6PBGa5bgMswkKbrzoYiNWpJOC9yCcIpc04ttU+VJWtozc+N/hhf2g/wBqjw34QuLzUrbSfB+jz+JL25068+zTfabhxb20Sup3owjFy3GMqc7s18/f8FG/2el+Bdp4N+IWg3uvanqGk6pHDPLquqXGpujxuJrUh3LeWqyI/GeTIoxycfSnws/Zc8efD/40a14yvPHmg6tceKJrY6rbv4dlRVigRkjS2P2o+VgEDkMDjJByRWx+1l+zPrn7TfguTw3b+JtN8O6PeFGuy2jve3Tsjo6lJPOQKPlxjaT715eTZ5DLszwsIV19XhFKdlOzvd1E0o3b5pS5dLO0VdHscQcLYjOMlx062EaxlSbdO7p3XK4qk1JTslywjzapq70djM/aO8dWnxR/YK8Ua/YxzG113wpJqEGQu5xJCrr90kD72OvXPpmua/4JNTCy/Y/09WD/AC6nejOwjP70euKh0X9hTx1oXwJm+G8PxO02TwvdRy2rPL4aLX1vayHcYI5PtG3ZksBlDgP/ALIFafwQ/Y3+IH7O3w7uPDXhj4paf9gmmeaI6h4Ya4ks2bvGy3KDg4OGUg96idTL4ZPXyujiY+9WU4+7O3Kk0m/d0dnsbYWjndXiHC53isFNKOGdOaUqN/aOSk7fvNVo9fNdj2fUvjb4atp/Etq+pIJPCtml5qpCkpZRvHJIpZhxnZGzFQcgFTgbhnw/9hDQLPxV8FLvxvrVrby3nxC1288Ry/asTrCry+VHGpOcLsQELnq5Haue8P8A/BOzx3ofhPxlo/8Awte1lX4gXTTa5fyaAz391GQwMQk+0BQr723YUYBKjgjb61+zZ8CvGfwR8MWvh/WPFmi+ItD0u1FtYiHRmsrpADn5pBKykD/dz71wYyjl+Fy6tSweJVScpQ+zNNxjF81rwS96ctnryxTb1PUwNbN8wzfD4jM8DKnThCpa8qclGUprlulOTuqcbNpW5pNLQ+T/APgsN8MG8NeIfAvjbRYY7OLEukzvCDGsbKWmhcKoAyAZeevA4Pb7U/Z0+KVt8Z/g/wCFvFELhm1rT4Z2B6xybcSp3+ZX3KcZwR1rzr9rD9jzxJ+1RYro9143sdG8Mw3kN7FbQ6K0l0JI0dcmczjghzxtFL+yL+yZ4m/ZZC6K/jqPxB4V3vPFYTaSYJbWUsGzFIszbVY7iykYJNd2ZY/BYzhvD4arXX1ii5WXLPWErO3Ny2uraK9vM8vJcnzPLOMcZjaGFksHiVFN81PScVbmUedS5Xd625rvVH0NRRRXwJ+wBRRRQAUUUUAI+7Ydv3scZrM8XLrCeH7ptCTT5NUCloI76V4rd2xwrsisyqTwSFJA5wa1KKa0dwPJRqPxwB/5F34U/wDhRah/8hU46p8cCP8AkXfhX/4Ul/8A/INesUV1fWo/8+4/c/8AM5/YP+d/f/wDyX+0Pjh/0Lvwp/8ACi1D/wCQqP7Q+OH/AELvwp/8KLUP/kKvWqKPrUf+fcfuf+Y/Yv8Anf3/APAPJDqPxwUZ/wCEd+FP/hRah/8AIVRJrfxwdj/xTfwrVeNrHxHfjd9P9Dz+devSgGJtwyuDketeO/tIfGDWPhd4h8K/2ethNp80819r3nJ8yWEMkEcjoezIJw3PGEY5zgE+tR/59x+5/wCYexf87+//AIBMdY+OC/8AMufCrb6jxFfn/wBss800a38cGRWXw38LGycYHiHUBgevNl0qP4ofGnVvD3x78G+GdHW2XTbiaKLWQ6bmRZxP5CqwPDZtpSfQAEZzXK+L/j540tfB63mk2unapq8Pjq+0JLTyShvLO3huZvIU54ldYAiseNzDOBk0fWo/8+4/c/8AMPYv+d/f/wAA62LXvjdMuV8N/CvBbC58Q6gN3qR/oXb+lKNc+NzHjw78KjztP/FQ6gMH3zZVatPjY/i7xp4LbRby3k8O+LPD9/qaSlAzLLE9rszn7u0SuCDzuGCODjgrH4769rngv4YJd69pHg9vFmhfbp9dm0wNE93iPFvEsjhUZtzE7idw+6QaPrUf+fcfuf8AmHsX/O/v/wCAdodb+Nwdl/4R34U/L3/4SLUOf/JLtStrPxwVmX/hHPhUxXk48RX/AP8AIVUPjdrnjTwL4MtdU03xZpqrNLYWUkY0lZA7XNykD3Aff6PuC9CR1A5qD4peMfEnw/8AE/hHQ9Q8e6Hpra0l/czateaZHEpEP2cIgRpAuf3rck+lH1qP/PuP3P8AzD2L/nf3/wDANObxB8bYEZm8O/CragJbHiLUDjr/ANOXsfypZNc+N8XXw38K/mOB/wAVDqHJ/wDAL+f4ZrJ1bx54g/t7wHo9n460O5bXbXUbm81yGwiaO7Ns0JjREEhReJXBwxztNU/Cvxy8SXy+FbOS50u4+1eL7vwxNew2ZW11i2htbmVZoMuQrF4gjAMwJR/mUYNH1qP/AD7j9z/zD2L/AJ39/wDwDoE8SfGqSISLoPwoKt0P/CQ6gM84yP8AQug9acuvfG1pfLHh74VbskYPiHUB06nmy6Vl+GPEPjb45aLeeING8QaJoGi3VxNbaJaS6cLtL+CJ2jWW4dmVgHdSVVRlVYEg8iut+GXxRuPiJ8F/+Eg8lLLUI4ruG9ti/wAtveW0kkM65P8AD5seMHGFNH1qP/PuP3P/ADD2L/nf3/8AAMWTX/jdH/zLnwsZicAL4g1A5PPGfsWOMc9hS/218cA+3/hG/hZ9f+Eh1DB5x/z5VzmleLviFpPwMsPiAuu6P4j2aXFrOpaXNpQtSIWi82ZIZEkOJFUtgEEMcVPqfx1uvEXxZ1extfHfh3wrocOl6fe2JvrSN5Lz7SkzZy8ikbdkeOD1HBo+tR/59x+5/wCYexf87+//AIBvLrHxvaQr/wAI78KQ3XB8RahyPX/jyqT+0Pjh/wBC78Kf/Ci1D/5Cr0rTJTBYWu64S53Iu6dECpOTgBhg4568HvWhR9aj/wA+4/c/8w9i/wCd/f8A8A8l/tD44f8AQu/Cn/wotQ/+QqP7Q+OH/Qu/Cn/wotQ/+Qq9aoo+tR/59x+5/wCYexf87+//AIB5KL/43scN4e+FIU9f+Kh1A8fT7FWt8OX+J/8AwkEK+KNL8BWul7GM0ulard3FyX/hwslui7fXLV6JRUyxEWmlCK9F/wAEcaLTvzP+vkFFFFcxsFFFFABRRRQAUUUUAFFFFABTZH8qNmwzbRnAHJp1I5wjfLu46etAEEuoRoGDLKAAckIW74xxk5/xrzn4lfDOX4hfFHSZryGI+Hl8P6rpd4Q4BdrtrbjBxkeXDJkjOCR74xfFPxJ8VXHxk8ReHNI1nwXoVjpWn2d4s2p6ZLO9085uN+CtzGCFWJex59aL/wCPV54L/aJHhzWI9Pj8Ozw2Fst/FE8LQ6hcCYRB9zkeVJ5DovQ7yowwJagDn/Cn7P3irw/8PfD8+otbX3iyHxRpeoarOs+4G0tBHa8MQM/6OpkI4+Z365rS0L4N69pN/pcs0Nusdr8Rb7xFIwnXAs5be6jR/qWlXjr19st8YfHPxBp2k6hDZ/2PZSJ4ztfDEM95byTJ9nmityJ3USr8+6U9+g7GtTxd428X+DPh/Hdf2x4L1rWr/XrDSrW5tdLlSzgjnnji+eM3Ujs6FiwCyLk7eBmgCloX7PupeF/2khrGltCvg+4tNSuEgZvn03ULswebsjbAaKTyvMG0kBzKMAMDUHhDwz4r8E/A3wj4PfwbpfiaPTNDgtr+J9SjVIZ0RkCsjqdyj5WDKQ2ewp83x61L4aXPizT/ABVHpfiJvDtpZ3VnNo9o9ut9NdzPBHaNFI8pjl8wRjhiAk2446V1ng7T/iINVsZda1Twbb27MXutOs9LuDJahlIVY7hpwrHd1JiAPNAHJxfBPWrP9mbQfBqyx32u6fqFjczP9oKx26R3sc7RK7D5lih/dqGwzKgJUE1tfGbw3rt98T/BeuaX4ZtfEdvpdtqFtd2813DB9nab7MyNl8g/6ps7eQcVjeCviQvh/wCE3j7xvPaWw1LTdW1S2JVpZPtZtZ3t7eIBpPl3ssahEwpLfdB5rr/gJ8QNY8eeErhfEkWm2vijRb+XT9VtrLzBDC6kMhTfyMxyRtz1DdqAOWuvhhd/Ezx54Hv/ABB4P0uz0jQLTU0u9LuJYLtbZ5Wg8pwMchvKfkZHXPGM5fh34KeIPD914XsfJjbw/wCGfGt1fWHm3YJi0iWyuPL2hzv3JJcmDYxJCruwOK1vEv7QeqeCI/FulXtna3HjDTLm3XQbOJXjj1qG7cx2mAWLZWUOsu3O0RFuhzXRfFzx5r3w4+DV3q0f9l3uu2iW9r80LraPdvJHEvy7i3l75eBnIIByelAHN+A9D8dfAjRbnwnpPhux8QaPbzzvoeovqawR20MkjMsNyjLvJQs3zRhyy7Rwa6r4Z/DKT4cfCBvD7XEeoahcC7ubu4JG28u7l5JZeT2MknGcEgcgVxvxE/aZvdE/Zq0zxdotvZ3niLVoCttZ3KuYluoY5JLrcA2VWJbefgc5TGRnNXfGvx71bQb3WJLeHTDa6b4Bm8UQvJG7ObhNxUEhx+7+U5A5PHNAGJpPgz4ga98EbH4fzeHbfwvY/wBhQaPqOqTaxHcSrCsYjnMMUYYMzruCszJtznrwLd78PNb8EfFjWtQsPAuneKNGuNM020svPv7eIWn2YSIc+YpIG11PGeV/Grth+0Dqk/waXUZbXT9P8UaTrFjo+sWRRjHbvPdRRmSMA7ikkUqSRk9QwyAQVFj4/wDx21L4SeItLTT7WzvbS3gOs680iv5lnp4uIbdpEAJ+b96zgEY2wSHqoVgD07Sbx2063nlhezMkCSvChWTysjOzI4OOR8oxx1rSF2hkZc/MrbcDnnGa8n+L3xK1bwz4+8OeG9L1Hw/4fXxBHdXKavq1u1xa74niC20aCeMGVzMcfOvCtgZAB9C8OfbrbRrO31W80+91RcebLFA0EchB5ZEd3YDrjLHP0oA2qKKKACiiigAooooAKKKKACiiigAooooAKKKKACmzbjC23hsHB96dTZF3xsoYqWGMjqKAPBfiH4NZP2gNb1bUvhnJ4/07UtOsYLOZLaxmW0kh+0b8/aJFIz5q4xnoenGdBfg0PiR4x8ajWNGuLHw74s8N6VaRhhGjQPEbpzgRniWLzYwD0Uxggnv7FeRqkKqwMiyMI2BOM54zUMb+VbSSlRuVVchflBz2xQB802fwm8bL8JbiDxN4bl8S6pH49tdSvLePyX/tm0gggiefa7BP3vlFijEDLkdK6bxB8L4fiD8OYNB034Z/8Inpf/CS6Zc3mm3FrYxwX1slzG0z7IZGDARqcg4J54Ne4TXRtp7eMKuJVYtj0UZ/yakK+ffyx9ERQSMdT657UAeCa3+znfW2oeLdC0O1i0nw/qQ0/wAR6GxQfY9P1aCT5kZc8K4it+ACF+cjtlPFWl+IviX4z8H3T/DjVtK1rR9VtbrUNQe7tvscdvDJveKJ1lDspJLKGiBY4BI617s15m3Vgo3SFRknIG446VPJh3kTHzApub+//wDqoA+e9M+CviTV/Dlv4WvrK/03S9U8b6lrmpXcUyI0NtHcyXNqUbJ+d5vII4xhWJ6AHrfh38KtS+GXxw1g28mran4f8Uaetxc3t/cC4e3v4HEZzwvEsLqoIyf3PQV6lLGqxszKHQjIQ9AFwAP6/WlS5LRmTncshXGeMBiBx+P6CgDgvG/gy61f49+AdaSxa4s9CtNSimuSqlreSZbdEyc5DEeaOAeCemTi58efC994s8AWul2NvNdSS6zphuxHjd5Ed5DLKxyRwFQ8jmuvhuFuZrdmX/WAHAY4GVYnjvRdSLYjaVaRoVZkbdgjjpQB4dD8A9YPjjxn9os1k8PrBqU/h+NZFJkutSiX7RheihGSYLnGRct6mqN98J/FN34PuFk0uWS8l+E39gsm5cyagytmAZP3uTnPHIr6Auh5KswWP94drYXBPzKv8qdG7OCW8tpBM21tvTkL0+hxQB4f8c/gZrWqS+Gdc8P2nmXVw+mWHiGy83a09tb3UVzFNnp5kMiEZz9yRhk7VBvP8C7v4peN/HmreJJNe0qPWj/YVpbW96ka3GlQx4G8YP35ZrlsZ5VxkgjA9obo/C/KM4K8e/502C33IVypjXKBWG7GOOtAHh2kQa5bfBbQvD3i74can4saK1eyvDHLZyK09uzQRzMskqkGVArh1Oct0HWu5/Z88H614G+FPh/SNckaTULISMwE5m+yRl5GjgMjDL+XGyRD2TOc12EUqtcSL5atuYouRkLtKr+PrU1jJ58zJtRVi6KBxn1oAuUUUUAFFFFABRRRQAUUUUAf/9k='
    }
}