import axios from "./http";

// 登录接口
function login(data) {
    return axios.post('/user/login', data)
}
// 获取用户信息
function getUserInfo() {
    return axios.get('/user/info');
}

// 文件上传
function fileUpload(params) {
    return axios.post('/file/upload', params, { timeout: 60 * 1000 })
}
// 根据文件路径获取文件列表
function getListByPath(params) {
    return axios.get('/file/path', { params: params })
}
// 根据文件类型获取文件列表
function getListByClass(params) {
    return axios.get('/file/class', { params: params })
}
// 新建文件夹
function newFolder(params) {
    return axios.post('/file/newFolder', params)
}
// 根据关键字查找文件
function searchFiles(params) {
    return axios.get('/file/search', { params: params })
}
// 文件删除
function fileDelete(data) {
    return axios.post('/file/delete', data)
}
// 文件重命名
function fileRename(params) {
    return axios.get('/file/rename', { params: params })
}
// 文件复制或移动
function fileCopyOrMove(params) {
    return axios.post('/file/copyOrMove', params)
}
// 文件合并
function fileMerge(params) {
    return axios.get('/file/merge', { params })
}
// 文件上传路径
const fileUploadUrl = '/api/file/chunk'

export default{
    login,
    getUserInfo,
    fileUpload,
    getListByPath,
    getListByClass,
    newFolder,
    searchFiles,
    fileDelete,
    fileRename,
    fileCopyOrMove,
    fileMerge,
    fileUploadUrl,
}