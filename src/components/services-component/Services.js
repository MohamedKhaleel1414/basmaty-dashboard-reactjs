import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../config/axios'
import '../../searchbox.css'
import ReactPaginate from 'react-paginate';
import '../../pagination.css'
import swal from "sweetalert";
import FormData from 'form-data'
import { useForm } from "react-hook-form";

function Services() {

    const [services, setServices] = useState([])
    const [selected, setSelected] = useState([])
    const [flag, setFlag] = useState(false)

    // Get services from Database
    useEffect(() => {
        axiosInstance.get('/api/v1/dashboard/services').then((res) => {
            console.log(res.data.data)
            setServices(res.data.data)
            setSelected(res.data.data)
        })
    }, [])

    // Rerendering after any operation
    useEffect(() => {
        axiosInstance.get('/api/v1/dashboard/services').then((res) => {
            console.log(res.data.data)
            setServices(res.data.data)
            setSelected(res.data.data)
        })
    }, [flag])

    // Search bar functions
    const [searchCustomer, setSearchCustomer] = useState([]);
    const [searchedServices, setSearchedServices] = useState([]);
    const handleChange = (e) => {
        const searchWord = e.target.value;
        const dataFiltered = services.filter((val) => {
            return val.name.toLowerCase().includes(searchWord)
        });
        setSearchedServices(dataFiltered)
        if (searchWord === "")
            setSearchCustomer([]);
        else
            setSearchCustomer(dataFiltered);
    };

    function showServices() {
        if (searchedServices.length !== 0) setSelected(searchedServices)
    }

    function showCustomer(it) {
        const clickedCustomer = services.filter((adm, idx) => {
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
    function storeID(iD) {
        setServiceID(iD)
    }

    // Add Service Data
    const { register: registeri, handleSubmit: handleSubmiti, formState: { errors: errorsi }, } = useForm({
        defaultValues: {
            name_ar: '',
            name_en: '',
            desc_ar: '',
            desc_en: '',
            image: ''
        },
    });

    const onSubmit = (values) => {
        let formD = new FormData()
        formD.append("name_ar", values.name_ar)
        formD.append("name_en", values.name_en)
        formD.append("desc_ar", values.desc_ar)
        formD.append("desc_en", values.desc_en)
        formD.append("image", values.image[0])
        console.log(values)
        console.log("add")
        axiosInstance.post('/api/v1/dashboard/services', formD).then((res) => {
            console.log(res.data)
            swal("New Service added successfully")
            if (flag === false)
                setFlag(true)
            if (flag === true)
                setFlag(false)
        })
    };

    // Update Service Data
    const { register: registeru, handleSubmit: handleSubmitu, formState: { errors: errorsu }, } = useForm({
        defaultValues: {
            name_aru: '',
            name_enu: '',
            desc_aru: '',
            desc_enu: '',
            imageu: ''
        },
    });

    const onSubmitu = (values) => {
        let formDU = new FormData()
        formDU.append("name_ar", values.name_aru)
        formDU.append("name_en", values.name_enu)
        formDU.append("desc_ar", values.desc_aru)
        formDU.append("desc_en", values.desc_enu)
        formDU.append("image", values.imageu[0])
        console.log(values.imageu[0])
        console.log("update")
        axiosInstance.patch(`/api/v1/dashboard/services/${serviceID.id}`, formDU).then((res) => {
            console.log(res.data)
            swal("Service updated successfully")
            if (flag === false)
                setFlag(true)
            if (flag === true)
                setFlag(false)
        })
    };

    // Delete Service
    function deleteService() {
        axiosInstance.delete(`/api/v1/dashboard/services/${serviceID.id}`).then((res) => {
            console.log(res.data)
            swal("Service deleted successfully")
            if (flag === false)
                setFlag(true)
            if (flag === true)
                setFlag(false)
        })
    }

    // Export Service
    function exportService() {
        axiosInstance.get('/api/v1/dashboard/services/export').then((res) => {
            console.log(res.data)
            swal("File exported successfully")
        })
    }

    return (
        <>
            <article className="container" style={{ marginTop: '8rem' }}>
                <div>
                    <div className="d-flex justify-content-between mb-4">
                        <h3>Services Data</h3>
                        <div className='d-flex gap-3'>
                            <button type='button' className='btn btn-success'><i className='bx bx-import'></i> Import Excell File</button>
                            <button type='button' className='btn btn-info text-light' onClick={exportService}><i className='bx bx-export'></i> Export Excell File</button>
                        </div>
                        <div className='d-flex flex-column'>
                            <div className="d-flex">
                                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={handleChange} />
                                <button className="searchbtn rounded-3 px-3" onClick={showServices}>Search</button>
                            </div>
                            {searchCustomer.length !== 0 && (<div className='dataResult shadow my-2 rounded-2'>
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
                                <th scope="col">Photo</th>
                                <th scope='col'>Description</th>
                                <th scope="col">Edit</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((service, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope='row'>{service.id}</th>
                                        <td>{service.name}</td>
                                        <td>
                                            <div style={{ height: '2rem' }}>
                                                <img src={service.image} alt="hair" style={{ height: '2rem', width: '2rem' }} />
                                            </div>
                                        </td>
                                        <td>
                                            <button className="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#collapseWidthExample" onClick={() => storeID(service)} aria-expanded="false" aria-controls="collapseWidthExample"><i className="bx bx-detail"></i></button>
                                        </td>
                                        <td>
                                            <button className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#adminModelUpdate" onClick={() => storeID(service)}><i className="bx bx-edit-alt" /></button>

                                        </td>
                                        <td>
                                            <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#adminModelDelete" onClick={() => storeID(service)}><i className="bx bx-x" /></button>
                                            <div className="modal fade text-start" id="adminModelDelete" tabIndex={-1} aria-labelledby="adminModelDeleteLabel" aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered">
                                                    <div className="modal-content">
                                                        <div className="modal-header" style={{ backgroundColor: '#F7C9D3', borderBottom: 'solid 2px lightgray' }}>
                                                            <h1 className="modal-title fs-5" id="adminModelDeleteLabel">Delete Service</h1>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                                        </div>
                                                        <div className="modal-body p-0">
                                                            <h6 className='p-4'>Are you sure you want to delete this service?</h6>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                            <button type="button" className="btn btn text-light" style={{ backgroundColor: '#C13F55' }} data-bs-dismiss="modal" onClick={deleteService}>Save changes</button>
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
                    {/* Update Service */}
                    <div className="modal fade" id="adminModelUpdate" tabIndex={-1} aria-labelledby="adminModelUpdateLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header" style={{ backgroundColor: '#F7C9D3', borderBottom: 'solid 2px lightgray' }}>
                                    <h1 className="modal-title fs-5" id="adminModelUpdateLabel">Update Service</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                </div>
                                <div className="modal-body p-0 text-start">
                                    <form className="pt-4" onSubmit={handleSubmitu(onSubmitu)} encType="multipart/form-data">
                                        <div className="mb-3 px-4">
                                            <label htmlFor="exampleInputAnameU" className="form-label">Arabic Name</label>
                                            <input type="text" className="form-control" id="exampleInputAnameU" aria-describedby="emailHelp" name='name_aru' {...registeru("name_aru", { required: "must enter an arabic name" })} />
                                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.name_aru?.message}</div>
                                        </div>
                                        <div className="mb-3 px-4">
                                            <label htmlFor="exampleInputEnameU" className="form-label">English Name</label>
                                            <input type="text" className="form-control" id="exampleInputEnameU" aria-describedby="emailHelp" name='name_enu' {...registeru("name_enu", { required: "must enter an english name" })} />
                                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.name_enu?.message}</div>
                                        </div>
                                        <div className="mb-3 px-4">
                                            <label htmlFor="exampleFormControlTextarea11U" className="form-label">Arabic Description</label>
                                            <textarea className="form-control" id="exampleFormControlTextarea11U" rows={3} name='desc_aru' {...registeru("desc_aru", { required: "must enter an arabic description" })} />
                                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.desc_aru?.message}</div>
                                        </div>
                                        <div className="mb-3 px-4">
                                            <label htmlFor="exampleFormControlTextarea22U" className="form-label">English Description</label>
                                            <textarea className="form-control" id="exampleFormControlTextarea22U" rows={3} name='desc_enu' {...registeru("desc_enu", { required: "must enter an english description" })} />
                                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.desc_enu?.message}</div>
                                        </div>
                                        <div className="mb-4 px-4">
                                            <label htmlFor="formFileSmU" className="form-label" >Uploade Photo</label>
                                            <input className="form-control form-control-sm" id="formFileSmU" type="file" accept="image/*" name='imageu' {...registeru("imageu", { required: "must upload logo" })} />
                                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.imageu?.message}</div>
                                        </div>
                                        <div className="modal-footer" style={{ backgroundColor: '#F7C9D3', borderTop: 'solid 2px lightgray' }}>
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="submit" className="btn text-light" style={{ backgroundColor: '#C13F55' }} >Submit</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between mb-5 align-items-center">
                        {/* Add Service */}
                        <button type="button" className="searchbtn rounded-3 px-3 py-2" data-bs-toggle="modal" data-bs-target="#adminModel">
                            Add Service
                        </button>
                        <div className="modal fade" id="adminModel" tabIndex={-1} aria-labelledby="adminModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header" style={{ backgroundColor: '#F7C9D3', borderBottom: 'solid 2px lightgray' }}>
                                        <h1 className="modal-title fs-5" id="adminModelLabel">Add Service</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                    </div>
                                    <div className="modal-body p-0">
                                        <form className="pt-4" onSubmit={handleSubmiti(onSubmit)} encType="multipart/form-data">
                                            <div className="mb-3 px-4">
                                                <label htmlFor="exampleInputAname" className="form-label">Arabic Name</label>
                                                <input type="text" className="form-control" id="exampleInputAname" aria-describedby="emailHelp" name='name_ar' {...registeri("name_ar", { required: "must enter an arabic name" })} />
                                                <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.name_ar?.message}</div>
                                            </div>
                                            <div className="mb-3 px-4">
                                                <label htmlFor="exampleInputEname" className="form-label">English Name</label>
                                                <input type="text" className="form-control" id="exampleInputEname" aria-describedby="emailHelp" name='name_en' {...registeri("name_en", { required: "must enter an english name" })} />
                                                <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.name_en?.message}</div>
                                            </div>
                                            <div className="mb-3 px-4">
                                                <label htmlFor="exampleFormControlTextarea11" className="form-label">Arabic Description</label>
                                                <textarea className="form-control" id="exampleFormControlTextarea11" rows={3} name='desc_ar' {...registeri("desc_ar", { required: "must enter an arabic description" })} />
                                                <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.desc_ar?.message}</div>
                                            </div>
                                            <div className="mb-3 px-4">
                                                <label htmlFor="exampleFormControlTextarea22" className="form-label">English Description</label>
                                                <textarea className="form-control" id="exampleFormControlTextarea22" rows={3} name='desc_en' {...registeri("desc_en", { required: "must enter an english description" })} />
                                                <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.desc_en?.message}</div>
                                            </div>
                                            <div className="mb-4 px-4">
                                                <label htmlFor="formFileSm" className="form-label" >Uploade Photo</label>
                                                <input className="form-control form-control-sm" id="formFileSm" type="file" accept="image/*" name='image' {...registeri("image", { required: "must upload logo" })} />
                                                <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.image?.message}</div>
                                            </div>
                                            <div className="modal-footer" style={{ backgroundColor: '#F7C9D3', borderTop: 'solid 2px lightgray' }}>
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="submit" className="btn text-light" style={{ backgroundColor: '#C13F55' }} >Submit</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                <div className="collapse collapse-horizontal mb-5" id="collapseWidthExample">
                    <div className='card p-4 d-flex flex-row gap-5'>
                        <div className='w-25 text-center align-self-center'>
                            <img src={serviceID.image} alt={serviceID.id} />
                        </div>
                        <div className='ps-5'>
                            <h5>English Name</h5>
                            <p>{serviceID.name}</p>
                            <h5>English Description</h5>
                            <p>{serviceID.description}</p>
                        </div>
                        <div className='ps-5'>
                            <h5>Arabic Name</h5>
                            <p>{serviceID.name}</p>
                            <h5>Arabic Description</h5>
                            <p>{serviceID.description}</p>
                        </div>
                    </div>
                </div>
            </article>
        </>
    )
}

export default Services