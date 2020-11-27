import mongoose, { Document, Schema } from 'mongoose';
import { BaseAttributes } from './model';
import Theme, { ThemeModel } from './theme';

export interface ImageModel extends BaseAttributes, Document{
    src: string;
    title: string;
    theme: ThemeModel;
}

const imageSchema = new Schema({
    src: {
        type: Schema.Types.String,
        required: [true, 'Source is required'],
        trim: true
    },
    title: {
        type: Schema.Types.String,
        required: [true, 'Title is required'],
        trim: true
    },
    theme: {
        type: Schema.Types.ObjectId,
        ref: 'theme',
        required: [true, 'Theme is required'],
        validate: {
            validator: (themeId: string) => Theme.exists({ _id: themeId }),
            message: 'Invalid theme'
        }
    }
},  {
    timestamps: true
});

const Image = mongoose.model<ImageModel>('image', imageSchema);

export default Image;