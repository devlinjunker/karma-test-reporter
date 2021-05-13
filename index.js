
TestReporter = require('./reporters/test.js');
PerformanceReporter = require('./reporters/perfomrance.js')

module.exports = {
  'reporter:test': ['type', TestReporter]
  'reporter:performance': ['type', PerformanceReporter]
};

// TODO: How does logging work?
// Log with the following? or Create Logger?
//  var log = logger.create('reporter.hello');
