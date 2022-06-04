const { Client, Intents } = require("discord.js");
const express = require("express");
const { sendMessage } = require("./functions.js");
const app = express();

app.get("/", (request, response) => {
  response.send("Get a job");
});

require("dotenv").config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

let channel;
client.once("ready", () => {
  console.log("Bot is ready!");
  channel = client.channels.cache.get(process.env.channelID);
});

setInterval(() => {
  sendMessage(channel);
}, 300000); // 300000

client.login(process.env.token);
module.exports.client = client;
