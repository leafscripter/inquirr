var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

projectSchema = new Schema({
    unique_id: Number,
    title: String, 
    date: {type: Date, default: Date.now},
    description: String, 
    hidden: Boolean, 
    categories: Array, 
    meta: {
        viewsCount: Number, 
        favoriteCount: Number,
    }
})