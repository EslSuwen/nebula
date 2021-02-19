<template>
  <el-row class="wrapper">
    <el-col style="margin-bottom: 1rem;">
      <el-menu type="border-card" :default-active="currentTopic" style="margin-top: -2px;border: 0;" mode="horizontal"
               @select="handleSelectTopic">
        <el-menu-item index="news">最新</el-menu-item>
        <el-menu-item v-for="topic in topicPage.records" :key="topic.idTopic" :index="topic.topicUri">{{topic.topicTitle}}
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "topicNav",
    props: {
      currentTopic: {
        type: String,
        default: 'news'
      }
    },
    computed: {
      ...mapState({
        topicPage: state => state.topic.list.data,
        isFetching: state => state.topic.fetching
      })
    },
    methods: {
      handleSelectTopic(item) {
        this.$router.push({
          path: `/topic/${item}?page=1`
        });
      }
    }
  }
</script>

<style scoped>

</style>
