export const BANK_ACCOUNT_API_PATH = '/api/admin/bank-account'

const getDefaultListData = () => {
  return {
    bankAccountPage: {},
  }
}

export const state = () => {
  return {
    list: {
      fetching: false,
      data: getDefaultListData()
    }
  }
}

export const mutations = {
  updateListFetching(state, action) {
    state.list.fetching = action
  },
  updateListData(state, action) {
    state.list.data = action
  }
}

export const actions = {
  async fetchList({commit}, params = {}) {
    // 清空已有数据
    commit('updateListData', getDefaultListData())
    commit('updateListFetching', true)
    let parameters = {
      page: params.page || 1
    }
    let data = await this.$axios
      .$get(`${BANK_ACCOUNT_API_PATH}/list`, {
        params: parameters
      })
    commit('updateListData', data);
    commit('updateListFetching', false);
  }
}

