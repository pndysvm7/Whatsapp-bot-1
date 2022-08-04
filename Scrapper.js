const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


const mac = 'https://www.amazon.in/dp/B08N5T6CZ6?ref_=cm_sw_r_cp_ud_dp_PH2FQGQJZZSJ1VGB17BT'
const redmi = 'https://www.amazon.in/Redmi-Activ-Coral-Green-Storage/dp/B09GFLFMPS/ref=lp_1389401031_1_9?th=1';
const maca = 'https://www.amazon.in/dp/B08N5Y1YG7?ref_=cm_sw_r_cp_ud_dp_08TE50VBFZEHG95Y1S6E'


const amazonPrice = async (url) => {
    
    try{
        const html = await axios.get(url, {
            headers: {
                Accept: "application/json",
                "User-Agent": "axios 0.27.2"
              }
        });
  
    const dom = new JSDOM(html.data);
    let available = await dom.window.document.querySelector('#availability > span:nth-child(4) > span');
    const title = await dom.window.document.querySelector('#productTitle');
    const priceTotal = await dom.window.document.querySelector('#tp_price_block_total_price_ww');
  
    if(title && title.textContent && available !== null && available.textContent && available.textContent.includes('Currently unavailable')){
        return {
            title: title.textContent,
            price: 'out of stock',
        }
    }
    else if(priceTotal && priceTotal.textContent){
        
        let price = priceTotal.textContent.split('.')[0]
        if(price !== null && title && title.textContent ){
        
            return {
                title: title.textContent,
                price: price,
            }
          }
          else{
            return {
                title: 'can not get',
                price: 'can not fetch, check url once or some internal server error',
            }
            
        
          }
    }
    else{
        return {
            title: 'can not get',
            price: 'can not fetch, check url once or some internal server error',
        }

    }
  

    }
    catch(err){
        console.log('axios can not fetch the url, if you want to know more about this err log err here')
        console.log(err)
        return{
            title: 'can not get',
            price: 'server error'
        }
    }
    
    
 
};

  
const flipkartPrice = async (url) => {

    try{
        const html = await axios.get(url, {
            headers: {
                Accept: "application/json",
                "User-Agent": "axios 0.21.1"
              }
        });
    const dom = new JSDOM(html.data);

    const str = html.data.toString();
    const productName = await dom.window.document.querySelector('.yhB1nd')
    const priceTotal = await dom.window.document.querySelector('._30jeq3._16Jk6d');
    

    if(str.includes('Sold Out') && str.includes('NOTIFY ME')){
        return {
            title: productName.textContent,
            price: 'out of stock'
        }
    }
    else{
        return {
            title: productName.textContent,
            price: priceTotal.textContent
        }

    }

    }
    catch(err){
        console.log('axios can not fetch the url, if you want to know more about this err log err here')
        return{
            title: 'can not get',
            price: 'server error'
        }

    }

    

}

let runningStatus = async(url) => {

    let runningDetails = {};

    runningDetails.train_name = "not able to run the train server";
    runningDetails.prev_station_name = 'train server not available';
    runningDetails.next_station_name = 'train server not available';
    runningDetails.updated_arrival = 'train server not available';
    runningDetails.updated_departure = 'train server not available';
    runningDetails.delay ='train server not available';

    return runningDetails;
}


module.exports.runningStatus = runningStatus;
module.exports.amazonPrice =amazonPrice;
module.exports.flipkartPrice = flipkartPrice;

