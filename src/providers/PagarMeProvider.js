import { cpf } from "cpf-cnpj-validator"
import axios from 'axios'

class PagarMeProvider {
    async process({
        transactionCode,
        total,
        paymentType,
        installments,
        creditCard,
        customer,
        billing,
        items,
    }) {

        const billetParams = {
            payment_method: "boleto",
            amount: total * 100,
            installments: 1,
        }

        const creditCardParams = {
            payment_method: "credit_card",
            amount: total * 100,
            installments,
            card_number: creditCard.number.replace(/[^?0-9]/g, ""),
            card_expiration_date: creditCard.expiration.replace(/[^?0-9]/g, ""),
            capture: true,
        }

        let paymentParams;

        if (paymentType === "credit_card") paymentParams = creditCardParams;
        else if (paymentType === "billet") paymentParams = billetParams;
        else {
            throw `Payment type ${paymentType} not found`;
        }

        const customerParams = {
            customer: {
                external_id: customer.email,
                name: customer.name,
                email: customer.email,
                type: cpf.isValid(customer.document) ? "individual" : "corporations",
                country: "br",
                phone_numbers: [customer.mobile],
                documents: [
                    {
                        type: cpf.isValid(customer.document) ? "cpf" : "cnpj",
                        number: customer.document.replace(/[^?0-9]/g, ""),
                    }
                ]
            }
        }

        const billingParams = billing.zipcode ? {
            billing: {
                name: "Billing Address",
                address: {
                    country: "br",
                    state: billing.state,
                    city: billing.city,
                    neighborhood: billing.neighborhood,
                    street: billing.address,
                    street_number: billing.number,
                    zipcode: billing.zipcode,
                }
            }
        } : { billing: "-" }

        const itemsParams = items && items.length > 0 ? {
            items: items.map((item) => ({
                id: item?.id.toString(),
                title: item?.title,
                unit_price: item?.amount * 100,
                quantity: item?.quantity || 1,
                tangible: false,
            }))
        } : {
            items: [{
                id: "1",
                title: `t-${transactionCode}`,
                unit_price: total * 100,
                quantity: 1,
                tangible: false,
            }]
        }

        const metadataParams = {
            metadata: {
                transaction_code: transactionCode,
            }
        }

        const transactionParams = {
            async: false,
            // postback_url:,
            // ...paymentParams,
            // ...customerParams,
            // ...billingParams,
            // ...itemsParams,
            // ...metadataParams
        }

        const headers = {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Basic c2tfdGVzdF80WHFMWjRSdGt1TFJWd3l4Og=='
        };

        const body = `{
            "customer": {
              "address": {
                "country": "BR",
                "state": "PE",
                "city": "Recife",
                "zip_code": "5420000",
                "line_1": "Rua balbal"
              },
              "phones": {
                "home_phone": {
                  "country_code": "55",
                  "area_code": "81",
                  "number": "999999999"
                }
              },
              "name": "Tony Stark",
              "email": "avengerstark@ligadajustica.com.br",
              "type": "individual",
              "code": "123123edasdasd",
              "document": "64010417064",
              "document_type": "CPF",
              "gender": "male",
              "birthdate": "11/10/1980"
            },
            "items": [
              {
                "amount": 2990,
                "description": "Chaveiro do Tesseract",
                "quantity": 1,
                "code": "dasdasdasda"
              }
            ],
            "shipping": {
              "address": {
                "country": "US",
                "state": "CA",
                "city": "Malibu",
                "zip_code": "90265",
                "line_1": "10880, Malibu Point, Malibu Central"
              },
              "amount": 100,
              "description": "Stark",
              "recipient_name": "Tony Stark",
              "recipient_phone": "24586787867"
            },
            "payments": [
              {
                "credit_card": {
                  "card": {
                    "number": "4111111111111111",
                    "holder_name": "Tony Stark",
                    "exp_month": 1,
                    "exp_year": 30,
                    "cvv": "123",
                    "holder_document": "64010417064"
                  },
                  "installments": 6,
                  "statement_descriptor": "AVENGERS"
                },
                "payment_method": "credit_card"
              }
            ],
            "closed": false,
            "ip": "52.168.67.32",
            "code": "COSTUMER_ID_01",
            "customer_id": "cus_5r0L6ZrHDec46jBO"
          }`


        try {
            // console.log(process.env.SECRET_KEY)
            // const client = await pagarme.client.connect({ api_key: process.env.SECRET_KEY })
            // console.debug(client);
            // const response = await client.transactions.create(transactionParams);
            // console.debug("response", response);

            const response = await axios.post('https://api.pagar.me/core/v5/orders', JSON.parse(body), { headers });
            console.log('Resposta:', response.data);

        } catch (err) {
            console.debug("err", err.response);

        }

    }

}

export default PagarMeProvider;