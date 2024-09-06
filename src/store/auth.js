import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const api = 'https://todolist-api.hexschool.io'

export const useAuth = defineStore('auth', () => {
  const isAuth = ref(false)
  const token = ref('')
  const nickname = ref('')

  async function authCheck() {
    const cookieToken = document.cookie.replace(
      /(?:(?:^|.*;\s*)todoToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    )
    if (cookieToken) {
      try {
        token.value = cookieToken
        const res = await axios.get(`${api}/users/checkout`, {
          headers: {
            Authorization: token.value
          }
        })
        nickname.value = res.data.nickname
        isAuth.value = true
      } catch (error) {
        isAuth.value = false
        console.log(error)
      }
    }
  }

  return { authCheck, isAuth, token, nickname }
})
