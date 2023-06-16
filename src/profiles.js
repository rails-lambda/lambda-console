import inquirer from "inquirer";
import inquirerPrompt from "inquirer-autocomplete-prompt";
inquirer.registerPrompt("autocomplete", inquirerPrompt);

import { loadSharedConfigFiles } from "@aws-sdk/shared-ini-file-loader";

class Profiles {
  async askFor() {
    const source = await this.source();
    const { profile } = await inquirer.prompt([
      {
        type: "autocomplete",
        name: "profile",
        message: "Select your AWS Profile:",
        source: function (_, input) {
          input = input || "";
          return new Promise((resolve) => {
            const results = source.filter((option) =>
              option.toLowerCase().includes(input.toLowerCase())
            );
            resolve(results);
          });
        },
        default: "default",
      },
    ]);
    return profile;
  }

  async source() {
    const profiles = await loadSharedConfigFiles();
    return Object.keys(profiles.configFile);
  }
}

export default Profiles;
