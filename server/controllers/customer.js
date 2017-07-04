import {extend} from 'lodash'

import {ForbiddenError, NotFoundError} from '../lib/errors'
import mailer from '../lib/mail/mail-helpers'
import Customer from '../models/customer'
import User from '../models/user'

export default {
  /**
   * Create a customer
   */
  async create(req, res) {
    let customer = new Customer(req.body)
    customer._id = req.user.id

    await User.findOneAndUpdate({_id: customer._id}, {$push: {roles: 'customer'}})

    const savedCustomer = await customer.save()
    res.json(savedCustomer)

    // mailer.send(config.mailer.to, 'A new client has applied.', 'create-customer-email')
  },

  /**
   * Show the current customer
   */
  read(req, res) {
    res.json(req.customer)
  },

  /**
   * Update a customer
   */
  async update(req, res) {
    const customer = extend(req.customer, req.body)

    const oldCustomer = await Customer.findById(customer._id)
    const newCustomer = await customer.save()

    if (newCustomer.status !== oldCustomer.status) {
      mailer.sendStatus(newCustomer)
    } else {
      mailer.sendUpdate(newCustomer)
    }

    res.json(newCustomer)
  },

  /**
   * List customers
   */
  async list(req, res) {
    const customers = await Customer.find()
      .sort('-dateReceived')
      .populate('user', 'displayName')
      .populate('assignedTo', 'firstName lastName')
    res.json(customers)
  },

  /**
   * Delete customer
   */
  async delete(req, res) {
    const id = req.customer._id

    await User.findByIdAndRemove(id)
    await Customer.findByIdAndRemove(id)

    res.json(req.customer)
  },
  /**
   * Customer middleware
   */
  async customerById(req, res, next, id) {
    const customer = await Customer.findById(id)

    if (!customer) throw new NotFoundError

    req.customer = customer
    next()
  },

  /**
   * Customer authorization middleware
   */
  hasAuthorization(req, res, next) {
    if (req.user && req.user.roles.find(r =>
        r === 'admin' || r === 'volunteer')) {
      return next()
    }

    if (!req.customer || req.customer._id !== +req.user.id)
      throw new ForbiddenError

    next()
  }
}
