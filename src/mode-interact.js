import chalk from "chalk";
import { input } from "@inquirer/prompts";

class ModeInteract {
  constructor(lambda) {
    this.lambda = lambda;
  }

  async invoke() {
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
      if (statusCode === 200) {
        console.log(body);
      } else {
        console.log(chalk.red(body));
      }
    }
  }

  event(command) {
    return { X_LAMBDA_CONSOLE: { interact: command } };
  }
}

export default ModeInteract;
