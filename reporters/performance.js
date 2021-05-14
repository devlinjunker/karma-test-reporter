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

    // TODO: Imitate Progress Reporter
    // this.write(result.description + '\n');


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

    this.longTests = this.longTests.sort((a, b) => { return b.sortTime - a.sortTime });

    this.printOverview(results);
  }


  this.onBrowserError = (browser, error) => {
    // TODO:
    // console.log(error);
  }

  this.onBrowserLog = (browser, log, type) => {
    // TODO:
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

  this.printProgress = function(browser, specResult) {
    const browserResult = browser.lastResult;
    const totalExecuted = browserResult.success + browserResult.failed
    let msg = `${browser.name}: Executed ${totalExecuted} of ${browserResult.total}`

    if (browserResult.failed) {
      msg += '${browserLastResult.failed} FAILED'
    }

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

    const totalTime = (new Date()).getTime() - this.times['browser_start'];
    const testTime = specResult.endTime - specResult.startTime;
    
    msg += ` (${testTime} / ${totalTime})`

    this.write(msg);
  }

  this.printFailures = function() {
    // To a File? that can be viewed with less
    // Print test names
    // Print the file name too? grep result.suite[0]
  }

  this.printPerformance = function() {

    // In a separate file (to be viewed with less)
    // Identify Build Time
    // Identify Average Test time
    // Show Long Tests (sorted by time from large to small)
    // Identify if it is setup vs test time that is taking long
  }

  this.printOverview = function (runCompleteResults) {
    const totalTests = runCompleteResults.success + runCompleteResults.failed + runCompleteResults.skipped;
    this.times['average_test_time'] = (this.times['total_time'] - this.times['build_time']) / totalTests;


    // Print at end:
      // Build time
      // Average Test Time
      // Longest test time
      // Number of Long Tests
      // Number of Failed out of Total

      // Total Results
      console.log(runCompleteResults);

      // print = result.suite.join('-') + ': ' + result.description + '('+(result.endTime - result.startTime)+')'
      console.log(JSON.stringify(this.longTests, null, 2));

      console.log(JSON.stringify(this.fails, null, 2));

      this.write(JSON.stringify(this.times) + '\n\n');
  }
};


PerformanceReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper', 'formatError'];

module.exports = PerformanceReporter;
