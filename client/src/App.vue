<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>
        <v-btn text :to="{ name: 'Home' }">Trello Clone</v-btn>
      </v-toolbar-title>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>
    <v-footer :fixed="true" app>
      <span>&copy; 2020 - Made with ❤️</span>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
    //
  })
}
</script>
