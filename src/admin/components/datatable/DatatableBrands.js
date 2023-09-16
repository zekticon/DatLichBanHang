import styles from './Datatable.module.scss';
import classNames from 'classnames/bind';
import { DataGrid } from '@mui/x-data-grid';
import { useMovieData } from '@mui/x-data-grid-generator';
import { useDispatch, useSelector } from 'react-redux';
import images from '~/assets/images';
import jwt_decode from 'jwt-decode';
import { deleteBrand, getAllBrands } from '~/redux/apiReques';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ModalBrands from '../Modal/ModalBrands';
import { axiosMiddle } from '~/services/axiosJWT';

const cx = classNames.bind(styles);
function DatatableBrands() {
    let allBrands = useSelector((state) => state.brands.allBrand.brands?.data.data);
    const user = useSelector((state) => state.auth.login?.currentUser);

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

        if (allBrands) {
            let allBrand = allBrands.map((item) => {
                return {
                    id: item.id,
                    title: item.title,
                    photo: item.Image?.photo,
                    status: item.status,
                };
            });
            setLoading(false);

            setRows(allBrand);
        }
    }, [allBrands]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'title',
            headerName: 'Title',
            width: 230,
            renderCell: (params) => {
                return (
                    <>
                        <div className={cx('cellWithImg')}>
                            <img
                                className={cx('cellImg')}
                                src={params.row.photo ? params.row.photo : images.noImage}
                                alt="avatar"
                            />
                            {params.row.title}
                        </div>
                    </>
                );
            },
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <div className={cx('status')}>
                            {params.row.status === true ? (
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
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <div className={cx('cell-action')}>
                            <div className={cx('view-button')} onClick={() => handleSubmit(params.row)}>
                                Edit
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
    let [idBrand, setIdBrand] = useState(0);
    const handleSubmit = (id) => {
        setIdBrand(id);
        setIsOpen(true);
    };

    const handleDeleteUser = async (id) => {
        setLoadingDelete(true);

        let axiosJWT = await axiosMiddle(jwt_decode, user?.accessToken, user, dispatch);

        let res = await deleteBrand(dispatch, axiosJWT, id, user?.accessToken);

        if (res.errCode === 0) {
            setLoadingDelete(false);

            await getAllBrands(user?.accessToken, dispatch, axiosJWT);
            toast.success(res.errMessage);
        } else {
            setLoadingDelete(false);

            toast.error(res.errMessage);
        }
    };

    const OpenModal = () => {
        setIdBrand(null);
        setIsOpen(true);
    };
    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className={cx('datatable')}>
                <div className={cx('datatable-title')}>
                    Danh sách thương hiệu
                    <div className={cx('link')} onClick={() => OpenModal()}>
                        Thêm thương hiệu mới
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
                <ModalBrands data={idBrand} isOpen={isOpen} FuncToggleModal={() => toggleModal()} />
            </div>
        </>
    );
}

export default DatatableBrands;
