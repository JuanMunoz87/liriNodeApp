// Require npm to link the keys
require("dotenv").config();

// Variables
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require("moment")
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var inquirer = require("inquirer");

