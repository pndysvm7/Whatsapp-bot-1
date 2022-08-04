const axios = require('axios');
require('dotenv').config()
const numberid = process.env.numberid 



let amazonPriceMessage = `1. To know the price of an amazon product, please send message like \namazon-{link} \nfor example \namazon-https://amzn.eu/d/aAownso`;
let flipkartPriceMessage = `2. To know the price of an flipkart product, please send message like \nflipkart-{link} \nfor example \nflipkart-https://www.flipkart.com/redmi-note-10-pro-max-vintage-bronze-64-gb/p/itm73eefe577a805?pid=MOBGFDFXHMYBW2WX&lid=LSTMOBGFDFXHMYBW2WXYDP71J&marketplace=FLIPKART&q=redmi+note+9+pro+max`;
let runningTrainMessage = `3. To know the status of a running train, please send message like \nrunning_status-{train-number} \nfor example \nrunning_status-16229`;





const sendDemo = async(to,user,whattsapp_token) =>{
    const response = await axios.post(
        `https://graph.facebook.com/v13.0/${numberid}/messages`,
        // '{ "messaging_product": "whatsapp", "to": "919170318990", "type": "template", "template": { "name": "hello_world", "language": { "code": "en_US" } } }',
        // {
        //     'messaging_product': 'whatsapp',
        //     'to': to,
        //     "recipient_type": "individual",
        //     "type":"template",
        //     'template': {
        //         "name":"automatic_msg",
        //         "language": {
        //                 "code": "en_US",
        //          },
        //          'components':[
        //                 {
        //                     "type": "body",
        //                     "parameters": [
        //                         {
        //                             "type": "text",
        //                             "text": `${user}`
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "type": "button",
        //                     "sub_type": "quick_reply",
        //                     "index": 0,
        //                     "parameters": [
        //                         {
        //                             "type": "text",
        //                             "text": "1"
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "type": "button",
        //                     "sub_type": "quick_reply",
        //                     "index": 1,
        //                     "parameters": [
        //                         {
        //                             "type": "text",
        //                             "text": "2"
        //                         }
        //                     ]
        //                 }

        //          ]

        //     }

            
        // },
        {
            'messaging_product': 'whatsapp',
            'to': to,
            "recipient_type": "individual",
            "type": "text",
            "text": {
                "body": `*Hello ${user}* \n\n Please send following messages to get details according to your needs.\n\n${amazonPriceMessage}\n\n${flipkartPriceMessage}\n\n${runningTrainMessage} `
            }

            
        },
        {
            headers: {
                'Authorization': `Bearer ${whattsapp_token}`,
                'Content-Type': 'application/json'
            }
        }
    );

    return response;

}




const sendProductDetails= async(to,user, whattsapp_token,price) => {

    const response = await axios.post(
        `https://graph.facebook.com/v13.0/${numberid}/messages`,
        {
            'messaging_product': 'whatsapp',
            'to': to,
            "recipient_type": "individual",
            "type": "text",
            "text": {
                "body": `Name: ${price.title} \n\nPrice:${price.price}`
            }   
        },
        {
            headers: {
                'Authorization': `Bearer ${whattsapp_token}`,
                'Content-Type': 'application/json'
            }
        }
    );

}

const sendRunningStatus= async(to,user, whattsapp_token, runningDetails) => {

    const response = await axios.post(
        `https://graph.facebook.com/v13.0/${numberid}/messages`,
        {
            'messaging_product': 'whatsapp',
            'to': to,
            "recipient_type": "individual",
            "type": "text",
            "text": {
                "body": `Name: ${runningDetails.train_name} \nPrev-Station:${runningDetails.prev_station_name} \nNext-Station:${runningDetails.next_station_name} \nUpdated-Arrival:${runningDetails.updated_arrival} \nUpdated-Departure:${runningDetails.updated_departure} \nDelay:${runningDetails.delay}`
            }  
        },
        {
            headers: {
                'Authorization': `Bearer ${whattsapp_token}`,
                'Content-Type': 'application/json'
            }
        }
    );

}

const sendTrainNotFound = async(to,user,whattsapp_token, train) => {
    const response = await axios.post(
        `https://graph.facebook.com/v13.0/${numberid}/messages`,
        {
            'messaging_product': 'whatsapp',
            'to': to,
            "recipient_type": "individual",
            "type": "text",
            "text": {
                "body": `Dear ${user}, Your train ${train} may not be running today`
            }   
        },
        {
            headers: {
                'Authorization': `Bearer ${whattsapp_token}`,
                'Content-Type': 'application/json'
            }
        }
    );

}




module.exports.sendDemo = sendDemo;
module.exports.sendProductDetails = sendProductDetails
module.exports.sendRunningStatus = sendRunningStatus
module.exports.sendTrainNotFound = sendTrainNotFound;

