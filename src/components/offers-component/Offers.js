import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../config/axios'
import '../../searchbox.css'
import ReactPaginate from 'react-paginate';
import '../../pagination.css'
import swal from "sweetalert";
import FormData from 'form-data'
import { useForm } from "react-hook-form";

function Offers() {

    const [offers, setOffers] = useState([])
    const [selected, setSelected] = useState([])
    const [salons, setSalons] = useState([])

    // Get Offers from Database
    useEffect(() => {
        axiosInstance.get('/api/v1/dashboard/offers').then((res) => {
            console.log(res.data.data)
            setOffers(res.data.data)
            setSelected(res.data.data)
        })
        axiosInstance.get('/api/v1/dashboard/shops').then((res) => {
            console.log(res.data.data)
            setSalons(res.data.data)
        })
    }, [])

    // Search bar functions
    const [searchCustomer, setSearchCustomer] = useState([]);
    const [searchedServices, setSearchedServices] = useState([]);
    const handleChange = (e) => {
        const searchWord = e.target.value;
        const dataFiltered = offers.filter((val) => {
            return val.title.toLowerCase().includes(searchWord)
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
        const clickedCustomer = offers.filter((adm, idx) => {
            return adm.title === it
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
    const [nam, setNam] = useState('')
    function storeID(iD) {
        setServiceID(iD)
        setNam(iD.shop.name)
    }

    // Delete Offer
    function deleteOffer() {
        axiosInstance.delete(`api/v1/dashboard/offers/${serviceID.id}`).then((res) => {
            console.log(res.data)
            swal("Offer deleted successfuly")
        })
    }

    // Add Offer Data
    const { register: registeri, handleSubmit: handleSubmiti, watch: watchi, formState: { errors: errorsi }, } = useForm({
        defaultValues: {
            title_ar: '',
            title_en: '',
            content_ar: '',
            content_en: '',
            active: '',
            shop: '',
            logo_image: '',
            banner_image: ''
        },
    });

    const onSubmit = (values) => {
        let formD = new FormData()
        formD.append("title_ar", values.title_ar)
        formD.append("title_en", values.title_en)
        formD.append("content_ar", values.content_ar)
        formD.append("content_en", values.content_en)
        formD.append("active", values.active)
        formD.append("shop", values.shop)
        formD.append("logo_image", values.logo_image[0])
        formD.append("banner_image", values.banner_image[0])
        console.log(values)
        console.log("add")
        axiosInstance.post('/api/v1/dashboard/offers', formD).then((res) => {
            console.log(res.data)
            swal("New Offer added successfully")
        })
    };

    // Update Offer Data
    const { register: registeru, handleSubmit: handleSubmitu, watch: watchu, formState: { errors: errorsu }, } = useForm({
        defaultValues: {
            title_ar: '',
            title_en: '',
            content_ar: '',
            content_en: '',
            active: '',
            shop: '',
            logo_image: '',
            banner_image: ''
        },
    });

    const onSubmitu = (values) => {
        let formDU = new FormData()
        formDU.append("title_ar", values.title_ar)
        formDU.append("title_en", values.title_en)
        formDU.append("content_ar", values.content_ar)
        formDU.append("content_en", values.content_en)
        formDU.append("active", values.active)
        formDU.append("shop", values.shop)
        formDU.append("logo_image", values.logo_image[0])
        formDU.append("banner_image", values.banner_image[0])
        console.log(values)
        console.log("update")
        axiosInstance.patch(`/api/v1/dashboard/offers/${serviceID.id}`, formDU).then((res) => {
            console.log(res.data)
            swal("Offer updated successfully")
        })
    };

    // Export Service
    function exportOffer() {
        axiosInstance.get('/api/v1/dashboard/offers/export').then((res) => {
            console.log(res.data)
            swal("File exported successfully")
        })
    }

    return (
        <>
            <article className="container" style={{ marginTop: '8rem' }}>
                <div>
                    <div className="d-flex justify-content-between mb-4">
                        <h3>Offers Data</h3>
                        <div className='d-flex gap-3'>
                            <button className='btn btn-success'><i className='bx bx-import'></i> Import Excell File</button>
                            <button className='btn btn-info text-light'><i className='bx bx-export' onClick={exportOffer}></i> Export Excell File</button>
                        </div>
                        <div className='d-flex flex-column'>
                            <div className="d-flex">
                                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={handleChange} />
                                <button className="searchbtn rounded-3 px-3" onClick={showServices}>Search</button>
                            </div>
                            {searchCustomer.length !== 0 && (<div className='dataResult shadow my-2 rounded-2'>
                                {searchCustomer.slice(0, 4).map((itm, idx) => {
                                    return <div key={idx}>
                                        <p className='dataItem m-3' onClick={() => showCustomer(itm.title)}>{itm.title}</p>
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
                                <th scope="col">Title</th>
                                <th scope="col">Offered By</th>
                                <th scope="col">Status</th>
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
                                        <td>{service.title}</td>
                                        <td>{service.shop.name}</td>
                                        <td>{service.active === 0 ? (<div className='text-success fw-bold'>Active</div>) : (<div className='text-danger fw-bold'>InActive</div>)} </td>
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
                                                            <button type="button" className="btn btn text-light" style={{ backgroundColor: '#C13F55' }} data-bs-dismiss="modal" onClick={deleteOffer}>Save changes</button>
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
                    {/* Update Offer */}
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
                                            <label htmlFor="exampleInputAname" className="form-label">Arabic Title</label>
                                            <input type="text" className="form-control" id="exampleInputAname" aria-describedby="emailHelp" name='title_ar' {...registeru("title_ar", { required: "must enter an arabic title" })} />
                                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.title_ar?.message}</div>
                                        </div>
                                        <div className="mb-3 px-4">
                                            <label htmlFor="exampleInputEname" className="form-label">English Title</label>
                                            <input type="text" className="form-control" id="exampleInputEname" aria-describedby="emailHelp" name='title_en' {...registeru("title_en", { required: "must enter an english title" })} />
                                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.title_en?.message}</div>
                                        </div>
                                        <div className="mb-3 px-4">
                                            <label htmlFor="exampleFormControlTextarea11" className="form-label">Arabic Content</label>
                                            <textarea className="form-control" id="exampleFormControlTextarea11" rows={3} name='content_ar' {...registeru("content_ar", { required: "must enter an arabic content" })} />
                                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.content_ar?.message}</div>
                                        </div>
                                        <div className="mb-3 px-4">
                                            <label htmlFor="exampleFormControlTextarea22" className="form-label">English Content</label>
                                            <textarea className="form-control" id="exampleFormControlTextarea22" rows={3} name='content_en' {...registeru("content_en", { required: "must enter an english content" })} />
                                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.content_en?.message}</div>
                                        </div>
                                        <div className='mb-3 px-4'>
                                            <label className="form-label">Choose Shop</label>
                                            <select className="form-select" aria-label="Default select example" name='shop' {...registeru("shop", { required: "must choose activity status" })}>
                                                {salons.map((salon, idx) => {
                                                    return (
                                                        <option key={idx} value={salon.id}>{salon.name}</option>
                                                    )
                                                })}
                                            </select>
                                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.shop?.message}</div>
                                        </div>
                                        <div className='mb-3 px-4'>
                                            <label className="form-label">Choose Activity Status</label>
                                            <select className="form-select" aria-label="Default select example" name='active' {...registeru("active", { required: "must choose activity status" })}>
                                                <option value="0">InActive</option>
                                                <option value="1">Active</option>
                                            </select>
                                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.active?.message}</div>
                                        </div>
                                        <div className="mb-4 px-4">
                                            <label htmlFor="formFileSm" className="form-label" >Uploade Logo Photo</label>
                                            <input className="form-control form-control-sm" id="formFileSm" type="file" accept="image/*" name='logo_image' {...registeru("logo_image", { required: "must upload logo" })} />
                                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.logo_image?.message}</div>
                                        </div>
                                        <div className="mb-4 px-4">
                                            <label htmlFor="formFileSm" className="form-label" >Uploade Banner Photo</label>
                                            <input className="form-control form-control-sm" id="formFileSm" type="file" accept="image/*" name='banner_image' {...registeru("banner_image", { required: "must upload banner" })} />
                                            <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsu.banner_image?.message}</div>
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
                        {/* Add Offer */}
                        <button type="button" className="searchbtn rounded-3 px-3 py-2" data-bs-toggle="modal" data-bs-target="#adminModel">
                            Add Offer
                        </button>
                        <div className="modal fade" id="adminModel" tabIndex={-1} aria-labelledby="adminModelLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header" style={{ backgroundColor: '#F7C9D3', borderBottom: 'solid 2px lightgray' }}>
                                        <h1 className="modal-title fs-5" id="adminModelLabel">Add Offer</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                    </div>
                                    <div className="modal-body p-0">
                                        <form className="pt-4" onSubmit={handleSubmiti(onSubmit)} encType="multipart/form-data">
                                            <div className="mb-3 px-4">
                                                <label htmlFor="exampleInputAname" className="form-label">Arabic Title</label>
                                                <input type="text" className="form-control" id="exampleInputAname" aria-describedby="emailHelp" name='title_ar' {...registeri("title_ar", { required: "must enter an arabic title" })} />
                                                <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.title_ar?.message}</div>
                                            </div>
                                            <div className="mb-3 px-4">
                                                <label htmlFor="exampleInputEname" className="form-label">English Title</label>
                                                <input type="text" className="form-control" id="exampleInputEname" aria-describedby="emailHelp" name='title_en' {...registeri("title_en", { required: "must enter an english title" })} />
                                                <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.title_en?.message}</div>
                                            </div>
                                            <div className="mb-3 px-4">
                                                <label htmlFor="exampleFormControlTextarea11" className="form-label">Arabic Content</label>
                                                <textarea className="form-control" id="exampleFormControlTextarea11" rows={3} name='content_ar' {...registeri("content_ar", { required: "must enter an arabic content" })} />
                                                <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.content_ar?.message}</div>
                                            </div>
                                            <div className="mb-3 px-4">
                                                <label htmlFor="exampleFormControlTextarea22" className="form-label">English Content</label>
                                                <textarea className="form-control" id="exampleFormControlTextarea22" rows={3} name='content_en' {...registeri("content_en", { required: "must enter an english content" })} />
                                                <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.content_en?.message}</div>
                                            </div>
                                            <div className='mb-3 px-4'>
                                                <label className="form-label">Choose Shop</label>
                                                <select className="form-select" aria-label="Default select example" name='shop' {...registeri("shop", { required: "must choose activity status" })}>
                                                    {salons.map((salon, idx) => {
                                                        return (
                                                            <option key={idx} value={salon.id}>{salon.name}</option>
                                                        )
                                                    })}
                                                </select>
                                                <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.shop?.message}</div>
                                            </div>
                                            <div className='mb-3 px-4'>
                                                <label className="form-label">Choose Activity Status</label>
                                                <select className="form-select" aria-label="Default select example" name='active' {...registeri("active", { required: "must choose activity status" })}>
                                                    <option value="0">InActive</option>
                                                    <option value="1">Active</option>
                                                </select>
                                                <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.active?.message}</div>
                                            </div>
                                            <div className="mb-4 px-4">
                                                <label htmlFor="formFileSm" className="form-label" >Uploade Logo Photo</label>
                                                <input className="form-control form-control-sm" id="formFileSm" type="file" accept="image/*" name='logo_image' {...registeri("logo_image", { required: "must upload logo" })} />
                                                <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.logo_image?.message}</div>
                                            </div>
                                            <div className="mb-4 px-4">
                                                <label htmlFor="formFileSm" className="form-label" >Uploade Banner Photo</label>
                                                <input className="form-control form-control-sm" id="formFileSm" type="file" accept="image/*" name='banner_image' {...registeri("banner_image", { required: "must upload banner" })} />
                                                <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.banner_image?.message}</div>
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
                        <div className='w-25'>
                            <img src={serviceID.logo_image} alt={serviceID.id} className='w-100' />
                        </div>
                        <div className='ps-5'>
                            <h5>Offer Title</h5>
                            <p>{serviceID.title}</p>
                            <h5>Offered By</h5>
                            <p>{nam}</p>
                            <h5>Status</h5>
                            <p>{serviceID.active === 0 ? "Active" : "InActive"}</p>
                        </div>
                        <div className='ps-5'>
                            <h5>Description</h5>
                            <p>{serviceID.content}</p>
                        </div>
                    </div>
                </div>
            </article>
        </>
    )
}

export default Offers