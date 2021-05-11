{
  LOG_DISABLE: 'OFF',
  LOG_ERROR: 'ERROR',
  LOG_WARN: 'WARN',
  LOG_INFO: 'INFO',
  LOG_DEBUG: 'DEBUG',
  frameworks: [ 'mocha' ],
  protocol: 'http:',
  port: 9876,
  listenAddress: '0.0.0.0',
  hostname: 'localhost',
  httpsServerConfig: {},
  basePath: '/Users/devlinjunker/Code/js/template.webpack.fend',
  files: [
    {
      pattern: '/Users/devlinjunker/Code/js/template.webpack.fend/node_modules/mocha/mocha.js',
      included: true,
      served: true,
      watched: false
    },
    {
      pattern: '/Users/devlinjunker/Code/js/template.webpack.fend/node_modules/karma-mocha/lib/adapter.js',
      included: true,
      served: true,
      watched: false
    },
    Pattern {
      pattern: '/Users/devlinjunker/Code/js/template.webpack.fend/test/test.bootstrap.js',
      served: true,
      included: true,
      watched: true,
      nocache: false,
      weight: [Array],
      type: undefined
    }
  ],
  browserConsoleLogOptions: { level: 'debug', format: '%b %T: %m', terminal: true },
  customContextFile: null,
  customDebugFile: null,
  customClientContextFile: null,
  exclude: [ '/Users/devlinjunker/Code/js/template.webpack.fend/karma.conf.js' ],
  logLevel: 'WARN',
  colors: true,
  autoWatch: false,
  autoWatchBatchDelay: 250,
  restartOnFileChange: false,
  usePolling: false,
  reporters: [ 'testing' ],
  singleRun: true,
  browsers: [ 'ChromeHeadless' ],
  captureTimeout: 60000,
  pingTimeout: 5000,
  proxies: {},
  proxyValidateSSL: true,
  preprocessors: [Object: null prototype] {
    '/Users/devlinjunker/Code/js/template.webpack.fend/test/test.bootstrap.js': [ 'webpack', 'sourcemap' ]
  },
  preprocessor_priority: {},
  urlRoot: '/',
  upstreamProxy: undefined,
  reportSlowerThan: 0,
  loggers: [ { type: 'console', layout: [Object] } ],
  transports: [ 'polling', 'websocket' ],
  forceJSONP: false,
  plugins: [
    { 'reporter:testing': [Array] },
    'karma-webpack',
    'karma-mocha',
    'karma-sourcemap-loader',
    'karma-chrome-launcher',
    'karma-eslint',
    'karma-firefox-launcher'
  ],
  client: {
    args: [],
    useIframe: true,
    runInParent: false,
    captureConsole: true,
    clearContext: true,
    mocha: {},
    originalArgs: []
  },
  defaultClient: {
    args: [],
    useIframe: true,
    runInParent: false,
    captureConsole: true,
    clearContext: true,
    mocha: {},
    originalArgs: []
  },
  browserDisconnectTimeout: 2000,
  browserDisconnectTolerance: 0,
  browserNoActivityTimeout: 30000,
  processKillTimeout: 2000,
  concurrency: Infinity,
  failOnEmptyTestSuite: true,
  retryLimit: 2,
  detached: false,
  crossOriginAttribute: true,
  browserSocketTimeout: 20000,
  cmd: 'start',
  configFile: '/Users/devlinjunker/Code/js/template.webpack.fend/karma.conf.js',
  webpack: {
    mode: 'development',
    entry: {
      app: './src/example/entry.js',
      storage: './src/example/storage/entry.js',
      todo: './src/example/todo/entry.js',
      list: './src/example/list/entry.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: '/Users/devlinjunker/Code/js/template.webpack.fend/public'
    },
    devtool: 'inline-source-map',
    resolve: { extensions: [Array], modules: [Array], alias: [Object] },
    plugins: [
      [HtmlWebpackPlugin],
      [HtmlWebpackPlugin],
      [HtmlWebpackPlugin],
      [HtmlWebpackPlugin],
      [Object],
      [MiniCssExtractPlugin],
      [FlowWebpackPlugin],
      [HotModuleReplacementPlugin],
      [CircularDependencyPlugin],
      [Object]
    ],
    module: { rules: [Array] },
    watch: true
  },
  webpackMiddleware: { watchOptions: { aggregateTimeout: 300 } }
}
