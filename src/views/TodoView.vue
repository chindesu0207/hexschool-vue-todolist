<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import axios from 'axios'
import { useAuth } from '@/store/auth.js'
import Swal from 'sweetalert2'

const router = useRouter()
const auth = useAuth()

const api = 'https://todolist-api.hexschool.io'

const pageState = ref('all')

const todoList = ref([])

const activeList = computed(() => {
  let list = []
  for (let i = 0; i < todoList.value.length; i++) {
    if (pageState.value == 'all') {
      list.push(todoList.value[i])
    } else if (pageState.value == 'todo' && !todoList.value[i].status) {
      list.push(todoList.value[i])
    } else if (pageState.value == 'done' && todoList.value[i].status) {
      list.push(todoList.value[i])
    }
  }
  return list
})

const signOut = () => {
  document.cookie = `todoToken=true; max-age=0;`
  auth.token = ''
  auth.nickname = ''
  auth.isAuth = false
  todoList.value = []
  router.push('/')
}

const newTodo = ref({
  content: ''
})

const addTodo = async (todoItem) => {
  // console.log(todoItem);
  
  if (todoItem != '') {
    try {
      const res = await axios.post(
        `${api}/todos/`,
        { content: todoItem },
        {
          headers: {
            Authorization: auth.token
          }
        }
      )
      newTodo.value.content =''
      getTodos()
    } catch (error) {
      console.log(error)
    }
  } else {
    Swal.fire({
      title: '請填入待辦內容',
      icon: 'error',
      confirmButtonText: 'OK',
      timer: 2000
    })
  }
}
const doneNum = ref(0)

const getTodos = async () => {
  try {
    const res = await axios.get(`${api}/todos/`, {
      headers: {
        Authorization: auth.token
      }
    })
    todoList.value = res.data.data
    doneNum.value = 0
    for (let i = 0; i < todoList.value.length; i++) {
      if (todoList.value[i].status) {
        doneNum.value++
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const tempTodo = ref({
  content: ''
})

const prepareEdit = (todo) => {
  tempTodo.value = { ...todo }
}

const cancelEdit = () => {
  tempTodo.value = {}
}

const editTodo = async (todo) => {
  if(tempTodo.value.content != todo.content){
    try {
      const res = await axios.put(`${api}/todos/${todo.id}`, tempTodo.value, {
        headers: {
          Authorization: auth.token
        }
      })
      tempTodo.value = {}
      getTodos()
    } catch (error) {
      console.log(error)
    }
  }else{
    Swal.fire({
      title: '待辦內容未更新',
      icon: 'error',
      confirmButtonText: 'OK',
      timer: 2000
    })
  }
}

const deleteTodo = (id) => {
  Swal.fire({
    title: '確認要刪除嗎?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '是',
    cancelButtonText: '否'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`${api}/todos/${id}`, {
          headers: {
            Authorization: auth.token
          }
        })
        getTodos().then(() => {
          Swal.fire({
            title: 'Deleted!',
            text: '成功刪除',
            icon: 'success'
          })
        })
      } catch (error) {
        console.log(error)
      }
    }
  })
}

const updateStatus = async (id) => {
  try {
    const res = await axios.patch(
      `${api}/todos/${id}/toggle`,
      {},
      {
        headers: {
          Authorization: auth.token
        }
      }
    )
    getTodos()
  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  await auth.authCheck()
  if (auth.isAuth) {
    getTodos()
  } else {
    Swal.fire({
      title: '未登入',
      icon: 'error',
      text: '即將導向登入頁面',
      confirmButtonText: 'OK',
      timer: 2000
    })
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
})

const oneButton = () => {
  const inputData = ['新增待辦事項', '切換待辦事項狀態', '修改待辦事項', '移除待辦事項']
  for (let i = 0; i < inputData.length; i++) {
    addTodo(inputData[i])
  }
}

const deleteAll = () => {
  Swal.fire({
    title: '確認要全部刪除嗎?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '是',
    cancelButtonText: '否'
  }).then(async (result) => {
    if (result.isConfirmed) {
      for (let i = 0; i < todoList.value.length; i++) {
        await axios.delete(`${api}/todos/${todoList.value[i].id}`, {
          headers: {
            Authorization: auth.token
          }
        })
      }
      getTodos().then(() => {
        Swal.fire({
          title: 'Deleted!',
          text: '已刪除所有待辦',
          icon: 'success'
        })
      })
    }
  })
}
</script>
<template>
  <div id="todoListPage" class="bg-half">
    <input type="button" class="oneButton" @click.prevent="oneButton" value="一鍵加入" />
    <input type="button" class="deleteAll" @click.prevent="deleteAll" value="全部刪除" />
    <nav>
      <a href="#"
        ><img
          class="logoImg_nav"
          src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png"
          alt=""
      /></a>
      <ul v-if="auth.isAuth">
        <li class="todo_sm">
          <a href="#"
            ><span>{{ auth.nickname }}的待辦</span></a
          >
        </li>
        <li><a @click="signOut">登出</a></li>
      </ul>
    </nav>
    <div class="conatiner todoListPage vhContainer">
      <div class="todoList_Content">
        <div class="inputBox">
          <input type="text" placeholder="請輸入待辦事項" v-model="newTodo.content" />
          <a @click="addTodo(newTodo.content)">
            <i class="fa fa-plus"></i>
          </a>
        </div>
        <div class="todoList_list">
          <ul class="todoList_tab">
            <li>
              <a @click.prevent="pageState = 'all'" :class="[pageState == 'all' ? 'active' : '']"
                >全部</a
              >
            </li>
            <li>
              <a @click.prevent="pageState = 'todo'" :class="[pageState == 'todo' ? 'active' : '']"
                >待完成</a
              >
            </li>
            <li>
              <a @click.prevent="pageState = 'done'" :class="[pageState == 'done' ? 'active' : '']"
                >已完成</a
              >
            </li>
          </ul>
          <div class="todoList_items">
            <div class="noTodo" v-if="todoList.length == 0">
              <p>目前尚無待辦事項</p>
            </div>
            <ul class="todoList_item">
              <li v-for="todo in activeList" :key="todo.id">
                <label class="todoList_label" v-if="todo.id === tempTodo.id">
                  <input class="todoList_input_edit" type="text" v-model="tempTodo.content" />
                </label>
                <label class="todoList_label" v-else>
                  <input
                    class="todoList_input"
                    type="checkbox"
                    value="true"
                    @click="updateStatus(todo.id)"
                    v-model="todo.status"
                  />
                  <span>{{ todo.content }}</span>
                </label>
                <div class="todoList_btn" v-if="todo.id === tempTodo.id">
                  <a @click="editTodo(todo)">
                    <i class="fa-regular fa-circle-check fa-2xl"></i>
                  </a>
                  <a @click="cancelEdit">
                    <i class="fa-regular fa-circle-xmark fa-2xl"></i>
                  </a>
                </div>
                <div class="todoList_btn" v-else>
                  <a @click="prepareEdit(todo)">
                    <i class="fa-solid fa-pen-to-square fa-2xl"></i>
                  </a>
                  <a @click="deleteTodo(todo.id)">
                    <i class="fa-solid fa-trash-can fa-2xl"></i>
                  </a>
                </div>
              </li>
            </ul>
            <div class="todoList_statistics">
              <p>{{ todoList.length - doneNum }} 個待完成項目</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
