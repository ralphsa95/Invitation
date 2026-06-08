const fs = require('fs');
const path = require('path');

function readJson(file) {
    const filePath = path.join(__dirname, '../../data', file);
    if (!fs.existsSync(filePath)) return file === 'guests.json' ? [] : {};
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}

function writeJson(file, jsonData) {
    const filePath = path.join(__dirname, '../../data', file);
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
}

module.exports = { readJson, writeJson };