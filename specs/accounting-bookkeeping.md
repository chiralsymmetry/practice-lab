# Accounting and Bookkeeping — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, accounting-ledger engine, statement renderer, answer checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Accounting and Bookkeeping

### Topic goal

Develop reliable fluency in turning ordinary business events into balanced accounting records and then tracing those records through ledgers, adjustments, trial balances, and financial statements.

The learner should become able to:

- identify accounts and their normal balances;
- reason from the accounting equation instead of memorizing debit/credit slogans;
- determine which accounts a transaction changes and in which direction;
- construct and interpret compound journal entries;
- post entries to ledgers and calculate balances;
- find what a trial balance can and cannot detect;
- make routine accrual-basis adjusting and closing entries;
- connect entries to profit, cash, assets, liabilities, and equity;
- prepare and reconcile small generated financial statements;
- diagnose omissions, reversals, transpositions, and reconciliation differences.

Repeated practice should improve transactional reasoning and bookkeeping accuracy, not just recognition of static definitions.

### Relationship to neighboring Practice Lab topics

- **Everyday Economics** owns consumer prices, percent changes, interest, inflation, subscriptions, and expected-value numeracy.
- **Algebra Fluency** owns general equation manipulation.
- A future **Business Economics and Administration** app may own budgeting, costing decisions, finance, operations, organization, and management analysis.

Accounting and Bookkeeping owns the double-entry record, accrual timing, ledger-to-statement workflow, and internal consistency of a small entity's books.

### Audience and prerequisites

Early categories assume only:

- signed whole-number and decimal arithmetic;
- addition/subtraction of money;
- reading a small table;
- understanding that a business is distinct from its owner.

Later categories locally introduce:

- percentages and straight-line allocation;
- elapsed months;
- simple interest;
- multi-step statement relationships.

No prior accounting course, spreadsheet, or bookkeeping software is required.

### Scope

The initial model ID is `accounting-bookkeeping-v1`. It includes:

- the accounting entity, period, monetary-unit, going-concern, cost, revenue-recognition, expense-recognition, and materiality ideas only where they affect a generated entry;
- assets, liabilities, equity, revenue, expenses, drawings/dividends, and contra accounts;
- the expanded accounting equation;
- debit/credit mechanics, normal balances, transaction effects, source-document interpretation, and journal entries;
- cash and credit purchases/sales, owner investment, borrowing, repayment, collections, payments, and compound transactions;
- general journal, general ledger/T-accounts, posting references, running balances, trial balances, and suspense/error diagnosis;
- accrual-basis timing and adjusting entries for supplies, prepaid expenses, unearned revenue, accrued revenue, accrued expenses, depreciation, and estimated uncollectible accounts;
- adjusted and post-closing trial balances;
- service-business income statement, statement of owner's equity or retained earnings, classified balance sheet, and a bounded statement-of-cash-flows classification;
- temporary-account closing entries and the accounting cycle;
- merchandising under a pinned **perpetual inventory** profile: inventory purchase, freight-in, purchase return, sale, cost of goods sold, sales return, sales discount, and gross profit;
- straight-line depreciation, disposals at book value/gain/loss, allowance-method receivables, notes and simple accrued interest, and current/noncurrent classification;
- petty cash, bank reconciliation, corrected cash balance, and common bookkeeping errors;
- generated records for small fictional entities, normally one currency and one reporting period.

The intended ceiling is a strong introductory financial-accounting/bookkeeping course. Advanced families emphasize reconstruction and diagnosis rather than specialist standards.

### Exclusions

Do not include:

- jurisdiction-specific GAAP/IFRS disputes, statutory accounts, regulatory filings, audit opinions, or legal compliance;
- tax returns, VAT/GST/sales-tax rules, payroll deductions, pensions, benefits, or employment law;
- real-company statements, current financial data, investment recommendations, credit decisions, or fraud accusations;
- consolidated accounts, foreign-currency translation, derivatives, hedging, leases under specialist standards, deferred tax, pensions, stock compensation, or earnings per share;
- partnership allocation, complex share transactions, treasury stock, bonds at premium/discount, or present-value measurement;
- LIFO/IFRS compatibility questions or jurisdictional inventory-policy advice;
- standard costing, activity-based costing, process/job costing, transfer pricing, capital budgeting, or management-accounting optimization;
- full cash-flow-statement preparation by indirect method in v1;
- open-ended “Which account name would your company use?” prompts;
- bookkeeping-software/vendor workflows or live connections to financial accounts;
- advice that a generated entry is sufficient for real books.

### Normative accounting model

#### Entity profiles

Each question declares one profile and never mixes profile-specific equity accounts:

**Sole proprietor (default)**

```text
Owner's Capital
Owner's Drawings
```

**Corporation (optional)**

```text
Common Stock
Retained Earnings
Dividends
```

Owner purchases for personal use are drawings, not business expenses. Business and owner cash are never silently combined.

#### Accounting equation and debit/credit convention

```text
Assets = Liabilities + Equity

Expanded:
Assets = Liabilities + contributed capital
         + revenues - expenses - drawings/dividends
```

“Debit” means the left side of an account and “credit” the right side. They do not mean good/bad, increase/decrease, or cash in/cash out by themselves.

Normal increases:

| Account class | Increase | Decrease | Normal balance |
|---|---:|---:|---:|
| Asset | Debit | Credit | Debit |
| Contra asset | Credit | Debit | Credit |
| Liability | Credit | Debit | Credit |
| Equity/contributed capital | Credit | Debit | Credit |
| Revenue | Credit | Debit | Credit |
| Expense | Debit | Credit | Debit |
| Drawings/dividends | Debit | Credit | Debit |
| Contra revenue | Debit | Credit | Debit |

Every journal entry must have total debits equal total credits. Equal totals are necessary but do not prove that the accounts, amounts, period, or direction are correct.

#### Recognition basis

Unless a prompt explicitly compares bases, the app uses simplified accrual accounting:

- recognize revenue when the declared performance is completed;
- recognize an expense when the resource is consumed or obligation incurred;
- receiving or paying cash may occur earlier, at the same time, or later;
- cash-basis answers are accepted only in a question explicitly asking for cash basis.

No generated scenario requires unstated professional judgment. Dates, performance completion, consumption, ownership transfer, estimates, and materiality policy are supplied when relevant.

#### Merchandising profile

Merchandising questions use a perpetual inventory system unless “periodic comparison” is explicitly named.

- inventory purchases debit `Inventory`;
- freight-in paid by the buyer and capitalized under the scenario debits `Inventory`;
- a sale records both revenue and cost sides;
- sales returns reverse both sides when goods are returned in resalable condition;
- purchase returns reduce `Inventory`;
- seller-granted prompt-payment discounts use the **gross method** and reduce `Sales Discounts`/receivable as displayed by the pinned chart;
- customer sales tax is excluded in v1.

The prompt states shipping terms whenever ownership/freight treatment is tested.

#### Estimates and allocations

- straight-line depreciation:

  ```text
  (cost - residual value) / useful life
  ```

- accumulated depreciation is a contra asset; depreciation never directly credits the asset in the default profile;
- allowance-method bad-debt adjustments use `Bad Debt Expense` and `Allowance for Doubtful Accounts`;
- simple note interest:

  ```text
  principal × annual rate × time in years
  ```

- one year is 12 months; month fractions are exact `months/12`;
- estimates are generated policy inputs, not claims about real appropriate rates.

#### Money, dates, and rounding

- Semantic monetary values use exact decimal or rational arithmetic.
- Currency has a configured minor-unit precision, normally two decimals.
- Display rounds half away from zero only at the stage stated by the question.
- Journal and ledger amounts are non-negative; debit/credit column conveys direction.
- Dates use an unambiguous locale-rendered format backed by ISO dates.
- An accounting period has explicit start/end dates.
- Entries on the final day are included in that period.
- No question depends on an unstated day-count convention.

### Controlled chart of accounts

The app uses semantic account IDs mapped to localized display names. Core IDs:

```text
cash
accounts_receivable
allowance_doubtful_accounts
notes_receivable
interest_receivable
inventory
supplies
prepaid_insurance
prepaid_rent
equipment
vehicles
accumulated_depreciation_equipment
accounts_payable
wages_payable
interest_payable
unearned_revenue
notes_payable
owner_capital | common_stock
owner_drawings | dividends
retained_earnings
service_revenue
sales_revenue
sales_returns_allowances
sales_discounts
interest_revenue
rent_expense
wages_expense
supplies_expense
insurance_expense
utilities_expense
depreciation_expense
bad_debt_expense
interest_expense
cost_of_goods_sold
gain_on_disposal
loss_on_disposal
bank_fee_expense
cash_short_over
income_summary
```

A scenario may introduce another account only by providing its class, normal balance, and meaning. Synonyms are localized display aliases, not different semantic answers. The checker should accept a displayed synonym only if it maps unambiguously to the expected ID.

### Global answer conventions

- Surrounding whitespace and harmless capitalization differences are ignored for typed account names.
- Account selection should normally use semantic autocomplete or structured rows, not exact free-form spelling.
- Journal answers use rows `{accountId, side, amount}`.
- Row order is semantically irrelevant except that rendered conventional form places debits before indented credits.
- Multiple rows for the same account may be combined unless the task explicitly tests source-line posting.
- Zero-amount rows are ignored for checking and should not be generated.
- Total debit and credit fields are exact to currency precision.
- Ledger balances include a side (`debit`, `credit`, or `zero`); a signed number alone is not used to hide side semantics.
- Statement classifications use controls; monetary subtotals accept exact fractions/decimals that round to the canonical displayed value.
- Parentheses may represent a deduction/negative statement amount, but journal-entry amount cells never accept negative values.
- A semantically correct compound entry with equivalent line combination is accepted.
- An entry using a different but plausible real-world account is not accepted when the controlled chart specifies the intended account; feedback explains the profile.

### Difficulty philosophy

Difficulty should increase through:

- moving from account class to a specific account;
- separating economic event, recognition time, and cash time;
- coordinating two or more equation effects;
- constructing rather than selecting an entry;
- posting across several accounts and periods;
- distinguishing adjusting, correcting, and closing entries;
- reconstructing missing values from invariant relationships;
- tracing one transaction through journal, ledger, trial balance, and statements;
- diagnosing balanced-but-wrong entries;
- combining merchandise revenue and cost flows;
- handling contra accounts, estimates, and partial periods.

It must not increase through giant ledgers, excessive arithmetic, deliberately obscure account names, unreadable source documents, unstated policy choices, penny-level busywork, trick dates, or jurisdiction-specific trivia.

### Shared family contract

Every family below includes:

- **Task**: trainable operation and its relationship to bookkeeping skill;
- **Response/template**: semantic interaction and preferred wording;
- **Derivation**: normative accounting algorithm;
- **Difficulty**: meaningful reasoning dimensions;
- **Misconceptions/constraints**: distractors, accepted variations, and rejection rules;
- **Feedback**: decisive rule and worked path;
- **Examples**: at least three instantiated cases;
- **Validation/coverage**: independent oracle and distribution obligations.

All prompts, account choices, entries, ledgers, balances, statements, and feedback derive from one immutable transaction model. Reject scenarios with ambiguous recognition, multiple unsupported account policies, duplicate choices, immaterial zero effects, impossible dates, or arithmetic that dominates the accounting operation.

## 2. Category: Accounts, normal balances, and the accounting equation

### Category purpose

Build a structural model of accounts and debit/credit effects before asking the learner to compose entries.

### Learn

Assets are resources controlled by the entity; liabilities are present obligations; equity is the residual. Revenue increases equity through earned activity, while expenses and drawings/dividends decrease equity for different reasons.

Debit is left and credit is right. Assets, expenses, and drawings/dividends normally increase by debit. Liabilities, equity, and revenue normally increase by credit. Contra accounts reverse the normal balance of the related class.

### Prerequisites

Signed arithmetic and the idea that the entity is separate from its owner.

### Category boundaries

This category classifies and predicts effects. Complete transaction recording begins in Category 3.

### Subcategories

1. Account meaning and class
2. Normal balances
3. Expanded accounting equation
4. Transaction-level equation effects

### Common misconceptions

- Debit means decrease or bad; credit means increase or good.
- Every receipt of cash is revenue.
- Every payment is an expense.
- Drawings/dividends are business expenses.
- Accounts receivable is revenue rather than an asset.
- Unearned revenue is already revenue rather than a liability.
- Accumulated depreciation is a liability.
- A balanced equation means net income must be zero.

### Family `account_classify`

**Task.** Classify a named account as asset, contra asset, liability, equity, revenue, expense, drawings/dividends, or contra revenue.

**Response/template.** Single choice: `In the {entity_profile} chart, what class is {account}?`

**Derivation.** Resolve semantic account ID and declared profile; return its ledger class.

**Difficulty.** L1 cash/payable/revenue; L2 prepaid/unearned/drawings; L3 contra accounts; L4 unfamiliar but explicitly defined account.

**Misconceptions/constraints.** Distractors follow word associations such as treating “unearned revenue” as revenue. Never rely on account number conventions.

**Feedback.** Define what the balance represents and show its equation side.

**Examples.**

1. Accounts Receivable → asset. L1.
2. Unearned Revenue → liability because performance is still owed. L2.
3. Accumulated Depreciation—Equipment → contra asset. L3.

**Validation/coverage.** Chart schema lookup; balance every account class and profile.

### Family `normal_balance_identify`

**Task.** State the normal debit/credit balance of an account.

**Response/template.** Debit/credit choice: `What is the normal balance of {account}?`

**Derivation.** Map account class through the normative normal-balance table.

**Difficulty.** L1 basic balance-sheet accounts; L2 revenues/expenses/equity withdrawals; L3 contra accounts; L4 mixed rapid classification.

**Misconceptions/constraints.** Choices are sides, not signs. Do not infer from a temporary abnormal actual balance.

**Feedback.** State class, normal increase side, and normal balance.

**Examples.**

1. Cash → debit. L1.
2. Service Revenue → credit. L1.
3. Sales Returns and Allowances → debit because it is contra revenue. L3.

**Validation/coverage.** Account-class/normal-side invariant.

### Family `account_increase_decrease_side`

**Task.** Choose debit or credit to increase/decrease a named account.

**Response/template.** Side choice: `To {increase_or_decrease} {account}, use a ____.`

**Derivation.** Find normal side; increase uses it and decrease uses the opposite.

**Difficulty.** L1 increase common account; L2 decrease; L3 contra account; L4 mixed profile and direction.

**Misconceptions/constraints.** Distractors target “debit always increases.” Prompt always supplies one direction.

**Feedback.** `Account class → normal side → requested direction`.

**Examples.**

1. increase Equipment → debit. L1.
2. decrease Accounts Payable → debit. L2.
3. increase Allowance for Doubtful Accounts → credit. L3.

**Validation/coverage.** Truth table across every class and direction.

### Family `account_equation_side`

**Task.** Place an account/effect in the expanded accounting equation.

**Response/template.** Matching to `A`, `L`, contributed equity, `+R`, `−E`, or `−D`.

**Derivation.** Use account class and the expanded equation, retaining contra direction.

**Difficulty.** L1 assets/liabilities; L2 revenue/expense; L3 drawings and contra accounts; L4 infer a missing label.

**Misconceptions/constraints.** Expenses are not liabilities; revenue is not an asset. Contra accounts are displayed as reductions of their related class.

**Feedback.** Render the account under the relevant equation component.

**Examples.**

1. Supplies → Assets. L1.
2. Wages Expense → `− expenses` within equity. L2.
3. Owner's Drawings → `− drawings` within equity. L2.

**Validation/coverage.** Equation-component schema.

### Family `equation_missing_amount`

**Task.** Solve a missing total in `Assets=Liabilities+Equity`.

**Response/template.** Money input: `Given A={assets}, L={liabilities}, find E.`

**Derivation.** Rearrange the equation exactly.

**Difficulty.** L1 one missing total; L2 negative equity; L3 expanded components; L4 reconstruct after several changes.

**Misconceptions/constraints.** Negative equity is allowed when explicitly generated. Reject pure arithmetic clutter.

**Feedback.** Substitute values into the labeled equation.

**Examples.**

1. A=80,000 and L=30,000 → E=50,000. L1.
2. A=20,000 and L=27,000 → E=−7,000. L2.
3. beginning capital40,000 + revenue12,000 − expenses7,000 − drawings2,000 → ending equity43,000. L3.

**Validation/coverage.** Exact equation solve and round trip.

### Family `transaction_equation_effect`

**Task.** Identify all accounting-equation changes caused by one transaction.

**Response/template.** Structured changes: `{component/account}: increase/decrease {amount}`.

**Derivation.** Recognize what the entity receives/gives or earns/incurs, then apply the equality-preserving effects.

**Difficulty.** L1 two balance-sheet effects; L2 revenue/expense; L3 three effects; L4 cash timing distractors.

**Misconceptions/constraints.** The event must have a unique recognition interpretation. Reject questions answerable only from “cash went up.”

**Feedback.** Narrate value received, source/sacrifice, and equation preservation.

**Examples.**

1. owner invests10,000 cash → Assets +10,000; Equity +10,000. L1.
2. buy supplies2,000 on account → Assets +2,000; Liabilities +2,000. L1.
3. perform service5,000, collect3,000 and bill2,000 → Cash +3,000; A/R +2,000; Revenue/Equity +5,000. L3.

**Validation/coverage.** Semantic transaction event produces balanced equation deltas.

### Family `profit_cash_equity_distinguish`

**Task.** Decide whether a transaction affects profit, cash, and/or owner equity.

**Response/template.** Three yes/no fields with optional direction.

**Derivation.** Profit changes only through recognized revenue/expense; cash changes through cash account; total equity also changes through owner transactions.

**Difficulty.** L1 cash revenue/expense; L2 credit/accrual; L3 investment/drawings; L4 loan principal versus interest.

**Misconceptions/constraints.** Borrowing is not revenue; owner investment is not profit; collecting receivables is not new revenue.

**Feedback.** Separate cash flow, profit recognition, and direct equity contribution/distribution.

**Examples.**

1. borrow20,000 cash → cash yes, profit no, equity no. L2.
2. collect an existing receivable → cash yes, profit no, equity no. L2.
3. earn4,000 on account → cash no, profit +4,000, equity +4,000. L2.

**Validation/coverage.** Independent cash/profit/equity flags from event model.

### Family `contra_account_net_amount`

**Task.** Compute a net carrying/presentation amount from an account and its contra account.

**Response/template.** Money input or two-line display: `Find net {asset_or_revenue}.`

**Derivation.** Subtract the contra balance from its related gross account.

**Difficulty.** L1 equipment/accumulated depreciation; L2 receivable/allowance; L3 sales/returns/discounts; L4 reconstruct missing contra.

**Misconceptions/constraints.** Do not classify the contra as a liability/expense solely because it has a credit/debit balance.

**Feedback.** Show gross, less contra, equals net.

**Examples.**

1. Equipment50,000 less Accumulated Depreciation12,000 → book value38,000. L1.
2. A/R20,000 less Allowance800 → net realizable value19,200. L2.
3. Sales100,000 less Returns3,000 and Discounts1,000 → net sales96,000. L3.

**Validation/coverage.** Exact presentation equation and inverse cases.

### Cross-family progression

Classification precedes normal balance and directional side. Equation placement and missing amounts establish structure before full transactions. Transaction effects then connect the equation to profit/cash distinctions. Contra-account practice is delayed until ordinary account behavior is reliable, then interleaved as a controlled exception.

## 3. Category: Transaction analysis and journal entries

### Category purpose

Turn fully specified economic events into complete, balanced double-entry records.

### Learn

Ask four questions:

1. What happened to the entity?
2. Which accounts represent it?
3. Did each account increase or decrease?
4. Which side records that change?

Then verify total debits equal total credits. Cash movement alone does not determine revenue or expense recognition.

### Prerequisites

Category 2 account classes, normal balances, equation effects, and entity separation.

### Category boundaries

This category records ordinary unadjusted service-business transactions. Period-end adjustments, merchandise cost flows, and corrections are introduced later.

### Subcategories

1. Source facts and account selection
2. Simple entries
3. Credit and settlement entries
4. Compound entries
5. Entry interpretation and validation

### Common misconceptions

- Recording only the cash side.
- Treating borrowing as revenue or principal repayment as expense.
- Recognizing revenue again when a receivable is collected.
- Treating a prepaid asset as immediate expense without a stated policy.
- Recording owner withdrawals as wages or other expense.
- Balancing an entry by inventing a plug account.
- Using negative amounts instead of the opposite journal side.

### Family `source_document_event`

**Task.** Infer the accounting event from a small fictional source document.

**Response/template.** Event/account selection: `What event does this {invoice,receipt,memo,bank_notice} support?`

**Derivation.** Read issuer/recipient, date, terms, quantity/service status, and payment status; map to the declared entity.

**Difficulty.** L1 cash receipt; L2 supplier/customer invoice; L3 entity perspective; L4 distinguish order/quote from recognized event.

**Misconceptions/constraints.** Documents visibly state whether goods/services were delivered. A purchase order alone never proves receipt.

**Feedback.** Highlight the document fields that establish parties, timing, and amount.

**Examples.**

1. bank receipt for cash deposited from completed service → cash service transaction. L1.
2. supplier invoice marked “goods received, due in30 days” → purchase on account. L2.
3. customer purchase order for next month with no delivery → no entry yet under supplied policy. L3.

**Validation/coverage.** Document schema maps to event; ensure entity-perspective reversals.

### Family `accounts_affected_select`

**Task.** Select every account affected by a transaction without yet assigning sides.

**Response/template.** Multiple choice: `Which accounts change when {transaction}?`

**Derivation.** Translate resources, obligations, performance, consumption, and owner actions into chart IDs.

**Difficulty.** L1 two accounts; L2 accrual/cash timing; L3 three accounts; L4 choose no entry.

**Misconceptions/constraints.** Choices include plausible cash/revenue, payable/expense, and owner/entity confusions. Exactly one account set is supported.

**Feedback.** Explain why each selected account represents part of the event.

**Examples.**

1. pay an existing account payable → Cash and Accounts Payable. L1.
2. owner withdraws cash → Cash and Owner's Drawings. L2.
3. perform service partly cash/partly credit → Cash, Accounts Receivable, Service Revenue. L3.

**Validation/coverage.** Event-to-account-set oracle.

### Family `journal_entry_simple`

**Task.** Construct a two-account journal entry.

**Response/template.** Two structured rows: `Record: {transaction}.`

**Derivation.** Identify two account changes, map increases/decreases to sides, and use the same exact amount.

**Difficulty.** L1 asset/equity or asset/revenue; L2 asset exchange; L3 liability settlement; L4 contra-account effect.

**Misconceptions/constraints.** Reject transactions needing adjustments or policy judgment. Distractors swap both sides, which balances but is wrong.

**Feedback.** Show account class and increase/decrease before formatted entry.

**Examples.**

1. owner invests5,000 cash → Dr Cash5,000; Cr Owner's Capital5,000. L1.
2. buy equipment3,000 for cash → Dr Equipment3,000; Cr Cash3,000. L2.
3. pay1,200 owed to supplier → Dr Accounts Payable1,200; Cr Cash1,200. L2.

**Validation/coverage.** Journal balance plus exact semantic delta match.

### Family `journal_entry_credit_transaction`

**Task.** Record revenue earned or an asset/expense acquired on account.

**Response/template.** Structured journal rows.

**Derivation.** Recognize before cash: debit receivable for earned unpaid revenue, or credit payable for an incurred unpaid purchase/expense.

**Difficulty.** L1 service on account; L2 asset on account; L3 expense incurred; L4 distinguish unearned/earned.

**Misconceptions/constraints.** Do not use Cash. “On account” direction is tied to whether entity is customer or supplier.

**Feedback.** State who owes whom after the event.

**Examples.**

1. services performed2,400 on account → Dr A/R2,400; Cr Service Revenue2,400. L1.
2. buy supplies900 on account → Dr Supplies900; Cr A/P900. L2.
3. receive utility service bill300, unpaid → Dr Utilities Expense300; Cr A/P300. L2.

**Validation/coverage.** Counterparty-obligation invariant.

### Family `journal_entry_settlement`

**Task.** Record collection of receivable or payment of payable.

**Response/template.** Structured journal rows: `Record settlement of the existing {receivable_or_payable}.`

**Derivation.** Exchange cash with the existing balance-sheet account; do not recognize the original revenue/expense again.

**Difficulty.** L1 full collection/payment; L2 partial; L3 amount plus discount excluded; L4 distinguish advance.

**Misconceptions/constraints.** Entry metadata references the originating balance. Payment cannot exceed balance unless an explicit advance exists.

**Feedback.** Link to original recognition and show why profit is unchanged now.

**Examples.**

1. collect1,000 from customer on account → Dr Cash; Cr A/R. L1.
2. pay600 of a1,400 supplier balance → Dr A/P600; Cr Cash600. L2.
3. collection of a receivable does not credit revenue again. L1.

**Validation/coverage.** Subledger balance bounds and no-profit-effect check.

### Family `journal_entry_cash_timing`

**Task.** Record cash received before earning or cash paid before consumption.

**Response/template.** Structured journal rows with timing label.

**Derivation.** Advance receipt creates/increases a liability; advance payment creates/increases an asset.

**Difficulty.** L1 customer advance; L2 prepaid rent/insurance; L3 partial immediate performance; L4 distinguish refundable deposit under explicit terms.

**Misconceptions/constraints.** Do not recognize revenue/expense merely because cash moved. Future benefit/obligation must be stated.

**Feedback.** State what remains owed or available after cash changes.

**Examples.**

1. receive1,800 for services next month → Dr Cash; Cr Unearned Revenue. L1.
2. pay2,400 for twelve future months of insurance → Dr Prepaid Insurance; Cr Cash. L2.
3. receive3,000, of which1,000 is earned immediately → Dr Cash3,000; Cr Revenue1,000; Cr Unearned Revenue2,000. L3.

**Validation/coverage.** Recognition schedule produces current earned/unearned split.

### Family `journal_entry_borrow_repay`

**Task.** Record borrowing, principal repayment, or repayment with separately stated interest.

**Response/template.** Two/three structured rows.

**Derivation.** Borrowing increases Cash and Notes Payable. Principal repayment decreases the liability; interest is expense for the declared period.

**Difficulty.** L1 borrow; L2 principal only; L3 principal+interest; L4 calculate simple interest for exact months.

**Misconceptions/constraints.** Loan proceeds are not revenue; principal is not expense. No amortized loan schedule.

**Feedback.** Split financing principal from cost of borrowing.

**Examples.**

1. borrow10,000 by signing note → Dr Cash; Cr Notes Payable. L1.
2. repay2,000 principal → Dr Notes Payable; Cr Cash. L2.
3. pay5,000 principal plus200 interest → Dr Notes Payable5,000; Dr Interest Expense200; Cr Cash5,200. L3.

**Validation/coverage.** Liability roll-forward and cash total.

### Family `journal_entry_owner_equity`

**Task.** Record owner/shareholder contribution or withdrawal/distribution under the declared profile.

**Response/template.** Structured journal rows.

**Derivation.** Contributions credit profile-specific contributed equity; distributions debit drawings/dividends and reduce Cash or another distributed asset.

**Difficulty.** L1 cash investment; L2 noncash asset; L3 drawings/dividends; L4 distinguish owner service/payment.

**Misconceptions/constraints.** Never mix Capital with Common Stock or Drawings with Dividends. Owner withdrawal is not expense.

**Feedback.** Show direct equity effect outside profit.

**Examples.**

1. proprietor contributes8,000 cash → Dr Cash; Cr Owner's Capital. L1.
2. proprietor takes500 cash personally → Dr Owner's Drawings; Cr Cash. L2.
3. corporation declares/pays a simplified cash dividend in one explicitly combined event → Dr Dividends; Cr Cash. L3.

**Validation/coverage.** Entity-profile account constraint and profit-effect false.

### Family `journal_entry_compound`

**Task.** Construct a balanced entry with three or four affected accounts.

**Response/template.** Variable-length structured journal.

**Derivation.** Partition the transaction amount by payment/recognition components; assign each account side; verify totals.

**Difficulty.** L1 one debit/two credits; L2 two debits/one credit; L3 mixed cash+credit; L4 supplied fee/interest or asset disposal later.

**Misconceptions/constraints.** Component amounts must sum exactly and remain visible. Reject entries requiring plug balancing.

**Feedback.** Show amount partition before sides.

**Examples.**

1. buy equipment10,000, pay4,000 cash and owe6,000 → Dr Equipment10,000; Cr Cash4,000; Cr A/P6,000. L2.
2. earn5,000, receive2,000 cash and bill3,000 → Dr Cash2,000; Dr A/R3,000; Cr Revenue5,000. L2.
3. pay payable1,500 plus late fee50 → Dr A/P1,500; Dr fee expense50; Cr Cash1,550. L3.

**Validation/coverage.** Entry vector exactly equals semantic transaction deltas.

### Family `journal_entry_interpret`

**Task.** Infer the business event and financial effects represented by a supplied entry.

**Response/template.** Scenario choice plus profit/cash/equation effects.

**Derivation.** Read account sides as increases/decreases, combine them into one coherent event, and reject narratives with wrong timing.

**Difficulty.** L1 simple entry; L2 settlement/prepayment; L3 compound; L4 multiple plausible narratives narrowed by metadata.

**Misconceptions/constraints.** The prompt supplies enough context for one intended event class; it does not grade arbitrary prose.

**Feedback.** Translate each row, then synthesize.

**Examples.**

1. Dr Cash / Cr A/R → collection from customer, no new revenue. L1.
2. Dr Prepaid Insurance / Cr Cash → advance purchase of future coverage. L2.
3. Dr Cash2,000; Dr A/R1,000; Cr Revenue3,000 → service earned, partly cash and credit. L2.

**Validation/coverage.** Candidate narratives generated from reversible event templates.

### Family `journal_entry_audit`

**Task.** Decide whether a proposed entry is correct and identify its first substantive error.

**Response/template.** Valid/invalid plus error type/account/amount.

**Derivation.** Compare proposed rows to independent semantic deltas; separately test balance, accounts, directions, amounts, and period.

**Difficulty.** L1 unbalanced; L2 sides reversed; L3 balanced wrong accounts; L4 correct amounts in wrong period or missing line.

**Misconceptions/constraints.** A balanced entry is not automatically correct. Generate exactly one primary intended defect unless multi-error audit is explicitly requested.

**Feedback.** A requirements table shows balance and semantic agreement.

**Examples.**

1. Dr Cash500; Cr Revenue450 → unbalanced by50. L1.
2. Dr Cash1,000; Cr Revenue1,000 for loan proceeds → balanced but wrong credit; should be Notes Payable. L2.
3. Dr Expense600; Cr Cash600 for paying an existing payable → repeats expense; debit A/P. L3.

**Validation/coverage.** Mutation-based defects with exactly one labeled root cause.

### Cross-family progression

Event/source interpretation and account selection precede entry construction. Simple entries establish the four-question method, then credit timing, settlements, advances, financing, and owner transactions are interleaved. Compound entries add partitioning only after sides are reliable. Interpretation and audit reverse the task and prevent “balance by pattern” behavior.

## 4. Category: Ledgers, posting, and trial balances

### Category purpose

Trace journal entries into account histories and use ledger invariants to calculate, reconcile, and diagnose balances.

### Learn

The journal records events chronologically; the ledger groups their effects by account. Posting copies each journal line to its account and preserves date, side, amount, and reference. A trial balance lists ending ledger balances and compares total debits with total credits.

A balanced trial balance can still contain omissions, duplicate entries, wrong accounts, or equal debit/credit reversals.

### Prerequisites

Balanced journal entries and normal balances.

### Category boundaries

This category uses supplied entries and unadjusted balances. Period-end accrual adjustments and closing appear later.

### Subcategories

1. Posting and T-accounts
2. Running and ending balances
3. Journal-ledger reconciliation
4. Trial-balance construction
5. Error detection limits

### Common misconceptions

- Summing debits and credits without netting sides.
- Treating a credit balance as a negative amount without naming the side.
- Posting only one line of an entry.
- Assuming journal order changes an ending balance.
- Assuming equal trial-balance totals prove all records correct.
- Including zero-balance accounts as unexplained differences.

### Family `post_entry_to_ledger`

**Task.** Post one journal entry to the correct ledger accounts.

**Response/template.** Matching rows `{account,date,side,amount,reference}`.

**Derivation.** Copy each journal line unchanged to its semantic account; preserve side and shared reference.

**Difficulty.** L1 two lines; L2 compound; L3 similar account names; L4 identify one omitted/misposted line.

**Misconceptions/constraints.** Posting never changes debit/credit side. References are synthetic and unambiguous.

**Feedback.** Highlight each journal line and destination ledger row.

**Examples.**

1. Dr Supplies300/Cr Cash300 posts a debit to Supplies and credit to Cash. L1.
2. a three-line service entry creates three ledger rows with one journal reference. L2.
3. posting Revenue to A/R because both appeared in the entry is a destination error. L3.

**Validation/coverage.** Referential integrity from journal line to ledger row.

### Family `t_account_ending_balance`

**Task.** Calculate an account's ending balance and side from opening balance and postings.

**Response/template.** Amount plus debit/credit/zero.

**Derivation.** Sum debit column and credit column including opening balance; subtract smaller from larger and label the larger side.

**Difficulty.** L1 normal-side postings; L2 both sides; L3 abnormal balance; L4 missing posting reconstruction.

**Misconceptions/constraints.** Do not assume the normal side wins. Limit to six postings.

**Feedback.** Show debit total, credit total, difference, and side.

**Examples.**

1. Cash opening Dr2,000, debits800, credits500 → Dr2,300. L1.
2. A/P opening Cr1,200, credit400, debit1,000 → Cr600. L2.
3. Expense credits exceeding debits can produce an abnormal credit balance that should be reported, not silently flipped. L3.

**Validation/coverage.** Signed internal ledger arithmetic and side conversion.

### Family `running_balance_trace`

**Task.** Complete a chronological running-balance ledger.

**Response/template.** Ordered balance cells after each posting.

**Derivation.** Apply each debit/credit to current signed balance in date/reference order.

**Difficulty.** L1 all normal direction; L2 mixed; L3 crosses zero; L4 locate first wrong displayed balance.

**Misconceptions/constraints.** Same-date order is explicitly numbered when interim balance matters.

**Feedback.** One row-by-row update with side.

**Examples.**

1. Cash Dr1,000 then Cr300 → Dr700. L1.
2. A/P Cr500 then Dr500 → zero. L2.
3. Cash Dr200 then Cr350 crosses to Cr150 abnormal. L3.

**Validation/coverage.** Sequential state machine and final total cross-check.

### Family `ledger_missing_posting`

**Task.** Infer a missing ledger posting from a journal, ending balance, or counterpart account.

**Response/template.** account/side/amount/reference fields.

**Derivation.** Compare journal-line set with ledger postings or solve the balance equation.

**Difficulty.** L1 one absent line; L2 compound entry; L3 amount inferred; L4 ambiguous candidates eliminated by references.

**Misconceptions/constraints.** Instance must have exactly one missing semantic line. Reject coincident equal amounts without useful references.

**Feedback.** Show the unmatched journal line or balance gap.

**Examples.**

1. journal Cr Cash400 absent from Cash ledger → missing credit400. L1.
2. compound entry has two debits posted but one credit unposted → infer from journal reference. L2.
3. ending balance is100 too high; a supported missing Cash credit100 closes the gap. L3.

**Validation/coverage.** Set-difference and ledger-equation oracles agree.

### Family `trial_balance_prepare`

**Task.** Build an unadjusted trial balance from ending ledger balances.

**Response/template.** Account rows assigned to debit/credit columns plus totals.

**Derivation.** Include each nonzero ending balance once on its actual side and total columns.

**Difficulty.** L1 five accounts normal; L2 contra/temporary; L3 abnormal balance; L4 one missing ledger amount.

**Misconceptions/constraints.** Trial balance is not the accounting equation layout. No negative cells.

**Feedback.** Link each trial-balance row to its ledger ending side.

**Examples.**

1. Cash Dr5,000 goes in debit column. L1.
2. Accumulated Depreciation Cr2,000 goes in credit column despite being related to an asset. L2.
3. an abnormal Cash credit is placed in credit, then flagged for investigation. L3.

**Validation/coverage.** Ledger-to-trial mapping and equality.

### Family `trial_balance_missing_value`

**Task.** Calculate one missing trial-balance balance or total.

**Response/template.** Money amount and column/side where needed.

**Derivation.** Sum known debit/credit columns and solve equality, constrained by the account's displayed side/class.

**Difficulty.** L1 missing total; L2 missing account amount; L3 missing side; L4 do not “plug” when source data are inconsistent.

**Misconceptions/constraints.** If more than one unknown exists, additional ledger information makes it unique.

**Feedback.** Show column subtotals and the exact difference.

**Examples.**

1. known debits9,000 and credits7,500 → missing credit1,500. L1.
2. A/P amount missing in credit column; equality requires2,200. L2.
3. two unknown rows without further facts → “cannot determine,” only when this is the tested answer. L3.

**Validation/coverage.** Linear constraint solve and uniqueness test.

### Family `trial_balance_error_detectability`

**Task.** Decide whether an error will make trial-balance totals unequal.

**Response/template.** Detectable/not detectable plus reason.

**Derivation.** Apply the erroneous posting and compare total debit/credit changes.

**Difficulty.** L1 one-sided omission; L2 complete omission/duplicate; L3 wrong account/sides reversed; L4 compensating errors.

**Misconceptions/constraints.** “Not detectable” means not revealed by equality alone, not acceptable.

**Feedback.** Show debit-total and credit-total effect separately.

**Examples.**

1. omit only the credit line of a500 entry → detectable, totals differ500. L1.
2. omit the entire balanced entry → not detectable by trial-balance equality. L2.
3. debit the wrong asset for the correct amount while credit is correct → still balances, not detectable. L2.

**Validation/coverage.** Mutate ledger and compare column deltas.

### Family `transposition_slide_error`

**Task.** Use a trial-balance difference to test plausible transposition or decimal-place errors.

**Response/template.** Error candidate/yes-no: `Could {recorded_vs_correct} explain difference {difference}?`

**Derivation.** Calculate signed posting error; a digit transposition difference is divisible by9, but divisibility is evidence, not proof.

**Difficulty.** L1 direct difference; L2 select candidate; L3 side affects doubled difference; L4 multiple hypotheses.

**Misconceptions/constraints.** Never claim “divisible by9 proves transposition.” Amounts use fixed currency precision.

**Feedback.** Recompute the expected column difference from the candidate error.

**Examples.**

1. 64 posted as46 creates difference18, consistent with a transposition. L1.
2. trial difference90 may be consistent with 540 recorded as450 but does not prove it. L2.
3. posting a debit amount to the credit side can create twice the amount difference. L3.

**Validation/coverage.** Exact mutation arithmetic and cautious inference label.

### Cross-family progression

Posting establishes journal-to-ledger correspondence. T-account and running balances follow, then missing-post reconstruction. Trial-balance preparation introduces column equality; detectability and transposition questions immediately limit overconfidence in that equality.

## 5. Category: Accruals and adjusting entries

### Category purpose

Place revenue and expense in the correct accounting period and update related assets, liabilities, and estimates.

### Learn

At period end, some cash transactions have not yet been earned or consumed, and some earned/incurred amounts have not yet produced cash or invoices. An adjusting entry normally changes one income-statement account and one balance-sheet account; it does not normally use Cash.

For a deferral, begin with an existing asset or liability and recognize the consumed/earned part. For an accrual, recognize revenue/expense and a receivable/payable before cash.

### Prerequisites

Journal entries, accrual recognition, prepaid/unearned accounts, ledgers, and reporting dates.

### Category boundaries

This category handles simplified period-end adjustments and estimates. Correcting erroneous entries is separate; tax and audit adjustments are excluded.

### Subcategories

1. Adjustment need and timing
2. Deferred expenses and revenues
3. Accrued revenues and expenses
4. Depreciation and bad-debt estimates
5. Adjusted balances and reversals

### Common misconceptions

- Using Cash in a noncash period-end adjustment.
- Adjusting the entire original amount instead of the consumed/earned remainder.
- Confusing an accrual with a deferral.
- Crediting Prepaid Expense when recording the original prepayment under the asset method.
- Debiting Unearned Revenue for more than its balance.
- Treating accumulated depreciation as cash reserved for replacement.
- Writing off estimated bad debts directly from A/R in the allowance adjustment.

### Family `adjustment_needed_classify`

**Task.** Decide whether a stated period-end fact requires an adjustment and classify it.

**Response/template.** No adjustment / prepaid expense / unearned revenue / accrued revenue / accrued expense / estimate.

**Derivation.** Compare recorded state with resources consumed, performance completed, obligations incurred, and period end.

**Difficulty.** L1 clear deferral/accrual; L2 partly elapsed; L3 invoice after close; L4 already recorded or immaterial-policy fact.

**Misconceptions/constraints.** Prompt explicitly states what was initially recorded. Reject facts with uncertain performance.

**Feedback.** Contrast books before adjustment with economic status at period end.

**Examples.**

1. supplies on hand differ from Supplies balance → prepaid-expense adjustment. L1.
2. December wages paid in January and unrecorded → accrued expense. L2.
3. a December invoice already recorded in December → no further adjustment. L2.

**Validation/coverage.** Recognition timeline classifier.

### Family `adjust_prepaid_expense`

**Task.** Calculate and record expiration/consumption of a prepaid asset.

**Response/template.** Journal rows plus remaining asset.

**Derivation.** Determine used portion from time/usage; Dr related Expense, Cr Prepaid account.

**Difficulty.** L1 used amount supplied; L2 equal monthly allocation; L3 partial remaining; L4 asset-method versus explicitly compared expense method.

**Misconceptions/constraints.** Count covered months using declared start convention. Never credit Cash in the adjustment.

**Feedback.** `Beginning prepaid + additions − ending prepaid = expense used` where applicable.

**Examples.**

1. Supplies balance900, count shows250 remaining → Dr Supplies Expense650; Cr Supplies650. L1.
2. 12-month insurance2,400 begins Oct1; Dec31 adjustment for3 months →600. L2.
3. Prepaid Rent remaining1,200 after600 expired → expense adjustment600. L2.

**Validation/coverage.** Schedule and balance-roll-forward oracles.

### Family `adjust_unearned_revenue`

**Task.** Record the portion of an advance that has now been earned.

**Response/template.** Journal rows plus ending liability.

**Derivation.** Earned portion: Dr Unearned Revenue, Cr Revenue; ensure it does not exceed liability plus relevant new advances.

**Difficulty.** L1 earned amount supplied; L2 time fraction; L3 mixed performance units; L4 reconstruct from ending obligation.

**Misconceptions/constraints.** No Cash line. Revenue recognized is the completed portion, not remaining obligation.

**Feedback.** `Beginning unearned + advances − earned = ending unearned`.

**Examples.**

1. of1,500 advance,600 now earned → Dr Unearned Revenue600; Cr Revenue600. L1.
2. 6-month service3,600 begins Nov1; at Dec31,2 months earned →1,200. L2.
3. ending obligation900 from beginning2,000 with no additions → earned1,100. L3.

**Validation/coverage.** Performance schedule and liability roll-forward.

### Family `adjust_accrued_revenue`

**Task.** Record revenue earned but not yet billed/collected.

**Response/template.** Journal rows.

**Derivation.** Dr Accounts/Interest Receivable; Cr relevant Revenue for the earned amount.

**Difficulty.** L1 service amount supplied; L2 time-based interest; L3 partially billed; L4 reverse next-period billing trace.

**Misconceptions/constraints.** Do not debit Cash. Exclude uncertain contingent revenue.

**Feedback.** Identify completed earning and remaining customer obligation.

**Examples.**

1. unbilled services800 completed by year-end → Dr A/R800; Cr Service Revenue800. L1.
2. note interest1,200 earned but not received → Dr Interest Receivable; Cr Interest Revenue. L2.
3. total earned3,000, already billed2,200 → accrue800. L2.

**Validation/coverage.** Earned-minus-recorded calculation.

### Family `adjust_accrued_expense`

**Task.** Record an expense incurred but unpaid/unrecorded at period end.

**Response/template.** Journal rows.

**Derivation.** Dr related Expense; Cr named Payable.

**Difficulty.** L1 amount supplied; L2 wage days; L3 simple interest months; L4 partial prior accrual.

**Misconceptions/constraints.** Do not credit Cash. Liability account matches the obligation type.

**Feedback.** Show incurred amount less amount already recognized.

**Examples.**

1. unpaid wages700 → Dr Wages Expense; Cr Wages Payable. L1.
2. three days at200/day unpaid → accrue600. L2.
3. 10,000 note at6% for2 accrued months → Interest Expense/Payable100. L3.

**Validation/coverage.** Exact accrual schedule and liability roll-forward.

### Family `adjust_depreciation`

**Task.** Calculate and record period straight-line depreciation.

**Response/template.** expense, entry, and optional ending accumulated depreciation.

**Derivation.** `(cost−residual)/life`, prorated only by supplied month policy; Dr Depreciation Expense, Cr Accumulated Depreciation.

**Difficulty.** L1 annual no residual; L2 residual; L3 partial year; L4 multiple asset batches.

**Misconceptions/constraints.** Do not credit Equipment or Cash. Land is not depreciated. Reject ambiguous placed-in-service dates.

**Feedback.** Show depreciable base, period fraction, and contra-asset update.

**Examples.**

1. cost12,000, zero residual,4 years → annual3,000. L1.
2. cost26,000, residual2,000,6 years →4,000. L2.
3. annual4,800 for3 declared months →1,200. L3.

**Validation/coverage.** Allocation schedule and accumulated-depreciation cap.

### Family `adjust_bad_debt_estimate`

**Task.** Record allowance-method bad-debt expense from a supplied estimate policy.

**Response/template.** adjustment and ending allowance.

**Derivation.** For target-ending-allowance method, adjustment = required ending credit balance minus existing signed allowance balance; Dr Bad Debt Expense, Cr Allowance for positive adjustment.

**Difficulty.** L1 no existing allowance; L2 existing credit; L3 existing debit; L4 percentage aging table.

**Misconceptions/constraints.** Do not credit A/R for an estimate. Policy and preadjustment allowance side are explicit. V1 generates a positive required adjustment; an advanced profile may allow a downward target only when the reversing debit-Allowance/credit-Expense treatment is taught explicitly.

**Feedback.** Show target, current signed balance, required adjustment.

**Examples.**

1. target allowance1,000, current0 → adjustment1,000. L1.
2. target1,500, current Cr400 → adjustment1,100. L2.
3. target900, current Dr100 → adjustment1,000. L3.

**Validation/coverage.** Signed contra-balance target equation.

### Family `adjusted_account_balance`

**Task.** Calculate one or more balances after posting an adjusting entry.

**Response/template.** ending balance table with sides.

**Derivation.** Apply adjustment rows to unadjusted ledger balances.

**Difficulty.** L1 one account; L2 asset+expense/liability+revenue; L3 several independent adjustments; L4 find inconsistent proposed adjusted balance.

**Misconceptions/constraints.** Preadjustment side is explicit. No closing entries yet.

**Feedback.** Running balance for each affected account.

**Examples.**

1. Supplies Dr900 less Cr650 adjustment → Dr250. L1.
2. Unearned Revenue Cr1,500 less Dr600 → Cr900. L2.
3. Accumulated Depreciation Cr4,000 plus Cr1,000 → Cr5,000. L2.

**Validation/coverage.** Ledger posting engine reuse.

### Family `adjusted_trial_balance_prepare`

**Task.** Apply a small set of adjustments and prepare affected rows/totals of the adjusted trial balance.

**Response/template.** Table transformation.

**Derivation.** Validate balanced adjustments, post them, take every ending side once, and total.

**Difficulty.** L1 one adjustment; L2 three independent; L3 one shared account; L4 identify omitted adjustment consequence.

**Misconceptions/constraints.** Adjusted trial balance includes revenue/expense temporary accounts. Limit to12 displayed accounts.

**Feedback.** Provide unadjusted + adjustments = adjusted columns.

**Examples.**

1. prepaid insurance adjustment shifts600 from asset to expense, total debits/credits remain equal. L1.
2. accrued revenue increases both A/R debit and Revenue credit800. L2.
3. three balanced adjustments preserve overall equality but change profit. L3.

**Validation/coverage.** Matrix roll-forward and total invariant.

### Family `reversing_entry_trace`

**Task.** Trace an optional reversing entry and the subsequent cash/billing entry.

**Response/template.** Ordered entries and final account effects.

**Derivation.** Reverse exactly the eligible prior accrual on first day, then record ordinary next-period transaction; verify combined periods match non-reversing treatment.

**Difficulty.** L1 recognize exact reversal; L2 accrued expense; L3 accrued revenue partial settlement; L4 compare both methods.

**Misconceptions/constraints.** Reversing entries are explicitly optional policy. Deferrals are excluded unless a named profile supports them.

**Feedback.** Show prior adjustment, reversal, later entry, and net result by period.

**Examples.**

1. Dec Cr Wages Payable700 is reversed Jan1 with Dr Wages Payable/Cr Wages Expense700. L2.
2. January payroll1,000 after700 reversal leaves January expense300. L3.
3. not reversing is also valid if later entry explicitly clears payable and records only new expense. L3.

**Validation/coverage.** Two-policy transaction simulation reaches same cumulative balances.

### Cross-family progression

Classifying the adjustment precedes calculation. Deferrals come before accruals because an existing balance is visible. Depreciation and allowance estimates introduce contra accounts only after ordinary adjustments. Adjusted balances and trial balances integrate posting; reversing entries remain optional advanced workflow rather than a universal rule.

## 6. Category: Financial statements and closing the period

### Category purpose

Transform adjusted balances into coherent statements, connect profit to equity, and reset temporary accounts without erasing permanent balances.

### Learn

The income statement reports revenue and expenses for a period. Profit flows into equity; owner contributions and distributions are separate. The balance sheet reports assets, liabilities, and equity at a date. Closing transfers temporary revenue, expense, and drawings/dividend balances into the profile-specific equity accounts. Permanent accounts carry forward.

### Prerequisites

Adjusted trial balances, account classes, contra accounts, and the expanded equation.

### Category boundaries

Statements use small generated entities and a pinned presentation. Full disclosure notes, comprehensive income, consolidation, and complex cash-flow preparation are excluded.

### Subcategories

1. Statement placement and subtotals
2. Income and equity statements
3. Classified balance sheets
4. Cash-flow classification
5. Closing and post-closing records

### Common misconceptions

- Putting Cash on the income statement.
- Treating owner investment as revenue or drawings as expense.
- Reporting accumulated depreciation as a liability.
- Confusing a period statement with an at-a-date statement.
- Closing permanent accounts.
- Assuming net income equals net cash flow.

### Family `statement_account_placement`

**Task.** Place an adjusted-trial-balance account on the proper statement/section.

**Response/template.** Matching: `Where is {account} reported?`

**Derivation.** Use class, entity profile, and current/noncurrent metadata.

**Difficulty.** L1 revenue/expense/assets; L2 equity/contra; L3 multi-statement flow; L4 account absent from primary statements.

**Misconceptions/constraints.** Choices distinguish statement and section. No ambiguous policy items.

**Feedback.** Give account class and whether it is period or date based.

**Examples.**

1. Service Revenue → income statement. L1.
2. Accumulated Depreciation → deduction from related asset on balance sheet. L2.
3. Owner's Drawings → statement of owner's equity, not an expense. L2.

**Validation/coverage.** Presentation schema lookup.

### Family `income_statement_prepare`

**Task.** Prepare a simple income statement from adjusted balances.

**Response/template.** Ordered rows/subtotals: revenues, expenses, net income/loss.

**Derivation.** Sum recognized revenues, sum expenses, calculate `net income=revenue−expenses`.

**Difficulty.** L1 one revenue/two expenses; L2 multiple accounts; L3 contra revenue/COGS; L4 missing value or net loss.

**Misconceptions/constraints.** Exclude assets, liabilities, contributions, and distributions. No negative journal-style amounts.

**Feedback.** Show included/excluded accounts and subtotal equation.

**Examples.**

1. Revenue8,000, expenses5,500 → net income2,500. L1.
2. Revenue4,000, expenses4,600 → net loss600. L2.
3. Cash balance is omitted even when cash collections equal revenue. L2.

**Validation/coverage.** Statement subtotal and profit-to-equity invariant.

### Family `equity_statement_prepare`

**Task.** Prepare the statement of owner's equity or retained earnings.

**Response/template.** Beginning balance, additions/deductions, ending balance.

**Derivation.** Sole proprietor: beginning capital + contributions + net income − drawings (or + net loss as negative). Corporation: beginning retained earnings + net income − dividends.

**Difficulty.** L1 net income supplied; L2 derive income; L3 contributions and loss; L4 solve missing component.

**Misconceptions/constraints.** Corporation common-stock issuance does not enter retained earnings. Profile pinned.

**Feedback.** Separate operating result from owner/shareholder transactions.

**Examples.**

1. capital10,000 + income3,000 − drawings800 →12,200. L1.
2. retained earnings20,000 − loss2,000 − dividends1,000 →17,000. L2.
3. proprietor contribution5,000 increases capital but not income. L2.

**Validation/coverage.** Equity roll-forward exact solve.

### Family `balance_sheet_classify`

**Task.** Classify balance-sheet accounts as current/noncurrent asset, current/noncurrent liability, or equity.

**Response/template.** Matching with supplied operating-cycle/date facts.

**Derivation.** Use expected realization/settlement within the pinned one-year/operating-cycle rule.

**Difficulty.** L1 cash/A/P/equity; L2 prepaid/equipment; L3 note maturity/current portion; L4 restricted fact supplied.

**Misconceptions/constraints.** Classification dates and maturities explicit. Contra accounts follow related assets.

**Feedback.** Cite expected conversion/settlement date.

**Examples.**

1. A/R due in30 days → current asset. L1.
2. equipment used five years → noncurrent asset. L1.
3. note due in18 months → noncurrent liability under one-year profile. L2.

**Validation/coverage.** Date-based classification oracle.

### Family `balance_sheet_prepare`

**Task.** Prepare or complete a classified balance sheet.

**Response/template.** Structured sections and totals.

**Derivation.** Group assets/liabilities, net contra assets, insert ending equity, and verify `A=L+E`.

**Difficulty.** L1 unclassified five accounts; L2 classified; L3 contra assets; L4 missing amount/error diagnosis.

**Misconceptions/constraints.** Report net carrying amount while retaining gross/contra lines. Revenue/expense already closed or represented through ending equity.

**Feedback.** Section totals followed by equation check.

**Examples.**

1. assets25,000, liabilities9,000 → equity16,000. L1.
2. equipment30,000 less accumulated depreciation6,000 → net24,000. L2.
3. an unbalanced draft is traced to omitted A/P2,000. L3.

**Validation/coverage.** Statement equation and source-balance reconciliation.

### Family `cash_flow_activity_classify`

**Task.** Classify a cash transaction as operating, investing, financing, or noncash under a pinned simplified profile.

**Response/template.** Single choice plus inflow/outflow/noncash.

**Derivation.** Operating covers ordinary revenue/expense cash; investing covers long-lived asset acquisition/disposal; financing covers owner/debt principal flows. Noncash transactions are excluded from cash totals.

**Difficulty.** L1 customer/supplier cash; L2 equipment/loan; L3 interest/dividend convention printed; L4 split transaction.

**Misconceptions/constraints.** Interest/dividend classification varies across standards, so every relevant prompt pins the chosen profile.

**Feedback.** Identify cash, counter-account, and purpose.

**Examples.**

1. collect cash from customers → operating inflow. L1.
2. buy equipment for cash → investing outflow. L2.
3. sign a note to acquire equipment with no cash → noncash investing/financing disclosure, not cash flow. L3.

**Validation/coverage.** Transaction tags and cash-account delta.

### Family `statement_relationship_reconcile`

**Task.** Reconcile one value across adjusted trial balance, income, equity, and balance sheet.

**Response/template.** Missing amount or source/destination matching.

**Derivation.** Follow revenue/expense to net income, net income to equity roll-forward, ending equity to balance sheet.

**Difficulty.** L1 one link; L2 full chain; L3 net loss/distribution; L4 locate first inconsistent statement.

**Misconceptions/constraints.** Cash is not used as a shortcut for profit. All statements share one period/profile.

**Feedback.** Highlight the linked value through each statement.

**Examples.**

1. income statement net income3,000 enters owner's-equity statement as +3,000. L1.
2. ending capital12,200 appears in balance-sheet equity. L2.
3. statements with correct arithmetic but different retained-earnings ending balances fail reconciliation. L3.

**Validation/coverage.** Cross-statement graph invariants.

### Family `closing_entries_construct`

**Task.** Construct closing entries under the declared direct-to-equity or Income Summary profile.

**Response/template.** Ordered set of journal entries.

**Derivation.** Zero revenues and expenses, transfer net result, close drawings/dividends, and leave permanent accounts untouched.

**Difficulty.** L1 close one revenue/expense; L2 Income Summary sequence; L3 net loss; L4 corporate versus proprietor.

**Misconceptions/constraints.** Closing method and profile explicit. Never close Cash, receivables, payables, or contributed capital.

**Feedback.** Show each temporary opening balance and zero after close.

**Examples.**

1. close Revenue Cr5,000 with Dr Revenue/Cr Income Summary5,000. L1.
2. close total expenses3,500 with Dr Income Summary/Cr expense accounts3,500. L2.
3. close Drawings Dr600 with Dr Owner's Capital/Cr Drawings600. L2.

**Validation/coverage.** Temporary balances zero; permanent/equity roll-forward correct.

### Family `post_closing_trial_balance`

**Task.** Prepare or audit a post-closing trial balance.

**Response/template.** permanent-account balance table.

**Derivation.** Post closing entries, exclude zero temporary accounts, total remaining debit/credit balances.

**Difficulty.** L1 identify included accounts; L2 calculate balances; L3 detect unclosed temporary; L4 reconcile opening next period.

**Misconceptions/constraints.** Accumulated depreciation and unearned revenue remain because they are permanent.

**Feedback.** Mark each account temporary/permanent and show closing effect.

**Examples.**

1. Cash appears; Service Revenue does not. L1.
2. Unearned Revenue remains as a liability. L2.
3. nonzero Wages Expense reveals incomplete closing. L3.

**Validation/coverage.** Permanent-account filter and equality.

### Cross-family progression

Placement precedes preparation. Income drives equity, which completes the balance sheet. Cash-flow classification deliberately contrasts profit with cash. Cross-statement reconciliation then makes the workflow explicit. Closing entries and the post-closing trial balance conclude the cycle.

## 7. Category: Merchandising and inventory

### Category purpose

Record the two-sided revenue and inventory consequences of buying and selling goods under a consistent perpetual-inventory model.

### Learn

Inventory is an asset until sold. Under perpetual inventory, each sale normally needs two effects: record the selling price as revenue/receivable or cash, and transfer the item's cost from Inventory to Cost of Goods Sold. Selling price and cost are different amounts.

### Prerequisites

Compound entries, receivables/payables, contra revenue, and statement subtotals.

### Category boundaries

Perpetual inventory and gross-method discounts are default. Manufacturing, tax, shrinkage estimation, lower-of-cost rules, and complex inventory methods are excluded.

### Subcategories

1. Inventory acquisition
2. Freight and returns
3. Sales and sales returns
4. Discounts and settlements
5. Inventory records and gross profit

### Common misconceptions

- Expensing inventory when purchased.
- Recording only the revenue half of a sale.
- Using selling price as COGS.
- Reversing inventory at selling price on a return.
- Treating freight terms without considering ownership.
- Subtracting sales discount from COGS.

### Family `inventory_purchase_entry`

**Task.** Record inventory acquired for cash or on account.

**Response/template.** Journal entry.

**Derivation.** Dr Inventory at declared capitalized purchase cost; Cr Cash or A/P.

**Difficulty.** L1 cash; L2 credit; L3 mixed payment; L4 several line items with excluded recoverable amount avoided.

**Misconceptions/constraints.** Do not debit Purchases under perpetual profile.

**Feedback.** State that unsold goods remain an asset.

**Examples.**

1. buy goods2,000 cash → Dr Inventory; Cr Cash. L1.
2. buy goods5,000 on account → Dr Inventory; Cr A/P. L1.
3. pay1,000 and owe3,000 → Dr Inventory4,000; Cr Cash1,000; Cr A/P3,000. L2.

**Validation/coverage.** Inventory roll-forward and financing split.

### Family `inventory_freight_terms`

**Task.** Determine ownership in transit and record buyer-paid freight under stated shipping terms.

**Response/template.** owner, freight responsibility, and entry.

**Derivation.** Apply the simplified definitions printed in Learn/prompt; capitalize buyer-borne freight into Inventory.

**Difficulty.** L1 responsibility stated directly; L2 FOB shipping/destination definitions supplied; L3 year-end transit; L4 seller prepays for buyer with explicit receivable.

**Misconceptions/constraints.** Terminology is defined in-app because commercial/legal usage can vary. No hidden freight policy.

**Feedback.** Separate title/ownership from who initially handed cash to carrier.

**Examples.**

1. buyer bears300 freight → Dr Inventory300; Cr Cash/A/P300. L1.
2. FOB shipping point, shipped before year-end under pinned definition → buyer owns in transit. L2.
3. seller-borne delivery cost is not buyer inventory cost. L2.

**Validation/coverage.** Shipping-term rule table and entry model.

### Family `purchase_return_entry`

**Task.** Record a return/allowance on inventory previously purchased.

**Response/template.** Journal entry plus payable/inventory balance.

**Derivation.** Dr A/P or Cash/receivable; Cr Inventory at purchase-cost reduction.

**Difficulty.** L1 credit purchase return; L2 cash refund; L3 partial allowance no physical return; L4 settlement combination.

**Misconceptions/constraints.** Perpetual profile uses Inventory, not Purchase Returns.

**Feedback.** Trace reduction in both inventory cost and amount owed/recovered.

**Examples.**

1. return500 of goods bought on account → Dr A/P; Cr Inventory. L1.
2. receive cash refund200 for cash purchase → Dr Cash; Cr Inventory. L2.
3. supplier grants100 allowance while goods retained → Dr A/P; Cr Inventory. L2.

**Validation/coverage.** Original purchase linkage and bounds.

### Family `merchandise_sale_dual_entry`

**Task.** Record a sale including both revenue and cost sides.

**Response/template.** Four journal rows, combined or two entries.

**Derivation.** Dr Cash/A/R and Cr Sales Revenue at selling price; Dr COGS and Cr Inventory at item cost.

**Difficulty.** L1 cash supplied cost; L2 credit; L3 split cash/credit; L4 multiple items aggregated.

**Misconceptions/constraints.** Selling price and cost must differ meaningfully. Accept one compound or two conventional entries.

**Feedback.** Display customer-facing and inventory-facing halves separately.

**Examples.**

1. sell for1,000 cash, cost600 → Dr Cash1,000/Cr Sales1,000; Dr COGS600/Cr Inventory600. L1.
2. credit sale2,500, cost1,400 uses A/R on revenue side. L2.
3. recording Inventory decrease at2,500 instead of1,400 confuses price with cost. L2.

**Validation/coverage.** Revenue and inventory subtransactions independently checked.

### Family `sales_return_dual_entry`

**Task.** Record a customer return of resalable goods.

**Response/template.** Contra-revenue and inventory-restoration entries.

**Derivation.** Dr Sales Returns and Allowances; Cr Cash/A/R at sale price. Dr Inventory; Cr COGS at original cost.

**Difficulty.** L1 full credit return; L2 cash refund; L3 partial quantity; L4 damaged goods with explicitly supplied recoverable cost.

**Misconceptions/constraints.** Restore inventory at cost, not refund price. Condition must be specified.

**Feedback.** Reverse each half using its original measurement basis.

**Examples.**

1. refund300, returned cost180 → debit Returns300 and Inventory180. L1.
2. credit customer's A/R for500 → Cr A/R500. L2.
3. nonresalable goods with zero recovery do not debit Inventory under supplied rule. L3.

**Validation/coverage.** Link to original sale price/cost and quantity.

### Family `sales_discount_settlement`

**Task.** Calculate and record collection within/outside gross-method discount terms.

**Response/template.** discount, cash, and journal rows.

**Derivation.** Apply stated percentage to eligible receivable base after returns; within period Dr Cash, Dr Sales Discounts, Cr A/R.

**Difficulty.** L1 discount amount; L2 return before discount; L3 date eligibility; L4 partial payment with policy explicit.

**Misconceptions/constraints.** No discount when outside term. Discount affects net sales, not COGS.

**Feedback.** Show eligible balance × rate, then receivable clearance.

**Examples.**

1. collect1,000 at2% → Cash980, Sales Discounts20, Cr A/R1,000. L1.
2. invoice2,000 less return200,2% discount →36 discount. L2.
3. payment after discount date → Dr Cash/Cr A/R full amount. L2.

**Validation/coverage.** Exact date eligibility and receivable roll-forward.

### Family `inventory_subledger_cogs`

**Task.** Trace units/cost through a bounded perpetual inventory subledger.

**Response/template.** quantity, inventory cost, and COGS fields.

**Derivation.** Apply purchase/return/sale quantities under a supplied single-cost or explicitly pinned FIFO/weighted-average micro-profile.

**Difficulty.** L1 uniform cost; L2 returns; L3 two FIFO layers; L4 weighted-average with stated rounding.

**Misconceptions/constraints.** V1 mixed sessions default to uniform cost. Method is never inferred. At most six movements.

**Feedback.** Layer/quantity roll-forward table.

**Examples.**

1. 10 units at6, sell4 → inventory36, COGS24. L1.
2. buy8, return2, sell3 at same cost →3 units consumed from6 available. L2.
3. FIFO sells older layer before newer supplied layer. L3.

**Validation/coverage.** Deterministic inventory-lot engine and quantity invariant.

### Family `net_sales_gross_profit`

**Task.** Calculate net sales, COGS, and gross profit from generated balances.

**Response/template.** Three named money fields.

**Derivation.** `net sales=sales−returns−discounts`; `gross profit=net sales−COGS`.

**Difficulty.** L1 sales/COGS; L2 contra revenue; L3 missing component; L4 gross-margin percentage clearly requested.

**Misconceptions/constraints.** Gross profit is before operating expenses and is not cash.

**Feedback.** Two-stage subtotal with labels.

**Examples.**

1. net sales10,000, COGS6,000 → gross profit4,000. L1.
2. sales12,000−returns500−discounts100 → net sales11,400. L2.
3. gross profit4,560 on net sales11,400 → gross margin40%. L3.

**Validation/coverage.** Subtotal identities and inverse solve.

### Cross-family progression

Purchases and freight establish inventory cost. Returns reverse acquisition. Sales then require the two-entry mental model, followed by sales returns and discounts. The subledger proves where COGS comes from; net sales and gross profit connect entries to statements.

## 8. Category: Receivables, long-lived assets, and obligations

### Category purpose

Maintain valuation and timing for common noncash assets and liabilities without introducing specialist accounting standards.

### Learn

Receivables are reported at expected collection under the supplied allowance estimate. A write-off uses the allowance and does not create new bad-debt expense at that moment. Long-lived asset cost is allocated through depreciation; disposal compares proceeds with book value. Notes separate principal from accrued interest.

### Prerequisites

Contra accounts, adjustments, simple interest, and statement classification.

### Category boundaries

Only straight-line depreciation, allowance-method receivables, simple notes, and explicit current/noncurrent rules appear. Impairment, discounted valuation, and complex financing are excluded.

### Subcategories

1. Receivable valuation and write-offs
2. Notes and interest
3. Depreciation and disposal
4. Obligation classification
5. Bounded ratios

### Common misconceptions

- Recording bad-debt expense again at write-off.
- Treating allowance as a separate debt owed.
- Including accumulated depreciation in depreciable cost twice.
- Calling sale proceeds the gain.
- Recording note principal as interest.
- Using total debt rather than due-date facts for current classification.

### Family `receivables_nrv`

**Task.** Compute gross receivables, allowance, and net realizable value.

**Response/template.** Named money fields.

**Derivation.** `NRV=A/R−credit Allowance` using signed allowance balance.

**Difficulty.** L1 supplied allowance; L2 aging estimate; L3 adjustment then NRV; L4 missing component.

**Misconceptions/constraints.** Allowance is contra asset, not liability or direct customer balance.

**Feedback.** Gross less estimate equals net.

**Examples.**

1. A/R20,000, allowance800 → NRV19,200. L1.
2. required allowance3% of30,000 →900. L2.
3. write-off within allowance reduces both gross and allowance equally, initially leaving NRV unchanged. L3.

**Validation/coverage.** Signed contra equation.

### Family `receivable_writeoff_recovery`

**Task.** Record a specific write-off or later recovery under allowance method.

**Response/template.** One/two entries.

**Derivation.** Write-off: Dr Allowance, Cr A/R. Recovery: reinstate Dr A/R/Cr Allowance, then Dr Cash/Cr A/R.

**Difficulty.** L1 write-off; L2 NRV effect; L3 recovery; L4 partial recovery.

**Misconceptions/constraints.** No new Bad Debt Expense at write-off under this profile.

**Feedback.** Show gross and allowance moving together.

**Examples.**

1. write off300 → Dr Allowance; Cr A/R. L1.
2. immediate NRV effect of a covered write-off → zero. L2.
3. recover200 previously written off → reinstate then collect. L3.

**Validation/coverage.** Customer subledger and allowance roll-forward.

### Family `note_interest_maturity`

**Task.** Calculate principal, interest, and maturity value for a simple note.

**Response/template.** Money/date fields.

**Derivation.** `I=Prt`; maturity value `P+I`; use exact supplied month fraction/date rule.

**Difficulty.** L1 annual; L2 months; L3 missing rate/principal; L4 accrue before maturity.

**Misconceptions/constraints.** Do not compound. Day-based notes excluded unless day-count formula supplied.

**Feedback.** Label principal, rate, time, interest, maturity.

**Examples.**

1. 10,000 at6% for1 year → interest600, maturity10,600. L1.
2. 12,000 at5% for3 months →150. L2.
3. six months elapsed on8,000 at9% → accrued interest360. L3.

**Validation/coverage.** Exact interest and inverse round trip.

### Family `note_entry_lifecycle`

**Task.** Record issue/acceptance, accrual, and settlement of a note.

**Response/template.** Ordered journal sequence.

**Derivation.** Separate note principal, accrued receivable/payable, current-period interest, and cash at maturity.

**Difficulty.** L1 note received/issued; L2 maturity same period; L3 crosses period end; L4 replace A/R or A/P with note.

**Misconceptions/constraints.** Dates and creditor/debtor perspective explicit.

**Feedback.** Timeline with balances after each event.

**Examples.**

1. customer signs note replacing A/R → Dr Notes Receivable; Cr A/R. L1.
2. borrower accrues year-end interest → Dr Interest Expense; Cr Interest Payable. L2.
3. maturity cash clears principal and previously accrued plus current interest. L3.

**Validation/coverage.** Dual-perspective lifecycle simulator.

### Family `depreciation_schedule`

**Task.** Complete a bounded straight-line depreciation schedule.

**Response/template.** year, expense, accumulated depreciation, book value table.

**Derivation.** Apply constant periodic expense without depreciating below residual value.

**Difficulty.** L1 full years; L2 residual; L3 partial first/last year; L4 missing schedule cell.

**Misconceptions/constraints.** Book value is cost less accumulated depreciation, not market value.

**Feedback.** Roll forward accumulated depreciation and book value.

**Examples.**

1. cost10,000, residual2,000,4 years →2,000/year. L1.
2. after year2, accumulated4,000 and book value6,000. L2.
3. final book value stops at residual2,000. L2.

**Validation/coverage.** Schedule endpoint and no-below-residual invariant.

### Family `asset_disposal_gain_loss`

**Task.** Calculate book value and record disposal for cash.

**Response/template.** book value, gain/loss, journal rows.

**Derivation.** Remove asset cost and accumulated depreciation; compare proceeds with book value; credit gain or debit loss.

**Difficulty.** L1 at book value; L2 gain/loss; L3 depreciation update before disposal; L4 partial asset component excluded unless exact.

**Misconceptions/constraints.** Gain is proceeds minus book value, not proceeds minus original cost.

**Feedback.** `cost−accumulated depreciation=book value`; compare cash.

**Examples.**

1. cost10,000, accum6,000, cash4,000 → no gain/loss. L1.
2. same asset sold5,000 → gain1,000. L2.
3. sold3,200 → loss800. L2.

**Validation/coverage.** Removed net book value plus gain/loss balances entry.

### Family `liability_due_date_classify`

**Task.** Classify obligations and current portions at a reporting date.

**Response/template.** current/noncurrent amounts.

**Derivation.** Partition contractual principal by supplied due dates and pinned one-year threshold.

**Difficulty.** L1 one maturity; L2 installment split; L3 refinancing fact explicitly supplied; L4 accrued interest separate.

**Misconceptions/constraints.** No unstated refinancing intent or covenant judgment.

**Feedback.** Timeline from report date through threshold.

**Examples.**

1. A/P due60 days → current. L1.
2. note12,000 with3,000 due next year → current3,000, noncurrent9,000. L2.
3. accrued interest payable is current under supplied near-term due date. L2.

**Validation/coverage.** Date partition sums to total obligation.

### Family `basic_accounting_ratios`

**Task.** Calculate and cautiously interpret current ratio, debt ratio, or gross margin from supplied statement values.

**Response/template.** Ratio/percentage plus constrained interpretation.

**Derivation.** Use displayed formula and same-period classified inputs.

**Difficulty.** L1 direct; L2 net amounts; L3 compare two periods; L4 identify insufficiency of one ratio.

**Misconceptions/constraints.** No investment/credit recommendation. Higher/lower is described mathematically, not universally better.

**Feedback.** Substitute labeled numerator/denominator and state limited meaning.

**Examples.**

1. current assets20,000/current liabilities10,000 → current ratio2.0. L1.
2. liabilities30,000/assets75,000 → debt ratio40%. L2.
3. gross margin increase alone does not prove cash or overall profit improved. L3.

**Validation/coverage.** Unitless calculation and interpretation whitelist.

### Cross-family progression

Receivable valuation precedes write-offs and recovery. Note arithmetic precedes lifecycle entries. Depreciation schedules precede disposal. Due-date classification and ratios then reuse statement balances while maintaining the boundary between calculation and advice.

## 9. Category: Cash controls, reconciliation, and error correction

### Category purpose

Reconcile independently maintained records, record book-side differences, and correct mistakes without using balancing plugs.

### Learn

A bank statement and cash ledger can differ because each knows about items at different times. Deposits in transit and outstanding checks adjust the bank side; bank fees, interest, electronic items, and book errors adjust the books. After valid adjustments, both sides reach one corrected cash balance.

### Prerequisites

Cash entries, posting, trial-balance limitations, adjustments, and source-document interpretation.

### Category boundaries

All bank and petty-cash data are fictional. Fraud detection, audit assurance, payment security, and real banking procedures are excluded.

### Subcategories

1. Reconciliation-item classification
2. Corrected balances and entries
3. Petty cash
4. Correcting entries and suspense
5. Integrated audit trail

### Common misconceptions

- Recording deposits in transit again in the books.
- Journalizing outstanding checks a second time.
- Adjusting the bank side for a bank fee already absent from books.
- Treating reconciliation differences as revenue/expense automatically.
- Correcting only the missing half of a balanced wrong entry.
- Using Suspense when the actual account can be determined.

### Family `bank_recon_item_classify`

**Task.** Place a reconciliation item on bank side, book side, both, or neither, with add/subtract direction.

**Response/template.** side and operation fields.

**Derivation.** Determine which record already contains the item and which record must catch up or be corrected.

**Difficulty.** L1 deposit/check timing; L2 fee/interest; L3 bank/book errors; L4 duplicate/irrelevant item.

**Misconceptions/constraints.** Each item states what bank and books currently show.

**Feedback.** Two-column “known by bank / known by books” explanation.

**Examples.**

1. deposit recorded by books but not bank → add to bank side. L1.
2. outstanding check → subtract from bank side. L1.
3. bank service fee not in books → subtract book side and journalize. L2.

**Validation/coverage.** Record-state truth table.

### Family `bank_recon_corrected_balance`

**Task.** Compute adjusted bank and book balances and verify equality.

**Response/template.** reconciliation table and corrected balance.

**Derivation.** Apply classified additions/subtractions to their respective starting balances.

**Difficulty.** L1 one item each side; L2 four items; L3 error corrections; L4 missing item/value.

**Misconceptions/constraints.** Generate a unique common balance. Reject arbitrary plug differences.

**Feedback.** Show both independent arithmetic paths.

**Examples.**

1. bank5,000 + deposit500 − checks300 →5,200. L1.
2. books5,250 − fee50 →5,200. L1.
3. unequal adjusted totals mean data/error remain unresolved, not “average them.” L3.

**Validation/coverage.** Dual-side equality constructed backward from common truth.

### Family `bank_recon_book_entries`

**Task.** Journalize only reconciliation items requiring book updates.

**Response/template.** zero or more journal entries.

**Derivation.** Select bank-originated transactions and book errors not yet recorded; exclude timing items already in books.

**Difficulty.** L1 fee/interest; L2 NSF/customer item; L3 book error; L4 mixed reconciliation.

**Misconceptions/constraints.** Deposits in transit/outstanding checks generate no repeat book entry.

**Feedback.** Mark each item “entry/no entry” and why.

**Examples.**

1. bank interest20 → Dr Cash; Cr Interest Revenue. L1.
2. bank fee15 → Dr Bank Fee Expense; Cr Cash. L1.
3. outstanding check400 → no new entry. L2.

**Validation/coverage.** Reconciliation classification-to-journal consistency.

### Family `petty_cash_establish_replenish`

**Task.** Record establishing/increasing/decreasing and replenishing an imprest petty-cash fund.

**Response/template.** journal entry and cash-short/over if explicitly used.

**Derivation.** Establish Dr Petty Cash/Cr Cash. Replenishment debits documented expenses/assets and credits Cash; Petty Cash changes only when fund size changes.

**Difficulty.** L1 establish; L2 exact receipts; L3 shortage/overage; L4 change fund plus replenish separately.

**Misconceptions/constraints.** Policy displayed. No negative receipts or unsupported expense categories.

**Feedback.** Reconcile fund cash on hand + receipts ± shortage to authorized fund.

**Examples.**

1. establish200 → Dr Petty Cash200; Cr Cash200. L1.
2. fund200, cash30, receipts170 → replenish Dr expenses170; Cr Cash170. L2.
3. fund200, cash25, receipts170 → shortage5; Dr documented accounts170; Dr Cash Short and Over5; Cr Cash175. L3.

**Validation/coverage.** Imprest reconciliation and entry rules.

### Family `correcting_entry_construct`

**Task.** Correct an omitted, wrong-account, wrong-side, or wrong-amount entry.

**Response/template.** correcting journal entry, not erasure.

**Derivation.** Compute `desired cumulative balances − actual cumulative balances` for every affected account; encode deltas as debit/credit rows.

**Difficulty.** L1 omitted entry; L2 wrong account same side; L3 amount error; L4 both sides wrong.

**Misconceptions/constraints.** Do not assume reversal-and-rerecord is required; accept it only when resulting entries are allowed by prompt. No Suspense if source is known.

**Feedback.** Side-by-side actual, desired, difference.

**Examples.**

1. Equipment500 wrongly debited Supplies → Dr Equipment500; Cr Supplies500. L2.
2. cash expense80 omitted → Dr Expense80; Cr Cash80. L1.
3. A/P payment600 recorded as60 → additional Dr A/P540; Cr Cash540. L3.

**Validation/coverage.** Vector-difference oracle and post-correction equality.

### Family `suspense_account_clear`

**Task.** Clear a temporary suspense balance once the underlying posting error is identified.

**Response/template.** correcting entry and resulting suspense balance.

**Derivation.** Reverse the exact suspense side and post the proper counterpart implied by evidence.

**Difficulty.** L1 one known omitted side; L2 several candidates; L3 partial suspense; L4 determine that suspense should not have been used.

**Misconceptions/constraints.** Suspense is a temporary diagnostic device, never a permanent balancing answer.

**Feedback.** Trace origin and prove ending Suspense zero.

**Examples.**

1. a required credit300 was temporarily credited to Suspense; once identified as A/P → Dr Suspense300; Cr A/P300. L2.
2. unresolved suspense at reporting completion is flagged, not renamed an expense. L2.
3. if exact wrong account is known and entry stayed balanced, correct directly without Suspense. L3.

**Validation/coverage.** Explicit initial suspense side prevents sign ambiguity.

### Family `accounting_cycle_sequence`

**Task.** Order generated accounting-cycle steps and identify prerequisites.

**Response/template.** Ordered sequence/missing step.

**Derivation.** Source event → journalize → post → unadjusted trial balance → adjust → adjusted trial balance → statements → close → post-closing trial balance.

**Difficulty.** L1 three adjacent steps; L2 full sequence; L3 optional reversing entry; L4 diagnose consequence of skipped step.

**Misconceptions/constraints.** This is dynamic only when steps are shuffled, omitted, or tied to generated records; avoid bare definition recall.

**Feedback.** Show artifacts produced/consumed by each step.

**Examples.**

1. journalizing precedes posting. L1.
2. adjusted trial balance precedes statements. L1.
3. closing precedes post-closing trial balance. L2.

**Validation/coverage.** Dependency DAG/topological-order checker.

### Family `integrated_audit_trail`

**Task.** Trace one generated transaction through source record, journal, ledger, trial balance, adjustment/statement, and locate the first inconsistency.

**Response/template.** stage, defect, and corrected value.

**Derivation.** Compare each artifact to the previous semantic state; stop at first divergence and propagate expected downstream effects.

**Difficulty.** L1 journal/posting; L2 through trial balance; L3 through adjustment/statements; L4 balanced wrong entry with downstream consistency.

**Misconceptions/constraints.** At most ten accounts and one primary injected defect. “First” uses explicit workflow order.

**Feedback.** Highlight the first broken link, then show downstream consequences without calling them independent errors.

**Examples.**

1. source cash sale500, journal correct, Cash ledger posts50 → first error posting amount. L2.
2. balanced loan entry credits Revenue → first error journal account though later ledger/statements agree with it. L3.
3. adjustment omitted → unadjusted records correct; first error at adjustment stage. L3.

**Validation/coverage.** Immutable ground-truth event log plus mutation provenance.

### Cross-family progression

Reconciliation classification precedes arithmetic and journalization. Petty cash adds a small self-balancing subsystem. Correcting entries use ledger-vector differences; Suspense remains a narrow advanced tool. Cycle ordering gives the artifact map before integrated audit-trail questions test the complete bookkeeping chain.

## 10. Topic-level progression

### Level 1: Account-side foundations

- Classify common accounts and normal balances.
- Apply one increase/decrease.
- Preserve the accounting equation for two-account events.
- Construct simple cash and credit entries.
- Post and calculate small normal balances.
- Use whole currency amounts and strong account-class cues.

### Level 2: Timing and workflow

- Separate cash from revenue/expense recognition.
- Record settlements, advances, financing, and owner transactions.
- Build compound entries with one amount partition.
- Prepare trial balances and routine deferral/accrual adjustments.
- Produce small income/equity/balance statements.
- Record perpetual inventory purchases and dual-entry sales.

### Level 3: Reconstruction and exceptions

- Work with contra accounts and abnormal balances.
- Diagnose balanced-but-wrong entries and trial-balance limitations.
- Calculate partial-period accruals, depreciation, allowances, discounts, and returns.
- Reconcile banks and subledgers.
- Close a period and trace values across statements.
- Solve a missing amount from ledger/statement invariants.

### Level 4: Integrated accounting cycle

- Trace several linked events across two reporting periods.
- Compare initial, adjusting, reversing, and settlement entries.
- Reconstruct error corrections from desired versus actual balances.
- Handle asset disposal, note lifecycle, inventory layers, and current portions under explicit policies.
- Audit a compact record set whose arithmetic may balance despite a semantic error.

### Level 5: Capstone record diagnosis

- Start with generated source documents and an opening trial balance.
- journalize and post a bounded period;
- choose/compute required adjustments;
- prepare reconciled statements and closing records;
- diagnose one planted error or state that the supplied record is consistent;
- explain profit, cash, and equity effects separately.

Difficulty is categorical: later levels weaken cues and combine recognition, timing, classification, and reconstruction. Larger ledgers alone do not raise a level.

## 11. Adaptive practice guidance

Track mastery by family, account class, transaction archetype, representation, period-timing pattern, and misconception. Important tags:

- `debit_means_decrease`
- `cash_equals_revenue`
- `payment_equals_expense`
- `loan_as_revenue`
- `settlement_repeats_income`
- `owner_transaction_in_profit`
- `unearned_as_revenue`
- `prepaid_as_immediate_expense`
- `contra_wrong_class`
- `balanced_means_correct`
- `trial_balance_proves_completeness`
- `adjustment_uses_cash`
- `earned_vs_remaining`
- `selling_price_as_cost`
- `writeoff_repeats_expense`
- `proceeds_as_gain`
- `bank_timing_journalized_twice`

After an error, isolate the mental model:

- If debit is treated as decrease, return to account class → normal side → direction before another entry.
- If a settlement repeats revenue/expense, pair original recognition and later cash in a two-date timeline.
- If an adjustment uses Cash, ask which account already holds the deferred amount or which receivable/payable is missing.
- If the sale lacks COGS, display customer-facing and inventory-facing halves separately.
- If trial-balance equality is overtrusted, present a complete omitted entry and a wrong-account mutation.
- If bank timing items are journalized twice, ask which record already knows each item.

Suggested session mix:

- 55% current-level mixed transaction/record work;
- 20% prerequisite repair;
- 15% spaced review from prior accounting-cycle stages;
- 10% reverse/audit questions.

Do not infer mastery of a compound entry from balanced totals alone. Credit account choice, direction, amount, timing, and balance as distinct diagnostic components.

## 12. Answer checking and feedback

### Semantic journal comparison

Convert every submitted row to a signed account delta (`debit=+` in ledger-left convention, `credit=−`), combine duplicate account rows, and compare with the exact expected semantic vector. Separately verify:

- supported account IDs;
- non-negative currency amounts;
- debit/credit equality;
- expected transaction vector;
- entity profile;
- period/date when tested.

This accepts equivalent line grouping/order but rejects balanced wrong accounts. For tasks explicitly requiring multiple chronological entries, compare each dated entry rather than only cumulative effects.

### Partial diagnosis

Report the first meaningful mismatch:

1. unsupported/ambiguous account;
2. unbalanced totals;
3. correct accounts but wrong side;
4. correct accounts/sides but wrong amount;
5. missing/extra account;
6. correct cumulative effect but wrong timing;
7. correct entry.

When the submission exactly matches a known misconception mutation, name it:

> This entry balances, but it treats loan proceeds as revenue. The entity received cash and incurred a liability.

### Numeric and table answers

- Use exact decimal/rational arithmetic.
- Accept locale-aware money formatting and optional currency mark.
- Ledger/trial-balance cells carry side separately.
- Missing-value answers must satisfy every displayed constraint, not only column equality.
- Ratio tolerances follow displayed precision and never conceal wrong inputs.
- Ordered workflows are checked as dependency-respecting sequences; when several topological orders are valid, accept all unless the prompt pins a convention.

### Worked solution

Use the shortest structure matching the task:

```text
Event → accounts → increase/decrease → debit/credit → balance check
```

or:

```text
Unadjusted balance → economic status → required adjustment → adjusted balance
```

or:

```text
Source → journal → ledger → trial balance → statement
```

Correct feedback confirms the accounting reason, not only “Debits equal credits.” Incorrect feedback should preserve partial credit conceptually while showing the first broken link.

## 13. Rendering and accessibility requirements

- Journal-entry editor: account autocomplete, debit and credit columns, automatic but non-authoritative totals, keyboard row insertion/removal.
- T-accounts: semantic HTML table/text alternative; left/right headings always say Debit/Credit.
- Ledgers: date, explanation, reference, debit, credit, and balance-side fields.
- Trial balances/statements: aligned money columns, visible subtotals, parentheses plus text for deductions/losses.
- Source documents: synthetic, uncluttered, selectable text; never rely on handwriting recognition.
- Timelines: reporting boundary and cash/performance dates labeled with shapes/text, not color alone.
- Correct/incorrect states: icons and text in addition to color.
- Screen-reader output must announce account, side, and amount in that order.
- Drag-and-drop may be offered but every task needs keyboard/select controls.
- Currency and dates localize without changing semantic account mappings or arithmetic.

No generated personal/business names should resemble real account data. Animation is optional and must respect reduced-motion settings.

## 14. Implementation architecture

The standalone HTML/CSS/JavaScript app needs no backend, bank connection, spreadsheet engine, or accounting package.

Recommended semantic modules:

- seeded PRNG/replay token;
- exact decimal/rational money;
- controlled chart of accounts and entity profiles;
- transaction/event template registry;
- recognition timeline and period engine;
- journal-vector solver/checker;
- general/subledger posting engine;
- trial-balance and statement projection engine;
- adjustment/closing scheduler;
- inventory-lot engine for bounded profiles;
- bank-reconciliation state model;
- deliberate error mutation/provenance engine;
- localized account/display dictionaries;
- adaptive scheduler and misconception tags.

Each instance retains:

```js
{
  seed,
  familyId,
  level,
  entityProfile,
  accountingProfile,
  currency,
  period,
  openingBalances,
  sourceFacts,
  events,
  expectedEntries,
  expectedLedgerDeltas,
  expectedStatements,
  acceptedEquivalences,
  misconceptionMutations,
  workedSteps
}
```

The generator constructs facts; an independent accounting oracle derives entries and balances; the renderer never derives truth from prose. Localized strings are generated from semantic events, not parsed back into accounting meaning.

## 15. Automated validation requirements

Reject an instance unless:

- debits equal credits for every expected entry;
- cumulative journal deltas equal ledger deltas;
- subsidiary totals reconcile to control accounts where shown;
- trial balances equal after every balanced posting stage;
- adjusted balances reflect every and only required adjustment;
- statement profit reconciles to equity;
- balance sheet satisfies `A=L+E`;
- closing zeros every temporary account and preserves permanent balances;
- post-closing balances become valid next-period openings;
- inventory units and cost roll forward without impossible negative quantities;
- allowance/depreciation schedules respect bounds;
- bank and book reconciliation reach one corrected cash balance;
- the expected answer is unique under the declared profile;
- distractors are distinct, balanced when intended, and mapped to a named misconception;
- all placeholders and localized account names resolve.

Independent checks should include:

- equation deltas versus debit/credit journal vector;
- journal posting versus direct event-to-ledger projection;
- ledger totals versus trial balance;
- statement projection versus account-class aggregation;
- profit versus equity roll-forward;
- schedule totals versus direct formula;
- merchandise sale event versus independent revenue and inventory halves;
- reconciliation built from record-state differences versus displayed table;
- correction entry plus actual balances equals desired balances.

Test suites require:

- golden fixtures for every family/level;
- property-based balanced-entry fuzzing;
- mutation tests for wrong side/account/amount/period;
- complete-omission and balanced-wrong-account trial-balance cases;
- exact month-boundary and zero/abnormal-balance cases;
- proprietor/corporation profile separation;
- perpetual-inventory returns/discounts;
- bank reconciliation timing/error fixtures;
- semantic-equivalence tests for reordered/combined journal lines;
- locale completeness and decimal-format tests.

Developer mode should expose seed, full event model, chart/profile, expected entry vectors, ledger snapshots, rejection reason, and mutation provenance.

## 16. Coverage requirements

This specification defines 70 question families:

- 8 account/equation foundations;
- 11 transaction/journal families;
- 8 ledger/trial-balance families;
- 10 adjusting-entry families;
- 9 statement/closing families;
- 8 merchandising families;
- 8 receivable/asset/obligation families;
- 8 cash-control/error families.

The family registry must compute and test this inventory.

Across a representative corpus, cover:

- assets, contra assets, liabilities, equity, revenue, contra revenue, expense, and distributions;
- increase/decrease and debit/credit in both directions;
- cash-before, cash-with, and cash-after recognition;
- proprietor and corporation profiles without mixing them;
- two-line, compound, and no-entry events;
- normal, zero, and intentionally abnormal ledger balances;
- detectable and undetectable trial-balance errors;
- all seven adjustment types in scope;
- net income and net loss;
- current/noncurrent and gross/contra/net presentation;
- cash/credit merchandise purchases and sales, returns, and discounts;
- reconciliation items on bank and book sides;
- forward construction, inverse reconstruction, validation, and diagnosis.

At least 25% of eligible questions should reverse the common direction: infer the event, find a missing entry, audit a proposal, reconcile a downstream value, or locate the first error. No single transaction story surface should exceed 20% of a family's corpus.

## 17. Navigation and v1 priorities

Recommended views:

- **Learn:** equation/normal-side map, recognition timelines, and worked accounting cycle.
- **Practice:** category, family, level, entity profile, service/merchandising filters.
- **Transaction lab:** event → entry → ledger with optional scaffolding.
- **Period close lab:** trial balance → adjustments → statements → closing.
- **Review:** mistakes grouped by misconception and affected account.
- **Reference:** chart of accounts, normal balances, entry syntax, and pinned policies.

Minimum satisfying v1:

1. account classification and debit/credit effects;
2. transaction equation effects;
3. simple/credit/settlement/advance/compound entries;
4. ledger posting and ending balances;
5. trial-balance preparation and error limits;
6. prepaid, unearned, accrued revenue/expense adjustments;
7. service-business statements;
8. closing and post-closing trial balance.

V1.1 adds depreciation/allowance, bank reconciliation, and corrections. V1.2 adds perpetual merchandising. Notes, disposals, optional reversing entries, ratios, and integrated audits follow only after the core semantic checker is reliable.

## 18. Topic-level quality checklist

- [ ] Every event has a unique recognition interpretation and entity perspective.
- [ ] Every account comes from the controlled localized chart or is explicitly defined.
- [ ] Entity profiles never mix Capital/Drawings with Common Stock/Retained Earnings/Dividends.
- [ ] Debit and credit are described as sides, not universal increase/decrease or good/bad.
- [ ] Every expected entry balances and matches the semantic event vector.
- [ ] Balanced-but-wrong distractors are used regularly.
- [ ] Cash, profit, and direct equity effects are checked separately.
- [ ] Journal row ordering/grouping equivalence is accepted where semantic.
- [ ] Adjustments do not use Cash unless the question explicitly concerns a correction rather than an adjustment.
- [ ] Trial-balance equality is never presented as proof of correctness/completeness.
- [ ] Contra accounts retain their account class and opposite normal balance.
- [ ] Perpetual-inventory sales record both selling price and cost.
- [ ] Returns reverse revenue at selling price and inventory at cost under stated condition.
- [ ] Estimates and useful lives are supplied assumptions, not real-world advice.
- [ ] Statement values reconcile to ledgers, profit, equity, and the accounting equation.
- [ ] Closing entries zero only temporary accounts.
- [ ] Reconciliation timing items are not journalized twice.
- [ ] Correction entries are derived from desired minus actual balances, never a plug.
- [ ] Every family has at least three instantiated examples and automated fixtures.
- [ ] Difficulty rises through timing, integration, inversion, and diagnosis—not clerical volume.
- [ ] All fictional records avoid real personal/business financial data.
- [ ] The app states that it is educational and not accounting, tax, legal, audit, or investment advice.
