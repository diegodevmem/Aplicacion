<template>
  <div class="content-wrapper">
    <v-app>
      <v-container>
        <!-- TITULO -->
        <v-alert
          class="text-center"
          shaped
          dense
          dark
          color="#1C658C"
          elevation="20"
        >
          <span >
           
               CARGA MASIVA DE RECONTRATACIONES 
           
          </span>

        </v-alert>

 



          <!-- CONTENIDO -->
   
              <div class="row">
                <div class="col-md-12">
                  <div class="container-fluid">
                    <div class="card m-1 p-2">
                      <Attachment
                        @archivo="archivos"
                        @registro="facturasEmit"
                        :tipo="1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div v-for="(x, i) in facturas" :key="'A' + i">
                <div v-if="x.registros.length > 0" class="row">
                  <div class="col-md-12">
                    <div class="container-fluid">
                      <div class="card m-1 p-4">
                        <!-- <pre>{{ facturas[i].archivo.name }}</pre> -->
                        <h3 class="text-center">
                          {{ x.archivo.name }}
                          <v-btn
                            @click="eliminarFactura(i)"
                            class="mx-2"
                            fab
                            dark
                            small
                            color="red"
                          >
                            <v-icon dark> delete </v-icon>
                          </v-btn>
                        </h3>
                        <v-text-field
                          class="mt-0 mb-5 p-0"
                          v-model="search1"
                          append-icon="mdi-magnify"
                          label="Buscar..."
                          single-line
                          hide-details
                        ></v-text-field>
                        <v-data-table
                          :loading="loading"
                          :headers="headers2"
                          :items="x.registros"
                          :items-per-page="-1"
                          :search="search1"
                          :footer-props="{
                            showFirstLastPage: true,
                            'page-text': '{0}-{1} de {2} fila(s)',
                            'items-per-page-text': 'registros por página',
                          }"
                          class="elevation-1"
                        >
                        </v-data-table>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
         
         
   
      </v-container>
      <!-- <pre>{{ retenciones }}</pre> -->
    </v-app>
  </div>
</template>
<script src="./carga_masiva.js"></script>
<style src="./carga_masiva.scss" lang="scss" scoped></style>