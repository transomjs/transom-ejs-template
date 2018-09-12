'use strict';
const assert = require('assert');
const debug = require('debug')('transom:template');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

module.exports = function TransomEjsHandler(server, options) {
    options = options || {};
    // TODO: remove this check and warning
    if (options.templateData) {
        console.log("WARNING: TransomEjsHandler options.templateData should be replaced with options.data.", options.templateData);
        options.data = options.templateData;
    }

    function renderHtmlTemplate(templateName, renderData, htmlOptions) {
        assert(templateName, 'Template name is required.');
        htmlOptions = htmlOptions || {};
        // TODO: remove this check and warning
        if (htmlOptions.templateData) {
            console.log("WARNING: htmlOptions.templateData should be replaced with htmlOptions.data.", htmlOptions.templateData);
            htmlOptions.data = htmlOptions.templateData;
        }

        debug('Rendering HTML template', templateName);

        const template = server.registry.get('transom-config.definition.template', {});
        const opts = Object.assign({}, options, htmlOptions);
        const data = Object.assign({}, template.data, options.data, renderData);

        data.environment = (process.env.NODE_ENV || 'DEVELOPMENT').toUpperCase();
        data.templateName = templateName;

        // Navigate up out of the node_modules folder, to the root.
        const templatePrefix = (data.environment === 'TESTING' ? path.join('..', 'test') : path.join('..', '..', '..', '..'));
        const templatePath = opts.templatePath || template.htmlTemplatePath || 'templateHtml';
        const filename = path.join(__dirname, templatePrefix, templatePath, `${templateName}.ejs`);

        if (fs.existsSync(filename)) {
            debug('Loading HTML template', filename);
        } else {
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
        emailOptions = emailOptions || {};
        // TODO: remove this check and warning
        if (emailOptions.templateData) {
            console.log("WARNING: emailOptions.templateData should be replaced with emailOptions.data.", emailOptions.templateData);
            emailOptions.data = emailOptions.templateData;
        }
        debug('Rendering Email template', templateName);

        const template = server.registry.get('transom-config.definition.template', {});
        const opts = Object.assign({}, options, emailOptions);

        // TODO: remove this check and warning
        if (template.templateData) {
            console.log("WARNING: transom-config.definition.template.templateData should be replaced with transom-config.definition.template.data.");
            template.data = template.templateData;
        }
        const data = Object.assign({}, template.data, opts.data, renderData);

        data.environment = (process.env.NODE_ENV || 'DEVELOPMENT').toUpperCase();
        data.templateName = templateName;

        // Navigate up out of the node_modules folder, to the root.
        const templatePrefix = (data.environment === 'TESTING' ? path.join('..', 'test') : path.join('..', '..', '..', '..'));
        const templatePath = opts.templatePath || template.emailTemplatePath || 'templateEmail';
        const filename = path.join(__dirname, templatePrefix, templatePath, `${templateName}.ejs`);

        if (fs.existsSync(filename)) {
            debug('Loading Email template', filename);
        } else {
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