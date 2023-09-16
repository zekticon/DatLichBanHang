import React from 'react';
import './DetailDoctor.scss';
import { useEffect, useState } from 'react';
import moment from 'moment/moment';
import localization from 'moment/locale/vi';
import './DoctorExtraInfo.scss';
import { result } from 'lodash';
import { useParams } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import { getExtraInfoDoctorById } from '~/services';

function DoctorExtraInfo({ match, language }) {
    let [isShowDetailInfo, setSsShowDetailInfo] = useState(false);

    let [extraInfo, setExtraInfo] = useState([]);

    const { id } = useParams();
    useEffect(() => {
        const fetchApi = async () => {
            let res = await getExtraInfoDoctorById(id);

            if (res && res.errCode === 0) {
                setExtraInfo(res.data);
            }
        };
        fetchApi();
    }, []);

    const showHideDetailInfo = (status) => {
        setSsShowDetailInfo(status);
    };
    return (
        <>
            <div className="doctor-extra-info-container">
                <div className="content-up">
                    <div className="text-address">Địa chỉ khám</div>
                    <div className="name-clinic">{extraInfo && extraInfo.nameClinic ? extraInfo.nameClinic : ''}</div>
                    <div className="detail-address">
                        {extraInfo && extraInfo.addressClinic ? extraInfo.addressClinic : ''}
                    </div>
                </div>
                <div className="content-down">
                    {isShowDetailInfo === false ? (
                        <div className="short-info">
                            Giá khám
                            {extraInfo && extraInfo.priceTypeData && (
                                <NumericFormat
                                    className="currency"
                                    type="text"
                                    value={extraInfo.priceTypeData.valueVi}
                                    displayType="text"
                                    thousandSeparator={true}
                                    suffix={'VNĐ'}
                                />
                            )}
                            <span className="detail" onClick={() => showHideDetailInfo(true)}>
                                Xem chi tiết
                            </span>
                        </div>
                    ) : (
                        <>
                            <div className="title-price">Giá khám</div>
                            <div className="detail-info">
                                <div className="price">
                                    <span className="left">Giá khám</span>
                                    <span className="right">
                                        {extraInfo && extraInfo.priceTypeData && (
                                            <NumericFormat
                                                className="currency"
                                                type="text"
                                                value={extraInfo.priceTypeData.valueVi}
                                                displayType="text"
                                                thousandSeparator={true}
                                                suffix={'VNĐ'}
                                            />
                                        )}
                                    </span>
                                </div>
                                <div className="note">{extraInfo && extraInfo.note ? extraInfo.note : ''}</div>
                            </div>
                            <div className="payment">
                                Người bệnh có thể thanh toán chi phí bằng hình thức:
                                {extraInfo && extraInfo.paymentTypeData ? extraInfo.paymentTypeData.valueVi : ''}
                            </div>
                            <div className="hide-price">
                                <span onClick={() => showHideDetailInfo(false)}>Ẩn bảng giá</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default DoctorExtraInfo;
