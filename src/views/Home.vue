<template>
  <!-- 整体 -->
  <el-container>
    <!-- 头部 -->
    <el-header style="border-bottom: 1px solid #e6e6e6">
      <div class="header-logo">网络云盘</div>
      <div style="width: 500px">
        <el-menu
          :default-active="'0'"
          mode="horizontal"
          active-text-color="#40aaff"
        >
          <el-menu-item
            v-for="(item, index) in topMenu"
            :key="index"
            :index="index.toString()"
          >
            <i :class="item.icon"></i>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="user-block">
        <!-- 头像 -->
        <el-avatar :size="40" :src="circleUrl"> </el-avatar>
        <el-dropdown
          class="user-dropdown"
          @command="infoDropDownBox"
          trigger="click"
        >
          <span
            class="username-link"
            @mouseenter="mouserEnterChange($event, true)"
            @mouseleave="mouserEnterChange($event, false)"
          >
            {{ userInfo.username == undefined ? "用户名" : userInfo.username
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <!-- 下拉框 -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="login">登录</el-dropdown-item>
            <el-dropdown-item command="register">注册</el-dropdown-item>
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-popover
          placement="bottom-end"
          :width="400"
          :offset="70"
          class="transport-list"
          popper-class="popover-position"
        >
          <div style="width: 100%; height: 300px">
            <global-uploader
              ref="fileUpload"
            ></global-uploader>
          </div>
          <span slot="reference">
            <template>
              <el-tooltip
                placement="bottom"
                effect="light"
                :enterable="false"
                content="传输列表"
                :visible-arrow="false"
                :open-delay="500"
                popper-class="trans-list-tips"
              >
                <el-button 
                  class="el-icon-sort transport-list-button" 
                  ref="popoverShowRef">
                </el-button>
              </el-tooltip>
            </template>
          </span>
        </el-popover>
      </div>
    </el-header>
    <!-- 中下部分 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="165px" style="border-right: 1px solid #e6e6e6">
        <!-- 侧边导航栏 -->
        <el-menu
          ref="menu"
          style="overflow: hidden"
          @select="asideSelect"
          default-active="file-all"
        >
          <template v-for="(item, index) in asideMenu" :index="index">
            <el-menu-item :index="item.path" v-bind:key="item.path">
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </el-menu-item>
            <template v-if="item.children != undefined">
              <el-menu-item
                v-for="(item2, index2) in item.children"
                :key="index2"
                :index="item2.path"
                style="left: 20px; border-left: 1px solid #e6e6e6"
              >
                <i :class="item2.icon"></i>
                <span>{{ item2.title }}</span>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
        <div class="aside-bottom">
          <el-progress
            :percentage="percentage"
            :color="customColors"
          ></el-progress>
          {{ filterSize(usedSpace) + "/" + filterSize(userInfo.totalSpace) }}
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </el-aside>
      <!-- Main显示区 -->
      <el-main
        ><router-view
          :key="$route.fullPath"
          @refreshData="getUserInfo"
          @fileUpload="fileUploadEvent"
        ></router-view
      ></el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mouserEnterChange, filterSize } from "@/static/common/index.js";
import globalUploader from "@/components/FileUpload/index.vue";
// 默认头像
import circleUrl from "@/assets/img/default-circle.png";

export default {
  components: {
    globalUploader,
  },
  data() {
    return {
      // 头部导航栏
      topMenu: [
        { icon: "el-icon-menu", title: "网盘" },
        { icon: "el-icon-share", title: "分享" },
        { icon: "el-icon-s-unfold", title: "更多" },
      ],
      // 默认头像
      circleUrl: circleUrl,
      // 用户名，初始默认
      username: "用户名",
      // 侧边导航栏
      asideMenu: [
        {
          icon: "el-icon-folder-opened",
          title: "全部文件",
          path: "file-all",
          children: [
            { icon: "el-icon-picture-outline", title: "图片", path: "picture" },
            { icon: "el-icon-video-camera", title: "视频", path: "file-video" },
            { icon: "el-icon-service", title: "音乐", path: "file-music" },
            { icon: "el-icon-document", title: "文档", path: "file-document" },
            { icon: "el-icon-more-outline", title: "其他", path: "file-other" },
            {
              icon: "el-icon-lock",
              title: "隐藏空间",
              path: "file-hiddenSpace",
            },
          ],
        },
        { icon: "el-icon-share", title: "我的分享", path: "share" },
        { icon: "el-icon-delete", title: "回收站", path: "file-rubbish" },
      ],
      // 用户信息
      userInfo: {},
      // 已用空间
      usedSpace: 0,
      // 百分比
      percentage: 0,
      // 容量条颜色
      customColors: [
        { color: "#409eff", percentage: 20 },
        { color: "#409eff", percentage: 40 },
        { color: "#409eff", percentage: 60 },
        { color: "#e6a23c", percentage: 80 },
        { color: "#f56c6c", percentage: 100 },
      ],
    };
  },
  methods: {
    // 信息下拉框 登录/登出/注册/信息修改等
    infoDropDownBox(command) {
      this.$router.push("/" + command);
    },
    // 侧边栏选中
    asideSelect(index) {
      if (index.indexOf("file-") == 0) {
        this.$router.push({
          path: "filePage",
          query: { fileClass: index.slice(5, index.length) },
        });
      } else {
        this.$router.push("/" + index);
      }
    },
    getUserInfo() {
      this.$api
        .getUserInfo()
        .then((res) => {
          if (res.code == 200) {
            this.userInfo = res.data;
            this.usedSpace = this.userInfo.totalSpace - this.userInfo.freeSpace;
            this.percentage =
              ((this.usedSpace * 100) / this.userInfo.totalSpace).toFixed(2) - 0;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 鼠标进入改变样式
    mouserEnterChange,
    // 文件大小计算
    filterSize,
    // 文件上传事件
    fileUploadEvent(filePath) {
      this.$refs.fileUpload.fileUploadClick(filePath);
    },
  },
  created() {
    this.getUserInfo();
  },
  mounted() {
    // 展示传输列表
    this.Bus.$on("showTransportList", ()=> {
      this.$refs.popoverShowRef.$el.click();
    });
    this.Bus.$on("refreshFileList", (data)=> {
      this.getUserInfo();
    })
  }
};
</script>

<style lang="less" scoped>
// 布局样式
.el-container {
  height: calc(100% - 2px);
}
// 主显示区
.el-main {
  position: relative;
  padding: 5px;
  overflow: hidden;
}
// 头部
.el-header {
  padding: 0;
  min-width: 1200px;

  div {
    display: inline-block;
    // position: absolute;
    height: 60px;
  }
}

// 导航栏图标
.header-logo {
  font-size: 25px;
  text-align: center;
  line-height: 230%;
  width: 165px;
  float: left;
}
// 用户块
.user-block {
  line-height: 90px;
  width: 170px;
  float: right;
  margin-right: 150px;
}
// 导航栏
.el-menu {
  overflow: hidden;
}
// 用户下拉
.user-dropdown {
  width: 70px;
  height: 40px;
  position: absolute;
}
// 用户名
.username-link {
  width: 70px;
  height: 40px;
  position: absolute;
  top: -15px;
  left: 10px;
  font-size: 12px;
  font-weight: bold;
}
.transport-list {
  position: relative;
  left: 90px;
  top: -15px;
}
// 传输列表按钮
.transport-list-button {
  padding: 5px;
  border: none;
  font-weight: bold;
}
// 侧边栏的底部
.aside-bottom {
  width: 150px;
  height: 40px;
  text-align: center;
  // background-color: rgb(151, 151, 137);
  position: relative;
  top: calc(100% - 550px);
  font-size: 12px;
}
</style>

<style>
/* 隐藏菜单箭头 */
.el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
  /* -webkit-transform: rotateZ(0deg); 
	 -ms-transform: rotate(0deg);
	  transform: rotateZ(0deg);  */
  display: none;
}

.trans-list-tips {
  padding: 5px !important;
  transform: translate(35px, -15px);
  user-select: none;
}
.popover-position {
  transform: translateY(10px);
  padding: 0;
}
</style>