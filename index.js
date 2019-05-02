(await import('dotenv')).config();
import fs from 'fs';
import chalk from 'chalk';
import * as utils from '@botmock-api/utils';
import { OUTPUT_PATH, MODELS_PATH, SRC_PATH } from './constants';

// Output the following directory hierarchy
// models/
//   └── en-US.json
// src/
//   |── app.js
//   |── config.js
//   └── index.js
// project.js
try {
  await fs.promises.access(OUTPUT_PATH, fs.constants.R_OK);
  await fs.promises.access(MODELS_PATH, fs.constants.R_OK);
  await fs.promises.access(SRC_PATH, fs.constants.R_OK);
} catch (_) {
  // Create dirs if inexistant
  fs.mkdirSync(OUTPUT_PATH);
  fs.mkdirSync(MODELS_PATH);
  fs.mkdirSync(SRC_PATH);
}

try {
  await fs.promises.writeFile(`${OUTPUT_PATH}/project.js`, ``);
  console.log('done');
} catch (_) {
  // console.error(err.message);
  process.exit(1);
}
