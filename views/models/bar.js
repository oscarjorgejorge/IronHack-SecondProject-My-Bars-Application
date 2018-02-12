'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BarSchema = Schema({
  username: String,
  password: String,
  barname: String,
  price: Number,
  location: { type: { type: String }, coordinates: [Number] }

});

module.exports = mongoose.model('Bar', BarSchema);
