#!/usr/bin/env bun

import { confirm, input, select } from '@inquirer/prompts';
import chalk from 'chalk';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { createEntryPoint } from './templates';
import { createConfig } from './templates/config';

const log = console.log;

const getVersion = () => {
  const packagePath = path.join(__dirname, '..', '..', 'package.json');
  if (fs.existsSync(packagePath)) {
    const manifest = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    return manifest.version;
  }
  return 'Unknown version';
};

log(chalk.bold.blue('Welcome to the ModExpedite Add-On creation wizard!'));
log(chalk.bold.redBright('Version: ', getVersion()), '\n');

const action = await select({
  message: 'What do you wanna do?',
  choices: [
    { value: 'create', name: 'Create a new Add-On' },
    { value: 'cancel', name: 'Cancel' },
  ],
});

if (action === 'cancel') {
  log(chalk.bold.red('Bye!'));
  process.exit();
}

const invalidCharacters = [
  ' ',
  '-',
  '.',
  '/',
  '\\',
  ':',
  '*',
  '?',
  '"',
  '<',
  '>',
  '|',
];

const author = await input({
  message: "Write your studio name (Use your username if you don't have one)",
  validate(value) {
    if (!value) {
      return 'Please enter a valid company name';
    }
    for (const char of invalidCharacters) {
      if (value.includes(char)) {
        return `Company name should not contain "${char}"`;
      }
    }

    if (value !== value.toLowerCase()) {
      return 'Company name should be in lowercase';
    }

    return true;
  },
});

const namespace = await input({
  message: 'Enter the namespace for this project',
  validate(value) {
    if (!value) {
      return 'Please enter a valid namespace name';
    }
    for (const char of invalidCharacters) {
      if (value.includes(char)) {
        return `Namespace should not contain "${char}"`;
      }
    }

    if (value !== value.toLowerCase()) {
      return 'Namespace should be in lowercase';
    }

    return true;
  },
});

const platform = process.platform;

let bpPath = '';
let rpPath = '';

const askForPaths = async () => {
  bpPath = await input({
    message: 'Enter the path to the behavior_packs folder',
    validate(value) {
      if (!value) {
        return 'Please enter a valid path';
      }
      return true;
    },
  });

  rpPath = await input({
    message: 'Enter the path to the resource_packs folder',
    validate(value) {
      if (!value) {
        return 'Please enter a valid path';
      }
      return true;
    },
  });
};

if (platform !== 'win32') {
  log(
    chalk.bold.whiteBright(
      "We noticed that you are not using Windows, therefore we can't locate the com.mojang folder. \n Please provide a path to save the generated Behavior and Resource packs"
    )
  );
  await askForPaths();
} else {
  const localappdata = process.env.LOCALAPPDATA;
  if (!localappdata) {
    log(
      chalk.bold.red(
        'Could not locate the com.mojang folder. Please provide a path to save the generated Behavior and Resource packs. Error: LOCALAPPDATA not found'
      )
    );
    await askForPaths();
  } else {
    const comDotMojangFolder = path.join(
      localappdata,
      'Packages',
      'Microsoft.MinecraftUWP_8wekyb3d8bbwe',
      'LocalState',
      'games',
      'com.mojang'
    );
    if (!fs.existsSync(comDotMojangFolder)) {
      log(
        chalk.bold.red(
          'Could not locate the com.mojang folder. Please provide a path to save the generated Behavior and Resource packs. Error: com.mojang folder not found'
        )
      );
      await askForPaths();
    } else {
      bpPath = `\${process.env.LOCALAPPDATA}/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_behavior_packs/${namespace}`;
      rpPath = `\${process.env.LOCALAPPDATA}/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/${namespace}`;
    }
  }
}

log(chalk.bold.green('Behavior Pack Path:'), bpPath);
log(chalk.bold.green('Resource Pack Path:'), rpPath);

if (
  !(await confirm({
    message: 'Do you want to proceed with the provided paths?',
  }))
) {
  await askForPaths();
}

log(chalk.bold.green('Creating your project...'));

const projectPath = process.cwd();

const folderName = `Addon ${namespace}`;

fs.mkdirSync(path.join(projectPath, folderName), { recursive: true });

const newCwd = path.join(projectPath, folderName);

exec('bun init -y', { cwd: newCwd }, (error, stdout, stderr) => {
  exec('bun i modexpedite', { cwd: newCwd }, (error, stdout, stderr) => {
    fs.writeFileSync(
      path.join(newCwd, 'modexpedite.config.ts'),
      createConfig({
        bpPath,
        rpPath,
        author: author,
        namespacePrefix: namespace,
      })
    );

    fs.writeFileSync(path.join(newCwd, 'index.ts'), createEntryPoint());

    fs.readFile(path.join(newCwd, 'package.json'), 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      }

      const jsonData = JSON.parse(data);

      jsonData.scripts = {
        start: 'bun run --watch index.ts',
      };

      fs.writeFile(
        path.join(newCwd, 'package.json'),
        JSON.stringify(jsonData, null, 2),
        'utf8',
        (err) => {
          if (err) {
            return console.log(err);
          }

          log(chalk.bold.green('Project created successfully!'));
          log(
            chalk.bold.green(
              'To start the compiler, run "bun start" inside the created folder.'
            )
          );

          confirm({
            message: 'Do you want to open the project with VSCode?',
          }).then((answer) => {
            if (answer === true) {
              exec('code .', { cwd: newCwd });
            }
          });
        }
      );
    });
  });
});
