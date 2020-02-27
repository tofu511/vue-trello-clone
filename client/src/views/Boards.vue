<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary">
        </v-progress-circular>
        <v-row v-if="!loading" dense>
          <v-col v-for="board in boards" :key="board._id" cols="4">
            <v-card>
              <v-img
                white--text align-end
                height="200px"
                :src="board.background"
              >
              </v-img>
              <v-spacer></v-spacer>
              <v-card-title primary-title>
                {{ board.name }}
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
        <v-card
          class="mx-auto"
          max-width="400"
        >
          <v-card-title>Create Board</v-card-title>
            <v-card-text class="text--primary">
              <div>
                <v-form
                  v-if="!creating"
                  v-model="valid"
                  @submit.prevent="createBoard"
                  @keydown.prevent.enter
                  >
                  <v-text-field
                    v-model="board.name"
                    :rules="notEmptyRules"
                    label="Name"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="board.background"
                    :rules="notEmptyRules"
                    label="Background"
                    required
                  ></v-text-field>
                  <v-btn type="submit" :disabled="!valid">Create</v-btn>
                </v-form>
                <v-progress-circular
                  v-if="creating"
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
  name: 'boards',
  data: () => ({
    valid: false,
    board: {
      name: '',
      background: ''
    },
    notEmptyRules: [(value) => !!value || 'Cannot be empty.']
  }),
  mounted () {
    // this.findBoards({ query: {} })
  },
  computed: {
    ...mapState('boards', {
      loading: 'isFindPenging',
      creating: 'isCreatePending'
    }),
    ...mapGetters('boards', { findBoardsInStore: 'find' }),
    boards () {
      return this.findBoardsInStore({ query: {} }).data
    }
  },
  methods: {
    ...mapActions('boards', { findBoards: 'find' }),
    createBoard () {
      if (this.valid) {
        // TODO boardにしたい
        const { Boards } = this.$FeathersVuex.api
        const boards = new Boards(this.board)
        boards.save()
        this.board = {
          name: '',
          background: ''
        }
      }
    }
  }
}
</script>
