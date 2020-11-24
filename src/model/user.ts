import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const UserSchema = new Schema({
 email: {
  type: String,
  required: true,
  trim: true
 },
 username:{
    type:String,
    required:true,
    trim:true
 },
 password: {
  type: String,
  required: true
 },
 role: {
  type: String,
  default: 'basic',
  enum: ["basic", "supervisor", "admin"]
 },
 language:{
     type:String
 },
 elo:{
     type:Number
 }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;