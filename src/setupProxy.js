const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        createProxyMiddleware( '/api', {
            target: 'https://www.kocis.go.kr',
            pathRewrite: {
                '^/api': '/',
            },
            changeOrigin: true
        })
    )
};