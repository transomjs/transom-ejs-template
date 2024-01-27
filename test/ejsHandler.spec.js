"use strict";
// const expect = require('chai').expect;
// const sinon = require('sinon');
const EjsHandler = require('../lib/ejsHandler');
const templateSample = require('./ejsHandler.sample');
// const ejs = require('ejs');
// const fs = require('fs');
// const path = require('path');
const PocketRegistry = require('pocket-registry');

describe('EjsHandler', function () {

    const server = {};
    let expect;

    before(function () {
        server.registry = new PocketRegistry();
        server.registry.set('transom-config.definition.template', templateSample);

        // Use a dynamic import for the chai ES module!
        return import("chai").then((chai) => (expect = chai.expect));
    });

    it('should have two functions', function () {
        const ejsHandler = new EjsHandler();
        expect(ejsHandler).to.be.an.instanceOf(Object);
        expect(ejsHandler.renderHtmlTemplate).to.be.an.instanceOf(Function);
        expect(ejsHandler.renderEmailTemplate).to.be.an.instanceOf(Function);
        expect(Object.keys(ejsHandler)).to.have.length(2);
    });

    describe('renderHtmlTemplate', function () {
        it('should return HTML template contents, template folder as render option', function () {
            const options = {};
            const ejsHandler = new EjsHandler(server, options);
            const renderData = {
                foo: 123,
                bar: 456.789,
                barNull: null,
                barUndefined: undefined,
                baz: "Rickard's Red"
            };
            const renderOptions = {
                templatePath: 'html'
            };
            const page = ejsHandler.renderHtmlTemplate("myPageTemplate", renderData, renderOptions);
            expect(page).to.equal(`Hello
foo=123
bar=456.789
barNull=
barUndefined=
baz=Rickard&#39;s Red
foo=123
environment=TESTING
templateName=myPageTemplate
there.
\n`);
        });

        it('should return simple HTML template, template folder as handler option', function () {
            const options = {
                templatePath: 'html'
            };
            const ejsHandler = new EjsHandler(server, options);
            const renderData = {
                name: "Sally"
            };
            const renderOptions = {};
            const page = ejsHandler.renderHtmlTemplate("simple", renderData, renderOptions);
            expect(page).to.equal(`Hello Sally!\n`);
        });

        it('should return simple HTML template, template folder as server option', function () {
            const options = {};
            server.registry.remove('transom-config.definition.template.htmlTemplatePath');
            server.registry.set('transom-config.definition.template.htmlTemplatePath', 'html');

            const ejsHandler = new EjsHandler(server, options);
            const renderData = {
                name: "Benny"
            };
            const renderOptions = {};
            const page = ejsHandler.renderHtmlTemplate("simple", renderData, renderOptions);
            expect(page).to.equal(`Hello Benny!\n`);
        });

        it('should throw and error if the HTML template file not found', function () {
            const options = {};
            const ejsHandler = new EjsHandler(server, options);
            const renderData = {};
            const renderOptions = {};
            expect(ejsHandler.renderHtmlTemplate.bind(ejsHandler, "not-exist", renderData, renderOptions)).to.throw(Error);
        });
    });

    describe('renderEmailTemplate', function () {
        it('should return Email template contents, template folder as render option', function () {
            const options = {};
            const ejsHandler = new EjsHandler(server, options);
            const renderData = {
                foo: 987,
                bar: 345.543,
                barNull: null,
                barUndefined: undefined,
                baz: "Labbat's Blue"
            };
            const renderOptions = {
                templatePath: 'html'
            };
            const page = ejsHandler.renderEmailTemplate("myPageTemplate", renderData, renderOptions);
            expect(page).to.equal(`Hello
foo=987
bar=345.543
barNull=
barUndefined=
baz=Labbat&#39;s Blue
foo=987
environment=TESTING
templateName=myPageTemplate
there.
\n`);
        });

        it('should return simple Email template, template folder as handler option', function () {
            const options = {
                templatePath: 'html'
            };
            const ejsHandler = new EjsHandler(server, options);
            const renderData = {
                name: "Sandy"
            };
            const renderOptions = {};
            const page = ejsHandler.renderEmailTemplate("simple", renderData, renderOptions);
            expect(page).to.equal(`Hello Sandy!\n`);
        });

        it('should return simple Email template, template folder as server option', function () {
            const options = {};
            server.registry.remove('transom-config.definition.template.emailTemplatePath');
            server.registry.set('transom-config.definition.template.emailTemplatePath', 'html');

            const ejsHandler = new EjsHandler(server, options);
            const renderData = {
                name: "Bunny"
            };
            const renderOptions = {};
            const page = ejsHandler.renderHtmlTemplate("simple", renderData, renderOptions);
            expect(page).to.equal(`Hello Bunny!\n`);
        });

        it('should throw and error if the Email template file not found', function () {
            const options = {};
            const ejsHandler = new EjsHandler(server, options);
            const renderData = {};
            const renderOptions = {};
            expect(ejsHandler.renderEmailTemplate.bind(ejsHandler, "not-exist", renderData, renderOptions)).to.throw(Error);
        });
    });
    
});