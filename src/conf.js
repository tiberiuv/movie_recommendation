import env from 'dotenv/config'

let default_config = {
    PORT: 8081,
    mysql: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'dev',
    },
    salt: '1234s',
    secret: 'mysecretstring',
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