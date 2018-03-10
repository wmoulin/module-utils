#!/usr/bin/env node
"use strict";

const commander = require("commander"); // Gestionnaire de ligne de commandes
const Module = require("./module");

commander
  .version(require("../package.json").version)
  .usage("[options] <command ...>")
  .option("-l --list", "list modules")
  .option("-a --arbo", "show modules arbo")
  .option("-d --dir <directory>", "project directory", process.cwd())
  .parse(process.argv);

if(commander.list) {
  let modules = Module.getList(commander.dir);
  console.log(JSON.stringify(Object.keys(modules).sort(), null, "  |-" ).replace(/[\{\}\":]*/g, "").replace(/  /g, "").replace(/\,/g, "").replace(/\[/g, "").replace(/\]/g, "").replace(/ /g, "").replace(/\|\-\n/g, ""));
  console.log("total :",Object.keys(modules).length);
}

if(commander.arbo) {
  console.log(JSON.stringify(Module.getArborescence(commander.dir), null, "  |-" ).replace(/[\{\}\":]*/g, "").replace(/  /g, "").replace(/\,/g, "").replace(/ /g, "").replace(/\|\-\n/g, ""));
}

