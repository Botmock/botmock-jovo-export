(await import('dotenv')).config();
import chalk from 'chalk';
import fs from 'fs';
import { join, sep, resolve, basename } from 'path';
import { OUTPUT_PATH, MODELS_PATH, SRC_PATH } from './constants';
import SDKWrapper from './lib/SDKWrapper';

const envpath = join(process.cwd(), '.env');
// Create .env if it does not exist
try {
  await fs.promises.access(envpath, fs.constants.R_OK);
} catch (_) {
  fs.writeFileSync(envpath, ``);
}

try {
  const file = fs.readFileSync(envpath, 'utf8');
  // Quit if there are too few env vars
  if (file.match(/BOTMOCK_\w+/g).length < 4) {
    throw new Error(`must define env variables in ${process.cwd()}/.env
see README.md
`);
  }
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

// Attempt to read from needed directories
try {
  await fs.promises.access(OUTPUT_PATH, fs.constants.R_OK);
  await fs.promises.access(MODELS_PATH, fs.constants.R_OK);
  await fs.promises.access(SRC_PATH, fs.constants.R_OK);
} catch (_) {
  // Create directories if inexistant
  fs.mkdirSync(OUTPUT_PATH);
  fs.mkdirSync(MODELS_PATH);
  fs.mkdirSync(SRC_PATH);
}

// Output the following directory hierarchy
// models/
//   └── en-US.json
// src/
//   |── app.js
//   |── config.js
//   └── index.js
// project.js
try {
  const templatesPath = join(process.cwd(), 'templates');
  const project = await new SDKWrapper().init();
  console.log(project);
  // templates -> output
  await (async function copyInnerFiles(filepath) {
    for await (const content of fs.readdirSync(filepath)) {
      const pathto = join(filepath, content);
      if (fs.statSync(pathto).isDirectory()) {
        // recurse if this is a directory
        copyInnerFiles(pathto);
      } else {
        // copy this template file into the output
        await fs.promises.copyFile(
          pathto,
          resolve(OUTPUT_PATH, basename(pathto))
        );
        console.log(chalk.dim(`copied file ${pathto}`));
      }
    }
  })(templatesPath);
  console.log(chalk.bold('done'));
} catch (err) {
  console.error(err.stack);
  process.exit(1);
}
