const { REST, Routes } = require('discord.js');
const OpenAI = require("openai");

async function registerCammands(client_id, token,commands){

    //return async (req, res) => {
        const rest = new REST({ version: '10' }).setToken(token);
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(Routes.applicationCommands(client_id), { body: commands });

            console.log('Successfully reloaded application (/) commands.');
            
            return 'Worked';

        } catch (error) {
            console.error(error);

            return 'Something Goes Wrong: ' + error;
        }
    //}
    
}

async function openAiResponse(openAiApiKey='', message){
    if(openAiApiKey == ''){
        console.log('UnAuthorized Access: Key is Required.');
    }

    const openai = new OpenAI({
        apiKey: openAiApiKey,
    });

    // Trigger only when message starts with !ask
    if (message.content.startsWith("!ask")) {
        const prompt = message.content.replace("!ask", "").trim();

        if (!prompt) {
            message.reply("❌ Please provide a question after `!ask`.");
            return;
        }

        try {
            // ChatGPT API call
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini", // lightweight & fast
                messages: [{ role: "user", content: prompt }],
            });

            const reply = response.choices[0].message.content;

            // Send back to Discord
            message.reply(reply);
        } catch (err) {
            console.error("OpenAI Error:", err);
            message.reply("⚠️ Something went wrong while contacting ChatGPT.");
        }
    }else{
        message.reply({
            content: 'Hi From Bot!'
        });
    }
}

module.exports = {
	registerCammands,
    openAiResponse
};
