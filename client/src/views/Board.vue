<template>
  <v-container fluid>
    <v-row>
      <v-col v-if="boardsError != null">
        <v-alert :value="boardsError != null" type="error">
          {{ boardsError.message }}
        </v-alert>
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-col cols="11">
        <h2 v-if="board">{{ board.name }}</h2>
      </v-col>
      <v-col cols="1">
        <v-btn
          color="teal accent-4"
          dark
          @click.stop="drawer = !drawer"
        >Activities
        </v-btn>
      </v-col>
    </v-row>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      right
      width="400px"
    >
      <v-list dense>
        <v-list-item
          v-for="activity in reversedActivities"
          :key="activity._id"
          link
        >
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-card-subtitle v-html="markdownifyText(activity.text)">
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-progress-circular
      v-if="loadingBoard || loadingLists"
      indeterminate
      color="primary">
    </v-progress-circular>
    <v-row v-if="!loadingLists" dense>
      <v-col v-for="list in lists" :key="list._id" cols="2">
        <v-card
          @dragover="setDroppingList($event, list)"
          :class="{ 'teal accent-4': droppingList == list}">
          <v-card-title>
            {{ list.name }}
          </v-card-title>
          <v-card-actions>
            <v-row v-if="cardsByListId[list._id]" dense>
              <v-col
                v-for="card in cardsByListId[list._id]"
                :key="card._id"
                cols="12"
              >
                <v-card
                  draggable="true"
                  @dragstart="startDraggingCard(card)"
                  @dragend="dropCard()"
                >
                  <div class="d-flex flex-no-wrap justify-space-between">
                    <div>
                      <v-card-title
                        class="headline"
                        v-text="card.title"
                      ></v-card-title>
                      <v-card-subtitle v-text="card.description"></v-card-subtitle>
                    </div>
                  </div>
                </v-card>
              </v-col>
                <create-card
                  :listId="list._id"
                  :boardId="$route.params.id"
                >
                </create-card>
            </v-row>
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
                  <v-btn type="submit" :disabled="!validList" color="primary">Create</v-btn>
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
  </v-container>
</template>

<script>
import marked from 'marked'
import { mapActions, mapState, mapGetters } from 'vuex'
import CreateCard from '@/components/CreateCard'

export default {
  name: 'board',
  components: {
    CreateCard
  },
  data: () => ({
    validList: false,
    list: {
      name: '',
      order: 0,
      archived: false
    },
    draggingCard: null,
    droppingList: null,
    drawer: false,
    notEmptyRules: [(value) => !!value || 'Cannot be empty.']
  }),
  mounted () {
    this.getBoard(this.$route.params.id)
    this.findLists({
      query: {
        boardId: this.$route.params.id
      }
    })
    this.findCards({
      query: {
        boardId: this.$route.params.id
      }
    })
    this.findActivities({
      query: {
        boardId: this.$route.params.id
      }
    })
  },
  computed: {
    ...mapState('auth', { payload: 'payload' }),
    ...mapState('boards', {
      loadingBoard: 'isGetPenging',
      boardsError: 'errorOnGet'
    }),
    ...mapState('lists', {
      loadingLists: 'isFindPenging',
      creatingList: 'isCreatePending',
      listsError: 'errorOnfind'
    }),
    ...mapState('cards', {
      cardsError: 'errorOnfind'
    }),
    ...mapGetters('boards', { getBoardInStore: 'get' }),
    ...mapGetters('lists', { findListsInStore: 'find' }),
    ...mapGetters('cards', { findCardsInStore: 'find' }),
    ...mapGetters('activities', { findActivitiesInStore: 'find' }),
    board () {
      return this.getBoardInStore(this.$route.params.id)
    },
    activities () {
      return this.findActivitiesInStore({
        query: {
          boardId: this.$route.params.id
        }
      }).data
    },
    reversedActivities () {
      return this.activities.slice().reverse()
    },
    lists () {
      return this.findListsInStore({
        query: {
          boardId: this.$route.params.id
        }
      }).data
    },
    cards () {
      return this.findCardsInStore({
        query: {
          boardId: this.$route.params.id
        }
      }).data
    },
    cardsByListId () {
      return this.cards.reduce((byId, card) => {
        byId[card.listId] = byId[card.listId] || []
        byId[card.listId].push(card)
        return byId
      }, {})
    }
  },
  methods: {
    ...mapActions('boards', { getBoard: 'get' }),
    ...mapActions('lists', { findLists: 'find' }),
    ...mapActions('cards', { findCards: 'find' }),
    ...mapActions('activities', { findActivities: 'find' }),
    async createList () {
      if (this.validList) {
        const { List } = this.$FeathersVuex.api
        this.list.boardId = this.$route.params.id
        const list = new List(this.list)
        await list.save()
        this.list = {
          name: '',
          order: 0,
          archived: false
        }
        this.createActivity(`**${this.payload.user.displayName}** created list: **${list.name}**`)
      }
    },
    createActivity (text) {
      const { Activity } = this.$FeathersVuex.api
      const activity = new Activity()
      activity.text = text
      activity.boardId = this.$route.params.id
      activity.save()
    },
    setDroppingList (event, list) {
      this.droppingList = list
      event.preventDefault()
    },
    startDraggingCard (card) {
      this.draggingCard = card
    },
    async dropCard () {
      if (this.droppingList && this.draggingCard.listId !== this.droppingList._id) {
        const fromList = this.lists.find(list => list._id === this.draggingCard.listId)
        const toList = this.lists.find(list => list._id === this.droppingList._id)
        this.draggingCard.listId = this.droppingList._id
        await this.draggingCard.save()
        this.createActivity(`**${this.payload.user.displayName}** moved card **${this.draggingCard.title}** from **${fromList.name}** to **${toList.name}**`)
      }
      this.droppingList = null
      this.draggingCard = null
    },
    markdownifyText (text) {
      return marked(text)
    }
  }
}
</script>
