/**
 * Performance Reporter
 *
 * Goals:
 *  - Identify Build Time
 *  - Identify Average Test time
 *  - Identify Time spent on each test
 *  - Show progress (update output after each test)
 *  - Identify Long Tests (setup + test > 500ms?, setup > 200ms)
 *  - Identify Failing Tests (for easy fixing)
 *
 * @param {*} baseReporterDecorator - a function that takes an object and adds to it methods and properties of karma’s basic reporter (following the Decorator pattern).
 * @param {*} config - The properties from Karma’s config.
 * @param {*} logger - karma’s logger
 * @param {*} helper - contains Karma utility functions, you may not need it
 * @param {*} formatError - a function that takes an error object and returns a string with the error message and stack trace in a readable format.
 */
var PerformanceReporter = function(baseReporterDecorator, config, logger, helper, formatError) {
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
    this.times['build_start'] = (new Date()).getTime();
  };

  /**
   * Executes when a Browser initalizes
   * @param {*} browser
   */
  this.onBrowserStart = function(browser) {
    this.times['browser_start'] = (new Date()).getTime();
    this.times['browser_last_result_start'] = browser.lastResult.startTime;
    this.times['build_time'] = this.times['browser_start'] - this.times['build_start'];

    this.printBuildFinished();
  }

  /**
   * Executes when a Test completes
   * @param {*} browser
   * @param {*} result
   */
  this.onSpecComplete = function(browser, result) {
    if (result.skipped) {
      this.specSkipped(browser, result);
    } else if (result.success) {
      this.specSuccess(browser, result);
    } else {
      this.specFailure(browser, result);
    }

    // I feel like this is the actual test length
    if (result.time > 200) {
      result.sortTime = result.time;
      this.longTests.push(result);
    }

    const totalTime = result.endTime - result.startTime;
    // and this includes setup time (before/after each)
    if (totalTime > 500) {
      result.sortTime = totalTime;
      this.longTests.push(result);
    }

    if (!this.times['spec_times']) {
      this.times['spec_times'] = [];
    }
    this.times['spec_times'].push(result.sortTime);

    this.printProgress(browser, result);
  }

  /**
   * Executes when every Test is completed
   * @param {*} browsersCollection
   * @param {*} results
   */
  this.onRunComplete = function(browsersCollection, results) {
    this.times['run_end'] = (new Date()).getTime();
    this.times['total_time'] = this.times['run_end']-this.times['build_start'];

    // Sort Tests by time
    this.longTests = this.longTests.sort((a, b) => { return b.sortTime - a.sortTime });

    // Get Total Number of Tests and Average Test Time
    const totalTests = results.success + results.failed + results.skipped;
    this.times['average_test_time'] = (this.times['total_time'] - this.times['build_time']) / totalTests;
    results['total'] = totalTests;

    // Print Results to user
    this.printOverview(results);

    // Save Full Data to files
    this.saveFailures();
    this.savePerformance();
  }

  /**
   * Triggered when there is an error in the browser
   * @param  {*} browser
   * @param  {*} error
   *
   * TODO: Can we capture errors/logs? and erase our progress line before they print?

   */
  this.onBrowserError = (browser, error) => {
    // TODO:
    // console.log(error);
  }

  /**
   * Triggered when browser logs message
   * @param  {*} browser
   * @param  {*} log     message being logged
   * @param  {*} type    'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'LOG'
   */
  this.onBrowserLog = (browser, log, type) => {
    // TODO: consider printing the last spec name in this and error method
  }

  /*********************/
  /* Custom functions */

  this.specSuccess = function(browser, result) {
    // TODO: Should we do anything?
  }

  this.specFailure = function(browser, result) {
    this.fails.push(result);
  };

  this.specSkipped = function(browser, result) {
    // TODO: Should we do anything?
  }

  /*********************/
  /* Helper functions */

  this.eraseLastLine = function () {
    this.write('\x1B[1A' + '\x1B[2K');
  }

  /*********************/
  /* Print functions */

  this.printBuildFinished = function () {
    // TODO: print build time
    this.write('BUILD TOOK: ' + this.times['build_time']);
  }

  this.printProgress = function(browser, specResult) {
    const browserResult = browser.lastResult;
    const totalExecuted = browserResult.success + browserResult.failed
    let msg = `${browser.name}: Executed ${totalExecuted} of ${browserResult.total}`

    const totalTime = (new Date()).getTime() - this.times['browser_start'];
    const testTime = specResult.endTime - specResult.startTime;

    msg += ` (${testTime} / ${totalTime})`

    if (browserResult.skipped) {
      msg += ` (skipped ${browserResult.skipped})`
    }

    if (browserResult.disconnected) {
      msg += this.FINISHED_DISCONNECTED
    } else if (browserResult.error) {
      msg += this.FINISHED_ERROR
    } else if (!browserResult.failed) {
      msg += this.FINISHED_SUCCESS
    }

    msg += '\n';

    if (browserResult.failed) {
      msg += `${browserResult.failed} FAILED\n`;
    } else {
      msg += `\n`;
    }

    this.eraseLastLine();
    this.write(msg);
  }

  this.printOverview = function (runCompleteResults) {
    // Count of Long Tests
    this.write(this.longTests.length + ' SLOW TEST' + (this.longTests.length > 1 ? 'S' : '') + '\n');

    // Print 10 Long Test names - first ten in this.longTests
    this.longTests.forEach((spec, index) => {
      if (index < 10) {
          this.write('('+(spec.endTime - spec.startTime)+') - ' + spec.suite.join('-') + ': ' + spec.description +'\n');
      }
    })

    this.write('\n');

    // TODO:

    // Build time
    // Average Test Time
    // Longest test time
    // 90th percentile?
    this.write(JSON.stringify(this.times, null, 2) + '\n');

    // Total Results
    // TOTAL: ${runCompleteResults.success} SUCCESS
    // + ${runCompleteResults.failed} FAILED
    // + ${runCompleteResults.skipped} SKIPPED
    // + / ${runCompleteResults.total} TOTAL (calculated in onRunComplete)
    console.log(runCompleteResults);


    // Print All Failed Test Names (and Files?)
    this.fails.forEach((spec, index) => {
      this.write(spec.suite.join('-') + ': ' + spec.description +'\n');
    });
  }

  /*********************/
  /* Save functions */

  this.saveFailures = function() {
    // To a File? that can be viewed with less
    // Print test names
    // Print the file name too? grep result.suite[0]
  }

  this.savePerformance = function() {

    // In a separate file (to be viewed with less)
    // Identify Build Time
    // Identify Average Test time
    // Show Long Tests (sorted by time from large to small)
    // Identify if it is setup vs test time that is taking long
  }
};


PerformanceReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper', 'formatError'];

module.exports = PerformanceReporter;
