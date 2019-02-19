/**
 * The app keys and environment configuration object.
 * @attribute Configs
 * @param {String} env                 The environment.
 * @param {JSON}   Skylink             The app keys.
 * @param {String} Skylink.apiMCUKey   The MCU app key.
 * @param {String} Skylink.apiNoMCUKey The non-MCU (P2P) app key.
 * @param {Number} maxUsers            The max number of users that can connect to the app.
 * @type JSON
 * @public
 */
define([], function() {

  /*
    You need to replace these API keys and hostnames with
    your own. Then run 'grunt dev' on the console to transpile
    this file into .js
  */

  function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

if (!getParameterByName('room')) {
  window.location.search = '?room=' + (new Date()).getTime();
}

var config = {
  appKey: '63142039-3059-41e0-a752-1a4173eeaf3a',
  defaultRoom: getParameterByName('room'),
  enableDataChannel: true, // Disable this and sendBlobData(), sendP2PMessage() and sendURLData() will NOT work!
  enableIceTrickle: true,
  audioFallback: true,
  forceSSL: true
};

// /**
//  * For using credentials based authentication
//  */
// var secret = '5mt09xid6kvb1'; //Use App Key secret
// var duration = 2; // 2 hours. Default is 24 for CORS auth
// var startDateTimeStamp = (new Date ()).toISOString();

// // Setup App Key for Privileged User Feature (for Privileged App Key + Auto Introduce Enabled)
// if (window.location.pathname.indexOf('/demo/privileged/auto-priv/') === 0) {
//   config.appKey = '63142039-3059-41e0-a752-1a4173eeaf3a';
//   secret = '5mt09xid6kvb1'; //Use App Key secret

// // Setup App Key for Privileged User Feature (for non-Privileged App Key + Auto Introduce Enabled)
// } else if (window.location.pathname.indexOf('/demo/privileged/auto-unpriv/') === 0) {
//   config.appKey = '63142039-3059-41e0-a752-1a4173eeaf3a';
//   secret =  '5mt09xid6kvb1'; //Use App Key secret

// // Setup App Key for Privileged User Feature (for Privileged App Key + Auto Introduce Disabled)
// } else if (window.location.pathname.indexOf('/demo/privileged/unauto-priv/') === 0) {
//   config.appKey = '63142039-3059-41e0-a752-1a4173eeaf3a';
//   secret =  '5mt09xid6kvb1' ; //Use App Key secret

// // Setup App Key for Privileged User Feature (for non-Privileged App Key + Auto Introduce Disabled)
// } else if (window.location.pathname.indexOf('/demo/privileged/unauto-unpriv/') === 0) {
//   config.appKey = '63142039-3059-41e0-a752-1a4173eeaf3a';
//   secret = '5mt09xid6kvb1'; //Use App Key secret
// }

// if (secret) {
//   var genHashForCredentials = CryptoJS.HmacSHA1(config.defaultRoom + '_' + duration + '_' + startDateTimeStamp, secret);
//   var credentials = encodeURIComponent(genHashForCredentials.toString(CryptoJS.enc.Base64));

//   config.credentials = {
//     duration: duration,
//     startDateTime: startDateTimeStamp,
//     credentials: credentials
//   };
// }
  switch (window.location.host) {

    case 'getaroom.io':
      config = {
        env: 'prod',
        Skylink: {
          apiMCUKey: '63142039-3059-41e0-a752-1a4173eeaf3a',
          apiNoMCUKey: '63142039-3059-41e0-a752-1a4173eeaf3a'
        },
      };
      break;

    case 'dev.getaroom.io':
      config = {
        env: 'dev',
        Skylink: {
          apiMCUKey: '63142039-3059-41e0-a752-1a4173eeaf3a',
          apiNoMCUKey: '63142039-3059-41e0-a752-1a4173eeaf3a'
        },
      };
      break;

    default:
      config = {
        env: 'localhost',
        Skylink: {
          apiMCUKey: '63142039-3059-41e0-a752-1a4173eeaf3a',
          apiNoMCUKey: '63142039-3059-41e0-a752-1a4173eeaf3a'
        }
      };
  }

  // Note that the UI can support up to 20 peers but it is dependant on the user's device to be able to handle.
  config.maxUsers = 10;
  return config;

});
