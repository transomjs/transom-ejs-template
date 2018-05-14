'use strict';
const assert = require('assert');
const debug = require('debug')('transom:template');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

module.exports = function TransomEjsHandler(server, options) {

    function renderHtmlTemplate(templateName, renderData, htmlOptions) {
        assert(templateName, 'Template name is required.');
        debug('Rendering HTML template', templateName);

        const template = server.registry.get('transom-config.definition.template', {});
        const opts = Object.assign({}, options, htmlOptions);
        const data = Object.assign({}, template.templateData, options.templateData, renderData);

        data.environment = (process.env.NODE_ENV || 'DEVELOPMENT').toUpperCase();
        data.templateName = templateName;

        // Navigate up out of the node_modules folder, to the root.
        const templatePrefix = (data.environment === 'TESTING' ? path.join('..', 'test') : path.join('..', '..', '..', '..'));
        const templatePath = opts.templatePath || template.htmlTemplatePath || 'templateHtml';
        const filename = path.join(__dirname, templatePrefix, templatePath, `${templateName}.ejs`);

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

    function renderEmailTemplate(templateName, renderData, emailOptions) {
        assert(templateName, 'Template name is required.');
        debug('Rendering Email template', templateName);

        const template = server.registry.get('transom-config.definition.template', {});
        const opts = Object.assign({}, options, emailOptions);
        const data = Object.assign({}, template.templateData, options.templateData, renderData);

        data.environment = (process.env.NODE_ENV || 'DEVELOPMENT').toUpperCase();
        data.templateName = templateName;

        // Navigate up out of the node_modules folder, to the root.
        const templatePrefix = (data.environment === 'TESTING' ? path.join('..', 'test') : path.join('..', '..', '..', '..'));
        const templatePath = opts.templatePath || template.emailTemplatePath || 'templateEmail';
        const filename = path.join(__dirname, templatePrefix, templatePath, `${templateName}.ejs`);

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