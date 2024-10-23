<template>
  <v-app>
    <!-- <v-carousel
      class="position:relative"
      cycle
      height="100vh"
      :show-arrows="false"
      :hide-delimiters="true"
      :hide-delimiter-background="true"
    >
      <v-carousel-item
        v-for="(item, i) in items"
        :key="i"
        :src="item.src"
      ></v-carousel-item>
    </v-carousel> -->
    <v-img :src="logo_back" style="position: relative; height: 100vh;" >

    </v-img>

    <v-container class="fill-height" fluid style="position: absolute">
      <v-row align="center" justify="center">
        <v-col cols="12" xs="4" sm="4" md="4" lg="3">
          <v-card
            class="elevation-12"
            id="fondo"
            style="border-radius: 30px; opacity: 0.9"
          >
            <v-window>
              <v-window-item>
                <v-row>
                  <!-- INICIO DE SESIÓN -->
                  <v-col cols="12" lg="12" md="12" sm="12">
                    <v-card-text>
                      <v-img
                        src="https://servicios.mem.gob.gt/api/imagenes/imagenes_externo/logoMEM.webp"
                        class="animated pulse"
                        contain
                        max-height="150"
                      ></v-img>
                      <h3 class="text-center" style="font-weight: bold;">SISTEMA DE EXPEDIENTES</h3>
                      <v-form v-model="valid" ref="form">
                        <v-text-field
                          label="CUI"
                          append-icon="pin"
                          maxlength="13"
                          v-model="credentials.cui"
                          :rules="[
                            (value) => !!value || 'El CUI es requerido.',
                          ]"
                        ></v-text-field>

                        <v-text-field
                          :append-icon="show1 ? 'visibility' : 'visibility_off'"
                          :rules="[
                            (value) => !!value || 'La contraseña es requerida.',
                          ]"
                          :type="show1 ? 'text' : 'password'"
                          name="input-10-1"
                          label="Contraseña"
                          counter
                          @click:append="show1 = !show1"
                          @keydown="checkCapsLock"
                          v-model="credentials.password"
                          @keydown.enter="login()"
                        ></v-text-field>
                        <!-- v-on:keyup.enter.native="login" -->
                        <br />
                        <div class="text-center m-0 p-0">
                          <v-btn
                            rounded
                            color="light-blue accent-4"
                            :loading="loading"
                            dark
                            @click="login()"
                            >Iniciar Sesión</v-btn
                          >
                        </div>
                      </v-form>
                      <span v-if="isUpper" class="text-danger">
                        advertencia!! mayúsculas activadas</span
                      >

                      <br />
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-window-item>
            </v-window>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- </div> -->
  </v-app>
</template>

<script src="./Login.js">
</script>

