const midtransClient = require("midtrans-client");
require('dotenv').config()

const PaymentGateway = async(price, trxid, itemDetails, user) => {


  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  });

  let parameter = {
    transaction_details: {
      order_id: trxid,
      gross_amount: price,
    },
    item_details: itemDetails,
    customer_details: {
        name: user.name,
        email: user.email,
        phone: user.phone ?? "",
        billing_address: {
            address: user.address ?? ""
        },
    },
    credit_card: {
      secure: true,
    },
    enabled_payments: ["credit_card", "mandiri_clickpay","bca_klikbca", "bca_klikpay", "bri_epay", "bca_va", "bni_va", "other_va", "gopay", "other_qris"],
    callbacks: {
        "finish": "https://jogja-istemewa.vercel.app/"
    },
    // expiry: {
    //     "start_time": "2025-12-20 18:11:08 +0700",
    //     "unit": "minute",
    //     "duration": 9000
    // },
  };

  const res = await snap.createTransaction(parameter).then((transaction) => {
    // transaction redirect_url
    let redirectUrl = transaction.redirect_url;
    console.log("redirectUrl:", redirectUrl);
    return redirectUrl
  });
  return {res, parameter}
};

module.exports = {PaymentGateway}
