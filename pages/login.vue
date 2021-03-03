<template>
  <el-row class="wrapper verify" style="background-color: #F6F7F8;padding-top: 10%;">
    <el-col :xs="24" :sm="12" :xl="12" class="verify-wrap flex-inline">
      <el-form :model="user" ref="user" status-icon label-width="100px" style="width: 375px;">
        <el-form-item>
          <img src="~/assets/rymcu.png" alt="RYMCU" class="icon-rymcu">
        </el-form-item>
        <el-form-item style="text-align: center;margin-top: 4rem">
          <el-button type="primary"
                     style="width: 100%"
                     @click="onThirdLogin"
                     :loading="loginLoading" plain>
            <img alt="GitLab" src="@/assets/gitlab.svg" width="20">
            <span>&nbspGitLab&nbsp登录</span>
          </el-button>
        </el-form-item>
        <div style="margin-top: 2rem;margin-left: 5rem;text-align: center;" @click="handOtherLogin">
          <i v-show="otherLogin" class="el-icon-arrow-up">其他登录</i>
          <i v-show="!otherLogin" class="el-icon-arrow-down">其他登录</i>
        </div>
        <div style="margin-top: 2rem" v-show="otherLogin">
          <el-form-item label="账号" prop="account" :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]">
            <el-input v-model="user.account" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
            <el-input type="password" v-model="user.password" autocomplete="off" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 60%;" type="primary" @click="login" :loading="loginLoading" plain>立即登录</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-col>
    <el-col :xs="24" :sm="12" :xl="12" class="intro vditor-reset verify__sign">
      <div>
        <h2>欢迎来到 RYMCU</h2>
        <p><a rel="nofollow" href="/">RYMCU</a> 是一个知识共享平台。</p>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from 'vuex';
import apiConfig from "@/config/api.config";

const Cookie = process.client ? require('js-cookie') : undefined
export default {
  name: "login",
  middleware: 'notAuthenticated',
  data() {
    return {
      otherLogin: false,
      user: {
        account: '',
        password: ''
      },
      forgetForm: {
        email: ''
      },
      forget: false,
      loading: false,
      loginLoading: false,
      historyUrl: ''
    }
  },
  computed: {
    ...mapState({
      article: state => state.article.detail.data
    })
  },
  methods: {
    handOtherLogin() {
      return this.otherLogin = !this.otherLogin
    },
    login() {
      let _ts = this;
      _ts.$refs.user.validate((valid) => {
        if (valid) {
          _ts.$set(_ts, 'loginLoading', true);
          setTimeout(function () {
            _ts.$set(_ts, 'loginLoading', false);
          }, 10000);

          let data = {
            account: _ts.user.account,
            password: _ts.user.password
          }

          _ts.$axios.$post('/api/console/login', data).then(function (res) {
            _ts.$set(_ts, 'loginLoading', false);
            if (res) {
              let auth = {
                accessToken: res.token,
                idUser: res.idUser,
                role: res.weights
              }
              let user = {
                nickname: res.nickname,
                avatarURL: res.avatarUrl
              }
              _ts.$store.commit('setAuth', auth) // mutating to store for client rendering
              localStorage.setItem('user', JSON.stringify(user))
              _ts.$store.commit('setUser', user) // mutating to store for client rendering
              Cookie.set('auth', auth)
              if (_ts.historyUrl) {
                window.location.href = _ts.historyUrl
              } else {
                _ts.$router.push({
                  name: 'index'
                })
              }
            }
          })
        } else {
          return false;
        }
      });
    },
    thirdLoginCallBack(params) {
      if (!params || !params.token) {
        return
      }
      this.doThirdLogin(params)
    },
    //第三方登录
    onThirdLogin() {
      window.location.href = '/api/thirdLogin/render/gitlab'
    },
    // 根据token执行登录
    doThirdLogin(data) {
      let _ts = this;
      console.log(data)
      let auth = {
        accessToken: data.token,
        idUser: data.idUser,
        role: data.weights
      }
      let user = {
        nickname: data.nickname,
        avatarURL: data.avatarURL
      }
      _ts.$store.commit('setAuth', auth) // mutating to store for client rendering
      localStorage.setItem('user', JSON.stringify(user))
      _ts.$store.commit('setUser', user) // mutating to store for client rendering
      Cookie.set('auth', auth)
      if (_ts.historyUrl) {
        window.location.href = _ts.historyUrl
      } else {
        _ts.$router.push({
          name: 'index'
        })
      }
    },
  },
  mounted() {
    this.$store.commit('setActiveMenu', 'login');
    this.$set(this, 'historyUrl', this.$route.query.historyUrl || '');
    this.thirdLoginCallBack(this.$route.query)
  }
}
</script>

<style scoped>
.icon-rymcu {
  margin: 0 auto;
  display: block;
  height: 4rem;
}

.verify .verify-wrap {
  /*width: 60%;*/
}

.flex-inline {
  display: flex;
  align-items: center;
}

.verify .intro {
  padding: 50px;
  background-color: #f1f7fe;
  /*width: 40%;*/
  color: #616161;
}

.verify__sign {
  background-color: transparent !important;
}

.vditor-reset {
  font-variant-ligatures: no-common-ligatures;
  font-family: Helvetica Neue, Luxi Sans, DejaVu Sans, Tahoma, Hiragino Sans GB, Microsoft Yahei, sans-serif, Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, Segoe UI Symbol, Android Emoji, EmojiSymbols;
  word-wrap: break-word;
  overflow: auto;
  line-height: 1.5;
  font-size: 16px;
  word-break: break-word;
}
</style>
