# transom-ejs-template
Add simple EJS templating functions to your server-side Transomjs code.

[![Build Status](https://travis-ci.org/transomjs/transom-ejs-template.svg?branch=master)](https://travis-ci.org/transomjs/transom-ejs-template)
[![Coverage Status](https://coveralls.io/repos/github/transomjs/transom-ejs-template/badge.svg?branch=master)](https://coveralls.io/github/transomjs/transom-ejs-template?branch=master)

## Installation
```bash
$ npm install --save @transomjs/transom-ejs-template
```

## Usage
Transom-ejs-template is a module that provides a really simple way to send HTML (or text) formatted emails or render simple web pages. Using all the features of [EJS](https://www.npmjs.com/package/ejs), you can insert data into your templates or include other ejs templates using a relative path.

After transom.initialize, an object is stored in the registry with 'transomTemplate' as the key. Each of the following methods will return a completely rendered template with all includes resolved and interpolated data.

```
    server.get('/about', function (req, res, next) {
        // Fetch the configured Template module from the Registry.
        const template = server.registry.get('transomTemplate');

        // Some simple data for insertion into the template.
        const data = {
            title: "My Dawg Walker App",
            date: new Date(),
            year: new Date().getFullYear()
        };
        const content = template.renderHtmlTemplate('about', data);

        // Tell the browser what type of content we're sending.
        res.setHeader('content-type', 'text/html');
        res.end(content);
        next(false);
    });
```

### Render HTML templates
renderHtmlTemplate(templateName, data, htmlOptions)
* `templateName` is the filename as found in the templatePath, without the ".ejs" extension. 
* `data` is a JavaScript object containing anything that might be used within the template or it's nested child templates. Several attributes are added to `data` each time, the include:
    * environment is set to the process.env.NODE_ENV or 'DEVELOPMENT'
    * [deprecated] envMessage is set empty when the `environment` equals 'PRODUCTION', otherwise it contains: `This page is in ${data.environment}.`
    * [deprecated] hostname is pulled from the request. If not found, it contains '/';
    * [deprecated] pageTitle is set to the templateName if it's not provided by the caller;
* `htmlOptions.templatePath` allows overriding the default path and loading a template from somewhere else;

### Render Email templates
renderEmailTemplate(templateName, data, emailOptions)
* `templateName` is the filename as found in the templatePath, without the ".ejs" extension. 
* `data` is a JavaScript object containing anything that might be used within the template or it's nested child templates. Several attributes are added to `data` each time, they include:
    * environment is set to the process.env.NODE_ENV or 'DEVELOPMENT'
    * templateName is set to the filename of the current template
* `emailOptions.templatePath` allows overriding the default path and loading a template from somewhere else.

## Testing
When running tests and looking for templates, set the `process.env.NODE_ENV` to `TESTING` to locate templates in the `../test` folder.

## Updating from 1.x.x
EJS templating for `includes` has changed between transom-ejs 1.x.x and 2.0.0.

In the version 1 release, we were able to include EJS templates with the following syntax.
```javascript
<% include user/show %>
```
The correct syntax should be:
```javascript
<%- include('user/show') %>
```

## Need Support?
TransomJS is developed and maintained by [BinaryOps Software Inc.](https://binaryops.ca) in Canada.
