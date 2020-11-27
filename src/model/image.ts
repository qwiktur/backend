import mongoose, { Document } from 'mongoose'
import { BaseAttributes } from './model';
import { ThemeModel } from './theme';
const Schema = mongoose.Schema;

export interface ImageModel extends BaseAttributes, Document{
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
  type: Schema.Types.ObjectId,
  ref: "theme",
  required: true
 }
}, {
   timestamps: true
});

const Image = mongoose.model<ImageModel>('image', imageSchema);

export default Image;