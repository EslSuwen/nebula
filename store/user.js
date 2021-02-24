/**
 * @file 用户信息状态 / ES module
 * @module store/category
 * @author Ronger <https://github.com/ronger-x>
 */

export const USER_API_PATH = '/api/user'

export const state = () => {
  return {
    fetching: false,
    data: {},
    userExtend: {},
    articlePage: {},
    portfolioPage: {},
    followerPage: {},
    followingPage: {}
  }
}

export const mutations = {
  updateFetching(state, action) {
    state.fetching = action
  },
  updateDetailData(state, action) {
    state.data = action
  },
  updateUserExtendData(state, action) {
    state.userExtend = action
  },
  updateArticleList(state, action) {
    state.articlePage = action
  },
  updatePortfolioList(state, action) {
    state.portfolioPage = action
  },
  updateFollowerList(state, action) {
    state.followerPage = action
  },
  updateFollowingList(state, action) {
    state.followingPage = action
  }
}

export const actions = {
  fetchDetail({commit}, params) {
    commit('updateFetching', true);
    return this.$axios
      .$get(`${USER_API_PATH}/${params.nickname}`)
      .then(data => commit('updateDetailData', data))
      .finally(commit('updateFetching', false))
  },
  fetchUserExtend({commit}, params) {
    commit('updateFetching', true);
    return this.$axios
      .$get(`${USER_API_PATH}/${params.nickname}/user-extend`)
      .then(data => commit('updateUserExtendData', data))
      .finally(commit('updateFetching', false))
  },
  fetchArticleList({commit}, params) {
    commit('updateFetching', true);
    return this.$axios
      .$get(`${USER_API_PATH}/${params.nickname}/articles`, {
        params: {
          page: params.page
        }
      })
      .then(data => commit('updateArticleList', data))
      .finally(commit('updateFetching', false))
  },
  fetchPortfolioList({commit}, params) {
    commit('updateFetching', true);
    return this.$axios
      .$get(`${USER_API_PATH}/${params.nickname}/portfolios`, {
        params: {
          page: params.page
        }
      })
      .then(data => commit('updatePortfolioList', data))
      .finally(commit('updateFetching', false))
  },
  fetchFollowerList({commit}, params) {
    commit('updateFetching', true);
    commit('updateFollowerList', {})
    return this.$axios
      .$get(`${USER_API_PATH}/${params.nickname}/followers`, {
        params: {
          page: params.page
        }
      })
      .then(data => commit('updateFollowerList', data))
      .finally(commit('updateFetching', false))
  },
  fetchFollowingList({commit}, params) {
    commit('updateFetching', true);
    commit('updateFollowingList', {})
    return this.$axios
      .$get(`${USER_API_PATH}/${params.nickname}/followings`, {
        params: {
          page: params.page
        }
      })
      .then(data => commit('updateFollowingList', data))
      .finally(commit('updateFetching', false))
  }
}
