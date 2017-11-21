'use strict';
const debug = require('debug')('transom:template');
const TransomEjsHandler = require('./lib/ejsHandler');

function TransomEjsTemplate() {
	this.initialize = function (server, options) {
		const regKey = options.registryKey || 'transomTemplate';
		debug("Adding TransomEjsHandler to the registry as:", regKey)
		server.registry.set(regKey, new TransomEjsHandler(server, options));
	}
}

module.exports = new TransomEjsTemplate();