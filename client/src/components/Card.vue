<template>
  <div>
    <div>
      <v-container>
        <v-row v-if="cardsByListId[listId]" dense>
          <v-col
            v-for="card in cardsByListId[listId]"
            :key="card._id"
            cols="12"
          >
            <v-card>
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
        </v-row>
      </v-container>
    </div>
    <v-form
      v-if="!creatingCard"
      v-model="validCard"
      @submit="createCard"
      @keydown.prevent.enter
    >
      <v-text-field
      v-model="card.title"
        label="Title"
        :rules="notEmptyRules"
        required
      >
      </v-text-field>
      <v-btn
        text
        color="secondary"
        type="submit"
        :disabled="!validCard"
      >
        Create
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'card',
  props: {
    listId: {
      type: String,
      required: true
    },
    boardId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    validCard: false,
    card: {
      title: '',
      order: 0,
      archived: false,
      members: []
    },
    notEmptyRules: [(value) => !!value || 'Cannot be empty.']
  }),
  mounted () {
    this.findCards({
      query: {
        boardId: this.$route.params.id
      }
    })
  },
  computed: {
    ...mapState('cards', {
      creatingCard: 'isCreatePending'
    }),
    ...mapGetters('cards', { findCardsInStore: 'find' }),
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
    ...mapActions('cards', { findCards: 'find' }),
    createCard () {
      if (this.validCard) {
        const { Card } = this.$FeathersVuex.api
        this.card.boardId = this.boardId
        this.card.listId = this.listId
        const card = new Card(this.card)
        card.save()
        this.card = {
          title: '',
          order: 0,
          archived: false,
          members: []
        }
      }
    }
  }
}
</script>
