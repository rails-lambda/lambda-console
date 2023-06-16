import chalk from "chalk";
import fs from "fs";

const BANNER = fs.readFileSync("./src/banner.txt", "utf8");

class Welcome {
  constructor(session) {
    this.session = session;
  }

  showMessage() {
    console.log(this.header);
    console.log(this.description);
  }

  get header() {
    return chalk.hex("#FFA500")(BANNER);
  }

  get description() {
    return `
    ${chalk.blue("⛅️⛅️⛅️ Welcome to the Lambda Console! ⛅️⛅️⛅️")}
    ${this.session.program.description()}
    To get started, we will need to setup your AWS client for this session.
    `;
  }
}

export default Welcome;
