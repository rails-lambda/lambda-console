import select from "@inquirer/select";

import ModeRunner from "./mode-runner.js";
import ModeInteract from "./mode-interact.js";

class Mode {
  constructor(lambda) {
    this.lambda = lambda;
    this.mode = undefined;
  }

  async askForMode() {
    const selectedMode = await select({
      message: "Select Interaction Mode:",
      choices: [
        {
          name: "CLI Runner",
          value: "run",
          description:
            "Run CLI commands from your function's task root. Ex: cat /etc/os-release",
        },
        {
          name: "Interactive Commands",
          value: "interact",
          description:
            "Send IRB-style commands to your application. Ex: User.count",
        },
      ],
    });
    this.mode = selectedMode;
  }

  get name() {
    return this.mode;
  }

  get runner() {
    if (!this._runner) {
      switch (this.mode) {
        case "run": {
          this._runner = new ModeRunner(this.lambda);
          break;
        }
        case "interact": {
          this._runner = new ModeInteract(this.lambda);
          break;
        }
      }
    }
    return this._runner;
  }
}

export default Mode;
