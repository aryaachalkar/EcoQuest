// ═══════════════════════════════════════════════════════════════
//  User Model
// ═══════════════════════════════════════════════════════════════

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    schoolName: {
      type: String,
      required: [true, 'School name is required'],
      trim: true,
    },
    classStandard: {
      type: Number,
      required: [true, 'Class/Standard is required'],
      min: 1,
      max: 10,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // Don't return password in queries by default
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'ngo'],
      default: 'student',
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ─── Hash password before saving ─────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Compare password method ─────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
