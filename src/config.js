
let default_config = {
    auth_api: 'http://localhost:8081'
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