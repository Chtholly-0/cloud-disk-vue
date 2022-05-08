module.exports = {
    publicPath: './',
    lintOnSave: true,
    configureWebpack: {
        //关闭 webpack 的性能提示
        performance: {
            hints:false
        }
    
    },
    devServer: {
        port: 8080,
        proxy: {
            "/api": {
                target: 'http://localhost:8888',
                changeOrigin: true,
                pathRewrite: {
                    '^/api' : ''
                }
            }
        }

    }
}