<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <v-form
          v-model="valid"
          @submit.prevent="signUp"
          @keydown.prevent.enter
          >
          <v-text-field
            v-model="user.username"
            :rules="notEmptyRules"
            label="Username"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.displayName"
            :rules="notEmptyRules"
            label="Display Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            :rules="notEmptyRules"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.confirmPassword"
            :rules="confirmPasswordRules"
            label="Confirm Password"
            type="password"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.imageUrl"
            :rules="notEmptyRules"
            label="Image URL"
            required
          ></v-text-field>
          <v-btn type="submit" :disabled="!valid">SignUp</v-btn>
        </v-form>
        <!-- <v-progress-circular
          indeterminate
          color="primary">
        </v-progress-circular> -->
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>

export default {
  name: 'signUp',
  data: (vm) => ({
    valid: false,
    user: {
      username: '',
      password: '',
      confirmPassword: '',
      displayName: '',
      imageUrl: ''
    },
    notEmptyRules: [(value) => !!value || 'Cannot be empty.'],
    confirmPasswordRules: [(confirmPassword) => confirmPassword === vm.user.password || 'Password must match.']
  }),
  methods: {
    signUp () {
      if (this.valid) {
        console.log('the form is valid')
      }
    }
  }
}
</script>
