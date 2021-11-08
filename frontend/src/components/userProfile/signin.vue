<template>
    <BackgroundCard>
        <v-form @submit.prevent="submit" ref="form" style="padding: 50px 100px" lazy-validation>
            <p class="headline">User Signin</p>
            <validation-observer
                ref="observer"
                v-slot="{ invalid }"
            >
                <validation-provider
                v-slot="{ errors }"
                name="Email"
                rules="required|email"
                >
                <v-text-field
                    v-model="email"
                    :error-messages="errors"
                    label="email"
                    color="lime darken-3"
                />
                </validation-provider>
                <validation-provider
                    v-slot="{ errors }"
                    name="Password"
                    rules="required"
                >
                <v-text-field
                    v-model="password"
                    :error-messages="errors"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    label="password"
                    @click:append="showPassword = !showPassword"
                    color="lime darken-3"
                ></v-text-field>
                </validation-provider>
                <v-row justify="end">
                    <v-btn text color="lime darken-3" @click="toSignup">
                        <v-icon left>mdi-forward</v-icon>
                        signup
                    </v-btn>
                </v-row>
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
                <v-row justify="center" style="margin-top: 20px">
                <v-btn class="mr-3" color="brown lighten-3" @click="goBack">
                    Cancel
                    <v-icon right>mdi-close-circle-outline</v-icon>
                </v-btn>
                <v-btn v-if="status === 'processing'" disabled>
                    Processing
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
                    Signin
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
    import { required,email } from 'vee-validate/dist/rules'
    import {apiUserLogin} from "../../requests/api"

    setInteractionMode('eager')

    extend('required', {
    ...required,
    message: '{_field_} can not be empty',
    })

    extend('email', {
    ...email,
    message: '{_field_} field must be a valid email',
    })

    export default {
        name: 'signin',
        components: {
            ValidationProvider,
            ValidationObserver,
            BackgroundCard
        },
        data: () => ({
            email: "",
            password: "",
            showPassword: false,
            show: false,
            errorMessage: "",
            status: "pending"
        }),
        methods: {
            toSignup() {
              this.$router.push({
                  name: 'signup',
                  params: { email: this.email, password: this.password }
                })
            },
            goBack() {
                this.$router.go(-1);
            },
            submit() {
                this.$refs.observer.validate()
                this.status = "processing"
                let signinData = {
                    "email": this.email,
                    "password": this.password
                }
                apiUserLogin(signinData)
                .then(res => {
                    if(res.status == 200){
                        this.status = "success";
                        this.$cookie.set('user', res.data.user.access_token, { expires: res.data.user.access_expired });
                        this.$store.commit("setUser", { "userId":res.data.user.user_id, "userEmail":res.data.user.email, "userName":res.data.user.name, "userPhone":res.data.user.phone, "userzip_code":res.data.user.zip_code });
                        setTimeout(() => {
                        this.$router.push({
                            name: 'UserProfilePage'
                            //params: { courseId: this.courseId, labId: res.data.labId }
                            })
                        }, 1000);
                    }
                }).catch(err => {
                    console.log("err:"+err.response.data.error);
                    this.errorMessage = err.response.data.error;
                    this.show = true;
                    this.status = "pending";
                });
            }
        }
    }
</script>

<style>

</style>