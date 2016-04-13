export type FundID = string;
export type FundRev = string;
export type FundSymbol = string;
export type FundName = string;
export type FundKey = string;

export interface Fund {

  _id?: FundID;
  _rev?: FundRev;
  symbol: FundSymbol;
  name: FundName;

};

export interface FundWrapper {

  key: FundKey;
  value: Fund;

};
