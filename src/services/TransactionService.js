import { v4 as uidv4 } from "uuid" ;

import Cart from "../models/Cart.js"
import Transaction from "../models/Transaction.js"

class TransactionService {
        async process({cartCode, paymentType, installments, custumer, billing, creditCard}) {
        const cart = await Cart.findOne({ code: cartCode });
        if(!cart) throw `Cart ${cartCode} was not found.`;
        
        const transaction = await Transaction.create({
            cartCode: cart.code,
            code: await uidv4(),
            total: cart.price,
            paymentType,
            installments,
            status: "started",
            custumerName: custumer.name,
            custumerEmail: custumer.email,
            custumerMobile: custumer.mobile,
            custumerDocument: custumer.document,
            billingAddress: billing.address,
            billingNumber: billing.number,
            billingNeighborhood: billing.neighborhood,
            billingCity: billing.city,
            billingState: billing.state,
            billingZipCode: billing.zipCode,
            creditCardNumber: creditCard.number,
            creditCardExpiration: creditCard.expiration,
            creditCardHolderName: creditCard.holderName,
            creditCardCvv: creditCard.cvv,
        })
        return transaction;
    }
}

export default TransactionService;