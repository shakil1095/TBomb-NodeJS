const axios = require('axios');
const fs = require('fs');
const path = require('path');

const Utils = {
  // Clear console
  clearScreen() {
    console.clear();
  },

  // Format phone number (extract only digits)
  formatPhone(num) {
    return num.replace(/\D/g, '').trim();
  },

  // Validate email
  isValidEmail(email) {
    const regex = /^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$/i;
    return regex.test(email);
  },

  // Check internet connection
  async checkInternetConnection() {
    try {
      const response = await axios.get('https://motherfuckingwebsite.com', {
        timeout: 5000
      });
      return response.status === 200;
    } catch (err) {
      return false;
    }
  },

  // Get version
  getVersion() {
    try {
      const packageJson = require('../package.json');
      return packageJson.version;
    } catch (err) {
      return '2.1.0';
    }
  },

  // Sleep/delay
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Pretty print bombing stats
  prettyPrint(cc, target, success, failed, mesgdcrt) {
    const requested = success + failed;
    mesgdcrt.SectionMessage('Bombing is in progress - Please be patient');
    mesgdcrt.GeneralMessage('Please stay connected to the internet during bombing');
    mesgdcrt.GeneralMessage(`Target       : +${cc} ${target}`);
    mesgdcrt.GeneralMessage(`Sent         : ${requested}`);
    mesgdcrt.GeneralMessage(`Successful   : ${success}`);
    mesgdcrt.GeneralMessage(`Failed       : ${failed}`);
    mesgdcrt.WarningMessage('This tool was made for fun and research purposes only');
    mesgdcrt.SuccessMessage('TBomb was created by SpeedX (Ported to Node.js)');
  },

  // Print banner
  printBanner(version, contributors, mesgdcrt, asciiMode = false) {
    Utils.clearScreen();
    
    const colors = [31, 32, 33, 34, 35, 36, 37];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    if (!asciiMode) {
      const logo = `
   ████████ █████                 ██
   ▒▒▒██▒▒▒ ██▒▒██                ██
      ██    ██  ██        ██   ██ ██
      ██    █████▒  ████  ███ ███ █████
      ██    ██▒▒██ ██  ██ ██▒█▒██ ██▒▒██
      ██    ██  ██ ██  ██ ██ ▒ ██ ██  ██
      ██    █████▒ ▒████▒ ██   ██ █████▒
      ▒▒    ▒▒▒▒▒   ▒▒▒▒  ▒▒   ▒▒ ▒▒▒▒▒
      `;
      console.log(`\x1b[${randomColor}m${logo}\x1b[0m`);
    }
    
    mesgdcrt.SuccessMessage(`Version: ${version}`);
    mesgdcrt.SectionMessage(`Contributors: ${contributors.join(', ')}`);
    console.log();
  }
};

module.exports = Utils;