import inquirer from "inquirer";
import inquirerPrompt from "inquirer-autocomplete-prompt";
inquirer.registerPrompt("autocomplete", inquirerPrompt);
import { createSpinner } from "nanospinner";
import { AccountClient, paginateListRegions } from "@aws-sdk/client-account";

class Regions {
  static DEFAULTS = ["us-east-1", "us-east-2", "us-west-1", "us-west-2"];

  constructor() {
    this.default = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
    this.spinner = createSpinner("Loading Regions...");
  }

  async askFor() {
    const source = await this.source();
    const { region } = await inquirer.prompt([
      {
        type: "autocomplete",
        name: "region",
        message: "Select your AWS Region:",
        source: function (_, input) {
          input = input || "";
          return new Promise((resolve) => {
            const results = source.filter((option) =>
              option.toLowerCase().includes(input.toLowerCase())
            );
            resolve(results);
          });
        },
        default: this.default,
      },
    ]);
    return region;
  }

  async source() {
    this.spinner.start();
    const names = await this.liveRegionNames();
    const namesWoDefault = names.filter((region) => region !== this.default);
    this.spinner.success({ text: "Loaded Regions" });
    return [this.default, ...namesWoDefault];
  }

  async liveRegionNames() {
    const client = new AccountClient({ region: this.default || "us-east-1" });
    try {
      const regionNames = [];
      for await (const page of paginateListRegions({ client }, {})) {
        for (const region of page.Regions) {
          regionNames.push(region.RegionName);
        }
      }
      return regionNames;
    } catch (error) {
      return Regions.DEFAULTS;
    }
  }
}

export default Regions;
