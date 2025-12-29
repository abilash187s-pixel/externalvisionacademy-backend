
import mongoose from "mongoose";

export default mongoose.model("Registration", new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  whatsapp: String,
  location: String,
  age: String,
  preferredOption:String,
  receivedAt: { type: Date, default: Date.now }
}));
