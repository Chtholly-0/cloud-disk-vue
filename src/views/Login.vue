<template>
  <!-- 登录页 -->
  <div class="login-page">
    <!-- 登录框 -->
    <div class="login-box">
      <!-- 登录图标 -->
      <div class="login-avatar">
        <img src="../assets/img/cloud.jpg" />
      </div>
      <!-- 标题 -->
      <span class="login-title">登录</span>
      <!-- form表单 -->
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" class="login-form" label-width="0">
        <!-- 账号 -->
        <el-form-item prop="accountId">
          <el-input
            v-model="loginForm.accountId"
            placeholder="账号"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="密码"
            prefix-icon="el-icon-lock"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 登录或重置 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      // 登录表单
      loginForm: {
        accountId: "",
        password: "",
      },
      // 校验规则
      rules: {
        accountId: [
           { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    // 登录提交
    onSubmit() {
      this.$api.login(this.loginForm).then(res => {
        if (res.code == 200) {
          window.localStorage.setItem("Authorization", res.data)
          this.$message.success(res.message)
          this.$router.push('/home')
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    }
  }
};
</script>

<style lang="less" scoped>
// 登录页css 整页
.login-page {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url("../assets/img/login.jpg");
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
// 登录框css
.login-box {
  width: 450px;
  height: 380px;
  background-color: #fff;
  border-radius: 3px;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.3);
}
// 登录图标
.login-avatar {
  height: 110px;
  width: 110px;
  border: 1px solid #eee;
  border-radius: 50%;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
// 登录标题
.login-title {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
  color: #ddd;
}
// 登录表单
.login-form {
  position: absolute;
  bottom: 10px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;

  .el-form-item {
    padding: 5px 0;
  }
}
// 按钮
.btns {
  display: flex;
  justify-content: center;

  .el-button {
    margin: 0 30px;
  }
}
</style>