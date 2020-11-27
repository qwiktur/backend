import mongoose, { Document } from 'mongoose'
import { BaseAttributes } from './model';

export interface UserModel extends BaseAttributes, Document {
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
     type:Number,
     default:0
 }
}, {
    timestamps: true
 });

const User = mongoose.model<UserModel>('user', UserSchema);

export default User;