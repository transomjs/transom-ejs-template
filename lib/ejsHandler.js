'use strict';
const assert = require('assert');
const debug = require('debug')('transom:template');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

module.exports = function TransomEjsHandler(server, options) {

    function renderHtmlTemplate(templateName, data, htmlOptions) {
        assert(templateName, 'Template name is required.');
        debug('Rendering HTML template', templateName);
        
        const opts = Object.assign({}, options, htmlOptions);
        data = data || {};

        data.environment = (process.env.NODE_ENV || 'DEVELOPMENT').toUpperCase();
        data.envMessage = (data.environment === 'PRODUCTION' ? '' : `This page is in ${data.environment}.`);
        data.hostname = data.hostname || '/';
        data.pageTitle = data.pageTitle || templateName;

        const template = server.registry.get('transom-config.definition.template', {});
        // Navigate up out of the node_modules folder, to the root.
        const templatePrefix = (data.environment === 'TESTING' ? path.join('..', 'test') : path.join('..', '..', '..', '..'));
        const templatePath = path.join(templatePrefix, opts.templatePath || template.htmlTemplatePath || 'templateHtml');
        const filename = path.join(__dirname, templatePath, `${templateName}.ejs`);

        if (!fs.existsSync(filename)) {
            debug('HTML template not found', filename);
            throw new Error(`HTML template not found: ${filename}`);
        }
        const tmp = fs.readFileSync(filename, 'utf8');

        // Including 'filename' allows ejs relative includes to work!
        return ejs.render(tmp, {
            data,
            filename
        });
    }

    function renderEmailTemplate(templateName, data, emailOptions) {
        assert(templateName, 'Template name is required.');
        debug('Rendering Email template', templateName);

        const opts = Object.assign({}, options, emailOptions);
        data = data || {};

        data.environment = (process.env.NODE_ENV || 'DEVELOPMENT').toUpperCase();
        data.envMessage = (data.environment === 'PRODUCTION' ? '' : `Message sent from ${data.environment}.`);
        data.hostname = data.hostname || '/';

        const template = server.registry.get('transom-config.definition.template', {});
        // Navigate up out of the node_modules folder, to the root.
        const templatePrefix = (data.environment === 'TESTING' ? path.join('..', 'test') : path.join('..', '..', '..', '..'));
        const templatePath = path.join(templatePrefix, opts.templatePath || template.emailTemplatePath || 'templateEmail');
        const filename = path.join(__dirname, templatePath, `${templateName}.ejs`);

        if (!fs.existsSync(filename)) {
            debug('Email template not found', filename);
            throw new Error(`Email template not found: ${filename}`);
        }
        const tmp = fs.readFileSync(filename, 'utf8');

        // Including 'filename' allows ejs relative includes to work!
        return ejs.render(tmp, {
            data,
            filename
        });
    }

    return {
        renderHtmlTemplate,
        renderEmailTemplate,
    };
};