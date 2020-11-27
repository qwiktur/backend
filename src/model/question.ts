import mongoose, {Document} from 'mongoose'
import { BaseAttributes } from './model';
import Theme, { ThemeModel } from './theme';

const Schema = mongoose.Schema;

export interface QuestionModel extends BaseAttributes, Document{
    theme: ThemeModel;
    title: string;
    choices: Choice[];
}

export interface Choice {
    label: string;
    correct: boolean;
}

const choiceSubSchema = new Schema({
    label: {
        type: Schema.Types.String,
        required: [true, 'Choice label is required']
    },
    correct: {
        type: Schema.Types.Boolean,
        required: [true, 'Choice correct is required']
    }
});

const questionSchema = new Schema({
    theme: {
        type: Schema.Types.ObjectId,
        ref: 'theme',
        required: [true, 'Theme is required'],
        validate: {
            validator: (themeId: string) => Theme.exists({ _id: themeId }),
            message: 'Invalid theme'
        }
    },
    title: {
        type: Schema.Types.String,
        required: [true, 'Title is required'],
        trim: true
    },
    choices: {
        type: [{
            type: choiceSubSchema
        }],
        required: [true, 'Choices are required'],
        validate: {
            validator: (choices: Choice[]) => choices.some(currentChoice => currentChoice.correct),
            message: 'One choice must be correct'
        }
    }
}, {
    timestamps: true
});

const Question = mongoose.model<QuestionModel>('question', questionSchema);

export default Question