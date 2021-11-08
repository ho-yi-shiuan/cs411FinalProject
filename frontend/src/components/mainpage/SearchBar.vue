<template>
    <v-card color="grey lighten-4" flat tile>
        <v-form @submit.prevent="submit" ref="form">
            <v-toolbar dense style="padding: 0px 10px 0px 20px;">
                <v-text-field v-model="zip_code" color="lime darken-3" label="Search by zip_code" hide-details single-line></v-text-field>
                <v-btn type="submit" icon>
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
                        <v-col><v-select
                            v-model="selectedFormType"
                            color="lime darken-3"
                            item-color="lime darken-3"
                            :items="FormType"
                            label="Type of post"
                            multiple
                        ></v-select></v-col>
                        </v-row>
                        <v-row class="ma-0">
                        <v-col><div class="SelectTitle">Type:</div></v-col>
                        <v-col><v-checkbox v-model="selectedType" label="dog" @click="dog=true; cat=false;" value="dog" color="lime darken-3" class="SearchBarCheckBox ma-0"></v-checkbox></v-col>
                        <v-col><v-checkbox v-model="selectedType" label="cat" @click="cat=true; dog=false;" value="cat" color="lime darken-3" class="SearchBarCheckBox ma-0"></v-checkbox></v-col>
                        </v-row>
                        <v-expand-transition>
                            <v-row class="ma-0" v-show="dog">
                                <v-col><div class="SelectTitle">Breed:</div></v-col>
                                <v-col>
                                <v-checkbox v-model="selectedBreed" color="lime darken-3" item-color="lime darken-3" class="SearchBarCheckBox ma-0" v-for="breed in breedDog" :key="breed.value" :label="breed.text" :value="breed.value"></v-checkbox>
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
                    <v-row class="ma-0">
                        <v-col><div class="SelectTitle">Date:</div></v-col>
                        <v-col><v-menu
                            ref="menu"
                            v-model="menu"
                            color="lime darken-3"
                            :close-on-content-click="false"
                            :return-value.sync="date"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                            <template v-slot:activator="{ on }">
                            <v-text-field
                                v-model="dateStart"
                                label="Start date"
                                color="lime darken-3"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-on="on"
                            ></v-text-field>
                            </template>
                            <v-date-picker
                            v-model="dateStart"
                            color="lime darken-3"
                            no-title
                            scrollable
                            >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="lime darken-3"
                                @click="menu = false"
                            >
                                Cancel
                            </v-btn>
                            <v-btn
                                text
                                color="lime darken-3"
                                @click="$refs.menu.save(date)"
                            >
                                OK
                            </v-btn>
                            </v-date-picker>
                        </v-menu></v-col>
                        <v-col><v-menu
                            ref="menu"
                            v-model="menu"
                            color="lime darken-3"
                            :close-on-content-click="false"
                            :return-value.sync="date"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                            <template v-slot:activator="{ on }">
                            <v-text-field
                                v-model="dateEnd"
                                label="End date"
                                color="lime darken-3"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-on="on"
                            ></v-text-field>
                            </template>
                            <v-date-picker
                            v-model="dateEnd"
                            color="lime darken-3"
                            no-title
                            scrollable
                            >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="lime darken-3"
                                @click="menu = false"
                            >
                                Cancel
                            </v-btn>
                            <v-btn
                                text
                                color="lime darken-3"
                                @click="$refs.menu.save(date)"
                            >
                                OK
                            </v-btn>
                            </v-date-picker>
                        </v-menu></v-col>
                    </v-row>
                    <v-row class="ma-0">
                        <v-col><div class="SelectTitle">Size:</div></v-col>
                        <v-col><v-select
                            v-model="selectSize"
                            color="lime darken-3"
                            item-color="lime darken-3"
                            :items="sizes"
                            label="Size"
                            multiple
                        ></v-select></v-col>                    
                    </v-row>
                    <v-row class="ma-0">
                        <v-col><div class="SelectTitle">Color:</div></v-col>
                        <v-col><v-select
                            v-model="selectColor"
                            :items="colors"
                            label="Color"
                            color="lime darken-3"
                            item-color="lime darken-3"
                            multiple
                        ></v-select></v-col>
                    </v-row>
                    <v-row class="ma-0">
                        <v-col><div class="SelectTitle">Chipped</div></v-col>
                        <v-col><v-select
                            v-model="selectHealth"
                            :items="healthIssue"
                            label="Health Issue"
                            color="lime darken-3"
                            item-color="lime darken-3"
                            multiple
                        ></v-select></v-col>
                    </v-row>
                    <v-row class="ma-0">
                        <v-col><div class="SelectTitle">Chipped</div></v-col>
                        <v-col><v-checkbox
                            v-model="checkbox"
                            color="lime darken-3"
                            value="1"
                            type="checkbox"
                        ></v-checkbox></v-col>
                    </v-row>
                    </v-container>
                </div>
            </v-expand-transition>
        </v-form>
    </v-card>
</template>

<script>
    import {apiSearchPet,apiGetUploadForm} from "../../requests/api"
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
            zip_code: null,
            selectedFormType: null,
            FormType:["lost","found"],
            selectedType: null,
            selectedBreed: null,
            selectedGender: null,
            healthIssue: [],
            lost: false,
            found: false,
            dog: false,
            cat: false,
            breedDog:[],
            breedCat:[],
            dateStart: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            dateEnd: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            menu: false,
            sizes: ["small","meduim","large"],
            colors: ["white","black","brown","orange","grey"],
            selectColor: null,
            selectSize: null,
            selectHealth: null,
            checkbox: null,
            SelectedPet:null,
        }),
        methods:{
            submit (){
                let searchContent = {
                    "zip_code": this.zip_code,
                    "status": this.selectedFormType,
                    "dateStart": this.dateStart,
                    "dateEnd": this.dateEnd,
                    "breed": this.selectedBreed,
                    "category": this.selectedType,
                    "color": this.selectColor,
                    "size": this.selectSize,
                    "gender": this.selectedGender,
                    "health_issue": this.selectHealth,
                    "checkbox": this.checkbox
                }
                apiSearchPet(searchContent)
                .then(res => {
                    if(res.status == 200){
                        this.$emit("search" ,res.data);
                        this.show = false;
                    }
                })
                .catch(err => {
                    console.log("err");
                    this.$emit("searchBarErr", err);
                    this.show = false;
                });  
            }
        }
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