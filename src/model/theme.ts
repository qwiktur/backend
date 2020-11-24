import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const themeSchema = new Schema({
 name: {
  type: String,
  required: true,
  trim: true
 }
});

const Theme = mongoose.model('theme', themeSchema);

module.exports = Theme;