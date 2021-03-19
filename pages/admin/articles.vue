<template>
  <el-row>
    <el-col style="margin-bottom: 1rem;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>字典管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col>
      <el-table
        v-loading="loading"
        :data="articlePage.records"
        :row-class-name="tableRowClassName"
        style="width: 100%;margin-top: 1rem;"
        @row-click="handleUpdateArticle">
        <el-table-column
          label="序号"
          width="60"
          prop="idArticle">
        </el-table-column>
        <el-table-column
          label="标题"
          width="300"
          prop="articleTitle">
        </el-table-column>
        <el-table-column
          label="类型"
          width="100"
          prop="articleType">
        </el-table-column>
        <el-table-column
          label="标签"
          width="100"
          prop="articleTags">
        </el-table-column>
        <el-table-column
          label="状态"
          width="50"
          prop="articleStatus">
        </el-table-column>
        <el-table-column
          label="访问量"
          width="80"
          prop="articleViewCount">
        </el-table-column>
        <el-table-column
          label="作者"
          width="100"
          prop="nickname">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-show="scope.row.deleted === 0" size="mini" @click="handleEdit(scope.$index, scope.row)" plain>
              编辑
            </el-button>
            <el-button v-show="scope.row.deleted === 0" size="mini" type="danger"
                       @click="handleDelete(scope.$index, scope.row)" plain>删除
            </el-button>
            <el-button v-show="scope.row.deleted === 1" size="mini" type="danger"
                       @click="revokeDelete(scope.row.idArticle)" plain>撤销删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col>
      <el-pagination
        :hide-on-single-page="true"
        @current-change="handleCurrentChange"
        :current-page="articlePage.current"
        layout="total, prev, pager, next, jumper"
        :total="articlePage.total">
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>

export default {
  name: "articleList",
  components: {},
  watch: {
    '$route.query': function () {
      this.articlePage.current = Number(this.$route.query.page) || 1
      this.loadData()
    }
  },
  computed: {},
  data() {
    return {
      loading: false,
      articlePage: {current: 1, size: 10},
      article: {},
      title: '',
      dialogVisible: false,
      url: {
        list: '/api/article/list',
        edit: '/api/article/update',
        remove: '/api/article/delete',
      }
    }
  },
  created() {
    this.articlePage.current = Number(this.$route.query.page) || 1
    this.loadData()
  },
  methods: {
    async loadData() {
      this.articlePage = await this.$axios.$get(this.url.list, {
        params: {
          pageNum: this.articlePage.current,
          pageSize: this.articlePage.size
        }
      })
    },
    handleEdit(index, article) {
      this.$router.push({path: `/article/post/${article.idArticle}`,})
    },
    async updateEdit(formData) {
      await this.$axios.put(this.url.edit, formData)
      this.dialogVisible = false
      await this.loadData()
    },
    handleDelete(index, article) {
      this.$confirm('确定删除文章？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.loading = true
        await this.$axios.delete(`${this.url.remove}/${article.idArticle}`)
        await this.loadData().finally(() => this.loading = false)
      }).catch(() => {
        this.$message.info('已取消');
      });
    },
    handleCurrentChange(page) {
      this.articlePage.current = page;
      this.$router.push({
        name: 'admin-articles',
        query: {
          page: page
        }
      })
    },
    handleUpdateArticle(row, col) {
      if (col.label !== '操作')
        this.$router.push({
          path: row.articleLink
        })
    },
    tableRowClassName({row, rowIndex}) {
      if (row.deleted === 1) {
        return 'delete-status';
      } else if (row.articleStatus === '1') {
        return 'draft-status';
      }
      return '';
    },
    async revokeDelete(idArticle) {
      this.loading = true
      await this.$axios.$delete(`/api/article/revokeDelete/${idArticle}`)
      await this.loadData().finally(() => this.loading = false)
    },
  }
}
</script>

<style>
.el-table .delete-status {
  background: #e971b5;
}

.el-table .draft-status {
  background: #b78848;
}

</style>
