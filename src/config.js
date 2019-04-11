
let default_config = {
    authApi: 'http://localhost:8080',
    moviesApi: 'http://localhost:8088',
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