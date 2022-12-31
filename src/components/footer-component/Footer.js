import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../config/axios'
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/basmaty-logo.png'
import whats from '../../assets/whats.png'
import instagram from '../../assets/instagram.png'
import facebook from '../../assets/facebook.png'
import twitter from '../../assets/twitter.png'
import tiktok from '../../assets/tiktok.png'
import youtube from '../../assets/youtube.png'
import snapchat from '../../assets/snapchat.png'

function Footer() {

    const [contacts, setContacts] = useState({})
    const nav = useNavigate()

    // Get Contacts from Database
    useEffect(() => {
        axiosInstance.get('/api/v1/dashboard/contact').then((res) => {
            console.log(res.data.data)
            setContacts(res.data.data)
        })
    }, [])

    function editContacts(){
        nav('/updatecontacts')
    }

    return (
        <>
            <footer className='navbar py-5' style={{ backgroundColor: 'rgb(236, 236, 236)', boxShadow: '1px 1px 1px 3px lightgray' }}>
                <aside className='d-flex justify-content-start gap-5'>
                    <div className='w-25 d-flex flex-column gap-3'>
                        <div className=" text-center fs-2 d-flex justify-content-center align-items-center" style={{ color: '#C13F55' }}>
                            <div>
                                <img src={logo} alt="basmaty" style={{ width: '75%' }} />
                            </div>
                            <div>
                                <div style={{ lineHeight: '22px' }}>Basmaty</div>
                                <div style={{ lineHeight: '22px' }}>بـــسمتــي</div>
                            </div>
                        </div>
                        <div className='text-center'>
                            <button className='btn btn-warning rounded-3' onClick={editContacts}><i className="bx bx-edit-alt" /> Edit Contacts</button>
                        </div>
                    </div>
                    <div className='w-25'>
                        <div className='d-flex justify-content-start gap-4'>
                            <i className='bx bx-phone-call fs-4 '></i>
                            <p>{contacts.phone}</p>
                        </div>
                        <div className='d-flex justify-content-start gap-4'>
                            <i className='bx bx-envelope fs-4 '></i>
                            <p>{contacts.email}</p>
                        </div>
                        <div className='d-flex justify-content-start gap-3'>
                            <div className='' style={{ width: "9%" }}>
                                <img src={whats} className='w-100' />
                            </div>
                            <p>{contacts.whatsapp}</p>
                        </div>
                    </div>
                    <div className='w-25'>
                        <div className='d-flex justify-content-start gap-3'>
                            <div className='' style={{ width: "9%" }}>
                                <img src={instagram} className='w-100' />
                            </div>
                            <p><a href={contacts.instagram}>{contacts.instagram}</a></p>
                        </div>
                        <div className='d-flex justify-content-start gap-3'>
                            <div className='' style={{ width: "9%" }}>
                                <img src={facebook} className='w-100' />
                            </div>
                            <p><a href={contacts.facebook}>{contacts.facebook}</a></p>
                        </div>
                        <div className='d-flex justify-content-start gap-3'>
                            <div className='' style={{ width: "9%" }}>
                                <img src={twitter} className='w-100' />
                            </div>
                            <p><a href={contacts.twitter}>{contacts.twitter}</a></p>
                        </div>
                    </div>
                    <div className='w-25'>
                        <div className='d-flex justify-content-start gap-3'>
                            <div className='' style={{ width: "9%" }}>
                                <img src={tiktok} className='w-100' />
                            </div>
                            <p><a href={contacts.tiktok}>{contacts.tiktok}</a></p>
                        </div>
                        <div className='d-flex justify-content-start gap-3'>
                            <div className='' style={{ width: "9%" }}>
                                <img src={youtube} className='w-100' />
                            </div>
                            <p><a href={contacts.youtube}>{contacts.youtube}</a></p>
                        </div>
                        <div className='d-flex justify-content-start gap-3'>
                            <div className='' style={{ width: "9%" }}>
                                <img src={snapchat} className='w-100' />
                            </div>
                            <p><a href={contacts.snapchat}>{contacts.snapchat}</a></p>
                        </div>
                    </div>
                </aside>
            </footer>
        </>
    )
}

export default Footer