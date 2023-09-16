import React from 'react';
import { useEffect, useState } from 'react';
import moment from 'moment/moment';
import localization from 'moment/locale/vi';
import './DoctorSchedule.scss';
import { result } from 'lodash';
import { createContext } from 'react';
import { useParams } from 'react-router-dom';
import { getScheduleDoctorByDate } from '~/services';
import BookingModal from './ModalBooking/BookingModal';

export const dataScheduleTimeContext = createContext();

function DoctorSchedule() {
    let [allDays, setAllDays] = useState([]);
    let [allValiableTime, setAllValiableTime] = useState([]);
    let [isOpenModalBooking, setIsOpenModalBooking] = useState(false);
    let [dataScheduleTimeModal, setDataScheduleTimeModal] = useState({});

    const { id } = useParams();
    useEffect(() => {
        let allDays = getArrDays();
        const fetchApi = async () => {
            setAllDays(allDays);
            if (allDays && allDays.length > 0) {
                let res = await getScheduleDoctorByDate(id, allDays[0].value);
                setAllValiableTime(res.data ? res.data : []);
            }
        };
        fetchApi();
    }, []);

    useEffect(() => {
        let allDays = getArrDays();
        setAllDays(allDays);
    }, []);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const getArrDays = () => {
        let allDays = [];
        for (let i = 0; i < 7; i++) {
            let object = {};

            if (i === 0) {
                let ddMM = moment(new Date()).format('DD/MM');
                let today = `Hôm nay - ${ddMM}`;
                object.label = today;
            } else {
                let labelVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM');
                object.label = capitalizeFirstLetter(labelVi);
            }

            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            allDays.push(object);
        }
        return allDays;
    };
    const handleOnChangeSelect = async (e) => {
        let date = e.target.value;
        let res = await getScheduleDoctorByDate(id, date);

        if (res && res.errCode === 0) {
            setAllValiableTime(res && res.data ? res.data : []);
        }
    };
    const handleClickScheduleTime = (time) => {
        setIsOpenModalBooking(true);
        setDataScheduleTimeModal(time);
    };
    const closeBookingModal = () => {
        setIsOpenModalBooking(false);
    };
    return (
        <dataScheduleTimeContext.Provider value={dataScheduleTimeModal}>
            <div className="doctor-schedule-container">
                <div className="all-schedule">
                    <select onChange={(e) => handleOnChangeSelect(e)}>
                        {allDays &&
                            allDays.length > 0 &&
                            allDays.map((item, index) => {
                                return (
                                    <option key={index} value={item.value}>
                                        {item.label}
                                    </option>
                                );
                            })}
                    </select>
                </div>
                <div className="all-available-time">
                    <div className="text-calendar">
                        <i className="fas fa-calendar">
                            <span>Lịch khám</span>
                        </i>

                        <div className="time-content">
                            {allValiableTime && allValiableTime.length > 0 ? (
                                <>
                                    <div className="time-content-btns">
                                        {allValiableTime.map((item, index) => {
                                            let timeDisplay = item.timeTypeData.valueVi;
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => handleClickScheduleTime(item)}
                                                    className={'btn-vi'}
                                                >
                                                    {timeDisplay}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="book-free">
                                        <span>
                                            Chọn <i className="far fa-hand-point-up" /> Và đặt (miễn phí)
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="no-schedule">Bác sĩ không có lịch khám ngày hôm nay</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <BookingModal
                isOpenModal={isOpenModalBooking}
                closeBookingModal={() => closeBookingModal()}
                dataScheduleTimeModal={dataScheduleTimeModal}
            />
            {/* <BookingModal
                isOpenModal={isOpenModalBooking}
                closeBookingModal={closeBookingModal}
                dataScheduleTimeModal={}
            /> */}
        </dataScheduleTimeContext.Provider>
    );
}
export default DoctorSchedule;
