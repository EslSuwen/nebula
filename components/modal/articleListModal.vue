<template>
  <div>
    <el-dialog :visible="dialogVisible" title="文章信息修改" @close="close">
      <el-form ref="articleForm" :model="formData" :rules="rules" size="medium" label-width="100px" :disabled="disableSubmit">
        <el-form-item label="编号" prop="idArticle">
          <el-input v-model="formData.idArticle" :maxlength="11" readonly :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="articleTitle">
          <el-input v-model="formData.articleTitle" placeholder="请输入文章标题" :maxlength="11"
                    :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="articleType">
          <el-select v-model="formData.articleType" placeholder="请选择文章类型" filterable clearable
                     :style="{width: '100%'}">
            <el-option v-for="(item, index) in articleTypeOptions" :key="index" :label="item.label"
                       :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="articleTags">
          <el-select v-model="formData.articleTags" placeholder="请输入文章标签" clearable :style="{width: '100%'}">
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="articleStatus">
          <el-radio-group v-model="formData.articleStatus" size="medium">
            <el-radio v-for="(item, index) in articleStatusOptions" :key="index" :label="item.value"
                      :disabled="true">{{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="访问量" prop="articleViewCount">
          <el-input v-model="formData.articleViewCount" :maxlength="11" readonly :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="作者" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="作者" :maxlength="11" readonly
                    :style="{width: '100%'}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  components: {},
  props: [],
  data() {
    return {
      dialogVisible: false,
      disableSubmit: false,
      formData: {
        idArticle: 0,
        articleTitle: "",
        articleType: 0,
        articleTags: 0,
        articleStatus: "",
        articleViewCount: "",
        nickname: "",
      },
      rules: {
        articleTitle: [{
          required: true,
          message: '请输入文章标题',
          trigger: 'blur'
        }],
        articleType: [{
          required: true,
          message: '请选择文章类型',
          trigger: 'change'
        }],
        articleTags: [{
          required: true,
          message: '请输入文章标签',
          trigger: 'change'
        }],
        articleStatus: [{
          required: true,
          message: '状态不能为空',
          trigger: 'change'
        }],
        articleViewCount: [],
        nickname: [],
      },
      articleTypeOptions: [
        {
          "label": "共享文章",
          "value": "0"
        }, {
          "label": "专业文章",
          "value": "1"
        }, {
          "label": "特殊文章",
          "value": "2"
        }],
      articleStatusOptions: [
        {
          "label": "草稿",
          "value": "1"
        }, {
          "label": "正常",
          "value": "0"
        }, {
          "label": "删除",
          "value": "9"
        }],
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    detail(record) {
      this.edit(record)
      this.disableSubmit = true
    },
    edit(record) {
      Object.assign(this.formData, record)
      this.disableSubmit = false
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
    },
    handleConfirm() {
      this.$refs['articleForm'].validate(valid => {
        if (!valid) return
        this.$emit("confirmEdit", this.formData)
        this.close()
      })
    },
  }
}

</script>
<style>
</style>
