import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../config/axios'
import '../../searchbox.css'
import ReactPaginate from 'react-paginate';
import '../../pagination.css'
import swal from "sweetalert";

function Reservations() {

    const [customers, setCustomers] = useState([])
    const [selected, setSelected] = useState([])

    // Get Reservations from Database
    useEffect(() => {
        axiosInstance.get('/api/v1/dashboard/reservations').then((res) => {
            console.log(res.data.data)
            setCustomers(res.data.data)
            setSelected(res.data.data)
        })
    }, [])

    // Search bar functions
    const [searchCustomer, setSearchCustomer] = useState([]);
    const [searchedUsers, setSearchedUsers] = useState([])
    const handleChange = (e) => {
        const searchWord = e.target.value;
        const dataFiltered = customers.filter((val) => {
            return val.code.toLowerCase().includes(searchWord)
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
            return adm.code === it
        })
        setSelected(clickedCustomer)
    }

    // Pagination functions
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 5;

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
    const [shop, setShop] = useState('')
    const [servs,setServs] = useState([])
    const [username,setUsername] = useState('')
    function storeID(iD) {
        setCustomerID(iD)
        setShop(iD.shop.name)
        setServs(iD.services)
        setUsername(iD.user.name)
    }

    return (
        <>
            <article className="container" style={{ marginTop: '8rem' }}>
                <div>
                    <div className="d-flex justify-content-between mb-4">
                        <h3>Reservations Data</h3>
                        <div className='d-flex gap-3'>
                            <button className='btn btn-success'><i className='bx bx-import'></i> Import Excell File</button>
                            <button className='btn btn-info text-light'><i className='bx bx-export'></i> Export Excell File</button>
                        </div>
                        <div className='d-flex flex-column'>
                            <div className="d-flex">
                                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={handleChange} />
                                <button className="searchbtn rounded-3 px-3" onClick={showUsers}>Search</button>
                            </div>
                            {searchCustomer.length !== 0 && (<div className='dataResult shadow my-2 rounded-2'>
                                {searchCustomer.slice(0, 4).map((itm, idx) => {
                                    return <div key={idx}>
                                        <p className='dataItem m-3' onClick={() => showCustomer(itm.code)}>{itm.code}</p>
                                    </div>
                                })}
                            </div>
                            )}
                        </div>
                    </div>
                    <table className="table table-striped text-center">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Code</th>
                                <th scope="col">Shop</th>
                                <th scope="col">Reserved at</th>
                                <th scope="col">Status</th>
                                <th scope="col">Price</th>
                                <th scope="col">More Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((admin, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">{index+1+itemOffset}</th>
                                        <td>{admin.code}</td>
                                        <td>{admin.shop.name}</td>
                                        <td>{admin.reserved_at}</td>
                                        <td>{admin.reservation_status}</td>
                                        <td>{admin.price}</td>
                                        <td>
                                            <button className="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#collapseWidthExample" onClick={() => storeID(admin)} aria-expanded="false" aria-controls="collapseWidthExample"><i className="bx bx-detail"></i></button>
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
                    <div className='card p-4 d-flex flex-row justify-content-evenly gap-5'>
                        <div>
                            <h5>Code</h5>
                            <p>{customerID.code}</p>
                            <h5>Reserved at</h5>
                            <p>{customerID.reserved_at}</p>
                            <h5>Status</h5>
                            <p>{customerID.reservation_status}</p>
                        </div>
                        <div >
                            <h5>Customer</h5>
                            <p>{username}</p>
                            <h5>Price</h5>
                            <p>{customerID.price}</p>
                            <h5>Payment Method</h5>
                            <p>{customerID.payment_method}</p>
                        </div>
                        <div>
                            <h5>Shop</h5>
                            <p>{shop}</p>
                            <h5>Services</h5>
                            {servs.map((serv, idx) => {
                                return (
                                    <p key={idx}>{serv.name}</p>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </article>
        </>
    )
}

export default Reservations