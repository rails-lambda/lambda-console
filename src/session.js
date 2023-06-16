const Program = require("./program.js");
const Welcome = require("./welcome.js");
const Regions = require("./regions.js");
const Profiles = require("./profiles.js");
const Identity = require("./identity.js");
const Lambda = require("./lambda.js");
const Mode = require("./mode.js");

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

module.exports = Session;
