Houston ![ Travis CI ](https://secure.travis-ci.org/dresende/node-houston.png)
=======

## About

Houston is a logging framework designed to be used by several modules. Every module
grabs an instance of the logging with a unique or shared id and write different types
of log items. You can globally manage transports, silence logging types or an entire
logging id.

## Installing

Install using NPM:

    npm install houston

## Usage

    var log = require("houston")("my-module");
    
    log.info("Hello world");
