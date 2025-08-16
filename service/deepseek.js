// Function to interact with Deepseek API
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

async function getDeepseekResponse(prompt, ds_api_key) {
  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions", // Make sure this is the latest endpoint
      {
        model: "deepseek-chat", // Check if your plan supports this model
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${ds_api_key}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("DeepSeek API Error:", err.response?.data || err.message);

    if (err.response?.status === 401) {
      throw new Error("Invalid or expired API key.");
    } else if (err.response?.status === 402) {
      throw new Error("Payment required or free credits exhausted.");
    } else if (err.response?.status === 404) {
      throw new Error("Invalid endpoint or model name.");
    } else {
      throw new Error("Unexpected error calling DeepSeek API.");
    }
  }
}

// Helper function to split long messages
function splitMessage(text, maxLength = 2000) {
  const chunks = [];
  for (let i = 0; i < text.length; i += maxLength) {
    chunks.push(text.substring(i, i + maxLength));
  }
  return chunks;
}

async function deepSeekAI(prefix, message, ds_api_key, client) {
  if (message.content.startsWith(prefix) || message.mentions.has(client.user)) {
    const query = message.content.replace(prefix, "").trim();

    try {
      await message.channel.sendTyping();

      const response = await getDeepseekResponse(query, ds_api_key);

      if (response.length > 2000) {
        const chunks = splitMessage(response);
        for (const chunk of chunks) {
          await message.reply(chunk);
        }
      } else {
        await message.reply(response);
      }
    } catch (error) {
      console.error("Error:", error.message);
      message.reply(`❌ ${error.message}`);
    }
  }
}

module.exports = {
    deepSeekAI
};