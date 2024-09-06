<template>
  <div class="bg-yellow">
    <div class="container vhContainer flex">
      <div class="content">
        <h1>404</h1>
        <p>Page not found</p>
      </div>
    </div>
  </div>
</template>
<style>
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
}
.container h1 {
  font-size: 200px;
  text-align: center;
}

@media (max-width: 576px) {
  .flex {
    font-size: 30px;
  }
  .container h1 {
    font-size: 100px;
  }
}
</style>
