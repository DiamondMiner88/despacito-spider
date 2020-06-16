const config = require("../config.json");
const pfx = config.prefix;

module.exports = {
  command: "ping",
  category: "utils",
  help_name: `Ping`,
  help_description: `Gets my latency and API latency.`,

  async execute(client, message, args) {
    // Calculates ping between sending a message and editing it, giving a round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    let m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
  }
}
