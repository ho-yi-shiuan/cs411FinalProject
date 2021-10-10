<template>
    <v-card color="grey lighten-4" flat tile>
        <v-toolbar dense style="padding: 0px 10px 0px 20px;">
            <v-text-field v-model="SearchText" hide-details single-line></v-text-field>
            <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-card-actions>
                <v-btn icon @click="show = !show">
                    <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
            </v-card-actions>
        </v-toolbar>
        <v-expand-transition>
            <div v-show="show">
                <v-container fluid style="padding: 20px 12px;" class="SearchCheckBoxContainer">
                    <v-row class="ma-0">
                    <v-col><div class="SelectTitle">Type of post:</div></v-col>
                    <v-col><v-radio-group mandatory v-model="selectedFormType" row>
                    <v-radio label="lost" value="lost" color="lime darken-3" class="SearchBarCheckBox ma-0"></v-radio>
                    <v-radio label="found" value="found" color="lime darken-3" class="SearchBarCheckBox ma-0"></v-radio>
                    </v-radio-group></v-col>
                    </v-row>                   
                    <v-row class="ma-0">
                    <v-col><div class="SelectTitle">Type:</div></v-col>
                    <v-col><v-radio-group mandatory v-model="selectedType" row>
                    <v-radio label="dog" value="dog" @click="dog=true; cat=false;" color="lime darken-3" class="SearchBarCheckBox ma-0"></v-radio>
                    <v-radio label="cat" value="cat" @click="cat=true; dog=false;" color="lime darken-3" class="SearchBarCheckBox ma-0"></v-radio>
                    </v-radio-group></v-col>
                    </v-row>
                    <v-expand-transition>
                        <v-row class="ma-0" v-show="dog">
                            <v-col><div class="SelectTitle">Breed:</div></v-col>
                            <v-col>
                            <v-checkbox v-model="selectedBreed" color="lime darken-3" class="SearchBarCheckBox ma-0" v-for="breed in breedDog" :key="breed.value" :label="breed.text" :value="breed.value"></v-checkbox>
                            </v-col>
                        </v-row>
                    </v-expand-transition>
                    <v-expand-transition>
                        <v-row class="ma-0" v-show="cat">
                            <v-col><div class="SelectTitle">Breed:</div></v-col>
                            <v-col>
                            <v-checkbox v-model="selectedBreed" color="lime darken-3" class="SearchBarCheckBox ma-0" v-for="breed in breedCat" :key="breed.value" :label="breed.text" :value="breed.value"></v-checkbox>
                            </v-col>
                        </v-row>
                    </v-expand-transition>
                    <v-row class="ma-0">
                        <v-col><div class="SelectTitle">Gender:</div></v-col>
                        <v-col><v-checkbox v-model="selectedGender" label="female" value="female" color="lime darken-3" class="SearchBarCheckBox ma-0"></v-checkbox></v-col>
                        <v-col><v-checkbox v-model="selectedGender" label="male" value="male" color="lime darken-3" class="SearchBarCheckBox ma-0"></v-checkbox></v-col>
                    </v-row>
                </v-container>
            </div>
        </v-expand-transition>
    </v-card>
</template>

<script>
    import {apiGetUploadForm} from "../../requests/api"
    export default {
        name: 'SearchBar',
        mounted() {
        apiGetUploadForm()
            .then(res => {
            this.healthIssue = res.data.healthCondition;
            this.breedCat = res.data.breed.cat;
            this.breedDog = res.data.breed.dog;
            })
            .catch(err => {
            console.log(err);
            });    
        },
        data: () => ({
        show: false,
        SearchText: "Search by zip code",
        selectedFormType: null,
        selectedType: null,
        selectedBreed: null,
        selectGender: null,
        healthIssue: [],
        dog: true,
        cat: false,
        breedDog:[],
        breedCat:[],
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        menu: false,
        sizes: ["small","meduim","large"],
        colors: ["white","black","brown","orange","grey"],
        checkbox: null,
        }),
    }
</script>

<style>
.SearchBarCheckBox {
    margin:0px 5px 0px 0px;
}

.SelectTitle {
    margin:0px 5px 16px 24px;
    padding-top:4px;
}

.SearchCheckBoxContainer .row .col {
    padding: 0px;
    width: 20px;
    justify-content: start;
}

.SearchCheckBoxContainer .row {
    justify-content: start;
}

</style>