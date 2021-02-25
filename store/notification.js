export const NOTIFICATION_API_PATH = '/api/notification'


export const state = () => {
  return {
    list: {
      fetching: false,
      noticePage: {}
    }
  }
}

export const mutations = {
  // 消息列表
  updateListFetching(state, action) {
    state.list.fetching = action
  },
  updateListData(state, action) {
    state.list.noticePage = action
  }
}

export const actions = {
  // 获取消息列表
  fetchList({commit}, params = {}) {
    // 清空已有数据
    commit('updateListData', {})
    commit('updateListFetching', true)
    let data = {
      page: params.page || 1
    }

    return this.$axios
      .$get(`${NOTIFICATION_API_PATH}/all`, {
        params: data
      })
      .then(response => {
        commit('updateListFetching', false);
        commit('updateListData', response);
      })
      .catch(error => {
        console.log(error);
        commit('updateListFetching', false);
      });
  }
}
