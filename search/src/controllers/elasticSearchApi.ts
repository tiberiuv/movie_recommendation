import {sendSuccess} from '../utils/errorHandling'
import {Request, Response} from 'express'
// import {Query} from '../models/query'

export const health = async (req: Request, res: Response) => {
    sendSuccess(res)('Alive!')
}

export const search = async (req: Request, res: Response) => {
    const {query: Query} = req
}