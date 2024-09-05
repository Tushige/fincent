'use server'
import { plaidClient } from "../../server/plaid";
import { ConsumerReportPermissiblePurpose, CountryCode, CreditBankIncomeGetRequest, PlaidApi, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { revalidatePath } from "next/cache";
import { createBankAccount, getBankByAccountId, getBankById, getBanksByUserId } from "../banks.actions";
import { addFundingSource } from "../../server/dwolla";
import { CATEGORIES_SET, monthIdxToMonthLabel, parseIntoMonthlyIncome } from "@/lib/utils";
import { Account } from "node-appwrite";
import { getTransferTransactionsByBankId } from "../transactions.actions";

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
      const accountsRes = await plaidClient.accountsGet({access_token: bank?.accessToken})
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

export const getAccount = async (bankId: string) => {
  try {
    const bank = await getBankById(bankId)
    const accountRes = await plaidClient.accountsGet({
      access_token: bank?.accessToken
    })
    const d = accountRes.data.accounts[0]
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
  } catch(err) {
    console.error(err)
  }
}
/**
 * unused
 */
export const getTransactionsByBankId = async ({bankId}) => {
  try {
    const bank = await getBankById(bankId)
    if (!bank) {
      throw new Error('[Plaid] failed to get transactions. Bank was not found')
    }
    const res = await plaidClient.transactionsSync({
      access_token: bank.accessToken,
      count: 100
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

/**
 * for a given bankId, we get 2 types of transactions with pagination
 * 1. plaid provided transactions starting at <cursor>
 * 2. transfer in/out transactions saved in the DB using <offset>
 */
export const getTransactionsByBank = async (bankId: string, cursor, offset) => {
  try {
    const bank = await getBankById(bankId)
    const plaidTransactions = await _getPlaidTransactions(bank.accessToken, cursor)
    const transferTransactions = await getTransferTransactionsByBankId(bankId, offset)
    const transactions = [...plaidTransactions.transactions, ...transferTransactions]
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const categorizedTransactions = formatIntoCategories(transactions)
    return {
      next_cursor: plaidTransactions.next_cursor,
      has_more: plaidTransactions.has_more,
      transactions,
      categorizedTransactions
    }
  } catch (err) {
    console.error(err)
  }
}
/**
get ALl transactions without pagination in order to generate monthly expenses graph
 */
export const getAllTransactions = async (userId) => {
  try {
    // get banks from the database
    const banks = await getBanksByUserId(userId)
    const allTransactions = await Promise.all(banks?.map(async (bank: Bank) => {
      let {transactions, has_more, next_cursor} = await _getPlaidTransactions(bank.accessToken, null, 100)
      while (has_more) {
        const nextTransactions = await __getPlaidTransactions(bank.accessToken, next_cursor, 100)
        next_cursor = nextTransactions.next_cursor
        has_more = nextTransactions.has_more
        transactions = transactions.concat(nextTransactions.transactions)
      }
      const transferTransactions = await getTransferTransactionsByBankId(bank.$id, 0, 100)
      return [...transactions, ...transferTransactions]
    }))
    const transactions = allTransactions.flat()
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const categorizedTransactions = formatIntoCategories(transactions)
    return {transactions, categorizedTransactions}
  } catch (err) {
    console.error(err)
  }
}

export const getBankIncome = async (userDoc: User) => {
  try {
    const incomeReq: CreditBankIncomeGetRequest = {
      user_token: userDoc.userToken,
      options: {
        count: 1,
      },
    }; 
    const res = await plaidClient.creditBankIncomeGet(incomeReq)
    const historicalData = res.data.bank_income[0].bank_income_summary?.historical_summary
    const monthlyIncome = parseIntoMonthlyIncome(historicalData)
    return monthlyIncome
  } catch (err) {
    console.error(err)
  }
}


export const createPlaidUserToken = async (userId) => {
  try {
    const res = await plaidClient.userCreate({
      client_user_id: userId
    })
    const userToken = res.data.user_token
    return userToken
  } catch(err) {
    console.error(err)
  }
}

export const createIncomePublicToken = async (userToken) => {
  const req = {
    user_token: userToken,
    institution_id: 'ins_20',
    initial_products: ['transactions', 'income_verification'],
    options: {
      "income_verification": {
        "income_source_types": ["bank"],
        "bank_income": {
            "days_requested": 365
          }
      }
    }
  }
  try {
    const res = await plaidClient.sandboxPublicTokenCreate(req);
    return res.data.public_token
  } catch (error) {
    console.error('Error creating sandbox public token:', error);
  }
}

/**
 * returns transactions and pagination cursor
 */
async function _getPlaidTransactions(accessToken: string, cursor: string | null, limit = 1) {
  try {
      const res = await plaidClient.transactionsSync({
        access_token: accessToken,
        count: limit,
        cursor: cursor || null
      })
      const data = res.data.added.map(d => ({
        account_id: d.account_id,
        amount: d.amount,
        category: d.personal_finance_category?.primary || 'GENEREAL_SERVICE',
        pending: d.pending,
        merchant_name: d.merchant_name,
        name: d.name,
        paymentChannel: d.payment_channel,
        logo_url: d.logo_url,
        date: d.date,
      }))
      const next_cursor = res.data.next_cursor;
      const has_more = res.data.has_more
    return {transactions: data, has_more, next_cursor}
  } catch (err) {
    console.error('[failed to get PLAID Transactions] with error: ', err)
  }
}

function formatIntoCategories(transactions) {
  const d = {}
  transactions.forEach(transaction => {
    const amount = Math.abs(transaction.amount)
    const transactionDate = transaction.date;
    const category = transaction.category;
    const month = new Date(Date.parse(transactionDate)).getMonth()
    const monthLabel = monthIdxToMonthLabel(month)
    if (!d[monthLabel]) {
      // initialize the total amount of each category we're tracking to 0
      d[monthLabel] = {total: 0}
      CATEGORIES_SET.forEach(c => d[monthLabel][c] = 0)
    }
    if (CATEGORIES_SET.has(category)) {
      d[monthLabel][category] += amount
      d[monthLabel].total += amount
    } else if (category === 'TRANSFER_OUT' || category === 'PERSONAL_CARE') { // customer merges
      d[monthLabel]['GENERAL_SERVICES'] += amount
      d[monthLabel].total += amount
    }
  })
  return d
}