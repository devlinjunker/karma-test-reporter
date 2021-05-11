// Marin Config with Karma@6 and Karma-webpack@5
{
  LOG_DISABLE: 'OFF',
  LOG_ERROR: 'ERROR',
  LOG_WARN: 'WARN',
  LOG_INFO: 'INFO',
  LOG_DEBUG: 'DEBUG',
  frameworks: [
    'mocha-debug',
    'mocha',
    'sinon',
    'chai-as-promised',
    'chai',
    'source-map-support',
    'webpack'
  ],
  protocol: 'http:',
  port: 9876,
  listenAddress: '0.0.0.0',
  hostname: 'localhost',
  httpsServerConfig: {},
  basePath: '/Users/djunker/marin/marin-ui',
  files: [
    {
      pattern: '/var/folders/zz/f54ygtr97h33pqcvq0nx01f5zxrmls/T/_karma_webpack_857659/runtime.js',
      included: true,
      served: true,
      watched: false
    },
    {
      pattern: '/var/folders/zz/f54ygtr97h33pqcvq0nx01f5zxrmls/T/_karma_webpack_857659/commons.js',
      included: true,
      served: true,
      watched: false
    },
    {
      pattern: '/Users/djunker/marin/marin-ui/node_modules/source-map-support/browser-source-map-support.js',
      included: true,
      served: true,
      watched: false
    },
    {
      pattern: '/Users/djunker/marin/marin-ui/node_modules/karma-source-map-support/lib/client.js',
      included: true,
      served: true,
      watched: false
    },
    {
      pattern: '/Users/djunker/marin/marin-ui/node_modules/chai/chai.js',
      included: true,
      served: true,
      watched: false
    },
    {
      pattern: '/Users/djunker/marin/marin-ui/node_modules/karma-chai/adapter.js',
      included: true,
      served: true,
      watched: false
    },
    {
      pattern: '/Users/djunker/marin/marin-ui/node_modules/chai-as-promised/lib/chai-as-promised.js',
      included: true,
      served: true,
      watched: false
    },
    {
      pattern: '/Users/djunker/marin/marin-ui/node_modules/sinon/lib/../pkg/sinon.js',
      included: true,
      served: true,
      watched: false
    },
    {
      pattern: '/Users/djunker/marin/marin-ui/node_modules/mocha/mocha.js',
      included: true,
      served: true,
      watched: false
    },
    {
      pattern: '/Users/djunker/marin/marin-ui/node_modules/karma-mocha/lib/adapter.js',
      included: true,
      served: true,
      watched: false
    },
    {
      pattern: '/Users/djunker/marin/marin-ui/node_modules/mocha/mocha.css',
      included: true,
      served: true,
      watched: false
    },
    {
      pattern: '/Users/djunker/marin/marin-ui/node_modules/karma-mocha-debug/lib/adapter.js',
      included: true,
      served: true,
      watched: false
    },
    Pattern {
      pattern: '/Users/djunker/marin/marin-ui/app/test-bootstrap.ts',
      served: true,
      included: true,
      watched: false,
      nocache: false,
      weight: [Array],
      type: undefined,
      isBinary: undefined
    }
  ],
  browserConsoleLogOptions: { level: 'debug', format: '%b %T: %m', terminal: true },
  customContextFile: null,
  customDebugFile: null,
  customClientContextFile: null,
  exclude: [ '/Users/djunker/marin/marin-ui/karma.conf.js' ],
  logLevel: 'INFO',
  colors: true,
  autoWatch: false,
  autoWatchBatchDelay: 250,
  restartOnFileChange: false,
  usePolling: false,
  reporters: [ 'progress', 'coverage-istanbul', 'junit', 'test' ],
  singleRun: true,
  browsers: [ 'ChromeHeadlessNoSandbox' ],
  captureTimeout: 60000,
  pingTimeout: 5000,
  proxies: { '/images/': '/Users/djunker/marin/marin-ui/images/' },
  proxyValidateSSL: true,
  preprocessors: [Object: null prototype] {
    '/Users/djunker/marin/marin-ui/**/*.ts': [ 'webpack', 'sourcemap' ]
  },
  preprocessor_priority: {},
  urlRoot: '/',
  upstreamProxy: undefined,
  reportSlowerThan: 0,
  loggers: [ { type: 'console', layout: [Object] } ],
  transports: [ 'polling', 'websocket' ],
  forceJSONP: false,
  plugins: [
    'karma-*',
    [Object: null prototype] {
      'launcher:ChromeHeadlessNoSandbox': [Array]
    }
  ],
  client: {
    args: [],
    useIframe: true,
    runInParent: false,
    captureConsole: true,
    clearContext: true,
    mocha: { timeout: 6000 },
    originalArgs: []
  },
  defaultClient: {
    args: [],
    useIframe: true,
    runInParent: false,
    captureConsole: true,
    clearContext: true,
    mocha: { timeout: 6000 },
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
  configFile: '/Users/djunker/marin/marin-ui/karma.conf.js',
  coverageIstanbulReporter: {
    fixWebpackSourcePaths: true,
    dir: '/Users/djunker/marin/marin-ui/target/coverage',
    reports: [ 'text-summary', 'html', 'cobertura' ]
  },
  customLaunchers: {
    ChromeHeadlessNoSandbox: { base: 'ChromeHeadless', flags: [Array] }
  },
  junitReporter: {
    useBrowserName: false,
    outputFile: 'junit.xml',
    outputDir: '//Users/djunker/marin/marin-ui/target',
    suite: 'marin-frontend-service'
  },
  mime: { 'text/x-typescript': [ 'ts', 'tsx' ] },
  webpack: {
    mode: 'production',
    devtool: 'inline-cheap-module-source-map',
    resolve: { extensions: [Array], modules: [Array] },
    module: { rules: [Array] },
    plugins: [ [ForkTsCheckerWebpackPlugin] ],
    stats: 'minimal'
  },
  webpackMiddleware: {},
  __karmaWebpackController: KW_Controller {
    isActive: false,
    bundlesContent: {},
    hasBeenBuiltAtLeastOnce: false,
    __webpackOptions: {
      mode: 'production',
      output: [Object],
      stats: 'minimal',
      watch: false,
      optimization: [Object],
      plugins: [Array],
      entry: [Object],
      devtool: 'inline-cheap-module-source-map',
      resolve: [Object],
      module: [Object]
    },
    __karmaEmitter: Server {
      _events: [Object: null prototype],
      _eventsCount: 16,
      _maxListeners: undefined,
      log: [Logger],
      loadErrors: [],
      _injector: [Injector],
      _boundServer: [Server],
      _fileList: [FileList],
      [Symbol(kCapture)]: false
    }
  }
}
