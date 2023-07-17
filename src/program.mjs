import { Command } from "commander";

class Program {
  static VERSION = "1.0.8";
  static NAME = "lambda-console";
  static DESCRIPTION =
    "A CLI to run shell commands or interact with your application on Lambda.";

  static commander = new Command()
    .name(this.NAME)
    .description(this.DESCRIPTION)
    .version(this.VERSION, "-v, --version", "Output the current version")
    .option("-r, --region <string>", "AWS Region name")
    .option("-p, --profile <string>", "AWS Profile name")
    .option("-f, --function-name <string>", "AWS Lambda Function Name");
}

export default Program;
