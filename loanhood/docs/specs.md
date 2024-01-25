# Main Nav

1. Rentals
2. Users
3. Meta Data
4. App
5. Logout

---

# 1.Rentals

## Rentals List

Paged list showing all rentals currently on the system.

List attributes:

- Thumbnail for main image
- Title
- "Item" or "Look" depending on number of rentalItems
- State (pending, rejected, approved)

Filters:

- All
- State (pending, rejected, approved)
- Category
- Brand
- Material
- Color
- User

Sorting:

- State (pending, rejected, approved)
- Date (createdAt, updatedAt)

Selecting a row opens the rental detail screen.

## Rental Detail

The rental detail screen provides a sub navigation (tabs) for the following areas:

### Tab 1: Rental & Rental Items

https://www.figma.com/file/lUKT74nk6jTwlUQzBeB590/MVP?node-id=48%3A216

A **reusable** form with view/edit mode, displaying details about the Rental and the associated Rental Items:

**Rental attributes:**

- images
- title
- description
- state
- originalPrice
- rentalPricePerWeek
- deliveryPrice
- dryCleanPrice
- hasDelivery
- needsDryCleaning
- updatedAt
- createdAt

**Rental Item (section for each Rental Item) attributes:**

- brand
- color
- material
- rental
- size
- category/subCategory
- careDuringRental
- careOther
- condition
- isPetite
- isTall
- isCurve
- isMaternity
- updatedAt
- createdAt

#### Rental Review

When the current `state` of the rental is not `approved`, show a sticke review area at the bottom of the screen, wher ethe admin can:

1. click 'Approve' button to set `state` = `approve`
2. write a review message and click `Reject with Message` to set `state` = `rejected` and sends message from Loanhood Support to he Rental Owner.

The user can then make the requested corrections and resubmit, which would set the `state` for that rental again to `pending`.

### Tab 2: User

https://www.figma.com/file/lUKT74nk6jTwlUQzBeB590/MVP?node-id=48%3A286

A **reusable** form with view/edit mode, displaying details about the owning User associated with the Rental:

**User attributes:**

- avatar
- firstName
- lastName
- userName
- email
- isEmailVerified
- bio
- isAdmin
- isStripeVerified
- isStripeMerchant
- stripeCustomerId
- stripeIdentityId
- updatedAt
- createdAt

### Tab 3: Rental Transactions

A list of all rental transactions ordered by createdAt desc.

List attributes:

- startAt
- endAt
- current state (from rentalTransactionStates)

Filters:

- all
- upcoming
- in process
- completed

Sorting:

- date (createdAt, updatedAt)

Selecting a row opens the rental transaction detail screen.

## Rental Transaction Detail

A **reusable** form with view/edit (edit restricted for now) mode, displaying details about the Rental Transaction:

**Rental Transaction attributes:**

- rental thumbnail image
- rental title (as link to the rental detail screen)
- loaner user name (as link to the user detail screen)
- loaner address
- borrower user name (as link to the user detail screen)
- borrower address
- startAt
- endAt
- current state (from rentalTransactionStates)
- originalPrice
- rentalPricePerWeek
- deliveryPrice
- dryCleanPrice
- borrowerServiceFee
- loanerServiceFee
- stripePaymentId
- updatedAt
- createdAt

Below that form is a list with all `RentalTransactionStates`, ordered by `createdAt` desc

---

# 2. Users

## Users List

Paged list showing all users currently on the system.

List attributes:

- Avatar
- Full Name (firstName + lastName)
- User Name
- Email

Search:

- firstName
- lastName
- userName
- email

Sorting:

- Date (createdAt, updatedAt)

Selecting a row opens the user detail screen.

## User Detail

The user detail screen provides a sub navigation (tabs) for the following areas:

### Tab 1: User

https://www.figma.com/file/lUKT74nk6jTwlUQzBeB590/MVP?node-id=48%3A368

- Avatar
- First name
- Last name
- User name
- Email
- Bio
- List of addresses

### Tab 2: Listed Rentals

List like [1.Rentals - Rentals List](#rentals-list) but just for that user.

### Tab 3: Loan Rental Transactions

List like [1.Rentals - Rental Detail - Tab 3: Rental Transactions](#tab-3-rental-transactions) but just for rental transactions where user is loaner.

Filters:

- all
- upcoming
- in process
- completed

Sorting:

- date (createdAt, updatedAt)

### Tab 4: Borrow Rental Transactions

List like [1.Rentals - Rental Detail - Tab 3: Rental Transactions](#tab-3-rental-transactions) but just for rental transactions where user is borrower.

Filters:

- all
- upcoming
- in process
- completed

Sorting:

- date (createdAt, updatedAt)

---

# 3. Meta Data

Sub navigation (tabs) for the following areas:

## Tab 1: Categories

List of main categories with nested sub categories, each showing the `name` attribute.

Main categories:

- New
- Edit
- Delete (only when empty)

Sub categories:

- New
- Edit
- Delete (only when unused)

## Tab 2: Brands

List of brands, showing the `name` attribute.

- New
- Edit
- Delete (only when unused)

## Tab 3: Materials

List or grid of materials, showing the `name` attribute.

- New
- Edit
- Delete (only when unused)

## Tab 4: Colors

List of colors, showing the `color` or `pattern` (if defined) and `name` attribute.

- New
- Edit
- Delete (only when unused)

## Tab 5: Sizes

List of size-groups with nested sizes, each showing the `name` attribute.

Size groups:

- New
- Edit
- Delete (only when empty)

Sizes:

- New
- Edit
- Delete (only when unused)

---

# 4.App

## Banner Images

List of banner images.

- New
- Edit
- Delete

## Banner Texts

List of banner texts.

- New
- Edit
- Delete

## Splash Screen

Background image.

- Upload (= new/replace)
- Delete

---

TODOs:

- style tags
