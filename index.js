(await import('dotenv')).config();
import * as utils from '@botmock-api/utils';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import SDKWrapper from './lib/SDKWrapper';
import { OUTPUT_PATH, MODELS_PATH, SRC_PATH } from './constants';

// look for existence of environment variables
try {
  await utils.checkEnvVars();
} catch (_) {
  console.error('too few variables in .env');
  process.exit(1);
}

// attempt to read from needed directories
try {
  await fs.promises.access(OUTPUT_PATH, fs.constants.R_OK);
  await fs.promises.access(MODELS_PATH, fs.constants.R_OK);
  // await fs.promises.access(SRC_PATH, fs.constants.R_OK);
} catch (_) {
  // create directories if inexistant
  fs.mkdirSync(OUTPUT_PATH);
  fs.mkdirSync(MODELS_PATH);
  // fs.mkdirSync(SRC_PATH);
}

// copy files from /templates into /output, with project data filled in
try {
  const templatesPath = path.join(process.cwd(), 'templates');
  const project = await new SDKWrapper().init();
  // given the path to the templates, search directories for files to copy
  await (async function copyInnerFiles(filepath) {
    for await (const content of fs.readdirSync(filepath)) {
      const pathto = path.join(filepath, content);
      if (fs.statSync(pathto).isDirectory()) {
        // recurse if this is a directory
        copyInnerFiles(pathto);
      } else {
        const dest = path.resolve(OUTPUT_PATH, path.basename(pathto));
        // the file does not need to have values filled in and can just be copied
        fs.promises.copyFile(pathto, dest);
      }
    }
  })(templatesPath);
  console.log(chalk.bold('done'));
} catch (err) {
  console.error(err);
  process.exit(1);
}
