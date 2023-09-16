import styles from './Datatable.module.scss';
import classNames from 'classnames/bind';
import { DataGrid } from '@mui/x-data-grid';
import { useMovieData } from '@mui/x-data-grid-generator';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getAllGift, handleDeleteGift } from '~/services';
import { axiosMiddle } from '~/services/axiosJWT';
import ModalGift from '../Modal/ModalGift';

const cx = classNames.bind(styles);
function DatatableGift() {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();

    let [rows, setRows] = useState([]);
    let [checkBoxSelection, setCheckBoxSelection] = useState(false);
    let [isOpen, setIsOpen] = useState(false);
    let [loading, setLoading] = useState(false);

    const [idUser, setIdUser] = useState();
    const data = useMovieData();

    const handleRowClick = (params) => {
        setIdUser(idUser ? null : params.row.id);
        setCheckBoxSelection(!checkBoxSelection);
    };
    useEffect(() => {
        fetchApi();
    }, [isOpen]);
    const fetchApi = async () => {
        setLoading(true);
        const res = await getAllGift();
        let arr = [];
        if (res.errCode === 0 && res.data.length > 0) {
            setLoading(false);

            res.data.forEach((item) => {
                let obj = {};
                obj.id = item.id;
                obj.title = item.title;
                obj.status = item.status;
                arr.push(obj);
                return arr;
            });
            setRows(arr);
        } else {
            setLoading(false);

            setRows([]);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },

        {
            field: 'title',
            headerName: 'Tên',
            width: 400,
        },

        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <div className={cx('status')}>
                            {params.row.status === 1 ? (
                                <div className={cx('active')}>Active</div>
                            ) : (
                                <div className={cx('disable')}>Disable</div>
                            )}
                        </div>
                    </>
                );
            },
        },
        {
            field: '',
            headerName: 'Hành động',
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <div className={cx('cell-action')}>
                            <div className={cx('view-button')} onClick={() => handleSubmit(params.row)}>
                                Sửa
                            </div>
                            <div className={cx('delete-button')} onClick={() => handleDelete(params.row.id)}>
                                Xóa
                            </div>
                        </div>
                    </>
                );
            },
        },
    ];

    let [dataCoupon, setDataCoupon] = useState();
    const handleSubmit = (data) => {
        setDataCoupon(data);
        setIsOpen(true);
    };

    const handleDelete = async (id) => {
        let axiosJWT = await axiosMiddle(jwt_decode, user?.accessToken, user, dispatch);

        let res = await handleDeleteGift(axiosJWT, id, user?.accessToken);

        if (res.data.errCode === 0) {
            fetchApi();
            toast.success(res.data.errMessage);
        } else {
            toast.error(res.data.errMessage);
        }
    };

    const OpenModal = () => {
        setDataCoupon(null);
        setIsOpen(true);
    };
    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className={cx('datatable')}>
                <div className={cx('datatable-title')}>
                    Danh sách quà tặng
                    <div className={cx('link')} onClick={() => OpenModal()}>
                        Thêm quà tặng
                    </div>
                </div>
                {loading === true ? (
                    <div class={cx('spinner-3')}></div>
                ) : (
                    <DataGrid
                        className={cx('customTable')}
                        onRowClick={handleRowClick}
                        {...data}
                        rows={rows}
                        columns={columns}
                        pageSize={9}
                        rowsPerPageOptions={[9]}
                    />
                )}
                <ModalGift data={dataCoupon} isOpen={isOpen} FuncToggleModal={() => toggleModal()} />
            </div>
        </>
    );
}

export default DatatableGift;
