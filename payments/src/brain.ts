const braintree = require("braintree");

export const bpk = new braintree(process.env.PUBLIC_KEY);
export const bpv = new braintree(process.env.PRIVATE_KEY);
export const bmi = new braintree(process.env.MERCHANT_ID);
