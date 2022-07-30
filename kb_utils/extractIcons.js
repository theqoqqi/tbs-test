
const Parser = require('./Parser.js');
const IconExtractor = require('./IconExtractor.js');
const fs = require('fs');
const mkdirp = require('mkdirp');
const sharp = require('sharp');
const getDirName = require('path').dirname;

let abilityIconRegex = /ba1_(\w+)_(\w+)\.png/;

let parser = new Parser();
let configText = fs.readFileSync('../kb/textures/itextures.dat', 'utf8');
let textureConfigs = parser.parseConfig(configText);

for (const [textureName, config] of Object.entries(textureConfigs)) {
    let fileName = `../kb/textures/${textureName.toLowerCase()}.png`;
    let outputPath = `../kb/textures/extracted`;

    extractIcons(fileName, outputPath, config);
}

async function extractIcons(textureFileName, outputPath, config) {

    let blocks = config.block;

    for (const block of blocks) {
        let outputFileName = getOutputFileName(outputPath, block.filename);
        let pos = parseVector(block.in_tex_pos);
        let size = parseVector(block.in_tex_size);

        await mkdirp(getDirName(outputFileName));
        await sharp(textureFileName)
            .extract({
                left: pos.x,
                top: pos.y,
                width: size.x,
                height: size.y,
            })
            .toFile(outputFileName)

        console.log(textureFileName, outputFileName);
    }
}

function getOutputFileName(outputPath, fileName) {
    let match = abilityIconRegex.exec(fileName);

    if (match) {
        return `${outputPath}/abilities/${match[2]}/${match[1]}.png`;
    }

    return `${outputPath}/${fileName}`;
}

function parseVector(string) {
    let [x, y] = string.split(',').map(n => parseInt(n));
    return { x, y };
}