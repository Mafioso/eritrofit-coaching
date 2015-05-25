'use strict';

var createSubmission = require('../../streams/goalsStreams.js').actionstreams.createSubmission;
var createSubmissionResult = require('../../streams/goalsStreams.js').datastreams.createSubmissionResult;
var FileUpload = require('../../../common/components/FileUpload.jsx');
var Preloader = require('../../../common/components/Preloader.jsx');
var tabIndex = 1;

var CreateSubmissionModal = React.createClass({
  propTypes: {
    goalId: React.PropTypes.string,
    authorId: React.PropTypes.string,
    closeModal: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      selectedFile: null,
      error: '',
      mode: 'DEFAULT'
    };
  },
  updateSelectedFile: function(file) {
    this.setState({
      selectedFile: file
    });
  },
  onSubmit: function(event) {
    event.preventDefault();
    this.setState({
      mode: 'LOADING'
    });
    createSubmission.emit({
      goalId: this.props.goalId,
      text: this.refs.text.getDOMNode().value,
      file: this.state.selectedFile,
      createdBy: this.props.authorId
    });
  },
  submissionResultHandler: function() {
    this.setState({
      error: '',
      mode: 'SUCCESS'
    });
  },
  submissionErrorHandler: function() {
    this.setState({
      error: 'Обязательно выберите фото для загрузки',
      mode: 'DEFAULT'
    });
  },
  componentWillMount: function() {
    document.body.className += ' overflow-hidden';

    createSubmissionResult.onValue(this.submissionResultHandler);
    createSubmissionResult.onError(this.submissionErrorHandler);
  },
  componentWillUnmount: function() {
    document.body.className = document.body.className.replace(/\boverflow-hidden\b/, '');

    createSubmissionResult.offValue(this.submissionResultHandler);
    createSubmissionResult.offError(this.submissionErrorHandler);
  },
  render: function() {

    var error;
    var cancelButton;
    var submitButton;

    if (this.state.error) {
      error = (
        <div className='red h5 mb2 center'>
          {this.state.error}
        </div>
      );
    }

    switch (this.state.mode) {
      case 'DEFAULT':
        submitButton = (
          <div className='center mb1'>
            <button
              tabIndex={tabIndex}
              className='rounded bg-blue white'
              type='submit'>
              Сохранить
            </button>
          </div>
        );
        cancelButton = (
          <div className='center'>
            <button
              onClick={this.props.closeModal}
              tabIndex={tabIndex}
              className='button-small button-transparent h6 gray'
              type='button'>
              Отмена
            </button>
          </div>
        );
        break;

      case 'SUCCESS':
        submitButton = (
          <div className='center mb1'>
            <button
              onClick={this.props.closeModal}
              tabIndex={tabIndex}
              className='rounded bg-green white'
              type='button'>
              Готово
            </button>
          </div>
        );
        break;

      case 'LOADING':
        submitButton = (
          <div className='center mb1'>
            <button
              disabled={true}
              tabIndex={tabIndex}
              className='rounded bg-blue white'
              type='button'>
              <Preloader /> Сохранить
            </button>
          </div>
        );
        break;

      default:
        break;
    }

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
            style={{width: '100%', maxWidth: '24rem', margin: 'auto'}}>
            <div className='bg-white rounded modal'>

              <div className='p2 bold center border-bottom'>
                <div>
                  Загрузка результата
                </div>
              </div>

              <form
                className='p2'
                onSubmit={this.onSubmit}>

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
                    getValue={this.updateSelectedFile}
                    />
                </div>

                <div className='mb1'>
                  <label
                    className='block h5 gray'>
                    Комментарий
                  </label>
                  <textarea
                    ref='text'
                    tabIndex={tabIndex}
                    className='field-light full-width fit' />
                </div>

                {error}
                {submitButton}
                {cancelButton}

              </form>

            </div>
          </div>
          <div className='flex-auto' style={{minHeight: '4rem'}}/>
        </div>
      </div>
    );
  }
});

module.exports = CreateSubmissionModal;
