import Joi from 'joi';

export const productSchemas = {
  create: Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().required().min(10).max(1000),
    price: Joi.number().required().min(0),
    stock: Joi.number().required().min(0),
    categoryId: Joi.string().required().uuid(),
    brandId: Joi.string().uuid(),
    sku: Joi.string().required().pattern(/^[A-Za-z0-9-]+$/),
    barcode: Joi.string().pattern(/^[0-9]+$/),
    images: Joi.array().items(Joi.string().uri()),
    tags: Joi.array().items(Joi.string()),
    status: Joi.string().valid('active', 'inactive', 'draft'),
    attributes: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        value: Joi.string().required()
      })
    )
  }),

  update: Joi.object({
    name: Joi.string().min(3).max(100),
    description: Joi.string().min(10).max(1000),
    price: Joi.number().min(0),
    stock: Joi.number().min(0),
    categoryId: Joi.string().uuid(),
    brandId: Joi.string().uuid(),
    sku: Joi.string().pattern(/^[A-Za-z0-9-]+$/),
    barcode: Joi.string().pattern(/^[0-9]+$/),
    images: Joi.array().items(Joi.string().uri()),
    tags: Joi.array().items(Joi.string()),
    status: Joi.string().valid('active', 'inactive', 'draft'),
    attributes: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        value: Joi.string().required()
      })
    )
  }).min(1),

  updateStock: Joi.object({
    quantity: Joi.number().required().min(0)
  })
}; 