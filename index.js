"use strict";
require('dotenv').config()
const { request } = require('express');
const express = require('express')
const app = express()
const whattsapp = require('./whattsapp');
const verify_token = process.env.VERIFY_TOKEN
const whattsapp_token = process.env.WHATTSAPP_TOKEN


app.use(express.json());

app.listen(process.env.PORT || 1500, () => console.log("webhook is listening listening"));


app.get('/', async(req,res)=>{
  res.send('welcome')
})



// Accepts POST requests at /webhook endpoint
app.post("/webhook", async (req, res) => {
  // Parse the request body from the POST
  let body = req.body;
  if(req === null || req === undefined || !req){
    res.status(404)
    res.end()
    return
  }

  // Check the Incoming webhook message
  // console.log(JSON.stringify(req.body, null, 2));

  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let msg_body;
      if (req.body.entry[0].changes[0].value.messages[0].type === "button") {
        msg_body = req.body.entry[0].changes[0].value.messages[0].button.text;
      } else {
        msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
      }
      console.log(msg_body);

      let sender_name =
        req.body.entry[0].changes[0].value.contacts[0].profile.name;

      var dataToSend = JSON.stringify({ from, sender_name, whattsapp_token });

      

      if(msg_body.startsWith("amazon") || msg_body.startsWith("flipkart")) {
        let {amazonPrice, flipkartPrice } = await import('./Scrapper.js');
        let url;
        let price;
        if(msg_body.includes("amazon")){
          let str = msg_body.split("amazon-");
          url = str[1];
          price = await amazonPrice(url)
        }
        else if(msg_body.includes("flipkart")){
          let str = msg_body.split("flipkart-");
          url = str[1];
          price = await flipkartPrice(url)
        }
        
        console.log(price)
        

        try {
          await whattsapp.sendProductDetails(from,sender_name,whattsapp_token, price)
        } 
        catch (err) {
          console.log('sorry something wrong happened with electron')
        }

        
      }
      else if(msg_body.includes('running_status')){
        let {runningStatus} = await import('./Scrapper.js');
        let train = msg_body.split("running_status-")[1]
        if(train.length === 5){
          let urlString = 'https://www.trainman.in/running-status/'
          urlString += train;
          console.log(urlString)
          let runningDetails = await runningStatus(urlString)

          console.log(runningDetails)

          if(("train_name" in runningDetails)){
            console.log('running status will be send')

            try {
              await whattsapp.sendRunningStatus(from,sender_name,whattsapp_token, runningDetails);
            } 
            catch (err) {
              console.log('sorry something wrong happened with electron')
            }
            return await res.sendStatus(200);

          }
          else{
            try {
              await whattsapp.sendTrainNotFound(from,sender_name,whattsapp_token, train)
              
            } catch (err) {
              
            }
            return await res.sendStatus(200);
            
          }

          return await res.sendStatus(200);

          



        }
        else{
          try {
            await whattsapp.sendDemo(from,sender_name,whattsapp_token)
            return res.sendStatus(200);
          } 
          catch{

          }

        }

      } // this else will run when msg_body === "test" or anything else
      else {
        try {
          await whattsapp.sendDemo(from,sender_name,whattsapp_token)
        } catch (err) {
          
        }
      } 
    }
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/
  

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});









