(await import("dotenv")).config();
import * as utils from "@botmock-api/utils";
import { remove } from "fs-extra";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { exec as exec_ } from "child_process";
import { OUTPUT_PATH, MODELS_PATH, SRC_PATH } from "./constants";
import SDKWrapper from "./lib/SDKWrapper";

try {
  await remove(OUTPUT_PATH);
  fs.mkdirSync(OUTPUT_PATH);
  fs.mkdirSync(MODELS_PATH);
  fs.mkdirSync(SRC_PATH);
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
  console.info("installing dependencies.");
  process.chdir("./output");
  const exec = promisify(exec_);
  await exec("npm i");
  console.info("building project.");
  await exec("jovo build");
  process.chdir("../");
  console.info("done.");
} catch (err) {
  console.error(err);
  process.exit(1);
}

function getIntents(intents) {
  return intents.map(intent => {
    return {
      name: intent.name,
      phrases: intent.utterances.map(utterance => {
        return utils.symmetricWrap(utterance.text, { l: "{", r: "}" });
      }),
      inputs: Object.entries(intent.utterances.reduce((acc, utterance) => {
        return {
          ...acc,
          ...utterance.variables.reduce((accu, variable) => {
            return {
              ...accu,
              [variable.name.replace(/%/g, "")]: {
                type: {
                  alexa: `AMAZON.${variable.entity.toUpperCase()}`,
                  dialogflow: `@sys.any`
                }
              }
            };
          }, {})
        }
      }, [])).map(pair => {
        const [name, { type }] = pair;
        return {
          name,
          type
        }
      })
    }
  });
}
