import mongoose, { Document } from 'mongoose'
import { ThemeModel } from './theme'
import { UserModel }  from './user'
import {QuestionModel} from './question'
const Schema = mongoose.Schema;

export interface GameModel extends Document{
    theme:ThemeModel,
    players:UserModel[]
    questions:GameQuestion[]
}

export interface GameQuestion{
    target: QuestionModel,
    history?: [{
        user:UserModel
        time:number,
        correct:boolean
    }]
}

const historySubSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    time: {
        type: Number
    },
    correct: {
        type: Boolean
    }
}, {
    _id: false
});

const questionSubSchema = new Schema({
    target: {
        type: Schema.Types.ObjectId,
        ref: 'question',
        required: [true, 'Question target is required']
    },
    history: {
        type: [{
            type: historySubSchema
        }],
        default: []
    }
}, {
    _id: false
});

const gameSchema = new Schema({
    theme: {
        type: Schema.Types.ObjectId,
        ref: 'theme',
        required: [true, 'Theme is required']
    },
    players: {
        type: [{
            type: Schema.Types.ObjectId,
            ref:'user',
        }],
        required: [true, 'Players are required'],
        validate: [{
            validator: (playerIds: string) => playerIds.length >= 2,
            message: '2 players minimum'
        }]
    },
    questions: {
        type: [{
            type: questionSubSchema
        }],
        required: [true, 'Questions are required']
    }
});

const Game = mongoose.model<GameModel>('game', gameSchema);

export default Game;