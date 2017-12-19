var request = require("request");
var Promise = require("promise");
var tradeFuncs = require("./trade");

function createPriceQuery(currency_pair) {
    return new Promise(function(resolve, reject){
        request({ 
            method: 'GET',
            url: `https://www.bitstamp.net/api/v2/ticker/${currency_pair}`,
            headers: { 'cache-control': 'no-cache' } 
        }, function (error, response, body) {
            if (error) reject(error);
            resolve(body);
        });
    });
}

var tradingRate = 1 - 0.0024;

function loopReq() {
    var btcusd = createPriceQuery('btcusd');
    var bchusd = createPriceQuery('bchusd');
    var bchbtc = createPriceQuery('bchbtc');

    Promise.all([btcusd, bchusd, bchbtc]).then(function(res){
        var btcusdRes = JSON.parse(res[0]);
        var bchusdRes = JSON.parse(res[1]);
        var bchbtcRes = JSON.parse(res[2]);

        var fairPrice = bchusdRes.ask / btcusdRes.bid;
        var marketPrice = bchbtcRes.bid;

        console.log('fair sell btc buy bch: ', fairPrice);
        console.log('market sell btc buy bch : ', marketPrice);

        // if (marketPrice > fairPrice) {
            var sellBtc = marketPrice * tradingRate * btcusdRes.bid * tradingRate;
            var buyBch = bchusdRes.ask * tradingRate;

            console.log('sell btc : ', sellBtc);
            console.log('buy bch: ', buyBch);
        // }

        fairPrice = bchusdRes.bid / btcusdRes.ask;
        marketPrice = bchbtcRes.ask;

        console.log('fair sell bch buy btc : ', fairPrice);
        console.log('market sell bch buy btc : ', marketPrice);

        // if (marketPrice > fairPrice) {
            var sellBch = 1 / marketPrice * tradingRate * bchusdRes.bid * tradingRate;
            var buyBtc = btcusdRes.ask * tradingRate;

            console.log('sell bch : ', sellBch);
            console.log('buy btc : ', buyBtc);
        // }
    });
}
loopReq();
// setInterval(loopReq, 2000);
