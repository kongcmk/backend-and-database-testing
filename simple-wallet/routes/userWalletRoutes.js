const express = require('express');
const router = express.Router();

const userWallet = require('../controllers/userWalletControllers')


router.get('/:username', userWallet.getMyWallet)
router.post('/:username', userWallet.createMyWallet)
router.post('/:userId/addCurrency' , userWallet.addCurrencyIntoMyWallet)
router.post('/:username/deposit', userWallet.depositIntoMyWallet)
router.post('/:username/transfer', userWallet.transferWithExchangeRate)


module.exports = router