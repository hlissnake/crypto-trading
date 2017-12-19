
function nzInput(nz, pb) {
    return ((nz-38) * 0.716 - 7.5) * 0.9975 / pb;
}

function cOutput(btc, pc) {
    return btc * pc * 0.998 / 5.05;
}

function cInput(rmb, pc) {
    return rmb / pc * 0.998;
}

function usdOutput(btc, pb) {
    return btc * pb * 0.9975;
}

module.exports = {
    usdToRmbProfit: function (nz, pb, pc) {
        return cOutput(nzInput(nz, pb), pc) - nz;
    },

    rmbToUsd: function (rmb, pc, pb) {
        return usdOutput(cInput(rmb, pc), pb);
    }
}