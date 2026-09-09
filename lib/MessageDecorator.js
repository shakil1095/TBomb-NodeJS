const chalk = require('chalk');

class MessageDecorator {
  constructor(mode = 'icon') {
    this.mode = mode;
  }

  SuccessMessage(msg) {
    console.log(chalk.green('✓'), chalk.green(msg));
  }

  FailureMessage(msg) {
    console.log(chalk.red('✗'), chalk.red(msg));
  }

  WarningMessage(msg) {
    console.log(chalk.yellow('⚠'), chalk.yellow(msg));
  }

  SectionMessage(msg) {
    console.log(chalk.cyan('●'), chalk.cyan.bold(msg));
  }

  GeneralMessage(msg) {
    console.log(chalk.white('  ' + msg));
  }

  CommandMessage(msg) {
    return chalk.bold.blue(msg);
  }
}

module.exports = MessageDecorator;