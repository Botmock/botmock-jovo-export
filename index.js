(await import("dotenv")).config();
import * as utils from "@botmock-api/utils";
import chalk from "chalk";
import fs from "fs";
import path from "path";
// import assert from "assert";
import { promisify } from "util";
import { exec as exec_ } from "child_process";
import { OUTPUT_PATH, MODELS_PATH, SRC_PATH } from "./constants";
import SDKWrapper from "./lib/SDKWrapper";

// look for existence of environment variables
try {
  await utils.checkEnvVars();
} catch (_) {
  console.error("too few variables in .env");
  process.exit(1);
}

// attempt to read from needed directories
try {
  await fs.promises.access(OUTPUT_PATH, fs.constants.R_OK);
  await fs.promises.access(MODELS_PATH, fs.constants.R_OK);
  await fs.promises.access(SRC_PATH, fs.constants.R_OK);
} catch (_) {
  // create directories if inexistant
  fs.mkdirSync(OUTPUT_PATH);
  fs.mkdirSync(MODELS_PATH);
  fs.mkdirSync(SRC_PATH);
}

// copy files from /templates into /output, with project data filled in
try {
  const templatesPath = path.join(process.cwd(), "templates");
  const sdk = new SDKWrapper();
  const { name, messages, intents } = await sdk.init();
  // given the path to the templates, search directories for files to copy
  await (async function copyInnerFiles(filepath) {
    for (const content of fs.readdirSync(filepath)) {
      const pathto = path.join(filepath, content);
      if (fs.statSync(pathto).isDirectory()) {
        // recurse if this is a directory
        copyInnerFiles(pathto);
      } else {
        switch (path.basename(pathto)) {
          case "package.json":
          case "project.js":
            // the file does not need to have values filled in and can just be
            // copied into /output
            fs.copyFileSync(
              pathto,
              path.resolve(OUTPUT_PATH, path.basename(pathto))
            );
            break;
          case "en-US.json":
            const dest = path.resolve(
              OUTPUT_PATH,
              pathto
                .split(path.sep)
                .slice(-2)
                .join(path.sep)
            );
            const file = fs.readFileSync(pathto, "utf8");
            const data = JSON.parse(file);
            // fill in project-data-dependent fields
            data.invocation = name.toLowerCase();
            data.intents = getIntents(intents);
            fs.writeFileSync(dest, JSON.stringify(data, null, 4));
            break;
          default:
            // copy contents of /src
            fs.copyFileSync(
              pathto,
              path.resolve(SRC_PATH, path.basename(pathto))
            );
        }
      }
    }
  })(templatesPath);
  console.log("installing dependencies");
  // cd into /output
  process.chdir("./output");
  const exec = promisify(exec_);
  await exec("npm i");
  await exec("jovo build");
  process.chdir("../");
  console.log(chalk.bold("done"));
} catch (err) {
  console.error(err);
  process.exit(1);
}

// map to collection containing name and phrases keys
function getIntents(intents) {
  return intents.map(i => ({
    name: i.name,
    phrases: i.utterances.map(utterance => {
      const regex = /%([^\s]+)/g;
      const { text } = utterance;
      const match = regex.exec(text);
      if (match) {
        // Replace %input with {{input}}
        return text.replace(match[0], `{${match[1]}}`);
      }
      return text;
    }),
    // TODO: see https://github.com/jovotech/jovo-templates/blob/master/01_helloworld/javascript/models/en-US.json#L20
    inputs: []
  }));
}
