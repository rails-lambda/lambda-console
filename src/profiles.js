const inquirer = require("inquirer");
const inquirerPrompt = require("inquirer-autocomplete-prompt");
inquirer.registerPrompt("autocomplete", inquirerPrompt);
const { loadSharedConfigFiles } = require("@aws-sdk/shared-ini-file-loader");

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

module.exports = Profiles;
