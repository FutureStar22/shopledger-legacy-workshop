const assert = require('node:assert/strict');
const test = require('node:test');
const ledger = require('../lib/ledger');

function makeLedger() {
  return {
    customers: [{
      id: 1,
      name: 'Test Customer',
      openingBalance: 25,
      totalBilled: 500,
      totalSettled: 100,
      balance: 425,
    }],
    settlements: [],
    nextSettlementId: 501,
  };
}

test('a numeric Khata settlement updates the balance and records the payment', () => {
  const db = makeLedger();
  const result = ledger.recordSettlement(db, 1, 50, 'cash', 'Counter payment');

  assert.equal(result.ok, true);
  assert.equal(db.customers[0].totalSettled, 150);
  assert.equal(db.customers[0].balance, 375);
  assert.deepEqual(db.settlements, [result.settlement]);
  assert.deepEqual(result.settlement, {
    id: 501,
    customerId: 1,
    customerName: 'Test Customer',
    date: result.settlement.date,
    amount: 50,
    mode: 'cash',
    note: 'Counter payment',
  });
  assert.match(result.settlement.date, /^\d{2}\/\d{2}\/\d{4}$/);
  assert.equal(db.nextSettlementId, 502);
});

test('a string Khata settlement updates the stored and displayed balances numerically', () => {
  const db = makeLedger();
  const result = ledger.recordSettlement(db, '1', '50');

  assert.equal(result.ok, true);
  assert.equal(db.customers[0].totalSettled, 150);
  assert.equal(db.customers[0].balance, 375);
  assert.equal(ledger.listCustomers(db)[0].balance, 375);
  assert.equal(db.settlements[0].amount, 50);
});
