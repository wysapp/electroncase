import React from 'react';

const { object, func } = React.PropTypes;


const enhanceBrowserName = (browser) => {
  if ( browser.name === 'ie') {
    return 'Internet Explorer';
  } else if (browser.type === 'chrome' && /SxS/.test(browser.command) || browser.name === 'chrome-canary') {
    return 'Chrome Canary';
  } else if (browser.type === 'firefox' && /Developer Edition/i.test(browser.command) || browser.name === 'firefox-developer') {
    return 'Firefox Developer Edition';
  }

  return browser.name;
}


const Browser = ({browser, launchBrowser}) => {
  const browserName = enhanceBrowserName(browser);
  const launch = () => launchBrowser(browser);

  let title = browserName;
  let className = 'browser';

  if ( browser.status) {
    className += ' disabled';
    title = browser.status;
  }

  if ( !browser.version) {
    className += ' no-version';
  }

  const src = `./images/${browser.type}_128x128.png`;

  return <a className={className} onClick={launch}>
    <img className="browser-icon" src={src} alt={browserName} title={title} />
    <div className="browser-info">
      <div className="browser-name">{browserName}</div>
      <div className="browser-version">{browser.version}</div>
    </div>
  </a>;
};

Browser.propTypes = {
  browser: object.isRequired,
  launchBrowser: func.isRequired
};

export default Browser;