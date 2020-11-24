import mongoose, { isValidObjectId, SchemaTypes } from 'mongoose'
const Schema = mongoose.Schema;

const questionSchema = new Schema({
 choices: {
    label:{
        type: String,
        required:true
    },
    correct:{
        type:Boolean
    }
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

const Question = mongoose.model('question', questionSchema);

module.exports = Question;