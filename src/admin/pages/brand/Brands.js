import styles from './Brands.module.scss';
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { getAllBrands, getAllUsersRedux } from '~/redux/apiReques';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import jwt_decode from 'jwt-decode';
import DatatableBrands from '~/admin/components/datatable/DatatableBrands';
import { axiosMiddle } from '~/services/axiosJWT';

const cx = classNames.bind(styles);
function Brands() {
    const user = useSelector((state) => state.auth.login?.currentUser);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate(config.routes.loginAdmin);
        }
        const fetch = async () => {
            let axiosJWT = await axiosMiddle(jwt_decode, user?.accessToken, user, dispatch);

            await getAllBrands(user?.accessToken, dispatch, axiosJWT, navigate);
        };
        fetch();
    }, [user]);
    return (
        <>
            <DatatableBrands />
        </>
    );
}

export default Brands;
