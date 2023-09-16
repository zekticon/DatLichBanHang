import styles from './Datatable.module.scss';
import classNames from 'classnames/bind';
import { DataGrid } from '@mui/x-data-grid';
import { useMovieData } from '@mui/x-data-grid-generator';
import { useDispatch, useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { getAllParentCategory } from '~/services';
import { deleteCategory, getAllCategoryAdmin, getAllOrderNewAdmin } from '~/redux/apiReques';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { axiosMiddle } from '~/services/axiosJWT';
import { NumericFormat } from 'react-number-format';

import ModalCategory from '../Modal/ModalCategory';
import images from '~/assets/images';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);
function DatatableOrder(action) {
    let listOrderNew = useSelector((state) => state.order.allOrderNew.data?.data?.data);
    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let [rows, setRows] = useState([]);
    let [loading, setLoading] = useState(false);

    const data = useMovieData();
    useEffect(() => {
        async function fetchApi() {
            setLoading(true);
            let axiosJWT = await axiosMiddle(jwt_decode, user?.accessToken, user, dispatch);

            let res = await getAllOrderNewAdmin(dispatch, axiosJWT, action, user?.accessToken);
            if (res && res.errCode === 0) {
                setLoading(false);

                let arr = [];
                if (res.data.length > 0) {
                    res?.data.map((item) => {
                        let obj = {};
                        obj.id = item.id;
                        obj.order_number = item.order_number;
                        obj.name = `${item.lastName} ${item.firstName}`;
                        obj.email = item.email;
                        obj.quantity = item.quantity;
                        obj.total = item.sub_total;
                        obj.status = item.status;

                        arr.push(obj);

                        return arr;
                    });
                }

                setRows(arr);
            }
        }
        fetchApi();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },

        {
            field: 'order_number',
            headerName: 'Mã đơn hàng',
            width: 150,
        },
        {
            field: 'name',
            headerName: 'Tên',
            width: 200,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 250,
        },

        {
            field: 'quantity',
            headerName: 'Số lượng',
            width: 100,
        },
        {
            field: 'total',
            headerName: 'Tổng tiền',
            width: 100,
            renderCell: (params) => {
                return (
                    <>
                        <NumericFormat
                            className="currency"
                            type="text"
                            value={params.row.total}
                            displayType="text"
                            thousandSeparator={true}
                            suffix={'đ'}
                        />
                    </>
                );
            },
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 170,
            renderCell: (params) => {
                return (
                    <>
                        <div className={cx('status')}>
                            {params.row.status === 'new' && <div className={cx('active')}>Mới</div>}
                            {params.row.status === 'process' && <div className={cx('process')}>Chuẩn bị</div>}
                            {params.row.status === 'shipping' && <div className={cx('shipping')}>Vận chuyển</div>}
                        </div>
                    </>
                );
            },
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <div className={cx('cell-action')}>
                            <div className={cx('view-button')} onClick={() => handleEdit(params.row.id)}>
                                XEM
                            </div>
                            <div className={cx('delete-button')} onClick={() => handleDelete(params.row.id)}>
                                XÓA
                            </div>
                        </div>
                    </>
                );
            },
        },
    ];

    const handleEdit = (id) => {
        console.log(id);
        navigate(`order-detail/${id}`);
    };

    const handleDelete = async (id) => {
        console.log(id);
    };

    return (
        <>
            <div className={cx('datatable')}>
                {loading === true ? (
                    <div class={cx('spinner-3')}></div>
                ) : (
                    <DataGrid
                        className={cx('customTable')}
                        {...data}
                        rows={rows}
                        columns={columns}
                        pageSize={9}
                        rowsPerPageOptions={[9]}
                    />
                )}
            </div>
        </>
    );
}

export default DatatableOrder;
