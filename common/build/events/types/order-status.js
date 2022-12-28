"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    // When the order has been created but the product it is trying to order has not been reserved
    OrderStatus["Created"] = "created";
    // The product the order is trying to reserve has already been reserved,
    // or when the user has already cancelled the order
    // The order expires before payment
    OrderStatus["Cancelled"] = "cancelled";
    //The order has successfully reserved the product
    OrderStatus["AwaitingPayment"] = "awaiting:payment";
    // The order has reserved the product and the user has provided payement successfully
    OrderStatus["Complete"] = "complete";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
