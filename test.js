import fs from 'fs';
import crypto from 'crypto';
import * as vite from 'vite';

if (!global.gc) {
    console.error('Usage: node --expose-gc test.js');
    process.exit();
}

const server = await vite.createServer();

console.log('Loading progressively larger files and observing heap usage:');
console.log();
for (const sizeMB of [10, 20, 30, 40, 50, 60]) {
    // Generate file with random data to load
    const filePath = `./largefile_${sizeMB}mb.txt`
    fs.writeFileSync(filePath, crypto.randomBytes(sizeMB * 512 * 1024).toString('hex'));

    // Try to load file and observe heap memory usage
    console.log(`Loading ${sizeMB} MB file`);
    global.gc() // Force GC so heap usage is as accurate as possible
    const before = process.memoryUsage().heapUsed;
    await server.ssrLoadModule(`${filePath}?raw`);
    const after = process.memoryUsage().heapUsed;
    console.log(`Loaded ${sizeMB} MB file. Heap usage: ~${Math.round((after - before) / (1024 * 1024))} MB`);
    console.log();
}