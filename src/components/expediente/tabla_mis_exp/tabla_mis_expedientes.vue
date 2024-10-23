<template>
  <div>
    <!-- 1. ACTIVOS -->
    <!-- 2. CERRADOS -->
    <!-- 3. CONGELADOS -->
    <!-- 4. REASIGNACIONES -->
    <!-- 5. AGREGAR DOCUMENTOS -->
    <!-- 6. CREAR CEDULA NOTIFICACION -->
    <div class="col-sm-12 col-md-12 col-lg-12">
      <div class="box box-primary" id="p0">
        <div class="box-header with-border">
          <h1 class="box-title">
            <i class="fa fa-list"></i> Información ingresada en el sistema.
          </h1>
          <div class="box-tools" style="width: 50%">
            <form>
              <input
                type="text"
                style="border-radius: 10px"
                name="table_search"
                class="form-control"
                placeholder="Buscar expediente"
                v-model="search"
                @input="search = $event.target.value.toUpperCase()"
                onkeydown="return (event.keyCode!=13);"
              />
            </form>
          </div>
        </div>
        <div class="panel-body table-responsive">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 pull-left">
              <label> 

                 Items por página:
              </label>
              <b-form-select

                :options="pageOptions"
                v-model="perPage"
                @change="
                       onPerPageChanged
                    "
              
                style="background-color: rgb(190, 222, 255); border-radius: 6px; width: 30px; height: 30px; cursor: pointer"
                class="text-center"
              />
            </div>
          </div>
          <div v-if="false" class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <button
                type="button"
                v-tooltip.botton="
                  'Al dar click le mostrará el formulario para crear un nuevo expediente'
                "
                class="btn btn-primary btn-lg pull-right"
                @click="crear(expediente_id)"
              >
                <i class="fa fa-folder"></i> Crear nueva actuación
              </button>
            </div>
          </div>
          <div v-if="false" class="row">
            <div class="col-12 text-center">
              <h1>
                Número de Expediente <br />
                <strong>{{ numero_expediente }}</strong>
              </h1>
            </div>
          </div>
          <div v-if="false" class="row"><hr /></div>
          <div class="row">
            <div class="col-md-12 d-flex justify-content-center text-center">
              <span>
                <div class="loadingclass" v-if="loadingtabla">
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                </div>
              </span>
            </div>
          </div>

          <div class="row" v-if="!loadingtabla">
            <div class="col-sm-12 col-md-12 col-lg-12">
              <b-table
                class="text-center"
                ref="selectableTable"
                responsive
                hover
                small
                flex
                
                stacked="md"
                :fields="fields"
                :items="items"
                :filter="search"
                :current-page="currentPage"
                :per-page="perPage"
                @filtered="onFiltered"
                select-mode="single"
                selectable
                @row-selected="showOptions"
              >
                <!-- A virtual column -->
                <template slot="notificacion_electronica" slot-scope="data">
                  <small>{{ data.item.notificacion_electronica?"Si":"No" }}</small>
                </template>
                <template slot="fecha_exp_estado" slot-scope="data">
                  <small>{{ new Date(data.item.fecha_exp_estado).toLocaleDateString()}} </small>
                </template>
                <template slot="estado" slot-scope="data">
                  <small>{{ data.item.estado }}</small>
                </template>
                <template slot="solicitud.fecha_ingreso" slot-scope="data">
                  <span>{{
                    data.item.solicitud.fecha_ingreso
                      .split("-")
                      .reverse()
                      .join("/")
                  }}</span>
                </template>
                <template slot="opcion" slot-scope="data">
                  <div class="row" style="padding: 2px">
                    <button
                      v-if="opcion === 7"
                      class="btn btn-info btn-circle-md"
                      @click="verSolicitudesExternas(data.item)"
                      v-tooltip.right="
                        'Al dar click verá los requisitos que han sido completados por el usuario'
                      "
                    >
                      <i class="fa fa-eye"></i>
                    </button>
                  </div>
                  <div class="row" style="padding: 2px">
                    <button
                      v-if="opcion !== 7"
                      class="btn btn-info btn-circle-md"
                      @click="seguimiento(data.item)"
                      v-tooltip.right="
                        'Al dar click verá los seguimientos que pertenecen a la actuación con código ' +
                        data.item.codigo_barra
                      "
                    >
                      <i class="fa fa-eye"></i>
                    </button>
                  </div>

                  <div class="row">
                    <button
                      v-if="opcion === 1 || opcion === 6"
                      class="btn btn-success btn-circle-md"
                      @click="buscar_documento(data.item)"
                      v-tooltip.right="
                        'Al dar click verá los documentos que pertenecen a la actuación con código ' +
                        data.item.codigo_barra
                      "
                    >
                      <i class="fa fa-file"></i>
                    </button>
                  </div>

                  <div class="row">
                    <button
                    style="background-color: #ad00bd"

                      v-if="opcion === 1"
                      class="btn btn-circle-md"
                      @click="verFlujo(data.item)"
                      v-tooltip.right="
                        'Al dar click verá el flujo y paso actual de la actuación con código ' +
                        data.item.codigo_barra
                      "
                    >
                      <i class="fa fa-sitemap" style="color: white"></i>
                    </button>
                  </div>

                  <div class="row">
                    <button
                      v-if="opcion === 6 && data.item.notificacion_electronica"
                      class="btn btn-circle-md"
                      style="background-color: #9b3bf5;"
                      @click="crearCedulaNotificacion(data.item)"
                      v-tooltip.right="
                        'Al dar click podra crear una cedula de notificacion en base a este expediente'
                      "
                    >
                      <i class="fa fa-edit" style="color: white"></i>
                    </button>
                  </div>

                  <div class="row">
                    <button
                      v-if="opcion === 1"
                      class="btn btn-warning btn-circle-md"
                      @click="editarA(data.item)"
                      v-tooltip.right="
                        'Al dar click el sistema le mostrará la información para editar la actuación con código ' +
                        data.item.codigo_barra
                      "
                    >
                      <i class="fa fa-pencil"></i>
                    </button>
                  </div>

                  <div class="row">
                    <button
                      v-if="opcion === 1 || opcion === 2 || opcion === 5"
                      class="btn btn-primary btn-circle-md"
                      @click="agregarRequisitos(data.item)"
                      v-tooltip.right="
                        'Al dar click podra completar los requisitos o agregar documentos al expediente ' +
                        data.item.codigo_barra
                      "
                    >
                      <i class="fa fa-upload"></i>
                    </button>
                  </div>
                  <div class="row">
                    <button
                      v-if="opcion === 2"
                      class="btn btn-warning btn-circle-md"
                      @click="redirectActuacion(data.item)"
                      v-tooltip.right="
                        'Al dar click podra crear una nueva actuacion del expediente ' +
                        data.item.numero_expediente
                      "
                    >
                      <img
                        width="30"
                        height="30"
                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDkzLjA0MSA5My4wNDEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPHBhdGggZD0iTTMxLjgzMywzNC4xOTZjMC04LjE1OCw2LjYxMi0xNC43NzEsMTQuNzcxLTE0Ljc3MWM4LjE1NywwLDE0Ljc3MSw2LjYxMywxNC43NzEsMTQuNzcxICAgYzAsOC4xNTktNi42MTQsMTQuNzcxLTE0Ljc3MSwxNC43NzFDMzguNDQ2LDQ4Ljk2NiwzMS44MzMsNDIuMzU1LDMxLjgzMywzNC4xOTZ6IE03NC45OTcsNTMuMDA3YzAuMjQ5LTMuMjc3LDcuOTY0LTcuMyw3Ljk2NC03LjMgICBjMTAuNjgyLTQuODMzLDkuNjI0LTUuNjQyLDkuNjI0LTUuNjQyYy0xLjY1OS0xNy45MTktMjkuODY2LDkuNjI1LTI5Ljg2Niw5LjYyNWM4LjQ2Miw0LjEzOCw3LjAzOCwyMi41MTksNy4wNTIsMjIuMzk5ICAgYzAsMC0xLjEyNiw1LjE5OSwxMC43ODUtNS4yMjhjMTMuMzY3LTExLjcsNC4zOTYtOC44NzctMi4yNC02Ljg4NmMtNi42MzcsMS45OS0wLjQzNS0xLjE2Mi0wLjQzNS0xLjE2MiAgIGM3LjE5Ny0yLjY1NSwxMC44ODgtMi44MjEsMTQuNzA1LTEwLjk1MUM5Ni40LDM5LjczMyw3NC45OTcsNTMuMDA3LDc0Ljk5Nyw1My4wMDd6IE0zMC4zMjEsNDkuNjljMCwwLTI4LjIwNy0yNy41NDMtMjkuODY2LTkuNjI1ICAgYzAsMC0xLjA1OCwwLjgxLDkuNjI0LDUuNjQyYzAsMCw3LjcxNSw0LjAyMyw3Ljk2NCw3LjNjMCwwLTIxLjQwNC0xMy4yNzQtMTcuNTg4LTUuMTQ1czcuNTA4LDguMjk2LDE0LjcwNSwxMC45NTEgICBjMCwwLDYuMjAyLDMuMTUyLTAuNDM1LDEuMTYyYy02LjYzNy0xLjk5MS0xNS42MDctNC44MTItMi4yNCw2Ljg4NkMyNC4zOTcsNzcuMjg3LDI0LDcyLjA4OSwyNCw3Mi4wODkgICBDMjQuMDE0LDcyLjIwNywyMS44NTgsNTMuODI4LDMwLjMyMSw0OS42OXogTTM1LjE1NywxNS41MDljMC0xLjc3NCwxMC4yNzctMS44MjYsMTEuNDQ5LTEuODI2YzEuMTcxLDAsMTEuNDQ4LDAuMDUxLDExLjQ0OCwxLjgyNiAgIGMwLDEuNzc0LTEwLjI3NywxLjgyNS0xMS40NDgsMS44MjVDNDUuNDM0LDE3LjMzNCwzNS4xNTcsMTcuMjgzLDM1LjE1NywxNS41MDl6IE0zNS44NTIsMTUuNTA5ICAgYzAuNTM4LDAuNDkyLDQuNTA4LDEuMTYxLDEwLjc1NCwxLjE2MWM2LjI0NSwwLDEwLjIxNS0wLjY2OSwxMC43NTMtMS4xNjFjLTAuNTM4LTAuNDkyLTQuNTA4LTEuMTYyLTEwLjc1My0xLjE2MiAgIEM0MC4zNTksMTQuMzQ3LDM2LjM5LDE1LjAxNywzNS44NTIsMTUuNTA5eiIgZmlsbD0iI2ZmZmZmZiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgoJPHBhdGggZD0iTTY1Ljg4NCw1OC45NDFjLTEuNTMyLTQuOTI0LTUuNTIzLTguNzctMTAuNTM2LTEwLjA5NmMtMi4zMTgsMi4xNjItNS40MTYsMy40OTgtOC44MjcsMy40OTggICBjLTMuNDEzLDAtNi41MTItMS4zMzQtOC44MjgtMy40OThjLTYuNDQ4LDEuNzA1LTExLjIyNCw3LjU3Mi0xMS4yMjQsMTQuNTQ3djEyLjIxMWwwLjAzMSwwLjE4OWwwLjg0MiwwLjI2NCAgIGMyLjYyNCwwLjgyLDUuMTI0LDEuNDQzLDcuNTE0LDEuOTMybDMuMjI2LDAuNTg5YzMuNTUzLDAuNTU2LDYuODExLDAuNzgxLDkuNzM2LDAuNzgxYzExLjA3LDAsMTcuNDg3LTMuMTU3LDE3Ljg4My0zLjM1NiAgIGwwLjc4Ny0wLjM5OGwwLjA4MywwLjAwMVY2My4zOTJjMC0wLjQ0Ni0wLjAyMS0wLjg5MS0wLjA2LTEuMzI3TDY1Ljg4NCw1OC45NDF6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPC9nPjwvc3ZnPg=="
                      />
                    </button>
                  </div>

                  <div class="row">
                    <button
                      v-if="opcion === 1"
                      class="btn btn-info btn-circle-md"
                      @click="congelar(data.item)"
                      v-tooltip.right="
                        'Al dar click podra congelar el expediente ' +
                        data.item.codigo_barra
                      "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="white"
                        class="bi bi-snow"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M8 16a.5.5 0 0 1-.5-.5v-1.293l-.646.647a.5.5 0 0 1-.707-.708L7.5 12.793V8.866l-3.4 1.963-.496 1.85a.5.5 0 1 1-.966-.26l.237-.882-1.12.646a.5.5 0 0 1-.5-.866l1.12-.646-.884-.237a.5.5 0 1 1 .26-.966l1.848.495L7 8 3.6 6.037l-1.85.495a.5.5 0 0 1-.258-.966l.883-.237-1.12-.646a.5.5 0 1 1 .5-.866l1.12.646-.237-.883a.5.5 0 1 1 .966-.258l.495 1.849L7.5 7.134V3.207L6.147 1.854a.5.5 0 1 1 .707-.708l.646.647V.5a.5.5 0 1 1 1 0v1.293l.647-.647a.5.5 0 1 1 .707.708L8.5 3.207v3.927l3.4-1.963.496-1.85a.5.5 0 1 1 .966.26l-.236.882 1.12-.646a.5.5 0 0 1 .5.866l-1.12.646.883.237a.5.5 0 1 1-.26.966l-1.848-.495L9 8l3.4 1.963 1.849-.495a.5.5 0 0 1 .259.966l-.883.237 1.12.646a.5.5 0 0 1-.5.866l-1.12-.646.236.883a.5.5 0 1 1-.966.258l-.495-1.849-3.4-1.963v3.927l1.353 1.353a.5.5 0 0 1-.707.708l-.647-.647V15.5a.5.5 0 0 1-.5.5z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div class="row">
                    <button
                      v-if="opcion === 4"
                      class="btn btn-warning btn-circle-md"
                      @click="reasignar(data.item)"
                      v-tooltip.left="
                        'Al dar click podrá reasignar el expediente ' +
                        data.item.codigo_barra
                      "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="white"
                        class="bi bi-arrow-repeat"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"
                        />
                        <path
                          fill-rule="evenodd"
                          d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                        />
                      </svg>
                    </button>
                  </div>
                    <div class="row"> 
                    <button
                      v-if='(data.item.notificacion_electronica ? true : false) && userFromLawManagement'
                      class="btn  btn-circle-md"
                      style="background-color: #ff5500; color: white;  "
                      @click="createProvidenceButton(data.item)"
                      v-tooltip.right="
                        'Crear una providencia de este expediente. Código de barra ' +
                        data.item.codigo_barra
                      "
                    >
                    <i class="fa fa-file">     </i> 
                    <!-- <span class="material-symbols-outlined">
description
</span> -->
                      </button>
                    </div>
                  <!-- <a
                      v-if="data.item.congelado === true"
                      class="btn btn-danger btn-lg"
                      @click="descongelar(data.item.codigo_barra)"
                      v-tooltip.botton="
                        'Al dar click podra descongelar el expediente ' +
                        data.item.codigo_barra
                      "
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-sun-fill" viewBox="0 0 16 16">
                        <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
                      </svg>
                    </a> -->
                  <div class="row">
                    <button
                      v-if="data.item.congelado === true && opcion === 3"
                      class="btn btn-danger btn-circle-md"
                      @click="openModalDescongelar(data.item.codigo_barra)"
                      v-tooltip.botton="
                        'Al dar click podra descongelar el expediente ' +
                        data.item.codigo_barra
                      "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        class="bi bi-sun-fill"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div class="row">
                    <button
                      v-if="limitar && !data.item.completo"
                      :class="
                        data.item.deleted_at
                          ? 'btn btn-lg btn-success btn-circle-md'
                          : 'btn btn-lg btn-danger btn-circle-md'
                      "
                      @click="destroy(data.item)"
                      v-tooltip.botton="
                        'Al dar click eliminará, desactivará o activara el expediente'
                      "
                    >
                      <i
                        :class="
                          data.item.deleted_at
                            ? 'fa fa-thumbs-o-up'
                            : 'fa fa-thumbs-o-down'
                        "
                      ></i>
                    </button>
                  </div>
                </template>
              </b-table>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-12">
              <label v-if="totalRows > 0"
                >Total: {{ totalRows }} registros en el sistema.</label
              >
              <div class="text-center">
                <label v-if="totalRows === 0"
                  >No hay registros que mostrar</label
                >
              </div>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-12">
              <label class="pull-right"
                ><b-pagination
                  :total-rows="totalRows"
                  :per-page="perPage"
                  v-model="currentPage"
                  class="my-0 text-center"
              /></label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para ingresar razon de congelacion de un expediente-->
    <div
      :class="abrirModalCongelar"
      data-backdrop="static"
      v-bind:style="styleObjectCongelar"
      v-loading="loading"
    >
      <div class="modal-dialog modal-lg" style="width: 80%">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">
              Razon de congelación para la actuación {{ barcode }}
              <button
                type="button"
                @click="cancel_showCongelar"
                class="btn btn-danger btn-xs pull-right"
              >
                <i class="fa fa-close"></i>
              </button>
            </h2>
          </div>

          <div
            class="modal-body text-center"
            style="overflow-y: auto; height: auto"
            v-if="modalCongelar"
          >
            <div class="row">
              <div class="content">
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="unidad_id">Tipo de Congelacion</label>
                    <multiselect
                      v-model="congelacion.tipo"
                      :options="tipoCongelaciones"
                      placeholder="Seleccione uno porfavor"
                      :searchable="true"
                      :allow-empty="false"
                      data-vv-name="unidad"
                      v-validate="'required'"
                      :show-labels="false"
                      label="nombre"
                      track-by="id"
                    >
                      <span slot="noResult">Ningún registro encontrado</span>
                    </multiselect>
                    <FormError :attribute_name="'unidad'" :errors_form="errors">
                    </FormError>
                  </div>
                </div>

                <div v-if="congelacion.agregar === false" class="col-md-12">
                  <div class="form-group">
                    <label for="unidad_id">Razon de Congelacion</label>
                    <multiselect
                      v-model="congelacion.razon"
                      :options="razonCongelaciones"
                      placeholder="Seleccione uno porfavor"
                      :searchable="true"
                      :allow-empty="false"
                      data-vv-name="unidad"
                      v-validate="'required'"
                      :show-labels="false"
                      label="nombre"
                      track-by="id"
                    >
                      <span slot="noResult">Ningún registro encontrado</span>
                    </multiselect>
                    <FormError :attribute_name="'unidad'" :errors_form="errors">
                    </FormError>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="form-group">
                    <enhanced-check
                      :label="
                        congelacion.agregar
                          ? 'LA RAZON DE CONGELACION NO EXISTE'
                          : 'LA RAZON DE CONGELACION YA EXISTE'
                      "
                      subClass="success"
                      :animate="true"
                      :inline="false"
                      v-model="congelacion.agregar"
                      v-validate="'required'"
                      data-vv-name="adjuntar documento"
                      data-vv-scope="paso"
                    ></enhanced-check>
                    <FormError
                      :attribute_name="'paso.adjuntar documento'"
                      :errors_form="errors"
                    >
                    </FormError>
                  </div>
                </div>

                <div
                  v-if="congelacion.agregar"
                  class="col-sm-12 col-md-12 col-lg-12"
                >
                  <div class="form-group">
                    <label for="observacion">Razon de Congelacion</label>
                    <textarea
                      cols="30"
                      rows="10"
                      v-model="congelacion.razon"
                      type="textarea"
                      class="form-control"
                      id="observacion"
                      placeholder="escriba la razon"
                      name="observacion"
                      v-validate="'required|min:3|max:2500'"
                      :class="{
                        input: true,
                        'has-errors': errors.has('observacion'),
                      }"
                      @input="
                        form.observacion = $event.target.value.toUpperCase()
                      "
                    />
                    <FormError
                      :attribute_name="'observacion'"
                      :errors_form="errors"
                    >
                    </FormError>
                  </div>
                </div>
                <div
                  v-if="congelacion.agregar"
                  class="col-sm-12 col-md-12 col-lg-12 text-red"
                >
                  <small
                    >La información que ingrese en este formulario es la que
                    aparecera en el seguimiento histórico de la actuación
                    {{ barcode }}.
                  </small>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-12">
                  <div class="box-footer">
                    <button
                      type="button"
                      class="btn btn-danger btn-block btn-large pull-left"
                      @click="cleanCongelacion()"
                    >
                      <i class="fa fa-ban"></i> Cancelar
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary btn-block btn-large pull-right"
                      @click="guardarCongelacion()"
                    >
                      <i class="fa fa-save"></i> Guardar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para mostrar los datos de descongelacion del expediente-->
    <div
      :class="abrirModalDescongelar"
      data-backdrop="static"
      v-bind:style="styleObjectDescongelar"
      v-loading="loading"
    >
      <div class="modal-dialog modal-lg" style="width: 50%">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">
              Datos de la congelacion de la Actuacion {{ barcode }}
              <button
                type="button"
                @click="cancel_showDescongelar"
                class="btn btn-danger btn-xs pull-right"
              >
                <i class="fa fa-close"></i>
              </button>
            </h2>
          </div>

          <div
            class="modal-body text-center"
            style="overflow-y: auto; height: auto"
            v-if="modalDescongelar"
          >
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12">
                <h4>
                  <strong>RAZON DE CONGELACION: </strong>{{ razon_congelar }}
                </h4>
                <br />
                <h4>
                  <strong>TIPO DE CONGELACION: </strong>{{ tipo_congelacion }}
                </h4>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-danger btn-block btn-lg pull-right"
              @click="descongelar(barcode)"
            >
              <i class="fa fa-save"></i> Descongelar expediente
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para mostrar los documentos de la actuacion seleccionada -->
    <div
      :class="abrirModalDocumento"
      data-backdrop="static"
      v-bind:style="styleObjectDocumento"
      v-loading="loading"
    >
      <div class="modal-dialog modal-lg" style="width: 80%; height: 80%">
        <div class="modal-content p-4">
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

    <!-- Modal para Crear Cedula de Notificacion -->
    <div
      :class="abrirModalCedulaNotf"
      data-backdrop="static"
      v-bind:style="styleObjectCedulaNotf"
      v-loading="loading"

    >
      <div class="modal-dialog modal-lg " style="width: 80%; height: 80%">
        <div class="modal-content rounded-2 p-8 position-relative">
          <div class="modal-header p-8 text-center">
            <div class="row">
              <div class="col-11">
                <h2 class="mx-8" style="margin-left: 15px; margin-right: 15px;">
              Crear cédula de Notificación para el expediente <br/> {{ titleCrearNotif }}

            </h2>
              </div>

            <div class="col">
              <button
                type="button"
                @click="cancel_showCrearCedula"
                class="btn btn-md pull-right text-white position-absolute position-absolute top-0 end-0"
                style="background-color: rgb(219, 2, 2); color:white" 
              >
                <i class="fa fa-close"></i>
              </button>  
              </div>

            </div>

          </div>

          <div
            class="modal-body px-25"
            style="overflow-y: auto; height: 100%;"
            v-if="modalCedulaNotf"
          >

          <notificacion-cedula
          :manual="false"
              :item="item"
              :copia="false"
              v-on:guardado="guardado"
              v-on:carga="carga"
              :loading="loading"
              @cerrar_modal="cancel_showCrearCedula"
          />
            <!-- <notf-cedula
              :manual="false"
              :item="item"
              :copia="false"
              v-on:guardado="guardado"
              v-on:carga="carga"
              :loading="loading"
              @cerrar_modal="cancel_showCrearCedula"
            /> -->
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para mostrar los datos para editar -->
    <div
      :class="abrirModalEditar"
      data-backdrop="static"
      v-bind:style="styleObjectEditar"
      v-loading="loading"
    >
      <div class="modal-dialog modal-lg" style="width: 80%; height: 80%">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">
              {{ titleEditar }}
              <button
                type="button"
                @click="cancel_showEditar"
                class="btn btn-danger btn-xs pull-right"
              >
                <i class="fa fa-close"></i>
              </button>
            </h2>
          </div>

          <div
            class="modal-body text-center"
            style="overflow-y: auto; height: 100%"
            v-if="modalEditar"
          >
            <div class="row">
              <div class="col-sm-12 col-md-3 col-lg-3">
                <div class="form-group">
                  <label for="fecha_ingreso">Fecha de ingreso</label>
                  <date-picker
                    v-model="form.fecha_ingreso"
                    :input-props="{
                      class: 'form-control',
                      placeholder: 'seleccione la fecha de ingreso',
                    }"
                    format="DD-MM-YYYY"
                    placeholder="seleccionar fecha"
                    data-vv-name="fecha de ingreso"
                    v-validate="'required|date_format:dd/MM/yyyy'"
                    show-caps
                  ></date-picker>
                  <FormError
                    :attribute_name="'fecha de ingreso'"
                    :errors_form="errors"
                  >
                  </FormError>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12">
                <div class="form-group">
                  <label for="nombre_expediente">Nombre del expediente</label>
                  <input
                    v-model="form.nombre_expediente"
                    type="text"
                    class="form-control"
                    id="nombre_expediente"
                    placeholder="escribir el nombre del expediente"
                    name="nombre del expediente"
                    v-validate="'required|min:1|max:100'"
                    :class="{
                      input: true,
                      'has-errors': errors.has('nombre del expediente'),
                    }"
                    @input="
                      form.nombre_expediente = $event.target.value.toUpperCase()
                    "
                  />
                  <FormError
                    :attribute_name="'nombre del expediente'"
                    :errors_form="errors"
                  >
                  </FormError>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-3 col-lg-4">
                <div class="form-group">
                  <label for="nit">NIT Actual: {{ form.nit }} </label>
                  <autocomplete
                    :search="buscar_nit"
                    placeholder="Buscar número de NIT"
                    aria-label="Buscar número de NIT"
                    @submit="seleccionarNIT"
                    :get-result-value="getResultValue"
                  >
                  </autocomplete>
                </div>
              </div>
              <div class="col-sm-12 col-md-9 col-lg-8">
                <div class="form-group">
                  <label for="razon_social"
                    >Nombre de Empresa:
                  </label>
                  <span v-if="noEditarNit">{{ form.razon_social }}</span>
                  <input
                    :disabled="bloquearCamposnit"
                    v-if="noEditarNit === false"
                    v-model="form.razon_social"
                    type="text"
                    class="form-control"
                    id="razon_social"
                    placeholder="escribir el nombre de la razon social"
                    name="nombre de la razon social"
                    v-validate="'required|min:1|max:100'"
                    :class="{
                      input: true,
                      'has-errors': errors.has('nombre de la razon social'),
                    }"
                    @input="
                      form.razon_social = $event.target.value.toUpperCase()
                    "
                  />
                  <FormError
                    :attribute_name="'nombre de la razon social'"
                    :errors_form="errors"
                  >
                  </FormError>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-3 col-lg-4">
                <div class="form-group">
                  <label for="patente"
                    >Número de registro de patente de empresa:
                  </label>
                  <span v-if="noEditarNit">{{ form.patente }}</span>
                  <input
                    :disabled="bloquearCamposnit"
                    v-if="noEditarNit === false"
                    v-model="form.patente"
                    type="text"
                    class="form-control"
                    name="número de la patente"
                    v-validate="'required'"
                    @input="
                      form.patente = $event.target.value.toUpperCase();
                      isActive = false;
                    "
                  />
                  <FormError
                    :attribute_name="'número de la patente'"
                    :errors_form="errors"
                  >
                  </FormError>
                </div>
              </div>
              <div class="col-sm-12 col-md-4 col-lg-4">
                <div class="form-group">
                  <label for="tipo_razon_social">Tipo de Empresa: </label>
                  <span v-if="noEditarNit">{{ form.tipo_razon_social }}</span>
                  <multiselect
                    :disabled="bloquearCamposnit"
                    v-if="noEditarNit === false"
                    v-model="form.tipo_razon_social"
                    :options="tipos_razones"
                    @select="isActive = false"
                    placeholder="Seleccione uno por favor"
                    :searchable="false"
                    :allow-empty="true"
                    :preselect-first="false"
                    data-vv-name="tipo de razon social"
                    v-validate="'required'"
                    :show-labels="false"
                    :show-no-result="true"
                  >
                    <span slot="noResult">No se encontró información</span>
                  </multiselect>
                  <FormError
                    :attribute_name="'tipo de razon social'"
                    :errors_form="errors"
                  >
                  </FormError>
                </div>
              </div>
            </div>
            <!-- <pre>{{ form }}</pre> -->
            <div class="row">
              <div class="col-sm-12 col-md-6 col-lg-4">
                <div class="carta">
                  <div class="carta_content">
                    <div style="text-align: center">
                      <div>
                        <h4>
                          <span>
                            <strong>Dirección del Propietario</strong>
                          </span>
                        </h4>
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="nombre">Departamento:</label>
                      <multiselect
                        :disabled="bloquearCamposnit"
                        v-model="form.departamento_propietario"
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
                        @close="setDepaux(form.departamento_propietario, 1)"
                      >
                        <span slot="noResult">No se encontró información</span>
                      </multiselect>

                      <br />
                      <label for="nombre">Municipio:</label>
                      <multiselect
                        :disabled="bloquearCamposnit"
                        v-model="form.mun_propietario"
                        :options="municipiosTemp1"
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
                        @close="setMunaux(form.mun_propietario)"
                      >
                        <span slot="noResult">No se encontró información</span>
                      </multiselect>
                      <br />
                      <label for="observacion">Direccion del Propietario</label>
                      <textarea
                        :disabled="bloquearCamposnit"
                        v-model="form.direccion_propietario"
                        class="form-control"
                        id="direccion_propietario"
                        placeholder="escribir la direccion correspondiente"
                        name="direccion propietario"
                        v-validate="'max:250'"
                        :class="{
                          input: true,
                          'has-errors': errors.has('direccion propietario'),
                        }"
                        @input="
                          form.direccion_propietario =
                            $event.target.value.toUpperCase()
                        "
                      ></textarea>
                      <FormError
                        :attribute_name="'direccion propietario'"
                        :errors_form="errors"
                      ></FormError>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-sm-12 col-md-6 col-lg-4">
                <div class="carta">
                  <div class="carta_content">
                    <div style="text-align: right; position: absolute">
                      <h5>
                        <span
                          @click="limpiarDirecciones(1)"
                          style="
                            background: #cd3432;
                            box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
                              rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
                              rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset,
                              rgba(0, 0, 0, 0.06) 0px 2px 1px,
                              rgba(0, 0, 0, 0.09) 0px 4px 2px,
                              rgba(0, 0, 0, 0.09) 0px 8px 4px,
                              rgba(0, 0, 0, 0.09) 0px 16px 8px,
                              rgba(0, 0, 0, 0.09) 0px 32px 16px;
                            color: white;
                            padding: 4px;
                            cursor: pointer;
                            border-radius: 10px;
                          "
                          >Limpiar</span
                        >
                      </h5>
                    </div>
                    <div style="text-align: center">
                      <div>
                        <h4>
                          <span>
                            <strong>Dirección Comercial</strong>
                          </span>
                        </h4>
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="nombre">Departamento:</label>
                      <multiselect
                        :disabled="bloquearCamposnit"
                        v-model="form.departamento_comercial"
                        :options="departamentos"
                        placeholder="Seleccione uno por favor"
                        :searchable="true"
                        :allow-empty="false"
                        :preselect-first="false"
                        data-vv-name="tipo de documento"
                        data-vv-scope="representante"
                        :show-labels="false"
                        :show-no-result="true"
                        label="nombre"
                        track-by="id"
                        @close="setDepaux(form.departamento_comercial, 3)"
                      >
                        <span slot="noResult">No se encontró información</span>
                      </multiselect>

                      <br />
                      <label for="nombre">Municipio:</label>
                      <multiselect
                        :disabled="bloquearCamposnit"
                        v-model="form.mun_comercial"
                        :options="municipiosTemp3"
                        placeholder="Seleccione uno por favor"
                        :searchable="true"
                        :allow-empty="false"
                        :preselect-first="false"
                        data-vv-name="tipo de documento"
                        data-vv-scope="representante"
                        :show-labels="false"
                        :show-no-result="true"
                        label="nombre"
                        track-by="id"
                        @close="setMunaux(form.mun_comercial)"
                      >
                        <span slot="noResult">No se encontró información</span>
                      </multiselect>
                      <br />
                      <label for="observacion">Direccion Comercial</label>
                      <textarea
                        :disabled="bloquearCamposnit"
                        v-model="form.direccion_comercial"
                        v-if="
                          form.departamento_comercial != '' &&
                          form.mun_comercial != ''
                        "
                        class="form-control"
                        id="direccion_comercial"
                        placeholder="escribir la direccion correspondiente"
                        name="direccion comercial"
                        :class="{
                          input: true,
                          'has-errors': errors.has('direccion comercial'),
                        }"
                        @input="
                          form.direccion_comercial =
                            $event.target.value.toUpperCase()
                        "
                      ></textarea>
                      <FormError
                        :attribute_name="'direccion comercial'"
                        :errors_form="errors"
                      ></FormError>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-sm-12 col-md-6 col-lg-4">
                <div class="carta">
                  <div class="carta_content">
                    <div
                      style="text-align: right; position: absolute"
                      v-if="bloquearCamposnit"
                    >
                      <h5>
                        <span
                          @click="limpiarDirecciones(2)"
                          style="
                            background: #cd3432;
                            box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
                              rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
                              rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset,
                              rgba(0, 0, 0, 0.06) 0px 2px 1px,
                              rgba(0, 0, 0, 0.09) 0px 4px 2px,
                              rgba(0, 0, 0, 0.09) 0px 8px 4px,
                              rgba(0, 0, 0, 0.09) 0px 16px 8px,
                              rgba(0, 0, 0, 0.09) 0px 32px 16px;
                            color: white;
                            padding: 4px;
                            cursor: pointer;
                            border-radius: 10px;
                          "
                          >Limpiar</span
                        >
                      </h5>
                    </div>
                    <div style="text-align: center">
                      <div>
                        <h4>
                          <span>
                            <strong>Dirección a notificar</strong>
                          </span>
                        </h4>
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="nombre">Departamento:</label>
                      <multiselect
                        :disabled="bloquearCamposnit"
                        v-model="form.departamento_notificacion"
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
                        @close="setDepaux(form.departamento_notificacion, 2)"
                      >
                        <span slot="noResult">No se encontró información</span>
                      </multiselect>

                      <br />
                      <label for="nombre">Municipio:</label>
                      <multiselect
                        :disabled="bloquearCamposnit"
                        v-model="form.mun_notificacion"
                        :options="municipiosTemp2"
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
                        @close="setMunaux(form.mun_notificacion)"
                      >
                        <span slot="noResult">No se encontró información</span>
                      </multiselect>
                      <br />
                      <label for="observacion">Direccion a Notificar</label>
                      <textarea
                        :disabled="bloquearCamposnit"
                        v-model="form.direccion_notificacion"
                        v-if="
                          form.departamento_notificacion != '' &&
                          form.mun_notificacion != ''
                        "
                        class="form-control"
                        id="direccion_notificacion"
                        placeholder="escribir la direccion correspondiente"
                        name="direccion notificacion"
                        v-validate="'max:250'"
                        :class="{
                          input: true,
                          'has-errors': errors.has('direccion notificacion'),
                        }"
                        @input="
                          form.direccion_notificacion =
                            $event.target.value.toUpperCase()
                        "
                      ></textarea>
                      <FormError
                        :attribute_name="'direccion notificacion'"
                        :errors_form="errors"
                      ></FormError>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12">
                <div class="form-group">
                  <label for="observacion">Observación</label>
                  <textarea
                    :disabled="bloquearCamposnit"
                    v-model="form.observacion"
                    class="form-control"
                    id="observacion"
                    placeholder="escribir la observación del expediente"
                    name="observación"
                    v-validate="'max:250'"
                    :class="{
                      input: true,
                      'has-errors': errors.has('observación'),
                    }"
                    @input="
                      form.observacion = $event.target.value.toUpperCase()
                    "
                  ></textarea>
                  <FormError
                    :attribute_name="'observación'"
                    :errors_form="errors"
                  ></FormError>
                </div>
              </div>
            </div>

            <button
              class="btn btn-info btn-circle-md"
              @click="agregarRazonSocial()"
              v-tooltip.top="'Agregar Razón Social'"
            >
              <i class="fa fa-plus"></i>
            </button>
            <hr />
            <div class="row">
              <div
                v-for="(x, index) in form.representantes"
                :key="index"
                class="col-md-4"
              >
                <div class="card">
                  <div v-if="!x.editar" class="card-body">
                    <div style="text-align: right; position: relative">
                      <h5 v-if="x.quitar">
                        <span
                          style="
                            background: #26873f;
                            box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
                              rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
                              rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset,
                              rgba(0, 0, 0, 0.06) 0px 2px 1px,
                              rgba(0, 0, 0, 0.09) 0px 4px 2px,
                              rgba(0, 0, 0, 0.09) 0px 8px 4px,
                              rgba(0, 0, 0, 0.09) 0px 16px 8px,
                              rgba(0, 0, 0, 0.09) 0px 32px 16px;
                            color: white;
                            padding: 4px;
                            cursor: pointer;
                            border-radius: 10px;
                          "
                          >Nuevo</span
                        >
                      </h5>
                    </div>
                    <!-- <h3>REPRESENTANTE</h3> -->
                    <span><strong>DPI O PASAPORTE: </strong>{{ x.dpi }}</span
                    ><br /><br />
                    <span
                      ><strong>REPRESENTANTE: </strong> <br />
                      {{ x.razon_social }}</span
                    ><br /><br />
                    <span
                      ><strong>REPRESENTACIÓN: </strong> <br />
                      {{ x.representacion }}</span
                    ><br /><br />
                    <span><strong>TELEFONO: </strong>{{ x.numero }}</span
                    ><br /><br />
                    <span><strong>EMAIL: </strong>{{ x.email }}</span
                    ><br /><br />
                    <span
                      ><strong>EMAIL ALTERNO: </strong
                      >{{ x.email_alternativo }}</span
                    ><br /><br />
                  </div>
                  <div v-if="x.editar" class="card-body">
                    <div style="text-align: right; position: absolute">
                      <h5 v-if="x.quitar">
                        <span
                          @click="quitarRepresentante(x)"
                          style="
                            background: #cd3432;
                            box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
                              rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
                              rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset,
                              rgba(0, 0, 0, 0.06) 0px 2px 1px,
                              rgba(0, 0, 0, 0.09) 0px 4px 2px,
                              rgba(0, 0, 0, 0.09) 0px 8px 4px,
                              rgba(0, 0, 0, 0.09) 0px 16px 8px,
                              rgba(0, 0, 0, 0.09) 0px 32px 16px;
                            color: white;
                            padding: 4px;
                            cursor: pointer;
                            border-radius: 10px;
                          "
                          >Quitar</span
                        >
                      </h5>
                    </div>

                    <h3>EDITAR</h3>
                    <br />
                    <label>DPI O PASAPORTE</label>
                    <autocomplete
                      :search="buscar_nit_representante"
                      type="text"
                      placeholder="Buscar número de CUI"
                      aria-label="Buscar número de CUI"
                      @click="getIndex(index)"
                      @submit="seleccionarNITRR"
                      :get-result-value="getResultValueR"
                    >
                    </autocomplete>
                    <div v-if="x.editar">
                      <br />
                      <input
                        v-model="x.dpi"
                        disabled
                        type="text"
                        @click="indexx = index"
                        class="form-control"
                        id="DPI"
                        placeholder="DPI"
                        name="DPI"
                        v-validate="'required|min:13|max:13'"
                      />
                      <br />
                      <label>REPRESENTANTE</label>
                      <input
                        :disabled="
                          x.razon_social_id === 217 || x.razon_social_id === 365
                        "
                        v-model="x.razon_social"
                        @click="indexx = index"
                        type="text"
                        class="form-control"
                        id="razon_social"
                        placeholder="Razon Social"
                        name="razon_social"
                        v-validate="'required|min:1|max:250'"
                      />
                      <br />
                      <label>REPRESENTACIÓN</label>
                      <multiselect
                        :disabled="
                          x.razon_social_id === 217 || x.razon_social_id === 365
                        "
                        @click="indexx = index"
                        v-model="x.rep"
                        :options="representaciones"
                        placeholder="Seleccione uno por favor"
                        :searchable="true"
                        :allow-empty="true"
                        :preselect-first="false"
                        data-vv-name="municipio"
                        data-vv-scope="representante"
                        v-validate="'required'"
                        :show-labels="false"
                        :show-no-result="true"
                        label="nombre"
                        track-by="id"
                        @close="setRepresentacion(x)"
                      >
                        <span slot="noResult">No se encontró información</span>
                      </multiselect>
                      <br />
                      <label>TELEFONO</label>
                      <input
                        @click="indexx = index"
                        v-model="x.numero"
                        type="text"
                        class="form-control"
                        id="numero"
                        placeholder="numero"
                        name="numero"
                        v-validate="'required|min:1|max:250'"
                        :disabled="
                          x.razon_social_id === 217 || x.razon_social_id === 365
                        "
                      />
                      <br />
                      <label>EMAIL</label>
                      <input
                        :disabled="
                          x.razon_social_id === 217 || x.razon_social_id === 365
                        "
                        @click="indexx = index"
                        v-model="x.email"
                        type="email"
                        class="form-control"
                        id="email"
                        placeholder="Email"
                        name="email"
                        v-validate="'required|min:1|max:50'"
                      />
                      <br />
                      <label>EMAIL ALTERNATIVO</label>
                      <input
                        @click="indexx = index"
                        :disabled="
                          x.razon_social_id === 217 || x.razon_social_id === 365
                        "
                        v-model="x.email_alternativo"
                        type="email"
                        class="form-control"
                        id="email_alternativo"
                        placeholder="Email Alternativo"
                        name="email_alternativo"
                        v-validate="'required|min:1|max:50'"
                      />
                      <br />
                      <br />
                    </div>
                  </div>
                  <div style="text-align: center">
                    <button
                      v-if="!x.editar"
                      class="btn btn-warning btn-circle-md"
                      @click="editarDatosRepresentantes(x)"
                      v-tooltip.top="'Modificar'"
                    >
                      <i class="fa fa-edit"></i>
                    </button>

                    <button
                      v-if="x.editar"
                      class="btn btn-success btn-circle-md"
                      @click="aceptarEdicionRepresentante(x)"
                      v-tooltip.top="'Aceptar'"
                    >
                      <i class="fa fa-check"></i>
                    </button>
                    <button
                      class="btn btn-danger btn-circle-md"
                      @click="eliminarRep(x)"
                      v-tooltip.top="'Eliminar'"
                      v-if="!x.quitar"
                    >
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                  <hr />
                </div>
              </div>
            </div>

            <button
              type="button"
              class="btn btn-warning btn-block btn-lg pull-right"
              @click="saveEdit()"
            >
              <i class="fa fa-save"></i> Actualizar información
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para mostrar los pasos a los que puede ir un expediente-->
    <div
      :class="abrirModal"
      data-backdrop="static"
      v-bind:style="styleObject"
      v-loading="loading"
    >
      <div class="modal-dialog modal-lg" style="width: 50%">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">
              {{ title
              }}<button
                type="button"
                @click="cancel_show"
                class="btn btn-danger btn-xs pull-right"
              >
                <i class="fa fa-close"></i>
              </button>
            </h2>
          </div>

          <div
            class="modal-body text-center"
            style="overflow-y: auto; height: 100%"
            v-if="modal"
          >
            <div class="row">
              <div
                class="col-sm-12 col-md-12 col-lg-12"
                v-if="botones_siguiente.length > 0"
              >
                <h3>Pasos a donde puede ir el trámite</h3>
                <template v-for="(item, index) in botones_siguiente">
                  <a
                    v-bind:key="item.nombre + index"
                    :disabled="item.desactivado"
                    @click="seguimiento_siguiente(item)"
                    v-tooltip.botton="
                      'Al dar click, el proceso continuará en el paso número ' +
                      item.siguiente_paso
                    "
                    class="btn btn-primary btn-block btn-lg"
                    ><span>{{ item.nombre }}</span></a
                  >
                  <!-- <br /><br /> -->
                </template>
              </div>
              <div
                class="col-sm-12 col-md-12 col-lg-12"
                v-if="botones_atras.length > 0"
              >
                <hr />
              </div>
              <div
                class="col-sm-12 col-md-12 col-lg-12"
                v-if="botones_atras.length > 0"
              >
                <h3>Pasos a donde puede regresar el trámite</h3>
                <template v-for="(item, index) in botones_atras">
                  <a
                    v-bind:key="item.nombre + index"
                    @click="seguimiento_atras(item)"
                    v-tooltip.botton="
                      'Al dar click, el proceso regresará al paso número ' +
                      item.atras_paso
                    "
                    class="btn btn-success btn-block btn-lg"
                    ><span>{{ item.nombre }}</span></a
                  >
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para la reasignacion de un expediente-->
    <div
      :class="abrirModalReasignacion"
      data-backdrop="static"
      v-bind:style="styleObjectReasignacion"
      v-loading="loading"
    >
      <div class="modal-dialog modal-lg" style="width: 50%">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">
              {{ title
              }}<button
                type="button"
                @click="cancel_showReasignacion"
                class="btn btn-danger btn-xs pull-right"
              >
                <i class="fa fa-close"></i>
              </button>
            </h2>
          </div>

          <div
            class="modal-body text-center"
            style="overflow-y: auto; height: 70%"
            v-if="modalReasignacion"
          >
            <div class="row">
              <div class="col-md-12">
                <label for="unidad_id"
                  >USUARIO AL QUE LE ASIGNARA EL EXPEDIENTE</label
                >
                <multiselect
                  v-model="formReasignacion.usuario"
                  :options="usuariosReasignar"
                  placeholder="Seleccione uno porfavor"
                  :searchable="true"
                  :allow-empty="false"
                  data-vv-name="usuario"
                  v-validate="'required'"
                  :show-labels="false"
                  label="usuario"
                  track-by="id"
                >
                  <span slot="noResult">Ningún registro encontrado</span>
                </multiselect>
                <FormError :attribute_name="'usuario'" :errors_form="errors">
                </FormError>
              </div>
            </div>
            <br />
            <hr />
            <div class="row">
              <div class="col-md-12">
                <h3>EXPEDIENTE A REASIGNAR</h3>
                <br />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <label> NUMERO EXPEDIENTE: </label><br />
                <span> {{ formReasignacion.row.exp_num }} </span><br />
              </div>
              <div class="col-md-6">
                <label> NOMBRE DEL EXPEDIENTE: </label><br />
                <span> {{ formReasignacion.row.nombre_expediente }} </span>
              </div>
            </div>
            <br />
            <hr />
            <div class="row">
              <div class="col-md-12">
                <h3>UBICACIONES</h3>
                <br />
              </div>
            </div>
            <!-- <div class="row"> -->
            <table class="table">
              <thead>
                <tr>
                  <!-- <th scope="col">#</th> -->
                  <th class="text-center" scope="col">NOMBRE</th>
                  <th class="text-center" scope="col">REPRESENTACION</th>
                  <th class="text-center" scope="col">DEPARTAMENTO</th>
                  <th class="text-center" scope="col">MUNICIPIO</th>
                  <th class="text-center" scope="col">
                    DIRECCIÓN DE NOTIFICACIÓN
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(x, i) in direcciones" :key="i">
                  <!-- <td class="text-center"><pre>{{ x }}</pre></td> -->
                  <td class="text-center">{{ x.razon_social }}</td>
                  <td class="text-center">{{ x.representacion }}</td>
                  <td class="text-center">{{ x.nombre_departamento }}</td>
                  <td class="text-center">{{ x.nombre_municipio }}</td>
                  <td class="text-center">{{ x.direccion_notificacion }}</td>
                </tr>
              </tbody>
            </table>
            <!-- </div> -->
            <hr />
            <div v-if="formReasignacion.usuario !== null">
              <div class="row">
                <div class="col-md-6">
                  <label>USUARIO ACTUAL: </label><br />
                  <span>{{ formReasignacion.row.usuario }}</span>
                </div>
                <div class="col-md-6">
                  <label>USUARIO SELECCIONADO: </label><br />
                  <span>{{ formReasignacion.usuario.usuario }}</span
                  ><br />
                </div>
                <div class="col-md-12">
                  <br />
                  <label for="nombre">Razon de Reasignacion</label>
                  <textarea
                    cols="30"
                    rows="10"
                    v-model="formReasignacion.razon"
                    type="text"
                    class="form-control"
                    id="nombre"
                    placeholder="escribir el nombre"
                    name="nombre"
                    v-validate="'required|min:3|max:250'"
                    :class="{ input: true, 'has-errors': errors.has('nombre') }"
                    @input="
                      formReasignacion.razon = $event.target.value.toUpperCase()
                    "
                  />
                  <FormError :attribute_name="'nombre'" :errors_form="errors">
                  </FormError>
                </div>
              </div>
              <br />
              <hr />
              <div
                v-if="
                  formReasignacion.row.usuario ===
                  formReasignacion.usuario.usuario
                "
                class="row"
              >
                <div class="col-md-12">
                  <label style="color: red">ERROR</label><br />
                  <span style="color: red">
                    EL USUARIO ACTUAL Y EL SELECCIONADO NO DEBEN SER IGUALES
                  </span>
                  <label style="color: red">
                    SELECCIONE UN USUARIO DIFERENTE A "{{
                      formReasignacion.row.usuario
                    }}"
                  </label>
                </div>
              </div>
              <!-- <pre>{{ formReasignacion }}</pre> -->
            </div>
          </div>

          <div class="modal-footer">
            <div
              v-if="
                formReasignacion.row !== null &&
                formReasignacion.usuario !== null
              "
            >
              <button
                v-if="
                  formReasignacion.row.usuario !==
                  formReasignacion.usuario.usuario
                "
                type="button"
                class="btn btn-success btn-block btn-md pull-left"
                @click="guardarReasignacion()"
              >
                <i class="fa fa-save"></i> Reasignar Expediente
              </button>
              <button
                type="button"
                class="btn btn-danger btn-block btn-md pull-right"
                @click="cancel_showReasignacion"
              >
                <i class="fa fa-ban"></i> Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para las Solicitudes Externas de expediente-->
    <div
      :class="abrirModalExterna"
      data-backdrop="static"
      v-bind:style="styleObjectExterna"
      v-loading="loading"
    >
      <div class="modal-dialog modal-lg" style="width: 80%; height: auto">
        <div class="modal-content">
          <div class="modal-header ">
            <h2 class="modal-title">
              {{ titleExterna }}
              <button
                type="button"
                @click="cancel_showExterna"
                class="btn btn-danger btn-xs pull-right "
              >
                <i class="fa fa-close"></i>
              </button>
            </h2>
          </div>

          <div
            class="modal-body text-center"
            style="overflow-y: auto; height: 80%; padding-bottom: 20px"
            v-if="modalExterna"
          >
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12">
                <div class="card">
                  <div class="card-body">
                    <div class="form-group">
                      <h3><strong>NOMBRE DEL EXPEDIENTE</strong></h3>
                      <br />
                      <input
                        v-model="formExterno.nombre_expediente"
                        type="text"
                        class="form-control"
                        id="nombre_expediente"
                        placeholder="escribir el nombre del expediente"
                        name="nombre del expediente"
                        v-validate="'required|min:1|max:100'"
                        :class="{
                          input: true,
                          'has-errors': errors.has('nombre del expediente'),
                        }"
                        @input="
                          formExterno.nombre_expediente =
                            $event.target.value.toUpperCase()
                        "
                      />
                      <FormError
                        :attribute_name="'nombre del expediente'"
                        :errors_form="errors"
                      >
                      </FormError>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />

            <!-- EMPRESA -->
            <div class="row">
              <div class="col-md-12">
                <div class="card">
                  <div class="card-body">
                    <h3><strong>EMPRESA</strong></h3>
                    <br />
                    <div class="row">
                      <div class="col-md-4">
                        <span
                          ><strong>NOMBRE: </strong
                          >{{ empresaExterna.razon_social }}</span
                        >
                      </div>
                      <div class="col-md-4">
                        <span
                          ><strong>NIT: </strong>{{ empresaExterna.nit }}</span
                        >
                      </div>
                      <div class="col-md-4">
                        <span
                          ><strong>PATENTE: </strong
                          >{{ empresaExterna.patente }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />

            <!-- REPRESENTANTES -->
            <div class="row">
              <div class="col-md-12">
                <div class="card">
                  <div class="card-body">
                    <h3><strong>REPRESENTANTES</strong></h3>
                    <br />
                    <div
                      v-for="(x, i) in representantesExternos"
                      :key="i"
                      class="row"
                    >
                      <div class="col-md-4">
                        <span><strong>DPI: </strong>{{ x.dpi }}</span>
                      </div>
                      <div class="col-md-4">
                        <span
                          ><strong>NOMBRE: </strong>{{ x.razon_social }}</span
                        >
                      </div>
                      <div class="col-md-4">
                        <span
                          ><strong>REPRESENTACION: </strong
                          >{{ x.representacion.descripcion }}</span
                        >
                      </div>
                      <br /><br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />

            <!-- PREVIA DOCUMENTO -->
            <div class="row" v-if="showExterno">
              <div class="col-md-12">
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-12">
                        <h3>
                          {{ nombreDocumentoExterno }}
                          <button
                            class="btn btn-danger btn-circle"
                            @click="
                              (srcExterno = null),
                                (showExterno = false),
                                (nombreDocumentoExterno = '')
                            "
                          >
                            <i class="fa fa-close"></i>
                          </button>
                        </h3>
                      </div>
                    </div>
                    <embed
                      :src="srcExterno"
                      type="application/pdf"
                      width="100%"
                      height="80%"
                    />
                  </div>
                </div>
              </div>
            </div>
            <br />

            <!-- REQUISITOS -->
            <div class="row">
              <div class="col-md-12">
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <h3><strong>REQUISITOS</strong></h3>
                      <div class="col-sm-12 col-ms-12 col-lg-12">
                        <b-table
                          class="text-center"
                          ref="selectableTable"
                          responsive
                          hover
                          small
                          flex
                          stacked="md"
                          :fields="titulosExterna"
                          :items="requisitosSubidos"
                          :filter="search"
                          :current-page="currentPage"
                          :per-page="perPage"
                          @filtered="onFiltered"
                        >
                          <template slot="requisito.nombre" slot-scope="data">
                            <span
                              ><strong>{{
                                data.item.requisito.nombre
                              }}</strong></span
                            >
                          </template>
                          <template slot="observacion" slot-scope="data">
                            <textarea
                              v-model="data.item.observacion"
                              type="text"
                              class="form-control"
                              id="observacion"
                              placeholder="Escri"
                              name="observacion"
                              v-validate="'required|min:1|max:100'"
                              :class="{
                                input: true,
                                'has-errors': errors.has('observacion'),
                              }"
                              @input="
                                data.item.observacion =
                                  $event.target.value.toUpperCase()
                              "
                            />
                          </template>
                          <template slot="aprobar" slot-scope="data">
                            <div class="custom-radios">
                              <input
                                @click="aprobar(data.item)"
                                type="radio"
                                id="1"
                                class="verde"
                                :name="'req-' + data.item.id"
                              />
                              <label for="1">
                                <span>
                                  <img
                                    src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg"
                                    alt="Checked Icon"
                                  />
                                </span>
                              </label>
                            </div>
                            <!-- <span><strong>{{ data.item.nombre }}</strong></span> -->
                          </template>
                          <template slot="denegar" slot-scope="data">
                            <div class="custom-radios">
                              <input
                                type="radio"
                                @click="denegar(data.item)"
                                id="2"
                                class="rojo"
                                :name="'req-' + data.item.id"
                              />
                              <label for="2">
                                <span>
                                  <img
                                    src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg"
                                    alt="Checked Icon"
                                  />
                                </span>
                              </label>
                            </div>
                            <!-- <span><strong>{{ data.item.nombre }}</strong></span> -->
                          </template>
                          <template slot="ver" slot-scope="data">
                            <button
                              class="btn btn-info btn-circle-md"
                              @click="verDocumentoExterno(data.item)"
                            >
                              <i class="fa fa-file"></i>
                            </button>
                          </template>
                        </b-table>
                      </div>
                      <div class="col-sm-12 col-md-12 col-lg-12">
                        <label v-if="totalRowsExterna > 0"
                          >Total: {{ totalRowsExterna }} registros en el
                          sistema.</label
                        >
                        <div class="text-center">
                          <label v-if="totalRowsExterna === 0"
                            >No hay registros que mostrar</label
                          >
                        </div>
                      </div>
                      <div class="col-sm-12 col-md-12 col-lg-12">
                        <label class="pull-right"
                          ><b-pagination
                            :total-rows="totalRowsExterna"
                            :per-page="perPageExterna"
                            v-model="currentPageExterna"
                            class="my-0 text-center"
                        /></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />

            <!-- OBSERVACION -->
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12">
                <div class="card">
                  <div class="card-body">
                    <div class="form-group">
                      <label for="observacion">Observación</label>
                      <textarea
                        v-model="formExterno.observacion"
                        class="form-control"
                        id="observacion"
                        placeholder="escribir la observación del expediente"
                        name="observación"
                        v-validate="'max:250'"
                        :class="{
                          input: true,
                          'has-errors': errors.has('validar.observación'),
                        }"
                        @input="
                          formExterno.observacion =
                            $event.target.value.toUpperCase()
                        "
                      ></textarea>
                      <FormError
                        :attribute_name="'validar.observación'"
                        :errors_form="errors"
                      ></FormError>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />

            <button
              type="button"
              class="btn btn-success btn-block btn-md pull-right"
            >
              GUARDAR</button
            ><br /><br />
          </div>
        </div>
      </div>
    </div>
    <!-- Modal para mostrar los requisistos faltantes -->
    <div
      :class="abrirModalRequisitos"
      data-backdrop="static"
      v-bind:style="styleObjectRequisitos"
      v-loading="loading"
    >
      <div class="modal-dialog modal-lg" style="width: 80%; height: 60%">
        <div class="modal-content">
          <div class="modal-header">
            <!-- <h2 v-if="completo === false" class="modal-title">
                Requisitos faltantes para la actuación {{ barcode }}
                <button
                  type="button"
                  @click="cancel_showRequisitos"
                  class="btn btn-danger btn-xs pull-right"
                >
                  <i class="fa fa-close"></i>
                </button>
              </h2>
              <h2 v-else class="modal-title">
                Agregar documentos a la actuación {{ barcode }}
                <button
                  type="button"
                  @click="cancel_showRequisitos"
                  class="btn btn-danger btn-xs pull-right"
                >
                  <i class="fa fa-close"></i>
                </button>
              </h2> -->

            <h2 v-if="completo === true || opcion === 5" class="modal-title">
              Agregar documentos a la actuación {{ barcode }}
              <button
                type="button"
                @click="cancel_showRequisitos"
                class="btn btn-danger btn-xs pull-right"
              >
                <i class="fa fa-close"></i>
              </button>
            </h2>

            <h2 v-else class="modal-title">
              Requisitos faltantes para la actuación {{ barcode }}
              <button
                type="button"
                @click="cancel_showRequisitos"
                class="btn btn-danger btn-xs pull-right"
              >
                <i class="fa fa-close"></i>
              </button>
            </h2>
          </div>
          <div
            class="modal-body text-center"
            style="overflow-y: auto; height: 100%"
            v-if="modalRequisitos"
          >
            <h3 v-if="completo === false && opcion !== 5" class="text-center">
              REQUISITOS PARA EL TRÁMITE <br />
            </h3>
            <br /><br />
            <div>
              <!-- <button
                v-if="completo === false"
                type="button"
                class="btn btn-primary btn-block btn-lg pull-right mx-3 px-3"
                @click="updateRequisitos"
              >
                <i class="fa fa-save"></i> Actualizar requisitos
              </button>
              <button
                v-else
                type="button"
                class="btn btn-primary btn-block btn-lg pull-right mx-3 px-3"
                @click="updateRequisitos"
              >
                <i class="fa fa-save"></i> Agregar documento
              </button> -->
              <div class="row" v-if="loadingtabla">
                <div class="col-md-12 text-center">
                  <span
                    >Guardando archivos ...
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
            </div>
            <documentos
              :documentos="requisitos"
              :documentosGuardar="forms.requisitos"
              :folios_correcion="form.folios_correcion"
              :botones="true"
            />
          </div>

          <div class="modal-footer">
            <button
              v-if="completo === false"
              type="button"
              class="btn btn-primary btn-block btn-lg pull-right"
              @click="updateRequisitos"
            >
              <i class="fa fa-save"></i> Actualizar requisitos
            </button>
            <button
              v-else
              type="button"
              class="btn btn-primary btn-block btn-lg pull-right"
              @click="updateRequisitos"
            >
              <i class="fa fa-save"></i> Agregar documento
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script src="./tabla_mis_expedientes.js"/>

<style lang="scss"  scoped>
@import "../../../dist/css/desing_profile/diseno.css";

.carta {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.2);
}

.carta_content {
  height: auto;
  justify-content: center;
  padding: 10px;
}

.btn-purple {
  background-color: #9b3bf5;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.2);
  width: auto;
}
.card-body-title {
  height: auto;
  justify-content: center;
  padding: 2.5%;
}

.card-body {
  height: auto;
  justify-content: center;
  padding: 20px;
}

input[type="radio"] {
  // Colors
  $verde: #2ecc71;
  $rojo: #e74c3c;

  display: none;

  + label {
    color: #333;
    font-family: Arial, sans-serif;
    font-size: 14px;

    span {
      display: inline-block;
      width: 40px;
      height: 40px;
      margin: -1px 4px 0 0;
      vertical-align: middle;
      cursor: pointer;
      border-radius: 50%;
      border: 2px solid #ffffff;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.33);
      background-repeat: no-repeat;
      background-position: center;
      text-align: center;
      line-height: 44px;

      img {
        margin: 10px;
        opacity: 0;
        transition: all 0.3s ease;
      }
    }
  }

  //

  &.verde:checked + label span {
    background-color: $verde;
    transform: scale(1.1);
    box-shadow: 0 0 20px 5px $verde;
  }

  &.verde:hover + label span {
    background-color: $verde;
    transform: scale(1.1);
    box-shadow: 0 0 20px 5px $verde;
  }

  &.verde + label span {
    background-color: $verde;
  }

  //

  &.rojo:checked + label span {
    background-color: $rojo;
    transform: scale(1.1);
    box-shadow: 0 0 20px 5px $rojo;
  }

  &.rojo:hover + label span {
    background-color: $rojo;
    transform: scale(1.1);
    box-shadow: 0 0 20px 5px $rojo;
  }

  &.rojo + label span {
    background-color: $rojo;
  }

  &:checked + label span img {
    opacity: 1;
    transform: scale(1.1);
  }
}

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

.modal-content  {
    -webkit-border-radius: 0px !important;
    -moz-border-radius: 0px !important;
    border-radius: 10px !important; 
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

