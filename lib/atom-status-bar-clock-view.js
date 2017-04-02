'use babel';

import { CompositeDisposable } from 'atom';
import moment from 'moment';

export default class AtomStatusBarClockView {

  constructor(statusBar) {
    this.statusBar = statusBar;
    this.atomSubscriptions = new CompositeDisposable();
  }

  create() {
    this.setupConfiguration();
    this.createView();
    this.startClock();
    this.setupAtomSubscriptions();
  }

  destroy() {
    this.atomSubscriptions.dispose();
    this.atomSubscriptions = null;
    this.stopClock();
    this.destroyView();
  }

  createView() {
    this.viewWrapper = document.createElement('div');
    this.viewWrapper.className = 'atom-status-bar-clock';
    this.statusBar.addRightTile({ item: this.viewWrapper, priority: 0 });
  }

  destroyView() {
    this.viewWrapper.parentNode.removeChild(this.viewWrapper);
    this.viewWrapper = null;
  }

  toggleView() {
    this.viewWrapper.style.display = this.viewWrapper.style.display ? '' : 'none';
  }

  updateTime(dateTime) {
    this.viewWrapper.textContent = dateTime;
  }

  startClock() {
    this.updateTime(this.getDate());
    const { refreshInterval } = this.config;
    const nextRefreshInterval = refreshInterval - (Date.now() % refreshInterval);
    this.tickTimer = window.setTimeout(() => { this.startClock(); }, nextRefreshInterval);
  }

  stopClock() {
    if (this.tickTimer) {
      window.clearTimeout(this.tickTimer);
      this.tickTimer = null;
    }
  }

  refreshClock() {
    this.stopClock();
    this.startClock();
  }

  getDate() {
    const { locale, format } = this.config;
    return moment().locale(locale).format(format);
  }

  setupConfiguration(config) {
    let newConfig = config;
    if (!newConfig) {
      newConfig = {
        format: atom.config.get('atom-status-bar-clock.format'),
        locale: atom.config.get('atom-status-bar-clock.locale'),
        refreshInterval: atom.config.get('atom-status-bar-clock.refreshInterval') * 1000
      };
    }
    this.config = Object.assign(this.config || {}, newConfig);
  }

  setupAtomSubscriptions() {
    this.atomSubscriptions.add(atom.commands.add('atom-workspace', {
      'atom-status-bar-clock:toggle': () => { this.toggleView(); }
    }));

    this.atomSubscriptions.add(atom.config.onDidChange('atom-status-bar-clock.format', (event) => {
      this.setupConfiguration({ format: event.newValue });
      this.refreshClock();
    }));

    this.atomSubscriptions.add(atom.config.onDidChange('atom-status-bar-clock.locale', (event) => {
      this.setupConfiguration({ locale: event.newValue });
      this.refreshClock();
    }));

    this.atomSubscriptions.add(atom.config.onDidChange('atom-status-bar-clock.refreshInterval', (event) => {
      this.setupConfiguration({ refreshInterval: event.newValue * 1000 });
      this.refreshClock();
    }));
  }

}
