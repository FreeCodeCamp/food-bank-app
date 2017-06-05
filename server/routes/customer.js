import Router from 'express-promise-router'

import customerController from '../controllers/customer'
import * as userController from '../controllers/users'

export default () => {
  const {requiresLogin} = userController
  const {hasAuthorization} = customerController

  const customerRouter = Router({mergeParams: true})

  customerRouter.route('/customer')
    .get(requiresLogin, hasAuthorization, customerController.list)
    .post(requiresLogin, customerController.create)

  customerRouter.route('/customer/:customerId')
    .get(requiresLogin, hasAuthorization, customerController.read)
    .put(requiresLogin, hasAuthorization, customerController.update)

  customerRouter.route('/admin/customers/:customerId')
    .delete(customerController.delete)

  // Finish by binding the customer middleware
  customerRouter.param('customerId', customerController.customerById)

  return customerRouter
}
