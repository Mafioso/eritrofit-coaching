'use strict';

var _ = require('lodash');
var Submission = require('./Submission.jsx');

var SubmissionsList = React.createClass({
  propTypes: {
    submissions: React.PropTypes.array
  },
  render: function() {

    var self = this;

    var submissions = _.map(this.props.submissions, function(submission) {
      return (
        <Submission
          key={submission.id}
          submissionId={submission.id}
          text={submission.get('text')}
          original={submission.get('file').url()}
          thumbnail={submission.get('fileThumb').url()}
          createdAt={submission.createdAt}
          removeSubmission={self.props.removeSubmission}
        />
      );
    });

    return (
      <div>
        {submissions}
      </div>
    );
  }
});

module.exports = SubmissionsList;
