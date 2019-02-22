export const throwError = (code, errorType, errorMessage) => error => {
    if (!error) error = new Error(errorMessage || 'Default Error')
    error.status = code
    error.errorType = errorType
    throw error
}
export const throwIf = (fn, code, errorType, errorMessage) => result => {
    if (fn(result)) {
        return throwError(code, errorType, errorMessage)()
    }
    return result
}
export const sendSuccess = (res, message) => data => {
    res.status(200).json({type: 'success', message, data})
}
export const sendError = (res, status, message) => error => {
    res.status(status || error.status).json({
        type: 'error', 
        message: message || error.message, 
        error
    })
}
