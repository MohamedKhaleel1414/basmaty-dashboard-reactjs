import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../config/axios'
import { useFormik } from 'formik';
import * as yup from 'yup';
import FormData from 'form-data'
import swal from "sweetalert";

function EditContacts() {

    const [contacts, setContacts] = useState({})

    // Get Contacts from Database
    useEffect(() => {
        axiosInstance.get(`/api/v1/dashboard/contact`).then((res) => {
            console.log(res.data.data) 
            setContacts(res.data.data)
        })
    }, [])

    // Update Contacts Data
    const updateContactsFormik = useFormik({
        initialValues: {
            email: '',
            phone: '',
            whatsapp: '',
            instagram: '',
            facebook: '',
            twitter: '',
            tiktok: '',
            snapchat: '',
            youtube: ''
        },
        validationSchema: yup.object().shape({
            email: yup.string().required("must enter email.").email("must enter valid email."),
            phone: yup.string().required("must enter phone number").matches(/^01[0125][0-9]{8}$/, "Invalid phone Number"),
            whatsapp: yup.string().required("must enter whatsapp number"),
            instagram: yup.string(),
            facebook: yup.string(),
            twitter: yup.string(),
            tiktok: yup.string(),
            youtube: yup.string(),
            snapchat: yup.string()
        }),
        onSubmit: (values) => {
            console.log(values)
            let inst='';
            let face='';
            let twit='';
            let tik='';
            let yout='';
            let snap='';
            if(values.instagram !== ''){
                inst = values.instagram
            }else{
                inst = contacts.instagram
            }
            if(values.facebook !== ''){
                face = values.facebook
            }else{
                face = contacts.facebook
            }
            if(values.twitter !== ''){
                twit = values.twitter
            }else{
                twit = contacts.twitter
            }
            if(values.tiktok !== ''){
                tik = values.tiktok
            }else{
                tik = contacts.tiktok
            }
            if(values.youtube !== ''){
                yout = values.youtube
            }else{
                yout = contacts.youtube
            }
            if(values.snapchat !== ''){
                snap = values.snapchat
            }else{
                snap = contacts.snapchat
            }
            let sendCon = {
                "email":values.email,
                "phone":values.phone,
                "whatsapp":values.whatsapp,
                "instagram":inst,
                "facebook":face,
                "twitter":twit,
                "tiktok":tik,
                "youtube":yout,
                "snapchat":snap
            }
            let form = new FormData
            form.append("email",values.email)
            form.append("phone",values.phone)
            form.append("whatsapp",values.whatsapp)
            form.append("instagram",inst)
            form.append("facebook",face)
            form.append("twitter",twit)
            form.append("tiktok",tik)
            form.append("youtube",yout)
            form.append("snapchat",snap)
            console.log(sendCon)
            axiosInstance.patch(`/api/v1/dashboard/contact/${contacts.id}`, form).then((res) => {
                console.log(res.data) 
                swal("Contacts updated successfully")
            })
        }
    })

    return (
        <>
            <div className='container mt-5 pt-5'>
                <h4 className='text-center mt-5'>Update Contacts</h4>
                <form className='pt-3' onSubmit={updateContactsFormik.handleSubmit}>
                    <div className='d-flex justify-content-between gap-3 mb-4'>
                        <div className='d-flex flex-column gap-4 w-100'>
                            <div className="mb-3 px-4">
                                <label htmlFor="exampleInputemail" className="form-label">E-mail</label>
                                <input type="email" className="form-control" onChange={updateContactsFormik.handleChange} onBlur={updateContactsFormik.handleBlur} value={updateContactsFormik.values.email} id="exampleInputemail" aria-describedby="emailHelp" name='email' />
                                {updateContactsFormik.touched.email && <small className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{updateContactsFormik.errors.email}</small>}
                            </div>
                            <div className="mb-3 px-4">
                                <label htmlFor="exampleInputphone" className="form-label">Phone Number</label>
                                <input type="text" className="form-control" onChange={updateContactsFormik.handleChange} onBlur={updateContactsFormik.handleBlur} value={updateContactsFormik.values.phone} id="exampleInputphone" aria-describedby="emailHelp" name='phone' />
                                {updateContactsFormik.touched.phone && <small className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{updateContactsFormik.errors.phone}</small>}
                            </div>
                            <div className="mb-3 px-4">
                                <label htmlFor="exampleInputwhats" className="form-label">WhatsApp</label>
                                <input type="text" className="form-control" onChange={updateContactsFormik.handleChange} onBlur={updateContactsFormik.handleBlur} value={updateContactsFormik.values.whatsapp} id="exampleInputwhats" aria-describedby="emailHelp" name='whatsapp' />
                                {updateContactsFormik.touched.whatsapp && <small className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{updateContactsFormik.errors.whatsapp}</small>}
                            </div>
                        </div>
                        <div className='d-flex flex-column gap-4 w-100'>
                            <div className="mb-3 px-4">
                                <label htmlFor="exampleInputinsta" className="form-label">Instagram</label>
                                <input type="text" className="form-control" onChange={updateContactsFormik.handleChange} onBlur={updateContactsFormik.handleBlur} value={updateContactsFormik.values.instagram} id="exampleInputinsta" aria-describedby="emailHelp" name='instagram' />
                            </div>
                            <div className="mb-3 px-4">
                                <label htmlFor="exampleInputface" className="form-label">Facebook</label>
                                <input type="text" className="form-control" onChange={updateContactsFormik.handleChange} onBlur={updateContactsFormik.handleBlur} value={updateContactsFormik.values.facebook} id="exampleInputface" aria-describedby="emailHelp" name='facebook' />
                            </div>
                            <div className="mb-3 px-4">
                                <label htmlFor="exampleInputtwitter" className="form-label">Twitter</label>
                                <input type="text" className="form-control" onChange={updateContactsFormik.handleChange} onBlur={updateContactsFormik.handleBlur} value={updateContactsFormik.values.twitter} id="exampleInputtwitter" aria-describedby="emailHelp" name='twitter' />
                            </div>
                        </div>
                        <div className='d-flex flex-column gap-4 w-100'>
                            <div className="mb-3 px-4">
                                <label htmlFor="exampleInputtiktok" className="form-label">TikTok</label>
                                <input type="text" className="form-control" onChange={updateContactsFormik.handleChange} onBlur={updateContactsFormik.handleBlur} value={updateContactsFormik.values.tiktok} id="exampleInputtiktok" aria-describedby="emailHelp" name='tiktok' />
                            </div>
                            <div className="mb-3 px-4">
                                <label htmlFor="exampleInputyoutube" className="form-label">YouTube</label>
                                <input type="text" className="form-control" onChange={updateContactsFormik.handleChange} onBlur={updateContactsFormik.handleBlur} value={updateContactsFormik.values.youtube} id="exampleInputyoutube" aria-describedby="emailHelp" name='youtube' />
                            </div>
                            <div className="mb-3 px-4">
                                <label htmlFor="exampleInputsnap" className="form-label">SnapChat</label>
                                <input type="text" className="form-control" onChange={updateContactsFormik.handleChange} onBlur={updateContactsFormik.handleBlur} value={updateContactsFormik.values.snapchat} id="exampleInputsnap" aria-describedby="emailHelp" name='snapchat' />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-evenly gap-5 border-top pt-5">
                        <button type='button' className="btn btn-outline-warning mb-4 px-4 w-100 rounded-4">Reset</button>
                        <button type='submit' className="btn btn-outline-success mb-4 px-4 w-100 rounded-4" disabled={!updateContactsFormik.isValid && updateContactsFormik.touched}>Submit</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default EditContacts