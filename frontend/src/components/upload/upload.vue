<template>
  <BackgroundCard>
    <validation-observer
      ref="observer"
      v-slot="{ invalid }"
      class="validationObserver"
    >
      <v-form class="uploadForm" v-model="isValid" @submit.prevent="submit" ref="form" lazy-validation>
        <p class="headline">Upload record for lost/found pet</p>
        <validation-provider
          v-slot="{ errors }"
          name="Name"
          rules="required|max:10"
        >
          <v-text-field
            v-model="name"
            :counter="10"
            :error-messages="errors"
            label="Name"
            required
          ></v-text-field>
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="phoneNumber"
          :rules="{
            required: true,
          }"
        >
          <v-text-field
            v-model="phoneNumber"
            :counter="7"
            :error-messages="errors"
            label="Phone Number"
            required
          ></v-text-field>
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="email"
          rules="required|email"
        >
          <v-text-field
            v-model="email"
            :error-messages="errors"
            label="E-mail"
            required
          ></v-text-field>
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="select"
          rules="required"
        >
          <v-select
            v-model="select"
            :items="items"
            :error-messages="errors"
            label="Select"
            data-vv-name="select"
            required
          ></v-select>
        </validation-provider>
        <validation-provider
          name="file"
          rules="required"
        >
          <v-file-input
            accept="image/*"
            label="Upload picture of pet"
          ></v-file-input>
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          rules="required"
          name="checkbox"
        >
          <v-checkbox
            v-model="checkbox"
            :error-messages="errors"
            value="1"
            label="Option"
            type="checkbox"
            required
          ></v-checkbox>
        </validation-provider>
        <v-row justify="center">
          <v-btn @click="clear" class="formButton">
            clear
          </v-btn>
          <v-btn
            class="mr-4 formButton"
            type="submit"
            :disabled="invalid"
          >
            submit
          </v-btn>
        </v-row>
      </v-form>
    </validation-observer>
  </BackgroundCard>
</template>

<script>
  import { required, digits, email, max, regex } from 'vee-validate/dist/rules'
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
  import BackgroundCard from '../card/BackgroundCard.vue'

  setInteractionMode('eager')

  extend('digits', {
    ...digits,
    message: '{_field_} needs to be {length} digits. ({_value_})',
  })

  extend('required', {
    ...required,
    message: '{_field_} can not be empty',
  })

  extend('max', {
    ...max,
    message: '{_field_} may not be greater than {length} characters',
  })

  extend('regex', {
    ...regex,
    message: '{_field_} {_value_} does not match {regex}',
  })

  extend('email', {
    ...email,
    message: 'Email must be valid',
  })

  export default {
    name: 'upload',
    components: {
      ValidationProvider,
      ValidationObserver,
      BackgroundCard
    },
    data: () => ({
      name: '',
      phoneNumber: '',
      email: '',
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
      ],
      checkbox: null,
    }),

    methods: {
      submit () {
        this.$refs.observer.validate()
      },
      clear () {
        this.name = ''
        this.phoneNumber = ''
        this.email = ''
        this.select = null
        this.checkbox = null
        this.$refs.observer.reset()
      },
      goBack() {
        this.$router.go(-1);
      },
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
</style>