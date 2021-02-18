<template>
  <el-row>
    <el-col style="margin-bottom: 1rem;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>词典管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col>
      <el-button type="primary" @click="showAddDialog" plain>添加字典</el-button>
      <el-table
        :data="userPage.records"
        style="width: 100%;margin-top: 1rem;">
        <el-table-column
          label="序号"
          width="300"
          prop="id">
        </el-table-column>
        <el-table-column
          label="词典"
          width="300"
          prop="dic">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
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
        :current-page="userPage.current"
        layout="total, prev, pager, next, jumper"
        :total="userPage.total">
      </el-pagination>
    </el-col>
    <el-col>
      <el-dialog :title="title" :visible.sync="dialogVisible">
        <el-form v-model="dic" label-width="80px">
          <el-form-item label="字典">
            <el-input v-model="dic.dic"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" plain>取 消</el-button>
          <el-button type="primary" @click="updateEdit" plain>确 定</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "userDic",
  computed: {},
  data() {
    return {
      userPage: {current: 1, size: 10},
      dic: {},
      title: '',
      dialogVisible: false
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.$axios.$get('/api/lucene/dic/getAll', {
        params: {
          pageNum: this.userPage.current,
          pageSize: this.userPage.size
        }
      }).then((res) => {
        this.userPage = res
      }).catch((err) => {
        console.log(err)
      })
    },
    showAddDialog() {
      this.title = '添加字典信息'
      this.dic = {}
      this.dialogVisible = true
    },
    handleEdit(index, dic) {
      this.dic = dic
      this.dialogVisible = true
    },
    updateEdit() {
      if (!this.dic.id) {
        this.$axios.post(`/api/lucene/dic/addDic/${this.dic.dic}`,).then((res) => {
          if (res) {
            this.$message.info('增加字典成功')
          } else {
            this.$message.warning('增加字典失败！')
          }
          this.dialogVisible = false
          this.loadData(this.pagination)
        }).catch((err) => {
          this.$message.warning(err)
        })
      } else {
        this.$axios.put('/api/lucene/dic/editDic', this.dic).then((res) => {
          if (res) {
            this.$message.info('修改字典成功')
          } else {
            this.$message.warning('增加字典失败！')
          }
          this.dialogVisible = false
        }).catch((err) => {
          this.$message.warning(err)
        })
      }
    },
    handleDelete(index, dic) {
      this.$confirm('确定删除字典？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(`/api/lucene/dic/deleteDic/${dic.id}`).then((res) => {
          if (res) {
            this.$message.info('字典删除成功');
            this.loadData()
          } else {
            this.$message.warning('字典删除失败');
          }
        });
      }).catch(() => {
        this.$message.info('已取消');
      });
    },
    handleCurrentChange(page) {
      this.userPage.current = page;
      this.loadData()
    }
  },
}
</script>

<style scoped>

</style>
