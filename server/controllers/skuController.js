const Sku = require('../models/skuModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');
const fs = require('fs');
const randomProductId = () => {
    return Math.floor(Math.random() * 89999 + 100000)
}
const createSku = asyncHandler(async ({spu_id, sku_list}) => {
    try {
        const convert_sku_list = sku_list.map(sku => {
            return {...sku, productId: spu_id, spu_id:`${spu_id}.${randomProductId()}`}
        })
        const newSku = await Sku.create(convert_sku_list)
        res.json(newSku);
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = {
    createSku,

}