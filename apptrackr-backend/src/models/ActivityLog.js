const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: { type: Number, required: true },      // references PostgreSQL user id
  action: { type: String, required: true },       // 'CREATE_PROJECT', 'UPDATE_PROJECT', etc.
  entity: { type: String, required: true },       // 'project'
  entityId: { type: Number },                     // which project was affected
  meta: { type: mongoose.Schema.Types.Mixed },    // any extra info (old values, new values)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);