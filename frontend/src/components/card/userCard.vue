<template>
    <v-card
        class="mx-auto MainBackground"
    >
    <slot></slot>
    </v-card>
</template>

<script>
  export default {
    name: 'BackgroundCard'
  }
</script>

<style>
    .MainBackground {
        background-color:rgba（255,255,255,0.2);
        margin: 20px 0px;
        padding: 20px 40px 10px 40px;
        width: 70%;
    }
</style>