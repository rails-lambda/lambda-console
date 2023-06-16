import chalk from "chalk";
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const check = chalk.green("✔");
const fail = chalk.red("✖");

class Identity {
  constructor(session) {
    this.session = session;
  }

  async showCaller() {
    await sleep(200);
    const { data, error } = await this.identityData();
    if (data && Object.keys(data).length > 0) {
      console.log(`${check} ${chalk.bold("Using AWS Identity:")}`);
      const json = JSON.stringify(data, null, 2);
      console.log(chalk.dim(json));
    } else {
      console.log(`${fail} ${chalk.bold("Error getting AWS Identity:")}`);
      console.log(chalk.red(error));
      process.exit(1);
    }
  }

  async identityData() {
    let data, error;
    try {
      data = {};
      const client = new STSClient({ region: this.session.region });
      const identity = await client.send(new GetCallerIdentityCommand({}));
      data.UserId = identity.UserId;
      data.Account = identity.Account;
      data.Arn = identity.Arn;
    } catch (e) {
      error = e;
    }
    return { data, error };
  }
}

export default Identity;
