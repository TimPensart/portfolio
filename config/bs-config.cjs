module.exports = {
    ui: {
        port: 3000,
        weinre: {
            port: 8080,
        },
    },
    files: ["**/*.php", "wp-content/themes/tims-theme/dist/styles/pages/*.css", "wp-content/themes/tims-theme/dist/scripts/*.js"],
    port: 3000,
    ghostMode: false,
    open: false,
    browser: ["google chrome"],
    notify: false,
    proxy: "http://portfolio.local",
    host: "portfolio.local",
    // https: {
    //     key: '/Applications/MAMP/Library/OpenSSL/certs/timstheme.local.key',
    //     cert: '/Applications/MAMP/Library/OpenSSL/certs/timstheme.local.crt',
    // },
};
