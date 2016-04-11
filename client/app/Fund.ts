export type FundID = string;
export type FundSymbol = string;
export type FundName = string;
export type FundKey = string;

export interface Fund {

  _id: FundID;
  symbol: FundSymbol;
  name: FundName;

};

export interface FundWrapper {

  key: FundKey;
  value: Fund;

};
