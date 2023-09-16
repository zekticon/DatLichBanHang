import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getDetailInfoDoctor } from '~/services';
import DoctorExtraInfo from '../DoctorExtraInfo';
import DoctorSchedule from '../DoctorSchedule';
import './DetailDoctor.scss';

function DoctorDetail() {
    const { id } = useParams();

    const user = useSelector((state) => state.auth.login?.currentUser);

    const [detailDoctor, setDetailDoctor] = useState({});

    useEffect(() => {
        const fetchApi = async () => {
            if (id) {
                let idDoctor = id;
                let res = await getDetailInfoDoctor(idDoctor);
                if (res && res.errCode === 0) {
                    setDetailDoctor(res.data);
                }

                return;
            }
        };

        fetchApi();
    }, []);
    let nameVi = '',
        nameEn = '';
    if (detailDoctor) {
        nameVi = `${detailDoctor.lastName} ${detailDoctor.firstName}`;
    }
    return (
        <>
            <div>
                {/* <div className="w-full flex flex-col relative ">
                    <h1 className="font-medium absolute inset-x-0 shadow-xl bg-white w-fit md:w-fit mx-auto mt-1 rounded-lg rounded-t-none">
                        {`Xin chào bác sĩ: `}
                        <span className="text-red-400">{`${user.user.lastName} ${user.user.firstName}`}</span>
                        {` ^^! Hãy điền thông tin của bạn.`}
                    </h1>
                </div> */}
                <div className="doctor-detail-container ">
                    <div className="intro-doctor">
                        <div className="content-left">
                            <img src={detailDoctor.Image?.photo} alt="" />
                        </div>
                        <div className="content-right">
                            <div className="up">{nameVi}</div>
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
            </div>
        </>
    );
}

export default DoctorDetail;
