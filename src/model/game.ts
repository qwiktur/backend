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
        target:QuestionModel,
        history:[{
            user:UserModel
            time:Number,
            correct:Boolean
        }]
    }

const gameSchema = new Schema({
 
 theme: {
  type: Schema.Types.ObjectId,
  ref: "theme"
 },
 players:[{
     type:Schema.Types.ObjectId,
     ref:"user"
 }],
 questions:[{
     target:{
        type:Schema.Types.ObjectId,
        ref:"question"
    },
    history:[{
        user:{
            type:Schema.Types.ObjectId,
            ref:"user"
        },
        time:{
            type:Number
        },
        correct:{
            type:Boolean
        }
    }]
 }]
});

const Game = mongoose.model<GameModel>('game', gameSchema);

export default Game;