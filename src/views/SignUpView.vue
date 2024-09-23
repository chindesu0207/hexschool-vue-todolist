<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

const router = useRouter()

const api = 'https://todolist-api.hexschool.io'

const signUpData = ref({
  email: '',
  nickname: '',
  password: '',
  checkPwd: ''
})

const errorMsg = ref({
  email: '',
  password: '',
  nickname: '',
  checkPwd: ''
})

const emailRule = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
const passwordRule = /^[A-Za-z\d@$!%*?&]{6,}$/

const isFormValidated = () => {
  if (!signUpData.value.email) {
    errorMsg.value.email = 'email 欄位未提供'
  } else if (!signUpData.value.email.match(emailRule)) {
    errorMsg.value.email = 'email 格式錯誤'
  }

  if (!signUpData.value.nickname) {
    errorMsg.value.nickname = 'nickname 欄位未提供'
  }

  if (!signUpData.value.password) {
    errorMsg.value.password = 'password 欄位未提供'
  } else if (!signUpData.value.password.match(passwordRule)) {
    errorMsg.value.password = 'password 長度不足 6 個字'
  }

  if (!signUpData.value.checkPwd) {
    errorMsg.value.checkPwd = ' 請再次輸入 password'
  } else if (signUpData.value.password != signUpData.value.checkPwd) {
    errorMsg.value.checkPwd = ' password 不相符'
  }

  if (Object.keys(errorMsg.value).length == 0) {
    return true
  }
}

const signUp = async () => {
  errorMsg.value = {}

  if (isFormValidated()) {
    try {
      const res = await axios.post(`${api}/users/sign_up`, signUpData.value)
      signUpData.value = {}
      errorMsg.value = {}
      Swal.fire({
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 2000,
        icon: 'success',
        title: '註冊成功'
      })
      router.push('/login')
    } catch (error) {
      let msg = error.response.data.message
      errorMsg.value = {}
      if (!Array.isArray(msg)) {
        Swal.fire({
          title: msg,
          timer: 2000,
          icon: 'error',
          confirmButtonText: '關閉'
        })
      }
    }
  }
}
</script>
<template>
  <div id="signUpPage" class="bg-yellow">
    <div class="conatiner signUpPage vhContainer">
      <div class="side">
        <a href="#"
          ><img
            class="logoImg"
            src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png"
            alt=""
        /></a>
        <img
          class="d-m-n"
          src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png"
          alt="workImg"
        />
      </div>
      <div>
        <form class="formControls" action="index.html">
          <h2 class="formControls_txt">註冊帳號</h2>
          <label class="formControls_label" for="email">Email</label>
          <input
            class="formControls_input"
            type="text"
            id="email"
            name="email"
            placeholder="請輸入 email"
            v-model="signUpData.email"
            required
          />
          <span>{{ errorMsg.email }}</span>
          <label class="formControls_label" for="name">您的暱稱</label>
          <input
            class="formControls_input"
            type="text"
            name="name"
            id="name"
            placeholder="請輸入您的暱稱"
            v-model="signUpData.nickname"
            required
          />
          <span>{{ errorMsg.nickname }}</span>
          <label class="formControls_label" for="pwd">密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請輸入密碼"
            v-model="signUpData.password"
            required
          />
          <span>{{ errorMsg.password }}</span>
          <label class="formControls_label" for="pwd">再次輸入密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd"
            id="checkPwd"
            placeholder="請再次輸入密碼"
            v-model="signUpData.checkPwd"
            required
          />
          <span>{{ errorMsg.checkPwd }}</span>
          <input class="formControls_btnSubmit" type="button" @click="signUp" value="註冊帳號" />
          <RouterLink class="formControls_btnLink" to="login">登入</RouterLink>
        </form>
      </div>
    </div>
  </div>
</template>
