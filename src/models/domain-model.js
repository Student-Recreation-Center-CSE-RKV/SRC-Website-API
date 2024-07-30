const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const domainSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image:{type:String},
    resources: [{ type: Schema.Types.ObjectId, ref: 'Resource' }],
    contactForums: [{ type: Schema.Types.ObjectId, ref: 'ContactForum' }],
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }]
},{timestamps:true});

const Domain = mongoose.model('Domain', domainSchema);

module.exports = Domain;
