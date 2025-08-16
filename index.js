const express = require('express');
const cookieParser = require('cookie-parser');
const OpenAI = require("openai");
const {deepSeekAI} = require("./service/deepseek");

const {connectMongoDb} = require('./connect');

const {registerCammands,openAiResponse} = require('./command');

const app = express();

const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const PORT = 8000;

const dbURI = 'mongodb://127.0.0.1:27017/discord-bot'; 

connectMongoDb(dbURI).then(() => console.log('MongoDB connected successfully!')).catch(err => console.error('MongoDB connection error:', err));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use( express.json() );
app.use( express.urlencoded({extended: false}) );

/********** BOT Starts Here **********/

/*const client_id = ''; // Discord Client ID
const token = ''; // Discord Token
const openAIKey = '';*/

const client_id = '';
const token = '';
const openAIKey = '';
const ds_api_key = '';

const { Client, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });
client.on('messageCreate', (message) => {
    console.log(message.content);
    if(message.author.bot){
        return;
    }

    //openAiResponse(openAIKey,message);
    const prefix = '!deepseek';
    
    //deepSeekAI(prefix,message,ds_api_key);
});

client.on('interactionCreate', (interaction) => {
    console.log(interaction);

    if(interaction.commandName == 'ping'){
        interaction.reply('Pong!');
    }
});

if(token != ''){
    client.login(token);


    app.get('/',(req, res) => {
        const commands = [
        {
            name: 'ping',
            description: 'Replies with Pong!',
        },
        ];

        const result = registerCammands(client_id,token,commands);

        return res.json({'data': result});
    });
}
/********** BOT Ends Here **********/

app.listen(PORT,() => {
	console.log('Server Started');
});