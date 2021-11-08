<template>
  <BackgroundCard>
    <SearchBar v-on:search="ShowSearchResult" v-on:searchBarErr="SearchErr" style="width: 100%;"/>
    <v-container style="padding:0px 12px;">
      <v-row style="margin-top:10px;">
        <v-alert
          v-show="show"
          dense
          border="left"
          type="warning"
          style="margin-top:10px; width:100%;"
        >
          Error in showing data, please try later
        </v-alert>
      </v-row>   
      <v-row dense class="d-flex flex-row justify-space-between">
        <v-card
            v-for="item in items"
            :key=item.pet_id
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
        items:[],
        show: false,
        
      }
    },
    mounted() {
      apiGetPet()
        .then(res => {
          if(res.status == 200){
            this.items = res.data.data;
          }
        })
        .catch(err => {
            this.show = true;
            console.log(err);
        });
    },
    methods: {
      ShowSearchResult: function ShowSearchResult(pet){
        this.items = pet;
      },
      SearchErr: function SearchErr(err){
        this.items = [];
        this.show = true;
        console.log(err);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
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