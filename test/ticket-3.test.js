const assert = require('node:assert/strict');
const test = require('node:test');
const orders = require('../lib/orders');
const ledger = require('../lib/ledger');

function orderHistory() {
  return {
    orders: [
      { id: 1, date: '30/04/2026' },
      { id: 2, date: '01/05/2026' },
      { id: 3, date: '02/05/2026' },
    ],
  };
}

test('Order History sorts newest first across a month boundary', () => {
  const result = orders.list(orderHistory());

  assert.deepEqual(result.map(order => order.id), [3, 2, 1]);
});

test('Order History sorts same-day orders by descending order ID', () => {
  const db = {
    orders: [
      { id: 1001, date: '22/11/2026' },
      { id: 1002, date: '22/11/2026' },
    ],
  };

  assert.deepEqual(orders.list(db).map(order => order.id), [1002, 1001]);
});

test('Order History includes both endpoints of a date range spanning months', () => {
  const result = orders.list(orderHistory(), {
    from: '2026-04-30',
    to: '2026-05-01',
  });

  assert.deepEqual(result.map(order => order.id).sort(), [1, 2]);
});

test('a string Khata payment adds numerically to the settled total', () => {
  const customer = {
    id: 1,
    name: 'Test Customer',
    openingBalance: 25,
    totalBilled: 500,
    totalSettled: 100,
    balance: 425,
  };
  const db = { customers: [customer], settlements: [], nextSettlementId: 501 };

  const result = ledger.recordSettlement(db, '1', '50', 'upi');

  assert.equal(result.ok, true);
  assert.deepEqual(
    { totalSettled: customer.totalSettled, balance: customer.balance },
    { totalSettled: 150, balance: 375 },
  );
});
