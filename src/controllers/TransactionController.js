import * as yup from "yup";
import parsePhoneNumber from "libphonenumber-js";
import { cpf, cnpj } from "cpf-cnpj-validator";

import Cart from "../models/Cart.js"
import TransactionService from "../services/TransactionService.js"

class TransactionController {
    async create(req, res) {
        try {
            const {
                cartCode,
                paymentType,
                installments,
                custumerName,
                custumerEmail,
                custumerMobile,
                custumerDocument,
                billingAddress,
                billingNumber,
                billingNeighborhood,
                billingCity,
                billingState,
                billingZipCode,
                creditCardNumber,
                creditCardExpiration,
                creditCardHolderName,
                creditCardCvv,
            } = req.body;

            const schema = yup.object({
                cartCode: yup.string().required(),
                paymentType: yup.mixed().oneOf(["credit_card", "billet"]).required(),
                installments: yup.number()
                    .min(1)
                    // .when("paymentType", {is: "credit_card", then: (schema) => schema.max(12), otherwise: (schema) => schema.max(1)}),
                    .when("paymentType", ([paymentType], schema) => paymentType === "credit_card" ? schema.max(12) : schema.max(1)),
                custumerName: yup.string().required().min(3),
                custumerEmail: yup.string().required().email(),
                custumerMobile: yup.string().required()
                    .test("is-valid-mobile", "${path} is not a mobile number", (value) => parsePhoneNumber(value, "BR").isValid()),
                custumerDocument: yup.string().required()
                    .test("is-valid-document", "${path} is not a valid CPF / CNPJ", (value) => cpf.isValid(value) || cnpj.isValid(value)),
                billingAddress: yup.string().required(),
                billingNumber: yup.string().required(),
                billingNeighborhood: yup.string().required(),
                billingCity: yup.string().required(),
                billingState: yup.string().required(),
                billingZipCode: yup.string().required(),
                creditCardNumber: yup.string()
                    .when("paymentType", ([paymentType], schema) => paymentType === "credit_card" ? schema.required() : schema),
                creditCardHolderName: yup.string()
                .when("paymentType", ([paymentType], schema) => paymentType === "credit_card" ? schema.required() : schema),
                creditCardCvv: yup.string()
                    .when("paymentType", ([paymentType], schema) => paymentType === "credit_card" ? schema.required() : schema),
                creditCardExpiration: yup.string()
                .when("paymentType", ([paymentType], schema) => paymentType === "credit_card" ? schema.required() : schema),
            })

            if (!(await schema.isValid(req.body))) return res.status(400).json({ err: "Error on validate schema" })

            const cart = Cart.findOne({code: cartCode});
            if(!cart) return res.send(404).json();

            const service = new TransactionService();
            const response = await service.process({
                cartCode,
                paymentType,
                installments,
                custumer: {
                    name: custumerName,
                    email: custumerEmail,
                    mobile: custumerMobile,
                    document: custumerDocument,
                },
                billing: {
                    address: billingAddress,
                    number: billingNumber,
                    neighborhood: billingNeighborhood,
                    city: billingCity,
                    state: billingState,
                    code: billingZipCode,
                },
                creditCard: {
                    number: creditCardNumber,
                    expiration: creditCardExpiration,
                    holderName: creditCardHolderName,
                    cvv: creditCardCvv,
                }
            });

            return res.status(200).json(response)
        } catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    }

}

export default new TransactionController();