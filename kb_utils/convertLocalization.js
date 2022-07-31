
const Parser = require('./Parser.js');
const fs = require('fs');
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;
const getBaseName = require('path').basename;

let localizationPath = '../kb/localization';

let parser = new Parser();

fs.readdirSync(localizationPath).forEach(fileName => {
    let lngPath = `${localizationPath}/${fileName}`;
    let convertedPath = `${localizationPath}/converted/${getBaseName(fileName, '.lng')}.json`;

    if (!fs.statSync(lngPath).isFile()) {
        return;
    }

    convertLng(lngPath, convertedPath);
});

async function convertLng(path, convertedPath) {
    let text = fs.readFileSync(path, 'utf16le');
    let lng = parser.parseConfig(text);

    cleanUpLng(lng);

    let content = JSON.stringify(lng, null, '  ');

    await mkdirp(getDirName(convertedPath));
    fs.writeFileSync(convertedPath, content);
}

function cleanUpLng(lng) {
    for (let [key, value] of Object.entries(lng)) {
        if (Array.isArray(value)) {
            value.forEach(cleanUpLng);
        } else if (typeof value === 'object') {
            cleanUpLng(value)
        } else if (typeof value === 'string') {
            lng[key] = value = cleanUpValue(value);

            if (value === '[Good]' || value === '[Bad]') {
                let nameKey = key.slice(0, -5) + '_name';

                lng[key] = lng[nameKey];
                delete lng[nameKey];
            }
        }
    }
}

function cleanUpValue(value) {
    return value.replace(/\^\w+\^/g, '');
}