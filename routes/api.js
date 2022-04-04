'use strict';
const mongoose = require('mongoose');
const { Issue } = require('../db/models.js');
const { Project } = require('../db/models.js');
module.exports = function(app) {
	app
		.route('/api/issues/:project')
		.get(function(req, res) {
			let project = req.params.project;
			let query = req.query;
			Project.findOne({ name: project }, (err, data) => {
				if (data) {
					res.send(
						data.issues.filter((e) => {
							return Object.keys(query).every((a, i) => {
								if (a === '_id') {
									return e[a].toString() === query[a];
								}
								console.log(e[a], query[a]);
								return e[a] === query[a];
							});
						})
					);
				}
			});
		})
		.post(function(req, res) {
			let project = req.params.project;
			const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
			if (!issue_text || !issue_title || !created_by) {
				res.json({ error: 'required field(s) missing' });
				return;
			}
			const newIssue = new Issue({
				issue_title: issue_title,
				issue_text: issue_text,
				created_on: new Date(Date.now()).toISOString(),
				updated_on: new Date(Date.now()).toISOString(),
				created_by: created_by,
				assigned_to: assigned_to || '',
				open: 'true',
				status_text: status_text || ''
			});
			Project.findOne({ name: project }, (err, projectData) => {
				if (!projectData) {
					const newProjectData = Project({ name: project });
					newProjectData.issues.push(newIssue);
					newProjectData.save((err, data) => {
						console.log(newProjectData);
						if (err || !data) {
							res.send('there was an error on saving');
						} else {
							res.json({ newIssue });
						}
					});
				} else {
					console.log(projectData);
					projectData.issues.push(newIssue);
					projectData.save((err, data) => {
						if (err || !data) {
							res.send('there is an error on post request ');
						} else {
							res.json(newIssue);
						}
					});
				}
			});
		})
		.put(function(req, res) {
			let project = req.params.project;
			const { _id, issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
			if (!_id) {
				res.json({ error: 'missing _id' });
				return;
			}
			console.log(_id);

			let fields = Object.entries(req.body).filter((e) => e[1]);

			let fieldsLength = fields.length;
			console.log(fields);
			if (!(fieldsLength > 1)) {
				res.json({ error: 'no update field(s) sent', _id: _id });
				return;
			}
			Project.findOne({ name: project }, (err, data) => {
				console.log(data);
				if (err || !data) {
					res.json({ error: 'could not update', _id: _id });
					return;
				} else {
					const issueData = data.issues.id(_id);
					console.log(issueData, 'allora');
					if (!issueData) {
						res.json({ error: 'could not update', _id: _id });
						return;
					}
					fields.forEach((e, i) => (issueData[fields[i][0]] = fields[i][1]), 1);
					issueData['updated_on'] = new Date(Date.now()).toISOString();
					data.save((err, data) => {
						console.log(data);
						if (data) {
							res.json({ result: 'successfully updated', _id: _id });
							return;
						} else {
							res.json({ error: 'could not update', _id: _id });
						}
					});
				}
			});
		})
		.delete(function(req, res) {
			let project = req.params.project;
			const { _id } = req.body;
			if (!_id) {
				res.json({ error: 'missing _id' });
				return;
			}
			Project.findOne({ name: project }, (err, data) => {
				let issueData = data.issues.id(_id);
				data.save();
				if (issueData) {
					issueData.remove();

					res.json({ result: 'successfully deleted', _id: _id });
					return;
				} else {
					res.json({ error: 'could not delete', _id: _id });
				}
			});
		});
};
