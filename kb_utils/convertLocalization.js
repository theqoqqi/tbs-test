
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
    console.log('converting', path);

    let text = fs.readFileSync(path, 'utf16le');
    let lng = parser.parseConfig(text);

    cleanUpLng(lng);

    let content = JSON.stringify(lng, null, '  ');

    await mkdirp(getDirName(convertedPath));
    fs.writeFileSync(convertedPath, content);
}

function cleanUpLng(lng) {
    let lastActualValue = '';

    for (let [key, value] of Object.entries(lng)) {
        if (Array.isArray(value)) {
            value.forEach(cleanUpLng);
        } else if (typeof value === 'object') {
            cleanUpLng(value)
        } else if (typeof value === 'string') {
            value = cleanUpValue(value);

            let valueWithoutVars = removeVars(value);

            if (valueWithoutVars.trim() === '') {
                lng[key] = lastActualValue;
                // delete lng[nameKey];
            } else {
                lng[key] = value;
                lastActualValue = value;
            }
        }
    }
}

function cleanUpValue(value) {
    return value.replace(/\^\w+\^/g, '');
}

function removeVars(value) {
    return value.replace(/\[\/?\w+%?]/g, '');
}