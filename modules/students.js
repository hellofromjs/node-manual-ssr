const fs = require('fs')

function sortStudentsByClass(students) {
	const sorted = {}

	for (const student of students) {
		if (Object.hasOwn(sorted, student.class)) {
			sorted[student.class].push(student)
		} else {
			sorted[student.class] = [student]
		}
	}

	return sorted
}

function getStudents() {
	const data = fs.readFileSync(`${__dirname}/../data/students.json`, 'utf-8')
	return JSON.parse(data)
}

function getStudentsWithAverages() {
	const data = fs.readFileSync(`${__dirname}/../data/averages.json`, 'utf-8')
	return JSON.parse(data)
}

function getStudentsByClass(className, students) {
	const classStudents = []
	for (const student of students) {
		if (student.class.toLowerCase() === className.toLowerCase()) {
			classStudents.push(student)
		}
	}

	return classStudents
}

function getStudentById(id, students) {
	for (const student of students) {
		if (student.id == id) {
			return student
		}
	}
}

function getStudentsByFirstName(firstName, students) {
	const classStudents = []
	for (const student of students) {
		if (student.firstName.toLowerCase() === firstName.toLowerCase()) {
			classStudents.push(student)
		}
	}

	return classStudents
}

function getStudentsByLastName(lastName, students) {
	const classStudents = []
	for (const student of students) {
		if (student.lastName.toLowerCase() === lastName.toLowerCase()) {
			classStudents.push(student)
		}
	}

	return classStudents
}

module.exports = {
	sortStudentsByClass,
	getStudents,
	getStudentsWithAverages,
	getStudentsByClass,
	getStudentById,
	getStudentsByFirstName,
	getStudentsByLastName,
}