import mongoose, { isValidObjectId, SchemaTypes } from 'mongoose'
const Schema = mongoose.Schema;

const gameSchema = new Schema({
 
 theme: {
  type: SchemaTypes.ObjectId,
  ref: "theme"
 },
 players:{
     type:SchemaTypes.ObjectId,
     ref:"user"
 },
 questions:[{
     target:{
        type:SchemaTypes.ObjectId,
        ref:"question"
    },
    history:[{
        user:{
            type:SchemaTypes.ObjectId,
            ref:"user"
        },
        time:{
            type:Number
        },
        correct:{
            type:Boolean
        }
    }]
 }]
});

const Game = mongoose.model('game', gameSchema);

module.exports = Game;