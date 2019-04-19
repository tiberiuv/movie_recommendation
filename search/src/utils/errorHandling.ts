import {Response} from 'express'

class ApiError implements Error {
    public name: string
    public message: string = 'Default Error'
    public status?: number = 500
    public errorType?: string

    constructor(message?: string, status?: number, errorType?: string) {
        if(message) this.message = message
        this.status = status
        this.errorType = errorType
    }
}

export const throwError = (status: number, errorType: string, errorMessage: string) => (error?: ApiError) => {
    if (!error) error = new ApiError(errorMessage)
    error.status = status
    error.errorType = errorType
    throw error
}

export const throwIf = (fn: (result: any) => any, code: number, errorType: string, errorMessage: string) => (result?: any) => {
    if (fn(result)) {
        return throwError(code, errorType, errorMessage)()
    }
    return result
}

export const sendSuccess = (res: Response) => (data?: any) => {
    res.status(200).json(data)
}

export const sendError = (res: Response, status: number, message: string) => (error?: ApiError) => {
    res.status((error && error.status) || status).json({
        type: 'error', 
        message: (error && error.message) || message, 
        error
    })
}
