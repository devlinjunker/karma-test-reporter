const fs = require('fs');

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

  this.firstTest = true;

  this.LONG_TEST_BENCHMARK = 200;
  this.LONG_SETUP_TEST_BENCHMARK = 500;

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
    if (this.firstTest) {
      this.write('\n');
      this.firstTest = false;
    }

    if (result.skipped) {
      this.specSkipped(browser, result);
    } else if (result.success) {
      this.specSuccess(browser, result);
    } else {
      this.specFailure(browser, result);
    }

    // I feel like this is the actual test length
    if (result.time > this.LONG_TEST_BENCHMARK ) {
      result.sortTime = result.time;
      this.longTests.push(result);
    }

    // and this includes setup time (before/after each)
    const totalTime = result.endTime - result.startTime;
    // only add if it hasn't been added yet
    if (totalTime > this.LONG_SETUP_TEST_BENCHMARK  && this.longTests.indexOf(result) == -1) {
      result.sortTime = totalTime;
      this.longTests.push(result);
    }

    if (!this.times['spec_times']) {
      this.times['spec_times'] = [];
    }
    this.times['spec_times'].push(result.sortTime ? result.sortTime : totalTime);

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
    this.times['spec_times'] = this.times['spec_times'].sort((a, b) => { return b - a });

    // Get Total Number of Tests and Average Test Time
    const totalTests = results.success + results.failed + results.skipped;
    this.times['average_test_time'] = (this.times['total_time'] - this.times['build_time']) / totalTests;
    results['total'] = totalTests;

    // Print Results to user
    this.printOverview(results);

    // Save Full Data to files
    this.saveFailures();
    this.savePerformance();

    this.write('\n\n');
  }

  /**
   * Triggered when there is an error in the browser
   * @param  {*} browser
   * @param  {*} error
   *
   * TODO: Can we capture errors/logs? and erase our progress line before they print?

   */
  // this.onBrowserError = (browser, error) => {
  //   // TODO:
  //   // console.log(error);
  // }

  /**
   * Triggered when browser logs message
   * @param  {*} browser
   * @param  {*} log     message being logged
   * @param  {*} type    'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'LOG'
   */
  // this.onBrowserLog = (browser, log, type) => {
  //   // TODO: consider printing the last spec name in this and error method
  // }

  /*********************/
  /* Custom functions */

  this.specSuccess = function(browser, result) {
    // TODO: Should we do anything?
  }

  this.specFailure = function(browser, result) {
    // Save to array for output/saving to file later
    this.fails.push(result);

    // Output error in console with test name
    this.write(result.suite.join('-') + ': ' + result.description +'\n');

    // TODO: (and print Files?)

    if (result.assertionErrors.length > 0) {
      this.write('   ' + JSON.stringify(result.assertionErrors) + '\n');
    }
    if (result.log) {
      this.write('   ' + result.log + '\n');
    }

    this.write('\n\n');
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
    this.write('\nBUILD TOOK: ' + helper.formatTimeInterval(this.times['build_time']) + '\n\n');
  }

  this.printProgress = function(browser, specResult) {
    const browserResult = browser.lastResult;
    const totalExecuted = browserResult.success + browserResult.failed
    let msg = `${browser.name}: Executed ${totalExecuted} of ${browserResult.total}`

    this.times['total_time'] = (new Date()).getTime() - this.times['browser_start'];
    const testTime = specResult.endTime - specResult.startTime;

    msg += ` (${testTime} / ${this.times['total_time']})`

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
    this.eraseLastLine();
    this.write(msg);
  }

  this.printOverview = function (runCompleteResults) {
    this.write('\n');

    this.printPerformance();

    this.printResults(runCompleteResults);

    this.printFailures();
  }

  this.printPerformance = function() {
    if(this.longTests.length > 0) {
      // Count of Long Tests
      let msg = this.longTests.length + ' SLOW TEST' + (this.longTests.length > 1 ? 'S' : '');
      msg += ' ( > '+this.LONG_TEST_BENCHMARK +'ms/'+this.LONG_SETUP_TEST_BENCHMARK+'ms with setup)\n\n';
      this.write(msg);

      // Print 10 Long Test names - first ten in this.longTests
      this.longTests.forEach((result, index) => {
        if (index < 10) {
            this.write('('+(result.endTime - result.startTime)+') - ' + result.suite.join('-') + ': ' + result.description +'\n');
        }
      });

      if (this.longTests.length > 10) {
        this.write('... + ' +(this.longTests.length - 10) + ' more\n')
      }
    }


    this.write('\n');

    this.write('BUILD TIME: ' + helper.formatTimeInterval(this.times['build_time']) + '\n');
    this.write('AVG TEST TIME: ' + helper.formatTimeInterval(this.times['average_test_time']) + '\n');

    const longest = this.longTests.length > 0 ? this.longTests[0].sortTime : this.times['spec_times'][0];
    this.write('LONGEST TEST TIME: ' + helper.formatTimeInterval(longest) + '\n');
    this.write('ALL TEST LENGTH: ' + helper.formatTimeInterval(this.times['total_time']) + '\n');

    const ninetyPercent = this.times['spec_times'][Math.round(this.times['spec_times'].length * 0.1)];

    // 90th percentile?
    this.write('90TH PERCENTILE: ' + helper.formatTimeInterval(ninetyPercent) + '\n');

    this.write('\n');
  }

  this.printResults = function(runCompleteResults) {
    // Total Results
    let output = `TOTAL: ${runCompleteResults.success} SUCCESS`
    if (runCompleteResults.failed > 0) {
      output += `  ${runCompleteResults.failed} FAILED`
    }
    if (runCompleteResults.skipped > 0) {
      output += `  ${runCompleteResults.skipped} SKIPPED`
    }
    output += ` / ${runCompleteResults.total} TOTAL` // (calculated in onRunComplete)

    this.write(output + '\n');
  }

  this.printFailures = function() {
    if(this.fails.length > 0) {
      this.write(this.fails.length + ' FAILING TEST' + (this.fails.length > 1 ? 'S' : '') + '\n\n');

      // Print All Failed Test Names and errors or log messages
      this.fails.forEach((result, index) => {
        this.write(result.suite.join('-') + ': ' + result.description +'\n');

        // TODO: (and print Files?)

        if (result.assertionErrors.length > 0) {
          this.write('   ' + JSON.stringify(result.assertionErrors) + '\n');
        }
        if (result.log) {
          this.write('   ' + result.log + '\n');
        }
      });

      this.write('\n');
    }
  }

  /*********************/
  /* Save functions */

  this.saveFailures = function() {
    if(this.fails.length > 0) {
      let data = '';

      this.fails.forEach((result, index) => {
        data += result.suite.join('-') + ': ' + result.description +'\n';

        // TODO: (and print Files?)

        if (result.assertionErrors.length > 0) {
          data += '   ' + JSON.stringify(result.assertionErrors) + '\n';
        }
        if (result.log) {
          data += '   ' + result.log + '\n';
        }
      });

      this.writeFile('fails.data', data);

      this.write('Review the Failures with `less test/fails.data`\n');
      // To a File? that can be viewed with less
      // Print test names
      // Print the file name too? grep result.suite[0]
    }
  }

  this.savePerformance = function() {
    const timeOutput = Object.assign({}, this.times);
    delete timeOutput['spec_times'];

    let data = JSON.stringify(timeOutput, null, 2);

    this.writeFile('perf.data', data);

    this.write('\n View Full Performance Data with `less test/perf.data`\n');

    if (this.longTests.length > 0) {
      data = '';

      this.longTests.forEach((result, index) => {
        data += (result.endTime - result.startTime)+': ' + result.suite.join('-') + ': ' + result.description;
        // Add * if it is the test itself that is taking a long time (no star = setup + tests )
        data += (result.sortTime === result.time ? ' *' : '') + '\n';
      });

      this.writeFile('long.data', data);

      this.write(' View ALL Long Tests with `less test/long.data`');
    }
  }

  this.writeFile = function(filename, data) {
    const dir = './test'
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, 0744);
    }

    fs.writeFileSync(dir + '/' + filename, data);
  }
};


PerformanceReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper', 'formatError'];

module.exports = PerformanceReporter;
