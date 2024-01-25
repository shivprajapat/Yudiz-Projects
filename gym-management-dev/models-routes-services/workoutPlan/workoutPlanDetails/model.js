// @ts-check
const mongoose = require('mongoose')
const { gymDBConnect } = require('../../../database/mongoose')
const ExerciseModel = require('../../exercise/model')
const WorkoutModel = require('../model')
const { status } = require('../../../data')
const WorkoutPlanDetailsSchema = new mongoose.Schema(
  {
    iWorkoutPlanId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: WorkoutModel },
    iExerciseId: { type: mongoose.Types.ObjectId, ref: ExerciseModel, required: true },
    dWorkoutDate: { type: Date, required: true },
    sDescription: { type: String, required: true },
    eStatus: { type: String, enum: status, default: 'Y' }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)
module.exports = gymDBConnect.model('workoutPlanDetails', WorkoutPlanDetailsSchema)
