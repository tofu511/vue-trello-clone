<template>
  <div>
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
        color="primary"
        type="submit"
        :disabled="!validCard"
      >
        Create
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'create-card',
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
  computed: {
    ...mapState('cards', {
      creatingCard: 'isCreatePending'
    })
  },
  methods: {
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
