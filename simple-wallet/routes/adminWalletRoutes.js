const express = require('express');
const router = express.Router();

const adminWallet = require('../controllers/adminWalletControllers')



router.get('/:admin/wallet-list', adminWallet.getAllWallet)
router.get('/total', adminWallet.getTotalCurrencyBalance)
router.post('/:admin/increase', adminWallet.increaseCurrencyBalance)
router.post('/:admin/decrease', adminWallet.decreaseCurrencyBalance)
router.post('/:admin/addCurrency', adminWallet.addCurrency)
router.put('/:admin/update', adminWallet.updateCurrency)

module.exports = router