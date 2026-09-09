# TBomb - Node.js Version

<h1 align="center">
  <br>
  <img src="https://i.ibb.co/F4HBKqm/TBomb.png" alt="TBomb">
  <br>
  TBomb v2.1.0 (Node.js Port)
  <br>
</h1>

<p align="center">A free and open-source SMS/Call bombing application (Node.js Edition)</p>

## ⚠️ Important Note

**Supported Countries for SMS:** 190+ countries worldwide
**Supported Countries for CALL:** India (91) primarily
**Supported Countries for MAIL:** Most countries

See `isdcodes.json` for the complete list of country codes.

## Features

- ✅ **Multi-threaded API calls** using Promise-based concurrency
- ✅ **190+ country support** for SMS bombing
- ✅ **Call bombing** (primarily India)
- ✅ **Mail bombing** support
- ✅ **Fast and reliable** with error handling
- ✅ **Easy to use** CLI interface
- ✅ **Cross-platform** (Linux, Windows, macOS, Termux)

## Installation

### Prerequisites
- Node.js >= 12.0.0
- npm or yarn

### Setup

```bash
git clone https://github.com/shakil1095/TBomb-NodeJS.git
cd TBomb-NodeJS
npm install
```

## Usage

### Start Interactive Mode
```bash
node bomber.js
# or
npm start
```

### Direct SMS Bombing
```bash
node bomber.js --sms
# or
npm run sms
```

### Direct Call Bombing
```bash
node bomber.js --call
# or
npm run call
```

### Direct Mail Bombing
```bash
node bomber.js --mail
# or
npm run mail
```

## Supported Country Codes

This tool supports **190+ countries**. Here are some examples:

| Country | Code |
|---------|------|
| India | 91 |
| USA | 1 |
| UK | 44 |
| Bangladesh | 880 |
| Pakistan | 92 |
| Germany | 49 |
| France | 33 |
| Japan | 81 |
| China | 86 |
| Brazil | 55 |

**See `isdcodes.json` for complete list of 190+ supported country codes.**

## Limits

- **SMS:** 500 messages per target (India: 91), 100 messages per target (Other countries)
- **CALL:** 15 calls per target (Primarily India)
- **MAIL:** 200 emails per target

## API Information

The tool uses multiple free SMS/Call APIs integrated through `apidata.json`. It automatically:
- Selects working APIs
- Handles rate limiting
- Manages thread pooling
- Retries on failure

## Disclaimer

⚠️ **Important:** This tool is for:
- ✅ Testing your spam detector
- ✅ Research purposes only
- ✅ Exposing vulnerable APIs

**DO NOT USE** for:
- ❌ Harassment or harm
- ❌ Unauthorized testing
- ❌ Illegal activities

## Notes

- Requires active internet connection
- No charges for SMS/Calls sent
- Use single thread with delay for best results
- Some APIs may be offline due to overuse
- You will NOT be charged for any messages

## Contributors

- **SpeedX** - Original Python version
- **shakil1095** - Node.js Port

## License

Other

## Troubleshooting

### "Poor internet connection detected"
- Check your internet connection
- Try pinging a website
- Disable VPN if using one

### "Target not supported"
- Ensure country code is correct
- Check `isdcodes.json` for supported countries
- Some countries may not have available APIs

### High failure rate
- Use delay between messages (recommended: 1-2 seconds)
- Use single thread instead of multiple
- Try again later (APIs might be rate-limited)

## Support

For issues and questions, please open an issue on GitHub.