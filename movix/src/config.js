
let default_config = {
    authApi: 'http://localhost:8080',
    movieApi: 'http://localhost:8088',
}

let config = {
    development: {
        ...default_config,
        authApi: 'http://192.168.64.4:31380/auth',
        movieApi: 'http://192.168.64.4:31380/movie'
    },
    production: {
        ...default_config
    },
    test: {
        ...default_config
    }
}

export default config[process.env.NODE_ENV]