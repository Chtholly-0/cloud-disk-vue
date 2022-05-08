<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less" scoped>
#app {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  // 谷歌
  -webkit-user-select: none; 
  // 火狐
  -moz-user-select: none;
  user-select: none;
}
</style>