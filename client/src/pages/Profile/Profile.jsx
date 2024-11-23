import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import "./Profile.css"
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { addAddress, updateAddress,deleteAddress } from '../../features/addressSlice';
import { fetchAllAddress } from '../../features/addressSlice';
import AddressForm from '../AddressForm/AddressForm';
import { FaPlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { filterByBrand } from '../../features/productSlice';
import { useParams } from 'react-router-dom';


const Profile = () => {

    const [showForm, setShowForm] = useState(false);
    const {brand}=useParams()
    const dispatch = useDispatch();
    const {filteredProducts}=useSelector((state)=>state.products)
    const {addresses,error, status}=useSelector((state)=>state.address)
    // console.log(addresses)

    useEffect(() => {
      if(brand){
        dispatch(filterByBrand(brand))
      }
        dispatch(fetchAllAddress()); // Fetch addresses on component mount
      }, [dispatch,brand]);

    const addHandler=()=>{
         setShowForm(true);
        //  dispatch(addAddress())
        dispatch(fetchAllAddress())
         
    }

    const deleteAddressHandler=(addressId)=>{
        dispatch(deleteAddress(addressId))
        .then(() => dispatch(fetchAllAddress()))
        .catch((error) => console.error("Failed to delete address:", error));
    
    }
  return (
    <div className='container'>
    <div><Navbar/></div>
    <div className='profile__container'>
    <h1 className="text__center">Profile</h1>
      <div className="profile__body">
        <p>
          <b>Name:</b> <br /> {"Abhi"}
        </p>
        <p>
          <b>Username:</b> <br /> {"abhiCruze"}
        </p>
        <p>
          {" "}
          <b>Email:</b> <br /> { "abhijitcgahd2000@gamil.com"}
        </p>
        <p>
          {" "}
          <b>Phone Number:</b> <br /> {8076544217}
        </p>
        <p className='address_container'>
        <b>Address: </b>
        <button className='add_icon' onClick={()=>addHandler()}>
        <FaPlus />
        </button>
        </p>
    
          
                    {/* Address List */}
                    {addresses.length > 0 ? (
                        <ul>
                            {addresses?.map((address, index) => (
                                <li  className='address_list d-flex justify-content-between' key={index}>
                                    <div>
                                       {address.address.street}, {address.address.city},  <br />PIN:{address.address.pinCode}, {address.address.state},
                                    </div>
                                    <div>
                                    <button onClick={() => dispatch(()=>deleteAddressHandler(address._id))}><MdDelete /></button></div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No addresses found.</p>
                    )}

                    {/* Logout Button */}
                    <button className='logout-button mt-4'>Logout</button>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowForm(false)}>&times;</span>
            <AddressForm setShowForm={setShowForm} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile
