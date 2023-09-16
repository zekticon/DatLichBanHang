import styles from './List.module.scss';
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { getAllUsersRedux } from '~/redux/apiReques';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import config from '~/config';

import jwt_decode from 'jwt-decode';
import DatatableUser from '~/admin/components/datatable/DatatableUsers';
import { axiosMiddle } from '~/services/axiosJWT';

const cx = classNames.bind(styles);
function List() {
    const user = useSelector((state) => state.auth.login?.currentUser);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate(config.routes.loginAdmin);
        }
        const fetch = async () => {
            let axiosJWT = await axiosMiddle(jwt_decode, user?.accessToken, user, dispatch);

            await getAllUsersRedux(user?.accessToken, dispatch, axiosJWT, navigate);
        };
        fetch();
    }, [user]);
    return (
        <>
            <DatatableUser />
        </>
    );
}

export default List;
