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
  fundingSourceUrl: string;
  userId: string;
  shareableId: string;
};

declare type PlaidAccount = {
  id: string,
  availableBalance: number,
  currentBalance: number,
  name: string,
  officialName: string, 
  mask: string,
  sybtype: string,
  type: string,
  bankId: string
  shareableId: string 
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