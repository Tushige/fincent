'use server'
import { plaidClient } from "../../server/plaid";
import { CountryCode, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { revalidatePath } from "next/cache";
import { createBankAccount, getBankById, getBanksByUserId } from "../banks.actions";
import { addFundingSource } from "../../server/dwolla";

export async function linkTokenCreateAction({userId, clientName} : {userId: string, clientName: string}) {
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
    const accountData = accountRes.data.accounts[0]

    const processorTokenRes = await plaidClient.processorTokenCreate({
      access_token,
      account_id: accountData.account_id,
      processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum
    })
    const {processor_token} = processorTokenRes.data
    const fundingSourceURL = await addFundingSource({
      customerId: user.dwollaCustomerId,
      processorToken: processor_token,
      bankName: accountData.name
    })
    if (!fundingSourceURL) throw Error('[Plaid] fundingSourceURL is invalid');
    // if funding exists, create bank account
    await createBankAccount({
      userId: user.$id,
      bankId: item_id,
      accountId: accountData.account_id,
      accessToken: access_token,
      fundingSourceURL,
      shareableId: btoa(accountData.account_id)
    })
    revalidatePath('/')
    return JSON.parse(JSON.stringify({
      publicTokenExchange: 'success'
    }))
  } catch(err) {
    console.error(err)
  }
}

/**
 * 1. find all banks belonging to user with userid
 * 2. For each bank, fetch an account associated with it. For now let's use the first account in the list. I believe every bank can have more than 1 account and we should handle that.
 * 3. return the list of accounts
 * 
 * Observations:
 * - each account in the accounts list belong to a different bank.
 */
export const getAccounts = async (userId: string) => {
  try {
    const banks = await getBanksByUserId(userId)
    const accounts = await Promise.all(banks?.map(async (bank: Bank) => {
      const accountsRes = await plaidClient.accountsGet({access_token: bank.accessToken})
      const d = accountsRes.data.accounts[0];
      const account = {
        id: d.account_id,
        availableBalance: d.balances.available,
        currentBalance: d.balances.current,
        name: d.name,
        officialName: d.official_name,
        mask: d.mask,
        subtype: d.subtype,
        type: d.type,
        bankId: bank.$id,
        shareableId: bank.shareableId
      }
      return account
    }))
    return accounts;
  } catch (err) {
    console.error(err)
  }
}

export const getTransactionsByBankId = async ({bankId}) => {
  try {
    const bank = await getBankById(bankId)
    if (!bank) {
      throw new Error('[Plaid] failed to get transactions. Bank was not found')
    }
    const res = await plaidClient.transactionsSync({
      access_token: bank.accessToken,
      count: 10
    })
    const data = res.data

    return {
      accounts: data.accounts,
      transactions: data.added
    };
  } catch (err) {
    console.error('[PLAID API] failed to fetch transactions with error: ', err);
  }
}