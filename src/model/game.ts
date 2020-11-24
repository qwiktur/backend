import mongoose, { SchemaTypes, Document } from 'mongoose'
import { ThemeModel } from './theme'
import { UserModel }  from './user'
import {QuestionModel} from './question'
const Schema = mongoose.Schema;

export interface gameModel extends Document{
    theme:ThemeModel,
    players:UserModel[]
}

export interface gameQuestion{
    question:[{
        target:QuestionModel,
        history:[{
            user:UserModel
            time:Number,
            correct:Boolean
        }]
    }]
}

const gameSchema = new Schema({
 
 theme: {
  type: SchemaTypes.ObjectId,
  ref: "theme"
 },
 players:{
     type:SchemaTypes.ObjectId,
     ref:"user"
 },
 questions:[{
     target:{
        type:SchemaTypes.ObjectId,
        ref:"question"
    },
    history:[{
        user:{
            type:SchemaTypes.ObjectId,
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

const Game = mongoose.model<gameModel>('game', gameSchema);

export default Game;