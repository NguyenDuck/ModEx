#!/usr/bin/env bun
import { confirm, input } from '@inquirer/prompts';

const companyName = await input({
  message: "Company or studio name (Use your username if you don't have one)",
});

const projectName = await input({
  message: 'Project name',
});

const continueProcess = await confirm({
  message: `Your namespace for entities or blocks will be "${companyName}_${projectName}:". You can change this in the modexpedite.config.ts. Continue?`,
});

if (!continueProcess) {
  process.exit();
}
