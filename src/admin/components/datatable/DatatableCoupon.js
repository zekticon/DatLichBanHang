import styles from './Datatable.module.scss';
import classNames from 'classnames/bind';
import { DataGrid } from '@mui/x-data-grid';
import { useMovieData } from '@mui/x-data-grid-generator';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getAllCoupon, handleDeleteCoupon } from '~/services';
import ModalCoupon from '../Modal/ModalCoupon';
import { axiosMiddle } from '~/services/axiosJWT';

const cx = classNames.bind(styles);
function DatatableCoupon() {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();

    let [rows, setRows] = useState([]);
    let [checkBoxSelection, setCheckBoxSelection] = useState(false);
    let [isOpen, setIsOpen] = useState(false);
    let [loading, setLoading] = useState(false);
    let [loadingDelete, setLoadingDelete] = useState(false);

    const [idUser, setIdUser] = useState();
    const data = useMovieData();

    const handleRowClick = (params) => {
        setIdUser(idUser ? null : params.row.id);
        setCheckBoxSelection(!checkBoxSelection);
    };
    useEffect(() => {
        setLoading(true);
        fetchApi();
    }, [isOpen]);
    const fetchApi = async () => {
        const res = await getAllCoupon();
        let arr = [];
        if (res.errCode === 0 && res.data.length > 0) {
            res.data.forEach((item) => {
                let obj = {};
                obj.id = item.id;
                obj.code = item.code;
                obj.value = item.value;
                obj.stock = item.stock;
                obj.status = item.status;

                arr.push(obj);

                return arr;
            });
            setLoading(false);

            setRows(arr);
        } else {
            setLoading(false);

            setRows([]);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'code',
            headerName: 'Mã',
            width: 230,
        },
        {
            field: 'value',
            headerName: 'Giá trị',
            width: 200,
        },
        {
            field: 'stock',
            headerName: 'Số lượng',
            width: 200,
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <div className={cx('status')}>
                            {params.row.status === 'active' ? (
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
        setLoadingDelete(true);
        let axiosJWT = await axiosMiddle(jwt_decode, user?.accessToken, user, dispatch);

        let res = await handleDeleteCoupon(axiosJWT, id, user?.accessToken);

        if (res.data.errCode === 0) {
            fetchApi();
            setLoadingDelete(false);

            toast.success(res.data.errMessage);
        } else {
            setLoadingDelete(false);

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
                    Danh sách mã giảm giá
                    <div className={cx('link')} onClick={() => OpenModal()}>
                        Thêm mã giảm giá
                    </div>
                </div>
                {loadingDelete === true && <div class={cx('spinner-4')}></div>}

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
                <ModalCoupon data={dataCoupon} isOpen={isOpen} FuncToggleModal={() => toggleModal()} />
            </div>
        </>
    );
}

export default DatatableCoupon;
