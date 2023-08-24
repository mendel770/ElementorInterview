const { chromium } = require('playwright');

async function runTests() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  //////////// 2.A Login Positive Test////////////////////
  try
   {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.waitForURL('**/inventory.html');

    // Login Negative Test
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'Mendel');
    await page.fill('#password', 'ABB124');
    await page.click('#login-button');
    const errorMessage = await page.innerText('.error-message-container');
    console.assert(errorMessage.includes('Epic sadface: Username and password do not match any user in this service'));
  



    /////////// 2.B Add and Remove Product Test ///////////////
    // Login
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.waitForURL('**/inventory.html');

    // Add product to cart
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('a.shopping_cart_link');

    // Verify product in cart
    const cartItems = await page.$$('.cart_item');
    if (cartItems.length === 1) {
      console.log('Product successfully added to cart.');
    } else {
      console.log('Product not added to cart.');
    }

    // Remove product from cart
    await page.click('button[data-test="remove-sauce-labs-backpack"]');
    
    // Verify cart is empty
    const cartIsEmpty = await page.$('button[data-test="remove-sauce-labs-backpack"]');
    if (!cartIsEmpty) {
      console.log('Product successfully removed from cart.');
    } else {
      console.log('Product not removed from cart.');

    ////////////////////////////3.C  Sorting Test //////////////////////
    
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.waitForURL('**/inventory.html');

    // Click the sort dropdown
    await page.click('select.product_sort_container');

    // Select "Price (high to low)" from the dropdown
    await page.selectOption('select.product_sort_container', 'Price (high to low)');

    // Wait for the page to reload after sorting
    await page.waitForLoadState('networkidle');

    // Get the list of product prices
    const productPrices = await page.$$('.inventory_item_price');
    const prices = await Promise.all(productPrices.map(priceElement => priceElement.innerText()));

    // Convert prices to numbers for comparison
    const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));

    // Verify the prices are in descending order
    let isDescending = true;
    for (let i = 0; i < numericPrices.length - 1; i++) {
      if (numericPrices[i] < numericPrices[i + 1]) {
        isDescending = false;
        break;
      }
    }

    if (isDescending) {
      console.log('Sorting by price in descending order is successful.');
    } else {
      console.log('Sorting by price in descending order failed.');
    }
  

////////////////// 3.D CHECKOUT FLOW //////////////////
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await page.waitForURL('**/inventory.html');

  // Add product to cart
  await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
  await page.click('a.shopping_cart_link');

  // Proceed to checkout
  await page.click('button[data-test="checkout"]');
  await page.waitForURL('**/checkout-step-one.html');

  // Fill in checkout information
  await page.fill('#first-name', 'John');
  await page.fill('#last-name', 'Doe');
  await page.fill('#postal-code', '12345');
  await page.click('button[data-test="continue"]');

  // Verify checkout overview page
  await page.waitForURL('**/checkout-step-two.html');
  const productTitle = await page.innerText('.inventory_item_name');
  if (productTitle.includes('Sauce Labs Backpack')) {
    console.log('Product title matches in checkout.');
  } else {
    console.log('Product title does not match in checkout.');
  }

  // Finish checkout
  await page.click('button[data-test="finish"]');
  await page.waitForURL('**/checkout-complete.html');

  // Verify checkout completion
  const orderConfirmation = await page.innerText('.complete-header');
  if (orderConfirmation.includes('THANK YOU FOR YOUR ORDER')) {
    console.log('Checkout flow completed successfully.');
  } else {
    console.log('Checkout flow did not complete successfully.');
  }
  

  ///////////////////////// 3.F Screenshot comparison /////////////////////
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
  
    await page.goto('https://www.saucedemo.com/');
    // Perform login and other steps...
  
    // Navigate to the products page
    await page.goto('https://www.saucedemo.com/inventory.html');
  
    // Capture a screenshot before sorting
    await page.screenshot({ path: 'before_sorting.png' });
  
    // Click the sort dropdown
    await page.click('select.product_sort_container');
  
    // Select "Price (low to high)" from the dropdown
    await page.selectOption('select.product_sort_container', 'Price (low to high)');
  
    // Wait for the page to reload after sorting
    await page.waitForLoadState('networkidle');
  
    // Capture a screenshot after sorting
    await page.screenshot({ path: 'after_sorting.png' });

    }

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
  }
  
}

runTests();




