# Requirements Document

## Introduction

The **Expense & Budget Visualizer** is a client-side web application that lets students and the general public track their daily spending. Users add expense transactions with a name, amount, and category; view a running total balance; browse a scrollable transaction history; and see a pie chart that breaks spending down by category. All data is persisted in the browser's Local Storage — no backend or account required. The app is mobile-friendly and works in any modern browser as a standalone web page.

---

## Glossary

- **App**: The Expense & Budget Visualizer web application.
- **Transaction**: A single expense record consisting of an item name, a monetary amount, and a category.
- **Transaction_List**: The scrollable UI component that displays all saved transactions.
- **Balance_Display**: The UI element shown at the top of the page that presents the current total balance.
- **Input_Form**: The HTML form used to enter a new transaction.
- **Category**: A predefined spending label — one of: Food, Transport, or Fun.
- **Pie_Chart**: The Chart.js-rendered doughnut/pie chart that visualises spending totals per category.
- **Storage**: The browser's `localStorage` API used for client-side data persistence.
- **Theme_Toggle**: The control that switches the App between dark and light colour schemes.
- **Spending_Limit**: A user-configurable monetary threshold above which the balance or a transaction is visually highlighted.
- **Validator**: The client-side logic that checks Input_Form fields before a transaction is saved.

---

## Requirements

### Requirement 1: Transaction Entry

**User Story:** As a user, I want to add a new expense by filling in a form, so that I can record my daily spending quickly.

#### Acceptance Criteria

1. THE Input_Form SHALL contain three fields: Item Name (text, maximum 100 characters), Amount (number), and Category (select with options: Food, Transport, Fun).
2. WHEN the user submits the Input_Form with all three fields valid, THE App SHALL create a new Transaction and add it to the top of the Transaction_List within 500 milliseconds.
3. WHEN the user submits the Input_Form, THE Validator SHALL check that the Item Name field is not empty and does not exceed 100 characters.
4. WHEN the user submits the Input_Form, THE Validator SHALL check that the Amount field contains a numeric value between 0.01 and 999,999,999.99.
5. WHEN the user submits the Input_Form, THE Validator SHALL check that a Category has been selected from the available options (Food, Transport, Fun).
6. IF the Validator detects a missing or invalid field, THEN THE Input_Form SHALL display an inline error message adjacent to each invalid field identifying which field requires attention, and SHALL NOT submit the Transaction or modify the Transaction_List.
7. WHEN a Transaction is successfully added, THE Input_Form SHALL reset the Item Name field to empty, the Amount field to empty, and the Category field to its default unselected state.

---

### Requirement 2: Transaction List Display

**User Story:** As a user, I want to see all my past transactions in a list, so that I can review my spending history.

#### Acceptance Criteria

1. THE Transaction_List SHALL display every saved Transaction in reverse-chronological order (most recent first) by default, sorted by the Transaction's recorded date and time.
2. THE Transaction_List SHALL display the Item Name (truncated to a maximum of 100 characters if exceeded), Amount (formatted as currency with two decimal places and a currency symbol), Category, and recorded date for each Transaction.
3. WHEN the Transaction_List contains more entries than the visible viewport area, THE Transaction_List SHALL be scrollable without affecting the rest of the page layout.
4. WHEN there are no saved Transactions, THE Transaction_List SHALL display a placeholder message indicating that no transactions have been recorded.
5. IF the Transaction data fails to load, THEN THE Transaction_List SHALL display an error message indicating that transactions could not be retrieved and retain the previously visible state of the page layout.

---

### Requirement 3: Delete Transaction

**User Story:** As a user, I want to delete a transaction from the list, so that I can remove entries I added by mistake.

#### Acceptance Criteria

1. THE Transaction_List SHALL render a delete button for each Transaction entry.
2. WHEN the user activates the delete button for a Transaction, THE App SHALL display a confirmation prompt requiring explicit user confirmation before proceeding with deletion.
3. IF the user confirms the deletion, THEN THE App SHALL remove that Transaction from the Transaction_List and from Storage, and the Transaction entry SHALL no longer appear in the Transaction_List.
4. IF the user cancels the deletion prompt, THEN THE App SHALL dismiss the prompt and leave the Transaction_List and Storage unchanged.
5. WHEN a Transaction is deleted, THE Balance_Display SHALL update to reflect the recalculated total within 1 second without requiring a page reload.
6. WHEN a Transaction is deleted, THE Pie_Chart SHALL update to reflect the recalculated category totals within 1 second without requiring a page reload.

---

### Requirement 4: Balance Display

**User Story:** As a user, I want to see my current total balance at the top of the page, so that I always know how much I have spent in total.

#### Acceptance Criteria

1. THE Balance_Display SHALL show the sum of all Transaction amounts formatted as a currency value with two decimal places, where the value range is -999,999,999.99 to 999,999,999.99.
2. WHEN a new Transaction is added, THE Balance_Display SHALL update within 100 milliseconds to reflect the new total.
3. WHEN a Transaction is deleted, THE Balance_Display SHALL update within 100 milliseconds to reflect the revised total.
4. WHEN there are no saved Transactions, THE Balance_Display SHALL show a value of 0.00.
5. IF the sum of all Transaction amounts cannot be calculated due to a data retrieval failure, THEN THE Balance_Display SHALL show an error message indicating that the balance is unavailable and retain the last successfully displayed value.

---

### Requirement 5: Pie Chart Visualisation

**User Story:** As a user, I want to see a pie chart of my spending by category, so that I can understand where my money goes at a glance.

#### Acceptance Criteria

1. THE Pie_Chart SHALL use the Chart.js library to render spending totals grouped by Category (Food, Transport, Fun).
2. WHEN a new Transaction is added, THE Pie_Chart SHALL update within 100 milliseconds to reflect the new category totals.
3. WHEN a Transaction is deleted, THE Pie_Chart SHALL update within 100 milliseconds to reflect the revised category totals.
4. THE Pie_Chart SHALL display a legend identifying each Category with a distinct colour, where no two Categories share the same colour.
5. WHEN all Transaction amounts for a Category are zero, THE Pie_Chart SHALL omit that Category segment from the rendered chart.
6. WHEN the Transaction_List is empty, THE Pie_Chart SHALL display a placeholder message instead of a blank or empty chart canvas.
7. IF the Pie_Chart fails to render, THEN THE App SHALL display an error message indicating the chart is unavailable and preserve the current state of the Transaction_List.

---

### Requirement 6: Data Persistence

**User Story:** As a user, I want my transactions to be saved between sessions, so that I do not lose my data when I close or refresh the browser.

#### Acceptance Criteria

1. WHEN a Transaction is added, THE App SHALL serialise all Transactions as a JSON string and write it to Storage under a fixed key shared across all Storage operations.
2. WHEN a Transaction is deleted, THE App SHALL serialise the updated Transaction array and overwrite the Storage entry under the same fixed key within 500 milliseconds of the deletion.
3. WHEN the App loads, THE App SHALL read the Storage entry and deserialise it to restore all previously saved Transactions before rendering any Transaction list content.
4. IF the Storage entry is absent or cannot be parsed, THEN THE App SHALL initialise with an empty Transaction array and display the empty-state placeholder without clearing any other Storage entries.
5. IF serialisation fails during a Transaction add or delete operation, THEN THE App SHALL display an error message indicating the save failed and preserve the in-memory Transaction array unchanged.
6. FOR ALL valid Transaction arrays, serialising then deserialising the array SHALL produce an array with the same length, Item Names, Amounts, Categories, and transaction IDs (round-trip property).

---

### Requirement 7: Mobile-Friendly Layout

**User Story:** As a mobile user, I want the app to display correctly on small screens, so that I can use it comfortably on my phone.

#### Acceptance Criteria

1. THE App SHALL use responsive CSS so that the layout reflows correctly at viewport widths from 320 px to 1920 px with no horizontal scrollbar and no content overflowing its container.
2. THE Input_Form fields and submit button SHALL be fully usable via touch input on mobile devices, with interactive elements having a minimum touch target size of 44×44 px and no functionality requiring hover interactions.
3. THE Transaction_List SHALL use CSS scroll containment so that scrolling within the list does not trigger page-level scrolling on touch devices.
4. WHEN the viewport width is 480 px or less, THE App SHALL render in a single-column layout with all primary UI sections stacked vertically.

---

### Requirement 8: Browser Compatibility

**User Story:** As a user, I want the app to work in my preferred browser, so that I am not forced to switch browsers.

#### Acceptance Criteria

1. THE App SHALL function correctly in the latest stable release of Chrome, Firefox, Edge, and Safari.
2. THE App SHALL use only standard Web APIs (DOM and localStorage) and SHALL NOT depend on browser-specific proprietary extensions or vendor-prefixed CSS properties that lack a standard equivalent.
3. THE App SHALL be loadable as a standalone HTML file opened directly in a browser without a local server, with all styles and scripts either embedded in the HTML file or referenced as relative paths to files in the same directory.
4. IF any required Web API (DOM or localStorage) is unavailable in the browser, THEN THE App SHALL display an error message indicating which feature is unsupported and that the browser is not compatible.
5. WHEN the App is loaded as a standalone HTML file, THE App SHALL render all UI elements without errors or missing content within 5 seconds on a machine meeting minimum hardware requirements.

---

### Requirement 9: Code and File Structure

**User Story:** As a developer, I want the project to follow a clean single-file-per-type structure, so that the codebase is easy to navigate and maintain.

#### Acceptance Criteria

1. THE App SHALL contain exactly one CSS file located at `css/style.css`.
2. THE App SHALL contain exactly one JavaScript file located at `js/app.js`.
3. THE App SHALL contain one HTML entry-point file at the project root (`index.html`) that references `css/style.css` via a `<link rel="stylesheet">` tag and references `js/app.js` via a `<script src>` tag.
4. THE App SHALL load the Chart.js library via a `<script>` tag whose `src` attribute points to a Chart.js distribution URL served from a recognized CDN provider (cdnjs, jsDelivr, or unpkg), with no local copy of the library bundled in the project.

---

### Requirement 10: Dark / Light Mode Toggle (Optional)

**User Story:** As a user, I want to switch between dark and light mode, so that I can use the app comfortably in different lighting conditions.

#### Acceptance Criteria

1. WHERE the Theme_Toggle feature is enabled, THE App SHALL render a toggle control visible in the page header with a minimum size of 24×24 px and a visible label indicating the currently active theme.
2. WHEN the user activates the Theme_Toggle, THE App SHALL switch the colour scheme for all visible UI elements between dark and light mode within 150 milliseconds.
3. WHERE the Theme_Toggle feature is enabled, THE App SHALL read the persisted theme preference from Storage and apply it within 150 milliseconds before rendering any content, preventing a flash of the wrong theme on load.
4. IF Storage is unavailable or contains an invalid theme value, THEN THE App SHALL silently default to the light theme without displaying an error.

---

### Requirement 11: Sort Transactions (Optional)

**User Story:** As a user, I want to sort my transaction list by amount or category, so that I can quickly find patterns in my spending.

#### Acceptance Criteria

1. WHERE the sort feature is enabled, THE Transaction_List SHALL provide controls to sort entries by Amount (ascending or descending) or by Category (A–Z alphabetical order).
2. WHEN a sort option is selected, THE Transaction_List SHALL re-render all currently displayed entries within 100 milliseconds using the chosen sort order.
3. WHERE the sort feature is enabled, WHEN a sort option is selected, THE Transaction_List SHALL apply the sort order to the current view without altering the stored sequence of Transactions in Storage.
4. IF the Transaction_List contains no entries when a sort option is selected, THEN THE Transaction_List SHALL display an empty list with no error.
5. WHERE the sort feature is enabled, WHEN a sort option is selected while a category filter is active, THE Transaction_List SHALL apply the sort order only to the filtered subset of entries.

---

### Requirement 12: Spending Limit Highlight (Optional)

**User Story:** As a user, I want to be alerted when my total spending exceeds a limit I set, so that I can stay within my budget.

#### Acceptance Criteria

1. WHERE the Spending_Limit feature is enabled, THE App SHALL provide an input control for the user to set a Spending_Limit value that is numeric, greater than 0.00, and no greater than 999,999,999.99, with up to 2 decimal places.
2. WHERE the Spending_Limit feature is enabled, IF the user submits a Spending_Limit value that is non-numeric, less than or equal to 0, greater than 999,999,999.99, or contains more than 2 decimal places, THEN THE App SHALL reject the input and display an error message indicating the valid range, without saving the previous Spending_Limit value.
3. IF the Balance_Display value exceeds the Spending_Limit, THEN THE Balance_Display SHALL apply a warning visual style, visually distinct from its default display style, within 100 milliseconds of the balance update.
4. WHERE the Spending_Limit feature is enabled, THE App SHALL persist the Spending_Limit value in Storage so that it is restored on next load.
5. IF the Balance_Display value is at or below the Spending_Limit, THEN THE Balance_Display SHALL revert to its default display style within 100 milliseconds of the balance update.
