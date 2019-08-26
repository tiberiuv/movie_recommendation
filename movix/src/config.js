let default_config = {
    gatewayApi: 'http://localhost:8085',
    movieApi: 'http://localhost:8088',
    userApi: 'http://localhost:8087',
    searchApi: 'http://localhost:8086',
    publicKey: `-----BEGIN PUBLIC KEY-----
    MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAyWYzj8TCaAOOyoiLtCNY
    CfmgD8wyxg6FNjr3YXozrYkZHlBd5r+3I/MimpbFzs46PUBvTbgWXLJL0sAUzaPJ
    dpx+bZtf0n05mlSZvrrKoqMqCfVXCeaWsfsTlhUn1VDbmGrOxs2fkMQ0qGL4iOWB
    XJQE5EBwnDn3GrQhL4Ybma4x3of8sGj17rrFKo3W913B0YvZ2y3UzZcY/z2n0zFO
    iT0cALsoAAab1l9+4KDUYAgXB0WQAMxV6nAtQZxsg87KVlLyBZgDJ/wh9Jq11yck
    WgL0krQWZipZ0uqBotECpcZ0JbLBTIte82p/EdIm2EcWRPiyzz3dOqVCwWLnh4Zu
    j4QGriLtj0yr++K8wiQK+pJ/A2EqacQiANg5f/+7MCnPvg5/tpwiw6fqhsYqFtcx
    Bo1T6VvC1v22dBGKV7XDd8jnooT3SPp4uqgp3lYUB1DcaZBefCEMbkhyK8GCS0Ax
    OWeU3mz8avYhxr43D5mjyfvqSxBqNtsK7XD+LHUOT2IL5/0hUmK0O5kCTmwrjgBH
    55n/IYb2yK+MoM4SQ0lYYhCW7w71l99G34j9qn2SvH6E0vKB6/ef3lFA9M3cXDo3
    HVHtfbiFZvhrsTkYOyPlSKZIS0T1h1lKXihM/gBGJ3M1oQZ+ZRV1Z9orEf9E0Ff+
    lu3UYi11DRiHerXm26R2voMCAwEAAQ==
    -----END PUBLIC KEY-----`,
    SIGN_ALGORITHM: 'RS512',
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
