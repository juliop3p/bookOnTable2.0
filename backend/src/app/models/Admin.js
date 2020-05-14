import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const AdminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    superAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password when saving
AdminSchema.pre('save', async function hashPassword(next) {
  this.password = await bcrypt.hash(this.password, 8);

  next();
});

// Check credentials (Session)
AdminSchema.statics.findByCredentials = async function findByCredentials(
  email,
  password
) {
  const admin = await this.findOne({ email });

  if (!admin) throw new Error('Admin not found.');

  if (!(await bcrypt.compare(password, admin.password))) {
    throw new Error('Wrong credentials.');
  }

  return admin;
};

export default mongoose.model('Admins', AdminSchema);
