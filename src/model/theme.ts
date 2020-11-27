import mongoose, {Document} from 'mongoose'
import { BaseAttributes } from './model';

const Schema = mongoose.Schema;

export interface ThemeModel extends BaseAttributes, Document {
    name: string;
}

const themeSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: [true, 'Name is required'],
        trim: true
    }
}, {
    timestamps: true
});

const Theme = mongoose.model<ThemeModel>('theme', themeSchema);

export default Theme;