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
        :data="articlePage.records"
        :row-class-name="tableRowClassName"
        style="width: 100%;margin-top: 1rem;"
        @row-click="handleUpdateArticle"
      >
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
          width="100"
          prop="articleStatus">
        </el-table-column>
        <el-table-column
          label="访问量"
          width="100"
          prop="articleViewCount">
        </el-table-column>
        <el-table-column
          label="作者"
          width="100"
          prop="nickname">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDetail(scope.$index, scope.row)" plain>详情</el-button>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" plain>编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" plain>删除</el-button>
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
    <el-col>
      <article-list-modal ref="articleModal" @confirmEdit="updateEdit"></article-list-modal>
    </el-col>
  </el-row>
</template>

<script>
import ArticleListModal from "~/components/modal/articleListModal";

export default {
  name: "articleList",
  components: {ArticleListModal},
  watch: {
    '$route.query': function () {
      this.articlePage.current = Number(this.$route.query.page) || 1
      this.loadData()
    }
  },
  computed: {},
  data() {
    return {
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
    this.articlePage.current = this.$route.query.page || 1
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
      if (article.articleStatus !== "0") {
        this.$message.warning('删除或草稿状态的文章不允许修改！')
        return
      }
      this.$refs.articleModal.edit(article)
    },
    handleDetail(index, article) {
      this.$refs.articleModal.detail(article)
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
        await this.$axios.delete(`${this.url.remove}/${article.idArticle}`)
        await this.loadData()
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
      if (row.articleStatus === '1') {
        return 'draft-status';
      } else if (row.articleStatus === '9') {
        return 'delete-status';
      }
      return '';
    }
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
