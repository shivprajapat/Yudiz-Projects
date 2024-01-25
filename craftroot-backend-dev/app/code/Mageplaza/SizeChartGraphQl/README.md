# Magento 2 Size Chart GraphQL / PWA 

**Magento 2 Size Chart GraphQL is now a part of the Mageplaza Size Chart extension that adds GraphQL features. This supports PWA compatibility.**

[Mageplaza Size Chart for Magento 2](https://www.mageplaza.com/magento-2-size-chart/) is an essential extension for online stores that specialize in fashion or wearable products. 

As the cloth sizes vary depending on people's shape, an online clothing store must have a standard size chart for anyone to choose the items of their own sizes. It's convenient for customers to select suitable sizes for them. 

On the product page, there is no limitation to display the size charts. The store owners can create size charts for every single product or category based on the catalog rules. The conditions to display the size charts can be the categories like male, female, tops, bottoms, footwear, etc. Depending on the category, the store admin can configure to include or exclude a size chart for specific product types. 

Size Chart extension provides you with six pre-made templates that are designed upon the standard sizing system. If you want the available size charts to be more suitable for your target customers, you can modify them easily from the admin backend with user-friendly template HTML. The extension enables you to change the size charts design without any limitations, from changing sizes, inserting images, or videos, to size chart labels or background color. 

The size chart can be displayed in-line or via a pop-up. With an in-line size chart, customers can immediately see the size table as it shows up along with the product information. With pop-up type, With pop-up type, only after customers click on the "size chart" button will the size table display. You can also add the size chart button manually by inserting a snippet. 

A reasonable size chart will make customers more confident when buying wearable products as they will know whether a particular item fits them well. 

What’s more, **Magento 2 Size Chart GraphQL is now a part of Mageplaza Size Chart extension that adds GraphQL features.** This supports PWA compatibility. 

## 1. How to install
Run the following command in Magento 2 root folder:

```
composer require mageplaza/module-size-chart-graphql
php bin/magento setup:upgrade
php bin/magento setup:static-content:deploy
```

**Note:**
Magento 2 Size Chart GraphQL requires installing [Mageplaza Size Chart](https://www.mageplaza.com/magento-2-size-chart/) in your Magento installation. 

## 2. How to use

To start working with **Size Chart GraphQL** in Magento, you need to:

- Use Magento 2.3.x. Return your site to developer mode
- Install [chrome extension](https://chrome.google.com/webstore/detail/chromeiql/fkkiamalmpiidkljmicmjfbieiclmeij?hl=en) (currently does not support other browsers)
- Set **GraphQL endpoint** as `http://<magento2-3-server>/graphql` in url box, click **Set endpoint**. (e.g. http://develop.mageplaza.com/graphql/ce232/graphql)
- Perform a query in the left cell then click the **Run** button or **Ctrl + Enter** to see the result in the right cell
- To see the supported queries for **Size Chart GraphQL** of Mageplaza, you can look in `Docs > Query > mpSizeChart` in the right corner

![](https://i.imgur.com/br9go6o.png)

- Also, you can add more sizechart info into product query by Mageplaza Size Chart extension. You can look at the right corner and go to `Doc > Query > product`.

![](https://i.imgur.com/LUE5YsU.png)


**You can see more examples [here](https://documenter.getpostman.com/view/5187684/SzKQz1Sq?version=latest).**

## 3. Devdocs
- [Magento 2 Size Chart API & examples](https://documenter.getpostman.com/view/10589000/SzRxXqxc?version=latest)
- [Magento 2 Size Chart GraphQL & examples](https://documenter.getpostman.com/view/10589000/SzRxXr2t?version=latest)

Click on Run in Postman to add these collections to your workspace quickly.

![Magento 2 blog graphql pwa](https://i.imgur.com/lhsXlUR.gif)

## 4. Contribute to this module
Feel free to **Fork** and contribute to this module. 

You can create a pull request for any change suggestion. We will consider and marge your proposed changes in the main branch. 

## 5. Get support 
- If you have any question and problem, feel free to [contact us]((https://www.mageplaza.com/contact.html). We're happy to have your ideas and solve your problems away. 
- If you find this post practical, please give it a **Star** ![star](https://i.imgur.com/S8e0ctO.png)

