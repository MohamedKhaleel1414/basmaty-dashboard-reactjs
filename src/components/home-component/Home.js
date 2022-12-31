import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../config/axios'
import '../../searchbox.css'
import ReactPaginate from 'react-paginate';
import '../../pagination.css'
import swal from "sweetalert";
import FormData from 'form-data'
import { useForm } from "react-hook-form"; 

function Home() {
    return (
        <>
            <article className="container rounded-5 mt-5">
                <div className="sectionone d-flex flex-md-row flex-column justify-content-between gap-5 mb-5 mt-5" style={{ height: 'fit-content' }}>
                    <div className="chartone mt-5 rounded-4 py-4" style={{ width: '80%' }}>
                        {/* background-color: #F7D9E3; */}
                        <div className="fs-5 px-4 " style={{ fontWeight: 600, color: '#C13F55' }}>Earnings</div>
                        <div className="my-4">
                            <canvas id="earningChart" style={{ width: '100%' }} />
                        </div>
                        <div className="fs-4 px-4" style={{ direction: 'rtl', fontWeight: 700, color: '#C13F55' }}>1600 $</div>
                    </div>
                    <div className="charttwo mt-5 rounded-4 pe-3 py-4" style={{ width: '80%' }}>
                        {/* background-color: #D6F3F6; */}
                        <div className="fs-5 px-4 " style={{ fontWeight: 600, color: '#C13F55' }}>Reservations</div>
                        <div className="my-4">
                            <canvas id="orderChart" style={{ width: '100%' }} />
                        </div>
                        <div className="fs-4 px-4" style={{ direction: 'rtl', fontWeight: 700, color: '#C13F55' }}>49</div>
                    </div>
                    <div className="chartthree mt-5 rounded-4 pe-3 py-4" style={{ width: '80%' }}>
                        {/* background-color: #c9f8c7; */}
                        <div className="fs-5 px-4 " style={{ fontWeight: 600, color: '#C13F55' }}>Completed Orders</div>
                        <div className="my-4">
                            <canvas id="completedChart" style={{ width: '100%' }} />
                        </div>
                        <div className="fs-4 px-4" style={{ direction: 'rtl', fontWeight: 700, color: '#C13F55' }}>47</div>
                    </div>
                </div>
                <div className="sectiontwo bg-white rounded-4 p-4">
                    <div className="mb-4 fw-bold fs-5">Latest Updates</div>
                    <div className="d-flex justify-content-start gap-2 gap-md-4 py-2 fs-5">
                        <div className="d-flex justify-content-center gap-2 pe-2 align-items-center">
                            <div className="text-center">13:37</div>
                            <i className="bx bx-circle fw-bolder align-self-center text-center" style={{ color: '#C13F55', width: '5%' }} />
                        </div>
                        <div>Shop 1 has finished hair service</div>
                    </div>
                    <div className="d-flex justify-content-start gap-2 gap-md-4 py-2 text-secondary">
                        <div className="d-flex justify-content-center gap-4 pe-2 align-items-center">
                            <div className="text-center" style={{ fontSize: 'small' }}>13:14</div>
                            <i className="bx bx-circle align-self-center text-center" style={{ width: '5%' }} />
                        </div>
                        <div style={{ fontSize: 'small' }}>There is a reservation for hair service at shop 2</div>
                    </div>
                    <div className="d-flex justify-content-start gap-2 gap-md-4 py-2 text-secondary">
                        <div className="d-flex justify-content-center gap-4 pe-2 align-items-center">
                            <div className="text-center" style={{ fontSize: 'small' }}>12:25</div>
                            <i className="bx bx-circle align-self-center text-center" style={{ width: '5%' }} />
                        </div>
                        <div style={{ fontSize: 'small' }}>Shop 2 has finished hair service</div>
                    </div>
                    <div className="d-flex justify-content-start gap-2 gap-md-4 py-2 text-secondary">
                        <div className="d-flex justify-content-center gap-4 pe-2 align-items-center">
                            <div className="text-center" style={{ fontSize: 'small' }}>12:04</div>
                            <i className="bx bx-circle align-self-center text-center" style={{ width: '5%' }} />
                        </div>
                        <div style={{ fontSize: 'small' }}>There is a reservation for nails service at shop 1</div>
                    </div>
                    <div className="d-flex justify-content-start gap-2 gap-md-4 py-2 text-secondary">
                        <div className="d-flex justify-content-center gap-4 pe-2 align-items-center">
                            <div className="text-center" style={{ fontSize: 'small' }}>10:37</div>
                            <i className="bx bx-circle align-self-center text-center" style={{ width: '5%' }} />
                        </div>
                        <div style={{ fontSize: 'small' }}>Shop has finished nails service</div>
                    </div>
                    <div className="d-flex justify-content-start gap-2 gap-md-4 py-2 text-secondary">
                        <div className="d-flex justify-content-center gap-4 pe-2 align-items-center">
                            <div className="text-center" style={{ fontSize: 'small' }}>10:14</div>
                            <i className="bx bx-circle align-self-center text-center" style={{ width: '5%' }} />
                        </div>
                        <div style={{ fontSize: 'small' }}>Shop 1 has finished hair service</div>
                    </div>
                </div>
            </article>
        </>
    )
}

export default Home