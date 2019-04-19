
export const setToken = jwtToken => {
    localStorage.setItem("jwt", jwtToken)
}

export const getToken = () => {
    return localStorage.getItem('jwt')
}

export const logout = () => {
    return localStorage.removeItem('jwt')
}

export const checkToken = () => {
    return getToken() ? true : false
}

