// 鼠标移入改变样式
var mouserEnterChange = function (event, flag) {
    if (!event.currentTarget.classList.contains("icon-disabled")) {
        if (flag) {
            event.currentTarget.classList.add("icon-mouser-enter");
        } else {
            event.currentTarget.classList.remove("icon-mouser-enter");
        }
    }
}

var filterSize = function(size) {
    if (size == undefined || size == null) {
        return "";
    }
    return size < 1024 ? size + " B" : 
      size < pow1024(2) ? (size / 1024).toFixed(1) + " KB":
        size < pow1024(3) ? (size / pow1024(2)).toFixed(1) + " MB" :
          size < pow1024(4) ? (size / pow1024(3)).toFixed(1) + " GB" :
           (size / pow1024(4)).toFixed(1) + " TB"
}

const ACCEPT_CONFIG = {
    image: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
    video: ['.mp4', '.rmvb', '.mkv', '.wmv', '.flv'],
    document: ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.tif', '.tiff'],
    getAll(){
        return [...this.image, ...this.video, ...this.document]
    },
}

function pow1024(num) {
    return Math.pow(1024, num)
}

export {
    mouserEnterChange,
    filterSize,
    ACCEPT_CONFIG,
}