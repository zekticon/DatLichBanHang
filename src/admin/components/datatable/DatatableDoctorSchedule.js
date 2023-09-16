import styles from './Datatable.module.scss';
import classNames from 'classnames/bind';
import { DataGrid } from '@mui/x-data-grid';
import { useMovieData } from '@mui/x-data-grid-generator';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getScheduleDoctorById } from '~/services';
import moment from 'moment';
import ModalSchedule from '../Modal/ModalSchedule';

const cx = classNames.bind(styles);
function DatatableDoctorSchedule({ action }) {
    console.log('check props', action);
    const { id } = useParams();

    let [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));

    let [rows, setRows] = useState([]);
    let [checkBoxSelection, setCheckBoxSelection] = useState(false);
    let [isOpen, setIsOpen] = useState(false);

    const [idUser, setIdUser] = useState();
    const data = useMovieData();

    const handleRowClick = (params) => {
        setIdUser(idUser ? null : params.row.id);
        setCheckBoxSelection(!checkBoxSelection);
    };
    useEffect(() => {
        const fetchApi = async () => {
            let res = await getScheduleDoctorById(id, date, action !== null && 'history');

            if (res && res.data.length > 0) {
                let allBooking = res.data.map((item) => {
                    return {
                        id: item.id,
                        time: item.time.valueVi,
                        date: moment(item.date).format('DD-MM-YYYY'),
                        name: item?.User?.lastName,
                        phonenumber: item?.User?.phonenumber,
                        status: item.statusId,
                    };
                });

                setRows(allBooking);
            } else {
                setRows([]);
            }
        };
        fetchApi();
    }, [action]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'time',
            headerName: 'Thời gian',
            width: 150,
        },
        {
            field: 'date',
            headerName: 'Thời gian',
            width: 200,
        },
        {
            field: 'name',
            headerName: 'Tên',
            width: 200,
        },
        {
            field: 'phonenumber',
            headerName: 'Số điện thoại',
            width: 150,
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <div className={cx('status')}>
                            {params.row.status === 'S2' ? (
                                <div className={cx('active')}>Đã xác nhận</div>
                            ) : params.row.status === 'S3' ? (
                                <div className={cx('process')}>Đã khám</div>
                            ) : (
                                <div className={cx('disable')}>Chưa xác nhận</div>
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
                                Cập nhật trạng thái
                            </div>
                        </div>
                    </>
                );
            },
        },
    ];

    let [idBrand, setIdBrand] = useState(0);
    const handleSubmit = (id) => {
        setIdBrand(id);
        setIsOpen(true);
    };
    const toggleModal = async () => {
        setIsOpen(!isOpen);

        let res = await getScheduleDoctorById(id, date, action && 'history');

        if (res && res.data.length > 0) {
            let allBooking = res.data.map((item) => {
                return {
                    id: item.id,
                    time: item.time.valueVi,
                    date: moment(item.date).format('DD-MM-YYYY'),
                    name: item?.User?.lastName,
                    phonenumber: item?.User?.phonenumber,
                    status: item.statusId,
                };
            });

            setRows(allBooking);
        } else {
            setRows(res.data);
        }
    };

    const handleGetTurnover = async (e) => {
        console.log(typeof e.target.value);
        setDate(e.target.value);

        const res = await getScheduleDoctorById(id, e.target.value, action && 'history');
        if (res && res.data.length > 0) {
            let allBooking = res.data.map((item) => {
                return {
                    id: item.id,
                    time: item.time.valueVi,
                    date: moment(item.date).format('DD-MM-YYYY'),
                    name: item?.User?.lastName,
                    phonenumber: item?.User?.phonenumber,
                    status: item.statusId,
                };
            });

            setRows(allBooking);
        } else {
            setRows([]);
        }
    };

    return (
        <>
            <div className={cx('datatable')}>
                <div className={cx('datatable-title')}>
                    Danh sách lịch đặt khám ngày
                    <input className="cursor-pointer" value={date} type="date" onChange={(e) => handleGetTurnover(e)} />
                    {/* <div className={cx('link')} onClick={() => OpenModal()}></div> */}
                </div>
                <DataGrid
                    className={cx('customTable')}
                    onRowClick={handleRowClick}
                    {...data}
                    rows={rows}
                    columns={columns}
                    pageSize={9}
                    rowsPerPageOptions={[9]}
                />
                <ModalSchedule data={idBrand} isOpen={isOpen} FuncToggleModal={() => toggleModal()} />
            </div>
        </>
    );
}

export default DatatableDoctorSchedule;
