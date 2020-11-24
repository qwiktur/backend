import mongoose, { isValidObjectId, SchemaTypes } from 'mongoose'
const Schema = mongoose.Schema;

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

const Image = mongoose.model('image', imageSchema);

module.exports = Image;