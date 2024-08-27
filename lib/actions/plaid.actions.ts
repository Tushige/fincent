'use server'
import { plaidClient } from "../server/plaid";
import { CountryCode, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { revalidatePath } from "next/cache";
import { createBankAccount } from "./banks.actions";
import { addFundingSource } from "../server/dwolla";

export async function linkTokenCreateAction({userId, clientName}) {
  try {
    const linkTokenParams = {
      user: {
        client_user_id: userId
      },
      client_name: clientName,
      products: ['auth'] as Products[],
      country_codes: ['US'] as CountryCode[],
      language: 'en'
    }
    const res = await plaidClient.linkTokenCreate(linkTokenParams)
    if (!res || !res.data.link_token) {
      throw new Error('[PLAID] failed to fetch temp token')
    }
    return res.data.link_token
  } catch (err) {
    console.error(err)
  }
}

export const exchangeToken = async (
  publicToken: string,
  user: User
) => {
  try {
    const tokenResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken
    })
    const {access_token, item_id} = tokenResponse.data;

    const accountRes = await plaidClient.accountsGet({
      access_token
    })
    console.log('4. [PLAID] SUCCESSfully received access token')
    const accountData = accountRes.data.accounts[0]

    const processorTokenRes = await plaidClient.processorTokenCreate({
      access_token,
      account_id: accountData.account_id,
      processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum
    })
    const {processor_token} = processorTokenRes.data
    console.log('5. [PLAID] SUCCESSfully received processor token')
    const fundingSourceURL = await addFundingSource({
      customerId: user.dwollaCustomerId,
      processorToken: processor_token,
      bankName: accountData.name
    })
    if (!fundingSourceURL) throw Error('[Plaid] fundingSourceURL is invalid');
    console.log('6. [PLAID] SUCCESSfully received fundingSourceURL')
    // if funding exists, create bank account
    await createBankAccount({
      userId: user.$id,
      bankId: item_id,
      accountId: accountData.account_id,
      accessToken: access_token,
      fundingSourceURL,
      shareableId: btoa(accountData.account_id)
    })
    console.log('6. [PLAID] successfully created bank account')
    revalidatePath('/')
    return JSON.parse(JSON.stringify({
      publicTokenExchange: 'success'
    }))
  } catch(err) {
    console.error(err)
  }
}