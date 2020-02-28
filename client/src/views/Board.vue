<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary">
        </v-progress-circular>
        <h2>{{ board.name }}</h2>
        <v-row v-if="!loading" dense>
          <v-col v-for="list in lists" :key="list._id" cols="3">
            <v-card>
              <v-card-title primary-title>
                {{ list.name }}
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
        <v-card
          class="mx-auto"
          max-width="400"
        >
          <v-card-title>Create List</v-card-title>
            <v-card-text class="text--primary">
              <div>
                <v-form
                  v-if="!creatingList"
                  v-model="validList"
                  @submit.prevent="createList"
                  @keydown.prevent.enter
                  >
                  <v-text-field
                    v-model="list.name"
                    :rules="notEmptyRules"
                    label="Name"
                    required
                  ></v-text-field>
                  <v-btn type="submit" :disabled="!validList">Create</v-btn>
                </v-form>
                <v-progress-circular
                  v-if="creatingList"
                  indeterminate
                  color="primary">
                </v-progress-circular>
              </div>
            </v-card-text>
        </v-card>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  name: 'board',
  data: () => ({
    validList: false,
    list: {
      name: ''
    },
    notEmptyRules: [(value) => !!value || 'Cannot be empty.']
  }),
  mounted () {
    this.getBoard(this.$route.params.id)
  },
  computed: {
    ...mapState('boards', {
      loading: 'isGetPenging',
      creatingList: 'isCreatePending'
    }),
    ...mapGetters('boards', { getBoardInStore: 'get' }),
    board () {
      return this.getBoardInStore(this.$route.params.id)
    }
  },
  methods: {
    ...mapActions('boards', { getBoard: 'get' }),
    createList () {
      if (this.validList) {
        const { List } = this.$FeathersVuex.api
        const list = new List(this.list)
        list.save()
        this.list = {
          name: ''
        }
      }
    }
  }
}
</script>
