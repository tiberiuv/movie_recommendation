import 'dotenv/config'

let default_config = {
    PORT: 8088,
}
let config = {
    development: {
        ...default_config,
    },
    production: {
        ...default_config
    },
    test: {
        ...default_config
    }
}

export default config[process.env.NODE_ENV]