<template>
  <div style="width: 100%; height: 100%">
    <div class="file-header">
      <div class="file-operations">
        <!-- 未选择时的操作 -->
        <div v-if="filesSelection.length == 0" class="file-unchecked-ops">
          <el-button 
            type="primary" 
            class="el-icon-upload2"
            @click="fileUploadClick"
          > 上传</el-button>
          <div style="width: 240px">
            <i class="el-icon-folder-add" @click="folderCreateOpen">
              新建文件夹 &nbsp;&nbsp;<span style="color: #b3d8ff">|</span></i
            >
            <i class="el-icon-download"> 离线下载 &nbsp;&nbsp;</i>
          </div>
        </div>
        <div
          v-else
          class="file-checked-ops"
          :style="'width:' + (filesSelection.length == 1 ? '500px;' : '400px;')"
        >
          <i class="el-icon-share">
            分享 &nbsp;&nbsp;<span style="color: #b3d8ff">|</span></i
          >
          <i class="el-icon-download">
            下载 &nbsp;&nbsp;<span style="color: #b3d8ff">|</span>
          </i>
          <i class="el-icon-delete" @click="fileDelete">
            删除 &nbsp;&nbsp;<span style="color: #b3d8ff">|</span>
          </i>
          <i
            v-if="filesSelection.length == 1"
            class="el-icon-edit-outline"
            @click="fileRename"
          >
            重命名 &nbsp;&nbsp;<span style="color: #b3d8ff">|</span>
          </i>
          <i
            class="el-icon-document-copy"
            @click="
              dialogVisible = true;
              dialogTitle = '复制到';
            "
          >
            复制 &nbsp;&nbsp;<span style="color: #b3d8ff">|</span>
          </i>
          <i
            class="el-icon-rank"
            @click="
              dialogVisible = true;
              dialogTitle = '移动到';
            "
          >
            移动 &nbsp;&nbsp;</i
          >
        </div>
        <div class="file-search">
          <el-input placeholder="请输入关键字" v-model="searchKayWord">
            <i
              slot="suffix"
              class="el-icon-search el-input__icon"
              style="font-size: 20px; cursor: pointer"
              @mouseenter="mouserEnterChange($event, true)"
              @mouseleave="mouserEnterChange($event, false)"
              @click="searchFiles"
            ></i>
          </el-input>
        </div>
      </div>
      <div class="return">
        <span @click="goBack" style="color: #06afff">返回上一级</span>
      </div>
      <div class="file-path">
        <span style="color: #b3d8ff">|&nbsp;&nbsp;</span>
        <span @click="pathGoto(0)" style="color: #06afff">
          {{ fileClassMap[fileClass] }}
        </span>
        <div v-for="(item, index) in filePathList" :key="index">
          <div v-if="index >= filePathList.length - 3 && index >= 1">
            <span style="color: #c6d8f4">&nbsp;></span>
            <span
              @click="pathGoto(index)"
              class="overNone"
              :style="
                index == filePathList.length - 1
                  ? 'color: #afb3bf;'
                  : 'color: #06afff;'
              "
            >
              &nbsp;{{ item }}
            </span>
          </div>
          <div v-if="index == filePathList.length - 5">
            <span style="color: #b3d8ff">&nbsp;> ...&nbsp;</span>
          </div>
        </div>
      </div>
    </div>
    <div class="file-main">
      <!-- 文件列表-->
      <div class="file-list">
        <template style="width: 100%">
          <el-table
            ref="fileListTable"
            :data="fileList"
            @row-dblclick="dblclickEnterFolder"
            @row-click="clickFile"
            @selection-change="filesSelectionChange"
            :highlight-current-row="true"
            height="calc(100% - 10px)"
            v-loading="tableLoading"
            style="font-size: 13px;"
          >
            <el-table-column type="selection" min-width="5%"> </el-table-column>
            <el-table-column
              label="文件名称"
              min-width="55%"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div>
                  <svg class="icon-file" aria-hidden="true">
                    <use :xlink:href="getFileIcon(scope.row.fileType)"></use>
                  </svg>
                  <span>{{ scope.row.fileName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="时间"
              min-width="25%"
              sortable
            >
            </el-table-column>
            <el-table-column label="大小" min-width="15%">
              <template slot-scope="scope">
                <span>{{ filterSize(scope.row.fileSize) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="file-info">
        <div class="file-info-card">
          <el-card>
            <div v-if="filesSelection.length == 1">
              <!-- 文件头 --图标-名称 -->
              <div>
                <svg class="icon-file" aria-hidden="true">
                  <use
                    :xlink:href="getFileIcon(filesSelection[0].fileType)"
                  ></use>
                </svg>
                <span>{{ filesSelection[0].fileName }}</span>
              </div>
              <!-- 如果是文件夹 -->
              <div v-if="filesSelection[0].fileType == 'folder'">
                <el-table :data="folderChildren" height="300">
                  <el-table-column
                    min-width="100%"
                    label="文件夹内容"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <svg class="icon-file" aria-hidden="true">
                        <use
                          :xlink:href="fileTypeIconMap[scope.row.fileType]"
                        ></use>
                      </svg>
                      {{ scope.row.fileName }}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <!-- 否则 -->
              <div v-else>
                <br />
                <!-- 文件预览 -->
                <div class="file-view">
                  <div>
                    <svg class="icon-file" aria-hidden="true">
                      <use
                        :xlink:href="getFileIcon(filesSelection[0].fileType)"
                      ></use>
                    </svg>
                  </div>
                </div>
                <br />
                <br />
                <span>创建时间: {{ filesSelection[0].createTime }}</span>
                <template v-if="filesSelection[0].updateTime != undefined">
                  <br />
                  <span>修改时间: {{ filesSelection[0].updateTime }}</span>
                </template>
                <br />
                <span>大小: {{ filterSize(filesSelection[0].fileSize) }}</span>
              </div>
            </div>
            <div v-else-if="filesSelection.length == 0">未选择文件</div>
            <div v-else>以选择{{ filesSelection.length }}个文件</div>
          </el-card>
        </div>
      </div>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      class="folder-dialog"
      @opened="dialogOpened"
      :show-close="false"
      width="40%"
      @closed="dialogClosed"
    >
      <div>
        <el-table
          :data="folderList"
          style="width: 100%"
          :highlight-current-row="true"
          height="300"
          v-loading="dialogLoading"
          @row-click="clickDialogRow"
        >
          <el-table-column :label="dialogPath">
            <template slot-scope="scope">
              <div>
                <svg class="icon-file" aria-hidden="true">
                  <use xlink:href="#icon-wenjianjia1"></use>
                </svg>
                <span>{{ scope.row.fileName }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <span class="dialog-back" @click="dialogBack">上一级</span>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="copyOrMove">
          {{ dialogTitle }}此
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="目标已包含相同文件名"
      :visible.sync="isCoverVisible"
      width="40%"
    >
      <div>
        <el-table :data="comSameArr" style="width: 100%" height="200">
          <el-table-column label="相同的文件如下:">
            <template slot-scope="scope">
              <svg class="icon-file" aria-hidden="true">
                <use xlink:href="#icon-wenjianjia1"></use>
              </svg>
              <span>{{ scope.row }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button
          @click="
            isCoverVisible = false;
            submitCopyOrMove(true);
          "
          >跳过相同文件</el-button
        >
        <el-button
          @click="
            isCoverVisible = false;
            submitCopyOrMove(false);
          "
          >相同文件生成副本</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mouserEnterChange, filterSize } from "@/static/common/index.js";

export default {
  name: "FilePage",
  data() {
    return {
      // 文件类型
      fileClass: this.$route.query.fileClass,
      // 文件类型映射
      fileClassMap: {
        all: "全部文件",
        picture: "图片",
        video: "视频",
        music: "音乐",
        document: "文档",
        other: "其他文件",
        hiddenSpace: "隐藏空间",
      },
      // 当前文件列表
      fileList: [],
      // 文件图标映射
      fileTypeIconMap: {
        folder: "#icon-wenjianjia1",
        jpg: "#icon-tupian",
        png: "#icon-tupian",
        gif: "#icon-tupian",
        mp4: "#icon-shipin",
        mp3: "#icon-yinle",
        txt: "#icon-TXT",
        doc: "#icon-doc",
        docx: "#icon-word2",
        csv: "#icon-CSV",
        xlsx: "#icon-XLSX",
        excel: "#icon-EXCEL",
        ppt: "#icon-PPT",
        pptx: "#icon-PPTX",
        pdf: "#icon-PDF",
        rar: "#icon-yasuobao-207",
        zip: "#icon-yasuobao-207",
        "7z": "#icon-yasuobao-207",
        other: "#icon-weizhiwenjian",
      },
      // 文件路径
      filePathList: [],
      // 当前选中文件
      filesSelection: [],
      // 文件夹子列表
      folderChildren: [],
      // 是否开启加载界面
      tableLoading: false,
      // 搜索关键字
      searchKayWord: "",
      // 对话框是否弹出
      dialogVisible: false,
      // 对话框标题
      dialogTitle: "",
      // 文件夹列表
      folderList: [],
      // 对话框文件列表
      diaFileList: [],
      // 对话框是否加载
      dialogLoading: false,
      // 对话框路径缓存
      dialogCacheArr: [
        {
          filePath: "/",
          fileName: "我的文件",
        },
      ],
      // 对话框路径
      dialogPath: " 我的文件 >",
      // 是否覆盖判断框
      isCoverVisible: false,
      // 复制或移动选中的文件名
      comArr: [],
      // 复制或移动选中的文件名与目标路径下相同的文件名
      comSameArr: [],
    };
  },
  methods: {
    // test
    titleShow() {
      this.$message.info(this.fileClass);
    },
    // 鼠标移入改变样式
    mouserEnterChange,
    // 计算文件大小
    filterSize,
    // 文件上传点击
    fileUploadClick() {
      let filePath = this.getFilePath();
      this.Bus.$emit("fileUpload", filePath);
    },
    // 获取文件图标
    getFileIcon(fileType) {
      if (fileType in this.fileTypeIconMap) {
        return this.fileTypeIconMap[fileType];
      } else {
        return this.fileTypeIconMap["other"];
      }
    },
    // 双击进入文件夹
    dblclickEnterFolder(item) {
      clearTimeout(this.time);
      if (item.fileType == "folder") {
        this.tableLoading = true;
        this.filePathList.push(item.fileName);
        let filePath = this.getFilePath();
        this.getFileList(filePath, (data) => {
          this.fileList = data;
          this.tableLoading = false;
        });
      }
    },
    // 获取文件路径
    getFilePath() {
      let len = this.filePathList.length;
      if (len == 1) {
        return "/";
      }
      let filePath = "/";
      for (let i = 1; i < len; i = i + 1) {
        filePath = filePath + this.filePathList[i] + "/";
      }
      return filePath;
    },
    // 单击文件查看详情并选择
    clickFile(item) {
      clearTimeout(this.time);
      this.time = setTimeout(() => {
        item.checked = !item.checked;
        this.$refs.fileListTable.toggleRowSelection(item, item.checked);
      }, 300);
    },
    // 文件路径跳转
    pathGoto(i) {
      if (i != this.filePathList.length - 1) {
        this.tableLoading = true;
        this.filePathList.splice(i + 1, this.filePathList.length);
        let filePath = this.getFilePath();
        this.getFileList(filePath, (data) => {
          this.fileList = data;
          this.tableLoading = false;
        });
      }
    },
    // 返回上一级
    goBack() {
      let len = this.filePathList.length;
      if (len > 1) {
        this.tableLoading = true;
        this.filePathList.splice(len - 1, len);
        let filePath = this.getFilePath();
        this.getFileList(filePath, (data) => {
          this.fileList = data;
          this.tableLoading = false;
        });
      }
    },
    // 文件多选框改变
    filesSelectionChange(rows) {
      this.filesSelection = rows;
    },
    // 查找文件
    searchFiles() {
      if (this.searchKayWord.length == 0) {
        this.$message.error("请输入关键字");
      } else {
        this.tableLoading = true;
        let params = { searchKayWord: encodeURIComponent(this.searchKayWord) };
        this.$api
          .searchFiles(params)
          .then((res) => {
            if (res.code == 200) {
              this.fileList = res.data;
              this.$message.success(res.message);
            } else {
              this.$message.error(res.message);
            }
            this.tableLoading = false;
          })
          .catch((err) => {
            this.$message.error(err);
            this.tableLoading = false;
          });
      }
    },
    // 获取文件列表
    getFileList(filePath, callback) {
      let params = {};
      if (this.fileClass == "all") {
        params = { filePath: encodeURIComponent(filePath) };
        this.$api
          .getListByPath(params)
          .then((res) => {
            if (res.code == 200) {
              callback(res.data);
            } else {
              this.$message.error(res.message);
            }
          })
          .catch((err) => {
            this.$message.error(err);
          });
      } else {
        params = { fileClass: this.fileClass };
        this.$api
          .getListByClass(params)
          .then((res) => {
            if (res.code == 200) {
              callback(res.data);
            } else {
              this.$message.error(res.message);
            }
          })
          .catch((err) => {
            this.$message.error(err);
          });
      }
    },
    // 新建文件弹出框
    folderCreateOpen() {
      this.$messageBox
        .prompt("请输入文件名", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^[^\\\\\\/:*?\\"<>|]+$/,
          inputErrorMessage: '文件名匹配错误, 不能出现\\/:*?"<>|, 且不能为空',
        })
        .then(({ value }) => {
          this.tableLoading = true;
          if (value.match(/(^\s)/)) {
            this.$message.info("文件名不能为空");
          } else {
            let params = new FormData();
            let filePath = this.getFilePath();
            params.append("filePath", filePath);
            params.append("fileName", value);
            this.$api
              .newFolder(params)
              .then((res) => {
                if (res.code == 200) {
                  this.$message.success(res.message);
                } else {
                  this.$message.error(res.message);
                }
                this.getFileList(filePath, (data) => {
                  this.fileList = data;
                  this.tableLoading = false;
                });
              })
              .catch((err) => {
                this.$message.error(err);
                this.tableLoading = false;
              });
          }
        });
    },
    // 文件删除
    fileDelete() {
      this.$messageBox.alert("是否删除所选文件", "提示", {
        confirmButtonText: "确定",
        callback: (action) => {
          this.tableLoading = true;
          let arr = [];
          for (let temp of this.filesSelection) {
            arr.push(temp.fileName);
          }
          let filePath = this.getFilePath();
          let params = { filePath: filePath, fileNameList: arr };
          this.$api
            .fileDelete(params)
            .then((res) => {
              if (res.code == 200) {
                this.$message.success(res.message);
              } else {
                this.$message.error(res.message);
              }
              this.getFileList(filePath, (data) => {
                this.fileList = data;
                this.tableLoading = false;
              });
            })
            .catch((err) => {
              this.$message.error(err);
              this.tableLoading = false;
            });
        },
      });
    },
    // 文件重命名
    fileRename() {
      let fileItem = this.filesSelection[0];
      this.$messageBox
        .prompt("请输入新的文件名", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^[^\\\\\\/:*?\\"<>|]+$/,
          inputErrorMessage: '文件名匹配错误, 不能出现\\/:*?"<>|, 且不能为空',
          inputValue: fileItem.fileName,
        })
        .then(({ value }) => {
          if (value.match(/(^\s)/)) {
            this.$message.info("文件名不能为空");
          } else {
            this.tableLoading = true;
            let filePath = this.getFilePath();
            let params = {
              filePath: encodeURIComponent(filePath),
              oldName: fileItem.fileName,
              newName: value,
            };
            this.$api
              .fileRename(params)
              .then((res) => {
                if (res.code == 200) {
                  this.$message.success(res.message);
                } else {
                  this.$message.error(res.message);
                }
                this.getFileList(filePath, (data) => {
                  this.fileList = data;
                  this.tableLoading = false;
                });
              })
              .catch((err) => {
                this.$message.error(err);
                this.tableLoading = false;
              });
          }
        });
    },
    // 对话框打开,获取文件夹列表
    dialogOpened() {
      this.dialogLoading = true;
      this.dialogPath = " 我的文件 >";
      this.dialogCacheArr.splice(1, this.dialogCacheArr.length);
      this.getFileList("/", (data) => {
        this.diaFileList = data;
        this.filterFolders();
        this.dialogLoading = false;
      });
    },
    // 单击对话框表格某行进入文件夹
    clickDialogRow(item) {
      this.dialogLoading = true;
      let path = item.filePath + item.fileName + "/";
      this.dialogCacheArr.push({ filePath: path, fileName: item.fileName });
      this.dialogPath = "";
      for (let temp of this.dialogCacheArr) {
        this.dialogPath += " " + temp.fileName + " >";
      }
      this.getFileList(path, (data) => {
        this.diaFileList = data;
        this.filterFolders();
        this.dialogLoading = false;
      });
    },
    // 关闭对话框时释放资源
    dialogClosed() {},
    // 对话框表格返回上一级
    dialogBack() {
      let i = this.dialogCacheArr.length - 1;
      if (i != 0) {
        this.dialogLoading = true;
        this.dialogCacheArr.splice(i, i + 1);
        this.dialogPath = "";
        for (let temp of this.dialogCacheArr) {
          this.dialogPath += " " + temp.fileName + " >";
        }
        let item = this.dialogCacheArr[i - 1];
        // console.log(item)
        this.getFileList(item.filePath, (data) => {
          this.diaFileList = data;
          this.filterFolders();
          this.dialogLoading = false;
        });
      }
    },
    // 复制或移动
    copyOrMove() {
      let fromPath = this.filesSelection[0].filePath;
      let toPath = this.dialogCacheArr[this.dialogCacheArr.length - 1].filePath;
      if (fromPath == toPath) {
        this.$message.error("不能" + this.dialogTitle + "自身及其子目录下");
        this.dialogVisible = false;
        return;
      }
      let record = [];
      for (let temp of this.diaFileList) {
        record.push(temp.fileName);
      }
      this.comArr = [];
      this.comSameArr = [];
      for (let temp of this.filesSelection) {
        if (toPath.indexOf(fromPath + temp.fileName) == 0) {
          this.$message.error("不能" + this.dialogTitle + "自身及其子目录下");
          this.dialogVisible = false;
          return;
        }
        if (record.includes(temp.fileName)) {
          this.comSameArr.push(temp.fileName);
        } else {
          this.comArr.push(temp.fileName);
        }
      }
      if (this.comSameArr.length != 0) {
        this.isCoverVisible = true;
      } else {
        this.submitCopyOrMove(true);
      }
      this.dialogVisible = false;
    },
    // 提交复制或移动
    submitCopyOrMove(isCover) {
      this.tableLoading = true;
      let opera = this.dialogTitle == "复制到" ? "copy" : "move";
      let arr = isCover ? this.comArr : this.comArr.concat(this.comSameArr);

      let fromPath = this.filesSelection[0].filePath;
      let toPath = this.dialogCacheArr[this.dialogCacheArr.length - 1].filePath;

      // console.log(this.dialogCacheArr)
      let params = new FormData();
      params.append("fromPath", fromPath);
      params.append("fileNameList", arr);
      params.append("toPath", toPath);
      params.append("opera", opera);

      let currentPath = this.getFilePath();
      this.$api
        .fileCopyOrMove(params)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
          this.getFileList(currentPath, (data) => {
            this.fileList = data;
            this.tableLoading = false;
          });
        })
        .catch((err) => {
          this.$message.error(err);
          this.tableLoading = false;
        });
    },
    // 筛选出文件夹
    filterFolders() {
      this.folderList = [];
      for (let temp of this.diaFileList) {
        if (temp.fileType == "folder") {
          this.folderList.push(temp);
        }
      }
    },
  },
  // 加载组件时执行
  created() {
    this.titleShow();
    this.tableLoading = true;
    this.getFileList("/", (data) => {
      this.fileList = data;
      this.tableLoading = false;
    });
    this.filePathList.push("");
  },
  watch: {
    filesSelection() {
      if (this.filesSelection.length == 1) {
        this.folderChildren = [];
        let item = this.filesSelection[0];
        if (item.fileType == "folder") {
          let filePath = this.getFilePath() + item.fileName + "/";
          this.getFileList(filePath, (data) => {
            this.folderChildren = data;
          });
        }
      }
    },
  },
  mounted() {
        // 刷新文件列表
    this.Bus.$on("refreshFileList", (filePath) => {
      this.tableLoading = true;
      this.getFileList(filePath, (data) => {
        this.fileList = data;
        this.tableLoading = false;
      })
    })
  }
};
</script>

<style lang="less" scoped>
// 文件区
.file-main {
  min-width: 1350px;
  width: 100%;
  height: calc(100% - 90px);

  div {
    display: inline-block;
  }
}
// 文件区头部
.file-header {
  border-radius: 5px;
  height: 80px;
  margin-top: 5px;
  margin-bottom: 3px;
  margin-right: 3px;
  min-width: 1200px;
  width: 100%;

  div {
    display: inline-block;
  }
}
// 文件操作
.file-operations {
  width: 100%;
  height: 50px;
  min-width: 1200px;
  line-height: 48px;

  /deep/ div {
    // display: inline-block;
    margin-left: 3px;
  }

  i {
    margin-left: 12px;
    position: relative;
    bottom: 9px;
    cursor: pointer;
    font-weight: bold;
    font-size: 15px;
  }
}

// 文件未选中操作
.file-unchecked-ops {
  width: 400px;

  .el-button {
    height: 30px;
    border-radius: 30px;
    line-height: 5px;
    // position: relative;
    font-weight: bold;
  }

  div {
    height: 30px;
    background-color: #f0fbff;
    color: #06a7ff;
    position: relative;
    top: 10px;
    border-radius: 10px;
  }
}
// 文件选中操作
.file-checked-ops {
  height: 30px !important;
  background-color: #f0fbff;
  color: #06a7ff;
  position: relative;
  top: 10px;
  border-radius: 10px;
}
// 文件查找
.file-search {
  width: 300px;
  float: right;
  margin-right: 20px;
  // height: 30px;

  .el-input /deep/ .el-input__inner {
    height: 30px;
    font-size: 13px;
  }

  /deep/ .el-input__icon {
    position: relative;
    top: 2px;
  }
}
// 文件路径样式
.file-path {
  height: 30px;
  width: calc(100% - 390px);
  // border-left: 1px solid #b3d8ff;
  float: left;
  line-height: 28px;
  margin-left: 2px;

  span {
    display: block;
    max-width: 100px;
    font-size: 12px;
    cursor: pointer;
    float: left;
  }
}
// 内容超出部分省略
.overNone {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
// 后退
.return {
  width: 90px;
  float: left;
  height: 30px;

  span {
    position: relative;
    margin-left: 24px;
    top: 2px;
    font-size: 11px;
    cursor: pointer;
  }
}
// 文件列表
.file-list {
  width: calc(100% - 300px);
  float: left;
  height: 100%;

  /deep/ .el-table__row > td {
    // 去除下划线
    border: none;
  }

  /deep/ .el-table th.is-leaf {
    /* 去除上边框 */
    border: none;
  }
}
// 文件详情
.file-info {
  width: 270px;
  float: right;
  padding: 0px;
  height: 100%;
  margin-right: 20px;
  background-color: #f5f6fa;
}
// 文件信息卡片
.file-info-card {
  margin: 5px;
  width: 257px;
  height: 550px;
  background-color: #f5f6fa;

  /deep/ .el-table__row > td {
    border: none;
  }

  /deep/ .el-table th.is-leaf {
    /* 去除上边框 */
    border: none;
  }

  div {
    width: 100%;
  }
}
// 文件预览
.file-view {
  height: 160px;
  text-align: center;
  line-height: 160px;
  border: 1px solid #b5b5b5;
  border-radius: 10px;

  div {
    width: 20px;
    height: 20px;
    display: inline-block;
  }
}
// 文件夹对话框
.folder-dialog {
  /deep/ .el-dialog__body {
    padding: 0 20px;
  }

  /deep/ .el-table__row > td {
    // 去除下划线
    border: none;
  }

  /deep/ .el-table th.is-leaf {
    /* 去除上边框 */
    border: none;
  }
}
// 文件夹会话框返回按钮
.dialog-back {
  float: left;
  margin-top: 8px;
  color: #27b2ff;
  cursor: pointer;
}
</style>

<style>
.el-table__body-wrapper::-webkit-scrollbar {
  display: block;
  width: 5px;
  height: 8px;
  background-color: rgba(245, 245, 245, 0.47);
}
/*定义滚动条的轨道，内阴影及圆角*/
.el-table__body-wrapper::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px white;
}

/*定义滑块，内阴影及圆角*/
.el-table__body-wrapper::-webkit-scrollbar-thumb {
  /*width: 10px;*/
  height: 20px;
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgba(85, 85, 85, 0.25);
}
</style>