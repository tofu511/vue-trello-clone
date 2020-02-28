<template>
  <v-container fluid>
    <v-layout column align-left>
      <v-row>
        <v-col cols="12">
          <h2 v-if="board">{{ board.name }}</h2>
        </v-col>
      </v-row>
    </v-layout>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-left>
        <v-progress-circular
          v-if="loadingBoard || loadingLists"
          indeterminate
          color="primary">
        </v-progress-circular>
        <v-row v-if="!loadingLists" dense>
          <v-col v-for="list in lists" :key="list._id" cols="3">
            <v-card>
              <v-card-title>
                {{ list.name }}
              </v-card-title>
              <v-card-actions>
                <card
                  :listId="list._id"
                  :boardId="$route.params.id"
                ></card>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card>
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
          </v-col>
        </v-row>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import Card from '@/components/Card'

export default {
  name: 'board',
  components: {
    Card
  },
  data: () => ({
    validList: false,
    list: {
      name: '',
      order: 0,
      archived: false
    },
    notEmptyRules: [(value) => !!value || 'Cannot be empty.']
  }),
  mounted () {
    this.getBoard(this.$route.params.id)
    this.findLists({
      query: {
        boardId: this.$route.params.id
      }
    })
  },
  computed: {
    ...mapState('boards', {
      loadingBoard: 'isGetPenging'
    }),
    ...mapState('lists', {
      loadingLists: 'isFindPenging',
      creatingList: 'isCreatePending'
    }),
    ...mapGetters('boards', { getBoardInStore: 'get' }),
    ...mapGetters('lists', { findListsInStore: 'find' }),
    board () {
      return this.getBoardInStore(this.$route.params.id)
    },
    lists () {
      return this.findListsInStore({
        query: {
          boardId: this.$route.params.id
        }
      }).data
    }
  },
  methods: {
    ...mapActions('boards', { getBoard: 'get' }),
    ...mapActions('lists', { findLists: 'find' }),
    createList () {
      if (this.validList) {
        const { List } = this.$FeathersVuex.api
        this.list.boardId = this.$route.params.id
        const list = new List(this.list)
        list.save()
        this.list = {
          name: '',
          order: 0,
          archived: false
        }
      }
    }
  }
}
</script>
