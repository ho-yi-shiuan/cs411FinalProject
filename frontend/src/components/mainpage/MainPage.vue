<template>
  <v-card
    class="mx-auto MainBackground"
  >
    <SearchBar style="width: 100%;"/>
    <v-container style="padding:0px 12px;">
      <v-row dense class="d-flex flex-row justify-space-between">
        <v-card
            v-for="(item, i) in items"
            :key="i"
            cols="12"
            class="MainPageCard"
        >
            <div class="d-flex" style="padding: 10px;">
                <div style="width:100%">
                    <v-img :src="item.src" class="MainPageItemImage"></v-img>
                    <v-card-title
                        class="text-h5"
                        v-text="item.title"
                    ></v-card-title>

                    <v-card-subtitle v-text="item.artist"></v-card-subtitle>

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
  </v-card>
</template>
<script>
import SearchBar from "./SearchBar.vue"
export default {
    name: 'MainPage',
    components: {
        SearchBar,
    },
    data: () => ({
      items: [
        {
          color: '#1F7087',
          src: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          title: 'breed',
          artist: 'size',
        },
        {
          color: '#952175',
          src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
          title: 'breed',
          artist: 'size',
        },
        {
          color: '#1F7087',
          src: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          title: 'breed',
          artist: 'size',
        },
        {
          color: '#952175',
          src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
          title: 'breed',
          artist: 'size',
        }
      ]
    })
}
</script>
<style>
.MainBackground {
    background-color:rgba（255,255,255,0.2);
    margin: 20px 0px;
    padding: 20px 40px 10px 40px;
    width: 70%;
}
.MainPageCard {
    width: 30%;
    margin: 20px 5px;
}
.MainPageItemImage {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
}
</style>