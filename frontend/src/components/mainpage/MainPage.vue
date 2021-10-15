<template>
  <BackgroundCard>
    <SearchBar v-on:search="ShowSearchResult" style="width: 100%;"/>
    <v-container style="padding:0px 12px;">
      <v-row dense class="d-flex flex-row justify-space-between">
        <v-card
            v-for="item in items"
            :key=item.petID
            cols="12"
            class="MainPageCard"
        >
            <div class="d-flex" style="padding: 10px;">
                <div style="width:100%">
                  <div class="imgContainer">
                    <v-img :src="item.picture" class="MainPageItemImage"></v-img>
                  </div>
                  <v-card-title
                      class="text-h5"
                      v-text="item.color"
                  ></v-card-title>
                  <v-card-subtitle v-text="item.size"></v-card-subtitle>
                  <v-card-subtitle v-text="item.city + ', ' +item.state"></v-card-subtitle>
                  <v-card-actions>
                      <v-btn
                      class="ml-2 mt-5"
                      outlined
                      rounded
                      small
                      >
                      See more
                      </v-btn>
                  </v-card-actions>
                </div>
            </div>
        </v-card>
      </v-row>
    </v-container>
  </BackgroundCard>
</template>
<script>
import SearchBar from "./SearchBar.vue"
import BackgroundCard from '../card/BackgroundCard.vue'
import {apiGetPet} from "../../requests/api"

export default {
    name: 'MainPage',
    components: {
        SearchBar,
        BackgroundCard
    },
    data() {
      return {
        items:[]
      }
    },
    mounted() {
      apiGetPet()
        .then(res => {
          this.items = res.data;
        })
        .catch(err => {
          console.log(err);
        });    
    },
    methods: {
      ShowSearchResult: function ShowSearchResult(pet){
        this.items = pet;
      }
    }
}
</script>
<style>
.MainPageCard {
    width: 30%;
    margin: 20px 5px;
}

.imgContainer{
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
}

.MainPageItemImage {
  position: absolute;
  object-fit: cover;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>