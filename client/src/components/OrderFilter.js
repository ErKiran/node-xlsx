import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import axios from 'axios';

import "react-datepicker/dist/react-datepicker.css";


const Filter = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const onSubmit = async e => {
        e.preventDefault();
        const url = `http://localhost:5000/api/v1/filter?start=${startDate}&end=${endDate}`
        const re = await axios.request({ url, method: "GET", responseType: "blob" })
        const ursl = window.URL.createObjectURL(new Blob([re.data]));
        const link = document.createElement('a');
        link.href = ursl;
        link.setAttribute('download', 'file.xlsx');
        document.body.appendChild(link);
        link.click();
    }
    return (
        <div className="container">
            <p>Generate the summary of order's from selected date range</p>
            <form onSubmit={onSubmit}>
                <div className="row">
                    <div className="col-xs-6">
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                    </div>
                    <span />
                    <div className="col-xs-6">
                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                    </div>

                    <div className="col-xs-4">
                        <input
                            type='submit'
                            value='Generate'
                            className='btn btn-primary btn-block mt-0'
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Filter;