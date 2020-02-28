<template>
  <v-app>
    <v-toolbar dense max-height="48px" color="teal accent-4">
      <v-toolbar-title>Trello Clone</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="!payload">
          <v-btn text :to="{ name: 'SignUp' }">SignUp</v-btn>
          <v-btn text :to="{ name: 'Login' }">Login</v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-if="payload">
        <v-row justify="center" align="center">
        <v-btn text @click="logout">Logout</v-btn>
          <v-avatar size="42">
            <v-img
              :src="payload.user.imageUrl"
              alt="User Avator"
            />
          </v-avatar>
        </v-row>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view />
    </v-content>
    <v-footer :fixed="true" color="teal accent-4" app>
      <span>&copy; 2020 - Made with ❤️</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'App',
  data: () => ({
  }),
  computed: {
    ...mapState('auth', { payload: 'payload' })
  },
  methods: {
    ...mapActions('auth', { authLogout: 'logout' }),
    logout () {
      this.authLogout().then(() => this.$router.push('/login'))
    }
  }
}
</script>
