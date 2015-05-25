'use strict';

var Message = require('../messages/Message.jsx');
var Shell = require('../../../common/components/Shell.jsx');

var NewMessagesModal = React.createClass({
  propTypes: {
    data: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      idx: 0
    };
  },
  incrementIndex: function(e) {
    e.preventDefault();
    this.setState(function(prev) {
      return {idx: prev.idx + 1};
    });
  },
  componentWillMount: function() {
    document.body.className += ' overflow-hidden';
  },
  componentWillUnmount: function() {
    document.body.className = document.body.className.replace(/\boverflow-hidden\b/, '');
  },
  render: function() {
    return (
      <div>
        <div
          className='bg-white muted z2'
          style={{
            width: '100vw',
            height: '100vh'
          }} />

        <div className='flex flex-column overflow-auto absolute top-0 left-0 right-0 bottom-0'>
          <div className='flex-auto'/>
          <div
            className='flex-none p1'
            style={{width: '100%', maxWidth: '32rem', margin: 'auto'}}>

            <div className='bg-white modal rounded'>

              <div className='p2 bold center rounded-top bg-blue white'>
                <div>
                  Новые сообщения!
                </div>
                <div className='white h6 muted'>
                  ({this.state.idx + 1} из {this.props.data.messages.length})
                </div>
              </div>

              <div className='py-2 overflow-hidden mb2 border-bottom'>
                <Message
                   userId={this.props.userId}
                   messageId={this.props.data.messages[this.state.idx].id}
                   data={this.props.data.messages[this.state.idx]}
                   comments={this.props.data.comments[this.props.data.messages[this.state.idx].id]}
                   isReadByUser={this.props.data.messageStates[this.props.data.messages[this.state.idx].id]}
                  />
              </div>

              <div className='center mb1'>
                <button
                  onClick={this.props.closeModal}
                  className='button button-transparent gray'>
                  Прочитаю потом
                </button> <Shell show={this.state.idx < this.props.data.messages.length - 1}>
                  <button
                    onClick={this.incrementIndex}
                    className='button bg-blue white'>
                    Дальше
                  </button>
                </Shell> <Shell show={this.state.idx === this.props.data.messages.length - 1}>
                  <button
                    onClick={this.props.closeModal}
                    className='button bg-blue white'>
                    Готово
                  </button>
                </Shell>
              </div>

              <div className='h6 px2 mb2 center gray'>
                Все сообщения можно просмотреть на соотетствующей странице
              </div>

            </div>
          </div>
          <div className='flex-auto' style={{minHeight: '4rem'}}/>
        </div>
      </div>
    );
  }
});

module.exports = NewMessagesModal;
