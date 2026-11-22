const assert = require('node:assert/strict');
const test = require('node:test');
const orders = require('../lib/orders');

test('Order History sorts by calendar date across months', () => {
  const db = {
    orders: [
      { id: 1, date: '30/04/2026' },
      { id: 2, date: '01/05/2026' },
      { id: 3, date: '02/05/2026' },
    ],
  };

  assert.deepEqual(orders.list(db).map(order => order.id), [3, 2, 1]);
});

test('Order History includes both date bounds within one month', () => {
  const db = {
    orders: [
      { id: 1, date: '09/05/2026' },
      { id: 2, date: '10/05/2026' },
      { id: 3, date: '12/05/2026' },
      { id: 4, date: '13/05/2026' },
    ],
  };

  const result = orders.list(db, { from: '2026-05-10', to: '2026-05-12' });
  assert.deepEqual(result.map(order => order.id), [3, 2]);
});

test('Order History includes both endpoints of a cross-month range in newest-first order', () => {
  const db = {
    orders: [
      { id: 1, date: '30/04/2026' },
      { id: 2, date: '01/05/2026' },
    ],
  };

  const result = orders.list(db, { from: '2026-04-30', to: '2026-05-01' });
  assert.deepEqual(result.map(order => order.id), [2, 1]);
});
