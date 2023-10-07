const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

var projectSchema = new Schema({
    unique_id: mongoose.ObjectId, // for generating unique identifiers
    title: String, 
    date: {type: Date, default: Date.now},
    requirements: [{
        keywords: [String],
        experience: Number,
        languages: [String],
        verification: Boolean,
    }],
    candidates: [{unique_id: Number, name: String}],
    collaborators: [{unique_id: Number, name: String}],
    teamSize: Number,
    acceptingNewMembers: Boolean,
    languages: [String],
    description: String, 
    hidden: Boolean,
    meta: {
        viewsCount: Number, 
        amountOfUsersInterested: Number,
    }
})

var Project = mongoose.model('Project', projectSchema);

module.exports = Project;