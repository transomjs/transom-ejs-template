# transom-ejs-template
Add simple EJS templating functions to your server-side Transomjs code.

[![Build Status](https://travis-ci.org/transomjs/transom-ejs-template.svg?branch=master)](https://travis-ci.org/transomjs/transom-ejs-template)
[![Coverage Status](https://coveralls.io/repos/github/transomjs/transom-ejs-template/badge.svg?branch=master)](https://coveralls.io/github/transomjs/transom-ejs-template?branch=master)

## Installation
```bash
$ npm install --save @transomjs/transom-ejs-template
```

## Usage
Transom-ejs-template is a simple module that provides a really simple way to send HTML (or text) formatted emails or even simple web pages.Using all the features of EJS, you can insert data into your templates or include other ejs templates etc.

After transom.initialize, an object is stored in the registry with 'transomTemplate' as the key. Each method will return a completely rendered template with all includes resoved and interpolated data.

### Render HTML templates
renderHtmlTemplate(templateName, data, htmlOptions)
* `templateName` is the filename as found in the templatePath, without the ".ejs" extension. 
* `data` is a JavaScript object containing anything that might be used within the template or it's nested child templates. Several attributes are added to `data` each time, the include:
    * environment is set to the process.env.NODE_ENV or 'DEVELOPMENT'
    * templateName is set to the filename of the current template
* `htmlOptions.templatePath` allows overriding the default path and loading a template from somewhere else;

### Render Email templates
renderEmailTemplate(templateName, data, emailOptions)
* `templateName` is the filename as found in the templatePath, without the ".ejs" extension. 
* `data` is a JavaScript object containing anything that might be used within the template or it's nested child templates. Several attributes are added to `data` each time, the include:
    * environment is set to the process.env.NODE_ENV or 'DEVELOPMENT'
    * templateName is set to the filename of the current template
* `emailOptions.templatePath` allows overriding the default path and loading a template from somewhere else;


