import { ObjectId } from "mongoose"

export interface IEvent {
    eventName: string
    gifted: string
    employee: ObjectId
}