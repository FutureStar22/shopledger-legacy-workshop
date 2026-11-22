# ShopLedger

## Stack

Node.js with CommonJS, Express 4, and body-parser 1.x. The browser UI uses plain HTML, CSS, and JavaScript. Data is stored in a local JSON file.

## Module map

- `server.js` serves `public/`, mounts the API, and serves printable invoices. `config.js` holds shop, tax, inventory, and coupon settings.
- `routes/` contains the products, orders, customers, and reports routers.
- `lib/` handles pricing, tax, coupons, orders, inventory, customer credit, dates, invoices, reports, and persistence.
- `lib/store.js` reads and writes `data/db.json`.

## Commands

- `npm start` runs `node server.js`. The port defaults to 3000 and can be set with `PORT`.
- `npm test` is a placeholder that exits with status 1.
- `node --check <file>` checks JavaScript syntax.

## Rules

- Write characterization tests before changing behaviour.
- Change only the module the ticket is about.
- Tests must never read or write `data/db.json`.
- Add no dependencies.
