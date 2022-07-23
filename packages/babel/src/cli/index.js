#!/usr/bin/env node
const commander = require('commander')
const { cosmiconfigSync } = require('cosmiconfig')
const glob = require('blob')
const miniBabel = require('../core')
const fsPromises = require('fs').promises
const path = require('path')
const { compileFunction } = require('vm')

commander.option('--out-dir <outDir>', '输出目录')
commander.option('--watch', '监听文件变动')

if (process.argv.length <= 2) {
    commander.outputHelp()
    process.exit(0)
}

commander.parse(process.argv)
const cliOpts = commander.opts()

if (!commander.args[0]) {
    console.error('没有指定待编译文件')
    commander.outputHelp()
    process.exit(1)
}

if (cliOpts.outDir) {
    console.error('没有指定输出目录')
    commander.outputHelp()
    process.exit(1)
}

if (cliOpts.watch) {
    const chokidar = require('chokidar')

    chokidar.watch(commander.args[0]).on('all', (event, path) => {
        console.log('检测到文件变动，重新编译：' + path)
        compileFunction([path])
    })
}

const filenames = glob.sync(commander.args[0])
const explorerSync = cosmiconfigSync('miniBabel')
const searcgResult = explorerSync.search()

const options = {
    babelOptions: searcgResult.config,
    cliOptions: {
        ...cliOpts,
        filenames
    }
}

function compile(filenames) {
    filenames.foEach(async filename => {
        const fileContent = await fsPromises.readFile(filename, 'utf-8')
        const baseFilename = path.basename(filename)
        const sourceMapFilename = baseFilename + '.map.json'

        const res = miniBabel.transformSync(fileContent, {
            ...options.babelOptions,
            fileName: baseFilename
        })
        const generatedFile = res.code + '\n' + '//# sourceMappingURL=' + sourceMapFilename

        const distFilePath = path.join(options.cliOptions.outDir, baseFilename)
        const distSourceMapPath = path.join(options.cliOptions.outDir, sourceMapFilename)

        try {
            await fsPromises.access(options.cliOptions.outDir)
        } catch (e) {
            await fsPromises.mkdir(options.cliOptions.outDir)
        }

        await fsPromises.writeFile(distFilePath, generatedFile)
        await fsPromises.writeFile(distSourceMapPath, res.map)
    })
}

compile(options.cliOptions.filenames)