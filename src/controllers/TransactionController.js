import * as yup from "yup";

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
                    .when("paymentType", (paymentType, schema) => paymentType === "credit_card" ? schema.max(12) : schema.max(1)),
                costumerName: yup.string().required().min(3),
                costumerEmail: yup.string().required().email(),
                costumerMobile: yup.string().required(),


            })

            if (!(await schema.isValid(req.body))) return res.status(400).json({ err: "Error on validate schema" })

            return res.status(200).json()
        } catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    }

}

export default new TransactionController();