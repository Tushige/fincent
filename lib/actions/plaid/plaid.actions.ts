'use server'
import { plaidClient } from "../../server/plaid";
import { CountryCode, CreditBankIncomeGetRequest, PlaidApi, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { revalidatePath } from "next/cache";
import { createBankAccount, getBankById, getBanksByUserId } from "../banks.actions";
import { addFundingSource } from "../../server/dwolla";
import { CATEGORIES_SET, monthIdxToMonthLabel, parseIntoMonthlyIncome } from "@/lib/utils";

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
  try {[
    {
      account_id: 'D3b6EdKRdZcl5EvzGBV4F1eyaPQnQ1h3LPPR7',
      account_owner: null,
      amount: 5.4,
      authorized_date: '2024-08-21',
      authorized_datetime: null,
      category: [ 'Travel', 'Taxi' ],
      category_id: '22016000',
      check_number: null,
      counterparties: [ [Object] ],
      date: '2024-08-22',
      datetime: null,
      iso_currency_code: 'USD',
      location: {
        address: null,
        city: null,
        country: null,
        lat: null,
        lon: null,
        postal_code: null,
        region: null,
        store_number: null
      },
      logo_url: 'https://plaid-merchant-logos.plaid.com/uber_1060.png',
      merchant_entity_id: 'eyg8o776k0QmNgVpAmaQj4WgzW9Qzo6O51gdd',
      merchant_name: 'Uber',
      name: 'Uber 063015 SF**POOL**',
      payment_channel: 'online',
      payment_meta: {
        by_order_of: null,
        payee: null,
        payer: null,
        payment_method: null,
        payment_processor: null,
        ppd_id: null,
        reason: null,
        reference_number: null
      },
      pending: false,
      pending_transaction_id: null,
      personal_finance_category: {
        confidence_level: 'VERY_HIGH',
        detailed: 'TRANSPORTATION_TAXIS_AND_RIDE_SHARES',
        primary: 'TRANSPORTATION'
      },
      personal_finance_category_icon_url: 'https://plaid-category-icons.plaid.com/PFC_TRANSPORTATION.png',
      transaction_code: null,
      transaction_id: 'ogqQ6wZXwpFRrGPgN198cyaqLq3ljasoeE73R',
      transaction_type: 'special',
      unofficial_currency_code: null,
      website: 'uber.com'
    },
    {
      account_id: 'D3b6EdKRdZcl5EvzGBV4F1eyaPQnQ1h3LPPR7',
      account_owner: null,
      amount: -500,
      authorized_date: '2024-08-20',
      authorized_datetime: null,
      category: [ 'Travel', 'Airlines and Aviation Services' ],
      category_id: '22001000',
      check_number: null,
      counterparties: [ [Object] ],
      date: '2024-08-20',
      datetime: null,
      iso_currency_code: 'USD',
      location: {
        address: null,
        city: null,
        country: null,
        lat: null,
        lon: null,
        postal_code: null,
        region: null,
        store_number: null
      },
      logo_url: 'https://plaid-merchant-logos.plaid.com/united_airlines_1065.png',
      merchant_entity_id: 'NKDjqyAdQQzpyeD8qpLnX0D6yvLe2KYKYYzQ4',
      merchant_name: 'United Airlines',
      name: 'United Airlines',
      payment_channel: 'in store',
      payment_meta: {
        by_order_of: null,
        payee: null,
        payer: null,
        payment_method: null,
        payment_processor: null,
        ppd_id: null,
        reason: null,
        reference_number: null
      },
      pending: false,
      pending_transaction_id: null,
      personal_finance_category: {
        confidence_level: 'VERY_HIGH',
        detailed: 'TRAVEL_FLIGHTS',
        primary: 'TRAVEL'
      },
      personal_finance_category_icon_url: 'https://plaid-category-icons.plaid.com/PFC_TRAVEL.png',
      transaction_code: null,
      transaction_id: 'gendDmwAmjuReEM7obyVcBDMyMW1GDcEpWnXE',
      transaction_type: 'special',
      unofficial_currency_code: null,
      website: 'united.com'
    },
    {
      account_id: 'D3b6EdKRdZcl5EvzGBV4F1eyaPQnQ1h3LPPR7',
      account_owner: null,
      amount: 12,
      authorized_date: '2024-08-19',
      authorized_datetime: null,
      category: [ 'Food and Drink', 'Restaurants', 'Fast Food' ],
      category_id: '13005032',
      check_number: null,
      counterparties: [ [Object] ],
      date: '2024-08-19',
      datetime: null,
      iso_currency_code: 'USD',
      location: {
        address: null,
        city: null,
        country: null,
        lat: null,
        lon: null,
        postal_code: null,
        region: null,
        store_number: '3322'
      },
      logo_url: 'https://plaid-merchant-logos.plaid.com/mcdonalds_619.png',
      merchant_entity_id: 'vzWXDWBjB06j5BJoD3Jo84OJZg7JJzmqOZA22',
      merchant_name: "McDonald's",
      name: "McDonald's",
      payment_channel: 'in store',
      payment_meta: {
        by_order_of: null,
        payee: null,
        payer: null,
        payment_method: null,
        payment_processor: null,
        ppd_id: null,
        reason: null,
        reference_number: null
      },
      pending: false,
      pending_transaction_id: null,
      personal_finance_category: {
        confidence_level: 'VERY_HIGH',
        detailed: 'FOOD_AND_DRINK_FAST_FOOD',
        primary: 'FOOD_AND_DRINK'
      },
      personal_finance_category_icon_url: 'https://plaid-category-icons.plaid.com/PFC_FOOD_AND_DRINK.png',
      transaction_code: null,
      transaction_id: '8LMAo94w9BTWdwk1DnLNIyQgjgMEbQsWoqLyZ',
      transaction_type: 'place',
      unofficial_currency_code: null,
      website: 'mcdonalds.com'
    },
    {
      account_id: 'D3b6EdKRdZcl5EvzGBV4F1eyaPQnQ1h3LPPR7',
      account_owner: null,
      amount: 4.33,
      authorized_date: '2024-08-19',
      authorized_datetime: null,
      category: [ 'Food and Drink', 'Restaurants', 'Coffee Shop' ],
      category_id: '13005043',
      check_number: null,
      counterparties: [ [Object] ],
      date: '2024-08-19',
      datetime: null,
      iso_currency_code: 'USD',
      location: {
        address: null,
        city: null,
        country: null,
        lat: null,
        lon: null,
        postal_code: null,
        region: null,
        store_number: null
      },
      logo_url: 'https://plaid-merchant-logos.plaid.com/starbucks_956.png',
      merchant_entity_id: 'NZAJQ5wYdo1W1p39X5q5gpb15OMe39pj4pJBb',
      merchant_name: 'Starbucks',
      name: 'Starbucks',
      payment_channel: 'in store',
      payment_meta: {
        by_order_of: null,
        payee: null,
        payer: null,
        payment_method: null,
        payment_processor: null,
        ppd_id: null,
        reason: null,
        reference_number: null
      },
      pending: false,
      pending_transaction_id: null,
      personal_finance_category: {
        confidence_level: 'VERY_HIGH',
        detailed: 'FOOD_AND_DRINK_COFFEE',
        primary: 'FOOD_AND_DRINK'
      },
      personal_finance_category_icon_url: 'https://plaid-category-icons.plaid.com/PFC_FOOD_AND_DRINK.png',
      transaction_code: null,
      transaction_id: 'ExmbLkRNkMsq5ko16V7aUP64Z4kLa6c4nbkL9',
      transaction_type: 'place',
      unofficial_currency_code: null,
      website: 'starbucks.com'
    },
    {
      account_id: 'D3b6EdKRdZcl5EvzGBV4F1eyaPQnQ1h3LPPR7',
      account_owner: null,
      amount: 89.4,
      authorized_date: '2024-08-17',
      authorized_datetime: null,
      category: [ 'Food and Drink', 'Restaurants' ],
      category_id: '13005000',
      check_number: null,
      counterparties: [ [Object] ],
      date: '2024-08-18',
      datetime: null,
      iso_currency_code: 'USD',
      location: {
        address: null,
        city: null,
        country: null,
        lat: null,
        lon: null,
        postal_code: null,
        region: null,
        store_number: null
      },
      logo_url: null,
      merchant_entity_id: null,
      merchant_name: 'FUN',
      name: 'SparkFun',
      payment_channel: 'in store',
      payment_meta: {
        by_order_of: null,
        payee: null,
        payer: null,
        payment_method: null,
        payment_processor: null,
        ppd_id: null,
        reason: null,
        reference_number: null
      },
      pending: false,
      pending_transaction_id: null,
      personal_finance_category: {
        confidence_level: 'LOW',
        detailed: 'ENTERTAINMENT_SPORTING_EVENTS_AMUSEMENT_PARKS_AND_MUSEUMS',
        primary: 'ENTERTAINMENT'
      },
      personal_finance_category_icon_url: 'https://plaid-category-icons.plaid.com/PFC_ENTERTAINMENT.png',
      transaction_code: null,
      transaction_id: 'WEjVBPw8P6h15kDVpv8XSb6JWJnyK6t6zg1G4',
      transaction_type: 'place',
      unofficial_currency_code: null,
      website: null
    },
    {
      account_id: 'D3b6EdKRdZcl5EvzGBV4F1eyaPQnQ1h3LPPR7',
      account_owner: null,
      amount: 6.33,
      authorized_date: '2024-08-04',
      authorized_datetime: null,
      category: [ 'Travel', 'Taxi' ],
      category_id: '22016000',
      check_number: null,
      counterparties: [ [Object] ],
      date: '2024-08-05',
      datetime: null,
      iso_currency_code: 'USD',
      location: {
        address: null,
        city: null,
        country: null,
        lat: null,
        lon: null,
        postal_code: null,
        region: null,
        store_number: null
      },
      logo_url: 'https://plaid-merchant-logos.plaid.com/uber_1060.png',
      merchant_entity_id: 'eyg8o776k0QmNgVpAmaQj4WgzW9Qzo6O51gdd',
      merchant_name: 'Uber',
      name: 'Uber 072515 SF**POOL**',
      payment_channel: 'online',
      payment_meta: {
        by_order_of: null,
        payee: null,
        payer: null,
        payment_method: null,
        payment_processor: null,
        ppd_id: null,
        reason: null,
        reference_number: null
      },
      pending: false,
      pending_transaction_id: null,
      personal_finance_category: {
        confidence_level: 'VERY_HIGH',
        detailed: 'TRANSPORTATION_TAXIS_AND_RIDE_SHARES',
        primary: 'TRANSPORTATION'
      },
      personal_finance_category_icon_url: 'https://plaid-category-icons.plaid.com/PFC_TRANSPORTATION.png',
      transaction_code: null,
      transaction_id: 'ArA6oB5QB7TzZKpkB45lIZqxAxrLQqu9NzAvy',
      transaction_type: 'special',
      unofficial_currency_code: null,
      website: 'uber.com'
    },
    {
      account_id: 'D3b6EdKRdZcl5EvzGBV4F1eyaPQnQ1h3LPPR7',
      account_owner: null,
      amount: 5.4,
      authorized_date: '2024-07-22',
      authorized_datetime: null,
      category: [ 'Travel', 'Taxi' ],
      category_id: '22016000',
      check_number: null,
      counterparties: [ [Object] ],
      date: '2024-07-23',
      datetime: null,
      iso_currency_code: 'USD',
      location: {
        address: null,
        city: null,
        country: null,
        lat: null,
        lon: null,
        postal_code: null,
        region: null,
        store_number: null
      },
      logo_url: 'https://plaid-merchant-logos.plaid.com/uber_1060.png',
      merchant_entity_id: 'eyg8o776k0QmNgVpAmaQj4WgzW9Qzo6O51gdd',
      merchant_name: 'Uber',
      name: 'Uber 063015 SF**POOL**',
      payment_channel: 'online',
      payment_meta: {
        by_order_of: null,
        payee: null,
        payer: null,
        payment_method: null,
        payment_processor: null,
        ppd_id: null,
        reason: null,
        reference_number: null
      },
      pending: false,
      pending_transaction_id: null,
      personal_finance_category: {
        confidence_level: 'VERY_HIGH',
        detailed: 'TRANSPORTATION_TAXIS_AND_RIDE_SHARES',
        primary: 'TRANSPORTATION'
      },
      personal_finance_category_icon_url: 'https://plaid-category-icons.plaid.com/PFC_TRANSPORTATION.png',
      transaction_code: null,
      transaction_id: 'L7K6AqGjqEId5bNz79XGcxVZ8AwDwdckEvwdw',
      transaction_type: 'special',
      unofficial_currency_code: null,
      website: 'uber.com'
    },
    {
      account_id: 'D3b6EdKRdZcl5EvzGBV4F1eyaPQnQ1h3LPPR7',
      account_owner: null,
      amount: -500,
      authorized_date: '2024-07-21',
      authorized_datetime: null,
      category: [ 'Travel', 'Airlines and Aviation Services' ],
      category_id: '22001000',
      check_number: null,
      counterparties: [ [Object] ],
      date: '2024-07-21',
      datetime: null,
      iso_currency_code: 'USD',
      location: {
        address: null,
        city: null,
        country: null,
        lat: null,
        lon: null,
        postal_code: null,
        region: null,
        store_number: null
      },
      logo_url: 'https://plaid-merchant-logos.plaid.com/united_airlines_1065.png',
      merchant_entity_id: 'NKDjqyAdQQzpyeD8qpLnX0D6yvLe2KYKYYzQ4',
      merchant_name: 'United Airlines',
      name: 'United Airlines',
      payment_channel: 'in store',
      payment_meta: {
        by_order_of: null,
        payee: null,
        payer: null,
        payment_method: null,
        payment_processor: null,
        ppd_id: null,
        reason: null,
        reference_number: null
      },
      pending: false,
      pending_transaction_id: null,
      personal_finance_category: {
        confidence_level: 'VERY_HIGH',
        detailed: 'TRAVEL_FLIGHTS',
        primary: 'TRAVEL'
      },
      personal_finance_category_icon_url: 'https://plaid-category-icons.plaid.com/PFC_TRAVEL.png',
      transaction_code: null,
      transaction_id: 'p8KZ6WbLWosPzEMX5Dg8Tn18ZrPQP5upzya8W',
      transaction_type: 'special',
      unofficial_currency_code: null,
      website: 'united.com'
    },
    {
      account_id: 'D3b6EdKRdZcl5EvzGBV4F1eyaPQnQ1h3LPPR7',
      account_owner: null,
      amount: 12,
      authorized_date: '2024-07-20',
      authorized_datetime: null,
      category: [ 'Food and Drink', 'Restaurants', 'Fast Food' ],
      category_id: '13005032',
      check_number: null,
      counterparties: [ [Object] ],
      date: '2024-07-20',
      datetime: null,
      iso_currency_code: 'USD',
      location: {
        address: null,
        city: null,
        country: null,
        lat: null,
        lon: null,
        postal_code: null,
        region: null,
        store_number: '3322'
      },
      logo_url: 'https://plaid-merchant-logos.plaid.com/mcdonalds_619.png',
      merchant_entity_id: 'vzWXDWBjB06j5BJoD3Jo84OJZg7JJzmqOZA22',
      merchant_name: "McDonald's",
      name: "McDonald's",
      payment_channel: 'in store',
      payment_meta: {
        by_order_of: null,
        payee: null,
        payer: null,
        payment_method: null,
        payment_processor: null,
        ppd_id: null,
        reason: null,
        reference_number: null
      },
      pending: false,
      pending_transaction_id: null,
      personal_finance_category: {
        confidence_level: 'VERY_HIGH',
        detailed: 'FOOD_AND_DRINK_FAST_FOOD',
        primary: 'FOOD_AND_DRINK'
      },
      personal_finance_category_icon_url: 'https://plaid-category-icons.plaid.com/PFC_FOOD_AND_DRINK.png',
      transaction_code: null,
      transaction_id: 'ogqQ6wZXwpFRrGPgN198cyaqdMR4RNIobxEGn',
      transaction_type: 'place',
      unofficial_currency_code: null,
      website: 'mcdonalds.com'
    },
    {
      account_id: 'D3b6EdKRdZcl5EvzGBV4F1eyaPQnQ1h3LPPR7',
      account_owner: null,
      amount: 4.33,
      authorized_date: '2024-07-20',
      authorized_datetime: null,
      category: [ 'Food and Drink', 'Restaurants', 'Coffee Shop' ],
      category_id: '13005043',
      check_number: null,
      counterparties: [ [Object] ],
      date: '2024-07-20',
      datetime: null,
      iso_currency_code: 'USD',
      location: {
        address: null,
        city: null,
        country: null,
        lat: null,
        lon: null,
        postal_code: null,
        region: null,
        store_number: null
      },
      logo_url: 'https://plaid-merchant-logos.plaid.com/starbucks_956.png',
      merchant_entity_id: 'NZAJQ5wYdo1W1p39X5q5gpb15OMe39pj4pJBb',
      merchant_name: 'Starbucks',
      name: 'Starbucks',
      payment_channel: 'in store',
      payment_meta: {
        by_order_of: null,
        payee: null,
        payer: null,
        payment_method: null,
        payment_processor: null,
        ppd_id: null,
        reason: null,
        reference_number: null
      },
      pending: false,
      pending_transaction_id: null,
      personal_finance_category: {
        confidence_level: 'VERY_HIGH',
        detailed: 'FOOD_AND_DRINK_COFFEE',
        primary: 'FOOD_AND_DRINK'
      },
      personal_finance_category_icon_url: 'https://plaid-category-icons.plaid.com/PFC_FOOD_AND_DRINK.png',
      transaction_code: null,
      transaction_id: 'gendDmwAmjuReEM7obyVcBDMo9alamFE5aWdq',
      transaction_type: 'place',
      unofficial_currency_code: null,
      website: 'starbucks.com'
    }
  ]
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
 * aggregate all transactions across all banks then return top 5 categories
 * return data format
 * {
 *  categorizedTransactions: [
 *  {category: cost }, -> total expense in category in January
 *  {category: cost}
 * ]
 * }
 */
export const getAllTransactions = async (user) => {
  try {
    // get banks from the database
    const banks = await getBanksByUserId(user.$id)
    const allTransactions = await Promise.all(banks?.map(async (bank: Bank) => {
      let hasMore = true;
      let cursor = null
      let transactions = [];

      while (hasMore) {
        const res = await plaidClient.transactionsSync({
          access_token: bank.accessToken,
          cursor
        })
        const data = res.data.added;
        transactions = transactions.concat(data)
        cursor = res.data.next_cursor;
        hasMore = res.data.has_more
      }
      return transactions
    }))
    const categorizedTransactions = formatIntoCategories(allTransactions.flat())
    return {transactions: allTransactions, categorizedTransactions}
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

function formatIntoCategoriesOld(transactions) {
  const d = new Array(12).fill(0).map(() => ({
    total: 0,
    'FOOD_AND_DRINK': 0,
    'ENTERTAINMENT': 0,
    // 'PERSONAL_CARE': 0,
    'GENERAL_SERVICES': 0,
    'LOAN_PAYMENTS': 0,
    'TRANSPORTATION': 0,
    'GENERAL_MERCHANDISE': 0
  }))
  transactions.forEach(transaction => {
    const amount = transaction.amount
    const transactionDate = transaction.date;
    const category = transaction.personal_finance_category.primary;
    const month = new Date(Date.parse(transactionDate)).getMonth()
    
    if (CATEGORIES_SET.has(category)) {
      d[month][category] += amount
      d[month].total += amount;
    }

  })
  return d;
}
function formatIntoCategories(transactions) {
  const d = {}
  transactions.forEach(transaction => {
    const amount = Math.abs(transaction.amount)
    const transactionDate = transaction.date;
    const category = transaction.personal_finance_category.primary;
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