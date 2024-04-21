const fs = require('fs');
const readline = require('readline');

function cacheContents(callLogs) {
    const mainMemory = {};
    const cache = new Set();

    callLogs.forEach(([timestamp, itemId]) => {
        if (!mainMemory[itemId]) {
            mainMemory[itemId] = { priority: 0, lastAccessTime: timestamp, accessCount: 0 };
        }

        const timeDiff = timestamp - mainMemory[itemId].lastAccessTime;
        mainMemory[itemId].priority = Math.max(0, mainMemory[itemId].priority - timeDiff);

        mainMemory[itemId].priority += 2 * mainMemory[itemId].accessCount + 2;
        mainMemory[itemId].lastAccessTime = timestamp;
        mainMemory[itemId].accessCount++;

        if (mainMemory[itemId].priority > 5) {
            cache.add(itemId);
        } else if (cache.has(itemId) && mainMemory[itemId].priority <= 3) {
            cache.delete(itemId);
        }
    });

    const sortedCacheKeys = Array.from(cache).sort((a, b) => a - b);
    return sortedCacheKeys.length === 0 ? [-1] : sortedCacheKeys;
}

function processCallLogs(callLogs, outputPath) {
    const result = cacheContents(callLogs);

    if (result[0] === -1 || result.length === 0) {
        fs.writeFileSync(outputPath, '-1\n');
    } else {
        const cleanedResult = result.slice(0, result.length - 1);
        const output = cleanedResult.join('\n');

        fs.writeFileSync(outputPath, output + '\n');
    }
}

const inputPath = process.env.INPUT_PATH || 'input000.txt';
const outputPath = process.env.OUTPUT_PATH || 'output.txt';

const rl = readline.createInterface({
    input: fs.createReadStream(inputPath),
    output: process.stdout,
    terminal: false
});

let callLogs = [];

rl.on('line', (line) => {
    const [timestamp, itemId] = line.trim().split(' ').map(Number);
    callLogs.push([timestamp, itemId]);
});

rl.on('close', () => {
    processCallLogs(callLogs, outputPath);
});
