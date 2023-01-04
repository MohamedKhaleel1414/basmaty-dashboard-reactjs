import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../config/axios'
import '../../searchbox.css'
import ReactPaginate from 'react-paginate';
import '../../pagination.css'
import swal from "sweetalert";
import FormData from 'form-data'
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { useJsApiLoader, GoogleMap, MarkerF, Autocomplete } from '@react-google-maps/api'

function Salons() {

  // let workingHours1 = {
  //   "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
  //   "start_from": "10:00",
  //   "end_at": "22:00"
  // }
  // let workingHours2 = {
  //   "days": ["Friday", "Saturday"],
  //   "start_from": "13:00",
  //   "end_at": "23:00"
  // }

  const nav = useNavigate()
  const [salons, setSalons] = useState([])
  const [selected, setSelected] = useState([])
  const [services, setServices] = useState([])
  const [cities, setCities] = useState([])
  const [flag, setFlag] = useState(false)
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const hours = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]

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

  // Search bar functions
  const [searchCustomer, setSearchCustomer] = useState([]);
  const [searchedSalons, setSearchedSalons] = useState([]);
  const handleChange = (e) => {
    const searchWord = e.target.value;
    const dataFiltered = salons.filter((val) => {
      return val.name.toLowerCase().includes(searchWord)
    });
    setSearchedSalons(dataFiltered)
    if (searchWord === "")
      setSearchCustomer([]);
    else
      setSearchCustomer(dataFiltered);
  };

  function showSalons() {
    if (searchedSalons.length !== 0) setSelected(searchedSalons)
  }

  function showCustomer(it) {
    const clickedCustomer = salons.filter((adm, idx) => {
      return adm.name === it
    })
    setSelected(clickedCustomer)
  }

  // Pagination functions
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(selected.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(selected.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, selected]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % selected.length;
    setItemOffset(newOffset);
  };

  const [serviceID, setServiceID] = useState({})
  const [cityCity, setCityCity] = useState('')

  function storeID(iD) {
    setServiceID(iD)
    setCityCity(iD.city.city)
  }

  function storeIDandNav(iD) {
    setServiceID(iD)
    nav('/salons/updatesalon', { state: iD })
  }

  function deleteSalon() {
    axiosInstance.delete(`/api/v1/dashboard/shops/${serviceID.id}`).then((res) => {
      console.log(res.data)
      swal("Service deleted successfully")
      if(flag === false)
            setFlag(true)
            if(flag === true)
            setFlag(false)
    })
  }

  // Add Salon Data
  const { register: registeri, handleSubmit: handleSubmiti, formState: { errors: errorsi }, } = useForm({
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

  const onErr = (er) => {
    console.log(er)
  }

  const onSubmit = (values) => {
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
    formD.append("shopImages", values.shopImages)
    formD.append("services", intServ)
    formD.append("cities", parseInt(values.cities))
    formD.append("workingHours", workingHours)
    formD.append("address", contacts)
    formD.append("address_latitude", lat)
    formD.append("address_longitude", lng)
    console.log(values)
    axiosInstance.post('/api/v1/dashboard/shops', formD).then((res) => {
      console.log(res.data)
      swal("New Service added successfully")
      if(flag === false)
            setFlag(true)
            if(flag === true)
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
    <article style={{ marginTop: '8rem', minHeight: "19.2rem" }}>
      <div className="accordion accordion-flush" id="accordionFlushExample">
        <div className="d-flex justify-content-center">
          <div className="accordion-item w-100">
            <h2 className="accordion-header" id="flush-headingOne">
              <button className="searchbtn accordion-button collapsed w-100" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                Display Salons
              </button>
            </h2>
          </div>
          <div className="accordion-item w-100">
            <h2 className="accordion-header" id="flush-headingTwo">
              <button className="searchbtn accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                Add Salon
              </button>
            </h2>
          </div>
        </div>
        <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
          <div className="accordion-body container">
            <div className="d-flex justify-content-between mb-4">
              <h3>Salons Data</h3>
              <div className='d-flex gap-3'>
                <button type='button' className='btn btn-success'><i className='bx bx-import'></i> Import Excell File</button>
                <button type='button' className='btn btn-info text-light'><i className='bx bx-export' ></i> Export Excell File</button>
              </div>
              <div className="d-flex" role="search">
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={handleChange} />
                <button className="searchbtn rounded-3 px-3" onClick={showSalons}>Search</button>
                {searchCustomer.length !== 0 && (<div className='dataResult shadow my-2 rounded-2 mt-5'>
                  {searchCustomer.slice(0, 4).map((itm, idx) => {
                    return <div key={idx}>
                      <p className='dataItem m-3' onClick={() => showCustomer(itm.name)}>{itm.name}</p>
                    </div>
                  })}
                </div>
                )}
              </div>
            </div>
            <table className="table table-striped align-middle text-center">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Logo</th>
                  <th scope="col">See More</th>
                  <th scope="col">Edit</th>
                  <th scope="col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((salon, index) => {
                  return (
                    <tr key={index} style={{ maxWidth: "5" }}>
                      <th scope='row'>{salon.id}</th>
                      <td>{salon.name}</td>
                      <td>
                        <div style={{ height: '2rem' }}>
                          <img src={salon.logo_image} alt="hair" style={{ height: '2rem', width: '2rem' }} />
                        </div>
                      </td>
                      <td>
                        <button className="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#collapseWidthExample" onClick={() => storeID(salon)} aria-expanded="false" aria-controls="collapseWidthExample"><i className="bx bx-detail"></i></button>
                      </td>
                      <td>
                        <button className="btn btn-warning" onClick={() => storeIDandNav(salon)}><i className="bx bx-edit-alt" /></button>
                      </td>
                      <td>
                        <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#adminModelDelete" onClick={() => storeID(salon)}><i className="bx bx-x" /></button>
                        <div className="modal fade text-start" id="adminModelDelete" tabIndex={-1} aria-labelledby="adminModelDeleteLabel" aria-hidden="true">
                          <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                              <div className="modal-header" style={{ backgroundColor: '#F7C9D3', borderBottom: 'solid 2px lightgray' }}>
                                <h1 className="modal-title fs-5" id="adminModelDeleteLabel">Delete Service</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                              </div>
                              <div className="modal-body p-0">
                                <h6 className='p-4'>Are you sure you want to delete this saoln?</h6>
                              </div>
                              <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" className="btn btn text-light" style={{ backgroundColor: '#C13F55' }} data-bs-dismiss="modal" onClick={deleteSalon}>Save changes</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}

              </tbody>
            </table>
            <div className="d-flex justify-content-end mb-5 align-items-center">
              <ReactPaginate
                breakLabel="..."
                nextLabel="Next »"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={pageCount}
                previousLabel="« Previous"
                renderOnZeroPageCount={null}
                containerClassName="pagination"
                pageLinkClassName="page-num"
                previousLinkClassName="page-num"
                nextLinkClassName="page-num"
                activeLinkClassName="active"
              />
            </div>
          </div>
          <div className="container collapse collapse-horizontal mb-5" id="collapseWidthExample">
            <div className='card p-4 d-flex flex-row gap-5'>
              <div className='w-50'>
                <div className='mb-2'>
                  <h5>Salon Name</h5>
                  <div>{serviceID.name}</div>
                </div>
                <div className='mb-2'>
                  <h5>City</h5>
                  <div>{cityCity}</div>
                </div>
              </div>
              <div className='ps-5'>
                <h5>English Description</h5>
                <p>{serviceID.description}</p>
              </div>
              <div className='ps-5'>
                <h5>Arabic Description</h5>
                <p>{serviceID.description}</p>
              </div>
            </div>
          </div>
        </div>
        {/* {Add New Salon} */}
        <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
          <div className="accordion-body container">
            <form className="pt-4" onSubmit={handleSubmiti(onSubmit, onErr)} encType='multipart/form-data'>
              <div className="d-flex justify-content-evenly">
                <div className="mb-3 px-4 w-100">
                  <label htmlFor="exampleInputAname" className="form-label">Arabic Name</label>
                  <input type="text" className="form-control" id="exampleInputAname" aria-describedby="emailHelp" name='name_ar' {...registeri("name_ar", { required: "must enter an arabic name" })} />
                  <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.name_ar?.message}</div>
                </div>
                <div className="mb-3 px-4 w-100">
                  <label htmlFor="exampleInputEname" className="form-label">English Name</label>
                  <input type="text" className="form-control" id="exampleInputEname" aria-describedby="emailHelp" name='name_en' {...registeri("name_en", { required: "must enter an english name" })} />
                  <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.name_en?.message}</div>
                </div>
              </div>
              <div className="d-flex justify-content-evenly">
                <div className="mb-3 px-4 w-100">
                  <label htmlFor="exampleFormControlTextarea1" className="form-label">Arabic
                    Description</label>
                  <textarea className="form-control" id="exampleFormControlTextarea1" rows={3} name='desc_ar' {...registeri("desc_ar", { required: "must enter an arabic description" })} />
                  <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.desc_ar?.message}</div>
                </div>
                <div className="mb-3 px-4 w-100">
                  <label htmlFor="exampleFormControlTextarea2" className="form-label">English
                    Description</label>
                  <textarea className="form-control" id="exampleFormControlTextarea2" rows={3} name='desc_en' {...registeri("desc_en", { required: "must enter an english description" })} />
                  <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.desc_en?.message}</div>
                </div>
              </div>
              <div className="d-flex justify-content-evenly">
                <div className="mb-4 px-4 w-100">
                  <label htmlFor="formFileSm" className="form-label" >Uploade Logo Photo</label>
                  <input className="form-control form-control-sm" id="formFileSm" type="file" accept="image/*" name='logo_image' {...registeri("logo_image", { required: "must upload logo" })} />
                  <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.logo_image?.message}</div>
                </div>
                <div className="mb-4 px-4 w-100">
                  <label htmlFor="formFileSm" className="form-label">Uploade Banner Photo</label>
                  <input className="form-control form-control-sm" id="formFileSm" type="file" accept="image/*" name='shopImages' {...registeri("shopImages", { required: "must upload banner" })} />
                  <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.shopImages?.message}</div>
                </div>
              </div>
              <div className="mb-3 px-4">
                <div className="d-flex justify-content-evenly gap-4">
                  <div className='d-flex flex-column w-100'>
                    <label className='mb-2'>Choose Service</label>
                    <select className="form-select " aria-label="Default select example" size={4} multiple name='services' {...registeri("services", { required: "must choose services" })}>
                      {services.map((service, idx) => {
                        return (
                          <option key={idx} value={service.id}  >{service.name}</option>
                        )
                      })}
                    </select>
                    <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.services?.message}</div>
                  </div>
                  <div className='d-flex flex-column w-100'>
                    <label className='mb-2'>Choose City</label>
                    <select className="form-select" aria-label="Default select example2" name='cities' {...registeri("cities", { required: "must choose a city" })}>
                      {cities.map((city, idx) => {
                        return (
                          <option key={idx} value={city.id}  >{city.city}</option>
                        )
                      })}
                    </select>
                    <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.cities?.message}</div>
                  </div>
                </div>
              </div>
              <div className="mb-3 px-4 d-flex justify-content-evenly gap-4">
                <div className='d-flex flex-column w-100'>
                  <label className='mb-2'>Choose Active Days</label>
                  <select className="form-select" aria-label="Default select example1" size={4} multiple name='days' {...registeri("days", { required: "must choose active days" })}>
                    {days.map((day, idx) => {
                      return (
                        <option key={idx} value={day}  >{day}</option>
                      )
                    })}
                  </select>
                  <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.days?.message}</div>
                </div>
                <div className='d-flex flex-column w-100'>
                  <label className='mb-2'>Start from</label>
                  <select className="form-select" aria-label="Default select example2" name='start_from' {...registeri("start_from", { required: "must choose a city" })}>
                    {hours.map((city, idx) => {
                      return (
                        <option key={idx} value={city}  >{city}</option>
                      )
                    })}
                  </select>
                  <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.start_from?.message}</div>
                </div>
                <div className='d-flex flex-column w-100'>
                  <label className='mb-2'>End at</label>
                  <select className="form-select" aria-label="Default select example2" name='end_at' {...registeri("end_at", { required: "must choose a city" })}>
                    {hours.map((city, idx) => {
                      return (
                        <option key={idx} value={city}  >{city}</option>
                      )
                    })}
                  </select>
                  <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.end_at?.message}</div>
                </div>
              </div>
              <div className='mb-3 px-4'>
                <label htmlFor="exampleFormControlTextarea11" className="form-label">Detailed Address</label>
                <textarea className="form-control" id="exampleFormControlTextarea11" rows={3} name='address' {...registeri("address", { required: "must enter address" })} />
                <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.address?.message}</div>
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
                <button type='button' className="btn btn-outline-warning mb-4 px-4 w-100">Reset</button>
                <button type='submit' className="btn btn-outline-success mb-4 px-4 w-100">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </article>
  )
}

export default Salons