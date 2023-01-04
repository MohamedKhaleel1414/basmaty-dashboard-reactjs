import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../config/axios'
import { Bar } from 'react-chartjs-2'

function Home() {

    const [allres, setAllres] = useState([])
    const [reservations, setReservations] = useState([])
    const [first, setFirst] = useState({})
    const [restNotif, setRestNotif] = useState([])

    // Charts Data
    const [chartDatatoday, setChartDatatoday] = useState([])
    const [chartDatayesterday, setChartDatayesterday] = useState([])
    const [chartDatabeforeyesterday, setChartDatabeforeyesterday] = useState([])
    // Get today date
    let today = new Date()
    let todayx = today.toISOString()
    let todayy = todayx.slice(0,10)
    let todayz = todayy.replace(/-/g,"/")
    // Get yesterday date
    let yesterday = new Date(new Date().setDate(new Date().getDate()-1));
    let ysterdayx = yesterday.toISOString()
    let yesterdayy = ysterdayx.slice(0,10)
    let yesterdayz = yesterdayy.replace(/-/g,"/")
    // Get two days ago date
    let beforeyesterday = new Date(new Date().setDate(new Date().getDate()-2));
    let beforeyesterdayx = beforeyesterday.toISOString()
    let beforeyesterdayy = beforeyesterdayx.slice(0,10)
    let beforeyesterdayz = beforeyesterdayy.replace(/-/g,"/")


    // Get Reservations and Notifications from Database
    useEffect(() => {
        axiosInstance.get('/api/v1/dashboard/reservations').then((res) => {
            console.log(res.data.data)
            setAllres(res.data.data)
            setReservations(res.data.data.slice(0, 5))
            let todayres = res.data.data.filter((itm,idx)=> itm.reserved_at.includes(todayz))
            setChartDatatoday(todayres)
            let yesterdayres = res.data.data.filter((itm,idx)=> itm.reserved_at.includes(yesterdayz))
            setChartDatayesterday(yesterdayres)
            let beforeyesterdayres = res.data.data.filter((itm,idx)=> itm.reserved_at.includes(beforeyesterdayz))
            setChartDatabeforeyesterday(beforeyesterdayres)
        })
        axiosInstance.get('/api/v1/dashboard/notifications').then((res) => {
            res.data.data.reverse()
            console.log(res.data.data)
            setFirst(res.data.data[0])
            res.data.data.shift()
            console.log(res.data.data)
            setRestNotif(res.data.data)
        })
    }, [])

    return (
        <>
            <article className="container rounded-5 mt-5">
                {/* <div className="sectionone d-flex flex-md-row flex-column justify-content-between gap-5 mb-5 mt-5" style={{ height: 'fit-content' }}>
                    <div className="chartone mt-5 rounded-4 py-4" style={{ width: '80%' }}>
                        <div className="fs-5 px-4 " style={{ fontWeight: 600, color: '#C13F55' }}>Earnings</div>
                        <div className="my-4">
                            <canvas id="earningChart" style={{ width: '100%' }} />
                        </div>
                        <div className="fs-4 px-4" style={{ direction: 'rtl', fontWeight: 700, color: '#C13F55' }}>1600 $</div>
                    </div>
                    <div className="charttwo mt-5 rounded-4 pe-3 py-4" style={{ width: '80%' }}>
                        background-color: #D6F3F6;
                        <div className="fs-5 px-4 " style={{ fontWeight: 600, color: '#C13F55' }}>Reservations</div>
                        <div className="my-4">
                            <canvas id="orderChart" style={{ width: '100%' }} />
                        </div>
                        <div className="fs-4 px-4" style={{ direction: 'rtl', fontWeight: 700, color: '#C13F55' }}>49</div>
                    </div>
                    <div className="chartthree mt-5 rounded-4 pe-3 py-4" style={{ width: '80%' }}>
                        background-color: #c9f8c7;
                        <div className="fs-5 px-4 " style={{ fontWeight: 600, color: '#C13F55' }}>Completed Orders</div>
                        <div className="my-4">
                            <canvas id="completedChart" style={{ width: '100%' }} />
                        </div>
                        <div className="fs-4 px-4" style={{ direction: 'rtl', fontWeight: 700, color: '#C13F55' }}>47</div>
                    </div>
                </div> */}

                <div className='d-flex justify-content-between mt-5 pt-5'>
                    <div className='w-100'>
                        <div className="sectiontwo container bg-white rounded-4 p-4">
                            <div className="mb-4 fw-bold fs-5 mt-5">Latest Updates</div>
                            <div className='col'>
                                <div className="row  d-flex justify-content-between gap-2 gap-md-4 py-2 fs-5">
                                    <div className='d-flex justify-content-start gap-4'>
                                        <div className="d-flex justify-content-center gap-4 pe-2 align-items-center">
                                            <div className="text-center">{first.date}</div>
                                            <i className="bx bx-circle fw-bolder align-self-center text-center" style={{ color: '#C13F55', width: '5%' }} />
                                        </div>
                                        <div>{first.description}</div>
                                    </div>
                                </div>
                            </div>

                            {restNotif.map((not, idx) => {
                                return (
                                    <div key={idx} className="d-flex justify-content-between gap-2 gap-md-4 py-2 fs-5">
                                        <div className="d-flex justify-content-start gap-2 gap-md-4 py-2 text-secondary">
                                            <div className="d-flex justify-content-center gap-5 px-2 align-items-center">
                                                <div className="text-center" style={{ fontSize: 'small' }}>{not.date}</div>
                                                <i className="bx bx-circle align-self-center text-center" style={{ width: '5%' }} />
                                            </div>
                                            <div style={{ fontSize: 'small' }}>{not.description}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='w-75 p-5'>
                        <div className="chartone rounded-4 pe-3 py-4">
                            {/* background-color: #F7D9E3; */}
                            <div className="fs-5 px-4 " style={{ fontWeight: 600, color: '#C13F55' }}>Reservations</div>
                            <div className="my-4">
                                {/* <canvas id="earningChart" style={{ width: '100%' }} /> */}
                                {/* <Bar data={} options={} /> */}
                            </div>
                            <div className="fs-4 px-4" style={{ direction: 'rtl', fontWeight: 700, color: '#C13F55' }}>50</div>
                        </div>
                    </div>
                </div>
                <div className='mb-5 pb-4'>
                    <h3 className='mb-4'>Reservations Data</h3>
                    <table className="table table-striped text-center">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Shop</th>
                                <th scope="col">Reserved at</th>
                                <th scope="col">Status</th>
                                <th scope="col">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((admin, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">{admin.id}</th>
                                        <td>{admin.shop.name}</td>
                                        <td>{admin.reserved_at}</td>
                                        <td>{admin.reservation_status}</td>
                                        <td>{admin.price}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </article>
        </>
    )
}

export default Home