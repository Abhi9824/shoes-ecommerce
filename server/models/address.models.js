const mongoose=require('mongoose')

const addressSchema=new mongoose.Schema({

    contact:{
    name:{
        type:String,required:true
    },
    phoneNumber: {
        type: String,
        required: true,
        match: [
          /^(?:7|8|9)\d{9}$/,
          "Please provide a valid 10-digit Indian phone number"
        ],
      }
    },
    address:{
        pinCode:{
            type:String,
            required:true
        },
        street:{
            type:String,required:true
        },
        locality:{type:String},
        city:{
            type:String,required:true
        },
        state:{
            type:String,required:true
        }
    },
//     totalOrderItems:{
// type:Number,
//     },
//     total_price:{
//         type:Number,
//         required:true
//     },
//     discount:{
//         type:Number
//     },
//     deliveryCharge:{
//         type:Number
//     }

})

const  AddressDetails=mongoose.model('AddressDetails', addressSchema)
module.exports={AddressDetails}