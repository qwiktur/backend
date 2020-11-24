import mongoose, { Document } from 'mongoose'

export interface UserModel extends Document {
    email: string;
    username: string;
    password: string;
    role: 'basic' | 'supervisor' | 'admin';
    language: string;
    elo: number;
}

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
  enum: ['basic', 'supervisor', 'admin']
 },
 language:{
     type:String
 },
 elo:{
     type:Number
 }
});

const User = mongoose.model<UserModel>('user', UserSchema);

module.exports = User;