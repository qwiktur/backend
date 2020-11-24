import mongoose, {Document} from 'mongoose'
const Schema = mongoose.Schema;

export interface ThemeModel extends Document {
    name: string;
}
const themeSchema = new Schema({
 name: {
  type: String,
  required: true,
  trim: true
 }
});

const Theme = mongoose.model<ThemeModel>('theme', themeSchema);

export default Theme;