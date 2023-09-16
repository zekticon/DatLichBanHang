import React, { Component } from 'react';
import Select from 'react-select';

import './ManageSchedule.scss';
import { useEffect, useState } from 'react';
import moment from 'moment';

import { toast } from 'react-toastify';
import _ from 'lodash';
import { getAllCodeService, getAllDoctors, saveBulkScheduleDoctor } from '~/services';
import { DatePicker } from '~/Component/Input';
import { useSelector } from 'react-redux';

function ManageSchedule({}) {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const [selectedDoctor, setSelectedDoctor] = useState({});
    const [currentDate, setCurrentDate] = useState(new Date());
    const [listDoctors, setListDoctors] = useState([]);
    let [allDoctors, setAllDoctors] = useState();
    let [rangeTime, setRangeTime] = useState([]);
    let [allScheduleTime, setAllScheduleTime] = useState();

    useEffect(() => {
        const fetchApi = async () => {
            let res = await getAllDoctors();
            setAllDoctors(res.data);
            let scheduleTime = await getAllCodeService('TIME');
            if (scheduleTime && scheduleTime.errCode === 0) {
                setAllScheduleTime(scheduleTime.data);
            }
        };

        fetchApi();
    }, []);

    useEffect(() => {
        let data = allScheduleTime;

        if (data && data.length > 0) {
            data = data.map((item) => ({ ...item, isSelected: false }));
        }
        setRangeTime(data);
    }, [allScheduleTime]);

    const buildDataInputSelect = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                object.label = labelVi;
                object.value = item.id;
                result.push(object);
            });
        }
        return result;
    };
    const handleChange = async (selectedDoctor) => {
        setSelectedDoctor(selectedDoctor);
    };
    const handleOnChangeDatePicker = (date) => {
        setCurrentDate(date[0]);
    };

    const handleClickBtnTime = (time) => {
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map((item) => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            });

            setRangeTime(rangeTime);
        }
    };
    const handleSaveSchedule = async () => {
        let result = [];

        if (!currentDate) {
            toast.error('Please select a date');
            return;
        }

        let formatedDate = new Date(currentDate).getTime();

        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter((item) => item.isSelected === true);
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map((schedule) => {
                    let object = {};
                    object.doctorId = user.user.id;
                    object.date = formatedDate;
                    object.timeType = schedule.key;
                    result.push(object);
                });
            } else {
                toast.error('Invalid schedule time');
                return;
            }
        }

        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: user.user.id,
            date: formatedDate,
        });

        if (res && res.errCode === 0) {
            toast.success('Save completed successfully');
        } else {
            toast.error('error save schedule');
        }
    };

    let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    return (
        <>
            <div className="manage-schedule-container">
                <div className="m-s-title">Quản lý kế hoạch khám bệnh của bác sĩ</div>
                <div className="container">
                    <div className="row">
                        <div className="col-6 form-group">
                            <label>Bác sĩ: </label>
                            <span>{`${user.user.lastName} ${user.user.firstName}`}</span>
                        </div>
                        <div className="col-4 form-group">
                            <label>Chọn ngày</label>
                            <DatePicker
                                className="date"
                                onChange={handleOnChangeDatePicker}
                                value={currentDate}
                                minDate={yesterday}
                            />
                        </div>
                        <div className="col-12 pick-hour-container">
                            {rangeTime &&
                                rangeTime.length > 0 &&
                                rangeTime.map((item, index) => {
                                    return (
                                        <button
                                            className={
                                                item.isSelected === true
                                                    ? 'btn btn-schedule active'
                                                    : 'btn btn-schedule'
                                            }
                                            key={index}
                                            onClick={() => handleClickBtnTime(item)}
                                        >
                                            {item.valueVi}
                                        </button>
                                    );
                                })}
                        </div>
                        <div className="col-12">
                            <button
                                className="btn - btn-primary btn-save-schedule"
                                onClick={() => handleSaveSchedule()}
                            >
                                Lưu thông tin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// const mapStateToProps = (state) => {
//     return {
//         allScheduleTime: state.admin.allScheduleTime,
//     };
// };

// const mapDispatchToProps = (dispatch) => {
//     return {
//         fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
//     };
// };

export default ManageSchedule;
