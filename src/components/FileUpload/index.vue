<template>
  <uploader
    :autoStart="false"
    :options="options"
    :file-status-text="statusText"
    @file-added="onFileAdded"
    @file-success="onFileSuccess"
    class="uploader-example"
  >
    <uploader-unsupport></uploader-unsupport>
    <uploader-drop>
      <h4>传输列表</h4>
      <uploader-btn v-show="false" ref="uploaderBtn"></uploader-btn>
      <uploader-list></uploader-list>
    </uploader-drop>
  </uploader>
</template>

<script>
export default {
  data() {
    return {
      // 上传文件路径
      filePath: "/",
      // 上传组件配置项
      options: {
        target: this.$api.fileUploadUrl,
        testChunks: false,
        chunkSize: 10 * 1024 * 1024,
        // 解析时间
        parseTimeRemaining: function (timeRemaining, parsedTimeRemaining) {
          return parsedTimeRemaining
            .replace(/\syears?/, "年")
            .replace(/\days?/, "天")
            .replace(/\shours?/, "小时")
            .replace(/\sminutes?/, "分钟")
            .replace(/\sseconds?/, "秒");
        },
        // 请求头
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),
        },
      },
      statusText: {
        success: "上传成功",
        error: "上传出错了",
        uploading: "上传中...",
        paused: "暂停中...",
        waiting: "等待中...",
        cmd5: "计算中...",
      },
    };
  },
  methods: {
    /**
     * 文件选择后
     */
    onFileAdded(file) {

      file.pause(); // 暂停上传文件
      let params = {
        filePath: this.filePath,
        fileName: file.name,
        chunks: file.chunks.length,
        fileSize: file.size,
      };
      this.$api
        .filePreCreate(params)
        .then((res) => {
          if (res.code == 200) {
            file.uniqueIdentifier = res.data;
            file.resume();
          } else {
            file.cancel();
            this.$message.error(res.message);
          }
        })
        .then((err) => {
          this.$message.error(err);
        });
    },
    /**
     * 文件上传成功后
     */
    onFileSuccess(rootFile, file, response, chunk) {
      let result = JSON.parse(response);
      if (result.code == 200) {
        let params = {
          requestId: file.uniqueIdentifier
        }
        this.$api
          .fileMerge(params)
          .then((res) => {
            if (res.code == 200) {
              this.$message.success(result.message);
              this.Bus.$emit("refreshFileList", this.filePath);
            } else {
              file.pause();
              this.$message.error(result.message);
            }
          })
          .catch((err) => {
            file.pause(); 
            this.$message.error(err);
          });
      }
    },
  },
  mounted() {
    // 文件上传点击
    this.Bus.$on("fileUpload", (filePath) => {
      this.filePath = filePath;
      this.$refs.uploaderBtn.$el.click();
    });
  },
};
</script>

<style lang="less">
.uploader-example {
  width: 100%;
  font-size: 12px;
  height: 100%;

  .uploader-drop {
    border: none !important;
    padding: 0;
    height: 100%;
    background-color: #fff;
  }

  .uploader-list {
    max-height: 440px;
    overflow: auto;
    // overflow-x: hidden;
    overflow-y: auto;
  }

  .uploader-btn {
    margin-right: 4px;
  }
}
</style>
