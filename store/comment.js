/**
 * @file 评论数据状态 / ES module
 * @module store/comment
 * @author Ronger <https://github.com/ronger-x>
 */

export const COMMENT_API_PATH = '/api/article/'
export const LIKE_COMMENT_API_PATH = '/like/comment'


export const state = () => {
  return {
    fetching: false,
    posting: false,
    commentPage: {}
  }
}

export const mutations = {
  // 请求列表
  updateListFetching(state, action) {
    state.fetching = action
  },
  updateListData(state, action) {
    state.commentPage = action
  },
  clearListData(state) {
    state.commentPage = {}
  },
  // 发布评论
  updatePostFetching(state, action) {
    state.posting = action
  },
  updateListNewItemData(state, action) {
    state.data.pagination.total += 1
    state.data.data.push(action.result)
  },

  // 喜欢某条评论
  updateLikesIncrement(state, action) {
    state.data.data.find(comment => {
      const isMatched = comment.id === action.id
      isMatched && comment.likes++
      return isMatched
    })
  }
}

export const actions = {
  fetchList({commit, rootState}, params = {}) {
    commit('updateListData', {})
    commit('updateListFetching', true)
    return this.$axios
      .$get(COMMENT_API_PATH + `${params.post_id}/comments`)
      .then(data => commit('updateListData', data))
      .finally(commit('updateListFetching', false))
  },

  // 发布评论
  fetchPostComment({commit}, comment) {
    commit('updatePostFetching', true)
    return this.$axios
      .$post(COMMENT_API_PATH, comment)
      .then(response => {
        commit('updateListNewItemData', response)
        commit('updatePostFetching', false)
        return Promise.resolve(response)
      })
      .catch(error => {
        commit('updatePostFetching', false)
        return Promise.reject(error)
      })
  },

  // 喜欢评论
  fetchLikeComment({commit}, comment) {
    return this.$axios
      .$patch(LIKE_COMMENT_API_PATH, {comment_id: comment.id})
      .then(response => {
        commit('updateLikesIncrement', comment)
        return Promise.resolve(response)
      })
  }
}
