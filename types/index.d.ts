/**
 * include shared type interfaces
 */

declare type LoginUser = {
  email: string;
  password: string;
};

declare type User = {
  $id: string;
  email: string;
  authId: string;
  dwollaCustomerUrl: string;
  dwollaCustomerId: string;
  firstName: string;
  lastName: string;
  name: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
};

declare interface PlaidLinkProps {
  user: User;
  token: string,
  variant?: "primary" | "ghost";
  dwollaCustomerId?: string;
}

declare interface AccountReqProps {
  access_token: string
}

declare interface Account {
  $id: string,
  availableBalance: number,
  currentBalance: number,
  name: string,
  officialName: string,
  mask: string,
  subType: string,
  type: string,
  bankId: string,
  shareableId: string
}

declare interface createBankAccountProps {
  accessToken: string;
  userId: string;
  accountId: string;
  bankId: string;
  fundingSourceURL: string;
  shareableId: string;
}

declare type Bank = {
  $id: string;
  accountId: string;
  bankId: string;
  accessToken: string;
  fundingSourceURL: string;
  userId: string;
  shareableId: string;
};


declare interface createTransactionProps {
  name: string,
  memo: string,
  channel: string,
  category: string,
  amount: string,
  email: string
  senderId: string,
  receiverId: string,
  senderBankId: string,
  receiverBankId: string,
  status: string
}


declare type NewDwollaCustomerParams = {
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
};