const fs = require('fs')
const path = require('path')

function writeAverages(students) {
	for (let i = 0; i < students.length; i++) {
		students[i].average_grade = getAverageGrade(students[i].subjects_grades).toFixed(2)
	}

	fs.writeFileSync('./data/averages.json', JSON.stringify(students))
}

function getAverageGrade(grades) {
	let subjectsCount = 0
	let totalGrades = 0

	for (const [key, value] of Object.entries(grades)) {
		totalGrades += value
		subjectsCount++
	}

	return totalGrades / subjectsCount
}

function loadTemplates() {
	const namesArr = fs.readdirSync(`${__dirname}/../templates`, { withFileTypes: true })
		.filter(item => !item.isDirectory())
		.map(item => item.name)

	const loadedTpl = {}

	for (const name of namesArr) {
		loadedTpl[`${path.parse(name).name}Tpl`] = fs.readFileSync(`${__dirname}/../templates/${name}`, 'utf-8')
	}

	return loadedTpl
}

function getGradesHtml(subjects, templates) {
	const { gradeListElementTpl } = templates

	let result = ''

	for (const [key, value] of Object.entries(subjects)) {
		let el = gradeListElementTpl.replace('{%SUBJECT%}', key)
		result += el.replace('{%GRADE%}', value)
	}

	return result
}

function getClassesListHtml(templates, students) {
	const { classListElementTpl } = templates

	const classes = getClasses(students)

	return classes.map(studentClass => classListElementTpl.replaceAll('{%CLASS_NAME%}', studentClass)).join('')
}

function getClasses(students) {
	const classes = new Set()

	for (const student of students) {
		classes.add(student.class)
	}

	return Array.from(classes)
}

module.exports = {
	writeAverages,
	loadTemplates,
	getGradesHtml,
	getClassesListHtml,
}