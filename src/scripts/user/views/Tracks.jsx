'use strict';

var Nav = require('../components/Nav.jsx');

var Tracks = React.createClass({
  render: function() {
    return (
      <div className='flex-auto'>
        <Nav
          fullname={this.props.params.currentUser.get('fullname')}
          userpic={this.props.params.currentUser.get('userpicThumb').url()}
          currentUrl={this.props.params.currentUrl}
          currentView={this.props.params.currentView}
          />
          <div className='cards'>
            <div style={{marginTop: '4.25rem'}} />
              <div className='card bg-blue white card--track rounded'>
                <div className='clearfix card-body rounded'>
                  <div className='left'>
                    <div className='icon icon--track h1'>
                      В
                    </div>
                  </div>
                  <div className='overflow-hidden'>
                    <div className='flex flex-baseline'>
                      <div className='h3 flex-auto'>
                        Выполнение целей
                      </div>
                      <div className='card-progress-counter flex-none'>
                        value
                      </div>
                    </div>
                    <div className='h6 flex flex-wrap flex-baseline mb1'>
                      <div className='flex-auto mr1'>
                        min/max or avg
                      </div>
                      <div className='flex-none'>
                        last measured date
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
      </div>
    );
  }
});

module.exports = Tracks;
