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

## Features

- Global log access
- Control log format/date format globally
- Colors (std transport detects possible colors)
- Logs devided into uids (module name, section, whatever you want)
- 4 types of logging: info, warn, error, debug
- Ability to silence a specific log uid
- Multiple transports (bundled: std, file, mysql)
- Each transport has it's own options and can be added multiple times (logging to 2 files)
- Each transport has a set of tools
- Filter certain uids for a specific transport (log a specific set of modules to a specific file, only error messages)

## Documentation

No time right now to do it. Check examples, I usually do an example for each feature I develop. Anything you want
to ask, put it in an issue.
