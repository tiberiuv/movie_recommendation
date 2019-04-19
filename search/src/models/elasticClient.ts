import elasticsearch, {Client} from 'elasticsearch'
import {throwIf, sendError} from '../utils/errorHandling'
export class ElasticClient {
    public client: Client 

    constructor(host: string, port: number) {
        const uri = `${host}:${port}`
        this.client = new elasticsearch.Client({
            hosts: [uri]
        })
    }

    public testConnection = async () => {
        try{
            await this.client.ping({
                requestTimeout: 30000,
            }).then(
                throwIf(r => !r, 500, 'Elastic error','Elastic cluster is down')()
            )
        } catch (err) sendError()(err)
    }

    public getQuery = () => {

    }
}