import mongoose, {Document} from 'mongoose'
import { BaseAttributes } from './model';
const Schema = mongoose.Schema;

export interface ThemeModel extends BaseAttributes, Document {
    name: string;
}
const themeSchema = new Schema({
 name: {
  type: String,
  required: true,
  trim: true
 }
}, {
    timestamps: true
 });

const Theme = mongoose.model<ThemeModel>('theme', themeSchema);

export default Theme;