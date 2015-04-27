'use strict';

var Icon = require('../Icon.jsx');
var InputTextarea = require('../InputTextarea.jsx');

var NewWorkoutForm = React.createClass({
  getInitialState: function() {
    return {
      mode: 'DEFAULT',
      workoutDescription: ''
    };
  },
  setDefaultMode: function(event) {
    event.preventDefault();
    this.setState({
      mode: 'DEFAULT'
    });
  },
  setMaximizedMode: function(event) {
    event.preventDefault();
    this.setState({
      mode: 'MAXIMIZED'
    });
  },
  onSubmit: function(event) {
    event.preventDefault();
    this.props.onSubmit(this.state.workoutDescription);
  },
  updateWorkoutDescription: function(newDescription) {
    this.setState({
      workoutDescription: newDescription
    });
  },
  render: function() {
    var form;
    var formToggle;
    switch(this.state.mode) {
      case 'MAXIMIZED':
        formToggle = <button
          onClick={this.setDefaultMode}
          className='workout-add'
          type='button'>
          Отмена
        </button>;

        form = <form
          onSubmit={this.onSubmit}
          className='workouts-form'>
          <div className='workout'>
            <div className='workout-body'>
              <InputTextarea
                name='workoutDescription'
                autoFocus={true}
                onChange={this.updateWorkoutDescription}
                value={this.state.workoutDescription}
                placeholer='Введите инструкции' />
            </div>
            <div className='workout-footer'>
              <button
                className='workout-submit'
                type='submit'>
                Сохранить
              </button>
            </div>
          </div>
        </form>;

        break;
      case 'DEFAULT':
        formToggle = <button
          onClick={this.setMaximizedMode}
          className='workout-add'
          type='button'>
          <Icon name='add' /> Добавить комплекс
        </button>;

        break;
      default:
        break;
    }

    return (
      <div>
        {form}
        {formToggle}
      </div>
    );
  }
});

module.exports = NewWorkoutForm;
