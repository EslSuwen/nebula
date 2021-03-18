/**
 * @file 分类数据状态 / ES module
 * @module store/category
 * @author Ronger <https://github.com/ronger-x>
 */

export const TOPIC_API_PATH = '/api/topic'
export const ADMIN_API_PATH = '/api/admin'

export const state = () => {
  return {
    fetching: false,
    data: [],
    list: {
      fetching: false,
      topicPage: {}
    },
    detail: {
      fetching: false,
      data: {}
    },
    tags: {
      fetching: false,
      tagPage: {}
    }
  }
}

export const mutations = {
  updateListFetching(state, action) {
    state.list.fetching = action
  },
  updateListData(state, action) {
    state.list.topicPage = action
  },
  updateFetching(state, action) {
    state.fetching = action
  },
  updateNavData(state, action) {
    state.data = action
  },
  updateDetailFetching(state, action) {
    state.detail.fetching = action
  },
  updateDetailData(state, action) {
    state.detail.data = action
  },
  updateTopicTagsFetching(state, action) {
    state.tags.fetching = action
  },
  updateTopicTagsData(state, action) {
    state.tags.tagPage = action
  }
}

export const actions = {
  async fetchList({commit}, params = {}) {
    // 清空已有数据
    commit('updateListData', {})
    commit('updateListFetching', true)
    let parameters = {
      page: params.page || 1
    }
    let data = await this.$axios
      .$get(`${ADMIN_API_PATH}/topics`, {
        params: parameters
      })
    commit('updateListFetching', false);
    commit('updateListData', data);
  },
  async fetchNavList({commit}, params) {
    commit('updateFetching', true);
    let data = await this.$axios
      .$get(`${TOPIC_API_PATH}/topic-nav`)
    commit('updateNavData', data)
    commit('updateFetching', false)
  },
  async fetchDetail({commit}, params) {
    commit('updateDetailFetching', true);
    let data = await this.$axios
      .$get(`${ADMIN_API_PATH}/topic/${params.topic_uri}`)
    commit('updateDetailData', data)
    commit('updateDetailFetching', false)
  },
  async fetchTopicTags({commit}, params) {
    commit('updateTopicTagsFetching', true);
    let data = await this.$axios
      .$get(`${ADMIN_API_PATH}/topic/${params.topic_uri}/tags?page=${params.page}`)
    commit('updateTopicTagsData', data)
    commit('updateTopicTagsFetching', false)
  },
  async fetchUnBindTags({commit}, params) {
    commit('updateTopicTagsFetching', true);
    let data = await this.$axios
      .$get(`${ADMIN_API_PATH}/topic/unbind-topic-tags`, {
        params: params
      })
    console.log(data)
    commit('updateTopicTagsData', data)
    commit('updateTopicTagsFetching', false)
  }
}
