import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../config/axios'
import swal from "sweetalert";
import FormData from 'form-data'
import { useForm } from "react-hook-form";
import ReactPaginate from 'react-paginate';

function Notifications() {

  const [cities, setCities] = useState([])
  const [first, setFirst] = useState({})
  const [restNotif, setRestNotif] = useState([])
  const [flag, setFlag] = useState(false)

  // Get notifications from Database
  useEffect(() => {
    axiosInstance.get('/api/v1/dashboard/notifications').then((res) => {
      res.data.data.reverse()
      console.log(res.data.data)
      setFirst(res.data.data[0])
      res.data.data.shift()
      console.log(res.data.data)
      setRestNotif(res.data.data)
    })
    axiosInstance.get('/api/v1/dashboard/cities').then((res) => {
      console.log(res.data.data)
      setCities(res.data.data)
    })
  }, [])

  // Rerendering after any operation
  useEffect(() => {
    axiosInstance.get('/api/v1/dashboard/notifications').then((res) => {
      res.data.data.reverse()
      console.log(res.data.data)
      setFirst(res.data.data[0])
      res.data.data.shift()
      console.log(res.data.data)
      setRestNotif(res.data.data)
    })
    axiosInstance.get('/api/v1/dashboard/cities').then((res) => {
      console.log(res.data.data)
      setCities(res.data.data)
    })
  }, [flag])

  // Pagination functions
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 15;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(restNotif.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(restNotif.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, restNotif]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % restNotif.length;
    setItemOffset(newOffset);
  };

  const [notifID, setNotifID] = useState({})
  function storeID(iD) {
    setNotifID(iD)
  }

  // Add Service Data
  const { register: registeri, handleSubmit: handleSubmiti, formState: { errors: errorsi }, } = useForm({
    defaultValues: {
      title: '',
      description: '',
      city_id: '',
      img: ''
    },
  });

  const onSubmit = (values) => {
    let formD = new FormData()
    formD.append("title", values.title)
    formD.append("description", values.description)
    formD.append("city_id", parseInt(values.city_id))
    formD.append("img", values.img[0])
    console.log(values)
    console.log("add")
    axiosInstance.post('/api/v1/dashboard/notifications', formD).then((res) => {
      console.log(res.data)
      swal("New Notification added successfully")
      if (flag === false)
        setFlag(true)
      if (flag === true)
        setFlag(false)
    })
  };

  // Delete Notification
  function deleteNotif() {
    axiosInstance.delete(`/api/v1/dashboard/notifications/${notifID.id}`).then((res) => {
      console.log(res.data)
      swal("Notification deleted successfully")
      if (flag === false)
        setFlag(true)
      if (flag === true)
        setFlag(false)
    })
  }

  return (
    <>
      <div className="sectiontwo container mt-5 bg-white rounded-4 p-4">
        <div className="mb-4 fw-bold fs-5 mt-5">Latest Updates</div>
        <div className='col'>
          <div className="row d-flex justify-content-between gap-2 gap-md-4 py-2 fs-5">
            <div className='d-flex justify-content-start gap-4 col-8'>
              <div className="d-flex justify-content-center gap-4 pe-2 align-items-center">
                <div className="text-center">{first.date}</div>
                <i className="bx bx-circle fw-bolder align-self-center text-center" style={{ color: '#C13F55', width: '5%' }} />
              </div>
              <div>{first.description}</div>
            </div>
            <div className='d-flex justify-content-end gap-4 col'>
              <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample2" aria-expanded="false" aria-controls="multiCollapseExample2" onClick={() => storeID(first)}><i className="bx bx-detail"></i></button>
              <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#adminModelDelete" onClick={() => storeID(first)}><i className="bx bx-x" /></button>
            </div>
          </div>
        </div>

        {currentItems.map((not, idx) => {
          return (
            <div key={idx} className="d-flex justify-content-between gap-2 gap-md-4 py-2 fs-5">
              <div className="d-flex justify-content-start gap-2 gap-md-4 py-2 text-secondary">
                <div className="d-flex justify-content-center gap-5 px-2 align-items-center">
                  <div className="text-center" style={{ fontSize: 'small' }}>{not.date}</div>
                  <i className="bx bx-circle align-self-center text-center" style={{ width: '5%' }} />
                </div>
                <div style={{ fontSize: 'small' }}>{not.description}</div>
              </div>
              <div className='d-flex justify-content-evenly gap-4'>
                <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample2" aria-expanded="false" aria-controls="multiCollapseExample2" onClick={() => storeID(not)}><i className="bx bx-detail"></i></button>
                <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#adminModelDelete" onClick={() => storeID(not)}><i className="bx bx-x" /></button>
              </div>
            </div>
          )
        })}
        <div className="modal fade text-start" id="adminModelDelete" tabIndex={-1} aria-labelledby="adminModelDeleteLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: '#F7C9D3', borderBottom: 'solid 2px lightgray' }}>
                <h1 className="modal-title fs-5" id="adminModelDeleteLabel">Delete Admin</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body p-0">
                <h6 className='p-4'>Are you sure you want to delete this admin?</h6>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn text-light" style={{ backgroundColor: '#C13F55' }} data-bs-dismiss="modal" onClick={deleteNotif}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between mb-5 mt-4 align-items-center">
          {/* Add Notification */}
          <button type="button" className="searchbtn rounded-3 px-3 py-2" data-bs-toggle="modal" data-bs-target="#adminModel">
            Add Notification
          </button>
          <div className="modal fade" id="adminModel" tabIndex={-1} aria-labelledby="adminModelLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header" style={{ backgroundColor: '#F7C9D3', borderBottom: 'solid 2px lightgray' }}>
                  <h1 className="modal-title fs-5" id="adminModelLabel">Add Notification</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div className="modal-body p-0">
                  <form className="pt-4" onSubmit={handleSubmiti(onSubmit)} encType="multipart/form-data">
                    <div className="mb-3 px-4">
                      <label htmlFor="exampleInputAname" className="form-label">Title</label>
                      <input type="text" className="form-control" id="exampleInputAname" aria-describedby="emailHelp" name='title' {...registeri("title", { required: "must enter title" })} />
                      <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.title?.message}</div>
                    </div>
                    <div className="mb-3 px-4">
                      <label htmlFor="exampleFormControlTextarea11" className="form-label">Description</label>
                      <textarea className="form-control" id="exampleFormControlTextarea11" rows={3} name='description' {...registeri("description", { required: "must enter description" })} />
                      <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.description?.message}</div>
                    </div>
                    <div className='mb-3 px-4'>
                      <label className='mb-2'>Choose City</label>
                      <select className="form-select" aria-label="Default select example2" name='city_id' {...registeri("city_id", { required: "must choose a city" })}>
                        {cities.map((city, idx) => {
                          return (
                            <option key={idx} value={city.id}>{city.city}</option>
                          )
                        })}
                      </select>
                      <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.city_id?.message}</div>
                    </div>
                    <div className="mb-4 px-4">
                      <label htmlFor="formFileSm" className="form-label" >Uploade Photo</label>
                      <input className="form-control form-control-sm" id="formFileSm" type="file" accept="image/*" name='img' {...registeri("img", { required: "must upload photo" })} />
                      <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{errorsi.img?.message}</div>
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
        <div className="collapse multi-collapse row" id="multiCollapseExample2">
          <div className="card card-body d-flex flex-row justify-content-start gap-4">
            <div className='w-25 text-center align-self-center '>
              <img src={notifID.img} alt={notifID.id} className='w-50'/>
            </div>
            <div className='w-25'>
              <h5>Title</h5>
              <p>{notifID.title}</p>
              <h5>City</h5>
              <p>{notifID.city}</p>
            </div>
            <div>
              <h5>Date</h5>
              <p>{notifID.date}</p>
              <h5>Description</h5>
              <p>{notifID.description}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Notifications