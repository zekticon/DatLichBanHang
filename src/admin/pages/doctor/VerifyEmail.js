import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { postVerifyBookAppointment } from '~/services';
import './VerifyEmail.scss';

function VerifyEmail({}) {
    const location = useLocation();
    let [statusVerify, setStatusVerify] = useState(false);
    let [errCode, setErrCode] = useState(false);

    useEffect(() => {
        async function fetchData() {
            if (location && location.search) {
                const urlParams = new URLSearchParams(location.search);
                const token = urlParams.get('token');
                console.log('check res', token);

                const doctorId = urlParams.get('doctorId');
                let res = await postVerifyBookAppointment({
                    token: token,
                    doctorId: doctorId,
                });

                console.log('check res', res);

                if (res && res.errCode === 0) {
                    setStatusVerify(true);
                    setErrCode(res.errCode);
                } else {
                    setStatusVerify(true);
                    setErrCode(res && res.errCode ? res.errCode : -1);
                }
            }
        }
        fetchData();
    }, []);

    return (
        <>
            <div className="verify-email-container">
                {statusVerify === false ? (
                    <div>Loading data...</div>
                ) : (
                    <div>
                        {errCode === 0 ? (
                            <div className="info-booking">Xác nhận lịch hẹn thành công!</div>
                        ) : (
                            <div className="info-booking">Lịch hẹn không tồn tại hoặc đã được xác nhận!</div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default VerifyEmail;
