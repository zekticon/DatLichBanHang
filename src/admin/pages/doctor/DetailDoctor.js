import React from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailDoctor.scss';
import { getDetailInfoDoctor } from '../../../services/userService';
import { useState } from 'react';
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfo from './DoctorExtraInfo';
import { useParams } from 'react-router-dom';

function DetailDoctor({ match, language }) {
    const { id } = useParams();

    const [detailDoctor, setDetailDoctor] = useState({});

    useEffect(() => {
        const fetchApi = async () => {
            if (id) {
                let id = match.params.id;
                let res = await getDetailInfoDoctor(id);
                if (res && res.errCode === 0) {
                    setDetailDoctor(res.data);
                }
            }
        };
        fetchApi();
    }, []);
    let nameVi = '',
        nameEn = '';
    if (detailDoctor && detailDoctor.positionData) {
        nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
        nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
    }
    return (
        <>
            <HomeHeader isShowBanner={false} />
            <div className="doctor-detail-container ">
                <div className="intro-doctor">
                    <div className="content-left">
                        <img src={detailDoctor.image} alt="" />
                    </div>
                    <div className="content-right">
                        <div className="up">{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                        <div className="down">
                            {detailDoctor.Markdown && detailDoctor.Markdown.description && (
                                <span>{detailDoctor.Markdown.description}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="schedule-doctor">
                    <div className="content-left">
                        <DoctorSchedule />
                    </div>
                    <div className="content-right">
                        <DoctorExtraInfo />
                    </div>
                </div>
                <div className="detail-info-doctor">
                    {detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.contentHTML && (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: detailDoctor.Markdown.contentHTML,
                            }}
                        ></div>
                    )}
                </div>
                <div className="comment-doctor"></div>
            </div>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
