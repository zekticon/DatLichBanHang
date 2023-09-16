import React from 'react';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import config from '~/config';
import { getTopDoctorsService } from '~/services';
import './HomePage.scss';
function ListDoctor({ settings, language, loadTopDoctors, topDoctorsRedux, history }) {
    const [arrDoctors, setArrDoctors] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchApi = async () => {
            let res = await getTopDoctorsService('');
            setArrDoctors(res.data);
        };

        fetchApi();
    }, []);

    console.log(arrDoctors);

    const handleViewDetailDoctor = (item) => {
        console.log('view detail: ', item);
        navigate(`/detail-doctor/${item.id}`);
    };

    let allDoctors = arrDoctors;
    return (
        <div className="section-share section-outstanding-doctor">
            <div className="section-container">
                <div className="section-header">
                    <span className="title-section">Bác sĩ nổi bật</span>
                    <button className="btn-section">Xem thêm</button>
                </div>
                <div className="section-body">
                    <Slider {...settings}>
                        {allDoctors &&
                            allDoctors.length > 0 &&
                            allDoctors.map((item, index) => {
                                let nameVi = `${item.lastName} ${item.firstName}`;
                                return (
                                    <div
                                        className="section-customize"
                                        key={index}
                                        onClick={() => handleViewDetailDoctor(item)}
                                    >
                                        <div className="customize-border">
                                            <div className="outer-bg">
                                                <div
                                                    className="bg-image section-outstanding-doctor"
                                                    style={{
                                                        backgroundImage: `url(${item.Image.photo})`,
                                                    }}
                                                />
                                            </div>
                                            <div className="position text-center">
                                                <div>{nameVi}</div>
                                                <div>CƠ Xương Khớp</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </Slider>
                </div>
            </div>
        </div>
    );
}

export default ListDoctor;
