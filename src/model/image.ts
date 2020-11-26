import mongoose, { SchemaTypes, Document } from 'mongoose'
import { ThemeModel } from './theme';
const Schema = mongoose.Schema;

export interface ImageModel extends Document{
   src:string,
   title:string,
   theme:ThemeModel
}

const imageSchema = new Schema({
 src: {
  type: String,
  required: true,
  trim: true
 },
 title:{
    type:String,
    required:true,
    trim:true
 },
 theme: {
  type: SchemaTypes.ObjectId,
  ref: "theme",
  required: true
 }
});

const Image = mongoose.model<ImageModel>('image', imageSchema);

export default Image;