export default {
  namespaced: true,
  state: {
    messages: []
  },
  actions: {
    updateMessage(context, { message, status }){
      const timestamp = Math.floor(new Date() / 1000)
      context.commit('UPDATEMESSAGE', { message, status, timestamp
      })
      context.dispatch('removeMessageWithTiming', timestamp)
    },
    removeMessage (context, num) {
      context.commit('REMOVEMESSAGE', num)
    },
    removeMessageWithTiming (context, timestamp) {
      setTimeout(() => {
        context.commit('REMOVEMESSAGEWITHTIMING', timestamp)
      }, 3000)
    }
  },
  mutations: {
    UPDATEMESSAGE (state, payload){
      state.messages.push(payload)
    },
    REMOVEMESSAGE (state, payload){
      state.messages.splice(payload, 1)
    },
    REMOVEMESSAGEWITHTIMING (state, payload){
      state.messages.forEach((item, i) => {
        if (item.timestamp === payload) {
          state.messages.splice(i, 1)
        }
      })
    }
  },
  getters: {
    messages: state => state.messages
  }
}