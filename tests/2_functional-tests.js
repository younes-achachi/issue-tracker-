const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { should } = require('chai');

chai.use(chaiHttp);
let deleteID;
suite('chai fcc code input test ', function() {
	suite('test post request', function() {
		test('Create an issue with every field: POST request to /api/issues/{project}', function(done) {
			let field = {
				issue_title: 'the test',
				issue_text: 'the text',
				created_by: 'created_by',
				assigned_to: 'assigned_to',
				status_text: 'status_text'
			};
			chai
				.request(server)
				.post('/api/issues/test')
				.set('content-type', 'application/json')
				.send(field)
				.end((err, res) => {
					let res1 = res.body;
					deleteID = res.body._id;
					assert.equal(res.status, 200);
					assert.equal(res1.issue_title, 'the test');
					assert.equal(res1.issue_text, 'the text');
					assert.equal(res1.created_by, 'created_by');
					assert.equal(res1.assigned_to, 'assigned_to');
					assert.equal(res1.status_text, 'status_text');
					console.log(res.body);
					done();
				});
		});
		test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done) {
			let field = {
				issue_title: 'the test',
				issue_text: 'the text',
				created_by: 'created_by',
				assigned_to: '',
				status_text: ''
			};
			chai
				.request(server)
				.post('/api/issues/test')
				.set('content-type', 'application/json')
				.send(field)
				.end((err, res) => {
					let res1 = res.body;
					assert.equal(res.status, 200);
					assert.equal(res1.issue_title, 'the test');
					assert.equal(res1.issue_text, 'the text');
					assert.equal(res1.created_by, 'created_by');
					assert.equal(res1.assigned_to, '');
					assert.equal(res1.status_text, '');

					done();
				});
		});
		test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done) {
			let field = {
				issue_title: '',
				issue_text: '',
				created_by: 'created_by',
				assigned_to: '',
				status_text: ''
			};
			chai
				.request(server)
				.post('/api/issues/test')
				.set('content-type', 'application/json')
				.send(field)
				.end((err, res) => {
					let res1 = res.body;
					assert.equal(res.status, 200);
					assert.equal(res.body.error, 'required field(s) missing');
					done();
				});
		});
		test('View issues on a project: GET request to /api/issues/{project}', function(done) {
			let field = {
				issue_title: 'the test',
				issue_text: 'the text'
			};
			chai.request(server).get('/api/issues/test').end((err, res) => {
				let res1 = res.body;
				assert.equal(res.status, 200);
				assert.isAbove(res.body.length, 2);
				console.log(res.body.error);
				done();
			});
		});
		test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
			let field = {
				issue_title: 'the test',
				issue_text: 'the text'
			};
			chai.request(server).get('/api/issues/test').query({ _id: deleteID }).end((err, res) => {
				let res1 = res.body;
				assert.equal(res.status, 200);
				assert.deepEqual(res.body[0], res.body[0]);
				console.log(res.body.error);
				done();
			});
		});
		test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done) {
			let field = {
				issue_title: 'the test',
				issue_text: 'the text'
			};
			chai
				.request(server)
				.get('/api/issues/test')
				.query({ _id: deleteID, issue_text: 'the text' })
				.end((err, res) => {
					let res1 = res.body;
					assert.equal(res.status, 200);
					assert.equal(res.body[0], res.body['0']);
					console.log(res.body.error);
					done();
				});
		});
		test('Update one field on an issue: PUT request to /api/issues/{project}', function(done) {
			let field = {
				issue_title: 'the test',
				issue_text: 'the text'
			};
			chai
				.request(server)
				.put('/api/issues/test')
				.set('content-type', 'application/json')
				.send({ _id: deleteID, issue_title: 'the put' })
				.end((err, res) => {
					let res1 = res.body;
					assert.equal(res.status, 200);
					assert.equal(res.body._id, deleteID);
					assert.equal(res.body.result, 'successfully updated');
					console.log(res.body.error);
					done();
				});
		});
		test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done) {
			let field = {
				issue_title: 'the test',
				issue_text: 'the text'
			};
			chai
				.request(server)
				.put('/api/issues/test')
				.set('content-type', 'application/json')
				.send({ _id: deleteID, issue_title: 'the put', issue_text: 'the text' })
				.end((err, res) => {
					let res1 = res.body;
					assert.equal(res.status, 200);
					assert.equal(res.body._id, deleteID);
					assert.equal(res.body.result, 'successfully updated');
					console.log(res.body.error);
					done();
				});
		});
		test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
			let field = {
				issue_title: 'the test',
				issue_text: 'the text'
			};
			chai
				.request(server)
				.put('/api/issues/test')
				.set('content-type', 'application/json')
				.send({ issue_title: 'the put', issue_text: 'the text' })
				.end((err, res) => {
					let res1 = res.body;
					assert.equal(res.status, 200);
					assert.equal(res.body.error, 'missing _id');
					console.log(res.body.error);
					done();
				});
		});
		test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done) {
			let field = {
				issue_title: 'the test',
				issue_text: 'the text'
			};
			chai
				.request(server)
				.put('/api/issues/test')
				.set('content-type', 'application/json')
				.send({ _id: deleteID })
				.end((err, res) => {
					let res1 = res.body;
					assert.equal(res.status, 200);
					assert.equal(res.body.error, 'no update field(s) sent');
					assert.equal(res.body._id, deleteID);
					console.log(res.body.error);
					done();
				});
		});
		test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
			let field = {
				issue_title: 'the test',
				issue_text: 'the text'
			};
			chai
				.request(server)
				.put('/api/issues/test')
				.set('content-type', 'application/json')
				.send({ _id: '624a5ed1e7fc7474c1b3', issue_text: 'none' })
				.end((err, res) => {
					let res1 = res.body;
					assert.equal(res.status, 200);
					assert.equal(res.body.error, 'could not update');

					console.log(res.body.error);
					done();
				});
		});
		test('Delete an issue: DELETE request to /api/issues/{project}', function(done) {
			let field = {
				issue_title: 'the test',
				issue_text: 'the text'
			};
			chai.request(server).delete('/api/issues/test').send({ _id: deleteID }).end((err, res) => {
				let res1 = res.body;
				assert.equal(res.status, 200);
				assert.equal(res.body.result, 'successfully deleted');
				console.log(res.body.error);
				done();
			});
		});
		test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {
			let field = {
				issue_title: 'the test',
				issue_text: 'the text'
			};
			chai.request(server).delete('/api/issues/test').send({ _id: '624a5ed1e7fc7474c1b3fe' }).end((err, res) => {
				let res1 = res.body;
				assert.equal(res.status, 200);
				assert.equal(res.body.error, 'could not delete');
				console.log(res.body.error);
				done();
			});
		});
		test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
			let field = {
				issue_title: 'the test',
				issue_text: 'the text'
			};
			chai.request(server).delete('/api/issues/test').send({ _id: '' }).end((err, res) => {
				let res1 = res.body;
				assert.equal(res.status, 200);
				assert.equal(res.body.error, 'missing _id');
				console.log(res.body.error);
				done();
			});
		});
	});
});
