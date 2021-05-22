const { Telegraf } = require('telegraf');
const axios = require('axios')
bot_key = 'TELEGRAM BOT API KEY'
const bot = new Telegraf(bot_key);

// Start Command 
bot.start((ctx) => {
    ctx.reply(`Hey ${ctx.chat.first_name} 👋 `);
})



// Covid Command 
bot.command('covid', (ctx) => {
    getStates()

    .then((stateNames) => {
        

        ctx.telegram.sendMessage(ctx.chat.id,'Choose State',
        {    
            reply_markup: {
                inline_keyboard	: stateNames.map((item, index) => ([
                    {
                        text: item,
                        callback_data: String(index),
                    },
                    {
                        text: item+1,
                        callback_data: String(index), 
                    }
                ])), 
            }
        })  
    })
})

// Go Back Button 
bot.action('go_back', (ctx) => {
    ctx.deleteMessage();

    ctx.telegram.sendMessage(ctx.chat.id,'<b>COVID</b> Stats Incomming...',
    {   
        parse_mode: 'HTML', 

        reply_markup: {
            inline_keyboard	: [
                [{text: "Delhi", callback_data: "DL"}, {text: 'Maharashtra', callback_data: "MH"}],
                [{text: "Madhya Pradesh", callback_data: "MP"}]
            ]
        }
    })
})

async function getdata(stateCode){
    url = 'https://api.covid19india.org/data.json'
    let res = await axios.get(url)
    
    stateArr = res.data.statewise;
    stateData = stateArr.filter( (e)=> {
        return e.statecode == stateCode
    })
    cases = stateData[0];
    result = `
👉Cases in: ${cases.state}

☑️Confrmed Cases: ${cases.confirmed}
✅Active Cases: ${cases.active}
🩹Recovered Cases: ${cases.recovered}
🙏Death Cases: ${cases.deaths}
    `
    console.log(result);
    return result;
}

async function getStates(){
    url = 'https://api.covid19india.org/data.json'
    res = await axios.get(url)

    stateArr = res.data.statewise;
    totalStates = stateArr.length;

    let stateName = new Array();

    for (let i = 0; i < totalStates; i++) {
        stateName[i] = stateArr[i].state;
    }
    
    // console.log(stateName);

    return stateName;
}



bot.launch()