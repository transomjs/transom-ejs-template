'use strict';
const TransomEjsHandler = require('./lib/ejsHandler');

function TransomEjsTemplate() {
	this.initialize = function (server, options) {
		server.registry.set(options.registryKey || 'transomTemplate', new TransomEjsHandler(server, options));
	}
}

module.exports = new TransomEjsTemplate();