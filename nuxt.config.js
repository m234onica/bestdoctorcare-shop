import colors from 'vuetify/es5/util/colors'
const webpack = require("webpack")

export default {
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        titleTemplate: '%s - bestdoctorcare-admin',
        title: 'bestdoctorcare-admin',
        htmlAttrs: {
            lang: 'en'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        'quill/dist/quill.snow.css',
        'quill/dist/quill.bubble.css',
        'quill/dist/quill.core.css'
    ],

    router: {
        middleware: "token",
    },

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        { src: '~plugins/vueQuillEditor.js', ssr: false },
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/vuetify
        '@nuxtjs/vuetify',
        ["@nuxtjs/dotenv", { filename: ".env." + process.env.NODE_ENV }], //這是給預設 .env 使用
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        "@nuxtjs/axios",
        "@nuxtjs/apollo",
    ],

    axios: {
        baseURL: process.env.APP_URL
    },

    // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
    vuetify: {
        customVariables: ['~/assets/variables.scss'],
        theme: {
            themes: {
                light: {
                    primary: colors.blue,
                    secondary: colors.blue.darken1,
                    accent: colors.shades.black,
                    error: colors.red,
                }
            }
        }
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        plugins: [
            new webpack.ProvidePlugin({
                'window.Quill': 'quill/dist/quill.js',
                'Quill': 'quill/dist/quill.js'
            }),
        ],
        extend(config, { isDev, isClient }) {

            config.node = {
                fs: 'empty',
                child_process: 'empty'
            }
        },

    },
    apollo: {
        clientConfigs: {
            default: {
                httpEndpoint:
                    `${process.env.SHOPIFY_API_URL}/api/2021-04/graphql.json`,
                httpLinkOptions: {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Shopify-Access-Token": process.env.STOREFRONT_ACCESS_TOKEN
                    }
                },
                persisting: false,
            },
        }
    },

    serverMiddleware: [
        {
            path: '/api',
            handler: '~/api/index.js'
        }

    ],
}

