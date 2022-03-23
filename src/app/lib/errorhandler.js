require('dotenv').config({ path: '.dev.env' });

const Sentry = require("@sentry/node");

var debug_mode = Boolean(process.env.APP_DEBUG);

// Importing @sentry/tracing patches the global hub for tracing to work.
const Tracing = require("@sentry/tracing");

Sentry.init({
  dsn: "https://52ab05ae12664276beb7e5aee49d7f9e@o1054098.ingest.sentry.io/6153055",
  debug: true,
	environment: "development",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
  ],
  	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control  
	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
  tracesSampleRate: 1,
});


module.exports.Sentry = Sentry;


module.exports = (error) => {

  
    if(!debug_mode) Sentry.captureException(error);
      
};
