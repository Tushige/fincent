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


export const createDwollaCustomer = async (
  user: NewDwollaCustomerParams
) => {
  try {
    console.log('[DWOLLA] this is the user object')
    console.log('\n')
    console.log(user)
    console.log('\n')
    const customer = await dwollaClient
      .post('customers', user)
      .then(res => res.headers.get('location'))
    console.log('[createDwollaCustomer] this is customer')
    console.log(customer)
    return customer;
  } catch (err) {
    console.error('[Dwolla] failed to create customer with error ', err)
  }
}


export const createFundingSource = async (
  {customerId, fundingSourceName, plaidToken, _links}: CreateFundingSourceOptions
) => {
  // TODO
  console.log(`[dwolla] attempting to create a funding source for ${fundingSourceName} with token ${plaidToken} and customerId: ${customerId}`)
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
export const addFundingSource = async ({
  customerId,
  processorToken,
  bankName
}) => {
  try {
    const onDemandAuthorization = await dwollaClient.post(
      "on-demand-authorizations"
    );
    console.log(`[Dwolla] this is the onDemandAuth response`)
    console.log(onDemandAuthorization)
    const authLink = onDemandAuthorization.body._links;

    const fundingSourceOptions = {
      customerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: authLink
    } 
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