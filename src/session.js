import Program from "./program.js";
import Welcome from "./welcome.js";
import Regions from "./regions.js";
import Profiles from "./profiles.js";
import Identity from "./identity.js";
import Lambda from "./lambda.js";
import Mode from "./mode.js";

class Session {
  constructor() {
    this.program = Program.commander;
    this.program.parse();
    this.opts = this.program.opts();
    this.region = this.opts.region;
    this.profile = this.opts.profile;
    this.lambda = undefined;
    this.mode = undefined;
  }

  welcome() {
    const welcome = new Welcome(this);
    welcome.showMessage();
  }

  async askForRegion() {
    if (!this.region) {
      const regions = new Regions();
      const region = await regions.askFor();
      this.region = region;
    }
  }

  async askForProfile() {
    if (!this.profile) {
      const profiles = new Profiles();
      this.profile = await profiles.askFor();
    }
    process.env.AWS_PROFILE = this.profile;
  }

  async identity() {
    const identity = new Identity(this);
    await identity.showCaller();
  }

  async askForFunctionName() {
    this.lambda = new Lambda(this);
    await this.lambda.askForFunctionName();
  }

  async askForMode() {
    this.mode = new Mode(this.lambda);
    await this.mode.askForMode();
  }

  async run() {
    await this.mode.runner.invoke();
  }
}

export default Session;
