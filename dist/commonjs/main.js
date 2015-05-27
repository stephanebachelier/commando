/**
  @module Commando
  @version 0.8.0
  
  @author Stéphane Bachelier <stephane.bachelier@gmail.com>
  @license MIT
*/
"use strict";
var DefaultLauncher = require("commando/launcher/default")["default"];
var PromiseLauncher = require("commando/launcher/promise")["default"];
var Pool = require("./commando/pool")["default"];

// export API
exports.DefaultLauncher = DefaultLauncher;
exports.PromiseLauncher = PromiseLauncher;
exports.Pool = Pool;