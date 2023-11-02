const ExchangeRate = require("../models/exchangeRate");
const User = require("../models/user");
const Wallet = require("../models/wallet");

exports.getAllWallet = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    if (!adminId) {
      return res.status(400).json({ error: "You not admin or not provided" });
    }

    const admin = await User.findByPk(adminId);

    if (admin.isAdmin !== true) {
      return res.status(400).json({ error: "You not admin" });
    }
    const walletList = await Wallet.findAll();
    res.status(200).json(walletList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// increase
exports.increaseCurrencyBalance = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const username = req.body.username;
    const reqCurrency = req.body.currency;
    const amount = req.body.amount;

    if (!adminId) {
      return res.status(400).json({ error: "You not admin or not provided" });
    }

    const admin = await User.findByPk(adminId);

    if (admin.isAdmin !== true) {
      return res.status(400).json({ error: "You not admin" });
    }

    if (!username || !reqCurrency || !amount) {
      return res
        .status(400)
        .json({ error: "Username, currency, and amount are required" });
    }

    const currency = reqCurrency.toUpperCase();

    const userWallet = await Wallet.findOne({
      where: {
        wallet_name: username,
      },
    });

    if (!userWallet) {
      return res.status(404).json({ error: "User wallet not found" });
    }

    if (!userWallet.cryptocurrencies[currency]) {
      return res.status(400).json({ error: "Invalid currency" });
    }

    userWallet.cryptocurrencies = {
      ...userWallet.cryptocurrencies,
      [currency]:
        (userWallet.cryptocurrencies[currency] || 0) + parseFloat(amount),
    };

    await userWallet.save();
    return res.status(200).json(userWallet);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// decrease
exports.decreaseCurrencyBalance = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const username = req.body.username;
    const reqCurrency = req.body.currency;
    const amount = req.body.amount;

    const admin = await User.findByPk(adminId);

    if (!adminId || !admin) {
      return res.status(400).json({ error: "You not admin" });
    }

    if (admin.isAdmin !== true) {
      return res.status(400).json({ error: "You not admin" });
    }

    if (!username || !reqCurrency || !amount) {
      return res
        .status(400)
        .json({ error: "Username, currency, and amount are required" });
    }

    const currency = reqCurrency.toUpperCase();

    const userWallet = await Wallet.findOne({
      where: {
        wallet_name: username,
      },
    });

    if (!userWallet) {
      return res.status(404).json({ error: "User wallet not found" });
    }

    if (!userWallet.cryptocurrencies[currency]) {
      return res.status(400).json({ error: "Invalid currency" });
    }

    if (userWallet.cryptocurrencies[currency] < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }


    userWallet.cryptocurrencies = {
        ...userWallet.cryptocurrencies,
        [currency] : (userWallet.cryptocurrencies[currency]) - parseFloat(amount)
    }

    await userWallet.save();

    return res.status(200).json(userWallet);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// total balance
exports.getTotalCurrencyBalance = async (req, res) => {
  try {
    const currencies = ["BTC", "ETH"];
    let totalBalance = {};

    for (const currency of currencies) {
      totalBalance[currency] = 0;
    }

    const wallets = await Wallet.findAll();

    for (const wallet of wallets) {
      for (const currency of currencies) {
        totalBalance[currency] += wallet.cryptocurrencies[currency];
      }
    }

    return res.status(200).json(totalBalance);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// add exchange rate
exports.addCurrency = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const fromCurrency = req.body.fromCurrency;
    const toCurrency = req.body.toCurrency;
    const rate = req.body.rate;
    const admin = await User.findByPk(adminId);

    if (!adminId || !admin) {
      return res.status(400).json({ error: "You are not an admin" });
    }

    if (!fromCurrency || !toCurrency || !rate) {
      return res.status(400).json({ error: "Currency is required" });
    }

    const newFromCurrency = fromCurrency.toUpperCase();
    const newToCurrency = toCurrency.toUpperCase();

    const existingCurrency = await ExchangeRate.findOne({
      where: {
        fromCurrency: newFromCurrency,
        toCurrency: newToCurrency,
      },
    });

    if (existingCurrency) {
      return res.status(400).json({ error: "Currency already exists" });
    }

    const newExchangeRate = await ExchangeRate.create({
      fromCurrency: newFromCurrency,
      toCurrency: newToCurrency,
      rate: rate,
    });

    return res
      .status(201)
      .json({ message: "Currency added successfully", newExchangeRate });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// update exchange rate
exports.updateCurrency = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const reqFromCurrency = req.body.fromCurrency;
    const reqToCurrency = req.body.toCurrency;
    const rate = req.body.rate;
    const admin = await User.findByPk(adminId);

    if (!adminId || !admin) {
      return res.status(400).json({ error: "You not admin" });
    }

    if (!reqFromCurrency || !reqToCurrency || !rate) {
      return res.status(400).json({ error: "currency is required" });
    }

    const fromCurrency = reqFromCurrency.toUpperCase();
    const toCurrency = reqToCurrency.toUpperCase();

    const currentCurrency = await ExchangeRate.findOne({
      where: {
        fromCurrency: fromCurrency,
        toCurrency: toCurrency,
      },
    });

    if (!currentCurrency) {
      return res.status(400).json({ error: "not have currency " });
    }

    currentCurrency.rate = rate;

    await currentCurrency.save();

    return res
      .status(201)
      .json({ message: "Currency updated successfully", currentCurrency });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// get exchange rate all
exports.getAllExchangeRate = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const admin = await User.findByPk(adminId);

    if (!adminId || !admin) {
      return res.status(400).json({ error: "You not admin" });
    }

    const exchangeRateList = await ExchangeRate.findAll();
    res.status(200).json(exchangeRateList);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
