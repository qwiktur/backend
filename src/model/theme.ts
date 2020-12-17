import mongooseToJson from '@meanie/mongoose-to-json';
import mongoose, {Document, Schema} from 'mongoose';
import { BaseAttributes } from './model';

export interface ThemeModel extends BaseAttributes, Document {
    name: string;
    image: string;
}

const themeSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: [true, 'Name is required'],
        trim: true
    },
    image: {
        type: Schema.Types.String,
        default: null
    }
}, {
    timestamps: true
});
themeSchema.plugin(mongooseToJson);

const Theme = mongoose.model<ThemeModel>('theme', themeSchema);

export default Theme;