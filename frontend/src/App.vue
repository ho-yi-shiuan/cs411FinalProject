<template>
  <v-app>
    <v-footer
      dark
      padless
      class="brown lighten-3"
    >
      <v-card
        class="flex brown lighten-3"
        flat
        tile
      >
        <v-card-title class="brown darken-2">
          <img src="../public/cat-face.png" style="height:30px" /><strong class="subheading" style="margin-left:5px">Where's Brownie?</strong>
          <v-spacer></v-spacer>

          <v-btn
            v-for="icon in icons"
            :key="icon"
            :to="iconLink"
            class="mx-4"
            dark
            icon
          >
            <v-icon size="30px" style="margin:0;">
              {{ icon }}
            </v-icon>
          </v-btn>
        </v-card-title>
      </v-card>
    </v-footer>
    <router-view/>
  </v-app>
</template>

<script>
//import MainPage from './components/mainpage/MainPage.vue';
import {
  mdiAccount,
  mdiPlusCircleOutline ,
  mdiHome
} from '@mdi/js'

export default {
  name: 'App',

  components: {
    //MainPage,
  },

    data: () => ({
      icons: [
        mdiHome ,
        mdiPlusCircleOutline ,
        mdiAccount,
      ],
      link: [
        "/",
        "/upload",
        "/profile"
      ]
    }),
};
</script>

<style>
#app {
  background: #FFF3E0;
}
</style>