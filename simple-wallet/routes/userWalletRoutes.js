const express = require('express');
const router = express.Router();

const userWallet = require('../controllers/userWalletControllers')


router.get('/:userId', userWallet.getMyWallet)
router.post('/:userId', userWallet.createMyWallet)
router.post('/:userId/addCurrency' , userWallet.addCurrencyIntoMyWallet)
router.post('/:userId/deposit', userWallet.depositIntoMyWallet)
router.post('/:userId/transfer', userWallet.transferWithExchangeRate)


module.exports = router