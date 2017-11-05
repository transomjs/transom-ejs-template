'use strict';
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

module.exports = function TransomEjsHandler(server, options) {

    function renderHtmlTemplate(templateName, data, htmlOptions) {
        assert(templateName, 'Template name is required.');
        const opts = Object.assign({}, options, htmlOptions);
        data = data || {};

        data.environment = (process.env.NODE_ENV || 'DEVELOPMENT').toUpperCase();
        data.envMessage = (data.environment === 'PRODUCTION' ? '' : `This page is in ${data.environment}.`);
        data.hostname = data.hostname || '/';
        data.pageTitle = data.pageTitle || templateName;

        const template = server.registry.get('transom-options.api_definition.template', {});
        const templatePath = path.join('..', '..', opts.path || template.htmlTemplatePath || 'templateHtml');
        const filename = path.join(__dirname, templatePath, `${templateName}.ejs`);

        if (!fs.existsSync(filename)) {
            throw new Error(`Page template not found: ${filename}`);
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
        const opts = Object.assign({}, options, emailOptions);
        data = data || {};

        data.environment = (process.env.NODE_ENV || 'DEVELOPMENT').toUpperCase();
        data.envMessage = (data.environment === 'PRODUCTION' ? '' : `Message sent from ${data.environment}.`);
        data.hostname = data.hostname || '/';

        const template = server.registry.get('transom-options.api_definition.template', {});
        const templatePath = path.join('..', '..', opts.path || template.emailTemplatePath || 'templateEmail');
        const filename = path.join(__dirname, templatePath, `${templateName}.ejs`);
        
        if (!fs.existsSync(filename)) {
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