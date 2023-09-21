const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DesiredIdentitySchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  identityName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  creationDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('DesiredIdentity', DesiredIdentitySchema);
