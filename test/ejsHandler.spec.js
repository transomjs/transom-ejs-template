"use strict";
const expect = require('chai').expect;
const sinon = require('sinon');
const EjsHandler = require('../lib/ejsHandler');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

describe('EjsHandler', function () {

    beforeEach(function () {
        // Stub out a mock
        // sinon.stub(ejs, 'render').callsFake(function (template, data) {
        //     return "dummy";
        // });
    });

    afterEach(function () {
        // restore original
        // ejs.render.restore();
    });
    
    it('should implement some tests!', function () {
        expect(true).to.be.true;
    });

});