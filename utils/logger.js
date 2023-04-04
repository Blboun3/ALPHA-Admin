const pino = require('pino');
const transport = pino.transport({
	targets:[
		{
		target: 'pino/file',
		options: { destination: './log.json' },
		},
		{
			target: 'pino-pretty',
			options: {}
		}
	]
});
const logger = pino(transport);
module.exports = logger;
