<template>
  <BackgroundCard>
      <v-form class="uploadForm" @submit.prevent="submit" ref="form" lazy-validation>
      <validation-observer
        ref="observer"
        v-slot="{ invalid }"
      >
        <p class="headline">Upload record for lost/found pet</p>
        <v-row>
          <v-col><div class="FormSelectTitle">Type of upload:</div></v-col>
          <v-col><v-radio-group mandatory v-model="selectedFormType" row>
          <v-radio label="lost" value="lost" color="lime darken-3" class="SearchBarCheckBox ma-0"></v-radio>
          <v-radio label="found" value="found" color="lime darken-3" class="SearchBarCheckBox ma-0"></v-radio>
          </v-radio-group></v-col>
        </v-row>        
        <validation-provider
          v-slot="{ errors }"
          name="Name"
        >
          <v-text-field
            v-model="name"
            :error-messages="errors"
            label="Name of pet(if know)"
            color="lime darken-3"
          ></v-text-field>
        </validation-provider>
        <v-row>
          <v-col><div class="FormSelectTitle">Type:</div></v-col>
          <v-col><v-radio-group mandatory v-model="selectedType" row>
          <v-radio label="dog" value="dog" @click="dog=true; cat=false;" color="lime darken-3" class="SearchBarCheckBox ma-0"></v-radio>
          <v-radio label="cat" value="cat" @click="cat=true; dog=false;" color="lime darken-3" class="SearchBarCheckBox ma-0"></v-radio>
          </v-radio-group></v-col>
        </v-row>
        <v-expand-transition>
            <v-row v-show="dog">
                <v-col><div class="FormSelectTitle">Breed:</div></v-col>
                <v-col>
                  <v-checkbox v-model="selectedBreed" color="lime darken-3" class="SearchBarCheckBox ma-0" v-for="breed in breedDog" :key="breed.value" :label="breed.text" :value="breed.value"></v-checkbox>
                </v-col>
            </v-row>
        </v-expand-transition>
        <v-expand-transition>
            <v-row v-show="cat">
                <v-col><div class="FormSelectTitle">Breed:</div></v-col>
                <v-col>
                  <v-checkbox v-model="selectedBreed" color="lime darken-3" class="SearchBarCheckBox ma-0" v-for="breed in breedCat" :key="breed.value" :label="breed.text" :value="breed.value"></v-checkbox>
                </v-col>
            </v-row>
        </v-expand-transition>
        <v-row>
            <v-col><div class="FormSelectTitle">Gender:</div></v-col>
            <v-col><v-checkbox v-model="selectGender" label="female" value="female" color="lime darken-3" class="SearchBarCheckBox ma-0"></v-checkbox></v-col>
            <v-col><v-checkbox v-model="selectGender" label="male" value="male" color="lime darken-3" class="SearchBarCheckBox ma-0"></v-checkbox></v-col>
        </v-row>
        <validation-provider
          v-slot="{ errors }"
          rules="required"
          name="day"
        >
          <v-menu
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
                v-model="date"
                :error-messages="errors"
                label="Date of find/lost"
                color="lime darken-3"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
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
          </v-menu>
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="zip_code"
          rules="required"
        >
          <v-text-field
            v-model="zip_code"
            :error-messages="errors"
            label="zip_code (required)"
            color="lime darken-3"
          ></v-text-field>
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="age"
        >
          <v-text-field
            v-model="age"
            :error-messages="errors"
            label="age"
            color="lime darken-3"
          ></v-text-field>
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="selectHealth"
        >
          <v-select
            v-model="selectHealth"
            :items="healthIssue"
            :error-messages="errors"
            label="Health Issue"
            color="lime darken-3"
            item-color="lime darken-3"
            multiple
          ></v-select>
        </validation-provider>

        <validation-provider
          v-slot="{ errors }"
          name="selectSize"
          rules="required"
        >
          <v-select
            v-model="selectSize"
            :items="sizes"
            :error-messages="errors"
            label="Size (required)"
            color="lime darken-3"
            item-color="lime darken-3"
          ></v-select>
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="selectColor"
          rules="required"
        >
          <v-select
            v-model="selectColor"
            :items="colors"
            :error-messages="errors"
            label="Color (required)"
            color="lime darken-3"
            item-color="lime darken-3"
            multiple
          ></v-select>
        </validation-provider>

        <validation-provider
          v-slot="{ errors }"
          name="file"
          rules="required"
        >
          <v-file-input
            accept="image/*"
            label="Upload picture of pet (required)"
            color="lime darken-3"
            :error-messages="errors"
            v-model="picture"
          ></v-file-input>
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="checkbox"
        >
          <v-row>
          <v-col><div class="FormSelectTitle">Chipped</div></v-col>
          <v-checkbox
            v-model="checkbox"
            color="lime darken-3"
            :error-messages="errors"
            value="1"
            type="checkbox"
          ></v-checkbox>
          </v-row>
        </validation-provider>
        <v-row>
          <v-alert
            v-show="show"
            dense
            border="left"
            type="warning"
            style="margin-top:10px; width:100%;"
          >
            Error in uploading, please try later
          </v-alert>
        </v-row>  
        <v-row justify="center">
          <v-btn class="mr-3" color="brown lighten-3" @click="goBack">
            Cancel
            <v-icon right>mdi-close-circle-outline</v-icon>
          </v-btn>
          <v-btn v-if="status === 'processing'" disabled>
            Uploading
            <v-progress-circular class="ml-2" indeterminate size="14" width="2" color="lime"/></v-btn>
          <v-btn v-else-if="status === 'success'" color="light-green" disabled>
            Success
            <v-icon right>mdi-checkbox-marked-circle-outline</v-icon>
          </v-btn>
          <v-btn
            v-else
            class="mr-4 formButton"
            color="lime"
            type="submit"
            :disabled="invalid"
          >
            Upload
            <v-icon right>mdi-checkbox-marked-circle-outline</v-icon>
          </v-btn>
        </v-row>
        </validation-observer>
      </v-form>
  </BackgroundCard>
</template>

<script>
  import { extend, ValidationProvider, ValidationObserver, setInteractionMode } from 'vee-validate'
  import BackgroundCard from '../card/BackgroundCard.vue'
  import {apiGetUploadForm, apiUploadPet} from "../../requests/api"
  import { required } from 'vee-validate/dist/rules'

  setInteractionMode('eager')

  extend('required', {
    ...required,
    message: '{_field_} can not be empty',
  })


  export default {
    name: 'upload',
    components: {
      ValidationProvider,
      ValidationObserver,
      BackgroundCard
    },
    mounted() {
      if(this.$store.getters.user == null || this.$cookie.get("user") == null){
          this.$router.push({
              name: 'signin'
              })
      }else{
        this.userId = this.$store.getters.user.userId;
        apiGetUploadForm()
        .then(res => {
          this.healthIssue = res.data.healthCondition;
          this.breedCat = res.data.breed.cat;
          this.breedDog = res.data.breed.dog;
        })
        .catch(err => {
          console.log("err:"+err.response.data.error);
          this.errorMessage = err.response.data.error;
          this.show = true;
        });  
      }  
    },
    data: () => ({
      name: null,
      userId: null,
      selectedFormType: null,
      picture: null,
      selectedType: null,
      selectedBreed: null,
      age: null,
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
      selectHealth: null,
      checkbox: null,
      status: "pending",
      show: false
    }),

    methods: {
      submit () {
        this.$refs.observer.validate()
        this.status = "processing";
        let formData = new FormData();
        formData.append("picture", this.picture, this.picture.name);
        formData.set("userId", this.userId);
        formData.set("status", this.selectedFormType);
        formData.set("date", this.date);
        formData.set("name", this.name);
        formData.set("breed", this.selectedBreed);
        formData.set("category", this.selectedType);
        formData.set("age", this.age);
        formData.set("color", this.selectColor);
        formData.set("size", this.selectSize);
        formData.set("gender", this.selectGender);
        formData.set("chip_status", this.checkbox);
        formData.set("health_issue", this.selectHealth);
        formData.set("zip_code", this.zip_code);
        apiUploadPet(formData)
        .then(res => {
          if(res.status == 200){
            this.status = "success";
            setTimeout(() => {
              this.$router.push({
                  name: 'MainPage'
                  //params: { courseId: this.courseId, labId: res.data.labId }
                })
            }, 1000);
          }
        }).catch(err => {
          this.show = true;
          this.status = "pending";
          console.log(err);
        });
      },
      goBack() {
        this.$router.go(-1);
      }  
    },
  }
</script>
<style>
.uploadForm {
  width: 100%;
  padding: 40px 48px;
}

.formButton {
  margin: 0px 10px;
}

.FormSelectTitle {
  margin-bottom: 16px;
  padding-top:4px;
}
</style>