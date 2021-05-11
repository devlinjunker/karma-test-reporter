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
  
  /**
   * Executes at the begining of the Tests running?
   * @param {*} browsers 
   */
  this.onRunStart = function(browsers) {
    this.write('onRunStart\n');
    
    console.log(config);

    // console.log(browsers);

    // TODO: Generate map from file to spec name?
    // grep -r 'describe(' ./src ./test | sed 's/:.*//' | uniq
  };

  /**
   * Executes when a Browser initalizes
   * @param {*} browser 
   */
  this.onBrowserStart = function(browser) {
    this.write('onBrowserStart\n');
    console.log(browser);
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

    this.write(result.description + '\n');
  }

  /**
   * Executes when every Test is completed
   * @param {*} browsersCollection 
   * @param {*} results 
   */
  this.onRunComplete = function(browsersCollection, results) {
    this.write('onRunComplete\n');
    console.log(browsersCollection);
    console.log(results);
  }


  /*********************/
  /* Custom functions */
  this.specSuccess = function(browser, result) {
    this.write('specSuccess\n');
    // console.log(browser);
    console.log(result);
  }
  
  this.specFailure = function(browser, result) {
    this.write('specFailure\n');
    // console.log(browser);
    console.log(result);
  };
    
  this.onSpecComplete = function(browser, result) {
    this.write('onSpecComplete\n');
    // console.log(browser);
    console.log(result);
  }
};

TestReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper', 'formatError'];

module.exports = {
  'reporter:testing': ['type', TestReporter]
};

// TODO: How does logging work? 
// Log with the following? or Create Logger?
//  var log = logger.create('reporter.hello');


// Example of onRunComplete results
// {
//   success: 12,
//   failed: 0,
//   skipped: 2,
//   error: false,
//   disconnected: false,
//   exitCode: 0
// }


// Example of Test Result
// {
//   id: '',
//   description: 'should save values with localStorage service',
//   suite: [ 'App Controller', '#save' ],
//   success: true,
//   skipped: false,
//   time: 1,
//   log: [],
//   assertionErrors: [],
//   startTime: 1620453053583,
//   endTime: 1620453053584
// }



// Example of 'config'
// {
//   LOG_DISABLE: 'OFF',
//   LOG_ERROR: 'ERROR',
//   LOG_WARN: 'WARN',
//   LOG_INFO: 'INFO',
//   LOG_DEBUG: 'DEBUG',
//   frameworks: [ 'mocha' ],
//   protocol: 'http:',
//   port: 9876,
//   listenAddress: '0.0.0.0',
//   hostname: 'localhost',
//   httpsServerConfig: {},
//   basePath: '/Users/devlinjunker/Code/js/template.webpack.fend',
//   files: [
//     {
//       pattern: '/Users/devlinjunker/Code/js/template.webpack.fend/node_modules/mocha/mocha.js',
//       included: true,
//       served: true,
//       watched: false
//     },
//     {
//       pattern: '/Users/devlinjunker/Code/js/template.webpack.fend/node_modules/karma-mocha/lib/adapter.js',
//       included: true,
//       served: true,
//       watched: false
//     },
//     Pattern {
//       pattern: '/Users/devlinjunker/Code/js/template.webpack.fend/test/test.bootstrap.js',
//       served: true,
//       included: true,
//       watched: true,
//       nocache: false,
//       weight: [Array],
//       type: undefined
//     }
//   ],
//   browserConsoleLogOptions: { level: 'debug', format: '%b %T: %m', terminal: true },
//   customContextFile: null,
//   customDebugFile: null,
//   customClientContextFile: null,
//   exclude: [ '/Users/devlinjunker/Code/js/template.webpack.fend/karma.conf.js' ],
//   logLevel: 'WARN',
//   colors: true,
//   autoWatch: false,
//   autoWatchBatchDelay: 250,
//   restartOnFileChange: false,
//   usePolling: false,
//   reporters: [ 'testing' ],
//   singleRun: true,
//   browsers: [ 'ChromeHeadless' ],
//   captureTimeout: 60000,
//   pingTimeout: 5000,
//   proxies: {},
//   proxyValidateSSL: true,
//   preprocessors: [Object: null prototype] {
//     '/Users/devlinjunker/Code/js/template.webpack.fend/test/test.bootstrap.js': [ 'webpack', 'sourcemap' ]
//   },
//   preprocessor_priority: {},
//   urlRoot: '/',
//   upstreamProxy: undefined,
//   reportSlowerThan: 0,
//   loggers: [ { type: 'console', layout: [Object] } ],
//   transports: [ 'polling', 'websocket' ],
//   forceJSONP: false,
//   plugins: [
//     { 'reporter:testing': [Array] },
//     'karma-webpack',
//     'karma-mocha',
//     'karma-sourcemap-loader',
//     'karma-chrome-launcher',
//     'karma-eslint',
//     'karma-firefox-launcher'
//   ],
//   client: {
//     args: [],
//     useIframe: true,
//     runInParent: false,
//     captureConsole: true,
//     clearContext: true,
//     mocha: {},
//     originalArgs: []
//   },
//   defaultClient: {
//     args: [],
//     useIframe: true,
//     runInParent: false,
//     captureConsole: true,
//     clearContext: true,
//     mocha: {},
//     originalArgs: []
//   },
//   browserDisconnectTimeout: 2000,
//   browserDisconnectTolerance: 0,
//   browserNoActivityTimeout: 30000,
//   processKillTimeout: 2000,
//   concurrency: Infinity,
//   failOnEmptyTestSuite: true,
//   retryLimit: 2,
//   detached: false,
//   crossOriginAttribute: true,
//   browserSocketTimeout: 20000,
//   cmd: 'start',
//   configFile: '/Users/devlinjunker/Code/js/template.webpack.fend/karma.conf.js',
//   webpack: {
//     mode: 'development',
//     entry: {
//       app: './src/example/entry.js',
//       storage: './src/example/storage/entry.js',
//       todo: './src/example/todo/entry.js',
//       list: './src/example/list/entry.js'
//     },
//     output: {
//       filename: '[name].bundle.js',
//       path: '/Users/devlinjunker/Code/js/template.webpack.fend/public'
//     },
//     devtool: 'inline-source-map',
//     resolve: { extensions: [Array], modules: [Array], alias: [Object] },
//     plugins: [
//       [HtmlWebpackPlugin],
//       [HtmlWebpackPlugin],
//       [HtmlWebpackPlugin],
//       [HtmlWebpackPlugin],
//       [Object],
//       [MiniCssExtractPlugin],
//       [FlowWebpackPlugin],
//       [HotModuleReplacementPlugin],
//       [CircularDependencyPlugin],
//       [Object]
//     ],
//     module: { rules: [Array] },
//     watch: true
//   },
//   webpackMiddleware: { watchOptions: { aggregateTimeout: 300 } }
// }