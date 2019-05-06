(await import('dotenv')).config();
import * as utils from '@botmock-api/utils';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { OUTPUT_PATH, MODELS_PATH, SRC_PATH } from './constants';
import SDKWrapper from './lib/SDKWrapper';

try {
  await utils.checkEnvVars();
} catch (_) {
  console.error('too few variables in .env');
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

try {
  const templatesPath = path.join(process.cwd(), 'templates');
  const project = await new SDKWrapper().init();
  // Copy files from /templates into /output, with project data filled in
  await (async function copyInnerFiles(filepath) {
    for await (const content of fs.readdirSync(filepath)) {
      const pathto = path.join(filepath, content);
      if (fs.statSync(pathto).isDirectory()) {
        // recurse if this is a directory
        copyInnerFiles(pathto);
      } else {
        // copy this template file into the output directory
        fs.promises.copyFile(
          pathto,
          path.resolve(OUTPUT_PATH, path.basename(pathto))
        );
      }
    }
  })(templatesPath);
  // console.log(chalk.bold('done'));
} catch (err) {
  console.error(err);
  process.exit(1);
}
