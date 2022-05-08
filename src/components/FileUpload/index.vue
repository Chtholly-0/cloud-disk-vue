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
import SparkMD5 from "spark-md5";
export default {
  data() {
    return {
      // 上传文件路径
      filePath: "/",
      // 上传组件配置项
      options: {
        target: this.$api.fileUploadUrl,
        testChunks: true,
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
        // 服务器分片校验函数
        checkChunkUploadedByResponse: (chunk, message) => {
          const result = JSON.parse(message);
          if (result.code != 200) {
            this.$message.error(result.message);
            chunk.file.cancel();
          }
          if (result.data.skipUpload) {
            this.Bus.$emit("refreshFileList", this.filePath);
            return true;
          }
          return (result.data.uploaded || []).indexOf(chunk.offset + 1) >= 0;
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
      // 文件选择完成，进行分片处理
      file.relativePath = this.filePath;
      this.Bus.$emit("showTransportList"); // 展示传输列表
      this.computeMd5(file);
    },
    /**
     * 文件上传成功后
     */
    onFileSuccess(rootFile, file, response, chunk) {
      let result = JSON.parse(response);
      if (result.code == 200) {
        if (result.data.skipUpload) {
          this.$message.success(result.message);
        } else {
          let params = {
            identifier: file.uniqueIdentifier,
          };
          this.$api
            .fileMerge(params)
            .then((res) => {
              if (res.code == 200) {
                this.$message.success(result.message);
                this.Bus.$emit("refreshFileList", this.filePath);
              } else {
                this.$message.error(result.message);
              }
            })
            .catch((err) => {
              this.$message.error(err);
            });
        }
      } else {
        this.$message.error(result.message);
      }
    },
    /**
     * 计算文件md5
     */
    computeMd5(file) {
      let fileReader = new FileReader();
      let blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice;
      let currentChunk = 0;
      const chunkSize = 10 * 1024 * 1024;
      let chunks = Math.ceil(file.size / chunkSize);
      let spark = new SparkMD5.ArrayBuffer();

      file.pause(); // 暂停上传文件

      function loadNext() {
        let start = currentChunk * chunkSize;
        let end =
          start + chunkSize >= file.size ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
      }

      loadNext();

      fileReader.onload = (e) => {
        spark.append(e.target.result);

        if (currentChunk < chunks) {
          currentChunk++;
          loadNext();
        } else {
          let md5 = spark.end();
          file.uniqueIdentifier = md5; // 文件唯一标识为md5
          file.resume(); // 开始上传
        }
      };

      fileReader.onerror = function () {
        this.$message.error(`文件${file.name}读取出错, 请检测该文件`);
        file.cancel(); // 取消上传且从文件列表中移除
      };
    },
  },
  mounted() {
    // 文件上传点击
    this.Bus.$on("fileUpload", (filePath) => {
      this.filePath = filePath;
      this.$refs.uploaderBtn.$el.click();
    })
  }
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
