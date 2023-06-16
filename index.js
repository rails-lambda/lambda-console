import Session from "./src/session.js";
const session = new Session();

async function main() {
  session.welcome();
  await session.askForRegion();
  await session.askForProfile();
  await session.identity();
  await session.askForFunctionName();
  await session.askForMode();
  await session.run();
}

await main();
