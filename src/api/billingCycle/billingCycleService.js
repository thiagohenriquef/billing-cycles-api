const billingCycle = require('./billingCycle')
const errorHandler = require('../utils/errorHandler')

billingCycle.methods(['get', 'post', 'put', 'delete'])
billingCycle.updateOptions({ new: true, runValidators: true })
billingCycle.after('post', errorHandler).after('put', errorHandler)

billingCycle.route('count', (req, res, next) => {
  billingCycle.count((err, value) => {
    return err
      ? res.status(500).json({ errors: [err] })
      : res.json({ value })
  })
})

billingCycle.route('summary', (req, res, next) => {
  billingCycle.aggregate(
    [{ $project: { credit: {$sum: "$credits.value"}, debit: { $sum: "$debits.value" }}},
    { $group: {_id: null, credit: {$sum: "$credit"}, debit: {$sum: "$debit" }}},
    { $project: {_id: 0, credit: 1, debit: 1}}]
  ).exec((error, result) => {
    return error
      ? res.status(500).json({errors: [error]})
      : res.json(result[0] || { credit: 0, debit: 0 })
  })
})


module.exports = billingCycle