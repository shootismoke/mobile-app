/**
 * @file	Merging Translation Namespace
 * @author	ngdangtu (twitter)
 *
 * From the project root, run:
 * 		node scripts/packTranslations.js
 */
const fs = require('fs')
const p = require('path')

const ROOT = p.join('App', 'localization')
const SRC = 'namespaces'
const DEST = 'languages'
const NAME = /([a-zA-Z\-]{2,5})\@([\w\-]+)(?=\.json)/i // regexr.com/5dud0
const OLD = /(?=_old)*/i //


const MSG = {}

MSG.no_translation = `
Translation files not found!
Please make sure the translation files has this pattern: 'lang-code@namespace.json'`
MSG.wrong_content = 'The writeTo only accepts ReadableStream or string as content param.'
MSG.cleaned = target => `[${target}] is deleted!`
MSG.saved = (file, src) => `Exporting ${file} from '${src}' is completed.`




const Scanner = {}

Scanner.filterFiles = paths => paths.filter(path => {
	const isFile = path.isFile()
	const isTraslatedFile = NAME.test(path.name)
	return isFile && isTraslatedFile
})

Scanner.getValidFilenames = paths => Scanner
	.filterFiles(paths)
	.map(file => {
		const filename = file.name.match(NAME)
		let o = {}
		o.name = filename[0]
		o.code = filename[1]
		o.ns = filename[2]
		return o
	})

Scanner.objectize = files => {
	let list = {}
	for (const file of files) {
		if (!list[file.code])
			list[file.code] = [[file.ns, file.name]]
		else
			list[file.code].push([file.ns, file.name])
	}
	return list;
}


Scanner.scan = dir => new Promise((resolve, reject) => {
	const path = p.join(ROOT, dir)
	const option = { withFileTypes: true }
	const handler = (error, paths) => {
		if (error) reject(error)

		const files = Scanner.getValidFilenames(paths)
		if (!files) reject(new Error(MSG.no_translation))
		else resolve(Scanner.objectize(files))
	}
	fs.readdir(path, option, handler)
})


const Json = {}

Json.token = {
	open: '{\n',
	item: name => `\t"${name}": `,
	separator: ',\n',
	close: '\n}'
}

Json.writeTo = (filepath, content, flags = 'a') => new Promise((res, rej) => {
	const path = p.join(ROOT, filepath)
	const writer = fs.createWriteStream(path, { flags })

	if (content instanceof fs.ReadStream)
		content.pipe(writer)
			.on('finish', res)
			.on('error', rej)
	else if (typeof content === 'string')
		writer.end(content, 'utf-8', res)
	else
		rej(MSG.wrong_content)
})

Json.header = dest => Json.writeTo(dest, Json.token.open, 'w')

Json.body = async ({ path, lang, nsMap }) => {
	const mapSize = nsMap.length
	for (let i = 0; i < mapSize; i++) {
		const ns = nsMap[i][0]
		const srcFilename = nsMap[i][1]
		const src = p.join(ROOT, path.src, `${srcFilename}.json`)
		const dest = p.join(path.dest, `${lang}.json`)
		const loader = fs.createReadStream(src)

		await Json.writeTo(dest, Json.token.item(ns))
		await Json.writeTo(dest, loader)
		if (i + 1 < mapSize)
			await Json.writeTo(dest, Json.token.separator)
	}
}

Json.footer = dest => Json.writeTo(dest, Json.token.close)

Json.save = async (meta) => {
	const filename = `${meta.lang}.json`
	const dest = p.join(meta.path.dest, filename)

	await Json.header(dest)
	await Json.body(meta)
	await Json.footer(dest)

	return MSG.saved(filename, p.join(ROOT, meta.path.src, meta.lang))
}

const checkDestDir = async (dest) => {
	const path = p.join(ROOT, dest)
	if (!fs.existsSync(path))
		return fs.promises.mkdir(path, { recursive: true })
}

const exportAll = async (path, list) => {
	let processes = []
	await checkDestDir(path.dest)
	for (const code in list) {
		const meta = { path, lang: code, nsMap: list[code] }
		processes.push(Json.save(meta))
	}
	return Promise.allSettled(processes)
}

const clean = dir => {
	const path = p.join(ROOT, dir)
	const ifFail = error => {
		if (error) throw error
		else console.log(MSG.cleaned(path))
	}
	return fs.rmdir(path, { recursive: true }, ifFail)
}

/**
 * Executing
 */
const main = async (flags) => {
	const langMap = await Scanner.scan(SRC)
	const path = { src: SRC, dest: DEST }
	const jobs = await exportAll(path, langMap)

	if (flags[0] == '-c') clean(SRC)

	return jobs
}

main(process.argv.slice(2))
	.then(results => results.forEach(result => console.log(result.value)))
	.catch(console.error)
