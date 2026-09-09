#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const MessageDecorator = require('./lib/MessageDecorator');
const Bomber = require('./lib/Bomber');
const Utils = require('./lib/Utils');

// Parse command line arguments
const args = process.argv.slice(2);
const flags = {
  sms: args.includes('--sms'),
  call: args.includes('--call'),
  mail: args.includes('--mail'),
  ascii: args.includes('--ascii'),
  version: args.includes('--version') || args.includes('-v'),
  contributors: args.includes('--contributors') || args.includes('-c'),
  update: args.includes('--update') || args.includes('-u')
};

const mesgdcrt = new MessageDecorator('icon');
const version = Utils.getVersion();
const contributors = ['SpeedX', 't0xic0der', 'scpketer', 'Stefan', 'shakil1095 (NodeJS Port)'];

// Load country codes
let countryCodes = {};
try {
  const isdcodesPath = path.join(__dirname, 'isdcodes.json');
  const isdcodes = JSON.parse(fs.readFileSync(isdcodesPath, 'utf8'));
  countryCodes = isdcodes.isdcodes;
} catch (err) {
  mesgdcrt.FailureMessage('Failed to load country codes');
  process.exit(1);
}

// Handle command line arguments
if (flags.version) {
  console.log(`Version: ${version}`);
  process.exit(0);
} else if (flags.contributors) {
  console.log(`Contributors: ${contributors.join(', ')}`);
  process.exit(0);
} else if (flags.update) {
  mesgdcrt.SectionMessage('Checking for updates...');
  mesgdcrt.GeneralMessage('Currently on latest version');
  process.exit(0);
} else if (flags.sms) {
  runBomber('sms', countryCodes);
} else if (flags.call) {
  runBomber('call', countryCodes);
} else if (flags.mail) {
  runBomber('mail', countryCodes);
} else {
  runInteractive(countryCodes);
}

async function runBomber(mode, countryCodes) {
  const bomber = new Bomber(mesgdcrt);
  await bomber.selectNode(mode, countryCodes);
}

async function runInteractive(countryCodes) {
  const prompt = require('prompt-sync')();
  
  Utils.printBanner(version, contributors, mesgdcrt, flags.ascii);
  console.log('Available Options:\n');
  console.log('[1] SMS Bomb');
  console.log('[2] Call Bomb');
  console.log('[3] Mail Bomb');
  console.log('[4] Exit');
  console.log();
  
  const choice = prompt(mesgdcrt.CommandMessage('Enter your choice: '));
  
  const choices = {
    '1': 'sms',
    '2': 'call',
    '3': 'mail',
    '4': 'exit'
  };
  
  const selected = choices[choice];
  
  if (selected === 'exit') {
    mesgdcrt.GeneralMessage('Goodbye!');
    process.exit(0);
  } else if (selected) {
    await runBomber(selected, countryCodes);
  } else {
    mesgdcrt.FailureMessage('Invalid choice!');
    process.exit(1);
  }
}
