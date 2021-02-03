<template>
  <div>
    <!--        <div class="box">-->
    <!--          <div class="searchBox">-->
    <!--            <input type="text" v-model="keyword" placeholder="请输入关键词进行搜索" class="searchInput" style="padding-left: 10px;">-->
    <!--            <el-button @click="search" type="info">信息按钮</el-button>-->
    <!--          </div>-->
    <!--        </div>-->
    <div class="search-box"
         :class="articles.articles.length===0?'search-box-nodata':'search-box-data'">
      <el-input
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        @change="search"
        v-model="keyword">
      </el-input>
    </div>
    <el-row class="wrapper">
      <el-col :xs="24" :sm="24" :xl="24" style="margin: 0 auto;">
        <el-col v-for="article in articles.articles" :key="article.idArticle" style="padding-bottom: 1rem;">
          <el-card>
            <div class="card-body d-flex flex-column">
              <el-link rel="nofollow" @click="onRouter('article',article.articleLink)" :underline="false"
                       style="margin-bottom: .5rem;">
                <h4>
                <span v-if="isPerfect(article.articlePerfect)" style="color: gold;" title="优选">
                  <font-awesome-icon :icon="['fas', 'medal']"></font-awesome-icon>
                </span>
                  <span v-html="article.articleTitle"></span>
                </h4>
              </el-link>
              <el-tag
                style="margin-left: 0.5rem;"
                v-for="tag in article.tags"
                :key="tag.idTag"
                size="mini"
                effect="plain">
                # {{ tag.tagTitle }}
              </el-tag>
              <div class="text-muted article-summary-md"><span v-html="article.articlePreviewContent"></span></div>
              <el-row class="pt-5">
                <el-col :xs="3" :sm="1" :xl="1" class="mr-3">
                  <el-avatar v-if="article.articleAuthorAvatarUrl" size="medium"
                             :src="article.articleAuthorAvatarUrl"></el-avatar>
                  <el-avatar v-else size="medium"
                             src="https://static.rymcu.com/article/1578475481946.png"></el-avatar>
                </el-col>
                <el-col :xs="16" :sm="16" :xl="16">
                  <div>
                    <el-link rel="nofollow" @click="onRouter('user', article.articleAuthorName)" :underline="false"
                             class="text-default">
                      {{ article.articleAuthorName }}
                    </el-link>
                    <small class="d-block text-muted">{{ article.timeAgo }}</small>
                  </div>
                </el-col>
                <el-col class="text-right">
                  <el-link rel="nofollow" :underline="false" title="总浏览数"><i class="el-icon-s-data"></i><span
                    style="color: red;">{{ article.articleViewCount }}</span>
                  </el-link>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col>
          <div class="vertical-container text-center">
            <el-pagination :hide-on-single-page="true" v-model="articles.pagination"
                           layout="prev, pager, next"
                           :page-size="articles.pagination.pageSize"
                           :current-page="articles.pagination.currentPage"
                           :total="articles.pagination.total"
                           prev-text="上一页"
                           next-text="下一页"
                           @current-change="currentChange">
            </el-pagination>
          </div>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import ArticleList from '~/components/archive/list'

export default {

  name: 'search',
  components: {ArticleList},
  data() {
    return {
      keyword: undefined,
      articles: {pagination: {pageSize: 0, currentPage: 0, total: 0}, articles: []},
    }
  },
  created() {
    this.keyword = this.$router.currentRoute.query.keywords
    if (this.keyword) {
      this.search()
    }
  },
  methods: {
    search($event, pageNum) {
      this.articles = {pagination: {pageSize: 0, currentPage: 0, total: 0}, articles: []}
      if (!this.keyword || this.keyword.length === 0) {
        return
      }
      if (!pageNum) {
        pageNum = 1
      }
      this.$axios.$get(`/api/lucene/searchArticle/${this.keyword}?pageNum=${pageNum}`).then((res) => {
        if (res) {
          this.articles = res
        } else {
          this.$message.info('未找到相关文章！')
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    currentChange(pageNum) {
      this.search(null, pageNum)
    },
    onRouter(name, data) {
      if ("article" === name) {
        let routeData = this.$router.resolve({
          path: data
        });
        window.open(routeData.href, '_blank');
      } else {
        let routeData = this.$router.resolve({
          path: '/user/' + data
        });
        window.open(routeData.href, '_blank');
      }
    },
    isPerfect(articlePerfect) {
      return articlePerfect === '1';
    },
  },
  mounted() {
  }
}
</script>

<style>
/*.box {*/
/*  margin: 0 auto;*/
/*  padding-top: 80px;*/
/*  height: 50px;*/
/*  width: 100%;*/
/*}*/

.search-box {
  transition: all 800ms;
}

.search-box-data {
  margin: 0 auto 20px;
  width: 90%;
  max-width: 946px;
}

.search-box-nodata {
  width: 90%;
  max-width: 946px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}


/*.searchInput {*/
/*  display: inline-block;*/
/*  width: 85%;*/
/*  height: 38px;*/
/*  border: 1px solid #cccccc;*/
/*  float: left;*/
/*  box-sizing: border-box;*/
/*  -moz-box-sizing: border-box; !* Firefox *!*/
/*  -webkit-box-sizing: border-box; !* Safari *!*/
/*  border-bottom-left-radius: 5px;*/
/*  border-top-left-radius: 5px;*/
/*}*/
</style>
