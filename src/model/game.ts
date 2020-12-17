import mongooseToJson from '@meanie/mongoose-to-json';
import mongoose, { Document, Schema } from 'mongoose';
import randomString from 'crypto-random-string';
import { ThemeModel } from './theme';
import { UserModel }  from './user';
import { ImageModel }  from './image';
import { QuestionModel } from './question';
import { BaseAttributes } from './model';

export interface GameModel extends BaseAttributes, Document {
    code?: string;
    theme: ThemeModel;
    players: UserModel[];
    questions: GameQuestion[];
    image: ImageModel;
}

export interface GameQuestion {
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
    code: {
        type: Schema.Types.String,
        default: () => randomString({ length: 4, type: 'numeric' })
    },
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
        required: [true, 'Players are required']
    },
    questions: {
        type: [{
            type: questionSubSchema
        }],
        required: [true, 'Questions are required']
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: 'image',
        select: false
    }
}, {
    timestamps: true
});
gameSchema.plugin(mongooseToJson);

const Game = mongoose.model<GameModel>('game', gameSchema);

export default Game;