const express = require("express");
const cors = require("cors");
const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");
const { Configuration, OpenAIApi } = require("openai");
const app = express();

require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.open_ai_key,
});

const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(express.json());

const client = new Client();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});
const sendMessage = () => {
  client.on("message", async (message) => {
    if (message.body.startsWith("#")) {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message.body,
        temperature: 0,
        max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0,
      });
      console.log(message.body);
      if (response.status === 200) {
        message.reply(response.data.choices[0].text);
        console.log(response.data.choices[0].text);
      } else {
        console.log(response.data);
      }
    }
  });
};
sendMessage();

client.initialize();
