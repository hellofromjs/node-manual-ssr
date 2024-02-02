const http = require('http')
const url = require('url')

const { sortStudentsByClass,
	getStudents,
	getStudentsWithAverages,
	getStudentsByClass,
	getStudentById,
	getStudentsByFirstName,
	getStudentsByLastName } = require('./modules/students')

const {
	writeAverages,
	loadTemplates,
	getGradesHtml,
	getClassesListHtml,
} = require('./modules/utilities')


const host = 'localhost'
const port = 8888
const templates = loadTemplates()
const students = getStudents()


const server = http.createServer((req, res) => {
	const { query, pathname } = url.parse(req.url, true)

	switch (pathname) {
		case '/': {
			res.writeHead(200, { 'Content-Type': 'text/html' })
			res.end(renderClassList())
			break
		}
		case '/class': {
			res.writeHead(200, { 'Content-Type': 'text/html' })
			res.end(renderClassStudents(query))
			break
		}
		case '/student': {
			res.writeHead(200, { 'Content-Type': 'text/html' })
			res.end(renderStudentData(query))
			break
		}
		case '/search': {
			res.writeHead(200, { 'Content-Type': 'text/html' })
			res.end(renderFoundStudents(query))
			break
		}
		case '/averages': {
			res.writeHead(200, { 'Content-Type': 'text/html' })
			res.end(renderAveragesSummary())
			break
		}
		default: {
			res.writeHead(404, {
				'Content-Type': 'text/html',
			})
			res.end('<h1>Page not found</h2>')
		}
	}

})

server.listen(port, host, () => {
	console.log(`Server is listening on ${host}:${port}`)
})


function renderClassList() {
	const { mainTpl, navbarTpl } = templates

	const classesHtml = getClassesListHtml(templates, students)
	return mainTpl.replace('{%CLASS_LIST%}', classesHtml).replace('{%NAVBAR%}', navbarTpl)
}

function renderClassStudents(query) {
	const { cardTpl, studentsListTpl, navbarTpl } = templates

	const studentsByClass = getStudentsByClass(query['name'], students)

	if (query['sort'] == 'asc') {
		studentsByClass.sort((a, b) => a.lastName.localeCompare(b.lastName))
	} else {
		studentsByClass.sort((a, b) => b.lastName.localeCompare(a.lastName))
	}

	const studentCards = studentsByClass.map(student => {
		let card = cardTpl.replaceAll('{%FULL_NAME%}', `${student.firstName} ${student.lastName}`)
		card = card.replaceAll('{%CLASS%}', student.class)
		return card.replaceAll('{%ID%}', student.id)
	}).join('')

	output = studentsListTpl.replaceAll('{%CLASS%}', query['name']).replace('{%NAVBAR%}', navbarTpl)

	return output.replace('{%STUDENTS_LIST%}', studentCards)
}

function renderStudentData(query) {
	const { studentDataTpl, navbarTpl } = templates

	const student = getStudentById(query['id'], students)

	let studentData = studentDataTpl.replace('{%ID%}', student.id)
	studentData = studentData.replaceAll('{%FULL_NAME%}', `${student.firstName} ${student.lastName}`)
	studentData = studentData.replaceAll('{%CLASS%}', student.class)
	studentData = studentData.replaceAll('{%GRADES%}', getGradesHtml(student.subjects_grades, templates))

	return studentData.replace('{%NAVBAR%}', navbarTpl)
}

function renderFoundStudents(query) {

	let foundStudents = []

	if (query['firstName']) {
		foundStudents = getStudentsByFirstName(query['firstName'], students)
	} else if (query['lastName']) {
		foundStudents = getStudentsByLastName(query['lastName'], students)
	} else if (query['class']) {
		foundStudents = getStudentsByClass(query['class'], students)
	}

	const { cardTpl, studentsListTpl, navbarTpl } = templates

	const studentCards = foundStudents.map(student => {
		let card = cardTpl.replaceAll('{%FULL_NAME%}', `${student.firstName} ${student.lastName}`)
		card = card.replaceAll('{%CLASS%}', student.class)
		return card.replaceAll('{%ID%}', student.id)
	}).join('')

	return studentsListTpl.replace('{%STUDENTS_LIST%}', studentCards).replace('{%NAVBAR%}', navbarTpl)
}


function renderAveragesSummary() {
	writeAverages(students)

	const studentsWithAverages = getStudentsWithAverages()

	const sortedStudents = sortStudentsByClass(studentsWithAverages)

	const { classAveragesTpl, studentAveragesTpl, navbarTpl, averageListElementTpl } = templates

	let classAverages = ''
	for (const [key, value] of Object.entries(sortedStudents)) {
		classAverages += classAveragesTpl.replace('{%CLASS%}', key)

		let classStudentsList = ''
		for (const studentData of value) {
			classStudentsList += averageListElementTpl.replace('{%FULL_NAME%}', `${studentData.firstName} ${studentData.lastName}`)
				.replace('{%AVERAGE%}', studentData.average_grade)
		}

		classAverages = classAverages.replace('{%AVERAGE_DATA_ELEMENT%}', classStudentsList)
	}

	return studentAveragesTpl.replace('{%CLASS_AVERAGES%}', classAverages).replace('{%NAVBAR%}', navbarTpl)
}
