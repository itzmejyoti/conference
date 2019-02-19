/** @jsx React.DOM */

define([
  'react',
  'utils',
  'constants',
  'configs',
  'skylink',
  'router'

], function (
  React,
  Utils,
  Constants,
  Configs,
  Skylink,
  Router
) {

  /**
   * The controls component.
   * @class Controls
   */
  var Controls = React.createClass({displayName: 'Controls',

    /**
     * Handles the select MCU toggle checkbox.
     * @method handleMCUClick
     * @for Controls
     */
    handleMCUClick: function(e) {
      this.props.state.room.flags.mcu = e.target.checked === true;
    },

    /**
     * Handles the select force TURN toggle checkbox.
     * @method handleForceTURNClick
     * @for Controls
     */
    handleForceTURNClick: function(e) {
      this.props.state.room.flags.forceTurn = e.target.checked === true;
    },

    /**
     * Handles the select HD Resolution toggle checkbox.
     * @method handleHDClick
     * @for Controls
     */
    handleHDClick: function(e) {
      this.props.state.room.flags.res = e.target.checked === true ? 'hd' : 'vga';
    },

    /**
     * Handles when "Start a Call" button is clicked.
     * @method handleStartRoom
     * @for Controls
     */
    handleStartRoom: function() {
      var app = this;
      var room = Utils.uuid(6);
      var url = '/' + room;

      if (app.props.state.room.flags.mcu) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + 'mcu=1';
      }

      if (app.props.state.room.flags.forceTurn) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + 'forceTurn=1';
      }

      if (app.props.state.room.flags.res !== 'vga') {
        url += (url.indexOf('?') === -1 ? '?' : '&') + 'res=' + app.props.state.room.flags.res;
      }

      // Redirect instead for IE case if HTML5 history is not supported.
      if (window.historyNotSupported) {
        window.location.href = url;
        return;
      }

      Router.setRoute(url);
    },

    /**
     * Handles when "Leave Room" button is clicked.
     * @method handleLeaveRoom
     * @for Controls
     */
    handleLeaveRoom: function() {
      var app = this;

      Skylink.leaveRoom(true, function () {
        var url = '/'

        // Redirect instead for IE case if HTML5 history is not supported, and if connecting, just redirect instantly to clear all current session.
        if (app.props.state.room.status !== Constants.RoomState.CONNECTED || window.historyNotSupported) {
          window.location.href = url;
          return;
        }

        Router.setRoute(url);
      });
    },

    /**
     * Handles when video mute button is clicked.
     * @method handleVideoMute
     * @for Controls
     */
    handleVideoMute: function() {
      var app = this;

      if (!app.props.state.users.self.video) {
        return;
      }

      Skylink[app.props.state.users.self.video.muted ? 'enableVideo' : 'disableVideo']();
    },

    /**
     * Handles when audio mute button is clicked.
     * @method handleAudioMute
     * @for Controls
     */
    handleAudioMute: function() {
      var app = this;

      if (!app.props.state.users.self.audio) {
        return;
      }

      Skylink[app.props.state.users.self.audio.muted ? 'enableAudio' : 'disableAudio']();
    },

    /**
     * Handles when Room lock button is clicked.
     * @method handleRoomLock
     * @for Controls
     */
    handleRoomLock: function() {
      var app = this;

      Skylink[app.props.state.room.states.locked ? 'unlockRoom' : 'lockRoom']();
    },

    /**
     * Handles when screensharing button is clicked.
     * @method handleScreenshare
     * @for Controls
     */
    handleScreenshare: function() {
      var app = this;

      // Disable user from pressing multiple times until screensharing screen has processed.
      if (app.props.state.room.prevent.screensharing) {
        return;
      }

      app.props.state.room.prevent.screensharing = true;

      if (app.props.state.users.self.video && app.props.state.users.self.video.screensharing) {
        Skylink.stopScreen();
        app.props.state.room.prevent.screensharing = false;
        return;
      }

      app.props.state.users.self.priority = (new Date ()).getTime();

      Skylink.setUserData({
        name: app.props.state.users.self.name,
        priority: app.props.state.users.self.priority
      });

      Skylink.shareScreen(true, function (err) {
        if (err) {
          Skylink.stopScreen();
          return;
        }
      });
    },

    /**
     * Handles when MCU recording button is clicked.
     * @method handleRecording
     * @for Controls
     */
    handleRecording: function () {
      var app = this;

      // Disable user from pressing multiple times until recording has started / failed / ready to stop.
      if (app.props.state.room.prevent.recording || !app.props.state.room.states.mcuServerId) {
        return;
      }

      if(!app.props.state.room.states.recording) {
        app.props.state.room.prevent.recording = true;
        Skylink.startRecording();
        return;
      }

      Skylink.stopRecording();
      app.props.state.room.prevent.recording = true;
    },

    /**
     * Handles when share link textbox is clicked.
     * @method handleLinkClick
     * @for Controls
     */
    handleLinkClick: function (e) {
      e.target.setSelectionRange(0, e.target.value.length);
    },

    /**
     * Handles when close button "x" is clicked.
     * @method handleClose
     * @for Controls
     */
    handleClose: function(e) {
      Dispatcher.toggleControls();
    },

    /**
     * Handles when display name textbox is clicked.
     * @method handleDisplayName
     * @for Controls
     */
    handleDisplayName: function (e) {
      var app = this;
      var name = e.currentTarget.value;

      Skylink.setUserData({
        name: name,
        priority: app.props.state.users.self.priority
      });
    },

    componentDidUpdate: function() {
      var app = this;
      var mcuDom = document.getElementById('mcu');
      var forceTurnDom = document.getElementById('forceTurn');
      var hdDom = document.getElementById('useHD');

      // Enable MCU toggle.
      if (mcuDom) {
        mcuDom.checked = app.props.state.room.flags.mcu;
      }

      // Enable force TURN toggle.
      if (forceTurnDom) {
        forceTurnDom.checked = app.props.state.room.flags.forceTurn;
      }

      // Use HD toggle.
      if (hdDom) {
        hdDom.checked = app.props.state.room.flags.res === 'hd';
      }
    },

    render: function() {
      var app = this;
      var outputHTML = [];
      var logoClassName = 'logo';

      logoClassName += app.props.state.room.status === Constants.RoomState.CONNECTED ? ' joinRoom' : '';
      //logoClassName += app.props.state.room.states.mcuServerId ? ' recording' : '';

      // Push logo.
      outputHTML.push(React.DOM.div({className: logoClassName}, "getaroom.io"));

      switch (app.props.state.state) {
        // -----------------------------
        // Controls state in foyer.
        case Constants.AppState.FOYER:
          // Push "Start a Call" button.
          outputHTML.push(
            React.DOM.button({className: "joinRoom mainControl", onClick: app.handleStartRoom}, 
                "Start a new call"
            )
          );

          // Push description.
          outputHTML.push(
            React.DOM.div({className: "description"}, 
              React.DOM.p(null, 
                React.DOM.small(null, "A SkylinkJS Tech Demo"), React.DOM.br(null), React.DOM.br(null), 
                "Start a FREE call", React.DOM.br(null), "with up to ", Configs.maxUsers, " people"
              ), 
              React.DOM.p(null, 
                "Just hit the \"Start a new call\" button below and share the link.", React.DOM.br(null), React.DOM.br(null), 
                // "This app is a ", React.DOM.a({href: "https://temasys.io/platform", target: "_blank"}, "SkylinkJS"), " tech demo and you can ", React.DOM.a({href: "https://github.com/Temasys/getaroom", target: "_blank"}, "fork it on github"), "."
              )
            )
          );

          // Push select MCU toggle checkbox.
          outputHTML.push(
            React.DOM.div({className: "link top"}, 
              React.DOM.input({type: "checkbox", id: "mcu", name: "mcu", onClick: app.handleMCUClick}), " ", React.DOM.label({for: "mcu"}, "Use Skylink Media Relay")
            )
          );

          // Push select force TURN toggle checkbox.
          outputHTML.push(
            React.DOM.div({className: "link"}, 
              React.DOM.input({type: "checkbox", id: "forceTurn", name: "forceTurn", onClick: app.handleForceTURNClick}), " ", React.DOM.label({for: "forceTurn"}, "Force Skylink TURN")
            )
          );

          // Push select force TURN toggle checkbox.
          outputHTML.push(
            React.DOM.div({className: "link"}, 
                React.DOM.input({type: "checkbox", id: "useHD", name: "useHD", onClick: app.handleHDClick}), " ", React.DOM.label({for: "useHD"}, "Use HD Resolution")
            )
          );
          break;

        // -----------------------------
        // Controls state when in Room.
        case Constants.AppState.IN_ROOM:
          // Push "Leave Room" button.
          outputHTML.push(
            React.DOM.button({className: "leaveRoom mainControl", onClick: app.handleLeaveRoom}, 
              "Leave this call"
            )
          );

          // Push share link textbox.
          outputHTML.push(
            React.DOM.div({className: "link joinRoom"}, 
              "Invite others to join this call at this link:", React.DOM.br(null), 
              React.DOM.input({type: "text", value: location.toString(), onClick: app.handleLinkClick, readOnly: true})
            )
          );

          // Push Room connection status.
          outputHTML.push(
            React.DOM.div({className: "status"}, 
              React.DOM.span(null, "Status: ", app.props.state.room.status), 
              React.DOM.p({className: "statusMessage"}, app.props.state.room.statusError)
            )
          );

          if(app.props.state.room.status === Constants.RoomState.CONNECTED) {
            var roomLockClassName = app.props.state.room.states.locked ? '' : 'on';
            var screenshareClassName = app.props.state.users.self.video && app.props.state.users.self.video.screensharing ? 'on' : '';
            var audioClassName = app.props.state.users.self.stream && app.props.state.users.self.audio ? (app.props.state.users.self.audio.muted ? '' : 'on') : 'off muted';
            var videoClassName = app.props.state.users.self.stream && app.props.state.users.self.video ? (app.props.state.users.self.video.muted ? '' : 'on') : 'off muted';
            var recordingClassName = app.props.state.room.states.recording ? 'on' : '';

            screenshareClassName += app.props.state.room.prevent.screensharing ? ' muted' : '';
            recordingClassName += app.props.state.room.prevent.recording ? ' muted' : '';

            // Push video mute toggle button.
            outputHTML.push(
              React.DOM.button({id: "videoMute", onClick: app.handleVideoMute, className: videoClassName, title: "Mute/Unmute Video"})
            );

            // Push audio mute toggle button.
            outputHTML.push(
              React.DOM.button({id: "audioMute", onClick: app.handleAudioMute, className: audioClassName, title: "Mute/Unmute Audio"})
            );

            // Push screensharing toggle button.
            outputHTML.push(
              React.DOM.button({id: "screenshare", onClick: app.handleScreenshare, className: screenshareClassName, title: "Share your screen"})
            );

            // Push Room lock toggle button.
            outputHTML.push(
              React.DOM.button({id: "roomLock", onClick: app.handleRoomLock, className: roomLockClassName, title: "Lock/Unlock Room"})
            );

            /*if (app.props.state.room.states.mcuServerId) {
              // Push recording toggle button.
              outputHTML.push(
                <button id="recording" onClick={app.handleRecording} className={recordingClassName} title="Start/Stop Recording"></button>
              );
            }*/

            // Push display name textbox.
            outputHTML.push(
              React.DOM.div({className: "displayName"}, 
                React.DOM.span(null, "Display Name"), 
                React.DOM.input({id: "displayName", type: "text", value: app.props.state.users.self.name, placeholder: "Display Name", 
                  title: "Your Display Name in Chat", onChange: app.handleDisplayName})
              )
            );
          }
      }

      return (
        React.DOM.section({id: "controls"}, 
            React.DOM.nav(null, 
              React.DOM.button({onClick: app.handleClose, className: app.props.state.state === Constants.AppState.IN_ROOM ? 'close' : ''}), 
              React.DOM.button(null), 
              React.DOM.button(null)
            ), 
            React.DOM.div(null, outputHTML)
        )
      );
    }
  });

  return Controls;
});
