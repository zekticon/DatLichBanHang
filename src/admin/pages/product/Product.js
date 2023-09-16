import styles from './Product.module.scss';
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { getAllUsersRedux } from '~/redux/apiReques';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import config from '~/config';

import jwt_decode from 'jwt-decode';
import { axiosMiddle } from '~/services/axiosJWT';
import DatatableProduct from '~/admin/components/datatable/DatatableProduct';

const cx = classNames.bind(styles);
function Product() {
    const user = useSelector((state) => state.auth.login?.currentUser);

    return (
        <>
            <DatatableProduct />
        </>
    );
}

export default Product;
