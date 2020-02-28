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
          <v-col v-for="board in boards" :key="board._id" cols="3">
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
              <v-card-actions>
                <v-btn color="primary" :to="{ name: 'Board', params: { id: board._id }}">Go</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card>
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
                      <v-btn type="submit" :disabled="!valid" color="primary">Create</v-btn>
                    </v-form>
                    <v-progress-circular
                      v-if="creating"
                      indeterminate
                      color="primary">
                    </v-progress-circular>
                  </div>
                </v-card-text>
            </v-card>
          </v-col>
        </v-row>
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
    this.findBoards({
      query: {
        ownerId: this.payload.user._id
      }
    })
  },
  computed: {
    ...mapState('auth', { payload: 'payload' }),
    ...mapState('boards', {
      loading: 'isFindPenging',
      creating: 'isCreatePending'
    }),
    ...mapGetters('boards', { findBoardsInStore: 'find' }),
    boards () {
      return this.findBoardsInStore({
        query: {
          ownerId: this.payload.user._id
        }
      }).data
    }
  },
  methods: {
    ...mapActions('boards', { findBoards: 'find' }),
    createBoard () {
      if (this.valid) {
        const { Board } = this.$FeathersVuex.api
        const board = new Board(this.board)
        board.save()
        this.board = {
          name: '',
          background: ''
        }
      }
    }
  }
}
</script>
