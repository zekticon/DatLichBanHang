import styles from './Datatable.module.scss';
import classNames from 'classnames/bind';
import {
    DataGrid,
    GridColDef,
    GridValueGetterParams,
    useGridApiContext,
    useGridApiEventHandler,
} from '@mui/x-data-grid';
import { useMovieData } from '@mui/x-data-grid-generator';
import { useDispatch, useSelector } from 'react-redux';
import images from '~/assets/images';
import { Link, useNavigate } from 'react-router-dom';
import config from '~/config';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { refreshToken } from '~/services';
import { loginSuccess } from '~/redux/authSlice';
import { deleteUserById } from '~/redux/apiReques';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { axiosMiddle } from '~/services/axiosJWT';

const cx = classNames.bind(styles);
function DatatableUser() {
    let allUsers = useSelector((state) => state.user.users.allUsers?.data);
    const user = useSelector((state) => state.auth.login?.currentUser);

    let [rows, setRows] = useState([]);
    let [checkBoxSelection, setCheckBoxSelection] = useState(false);

    const [idUser, setIdUser] = useState();
    const data = useMovieData();

    const handleRowClick = (params) => {
        setIdUser(idUser ? null : params.row.id);
        setCheckBoxSelection(!checkBoxSelection);
    };
    useEffect(() => {
        if (allUsers) {
            let allUser = allUsers.map((item) => {
                return {
                    id: item.id,
                    username: `${item.firstName} ${item.lastName}`,
                    status: 'active',
                    email: item.email,
                    image: item?.Image?.photo,
                    gender: item.gender,
                    address: item.address,
                    role: item.roleId,
                    phoneNumber: item.phonenumber,
                };
            });

            setRows(allUser);
        }
    }, [allUsers]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'user',
            headerName: 'User',
            width: 230,
            renderCell: (params) => {
                return (
                    <>
                        <div className={cx('cellWithImg')}>
                            <img
                                className={cx('cellImg')}
                                src={params.row.image ? params.row.image : images.noImage}
                                alt="avatar"
                            />
                            {params.row.username}
                        </div>
                    </>
                );
            },
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 200,
        },
        {
            field: 'address',
            headerName: 'Address',
            width: 150,
        },
        {
            field: 'phoneNumber',
            headerName: 'Phone Number',
            width: 170,
        },
        {
            field: 'gender',
            headerName: 'Gender',
            width: 100,
        },
        {
            field: 'role',
            headerName: 'Role',
            width: 100,
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <div className={cx('cell-action')}>
                            <div className={cx('view-button')} onClick={() => handleSubmit(params.row.id)}>
                                View
                            </div>
                            <div className={cx('delete-button')} onClick={() => handleDeleteUser(params.row.id)}>
                                Delete
                            </div>
                        </div>
                    </>
                );
            },
        },
    ];

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (user) => {
        navigate(`details/${user}`);
    };

    const handleDeleteUser = async (id) => {
        let axiosJWT = await axiosMiddle(jwt_decode, user?.accessToken, user, dispatch);
        let res = await deleteUserById(id, user?.accessToken, dispatch, axiosJWT);

        if (res.errCode === 0) {
            toast.success(res.errMessage);
        } else {
            toast.error(res.errMessage);
        }
    };

    return (
        <>
            <div className={cx('datatable')}>
                <div className={cx('datatable-title')}>
                    List User
                    {idUser ? (
                        <Link to={config.routes.new} className={cx('link')}>
                            Edit User
                        </Link>
                    ) : (
                        <Link to={config.routes.new} className={cx('link')}>
                            Add New User
                        </Link>
                    )}
                </div>
                <DataGrid
                    className={cx('customTable')}
                    onRowClick={handleRowClick}
                    {...data}
                    rows={rows}
                    columns={columns}
                    pageSize={9}
                    checkboxSelection={checkBoxSelection}
                    rowsPerPageOptions={[9]}
                />
            </div>
        </>
    );
}

export default DatatableUser;
