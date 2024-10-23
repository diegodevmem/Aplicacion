<template>
  <section class="content">
    <div class="row">
      <div class="col-md-12">
        <div class="box box-danger">
          <div class="box-header with-border">
            <h1 class="box-title">
              <i class="fa fa-plus-square-o"></i> ACCESO DENEGADO
            </h1>
          </div>

          <div class="box-body">
            <div>
              <h2 class="text"><strong>LO SENTIMOS...</strong></h2>
              <h2 class="text"><strong>NO CUENTAS CON EL ACCESO A ESTE MENÚ.</strong></h2>
              <img class="image" :src="require('../../assets/restringido.svg')">
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Rechazado",
  data() {
    return {

    }
  }

}
</script>

<style>
  .text{
    text-align: center;
    padding: 0px;
  }

  .image{
    display: block;
    margin: auto;
    align-items: center;
    padding-bottom: 20px;
    padding-top: 20px;
  }
</style>
