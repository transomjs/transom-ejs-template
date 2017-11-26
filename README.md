# transom-ejs-template
Add simple EJS templating functions to your server-side Transomjs code.

[![Build Status](https://travis-ci.org/transomjs/transom-smtp.svg?branch=master)](https://travis-ci.org/transomjs/transom-ejs-template)


## Installation
```bash
$ npm install --save transom-ejs-template
```

## Usage
Transom-ejs-template is a simple module that provides a really simple way to send HTML (or text) formatted emails or even simple web pages.Using all the features of EJS, you can insert data into your templates or include other ejs templates etc.

### Render HTML templates
renderHtmlTemplate(templateName, data, htmlOptions)
* `templateName` is the filename as found in the templatePath, without the ".ejs" extension. 
* `data` is a JavaScript object containing anything that might be used within the template or it's nested child templates. Several attributes are added to `data` each time, the include:
 * environment is set to the process.env.NODE_ENV or 'DEVELOPMENT'
 * envMessage is set empty when the `environment` equals 'PRODUCTION', otherwise it contains: `This page is in ${data.environment}.`
 * hostname is pulled from the request. If not found, it contains '/';
 * pageTitle is set to the templateName if it's not provided by the caller;
* `htmlOptions.templatePath` allows overriding the default path and loading a template from somewhere else;

### Render Email templates
renderEmailTemplate(templateName, data, htmlOptions)

 Each method takes 3 arguments as follows:
 (templateName, data, emailOptions)

...Work in progress
