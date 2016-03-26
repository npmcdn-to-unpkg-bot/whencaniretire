CREATE TABLE transaction_types(
  trx_type_name TEXT UNIQUE
);

CREATE TABLE funds(
  fund_symbol TEXT UNIQUE NOT NULL,
  fund_name TEXT NOT NULL
);

CREATE TABLE accounts(
  account_name TEXT UNIQUE NOT NULL
);

CREATE TABLE activity(
  activity_date DATE NOT NULL,
  fund_id INTEGER NOT NULL,
  account_id INTEGER NOT NULL,
  trx_type_id INTEGER NOT NULL,
  charge NUMBER NOT NULL,
  shares NUMBER NOT NULL,
  price NUMBER NOT NULL,
  cost_basis NUMBER NOT NULL,
  FOREIGN KEY(fund_id) REFERENCES funds(rowid),
  FOREIGN KEY(account_id) REFERENCES accounts(rowid),
  FOREIGN KEY(trx_type_id) REFERENCES transaction_types(rowid)
);
