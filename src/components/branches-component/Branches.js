import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../config/axios'

function Branches() {

    const [branches,setBranches] = useState([])

    useEffect(()=>{
        axiosInstance.get('/api/v1/dashboard/shopbranche').then((res)=>{
          console.log(res.data.data)
        })
    },[])

  return (
    <div>Branches</div>
  )
}

export default Branches