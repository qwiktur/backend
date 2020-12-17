import mongooseToJson from '@meanie/mongoose-to-json';
import mongoose, { Document, Schema } from 'mongoose';
import ImageManager from '../image-manager';
import { BaseAttributes } from './model';
import Theme, { ThemeModel } from './theme';

export interface ImageModel extends BaseAttributes, Document{
    src: string;
    title: string;
    theme: ThemeModel;
    toBase64?: () => Promise<string>;
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
    timestamps: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});
imageSchema.method('toBase64', async function(this: ImageModel): Promise<string> {
    const imgManager = new ImageManager(this);
    await imgManager.load();
    return await imgManager.toBase64();
});
imageSchema.plugin(mongooseToJson);

const Image = mongoose.model<ImageModel>('image', imageSchema);

export default Image;