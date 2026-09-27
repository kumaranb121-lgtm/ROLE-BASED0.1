import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    classId: { type: String, required: true },
    timetableSlot: { type: String, required: true },
    date: { type: Date, required: true },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    presentCount: { type: Number, required: true },
    absentCount: { type: Number, required: true },
    absentRollNos: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Attendance = mongoose.model('Attendance', attendanceSchema);
