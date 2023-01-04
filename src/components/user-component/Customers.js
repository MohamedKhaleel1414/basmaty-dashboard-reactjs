import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../config/axios'
import '../../searchbox.css'
import ReactPaginate from 'react-paginate';
import '../../pagination.css'
import swal from "sweetalert";

function Customers() {

    const [customers, setCustomers] = useState([])
    const [selected, setSelected] = useState([])
    const [flag, setFlag] = useState(false)

    // Get Customers from Database
    useEffect(() => {
        axiosInstance.get('/api/v1/dashboard/users').then((res) => {
            console.log(res.data.data)
            setCustomers(res.data.data)
            setSelected(res.data.data)
        })
    }, [])

    // Rerendering after any operation
    useEffect(() => {
        axiosInstance.get('/api/v1/dashboard/users').then((res) => {
            console.log(res.data.data)
            setCustomers(res.data.data)
            setSelected(res.data.data)
        })
    }, [flag])

    // Search bar functions
    const [searchCustomer, setSearchCustomer] = useState([]);
    const [searchedUsers, setSearchedUsers] = useState([])
    const handleChange = (e) => {
        const searchWord = e.target.value;
        const dataFiltered = customers.filter((val) => {
            return val.email.toLowerCase().includes(searchWord)
        });
        setSearchedUsers(dataFiltered)
        if (searchWord === "")
            setSearchCustomer([]);
        else
            setSearchCustomer(dataFiltered);
    };

    function showUsers() {
        if (searchedUsers.length !== 0) setSelected(searchedUsers)
    }

    function showCustomer(it) {
        const clickedCustomer = customers.filter((adm, idx) => {
            return adm.email === it
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

    const [customerID, setCustomerID] = useState({})
    function storeID(iD) {
        setCustomerID(iD)
    }

    // Ban Customer
    function banUser() {
        axiosInstance.get(`/api/v1/dashboard/users/ban/${customerID.id}`).then((res) => {
            console.log(res.data)
            swal("Customer Banned successfully")
            if (flag === false)
                setFlag(true)
            if (flag === true)
                setFlag(false)
        })
    }

    // UnBan Customer
    function unbanUser() {
        axiosInstance.get(`/api/v1/dashboard/users/unban/${customerID.id}`).then((res) => {
            console.log(res.data)
            swal("Customer UnBanned successfully")
            if (flag === false)
                setFlag(true)
            if (flag === true)
                setFlag(false)
        })
    }

    // Export Customer
    function exportCustomer() {
        axiosInstance.get('/api/v1/dashboard/users/export').then((res) => {
            console.log(res.data)
            swal("File exported successfully")
        })
    }

    return (
        <>
            <article className="container" style={{ marginTop: '8rem' }}>
                <div>
                    <div className="d-flex justify-content-between mb-4">
                        <h3>Customers Data</h3>
                        <div className='d-flex gap-3'>
                            <button type='button' className='btn btn-success'><i className='bx bx-import'></i> Import Excell File</button>
                            <button type='button' className='btn btn-info text-light' onClick={exportCustomer}><i className='bx bx-export'></i> Export Excell File</button>
                        </div>
                        <div className='d-flex flex-column'>
                            <div className="d-flex">
                                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={handleChange} />
                                <button className="searchbtn rounded-3 px-3" onClick={showUsers}>Search</button>
                            </div>
                            {searchCustomer.length !== 0 && (<div className='dataResult shadow my-2 rounded-2'>
                                {searchCustomer.slice(0, 4).map((itm, idx) => {
                                    return <div key={idx}>
                                        <p className='dataItem m-3' onClick={() => showCustomer(itm.email)}>{itm.email}</p>
                                    </div>
                                })}
                            </div>
                            )}
                        </div>
                    </div>
                    <table className="table table-striped text-center">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                                <th scope="col">E-mail</th>
                                <th scope="col">Status</th>
                                <th scope="col">More Details</th>
                                <th scope="col">Ban/UnBan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((admin, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">{admin.id}</th>
                                        <td>{admin.first_name}</td>
                                        <td>{admin.last_name}</td>
                                        <td>{admin.email}</td>
                                        <td>{admin.ban}</td>
                                        <td>
                                            <button className="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#collapseWidthExample" onClick={() => storeID(admin)} aria-expanded="false" aria-controls="collapseWidthExample"><i className="bx bx-detail"></i></button>
                                        </td>
                                        <td>
                                            {admin.ban === "unbanned" && <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#adminModelBan" onClick={() => storeID(admin)}><i className='bx bx-minus '></i></button>}
                                            {admin.ban === "banned" && <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#adminModelUnBan" onClick={() => storeID(admin)}><i className='bx bx-check'></i></button>}
                                            <div className="modal fade text-start" id="adminModelBan" tabIndex={-1} aria-labelledby="adminModelBanLabel" aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered">
                                                    <div className="modal-content">
                                                        <div className="modal-header" style={{ backgroundColor: '#F7C9D3', borderBottom: 'solid 2px lightgray' }}>
                                                            <h1 className="modal-title fs-5" id="adminModelDeleteLabel">Ban User</h1>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                                        </div>
                                                        <div className="modal-body p-0">
                                                            <h6 className='p-4'>Are you sure you want to ban this user?</h6>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                            <button type="button" className="btn btn text-light" style={{ backgroundColor: '#C13F55' }} data-bs-dismiss="modal" onClick={banUser}>Save changes</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal fade text-start" id="adminModelUnBan" tabIndex={-1} aria-labelledby="adminModelUnBanLabel" aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered">
                                                    <div className="modal-content">
                                                        <div className="modal-header" style={{ backgroundColor: '#F7C9D3', borderBottom: 'solid 2px lightgray' }}>
                                                            <h1 className="modal-title fs-5" id="adminModelDeleteLabel">UnBan User</h1>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                                        </div>
                                                        <div className="modal-body p-0">
                                                            <h6 className='p-4'>Are you sure you want to unban this user?</h6>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                            <button type="button" className="btn btn text-light" style={{ backgroundColor: '#C13F55' }} data-bs-dismiss="modal" onClick={unbanUser}>Save changes</button>
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
                <div className="collapse collapse-horizontal mb-5" id="collapseWidthExample">
                    <div className='card p-4 d-flex flex-row gap-5'>
                        <div className='w-25'>
                            <img src={customerID.image} alt={customerID.id} className='w-100' />
                        </div>
                        <div className='ps-5'>
                            <h5>Full Name</h5>
                            <p>{customerID.name}</p>
                            <h5>Status</h5>
                            <p>{customerID.ban}</p>
                            <h5>E-mail</h5>
                            <p>{customerID.email}</p>
                            <h5>Join Date</h5>
                            <p>{customerID.email_verified_at}</p>
                        </div>
                    </div>
                </div>
            </article>
        </>
    )
}

export default Customers