const mongoose = require('mongoose');

const scheduledTaskSchema = new mongoose.Schema({
  cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },

}, {
    timestamps: true
});

module.exports = mongoose.model('ScheduledTask', scheduledTaskSchema);

