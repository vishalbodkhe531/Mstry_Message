import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  userName: string;
  email: string;
  password: string;
  veryfyCode: string;
  veryfyCodeExpiry: Date;
  isVeryfied: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const userSchema: Schema<User> = new Schema({
  userName: {
    type: String,
    required: [true, "UserName is required"],
    trim: true,
    unique: true,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "please enter a valid email address"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },

  veryfyCode: {
    type: String,
    required: [true, "Veryfy code is required"],
  },

  veryfyCodeExpiry: {
    type: Date,
    required: [true, "Veryfy code expiry is required"],
  },

  isVeryfied: {
    type: Boolean,
    default: false,
  },

  isAcceptingMessage: {
    type: Boolean,
    default: false,
  },

  messages: [messageSchema],
});

const userModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default userModel;
