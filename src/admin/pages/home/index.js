import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import SideBar from '~/admin/components/sidebar/SideBar';
import NavBar from '~/admin/components/navbar/Navbar';
import Widget from '~/admin/components/widget/Widget';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import jwt_decode from 'jwt-decode';

import { getAllUsersRedux } from '~/redux/apiReques';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import { axiosMiddle } from '~/services/axiosJWT';
import Featured from '~/admin/components/featured/Featured';
import Chart from '~/admin/components/chart/Chart';
import ChartOrder from '~/admin/components/chartOrder/ChartOrder';

const cx = classNames.bind(styles);

function Dashboard() {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    if (!user) {
        navigate(config.routes.loginAdmin);
    }
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `Nhà Cung Cấp Thiết Bị Vật Liệu Phòng Khám Nha Khoa Giá Sỉ, Rẻ Hcm`;

        async function fetchAllUser() {
            let axiosJWT = await axiosMiddle(jwt_decode, user?.accessToken, user, dispatch);
            await getAllUsersRedux(user?.accessToken, dispatch, axiosJWT, navigate);
        }
        fetchAllUser();
        if (!user) {
            navigate(config.routes.loginAdmin);
        } else if (user.user?.roleId !== 'Admin' && user.user.roleId !== 'Doctor') {
            navigate(config.routes.profile);
        }
    }, []);
    return (
        <>
            {user && user.user?.roleId === 'Admin' && (
                <>
                    <div className="flex flex-col">
                        <div className={cx('widgets')}>
                            <Widget type="user" />
                            <Widget type="order" />
                            <Widget type="earning" />
                            <Widget type="balance" />
                        </div>
                        <div className={cx('charts')}>
                            <Featured />
                            <Chart />
                        </div>
                        <div className="flex justify-center items-center">
                            <ChartOrder />
                        </div>
                    </div>
                </>
            )}
            {user && user.user.roleId === 'Doctor' && (
                <>
                    <div className="w-full flex relative items-center justify-center ">
                        <h1 className="font-medium absolute inset-x-0 shadow-xl bg-white w-3/4 md:w-2/5 mx-auto -mt-1 rounded-lg rounded-t-none">
                            {`Xin chào bác sĩ: `}
                            <span className="text-red-400">{`${user.user.lastName} ${user.user.firstName}`}</span>
                            {` ^^`}
                        </h1>
                    </div>
                </>
            )}
        </>
    );
}

export default Dashboard;
