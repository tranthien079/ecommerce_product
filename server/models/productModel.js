// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     product_id: {
//         type: String,
//         required: true
//     },
//     name: {
//         type: String,
//         required: true,
//         trim: true,
//         unique:true,
//     },
//     slug:{
//         type:String,
//         required:true,
//         lowercase: true,
//     },
//     status: {
//         type: String,
//         enum: ['active', 'inactive'],
//         default: 'active'
//     },
//     categoryId: {
//         // type: mongoose.Schema.Types.ObjectId,
//         // ref: 'ProductCategory'
//         type: String,
//         required: true
//     }, 
//     brandId: {
//         // type: mongoose.Schema.Types.ObjectId,
//         // ref: 'Brand'
//         type: String,
//         required: true
//     },
//     price:  {
//         type: Number,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     sold: {
//         type: Number,
//         default: 0
//     },
//     variants: {type: Array, default:[]},
//     ratings: [
//         {
//             star: Number,
//             comment: String,
//             postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
//         }
//     ],
//     totalrating: {
//         type: String,
//         default: 0
//     }
// }, { timestamps: true });

// module.exports = mongoose.model('Product', productSchema);

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique:true,

    },
    slug:{
        type:String,
        required:true,
        lowercase: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory' },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    images: [
        {
            public_id: String,
            url: String
        }
    ],
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    variants: [{
        size: String,
        color: String,
        colorCode: String,
        sku: { 
            type: String,
        },
        stock: {
            type: Number,
            default: 0
        }
    }],
    ratings: [
        {
            star: Number,
            comment: String,
            postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            createAt: { type: Date, default: Date.now },
            isShow: { type: Boolean, default: true}
        }
    ],
    totalrating: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
