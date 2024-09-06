<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

const router = useRouter()

const api = 'https://todolist-api.hexschool.io'

const signInData = ref({
  email: '',
  password: ''
})

const errorMsg = ref({
  email: '',
  password: ''
})

const emailRule = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
const passwordRule = /^[A-Za-z\d@$!%*?&]{6,}$/;

const isPass = ref(false)

const errorHandle = () =>{
  if(!signInData.value.email){
    errorMsg.value.email="email 欄位未提供"
  }else if(!signInData.value.email.match(emailRule)){
    errorMsg.value.email="email 格式錯誤"
  }

  if(!signInData.value.password){
    errorMsg.value.password="password 欄位未提供"    
  }else if(!signInData.value.password.match(passwordRule)){
    errorMsg.value.password="password 長度不足 6 個字"
  }

  if(Object.keys(errorMsg.value).length==0){
    isPass.value = true
  }
}

const signIn = async () => {
  errorMsg.value = {}
  errorHandle();
  if(isPass.value){
    try {
      const res = await axios.post(`${api}/users/sign_in`, signInData.value)
      document.cookie = `todoToken=${res.data.token};`
      signInData.value = {}
      errorMsg.value = {}
      Swal.fire({
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 2000,
        icon: 'success',
        title: '登入成功'
      })
      router.push('/todo')
    } catch (error) {
      let msg = error.response.data.message      
      if (!Array.isArray(msg)) {
        Swal.fire({
          title: msg,
          icon: 'error',
          timer: 2000,
          confirmButtonText: '關閉'
        })
      }
    }
  }
}
</script>
<template>
  <div id="loginPage" class="bg-yellow">
    <div class="conatiner loginPage vhContainer">
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
          <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
          <label class="formControls_label" for="email">Email</label>
          <input
            class="formControls_input"
            type="text"
            id="email"
            name="email"
            placeholder="請輸入 email"
            v-model="signInData.email"
            required
          />
          <span>{{ errorMsg.email }}</span>
          <label class="formControls_label" for="pwd">密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請輸入密碼"
            v-model="signInData.password"
            required
          />
          <span>{{ errorMsg.password }}</span>
          <input class="formControls_btnSubmit" type="button" value="登入" @click="signIn" />
          <RouterLink class="formControls_btnLink" to="/signup">註冊帳號</RouterLink>
        </form>
      </div>
    </div>
  </div>
</template>
