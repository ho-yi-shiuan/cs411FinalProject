<template>
    <v-card
    color="grey lighten-4"
    flat
    tile
    >
        <v-toolbar dense style="padding: 0px 10px 0px 20px;">
            <v-text-field
                v-model="SearchText"
                hide-details
                single-line
            ></v-text-field>
            <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-card-actions>
                <v-btn
                    icon
                    @click="show = !show"
                >
                    <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
            </v-card-actions>
        </v-toolbar>
        <v-expand-transition>
            <div v-show="show">
                <v-divider></v-divider>

                <v-card-text>
                I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.
                </v-card-text>
            </div>
        </v-expand-transition>
    </v-card>
</template>

<script>
export default {
    name: 'SearchBar',
    data: () => ({
      show: false,
      SearchText: "Search by pet's name"
    }),
}
</script>