'use babel';

import AtomStatusBarClockView from './atom-status-bar-clock-view';

export default {

  config: {
    format: {
      type: 'string',
      title: 'Time format',
      description: 'Time format. [Available time format](http://momentjs.com/docs/#/displaying/format/).',
      default: 'HH:mm:ss',
      order: 1
    },
    locale: {
      type: 'string',
      title: 'Locale',
      description: 'Time locale. [Available time locale](https://github.com/moment/moment/tree/master/locale).',
      default: 'en',
      order: 2
    },
    refreshInterval: {
      type: 'integer',
      title: 'Clock interval',
      description: 'Clock refresh interval (in seconds).',
      default: 1,
      minimum: 1,
      order: 3
    }
  },

  deactivate() {
    if (this.atomStatusBarClockView) {
      this.atomStatusBarClockView.destroy();
      this.atomStatusBarClockView = null;
    }
  },

  consumeStatusBar(statusBar) {
    this.atomStatusBarClockView = new AtomStatusBarClockView(statusBar);
    this.atomStatusBarClockView.create();
  }

};
