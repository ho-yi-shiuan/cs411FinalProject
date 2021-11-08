<template>
  <div>
      <BackgroundCard>
          <div class="profileInformation">
              <v-row>
              <v-alert
                  v-show="show"
                  dense
                  border="left"
                  type="warning"
                  style="margin-top:10px; width:100%;"
              >
                  {{errorMessage}}
              </v-alert>
              </v-row>  
              <p class="headline">User Profile</p>
              <v-col>
                  <div class="text--primary mx-auto" style="width:80%;" align="center" justify="center">
                      <v-row>
                          <v-col>Name:</v-col>
                          <v-col>{{userName}}</v-col>
                      </v-row>
                      <v-row>
                          <v-col>email:</v-col>
                          <v-col>{{email}}</v-col>
                      </v-row>
                      <v-row>
                          <v-col>location:</v-col>
                          <v-col>{{userCity}}</v-col>
                      </v-row>
                      <v-row>
                          <v-col>phone:</v-col>
                          <v-col>{{phone}}</v-col>
                      </v-row>
                  </div>
              </v-col>
          </div>
      </BackgroundCard>
      <BackgroundCard>
        <template>
            <v-data-table
                :headers="headers"
                :items="userPet"
            >
            <template v-slot:top>
                <v-dialog
                  v-model="dialog"
                  max-width="500px"
                >
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">Edit pet</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem.name"
                              label="name"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem.zip_code"
                              label="zip_code"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem.date"
                              label="date"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-select 
                            label="category"
                            :items="category"
                            v-model="editedItem.category"
                            >
                            </v-select>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-select
                            v-if="editedItem.category == 'cat'"
                            label="breed"
                            :items="breedCat"
                            v-model="editedItem.breed"
                            clearable
                            >
                            </v-select>
                            <v-select
                            v-if="editedItem.category == 'dog'"
                            label="breed"
                            :items="breedDog"
                            v-model="editedItem.breed"
                            clearable
                            >
                            </v-select>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-select 
                            label="gender"
                            :items="gender"
                            v-model="editedItem.gender"
                            clearable
                            >
                            </v-select>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-select 
                            label="color"
                            :items="colors"
                            v-model="editedItem.color"
                            multiple
                            >
                            </v-select>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem.age"
                              label="age"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem.color"
                              label="color"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-select
                            label="size"
                            :items="sizes"
                            v-model="editedItem.size"
                            >
                            </v-select>
                          </v-col>
                        </v-row>
                        <v-row>
                        <v-alert
                            v-show="showUpdateError"
                            dense
                            border="left"
                            type="warning"
                            style="margin-top:10px; width:100%;"
                        >
                            {{updateErrorMessage}}
                        </v-alert>
                        </v-row> 
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="close"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        v-show = showUpdateSave
                        color="blue darken-1"
                        text
                        @click="save"
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                    <v-card-title class="text-h5">{{confirmText}}</v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                      <v-btn v-show="showDeleteOk" color="blue darken-1" text @click="deleteItemConfirm(item)">OK</v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                small
                @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:no-data>
              <v-btn
                color="lime"
                @click="uploadPet"
              >
                Upload pet
              </v-btn>
            </template>
          </v-data-table>
        </template>
      </BackgroundCard>
    </div>
</template>

<script>
  import BackgroundCard from '../card/BackgroundCard.vue'
  import {apiUserProfile,apiDeletePet,apiGetUploadForm,apiUpdatePet} from "../../requests/api"

  export default {
    name: 'UserProfilePage',
    components: {
        BackgroundCard
    },
    mounted() {
        const token = this.$cookie.get("user");
        //check if token exist
        //if no, redirect to signin page
        if(token == null){
            this.$router.push({
                name: 'signin'
                })
        }
        //if yes, Initialize user profileInformation
        apiUserProfile({"token":this.$cookie.get("user")})
            .then(res => {
                this.userName = res.data.UserProfile.name;
                this.email = res.data.UserProfile.email;
                this.phone = res.data.UserProfile.phone;
                this.userCity = res.data.UserProfile.city+", "+res.data.UserProfile.state;
                this.userPet = res.data.UserProfile.pet;
                console.log(this.userPet);
                apiGetUploadForm()
                .then(data => {
                  this.healthIssue = data.data.healthCondition;
                  this.breedCat = data.data.breed.cat;
                  this.breedDog = data.data.breed.dog;
                })
            }).catch(err => {
                if(err.response.status == 401){
                    //if no token or token expire, redirect to signin MainPage
                    console.log("err:"+err.response.data.error);
                    this.$router.push({
                        name: 'signin'
                    })
                }
                //else, show error
                console.log("err:"+err.response.data.error);
                this.errorMessage = err.response.data.error;
                this.show = true;
            });
    },
    data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [
            { text: 'type', value: 'status' },
            { text: 'date', value: 'date' },
            { text: 'category', value: 'category' },
            { text: 'name', value: 'name' },
            { text: 'city', value: 'city' },
            { text: 'color', value: 'color' },
            { text: 'size', value: 'size' },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
        userPet:[],
        userName:"",
        email:"",
        phone:"",
        userCity:"",
        type: "",
        date: "",
        name: "",
        city: "",
        color: "",
        show: false,
        errorMessage: "",
        editedIndex: -1,
        editedItem: {
            status: "",
            date: "",
            gender: "",
            breed: "",
            size: "",
            category: "",
            name: "",
            city: "",
            color: ""
        },
        defaultItem: {
            status: "",
            date: "",
            category: "",
            name: "",
            city: "",
            color: "",
            size: ""
        },
        category: ["dog","cat"],
        healthIssue: [],
        breedDog:[],
        breedCat:[],
        gender: ["female","male"],
        sizes: ["small","meduim","large"],
        colors: ["white","black","brown","orange","grey"],
        confirmText: "Are you sure you want to delete this item?",
        updateError: "",
        petToDelete: null,
        showDeleteOk: true,
        showUpdateError: false,
        updateErrorMessage: "",
        showUpdateSave: true
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    methods: {
      editItem (item) {
        this.editedIndex = this.userPet.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.userPet.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
        this.petToDelete = item.pet_id
      },

      deleteItemConfirm () {
        apiDeletePet({"pet_id":this.petToDelete})
        .then(res => {
          console.log(res);
          this.userPet.splice(this.editedIndex, 1)
          this.closeDelete()
        }).catch(err => {
          console.log(err);
          this.showDeleteOk = false
          this.confirmText = err.response.data.error;
        });
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.showDeleteOk = true
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        console.log(this.editedItem);
        apiUpdatePet({data:this.editedItem})
          .then(res => {
            console.log(res);
            Object.assign(this.userPet[this.editedIndex], this.editedItem)
            this.close()
          }).catch(err => {
            console.log(err);
            this.showUpdateError = true;
            this.showUpdateSave = false;
            this.updateErrorMessage = err.response.data.error;
          });
      },
      uploadPet () {
        this.$router.push({
            name: 'upload'
        })          
      }
    }
  }
</script>

<style>
.profileInformation {
  width: 100%;
  padding: 40px 48px;
}
</style>