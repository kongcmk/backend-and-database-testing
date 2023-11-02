const express = require('express');
const router = express.Router();

const adminWallet = require('../controllers/adminWalletControllers')



router.get('/:adminId/wallet-list', adminWallet.getAllWallet)
router.get('/total', adminWallet.getTotalCurrencyBalance)
router.post('/:adminId/increase', adminWallet.increaseCurrencyBalance)
router.post('/:adminId/decrease', adminWallet.decreaseCurrencyBalance)
router.post('/:adminId/addCurrency', adminWallet.addCurrency)
router.put('/:adminId/updateRate', adminWallet.updateCurrency)
router.get('/:adminId/exchange-list', adminWallet.getAllExchangeRate)
module.exports = router