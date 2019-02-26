/** @jsx React.DOM */

define([
  'react',
  'constants',
  'utils',
  'components/chat',

], function (
  React,
  Constants,
  Utils,
  Chat
) {

  /**
   * The entire user areas component that wraps the `UserAreaList`.
   * @class UserAreas
   */
  var UserAreas = React.createClass({displayName: 'UserAreas',

    render: function() {
      var app = this;
      var userStyle = {
        width: "75%"
      };
      var sideStyle = {
        width: "25%"
      };
      var userAreaList = app.props.state.room.status === Constants.RoomState.CONNECTED ?
        UserAreaList({users: app.props.state.users}) : React.DOM.div({id: "noUser"});

      return (
        React.DOM.section({id: "userareas", style: userStyle, className: app.props.state.room.states.screensharing ? 'screensharing' : 'split' + Utils.keys(app.props.state.users).length}, 
          userAreaList
        )

      );
    }

  });

  /**
   * The wrapper for `UserArea` component.
   * @class UserAreaList
   */
  var UserAreaList = React.createClass({displayName: 'UserAreaList',

    render: function() {
      var scope = this;
      var outputHTML = [];

      Utils.forEach(scope.props.users, function (user, userId) {
        outputHTML.push(
          React.DOM.div({key: userId, className: 'userarea' + (user.video && user.video.screensharing ? ' screensharing' : '')}, 
            UserArea({user: user, userId: userId})
          )
        )
      });

      return (React.DOM.div(null, outputHTML));
    }

  });

  /**
   * The user component.
   * @class UserArea
   */
  var UserArea = React.createClass({displayName: 'UserArea',

    /**
     * Attaches the MediaStream to the <video> (or <object> for Temasys WebRTC Plugin) element.
     * @method handleMCUClick
     * @for Controls
     */
    attachStream: function() {
      var scope = this;
      var video = document.getElementById('stream-' + scope.props.userId);
      var renderedStreamId = document.getElementById('stream-id-' + scope.props.userId);

      if (video && renderedStreamId && scope.props.user.stream && scope.props.user.streamId !== renderedStreamId.value) {
        window.attachMediaStream(video, scope.props.user.stream);
        renderedStreamId.value = scope.props.user.streamId;

        if (video.hasAttribute('controls')) {
          setTimeout(function () {
            video.removeAttribute('controls');
          });

          video.setAttribute('playsinline', true);
        }
      }
    },

    componentDidMount: function() {
      this.attachStream();
    },

    componentDidUpdate: function() {
      this.attachStream();
    },

    render: function() {
      var scope = this;
      var outputHTML = [];

      // Self has not shared any stream.
      if (!scope.props.user.stream && scope.props.userId === 'self') {
        outputHTML.push(
          React.DOM.span({className: "userInfo"}, 
            "Share your camera and microphone to participate in the call"
          )
        );

      // If is not self and has not been connected
      } else if (!scope.props.user.connected && scope.props.userId !== 'self') {
        outputHTML.push(
          React.DOM.span({className: "userInfo"}, 
            "Joining..."
          )
        );

      // Peer is connected.
      } else {
        // Push the <video> element.
        outputHTML.push(React.DOM.video({
          id: 'stream-' + scope.props.userId,
          autoPlay: true,
          muted: scope.props.userId === 'self',
          controls: true
        }));

        outputHTML.push(React.DOM.input({
          id: 'stream-id-' + scope.props.userId,
          type: 'hidden',
          value: null
        }));

        var mediaMuted = [];
        var mediaDisabled = [];

        if (!scope.props.user.audio) {
          mediaDisabled.push('Audio');
        } else if(this.props.user.audio.muted) {
          mediaMuted.push('Audio');
        }

        if (!scope.props.user.video) {
          mediaDisabled.push('Video');
        } else if(this.props.user.video.muted) {
          mediaMuted.push('Video');
        }

        outputHTML.push(
          React.DOM.span({className: "userInfo"}, 
            typeof scope.props.user.mcuConnected === 'boolean' && !scope.props.user.mcuConnected ? 'Connecting to MCU ...' : '', React.DOM.br(null), 
            mediaDisabled.length > 0 ? mediaDisabled.join('/') + ' disabled' : '', " ", React.DOM.br(null), 
            mediaMuted.length > 0 ? mediaMuted.join('/') + ' muted' : ''
          )
        );
      }

      return (React.DOM.div(null, outputHTML));
    }

  });

  return UserAreas;
});
