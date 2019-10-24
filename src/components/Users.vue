<template>
  <div class="users">
    这是users组件
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      userList: [],
      query: '',
      pagenum: 1,
      pagesize: 4
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    getUserList () {
      const token = localStorage.getItem('token')
      axios.get('http://localhost:8888/api/private/v1/users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        },
        headers: { Authorization: token }
      }).then(res => {
        console.log(res.data)
      })
    }
  }
}
</script>

<style>

</style>
