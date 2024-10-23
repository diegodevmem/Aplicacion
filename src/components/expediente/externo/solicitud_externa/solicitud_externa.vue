<template>
  <div class="content-wrapper">
    <!-- <rechazado v-if="false"></rechazado> -->
    <v-app>
      <section class="content-header">
        <h1 class="label bg-primary">
          Solicitudes Externas
          <small style="color: white">Sistema de Expedientes</small>
        </h1>
      </section>
      <br />
      <v-container>
        <div class="row">
          <div class="col-md-6"></div>
          <div class="col-md-6">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              clearable
            ></v-text-field>
          </div>
        </div>

        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :items="filas"
          :loading="loading"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:[`item.opcion`]="{ item }">
            <v-btn color="primary" fab small class="mr-2" @click="verSolicitudesExternas(item)">
              <v-icon> preview </v-icon>
            </v-btn>
       
          </template>
        </v-data-table>
      </v-container>
    </v-app>
  </div>
</template>

<script src="./solicitud_externa.js">
</script>

