'use strict';

var _ = require('lodash');
var Nav = require('../components/Nav.jsx');
var MessagesList = require('../components/messages/MessagesList.jsx');

var ModeSwitch = require('../../common/components/ModeSwitch.jsx');
var Shell = require('../../common/components/Shell.jsx');

var messageStreams = require('../streams/messageStreams.js');

var Messages = React.createClass({
  getInitialState: function() {
    return {
      data: {},
      mode: 'LOADING'
    };
  },
  createCommentResultHandler: function(comment) {
    var data = _.clone(this.state.data);
    if (data.comments[comment.get('message').id]) {
      data.comments[comment.get('message').id].push(comment);
    } else {
      data.comments[comment.get('message').id] = [comment];
    }
    this.setState({
      data: data
    });
  },
  removeCommentResultHandler: function(comment) {
    var data = _.clone(this.state.data);
    var index = _.findIndex(data.comments[comment.get('message').id], { id: comment.id });
    data.comments[comment.get('message').id].splice(index, 1);
    this.setState({
      data: data
    });
  },
  getAllMessagesResultHandler: function(data) {
    this.setState({
      data: data,
      mode: 'DEFAULT'
    });
  },
  componentWillMount: function() {
    messageStreams.datastreams.getAllMessagesResult.onValue(this.getAllMessagesResultHandler);
    messageStreams.datastreams.createCommentResult.onValue(this.createCommentResultHandler);
    messageStreams.datastreams.removeCommentResult.onValue(this.removeCommentResultHandler);
  },
  componentDidMount: function() {
    messageStreams.actionstreams.getAllMessages.emit({
      userId: this.props.params.currentUser.id,
      date: new Date()
    });
  },
  componentWillUnmount: function() {
    messageStreams.datastreams.getAllMessagesResult.offValue(this.getAllMessagesResultHandler);
    messageStreams.datastreams.createCommentResult.offValue(this.createCommentResultHandler);
    messageStreams.datastreams.removeCommentResult.offValue(this.removeCommentResultHandler);
  },
  render: function() {
    var userpic;
    if (this.props.params.currentUser.get('userpicThumb')) {
      userpic = this.props.params.currentUser.get('userpicThumb').url();
    }

    return (
      <ModeSwitch mode={this.state.mode}>

        <Shell key='DEFAULT'>
          <div className='flex-auto'>
            <Nav
              fullname={this.props.params.currentUser.get('fullname')}
              userpic={userpic}
              currentUrl={this.props.params.currentUrl}
              currentView={this.props.params.currentView}
              />
            <div className='cards'>
              <div style={{marginTop: '4.25rem'}} />
              <MessagesList
                userId={this.props.params.currentUser.id}
                data={this.state.data} />
              <div className='m2 gray'>
                <h3>Сообщения</h3>
                <div className='mb1'>
                  Эта страница - Ваш канал связи с тренером.
                </div>
                <div className='h6'>
                  В диалоге участвуете только Вы и сотрудники Eritrofit.
                </div>
              </div>
            </div>
          </div>
        </Shell>

        <Shell key='LOADING'>
          <div className='flex-auto flex flex-center'>
            <Nav
              fullname={this.props.params.currentUser.get('fullname')}
              userpic={userpic}
              currentUrl={this.props.params.currentUrl}
              currentView={this.props.params.currentView}
              />
            <div className='view-status gray h1'>
              Загрузка...
            </div>
          </div>
        </Shell>
      </ModeSwitch>
    );
  }
});

module.exports = Messages;
