// Script to compile and generate types from the Minecraft bedrock json schemas.
// This was done in 6 minutes and should not be taken like
// production code lol

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const dirList = ['behavior', 'resource'];

const getAllFiles = (
  dirPath: string,
  arrayOfFiles: string[] = []
): string[] => {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else if (filePath.endsWith('.json')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
};

const destPath = path.resolve('./src/types/generated');

for (const dir of dirList) {
  const files = getAllFiles(path.join('./Minecraft-bedrock-json-schemas', dir));

  files.forEach((file) => {
    let destDir = path.join(destPath, dir);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    destDir = path.resolve(destDir);

    // Get the file name
    const fileName = file.split(path.sep).pop();

    if (!fileName) {
      throw new Error('File name is undefined');
    }

    exec(
      `json2ts ./${file} > ${path.join(destDir, fileName.replace('.json', '.d.ts'))}`,
      (err, stdout, stderr) => {
        if (err) {
          console.error(err);
        }
        if (stdout) {
          console.log(stdout);
        }
        if (stderr) {
          console.error(stderr);
        }
      }
    );
  });
}
