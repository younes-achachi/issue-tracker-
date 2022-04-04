const { default: mongoose } = require('mongoose');

const Schema = require('mongoose').Schema;

const IssueSchema = new Schema({
	issue_title: { type: String, required: true },
	issue_text: { type: String, required: true },
	created_on: Date,
	updated_on: Date,
	created_by: { type: String, required: true },
	assigned_to: { type: String },
	created_on: Date,
	updated_on: Date,
	open: Boolean,
	status_text: { type: String }
});

const Issue = mongoose.model('Issue', IssueSchema);

const ProjectSchema = Schema({
	name: { type: String, required: true },
	issues: [ IssueSchema ]
});
const Project = mongoose.model('Project', ProjectSchema);
exports.Issue = Issue;
exports.Project = Project;
