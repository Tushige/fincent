"use server";

import { Client } from "dwolla-v2";
import { plaidClient } from "./plaid";

declare interface CreateFundingSourceOptions {
  customerId: string; // Dwolla Customer ID
  fundingSourceName: string; // Dwolla Funding Source Name
  plaidToken: string; // Plaid Account Processor Token
  _links: object; // Dwolla On Demand Authorization Link
}

type DwollAEnvironment = 'sandbox' | 'production';

const dwollaClient = new Client({
  environment: process.env.DWOLLA_ENV as DwollAEnvironment,
  key: process.env.DWOLLA_KEY as string,
  secret: process.env.DWOLLA_SECRET as string,
});


const createDwollaCustomer = async (
  user: NewDwollaCustomerParams
) => {
  try {
    const customer = await dwollaClient
      .post('customers', user)
      .then(res => res.headers.get('location'))
    return customer;
  } catch (err) {
    console.error('[Dwolla] failed to create customer with error ', err)
  }
}


const createFundingSource = async (
  {customerId, fundingSourceName, plaidToken, _links}: CreateFundingSourceOptions
) => {
  try {
    return await dwollaClient
      .post(`customers/${customerId}/funding-sources`, {
        name: fundingSourceName,
        plaidToken
      })
      .then((res) => res.headers.get('location'))
  } catch (err) {
    console.error('[Dwolla] failed creating a funding source with error ', err)
  }
}

const addFundingSource = async ({
  customerId,
  processorToken,
  bankName
}) => {
  try {
    const onDemandAuthorization = await dwollaClient.post(
      "on-demand-authorizations"
    );
    const authLink = onDemandAuthorization.body._links;
    return await createFundingSource({ 
      customerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: authLink
    })
  } catch (err) {
    console.error('[Dwolla] failed to add fun with error ', err)
  }
}

const initiateFundTransfer = async ({
  sourceBank,
  destinationBank,
  amount
}: {
  sourceBank: Bank,
  destinationBank: Bank,
  amount: string
}) => {
  try { 
    if (!sourceBank || !destinationBank || amount === undefined) {
      throw new Error('[initiateFundTransfer] missing arguments')
    }
    const res = await dwollaClient.post('transfers', {
      _links: {
        source: {
          href: sourceBank.fundingSourceURL
        },
        destination: {
          href: destinationBank.fundingSourceURL
        }
      },
      amount: {
        currency: 'USD',
        value: amount
      }
    })
    console.log('[Dwolla] fund transfer result')
    console.log(res.headers.get('location'))
    return res.headers.get('location');
  } catch(err) {
    console.error('transfer fund failed with error: ', err)
  }
}

export {
  createDwollaCustomer,
  createFundingSource,
  addFundingSource,
  initiateFundTransfer
}