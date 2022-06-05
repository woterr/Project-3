const index = require("./index"),
  client = index.client;
const { MessageEmbed } = require("discord.js");
const https = require("https");
const fetch = require("node-fetch");
require("dotenv").config();

let url = "https://queue-times.com/en-US/parks/61/queue_times.json";
// let url = "https://queue-times.com/en-US/parks/99/queue_times.json";

function sendMessage(channel, sentMessage) {
  fetch(url)
    .then((res) => res.json())
    .then((out) => {
      const embed = new MessageEmbed()
        .setColor("#2f3136")
        .setDescription(`_ _`)
        .setTitle("**Knott's Berry Farm**")
        .setTimestamp();

      // add fields
      const is_openArray = [];
      out.lands.forEach((land) => {
        land.rides.forEach((ride) => {
          is_openArray.push(ride.is_open);
          // console.log(ride);
          // embed.addField(`\u200B`);
          embed.setDescription(
            `${embed.description}\n${ride.is_open ? "🟢" : "🔴"}\`${
              ride.wait_time
            }m \` - ${ride.name}`
          );
        });
      });

      // if all parks are closed
      if (is_openArray.every((element) => element === false)) {
        channel.messages.fetch({ limit: 1 }).then((messages) => {
          let lastMessage = messages.first();

          if (
            lastMessage.content === "Goodnight! 💤" &&
            lastMessage.author.id === process.env.clientID
          ) {
            return;
          } else {
            console.log("All parks closed");
            const embed_goodnight = new MessageEmbed()
              .setColor("#2f3136")
              .setTitle("Parks are now closed.")
              .setImage(
                "https://steamuserimages-a.akamaihd.net/ugc/961968482271550511/457ECCC3FDDF845EAE2485B56E95FE7EB5EC84BA/"
              );
            channel.send({
              embeds: [embed_goodnight],
              content: "Goodnight! 💤",
            });
            return;
          }
        });
      } else {
        // good morning message if previous message was goodnight
        channel.messages.fetch({ limit: 1 }).then((messages) => {
          let lastMessage = messages.first();
          if (
            lastMessage.content === "Goodnight! 💤" &&
            lastMessage.author.bot
          ) {
            console.log("good morning");
            const embed_goodmorning = new MessageEmbed()
              .setColor("#2f3136")
              .setTitle("Parks are now open.")
              .setImage(
                "https://attractionsmagazine.com/wp-content/uploads/2019/01/Disneyland-Castle-620x414.jpg"
              );
            channel.send({
              embeds: [embed_goodmorning],
              content: "Good morning! 🌅",
            });
          }
        });

        // check if previous message is the same as the current message
        channel.messages.fetch({ limit: 1 }).then((messages) => {
          let lastMessage = messages.first();

          if (lastMessage?.embeds[0]?.description !== embed.description) {
            // send embed
            channel.send({
              embeds: [embed],
            });
          }
        });
      }

      return out;
    })
    .catch((err) => {
      console.log("Something went wrong: ", err);
    });
}

module.exports = { sendMessage };
