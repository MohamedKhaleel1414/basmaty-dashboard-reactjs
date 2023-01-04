import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../config/axios'
import swal from "sweetalert";
import FormData from 'form-data'
import { useForm } from "react-hook-form";
import { useLocation } from 'react-router-dom';
import { useJsApiLoader, GoogleMap, MarkerF, Autocomplete } from '@react-google-maps/api'

function UpdateSalon() {

    const iD = useLocation().state
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const hours = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
    const [salons, setSalons] = useState([])
    const [selected, setSelected] = useState([])
    const [services, setServices] = useState([])
    const [cities, setCities] = useState([])
    const [flag, setFlag] = useState(false)

    // Get salons from Database
    useEffect(() => {
        axiosInstance.get('/api/v1/dashboard/shops').then((res) => {
            console.log(res.data.data)
            setSalons(res.data.data)
            setSelected(res.data.data)
        })
        axiosInstance.get('/api/v1/dashboard/services').then((res) => {
            console.log(res.data.data)
            setServices(res.data.data)
        })
        axiosInstance.get('/api/v1/dashboard/cities').then((res) => {
            console.log(res.data.data)
            setCities(res.data.data)
        })
    }, [])

    // Rerendering after any operation
    useEffect(() => {
        axiosInstance.get('/api/v1/dashboard/shops').then((res) => {
            console.log(res.data.data)
            setSalons(res.data.data)
            setSelected(res.data.data)
        })
        axiosInstance.get('/api/v1/dashboard/services').then((res) => {
            console.log(res.data.data)
            setServices(res.data.data)
        })
        axiosInstance.get('/api/v1/dashboard/cities').then((res) => {
            console.log(res.data.data)
            setCities(res.data.data)
        })
    }, [flag])

    // Update Salon Data
    const { register: registeru, handleSubmit: handleSubmitu, formState: { errors: errorsu }, } = useForm({
        defaultValues: {
            name_ar: '',
            name_en: '',
            desc_ar: '',
            desc_en: '',
            logo_image: '',
            shopImages: '',
            services: [],
            cities: 0,
            days: '',
            start_from: '',
            end_at: '',
            address: '',
            address_latitude: '',
            address_longitude: ''
        },
    });

    const onErru = (er) => {
        console.log(er)
    }

    const onSubmitu = (values) => {
        let contacts = {
            "address": values.address
        }
        let intServ = []
        for (let i = 0; i < values.services.length; i++) {
            intServ.push(parseInt(values.services[i]))
        }
        let workingHours = {
            "days": values.days,
            "start_from": values.start_from,
            "end_at": values.end_at
        }
        let formD = new FormData()
        formD.append("name_ar", values.name_ar)
        formD.append("name_en", values.name_en)
        formD.append("desc_ar", values.desc_ar)
        formD.append("desc_en", values.desc_en)
        formD.append("logo_image", values.logo_image[0])
        formD.append("shopImages", values.img)
        formD.append("services", intServ)
        formD.append("cities", parseInt(values.cities))
        formD.append("workingHours", workingHours)
        formD.append("address", contacts)
        formD.append("address_latitude", lat)
        formD.append("address_longitude", lng)
        console.log(values)
        axiosInstance.patch(`/api/v1/dashboard/shops/${iD.id}`, formD).then((res) => {
            console.log(res.data)
            swal("New Service added successfully")
            if (flag === false)
                setFlag(true)
            if (flag === true)
                setFlag(false)
        })
    };

    // Maps Functions
    const [lat, setLat] = useState(24.466667)
    const [lng, setLng] = useState(54.499901)
    const [map, setMap] = useState(null)
    const [searchResult, setSearchResult] = useState('')

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyBZ0BEST1YPeSj2hVc07h9ODZtW13avBLc",
        libraries: ["places"],
    })

    function onLoad(autocomplete) {
        setSearchResult(autocomplete);
    }

    function onPlaceChanged() {
        if (searchResult != null) {
            setLat(searchResult.getPlace().geometry.location.lat())
            setLng(searchResult.getPlace().geometry.location.lng())
        }
    }

    if (!isLoaded) {
        return <div>Loading...</div>
    }


    return (
        <>
            <div className='container mt-5 pt-5'>
                <h4 className='text-center mt-5'>Update {iD.name} Salon</h4>
                <form className="pt-3" onSubmit={handleSubmitu(onSubmitu, onErru)} encType='multipart/form-data'>
                    <div className="d-flex justify-content-evenly">
                        <div className="mb-3 px-4 w-100">
                            <label htmlFor="exampleInputAname" className="form-label">Arabic Name</label>
                            <input type="text" className="form-control" id="exampleInputAname" aria-describedby="emailHelp" name='name_ar' {...registeru("name_ar", { required: "must enter an arabic name" })} />
                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.name_ar?.message}</div>
                        </div>
                        <div className="mb-3 px-4 w-100">
                            <label htmlFor="exampleInputEname" className="form-label">English Name</label>
                            <input type="text" className="form-control" id="exampleInputEname" aria-describedby="emailHelp" name='name_en' {...registeru("name_en", { required: "must enter an english name" })} />
                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.name_en?.message}</div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-evenly">
                        <div className="mb-3 px-4 w-100">
                            <label htmlFor="exampleFormControlTextarea1" className="form-label">Arabic
                                Description</label>
                            <textarea className="form-control" id="exampleFormControlTextarea1" rows={3} name='desc_ar' {...registeru("desc_ar", { required: "must enter an arabic description" })} />
                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.desc_ar?.message}</div>
                        </div>
                        <div className="mb-3 px-4 w-100">
                            <label htmlFor="exampleFormControlTextarea2" className="form-label">English
                                Description</label>
                            <textarea className="form-control" id="exampleFormControlTextarea2" rows={3} name='desc_en' {...registeru("desc_en", { required: "must enter an english description" })} />
                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.desc_en?.message}</div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-evenly">
                        <div className="mb-4 px-4 w-100">
                            <label htmlFor="formFileSm" className="form-label" >Uploade Logo Photo</label>
                            <input className="form-control form-control-sm" id="formFileSm" type="file" accept="image/*" name='logo_image' {...registeru("logo_image", { required: "must upload logo" })} />
                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.logo_image?.message}</div>
                        </div>
                        <div className="mb-4 px-4 w-100">
                            <label htmlFor="formFileSm" className="form-label">Uploade Banner Photo</label>
                            <input className="form-control form-control-sm" id="formFileSm" type="file" accept="image/*" name='shopImages' {...registeru("shopImages", { required: "must upload banner" })} />
                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.shopImages?.message}</div>
                        </div>
                    </div>
                    <div className="mb-3 px-4">
                        <div className="d-flex justify-content-evenly gap-4">
                            <div className='d-flex flex-column w-100'>
                                <label className='mb-2'>Choose Service</label>
                                <select className="form-select " aria-label="Default select example" size={4} multiple name='services' {...registeru("services", { required: "must choose services" })}>
                                    {services.map((service, idx) => {
                                        return (
                                            <option key={idx} value={service.id}  >{service.name}</option>
                                        )
                                    })}
                                </select>
                                <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.services?.message}</div>
                            </div>
                            <div className='d-flex flex-column w-100'>
                                <label className='mb-2'>Choose City</label>
                                <select className="form-select" aria-label="Default select example2" name='cities' {...registeru("cities", { required: "must choose a city" })}>
                                    {cities.map((city, idx) => {
                                        return (
                                            <option key={idx} value={city.id}  >{city.city}</option>
                                        )
                                    })}
                                </select>
                                <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.cities?.message}</div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-3 px-4 d-flex justify-content-evenly gap-4">
                        <div className='d-flex flex-column w-100'>
                            <label className='mb-2'>Choose Active Days</label>
                            <select className="form-select" aria-label="Default select example1" size={4} multiple name='days' {...registeru("days", { required: "must choose active days" })}>
                                {days.map((day, idx) => {
                                    return (
                                        <option key={idx} value={day}  >{day}</option>
                                    )
                                })}
                            </select>
                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.days?.message}</div>
                        </div>
                        <div className='d-flex flex-column w-100'>
                            <label className='mb-2'>Start from</label>
                            <select className="form-select" aria-label="Default select example2" name='start_from' {...registeru("start_from", { required: "must choose a city" })}>
                                {hours.map((city, idx) => {
                                    return (
                                        <option key={idx} value={city}  >{city}</option>
                                    )
                                })}
                            </select>
                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.start_from?.message}</div>
                        </div>
                        <div className='d-flex flex-column w-100'>
                            <label className='mb-2'>End at</label>
                            <select className="form-select" aria-label="Default select example2" name='end_at' {...registeru("end_at", { required: "must choose a city" })}>
                                {hours.map((city, idx) => {
                                    return (
                                        <option key={idx} value={city}  >{city}</option>
                                    )
                                })}
                            </select>
                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.end_at?.message}</div>
                        </div>
                    </div>
                    <div className='mb-3 px-4'>
                        <label htmlFor="exampleFormControlTextarea11" className="form-label">Detailed Address</label>
                        <textarea className="form-control" id="exampleFormControlTextarea11" rows={3} name='address' {...registeru("address", { required: "must enter address" })} />
                        <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.address?.message}</div>
                    </div>
                    <div className="mb-5 px-4 border-bottom pb-5">
                        <GoogleMap center={{ lat: lat, lng: lng }} zoom={10} mapContainerStyle={{ width: "100%", height: "25rem" }} onLoad={(map) => setMap(map)} onClick={ev => {
                            setLat(ev.latLng.lat());
                            setLng(ev.latLng.lng());
                        }}>
                            <div className='d-flex justify-content-start position-relative gap-3' style={{ height: "10%", top: "2.5%", left: "19%" }}>
                                <button type="button" className='border-0 bg-light rounded-1' style={{ height: "100%", width: "4%" }} onClick={() => map.panTo({ lat: lat, lng: lng })}><i className='bx bx-current-location fs-5'></i></button>
                                <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
                                    <input type="text" placeholder='Search' className='px-2 border-0 bg-light rounded-1' style={{ height: "100%" }} />
                                </Autocomplete>
                            </div>
                            <MarkerF position={{ lat: lat, lng: lng }} />
                        </GoogleMap>
                    </div>
                    <div className="d-flex justify-content-evenly gap-5">
                        <button className="btn btn-outline-warning mb-4 px-4 w-100 rounded-4">Reset</button>
                        <button className="btn btn-outline-success mb-4 px-4 w-100 rounded-4">Submit</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default UpdateSalon