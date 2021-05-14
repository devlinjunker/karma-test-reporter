const util = require('util');

/**
 * Testing how the Karma Reporters work
 *
 * @param {*} baseReporterDecorator - a function that takes an object and adds to it methods and properties of karma’s basic reporter (following the Decorator pattern).
 * @param {*} config - The properties from Karma’s config.
 * @param {*} logger - karma’s logger
 * @param {*} helper - contains Karma utility functions, you may not need it
 * @param {*} formatError - a function that takes an error object and returns a string with the error message and stack trace in a readable format.
 */
var TestReporter = function(baseReporterDecorator, config, logger, helper, formatError) {
  baseReporterDecorator(this);

  this.times = {};
  this.longTests = [];
  this.longTestsCustom = [];
  this.fails = [];

  /**
   * Executes at the begining of the Tests running?
   * @param {*} browsers
   */
  this.onRunStart = function(browsers) {
    this.write('test-onRunStart\n');

    // console.log(config);

    this.times['build_start'] = (new Date()).getTime();

    // Pretty sure this is [] at this point
    // console.log(browsers);

    // This runs before webpack starts bundling with karma-webpack



    // TODO: Generate map from file to spec name?
    // grep -r 'describe(' ./src ./test | sed 's/:.*//' | uniq
  };

  /**
   * Executes when a Browser initalizes
   * @param {*} browser
   */
  this.onBrowserStart = function(browser) {
    this.write('test-onBrowserStart\n');
    // console.log(browser);
    this.times['browser_start'] = (new Date()).getTime();
    this.times['browser_last_result_start'] = browser.lastResult.startTime;
    this.times['build_time'] = this.times['browser_start'] - this.times['build_start'];
  }

  /**
   * Executes when a Test completes
   * @param {*} browser
   * @param {*} result
   */
  this.onSpecComplete = function(browser, result) {
    // this.write('onSpecComplete\n');
    // console.log(browser);
    // console.log(result);

    if (result.skipped) {
      this.specSkipped(browser, result);
    } else if (result.success) {
      this.specSuccess(browser, result);
    } else {
      this.specFailure(browser, result);
    }

    // this.write(result.description + '\n');

    if (!this.times['first_test_start']) {
      this.times['first_test_start'] = result.startTime;
      this.times['first_test_end'] = result.endTime;

      this.write(JSON.stringify(this.times) + '\n\n');
    }

    // I feel like this is the test length
    if (result.time > 200) {
      this.longTests.push(result.suite.join('-') + ': ' + result.description);
    }

    // vs this is includes setup
    if (result.endTime - result.startTime > 500) {
      this.longTestsCustom.push(result.suite.join('-') + ': ' + result.description + '('+(result.endTime - result.startTime)+')');
    }
  }

  /**
   * Executes when every Test is completed
   * @param {*} browsersCollection
   * @param {*} results
   */
  this.onRunComplete = function(browsersCollection, results) {
    this.write('test-onRunComplete\n');
    // console.log(browsersCollection);
    // console.log(results);
    //
    // console.log(JSON.stringify(this.longTests, null, 2));
    // console.log(JSON.stringify(this.longTestsCustom, null, 2));
    //
    // this.times['run_end'] = (new Date()).getTime();
    // this.times['total_time'] = this.times['run_end']-this.times['build_start'];
    // this.write(JSON.stringify(this.times) + '\n\n');
    //
    // console.log(JSON.stringify(this.fails, null, 2));
  }

  /**
   * Triggered when there is an error in the browser
   * @param  {*} browser
   * @param  {*} error
   *
   * TODO: Can we capture errors/logs? and erase our progress line before they print?
   */
  this.onBrowserError = (browser, error) => {
    // TODO: Haven't actually hit this yet

    this.writeCommonMsg('ERROR:' + '\n');
    this.writeCommonMsg(error + '\n\n\n\n');
    console.log(browser);
    // this.writeCommonMsg(util.format(this.ERROR, browser) + formatError(error, '  '))
  }

  /**
   * Triggered when browser logs message
   * @param  {*} browser
   * @param  {*} log     message being logged
   * @param  {*} type    'error' | 'warn' | 'info' | 'debug' | 'log'
   */
  this.onBrowserLog = (browser, log, type) => {
    console.log(log);
    console.log(type);
    // if (!browserConsoleLogOptions || !browserConsoleLogOptions.terminal) return
    type = type.toUpperCase()
    // if (browserConsoleLogOptions.level) {
    //   const logPriority = constants.LOG_PRIORITIES.indexOf(browserConsoleLogOptions.level.toUpperCase())
    //   if (constants.LOG_PRIORITIES.indexOf(type) > logPriority) return
    // }
    // if (!helper.isString(log)) {
    //   // TODO(vojta): change util to new syntax (config object)
    //   log = util.inspect(log, false, undefined, this.USE_COLORS)
    // }
    if (this._browsers && this._browsers.length === 1) {
      this.writeCommonMsg(util.format(this.LOG_SINGLE_BROWSER, type, log))
    } else {
      this.writeCommonMsg(util.format(this.LOG_MULTI_BROWSER, browser, type, log))
    }
  }


  /*********************/
  /* Custom functions */
  this.specSuccess = function(browser, result) {
    //this.write('specSuccess\n');
    // console.log(browser);
    // console.log(result);
  }

  this.specFailure = function(browser, result) {
    this.write('test-specFailure\n');
    // console.log(browser);
    console.log(result);
    this.fails.push(result.suite.join('-') + ': ' + result.description + '('+(result.endTime - result.startTime)+')');
  };

  this.specSkipped = function(browser, result) {
    this.write('test-specSkipped\n');
    console.log(result);
  }
};


TestReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper', 'formatError'];

module.exports = TestReporter;
