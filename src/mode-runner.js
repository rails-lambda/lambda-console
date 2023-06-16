import chalk from "chalk";
import { input } from "@inquirer/prompts";
import select from "@inquirer/select";

class ModeRunner {
  constructor(lambda) {
    this.lambda = lambda;
  }

  async invoke() {
    await this.askForDisplayMode();
    let command = "";
    while (true) {
      command = await input({
        message: ">",
        validate: function (value) {
          if (value.length >= 1) {
            return true;
          } else {
            return "Please enter at least one character.";
          }
        },
      });
      if (command === "exit") {
        break;
        process.exit(0);
      }
      const event = this.event(command);
      const { body, statusCode } = await this.lambda.invoke(event);
      if (this.displayMode === "ascii") {
        this.boxedResult(body, statusCode);
      } else {
        console.log(body);
      }
    }
  }

  event(command) {
    return { X_LAMBDA_CONSOLE: { run: command } };
  }

  async askForDisplayMode() {
    this.displayMode = await select({
      message: "Select Display Mode:",
      choices: [
        { name: "ASCII", value: "ascii" },
        { name: "Plain", value: "plain" },
      ],
    });
  }

  boxedResult(result, statusCode) {
    const chalkBg = statusCode === 1 ? chalk.bgRedBright : chalk.bgBlueBright;
    const resultCleaned = result.replace(/[\u0000-\u001F]+$/g, "");
    const resultIndented = resultCleaned.replace(/^/gm, "| ");
    const resultPadded = resultIndented.replace(/(?<=\| ).*$/gm, (match) => {
      const numSpaces = Math.max(
        0,
        process.stdout.columns - (match.length || 0) - 3
      );
      return match + " ".repeat(numSpaces) + "|";
    });
    const middleLine = "─".repeat(Math.max(0, process.stdout.columns - 2));
    console.log(chalkBg(`╭${middleLine}╮`));
    console.log(chalkBg(resultPadded));
    console.log(chalkBg(`╰${middleLine}╯`));
  }
}

export default ModeRunner;
