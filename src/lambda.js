import inquirer from "inquirer";
import inquirerPrompt from "inquirer-autocomplete-prompt";
inquirer.registerPrompt("autocomplete", inquirerPrompt);
import { createSpinner } from "nanospinner";

import {
  LambdaClient,
  paginateListFunctions,
  InvokeCommand,
} from "@aws-sdk/client-lambda";

class Lambda {
  constructor(session) {
    this.session = session;
    this.spinner = createSpinner("Loading Lambda Function Names...");
    this.functionName = this.session.opts.functionName;
  }

  async askForFunctionName() {
    if (this.functionName) {
      return;
    }
    const source = await this.functionNames();
    const { functionName } = await inquirer.prompt([
      {
        type: "autocomplete",
        name: "functionName",
        message: "Select Lambda Function Name:",
        source: function (_, input) {
          input = input || "";
          return new Promise((resolve) => {
            const results = source.filter((option) =>
              option.toLowerCase().includes(input.toLowerCase())
            );
            resolve(results);
          });
        },
      },
    ]);
    this.functionName = functionName;
  }

  async functionNames() {
    this.spinner.start();
    const client = this.client;
    const functionNames = [];
    for await (const page of paginateListFunctions({ client }, {})) {
      for (const func of page.Functions) {
        functionNames.push(func.FunctionName);
      }
    }
    this.spinner.success({ text: "Loaded Lambda Function Names" });
    return functionNames;
  }

  get client() {
    if (!this._client) {
      this._client = new LambdaClient({ region: this.session.region });
    }
    return this._client;
  }

  get invokeSpinner() {
    if (!this._invokeSpinner) {
      this._invokeSpinner = createSpinner("Sending Event...");
    }
    return this._invokeSpinner;
  }

  async invoke(payload) {
    const command = new InvokeCommand({
      FunctionName: this.functionName,
      Payload: JSON.stringify(payload),
    });
    this.invokeSpinner.start();
    const { Payload } = await this.client.send(command);
    this.invokeSpinner.success({ text: "Response:" });
    return JSON.parse(Buffer.from(Payload).toString());
  }
}

export default Lambda;
