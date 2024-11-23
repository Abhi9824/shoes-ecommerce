const { AddressDetails } =require('../models/address.models')
const  { Cart } =require("../models/cart.models")


const addAddress=async (addressData)=>{
  
    try{
        const address= new AddressDetails(addressData)
        await address.save()
        console.log("Address added successfully", address)
        return address

    }catch(error){
        throw error
    }
}

const updateAddress = async (addressId, addressToUpdate) => {
  try {
      const address = await AddressDetails.findByIdAndUpdate(addressId, addressToUpdate, { new: true });
      if (!address) {
          throw new Error("Address not found");
      }
      // console.log("Address updated successfully", address);
      return address;
  } catch (error) {
      // console.error("Error in updateAddress:", error); // Log error for debugging
      throw error;
  }
}


const deleteAddress = async (addressId) => {
    try {
      const address = await AddressDetails.findByIdAndDelete(addressId);
      if (!address) {
        throw new Error("Address not found");
      }
      // console.log("Address deleted successfully:", address);
      return address;
    } catch (error) {
      console.error("Error deleting address:", error);
      throw error;
    }
  };
  

  const getAllAddress=async()=>{
try{
    const getAllAddress=await AddressDetails.find()
    console.log("All addresses:", getAllAddress);
    return getAllAddress; 

}catch(error){
    throw new Error("Error retrieving address", error)
}
  }

module.exports={deleteAddress, addAddress,updateAddress, getAllAddress }