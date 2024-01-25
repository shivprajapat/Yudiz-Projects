const mongoose = require('mongoose')
const { gymDBConnect } = require('../../../database/mongoose')
const MealPlanModel = require('../model')
const { status } = require('../../../data')
const MealPlanDetailsSchema = new mongoose.Schema(
  {
    iMealPlanId: { type: mongoose.Types.ObjectId, ref: MealPlanModel },
    dMealPlanDate: { type: Date, required: true },
    sDescription: { type: String, required: true },
    eStatus: { type: String, enum: status, default: 'Y' }
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
)
MealPlanDetailsSchema.index({ iMealPlanId: 1, dMealPlanDate: 1 }, { unique: true })
module.exports = gymDBConnect.model('mealPlanDetails', MealPlanDetailsSchema)
