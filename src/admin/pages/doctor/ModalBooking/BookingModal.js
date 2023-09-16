import React, { useState } from 'react';
import './BookingModal.scss';
import { useEffect } from 'react';
import Select from 'react-select';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import moment from 'moment';
import _ from 'lodash';
import { DatePicker } from '~/Component/Input';
import { getAllCodeService, postPatientBookAppointment } from '~/services';
import ProfileDoctor from '../ProfileDoctor';
import Modal from 'react-modal';

const customStyles = {
    content: {
        height: '500px',
        width: '900px',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};
let subtitle;

const afterOpenModal = () => {
    subtitle.style.color = '#f00';
};

function BookingModal({ isOpenModal, closeBookingModal, dataScheduleTimeModal }) {
    let [state, setState] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        address: '',
        reason: '',
        birthday: '',
        genderArr: '',
        selectedGender: '',
        doctorId: 0,
        timeType: '',
    });

    const { id } = useParams();

    useEffect(() => {
        const fetchApi = async () => {
            let res = await getAllCodeService('GENDER');
            setState({
                ...state,

                genderArr: buildDataGender(res.data),
            });
        };
        fetchApi();
    }, []);

    useEffect(() => {
        setState({
            ...state,
            doctorId: +id,
            timeType: dataScheduleTimeModal.timeType,
        });
    }, [dataScheduleTimeModal]);

    const buildDataGender = (data) => {
        let result = [];
        if (data && data.length > 0) {
            data.map((item) => {
                let object = {};
                object.label = item.valueVi;
                object.value = item.keyMap;
                result.push(object);
            });
        }
        return result;
    };
    let handleOnChangeInput = (e, id) => {
        let valueInput = e.target.value;
        let copyState = { ...state };

        copyState[id] = valueInput;

        setState(copyState);
    };

    let handleOnChangeDatePicker = (date) => {
        setState({
            ...state,
            birthday: date[0],
        });
    };

    let handleChange = (selectedOption) => {
        setState({
            ...state,
            selectedGender: selectedOption,
        });
    };

    let handleConfirmBooking = async () => {
        let timeString = buildTimeBooking(dataScheduleTimeModal);
        let doctorName = buildDoctorName(dataScheduleTimeModal);
        let res = await postPatientBookAppointment({
            fullName: state.fullName,
            phoneNumber: state.phoneNumber,
            email: state.email,
            address: state.address,
            reason: state.reason,
            date: timeString,
            selectedGender: state.selectedGender.value,
            doctorId: state.doctorId,
            timeType: state.timeType,
            timeString: timeString,
            doctorName: doctorName,
        });
        if (res && res.errCode === 0) {
            toast.success(res.errMessage);
            closeBookingModal();
        } else {
            toast.error(res.errMessage);
        }
    };
    const buildDoctorName = (dataTime) => {
        if (dataTime && !_.isEmpty(dataTime)) {
            let name = `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`;
            return name;
        }
        return '';
    };
    const buildTimeBooking = (dataTime) => {
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = dataTime.timeTypeData.valueVi;

            let data = moment.unix(+dataTime.date / 1000).format('YYYY-MM-DD');
            return `${data}`;
        }
        return '';
    };

    return (
        <>
            <Modal
                isOpen={isOpenModal}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeBookingModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div className="booking-modal-content">
                    <div className="booking-modal-header">
                        <span className="left">Thông tin đật lịch khám bệnh</span>
                        <span className="right" onClick={closeBookingModal}>
                            <i className="fas fa-times"></i>
                        </span>
                    </div>
                    <div className="booking-modal-body">
                        <div className="doctor-info">
                            <ProfileDoctor isShowDescriptionDoctor={false} />
                        </div>
                        <div className="row">
                            <div className="col-6 form-group">
                                <label>Họ và tên</label>
                                <input
                                    className="form-control"
                                    value={state.fullName}
                                    onChange={(e) => handleOnChangeInput(e, 'fullName')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Số điện thoại</label>
                                <input
                                    className="form-control"
                                    value={state.phoneNumber}
                                    onChange={(e) => handleOnChangeInput(e, 'phoneNumber')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Email</label>
                                <input
                                    className="form-control"
                                    value={state.email}
                                    onChange={(e) => handleOnChangeInput(e, 'email')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Địa chỉ liên lạc</label>
                                <input
                                    className="form-control"
                                    value={state.address}
                                    onChange={(e) => handleOnChangeInput(e, 'address')}
                                />
                            </div>
                            <div className="col-12 form-group">
                                <label>Lý do khám</label>
                                <input
                                    className="form-control"
                                    value={state.reason}
                                    onChange={(e) => handleOnChangeInput(e, 'reason')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Ngày sinh</label>
                                <DatePicker
                                    className="form-control"
                                    onChange={handleOnChangeDatePicker}
                                    value={state.birthday}
                                    // minDate={yesterday}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Giới tính</label>
                                <Select
                                    value={state.selectedGender}
                                    onChange={handleChange}
                                    options={state.genderArr}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="booking-modal-footer flex gap-3">
                        <button
                            className="btn-booking-confirm cursor-pointer border rounded-lg py-1 px-2 bg-amber-400 hover:bg-amber-600"
                            onClick={() => handleConfirmBooking()}
                        >
                            Xác nhận
                        </button>
                        <button
                            className="btn-booking-cancel cursor-pointer border rounded-lg py-1 px-2 bg-amber-400 hover:bg-amber-600"
                            onClick={closeBookingModal}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default BookingModal;
