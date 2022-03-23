const Sentry = require("@sentry/node");

// Importing @sentry/tracing patches the global hub for tracing to work.

const Tracing = require("@sentry/tracing");

Sentry.init({
	dsn: "https://6b0c9a1b067247feb4aae70bdf233d83@o1054098.ingest.sentry.io/6089819",
	debug: true,
	environment: "development",
	integrations: [
		// enable HTTP calls tracing
		new Sentry.Integrations.Http({ tracing: true }),
		// enable Express.js middleware tracing
	],

	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control  
	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1,
});




module.exports = Sentry;
