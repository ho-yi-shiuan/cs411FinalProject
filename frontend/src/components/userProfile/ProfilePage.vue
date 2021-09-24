<template>
    <BackgroundCard>
        <div class="profileInformation">
            <p class="headline">User Profile</p>
            <v-col>
                <div class="text--primary mx-auto" style="width:80%;" align="center" justify="center">
                    <v-row>
                        <v-col>
                        Name:
                        </v-col>
                        <v-col>
                        First name + Last name
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                        email:
                        </v-col>
                        <v-col>
                        email
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                        password:
                        </v-col>
                        <v-col>
                        ********
                        </v-col>
                    </v-row>
                </div>
            </v-col>
        </div>
    </BackgroundCard>
</template>

<script>
  import BackgroundCard from '../card/BackgroundCard.vue'

  export default {
    name: 'UserProfilePage',
    components: {
        BackgroundCard
    },
  }
</script>

<style>
.profileInformation {
  width: 100%;
  padding: 40px 48px;
}
</style>