<template>
  <el-row>
    <el-col>
      <h1>账户安全</h1>
    </el-col>
    <el-col>
      <el-form :model="user" ref="user" label-width="100px">
        <el-form-item label="新密码" prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
          <el-input type="password" v-model="user.password" placeholder="请输入新密码" autocomplete="off"
                    show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword"
                      :rules="[{ required: true, message: '请输入确认密码', trigger: 'blur' }]">
          <el-input type="password" v-model="user.confirmPassword" placeholder="请再次输入新密码" autocomplete="off"
                    show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round plain @click="updatePassword">提交</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "security",
  computed: {
    ...mapState({
      idUser: state => state.oauth.idUser
    })
  },
  data() {
    return {
      user: {},
      rules: {},
      password: '',
      confirmPassword: '',
      emailForm: {
        email: '',
        code: ''
      },
      dialogVisible: false,
      loading: false,
      loadText: '发送验证码',
      btnLoading: false
    }
  },
  methods: {
    getData() {
      let _ts = this;
      _ts.$axios.$get('/api/user-info/detail/' + _ts.idUser).then(function (res) {
        _ts.$set(_ts, 'user', res.user);
      })
    },
    updatePassword() {
      let _ts = this;
      _ts.$refs.user.validate((valid) => {
        if (valid) {
          let password = _ts.user.password;
          let confirmPassword = _ts.user.confirmPassword;
          if (password === confirmPassword) {
            _ts.$axios.$patch('/api/user-info/update-password', {
              idUser: _ts.idUser,
              password: password
            }).then(function (data) {
              if (data) {
                _ts.$message(data);
                let user = _ts.user;
                user.password = '';
                user.confirmPassword = '';
                _ts.$set(_ts, 'user', user);
              }
            })
          } else {
            _ts.$message("两次输入的密码不一致!");
          }
        }
      })
    }
  },
  mounted() {
    this.$store.commit('setActiveMenu', 'security');
    this.getData();
  }
}
</script>

<style scoped>

</style>
