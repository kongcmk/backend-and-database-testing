const ExchangeRate = require("../models/exchangeRate");
const User = require("../models/user");
const Wallet = require("../models/wallet");

//get my wallet by userId
exports.getMyWallet = async (req, res) => {
  try {
    const username = req.params.username;

    if (!username) {
      return res.status(400).json({ error: "username not provided" });
    }

    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userWallet = await Wallet.findOne({
      where: {
        wallet_name: user.username,
      },
    });

    if (!userWallet) {
      return res.status(404).json({ error: "Your wallet not found" });
    }

    return res.status(200).json(userWallet);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Create user's wallet
exports.createMyWallet = async (req, res) => {
  try {
    const username = req.params.username;
    if (!username) {
      return res.status(400).json({ error: "username not provided" });
    }

    const user = await User.findOne({
      where: {
        wallet_name: username,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingWallet = await Wallet.findOne({
      where: {
        wallet_name: user.username,
      },
    });

    if (existingWallet) {
      return res.status(400).json({ error: "You have wallet" });
    }

    const newWallet = await Wallet.create({
      wallet_name: username,
    });

    return res.status(201).json(newWallet);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//update my wallet
exports.addCurrencyIntoMyWallet = async (req, res) => {
    try {
      const username = req.params.username;
      const addCurrency = req.body.addCurrency.toUpperCase();
      if (!username) {
        return res.status(400).json({ error: "username not provided" });
      }
  
      const user = await User.findOne({
        where: {
          wallet_name: username,
        },
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const myWallet = await Wallet.findOne({
        where: {
          wallet_name: user.username,
        },
      });
  
      if (!myWallet) {
        return res.status(400).json({ error: "Your not have wallet" });
      }
     
      myWallet.cryptocurrencies[addCurrency] = 0;
      await myWallet.save();
  
      return res.status(201).json(myWallet);

      return res.status(201).json();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

//deposit currency to my wallet
exports.depositIntoMyWallet = async (req, res) => {
  try {
    const username = req.params.username;
    if (!username) {
      return res.status(400).json({ error: "username not provided" });
    }

    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userWallet = await Wallet.findOne({
      where: {
        wallet_name: user.username,
      },
    });

    if (!userWallet) {
      return res.status(404).json({ error: "Your wallet not create" });
    }

    const amount = req.body.amount;
    const currency = req.body.currency.toUpperCase();
    if (!amount || isNaN(amount) || !currency) {
      return res.status(400).json({ error: "Invalid amount or currency" });
    }

    if (!userWallet.cryptocurrencies[currency]) {
      return res.status(400).json({ error: "Currency not supported" });
    }

    userWallet.cryptocurrencies[currency] += parseFloat(amount);

    await userWallet.save();

    return res.status(200).json(userWallet);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//transfer currency
exports.transferWithExchangeRate = async (req, res) => {
    try {
        const sender = req.params.username;
        const receiver = req.body.receiver;
        const fromCurrency = req.body.fromCurrency.toUpperCase();
        const toCurrency = req.body.toCurrency.toUpperCase();
        const amount = req.body.amount

        if (!sender || !receiver || !fromCurrency || !toCurrency || !amount || isNaN(amount)) {
            return res.status(400).json({ error: 'Sender, receiver, fromCurrency, toCurrency, and amount are required' });
        }

        const senderUser = await User.findOne({
            where: {
                username: sender 
            }
        })

        if (!senderUser) {
            return res.status(404).json({ error: 'Sender user not found' });
        }
        
        const receiverUser = await User.findOne({
            where: {
                username: receiver
            }
        })

        if (!receiverUser) {
            return res.status(404).json({ error: 'Receiver user not found' });
        }

        const senderWallet = await Wallet.findOne({
            where: {
                wallet_name: senderUser.username
            }
        })

        const receiverWallet = await Wallet.findOne({
            where: {
                wallet_name: receiverUser.username
            }
        })

        if (!senderWallet || !receiverWallet) {
            return res.status(404).json({ error: 'Sender or receiver not have wallet' });
        }

        const exchangeRate = await ExchangeRate.findOne({
            where:{
                fromCurrency: fromCurrency,
                toCurrency: toCurrency
            }
        })

        if (!exchangeRate) {
            return res.status(400).json({ error: 'Exchange rate not found' });
        }

        const convertedAmount = amount * exchangeRate.rate;

        if (!senderWallet.cryptocurrencies[fromCurrency] || senderWallet.cryptocurrencies[fromCurrency] < amount) {
            return res.status(400).json({ error: 'Insufficient balance in sender wallet' });
        }

        senderWallet.cryptocurrencies[fromCurrency] -= parseFloat(amount);
        receiverWallet.cryptocurrencies[toCurrency] = (receiverWallet.cryptocurrencies[toCurrency] || 0) + parseFloat(convertedAmount);

        await senderWallet.save();
        await receiverWallet.save();

        return res.status(200).json(senderWallet);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}