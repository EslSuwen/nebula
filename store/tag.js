/**
 * @file 分类数据状态 / ES module
 * @module store/category
 * @author Ronger <https://github.com/ronger-x>
 */

export const ADMIN_API_PATH = '/api/admin'
export const TAG_API_PATH = '/api/tag'

const getDefaultListData = () => {
  return {
    tagPage: {},
  }
}
const getDefaultData = () => {
  return {
    tagIconPath: '',
    tagStatus: '0',
    tagReservation: '0'
  }
}

export const state = () => {
  return {
    fetching: false,
    data: [],
    list: {
      fetching: false,
      data: getDefaultListData()
    },
    detail: {
      fetching: false,
      data: getDefaultData()
    }
  }
}

export const mutations = {
  updateListFetching(state, action) {
    state.list.fetching = action
  },
  updateListData(state, action) {
    state.list.data = action
  },
  updateFetching(state, action) {
    state.fetching = action
  },
  updateDetailFetching(state, action) {
    state.detail.fetching = action
  },
  updateDetailData(state, action) {
    state.detail.data = action
  }
}

export const actions = {
  fetchList({commit}, params = {}) {
    // 清空已有数据
    commit('updateListData', getDefaultListData())
    commit('updateListFetching', true)
    let parameters = {
      page: params.page || 1
    }
    this.$axios
      .$get(`${ADMIN_API_PATH}/tags`, {
        params: parameters
      }).then(data => commit('updateListData', data))
      .finally(commit('updateListFetching', false))
  },
  async fetchDetail({commit}, params) {
    commit('updateFetching', true);
    let data = await this.$axios
      .$get(`${ADMIN_API_PATH}/tag/${params.tag_id}`)
    commit('updateDetailData', data)
    commit('updateFetching', false)
  },

  // 获取文章详情
  async fetchPostDetail({commit}, params = {}) {
    if (typeof params.tag_id === 'undefined') {
      commit('updateDetailData', getDefaultData())
      return;
    }
    commit('updateDetailFetching', true)
    let data = await this.$axios
      .$get(`${ADMIN_API_PATH}/tag/detail/${params.tag_id}`)
    commit('updateDetailData', data)
    commit('updateDetailFetching', false)
  }
}
