var houston = require("../lib/houston"),
    simplelog = houston("simple"),
    otherlog = houston("other"),
    anotherlog = houston("another"),
    std = new houston.transports.std();

houston.transports.clear().add(std);

std.filter("simple", "another"); // 'other' log will not show

simplelog.info("This will go to simple log");
otherlog.info("This will go to other log");
anotherlog.info("This will go to another log");

std.filter(false); // clear filters

otherlog.warn("Check source code to know what is missing..");

std.filter(true); // filter all

otherlog.error("This will never show up..");