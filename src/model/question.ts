import mongoose, {Document} from 'mongoose'
import { ThemeModel } from './theme';
const Schema = mongoose.Schema;

export interface QuestionModel extends Document{
    choices:[
        {
            label:string,
            correct:Boolean
        }
    ]
    ,
    title:string,
    theme:ThemeModel
}

const questionSchema = new Schema({
 choices: [{
    label:{
        type: String,
        required:true
    },
    correct:{
        type:Boolean
    }
 }],
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
});

const Question = mongoose.model<QuestionModel>('question', questionSchema);

export default Question