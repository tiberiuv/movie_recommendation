let default_config = {
    gatewayApi: 'http://localhost:8080',
    movieApi: 'http://localhost:8088',
    userApi: 'http://localhost:8087',
    searchApi: 'http://localhost:8086',
}

let config = {
    development: {
        ...default_config,
        // authApi: 'http://192.168.64.5:31380/auth',
        // movieApi: 'http://192.168.64.5:31380/movie',
    },
    production: {
        ...default_config,
    },
    test: {
        ...default_config,
    },
}

export default config[process.env.NODE_ENV]
