'use strict';

var FileUpload = require('../../../common/components/FileUpload.jsx');
var tabIndex = 1;

var CreateSubmissionModal = React.createClass({
  propTypes: {
    goalId: React.PropTypes.string
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
          onClick={this.toggleMode}
          className='bg-white muted z2'
          style={{
            width: '100vw',
            height: '100vh'
          }} />
        <div className='flex flex-column overflow-auto absolute top-0 left-0 right-0 bottom-0 p1'>
          <div className='flex-auto'/>
          <div
            className='flex-none bg-white border rounded p2 mb2'
            style={{width: '100%', maxWidth: '22rem', margin: 'auto'}} >

            <div className='h2 center'>Загрузка результата</div>

            <form>

              <div className='mb1'>
                <label
                  className='block h5 gray'>
                  Фото
                </label>
                <FileUpload
                  className='full-width'
                  name='userpic'
                  label='Загрузить фотографию'
                  tabIndex={tabIndex}
                  getValue=''
                  />
              </div>

              <div className='mb1'>
                <label
                  className='block h5 gray'>
                  Комментарий
                </label>
                <textarea
                  tabIndex={tabIndex}
                  className='field-light full-width fit' />
              </div>

              <div className='center mb1'>
                <button
                  tabIndex={tabIndex}
                  className='rounded bg-blue white'
                  type='submit'>
                  Сохранить
                </button>
              </div>

              <div className='center'>
                <button
                  tabIndex={tabIndex}
                  className='button-small button-transparent h6 gray'
                  type='button'>
                  Отмена
                </button>
              </div>

            </form>

          </div>
          <div className='flex-auto'/>
        </div>
      </div>
    );
  }
});

module.exports = CreateSubmissionModal;
