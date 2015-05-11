'use strict';

var Password = React.createClass({
  render: function() {
    return (
      <div className='py1 px2 m1 mb2 bg-white rounded'>
        <div className='h3'>
          Новый пароль
        </div>
        <form onSubmit={this.onSubmit}>
          <div className='mb1'>
            <label className='block h5 gray' htmlFor='password'>
              Пароль
            </label>
            <input
              ref='password'
              id='password'
              className='field-light full-width'
              type='text'
              name='password' />
          </div>
          <div className='mt2 py1 border-top right-align'>
            <button className='button bg-gray' type='submit'>
              Сохранить
            </button>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = Password;
