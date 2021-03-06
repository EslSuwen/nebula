<template>
  <el-row class="article__wrapper">
    <el-col>
      <el-card>
        <div class="card-body d-flex flex-column article">
          <div class="article__item">
            <h1 class="list__title">
              <span v-if="isPerfect" style="color: gold;" title="优选">
                <font-awesome-icon :icon="['fas', 'medal']"></font-awesome-icon>
              </span>
              {{ article.articleTitle }}
            </h1>
            <el-row class="pt-5">
              <el-col :xs="3" :sm="1" :xl="1">
                <el-avatar v-if="article.articleAuthorAvatarUrl" :src="article.articleAuthorAvatarUrl"></el-avatar>
                <el-avatar v-else src="https://static.rymcu.com/article/1578475481946.png"></el-avatar>
              </el-col>
              <el-col :xs="9" :sm="11" :xl="11">
                <div style="margin-left: 1rem;">
                  <el-link rel="nofollow" @click="onRouter('user', article.articleAuthorName)" :underline="false"
                           class="text-default">{{ article.articleAuthorName }}
                  </el-link>
                  <small class="d-block text-muted">{{ article.timeAgo }}</small>
                </div>
              </el-col>
              <el-col :xs="12" :sm="12" :xl="12" v-if="user" class="text-right">
                <el-link rel="nofollow" :underline="false" title="总浏览数"><i class="el-icon-s-data"></i><span
                  style="color: red;">{{ article.articleViewCount }}</span>
                </el-link>
              </el-col>
              <el-col style="margin: 1rem 0;">
                <el-col :span="12">
                  <el-tag
                    style="margin-right: 0.5rem;"
                    v-for="tag in article.tags"
                    :key="tag.idTag"
                    size="small"
                    effect="plain">
                    # {{ tag.tagTitle }}
                  </el-tag>
                </el-col>
                <el-col v-if="user" :span="12" style="text-align: right;">
                  <template v-if="user.idUser !== article.articleAuthorId">
                    <el-button size="mini" v-if="isFollow" @click="cancelFollowUser(article.articleAuthorId)" plain>
                      取消关注
                    </el-button>
                    <el-button size="mini" v-else @click="followUser(article.articleAuthorId)" plain>关注</el-button>
                  </template>
                  <el-button size="mini" v-if="hasPermissions" @click="handleCommand('edit')" plain>编辑文章</el-button>
                  <template v-if="isAdmin">
                    <el-button size="mini" @click="handleCommand('editTag')" plain>编辑标签</el-button>
                    <el-button v-if="isPerfect" size="mini" @click="cancelPreference" plain>取消优选</el-button>
                    <el-button v-else size="mini" @click="setPreference" plain>设为优选</el-button>
                  </template>
                  <el-button size="mini" @click="handleCommand('share')" plain>分享</el-button>
                </el-col>
                <el-col v-else :span="12" style="text-align: right;">
                  <el-button size="mini" @click="gotoLogin" plain>关注</el-button>
                  <el-button size="mini" @click="handleCommand('share')" plain>分享</el-button>
                </el-col>
              </el-col>
              <el-col v-if="isShare" style="margin-bottom: 1rem;">
                <share-box :url="shareData.shareUrl"></share-box>
              </el-col>
              <el-col v-if="article.portfolios && article.portfolios.length > 0">
                <portfolios-widget :portfolios="article.portfolios"></portfolios-widget>
              </el-col>
            </el-row>
            <div class="pt-7 pipe-content__reset vditor-reset" id="articleContent" v-html="article.articleContent"
                 style="overflow: hidden;"></div>
          </div>
          <el-row>
            <el-col v-if="article.portfolios && article.portfolios.length > 0">
              <portfolios-widget :portfolios="article.portfolios"></portfolios-widget>
            </el-col>
            <el-col v-if="user">
              <el-tooltip class="item" effect="dark" content="点赞" placement="top-start">
                <el-button type="text" style="font-size: 1.2rem;" @click="thumbsUp">
                  <font-awesome-icon :icon="['far', 'thumbs-up']"></font-awesome-icon>
                  {{ article.articleThumbsUpCount }}
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="赞赏" placement="top-start">
                <el-button v-if="user.idUser === article.articleAuthorId" type="text" icon="el-icon-coffee" style="font-size: 1.2rem;">
                  {{ article.articleSponsorCount }}
                </el-button>
                <el-popconfirm
                  v-else
                  title="赞赏本文作者 20 巴旦木？"
                  @confirm="sponsor"
                >
                  <el-button slot="reference" type="text" icon="el-icon-coffee" style="font-size: 1.2rem;">
                    {{ article.articleSponsorCount }}
                  </el-button>
                </el-popconfirm>
              </el-tooltip>
            </el-col>
            <el-col v-else>
              <el-tooltip class="item" effect="dark" content="点赞" placement="top-start">
                <el-button type="text" style="font-size: 1.2rem;">
                  <font-awesome-icon :icon="['far', 'thumbs-up']"></font-awesome-icon>
                  {{ article.articleThumbsUpCount }}
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="赞赏" placement="top-start">
                <el-button type="text" icon="el-icon-coffee" style="font-size: 1.2rem;">
                  {{ article.articleSponsorCount }}
                </el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-col>
    <el-col>
      <comment-box :fetching="isFetching" :user="user" :avatar="avatar" :title="article.articleTitle"
                   :post-id="routeArticleId" :authorId="article.articleAuthorId"></comment-box>
    </el-col>
    <el-col>
      <el-dialog :visible.sync="dialogVisible">
        <edit-tags
          :idArticle="article.idArticle"
          :tags="article.articleTags"
          @closeDialog="closeTagsDialog">
        </edit-tags>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex';
import ShareBox from '~/components/widget/share';
import PortfoliosWidget from '~/components/widget/portfolios';
import EditTags from '~/components/widget/tags';

export default {
  name: "ArticleDetail",
  components: {
    ShareBox,
    PortfoliosWidget,
    EditTags
  },
  validate({params, store}) {
    return params.article_id && !isNaN(Number(params.article_id))
  },
  fetch({store, params, error}) {
    return Promise.all([
      store
        .dispatch('article/fetchDetail', params)
        .catch(err => error({statusCode: 404})),
      store.dispatch('comment/fetchList', {post_id: params.article_id})
    ])
  },
  computed: {
    ...mapState({
      article: state => state.article.detail.data,
      isFetching: state => state.article.detail.fetching,
      isMobile: state => state.global.isMobile,
      user: state => state.oauth,
      avatar: state => state.userInfo?.avatarURL
    }),
    hasPermissions() {
      let account = this.$store.state.userInfo?.nickname;
      if (account) {
        if (account === this.article.articleAuthor.userNickname) {
          return true;
        }
      }
      return this.$store.getters.hasPermissions('blog_admin');
    },
    isAdmin() {
      return this.$store.getters.hasPermissions('blog_admin');
    },
    routeArticleId() {
      return Number(this.$route.params.article_id);
    }
  },
  head() {
    return {
      title: this.article.articleTitle || 'RYMCU - 嵌入式知识学习交流平台',
      meta: [
        {
          name: 'keywords',
          content: this.article.articleTags || 'RYMCU'
        },
        {
          name: 'description',
          content: this.article.articlePreviewContent
        },
        {
          name: 'site_name',
          content: 'RYMCU'
        },
        {
          name: 'url',
          content: this.article.articlePermalink
        },
        {
          name: 'og:title',
          content: this.article.articleTitle + ' - RYMCU'
        },
        {
          name: 'og:description',
          content: this.article.articlePreviewContent
        },
        {
          name: 'og:site_name',
          content: 'RYMCU'
        },
        {
          name: 'og:url',
          content: this.article.articlePermalink
        }
      ]
    }
  },
  data() {
    return {
      loading: false,
      isShare: false,
      dialogVisible: false,
      isFollow: false,
      isPerfect: false,
      shareData: {}
    }
  },
  methods: {
    onRouter(name, data) {
      this.$router.push(
        {
          path: `/${name}/${data}`
        }
      )
    },
    handleCommand(item) {
      let _ts = this;
      if (item === 'edit') {
        _ts.$router.push({
          path: `/article/post/${_ts.article.idArticle}`
        })
      } else if (item === 'editTag') {
        _ts.$set(_ts, 'dialogVisible', true);
      } else {
        if (_ts.isShare) {
          _ts.$set(_ts, 'isShare', false);
        } else {
          if (_ts.user) {
            _ts.$axios.$get('/api/article/' + _ts.article.idArticle + '/share').then(function (res) {
              if (res) {
                _ts.$set(_ts, 'shareData', res);
                _ts.$set(_ts, 'isShare', true);
              }
            });
          } else {
            _ts.$set(_ts, 'shareData', {shareUrl: _ts.article.articlePermalink});
            _ts.$set(_ts, 'isShare', true);
          }
        }
      }
    },
    gotoLogin() {
      this.$router.push({
        name: 'login',
        query: {
          historyUrl: window.location.href
        }
      })
    },
    closeTagsDialog() {
      this.$set(this, 'dialogVisible', false);
      this.$store.dispatch('article/fetchDetail', this.$route.params);
    },
    followUser(idUser) {
      let _ts = this;
      if (_ts.user) {
        _ts.$axios.$post('/api/follow', {
          followingId: idUser,
          followingType: 0
        }).then(function (res) {
          _ts.$set(_ts, 'isFollow', res);
        })
      } else {
        _ts.gotoLogin();
      }
    },
    cancelFollowUser(idUser) {
      let _ts = this;
      if (_ts.user) {
        _ts.$axios.$post('/api/follow/cancel-follow', {
          followingId: idUser,
          followingType: 0
        }).then(function (res) {
          _ts.$set(_ts, 'isFollow', res);
        })
      } else {
        _ts.gotoLogin();
      }
    },
    setPreference() {
      let _ts = this;
      _ts.$axios.$patch("/api/article/update-perfect", {
        idArticle: _ts.article.idArticle,
        articlePerfect: '1',
      }).then(function (res) {
        if (res) {
          if (res.success) {
            _ts.$set(_ts, 'isPerfect', false);
            _ts.$message.success("设置成功!");
          } else {
            _ts.$message.error(_ts.message);
          }
        }
      })
    },
    cancelPreference() {
      let _ts = this;
      _ts.$axios.$patch("/api/article/update-perfect", {
        idArticle: _ts.article.idArticle,
        articlePerfect: '0',
      }).then(function (res) {
        if (res) {
          if (res.success) {
            _ts.$set(_ts, 'isPerfect', true);
            _ts.$message.success("取消成功!");
          } else {
            _ts.$message.error(_ts.message);
          }
        }
      })
    },
    thumbsUp() {
      let _ts = this;
      _ts.$axios.$post('/api/article/thumbs-up', {
        idArticle: _ts.article.idArticle
      }).then(function (res) {
        if (res) {
          if (res.success) {
            _ts.$message.success(res.message);
            _ts.$store.dispatch('article/updateThumbsUpCount', {thumbsUpNumber: res.thumbsUpNumber})
          } else {
            _ts.$message.error(_ts.message);
          }
        }
      })
    },
    sponsor() {
      let _ts = this;
      _ts.$axios.$post('/api/article/sponsor', {
        dataType: '0',
        dataId: _ts.article.idArticle
      }).then(function (res) {
        if (res) {
          if (res.success) {
            _ts.$message.success(res.message);
            _ts.$store.dispatch('article/updateSponsorCount', {sponsorNumber: 1})
          } else {
            _ts.$message.error(_ts.message);
          }
        }
      })
    }
  },
  mounted() {
    let _ts = this;
    _ts.$store.commit('setActiveMenu', 'articleDetail');
    Vue.nextTick(() => {
      const previewElement = document.getElementById("articleContent");
      // //const outLineElement = document.getElementById("articleToC");
      // VditorPreview.setContentTheme('light');
      Vue.VditorPreview.codeRender(previewElement, 'zh_CN');
      Vue.VditorPreview.highlightRender({"enable": true, "lineNumber": true, "style": "github"}, previewElement);
      Vue.VditorPreview.mathRender(previewElement, {
        math: {"engine": "KaTeX", "inlineDigit": false, "macros": {}},
      });
      Vue.VditorPreview.mermaidRender(previewElement);
      Vue.VditorPreview.graphvizRender(previewElement);
      Vue.VditorPreview.chartRender(previewElement);
      Vue.VditorPreview.mindmapRender(previewElement);
      Vue.VditorPreview.abcRender(previewElement);
      Vue.VditorPreview.mediaRender(previewElement);
      Vue.VditorPreview.lazyLoadImageRender(previewElement);
      //VditorPreview.outlineRender(previewElement, outLineElement);
      window.scrollTo(0, 0);
      _ts.$set(_ts, 'isPerfect', _ts.article.articlePerfect === '1')
    })

    if (_ts.user) {
      _ts.$axios.$get('/api/follow/is-follow', {
        params: {
          followingId: _ts.article.articleAuthorId,
          followingType: 0
        }
      }).then(function (res) {
        _ts.$set(_ts, 'isFollow', res);
      })
    }
  }

}
</script>

<style lang="scss">
@import "~vditor/src/assets/scss/index.scss";

.article__wrapper {
  max-width: 980px;
  margin: 0 auto;
  display: block;
  padding-left: 1rem;
  padding-right: 1rem;
  box-sizing: border-box;
}
</style>
