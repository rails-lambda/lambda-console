import chalk from "chalk";

const heredoc = function (fn) {
  const hd = fn.toString().match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1];
  return hd.replace("REPLACEME", "");
};

const HEADER = heredoc(function () {
  /*
REPLACEME
         ╓╔╔╗╗╖                                                        
     ╓╔╬╬╬╬╬╬╬╬╬╬╗╖                                                    
  ┌╠╬╬╬╬╬╙╙╙╠╬╬╬╬╬╬╬╣┐    ___                               _          
  ╠╬╬╬╬╬╬╦╕ └╠╬╬╬╬╬╬╬╣   (  _`\                            (_ )        
  ╠╬╬╬╬╬╬╬╩  ╙╬╬╬╬╬╬╬╣   | ( (_)   _     ___    ___    _    | |    __  
  ╠╬╬╬╬╬╬└ ╓  ╙╬╬╬╬╬╬╣   | |  _  /'_`\ /' _ `\/',__) /'_`\  | |  /'__`\
  ╠╬╬╬╬╩  ╦╬╬  └╙╠╬╬╬╣   | (_( )( (_) )| ( ) |\__, \( (_) ) | | (  ___/
  └╠╬╬╬╦╦╬╬╬╬╬╔╦╬╬╬╬╣┘   (____/'`\___/'(_) (_)(____/`\___/'(___)`\____)
     ╙╚╬╬╬╬╬╬╬╬╬╬╝╜                                                    
         ╙╚╚╝╝╜                                                         
*/
});

class Welcome {
  constructor(session) {
    this.session = session;
  }

  showMessage() {
    console.log(this.header);
    console.log(this.description);
  }

  get header() {
    return chalk.hex("#FFA500")(HEADER);
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
