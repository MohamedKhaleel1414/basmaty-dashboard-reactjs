import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../config/axios'
import '../../searchbox.css'
import ReactPaginate from 'react-paginate';
import '../../pagination.css'
import { useFormik } from 'formik';
import * as yup from 'yup';
import swal from "sweetalert";

function Admin() {

  const [admins, setAdmins] = useState([])
  const [selected, setSelected] = useState([])
  const [flag, setFlag] = useState(false)

  // Get Admins from Database
  useEffect(() => {
    axiosInstance.get('/api/v1/dashboard/admins').then((res) => {
      console.log(res.data.data)
      setAdmins(res.data.data)
      setSelected(res.data.data)
    })
  }, [])

  // Rerendering after any operation
  useEffect(() => {
    axiosInstance.get('/api/v1/dashboard/admins').then((res) => {
      console.log(res.data.data)
      setAdmins(res.data.data)
      setSelected(res.data.data)
    })
  }, [flag])

  // Search bar functions
  const [searchAdmin, setSearchAdmin] = useState([]);
  const [searchedAdmins, setSearchedAdmins] = useState([])
  const handleChange = (e) => {
    const searchWord = e.target.value;
    const dataFiltered = admins.filter((val) => {
      return val.email.toLowerCase().includes(searchWord)
    });
    setSearchedAdmins(dataFiltered)
    if (searchWord === "")
      setSearchAdmin([]);
    else
      setSearchAdmin(dataFiltered);
  };

  function showAdmins() {
    if (searchedAdmins.length !== 0) setSelected(searchedAdmins)
  }

  function showAdmin(it) {
    const clickedAdmin = admins.filter((adm, idx) => {
      return adm.email === it
    })
    setSelected(clickedAdmin)
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

  // Add Admin Data
  const addAdminFormik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
    validationSchema: yup.object().shape({
      first_name: yup.string().required("must enter your first name"),
      last_name: yup.string().required("must enter your last name"),
      email: yup.string().required("must enter your email.").email("must enter valid email."),
      password: yup.string().required("must enter your Password.").min(8, "must enter al least 6 character."),
      password_confirmation: yup.string().required("must enter your Confirm Password.").oneOf([yup.ref('password')], "Password & Confirm Password does not match."),
    }),
    onSubmit: (values) => {
      console.log(values)
      axiosInstance.post('/api/v1/dashboard/admins', values).then((res) => {
        console.log(res.data)
        swal("New admin added successfully")
        if (flag === false)
          setFlag(true)
        if (flag === true)
          setFlag(false)
      })
    }
  })

  const [adminID, setAdminID] = useState({})
  function storeID(iD) {
    setAdminID(iD)
  }

  // Update Admin Data
  const updateAdminFormik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: ''
    },
    validationSchema: yup.object().shape({
      first_name: yup.string().required("must enter your first name"),
      last_name: yup.string().required("must enter your last name"),
      email: yup.string().required("must enter your email.").email("must enter valid email."),
      password: yup.string().required("must enter your Password.").min(8, "must enter al least 8 character."),
      password_confirmation: yup.string().required("must enter your Confirm Password.").oneOf([yup.ref('password')], "Password & Confirm Password does not match."),
    }),
    onSubmit: values => {
      console.log(values)
      axiosInstance.patch(`/api/v1/dashboard/admins/${adminID.id}`, values).then((res) => {
        console.log(res.data)
        swal("Admin updated successfully")
        if (flag === false)
          setFlag(true)
        if (flag === true)
          setFlag(false)
      })
    }
  })

  // Delete Admin
  function deleteAdmin() {
    axiosInstance.delete(`/api/v1/dashboard/admins/${adminID.id}`).then((res) => {
      console.log(res.data)
      swal("Admin deleted successfully")
      if (flag === false)
        setFlag(true)
      if (flag === true)
        setFlag(false)
    })
  }

  // Export Admin
  function exportAdmin() {
    axiosInstance.get('/api/v1/dashboard/admins/export').then((res) => {
      console.log(res.data)
      swal("File exported successfully")
    })
  }

  return (
    <>
      <article className="container" style={{ marginTop: '8rem' }}>
        <div>
          <div className="d-flex justify-content-between mb-4">
            <h3>Admin Data</h3>
            <div className='d-flex gap-3'>
              <button type='button' className='btn btn-success'><i className='bx bx-import'></i> Import Excell File</button>
              <button type='button' className='btn btn-info text-light' onClick={exportAdmin}><i className='bx bx-export'></i> Export Excell File</button>
            </div>
            <div className='d-flex flex-column'>
              <div className="d-flex">
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={handleChange} />
                <button className="searchbtn rounded-3 px-3" onClick={showAdmins}>Search</button>
              </div>
              {searchAdmin.length !== 0 && (<div className='dataResult shadow my-2 rounded-2'>
                {searchAdmin.slice(0, 4).map((itm, idx) => {
                  return <div key={idx}>
                    <p className='dataItem m-3' onClick={() => showAdmin(itm.email)}>{itm.email}</p>
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
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">E-mail</th>
                <th scope="col">More Details</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((admin, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{index+1+itemOffset}</th>
                    <td>{admin.first_name}</td>
                    <td>{admin.last_name}</td>
                    <td>{admin.email}</td>
                    <td>
                      <button className="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#collapseWidthExample" onClick={() => storeID(admin)} aria-expanded="false" aria-controls="collapseWidthExample"><i className="bx bx-detail"></i></button>
                    </td>
                    <td>
                      <button className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#adminModelUpdate" onClick={() => storeID(admin)}><i className="bx bx-edit-alt" /></button>
                      {/* Update Admin */}
                      <div className="modal fade text-start" id="adminModelUpdate" tabIndex={-1} aria-labelledby="adminModelUpdateLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content">
                            <div className="modal-header" style={{ backgroundColor: '#F7C9D3', borderBottom: 'solid 2px lightgray' }}>
                              <h1 className="modal-title fs-5" id="adminModelUpdateLabel">Update Admin</h1>
                              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body p-0">
                              <form className="pt-4" onSubmit={updateAdminFormik.handleSubmit}>
                                <div className="mb-3 px-4">
                                  <label htmlFor="exampleInputFnameu" className="form-label">First Name</label>
                                  <input type="text" className="form-control" onChange={updateAdminFormik.handleChange} onBlur={updateAdminFormik.handleBlur} value={updateAdminFormik.values.first_name} id="exampleInputFnameu" aria-describedby="emailHelp" name='first_name' />
                                  {updateAdminFormik.touched.first_name && <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{updateAdminFormik.errors.first_name}</div>}
                                </div>
                                <div className="mb-3 px-4">
                                  <label htmlFor="exampleInputLnameu" className="form-label">Last Name</label>
                                  <input type="text" className="form-control" onChange={updateAdminFormik.handleChange} onBlur={updateAdminFormik.handleBlur} value={updateAdminFormik.values.last_name} id="exampleInputLnameu" aria-describedby="emailHelp" name='last_name' />
                                  {updateAdminFormik.touched.last_name && <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{updateAdminFormik.errors.last_name}</div>}
                                </div>
                                <div className="mb-3 px-4">
                                  <label htmlFor="exampleInputEmail10" className="form-label">Email address</label>
                                  <input type="email" className="form-control" onChange={updateAdminFormik.handleChange} onBlur={updateAdminFormik.handleBlur} value={updateAdminFormik.values.email} id="exampleInputEmail10" aria-describedby="emailHelp" name='email' />
                                  {updateAdminFormik.touched.email && <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{updateAdminFormik.errors.email}</div>}
                                </div>
                                <div className="mb-3 px-4">
                                  <label htmlFor="exampleInputPassword10" className="form-label">Password</label>
                                  <input type="password" className="form-control" onChange={updateAdminFormik.handleChange} onBlur={updateAdminFormik.handleBlur} value={updateAdminFormik.values.password} id="exampleInputPassword10" name='password' />
                                  <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{updateAdminFormik.errors.password}</div>
                                </div>
                                <div className="mb-4 px-4">
                                  <label htmlFor="exampleInputPassword20" className="form-label">Confirm Password</label>
                                  <input type="password" className="form-control" onChange={updateAdminFormik.handleChange} onBlur={updateAdminFormik.handleBlur} value={updateAdminFormik.values.password_confirmation} id="exampleInputPassword20" name='password_confirmation' />
                                  <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{updateAdminFormik.errors.password_confirmation}</div>
                                </div>
                                <div className="modal-footer" style={{ backgroundColor: '#F7C9D3', borderTop: 'solid 2px lightgray' }}>
                                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                  <button type="submit" className="btn text-light" style={{ backgroundColor: '#C13F55' }} disabled={!updateAdminFormik.isValid && updateAdminFormik.touched} data-bs-dismiss="modal" aria-label="Close">Submit</button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#adminModelDelete" onClick={() => storeID(admin)}><i className="bx bx-x" /></button>
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
                              <button type="button" className="btn btn text-light" style={{ backgroundColor: '#C13F55' }} data-bs-dismiss="modal" onClick={deleteAdmin}>Save changes</button>
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
          <div className="d-flex justify-content-between mb-5 align-items-center">
            {/* Add Admin */}
            <button type="button" className="searchbtn rounded-3 px-3 py-2" data-bs-toggle="modal" data-bs-target="#adminModel">
              Add Admin
            </button>
            <div className="modal fade" id="adminModel" tabIndex={-1} aria-labelledby="adminModelLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header" style={{ backgroundColor: '#F7C9D3', borderBottom: 'solid 2px lightgray' }}>
                    <h1 className="modal-title fs-5" id="adminModelLabel">Add Admin</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                  </div>
                  <div className="modal-body p-0">
                    <form className="pt-4" onSubmit={addAdminFormik.handleSubmit}>
                      <div className="mb-3 px-4">
                        <label htmlFor="exampleInputFname" className="form-label">First Name</label>
                        <input type="text" className="form-control" onChange={addAdminFormik.handleChange} onBlur={addAdminFormik.handleBlur} value={addAdminFormik.values.first_name} id="exampleInputFname" aria-describedby="emailHelp" name='first_name' />
                        {addAdminFormik.touched.first_name && <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{addAdminFormik.errors.first_name}</div>}
                      </div>
                      <div className="mb-3 px-4">
                        <label htmlFor="exampleInputLname" className="form-label">Last Name</label>
                        <input type="text" className="form-control" onChange={addAdminFormik.handleChange} onBlur={addAdminFormik.handleBlur} value={addAdminFormik.values.last_name} id="exampleInputLname" aria-describedby="emailHelp" name='last_name' />
                        {addAdminFormik.touched.last_name && <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{addAdminFormik.errors.last_name}</div>}
                      </div>
                      <div className="mb-3 px-4">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" onChange={addAdminFormik.handleChange} onBlur={addAdminFormik.handleBlur} value={addAdminFormik.values.email} id="exampleInputEmail1" aria-describedby="emailHelp" name='email' />
                        {addAdminFormik.touched.email && <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{addAdminFormik.errors.email}</div>}
                      </div>
                      <div className="mb-3 px-4">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className="form-control" onChange={addAdminFormik.handleChange} onBlur={addAdminFormik.handleBlur} value={addAdminFormik.values.password} id="exampleInputPassword1" name='password' />
                        <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{addAdminFormik.errors.password}</div>
                      </div>
                      <div className="mb-4 px-4">
                        <label htmlFor="exampleInputPassword2" className="form-label">Confirm Password</label>
                        <input type="password" className="form-control" onChange={addAdminFormik.handleChange} onBlur={addAdminFormik.handleBlur} value={addAdminFormik.values.password_confirmation} id="exampleInputPassword2" name='password_confirmation' />
                        <div className='bg-danger text-danger ps-2 mt-2 rounded-2 bg-opacity-10'  >{addAdminFormik.errors.password_confirmation}</div>
                      </div>
                      <div className="modal-footer" style={{ backgroundColor: '#F7C9D3', borderTop: 'solid 2px lightgray' }}>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" className="btn text-light" style={{ backgroundColor: '#C13F55' }} disabled={!addAdminFormik.isValid && addAdminFormik.touched} data-bs-dismiss="modal" aria-label="Close">Submit</button>
                      </div>
                    </form>
                    {/* <form className="pt-4" onSubmit={addAdminFormik.handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="user_name" className="form-label">Email address</label>
                        <input type="text" className="form-control" name="email" id="user_name" onBlur={addAdminFormik.handleBlur} onChange={addAdminFormik.handleChange} value={addAdminFormik.values.email} aria-describedby="emailHelp" placeholder="Enter user name or email" />
                        <div className="bg-danger bg-opacity-10 ps-2 mt-2" style={{ color: 'red' }}>{addAdminFormik.errors.email}</div>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="Password_sign_in" className="form-label">Password</label>
                        <input type="password" className="form-control" name="password" onBlur={addAdminFormik.handleBlur} onChange={addAdminFormik.handleChange} value={addAdminFormik.values.password} id="Password_sign_in" placeholder="Password" />
                        <div className="bg-danger bg-opacity-10 ps-2 mt-2" style={{ color: 'red' }}>{addAdminFormik.errors.password}</div>
                      </div>
                      <button data-bs-dismiss="modal" aria-label="Close" type="submit" className="btn btn-primary form-control">Sign In</button>
                      <div id="emailHelp" className="form-text">Don't have an account? <a className="text-primary" data-bs-toggle="modal" data-bs-target="#sign_up" style={{ cursor: 'pointer' }}>Sign
                        Up</a></div>
                    </form> */}
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
              <img src={adminID.image} alt={adminID.id} className='w-100' />
            </div>
            <div className='ps-5'>
              <h5>Full Name</h5>
              <p>{adminID.name}</p>
              <h5>ID</h5>
              <p>{adminID.id}</p>
              <h5>E-mail</h5>
              <p>{adminID.email}</p>
              <h5>Join Date</h5>
              <p>{adminID.email_verified_at}</p>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}

export default Admin