const axios = require('axios');
const PQueue = require('pqueue').default;

class APIProvider {
  constructor(cc, target, mode, delay = 0) {
    this.cc = cc;
    this.target = target;
    this.mode = mode.toLowerCase();
    this.delay = delay;
    this.index = 0;
    this.apiProviders = [];
    this.apiVersion = '2.1.0';
    this.lockAcquired = false;
    this.status = true;
    
    // Load API configurations
    try {
      const apidata = require('../apidata.json');
      this.loadProviders(apidata);
    } catch (err) {
      console.warn('⚠️  Could not load local apidata.json, using remote version...');
      this.loadRemoteProviders();
    }
  }

  loadProviders(providers) {
    const modeProviders = providers[this.mode] || {};
    this.apiProviders = modeProviders[this.cc] || [];
    
    // Add multi-country providers if not enough
    if (this.apiProviders.length < 10 && modeProviders.multi) {
      this.apiProviders = [...this.apiProviders, ...modeProviders.multi];
    }
  }

  async loadRemoteProviders() {
    try {
      const response = await axios.get(
        'https://github.com/TheSpeedX/TBomb/raw/master/apidata.json',
        { timeout: 10000 }
      );
      this.loadProviders(response.data);
    } catch (err) {
      console.error('❌ Failed to load API providers:', err.message);
      this.apiProviders = [];
    }
  }

  formatConfig(config) {
    const configStr = JSON.stringify(config);
    const formatted = configStr
      .replace(/{target}/g, this.target)
      .replace(/{cc}/g, this.cc);
    return JSON.parse(formatted);
  }

  selectApi() {
    if (this.apiProviders.length === 0) {
      return null;
    }

    this.index++;
    if (this.index >= this.apiProviders.length) {
      this.index = 0;
    }

    let config = this.apiProviders[this.index];
    
    // Add default headers
    const defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:72.0) Gecko/20100101 Firefox/72.0'
    };
    
    config = {
      ...config,
      headers: { ...defaultHeaders, ...(config.headers || {}) }
    };
    
    return this.formatConfig(config);
  }

  removeApi() {
    try {
      this.apiProviders.splice(this.index, 1);
      return true;
    } catch (err) {
      return false;
    }
  }

  async request() {
    const config = this.selectApi();
    if (!config) {
      return null;
    }

    try {
      const identifier = (config.identifier || '').toLowerCase();
      delete config.identifier;
      delete config.name;
      
      const response = await axios.request({
        ...config,
        timeout: 30000
      });
      
      return identifier && response.data ? 
        response.data.toString().toLowerCase().includes(identifier) : 
        false;
    } catch (err) {
      return false;
    }
  }

  async hit() {
    try {
      if (!this.status) return false;
      
      // Add delay
      if (this.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, this.delay * 1000));
      }

      const response = await this.request();
      
      if (response === false) {
        this.removeApi();
      } else if (response === null) {
        this.status = false;
      }
      
      return response;
    } catch (err) {
      return false;
    }
  }

  getApiVersion() {
    return this.apiVersion;
  }

  getAvailableProviders() {
    return this.apiProviders.length;
  }
}

module.exports = APIProvider;