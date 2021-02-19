export const ADMIN_API_PATH = '/api/admin'

const getDefaultUsersData = () => {
  return {
    userPage: {},
  }
}

const getDefaultRolesData = () => {
  return {
    rolePage: {},
  }
}

export const state = () => {
  return {
    fetching: false,
    user: getDefaultUsersData(),
    role: getDefaultRolesData()
  }
}

export const mutations = {
  updateFetching(state, action) {
    state.fetching = action
  },
  updateUsersData(state, action) {
    state.user.userPage = action
  },
  updateRolesData(state, action) {
    state.role.rolePage = action
  }
}

export const actions = {
  async fetchUsers({commit}, params = {}) {
    // 清空已有数据
    commit('updateUsersData', getDefaultUsersData())
    commit('updateFetching', true)

    let parameters = {
      page: params.page || 1,
      rows: params.rows || 10
    }

    let data = await this.$axios
      .$get(`${ADMIN_API_PATH}/users`, {
        params: parameters
      })
    commit('updateFetching', false);
    commit('updateUsersData', data);
  },
  async fetchRoles({commit}, params = {}) {
    // 清空已有数据
    commit('updateRolesData', getDefaultRolesData())
    commit('updateFetching', true)
    let parameters = {
      page: params.page || 1,
      rows: params.rows || 10
    }
    let data = await this.$axios
      .$get(`${ADMIN_API_PATH}/roles`, {
        params: parameters
      })
    commit('updateFetching', false);
    commit('updateRolesData', data);
  }
}
