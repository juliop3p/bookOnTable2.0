import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    videoURL: {
      type: String,
      required: true,
    },
    textPortuguese: {
      type: String,
      required: true,
    },
    textEnglish: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    view: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admins',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categories',
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Posts', PostSchema);
