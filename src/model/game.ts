import mongoose, { Document, Schema } from 'mongoose';
import { ThemeModel } from './theme';
import { UserModel }  from './user';
import {QuestionModel} from './question';
import { BaseAttributes } from './model';

export interface GameModel extends BaseAttributes, Document{
    theme:ThemeModel;
    players:UserModel[];
    questions:GameQuestion[];
}

export interface GameQuestion{
    target: QuestionModel;
    history?: [{
        user: UserModel;
        time: number;
        correct: boolean;
    }];
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
}, {
    timestamps: true
});

const Game = mongoose.model<GameModel>('game', gameSchema);

export default Game;