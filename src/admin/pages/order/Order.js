import styles from './Order.module.scss';
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { getAllCategoryAdmin } from '~/redux/apiReques';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import jwt_decode from 'jwt-decode';
import { axiosMiddle } from '~/services/axiosJWT';
import DatatableOrder from '~/admin/components/datatable/DatatableOrder';
import TabsOrder from '~/Component/TabsOrder/TabsOrder';

const cx = classNames.bind(styles);
function Order() {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate(config.routes.loginAdmin);
        }
        const fetch = async () => {
            let axiosJWT = await axiosMiddle(jwt_decode, user?.accessToken, user, dispatch);

            await getAllCategoryAdmin(user?.accessToken, dispatch, axiosJWT, navigate);
        };
        fetch();
    }, [user]);
    return (
        <>
            <div className={cx('datatable-title')}>Danh sách đơn hàng</div>
            <TabsOrder />
        </>
    );
}

export default Order;
