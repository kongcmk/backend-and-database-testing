const ExchangeRate = require("../models/exchangeRate");
const User = require("../models/user");
const Wallet = require("../models/wallet");


exports.getAllWallet = async (req, res) => {
    try {
        const adminUsername = req.params.admin;

        const admin = await User.findOne({
            where: {
              username: adminUsername,
              isAdmin: true,
            },
          });
      
          if (!adminUsername || !admin) {
            return res.status(400).json({ error: "You not admin" });
          }


        const walletList = await Wallet.findAll()
        res.status(200).json(walletList)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Internal server error'})
    }
}

// increase 
exports.increaseCurrencyBalance = async (req, res) => {
    try {
        const adminUsername = req.params.admin;
        const username = req.body.username;
        const currency = req.body.currency.toUppercase();
        const amount = req.body.amount;

        const admin = await User.findOne({
            where: {
              username: adminUsername,
              isAdmin: true,
            },
          });
      
          if (!adminUsername || !admin) {
            return res.status(400).json({ error: "You not admin" });
          }

        if (!username || !currency || !amount) {
            return res.status(400).json({ error: "Username, currency, and amount are required" });
        }

        const userWallet = await Wallet.findOne({
            where: {
                wallet_name: username
            }
        });

        if (!userWallet) {
            return res.status(404).json({ error: "User wallet not found" });
        }

        if (!userWallet.cryptocurrencies[currency]) {
            return res.status(400).json({ error: "Invalid currency" });
        }

        userWallet.cryptocurrencies[currency] += amount;

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
        const adminUsername = req.params.admin;
        const username = req.body.username;
        const currency = req.body.currency.toUppercase();
        const amount = req.body.amount;

        const admin = await User.findOne({
            where: {
              username: adminUsername,
              isAdmin: true,
            },
          });
      
          if (!adminUsername || !admin) {
            return res.status(400).json({ error: "You not admin" });
          }

        if (!username || !currency || !amount) {
            return res.status(400).json({ error: "Username, currency, and amount are required" });
        }

        const userWallet = await Wallet.findOne({
            where: {
                wallet_name: username
            }
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

        userWallet.cryptocurrencies[currency] -= amount;
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
        const currencies = ['BTC', 'ETH'];
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
        const adminUsername = req.params.admin;
        const fromCurrency = req.body.fromCurrency;
        const toCurrency = req.body.toCurrency;
        const rate = req.body.rate;
        const admin = await User.findOne({
            where: {
              username: adminUsername,
              isAdmin: true,
            },
          });
      
          if (!adminUsername || !admin) {
            return res.status(400).json({ error: "You not admin" });
          }

        if (!fromCurrency || !toCurrency) {
            return res.status(400).json({ error: "currency is required" });
        }

        const existingCurrency = await ExchangeRate.findOne({
            where: {
                fromCurrency: fromCurrency,
                toCurrency: toCurrency
            }
        });

        if (existingCurrency) {
            return res.status(400).json({ error: "Currency already exists" });
        }

        await ExchangeRate.create({
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            rate: rate,
        });

        return res.status(201).json({ message: "Currency added successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// update exchange rate
exports.updateCurrency = async (req, res) => {
    try {
        const adminUsername = req.params.admin;
        const fromCurrency = req.body.fromCurrency;
        const toCurrency = req.body.toCurrency;
        const rate = req.body.rate;
        const admin = await User.findOne({
            where: {
              username: adminUsername,
              isAdmin: true,
            },
          });
      
          if (!adminUsername || !admin) {
            return res.status(400).json({ error: "You not admin" });
          }

        if (!fromCurrency || !toCurrency) {
            return res.status(400).json({ error: "currency is required" });
        }

        const currentCurrency = await ExchangeRate.findOne({
            where: {
                fromCurrency: fromCurrency,
                toCurrency: toCurrency
            }
        });

        if (!currentCurrency) {
            return res.status(400).json({ error: "not have currency " });
        }

        currentCurrency.rate = rate;

        await currentCurrency.save();

        return res.status(201).json({ message: "Currency updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};