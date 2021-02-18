export const DRAFT_API_PATH = '/api/article'

const getDefaultListData = () => {
  return {
    articles: [],
    pagination: {}
  }
}

export const state = () => {
  return {
    list: {
      fetching: false,
      data: getDefaultListData()
    },
    detail: {
      fetching: false,
      data: {}
    }
  }
}

export const mutations = {
  // 文章列表
  updateListFetching(state, action) {
    state.list.fetching = action
  },
  updateListData(state, action) {
    state.list.data = action
  },
  // 文章详情
  updateDetailFetching(state, action) {
    state.detail.fetching = action
  },
  updateDetailData(state, action) {
    state.detail.data = action
  }
}

export const actions = {
  // 获取消息列表
  fetchList({commit}, params = {}) {
    // 清空已有数据
    commit('updateListData', getDefaultListData())
    commit('updateListFetching', true)
    let data = {
      page: params.page || 1
    }

    return this.$axios
      .$get(`${DRAFT_API_PATH}/drafts`, {
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
  },
  // 获取文章详情
  async fetchDetail({commit}, params = {}) {
    commit('updateDetailFetching', true)
    let data = await this.$axios
      .$get(`${DRAFT_API_PATH}/detail/${params.draft_id}`, {
        params: {
          type: 3
        }
      })
    commit('updateDetailData', data)
    commit('updateDetailFetching', false)
  }
}
