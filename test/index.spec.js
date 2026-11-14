"use strict";
const path = require('path');
const PocketRegistry = require('pocket-registry');
const transomTemplate = require('../');
const EjsHandler = require('../lib/ejsHandler');

describe('TransomEjsTemplate plugin', function () {
    let expect;

    before(function () {
        // Use a dynamic import for the chai ES module!
        return import("chai").then((chai) => (expect = chai.expect));
    });

    function newServer() {
        const registry = new PocketRegistry();
        registry.set('transom-config.definition.template', {});
        return { registry };
    }

    it('is a single plugin instance', function () {
        expect(transomTemplate.constructor.name).to.equal('TransomEjsTemplate');
        expect(Object.keys(transomTemplate)).to.deep.equal(['initialize']);
    });

    it('registers a renderer as "transomTemplate" by default', function () {
        const server = newServer();
        transomTemplate.initialize(server, {});
        const renderer = server.registry.get('transomTemplate');
        expect(renderer.renderHtmlTemplate).to.be.a('function');
        expect(renderer.renderEmailTemplate).to.be.a('function');
    });

    it('registers under a custom registryKey and passes its options to the renderer', function () {
        const server = newServer();
        transomTemplate.initialize(server, { registryKey: 'pages', templatePath: 'html' });
        const html = server.registry.get('pages').renderHtmlTemplate('simple', {});
        expect(html).to.be.a('string');
        expect(server.registry.has('transomTemplate')).to.equal(false);
    });
});

describe('EjsHandler template locations and defaults', function () {
    let expect;
    let savedEnv;
    // The package lives at <app>/node_modules/@transomjs/transom-ejs-template when installed.
    const packageRoot = path.join(__dirname, '..');
    const appRoot = path.join(packageRoot, '..', '..', '..');

    before(function () {
        return import("chai").then((chai) => (expect = chai.expect));
    });

    beforeEach(function () {
        savedEnv = process.env.NODE_ENV;
    });

    afterEach(function () {
        if (savedEnv === undefined) {
            delete process.env.NODE_ENV;
        } else {
            process.env.NODE_ENV = savedEnv;
        }
    });

    function handler(options) {
        const registry = new PocketRegistry();
        registry.set('transom-config.definition.template', {});
        return new EjsHandler({ registry }, options);
    }

    function thrownMessage(fn) {
        try {
            fn();
        } catch (err) {
            return err.message;
        }
        return null;
    }

    it('reads templates from the application root outside of testing', function () {
        process.env.NODE_ENV = 'production';
        const renderer = handler();
        expect(thrownMessage(() => renderer.renderHtmlTemplate('page')))
            .to.equal(`HTML template not found: ${path.join(appRoot, 'templateHtml', 'page.ejs')}`);
        expect(thrownMessage(() => renderer.renderEmailTemplate('welcome')))
            .to.equal(`Email template not found: ${path.join(appRoot, 'templateEmail', 'welcome.ejs')}`);
    });

    it('treats an unset NODE_ENV as DEVELOPMENT, which also reads from the application root', function () {
        delete process.env.NODE_ENV;
        expect(thrownMessage(() => handler({}).renderHtmlTemplate('page')))
            .to.equal(`HTML template not found: ${path.join(appRoot, 'templateHtml', 'page.ejs')}`);
        expect(thrownMessage(() => handler({}).renderEmailTemplate('welcome')))
            .to.equal(`Email template not found: ${path.join(appRoot, 'templateEmail', 'welcome.ejs')}`);
    });

    it('defaults the email folder to templateEmail and works without per-call options', function () {
        expect(thrownMessage(() => handler().renderEmailTemplate('welcome')))
            .to.equal(`Email template not found: ${path.join(packageRoot, 'test', 'templateEmail', 'welcome.ejs')}`);
    });

    it('renders the data it is given', function () {
        const html = handler({ templatePath: 'html' }).renderHtmlTemplate('simple', { name: 'Jo' });
        expect(html.trim()).to.equal('Hello Jo!');
    });
});
