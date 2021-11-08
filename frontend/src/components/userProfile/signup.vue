<template>
    <BackgroundCard>
        <v-form @submit.prevent="submit" ref="form" style="padding: 50px 100px">
            <p class="headline">User Signup</p>
            <validation-observer
                ref="observer"
                v-slot="{ invalid }"
            >
                <validation-provider
                v-slot="{ errors }"
                name="firstName"
                rules="required"
                >
                <v-text-field
                    v-model="firstName"
                    :error-messages="errors"
                    label="First Name"
                    required
                />
                </validation-provider>
                <validation-provider
                v-slot="{ errors }"
                name="lastName"
                rules="required"
                >
                <v-text-field
                    v-model="lastName"
                    :error-messages="errors"
                    label="Last Name"
                />
                </validation-provider>
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
                name="phone"
                rules="required"
                >
                <v-text-field
                    v-model="phone"
                    :error-messages="errors"
                    label="phone number"
                    color="lime darken-3"
                ></v-text-field>
                </validation-provider>
                <validation-provider
                v-slot="{ errors }"
                name="zip_code"
                rules="required"
                >
                <v-text-field
                    v-model="zip_code"
                    :error-messages="errors"
                    label="zip_code"
                    color="lime darken-3"
                ></v-text-field>
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
                <validation-provider
                    v-slot="{ errors }"
                    name="passwordConfirm"
                    rules="required"
                >
                    <v-text-field
                        v-model="passwordConfirm"
                        label="Confirm Password"
                        :error-messages="errors"
                        type="password"
                        color="lime darken-3"
                    />
                  </validation-provider>
                <v-row justify="end">
                    <v-btn text color="lime darken-3" @click="toSignin">
                        <v-icon left>mdi-forward</v-icon>
                        signin
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
    import { required,email } from 'vee-validate/dist/rules'
    import { apiUserSignup } from "../../requests/api"

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
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            zip_code: "",
            password: "",
            passwordConfirm: "",
            showPassword: false,
            show: false,
            errorMessage: "",
            status: "pending"
        }),
        methods: {
            toSignin() {
              this.$router.push({
                  name: 'signin',
                  params: { email: this.email, password: this.password }
                })
            },
            goBack() {
                this.$router.go(-1);
            } ,
            submit() {
                if(this.password !== this.passwordConfirm){
                    this.show = true;
                    this.errorMessage = "please confirm password"
                }else{
                    let signupData = {
                        "firstName": this.firstName,
                        "lastName": this.lastName,
                        "email": this.email,
                        "phone": this.phone,
                        "zip_code": this.zip_code,
                        "password": this.password
                    }
                    console.log(signupData);
                    apiUserSignup(signupData)
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
    }
</script>

<style>

</style>