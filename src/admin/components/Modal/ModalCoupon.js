import styles from './ModalBrands.module.scss';
import classNames from 'classnames/bind';
import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CommonUtils from '~/utils/CommonUtlis';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { createNewBrand, editBrand, getAllBrands } from '~/redux/apiReques';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { axiosMiddle } from '~/services/axiosJWT';
import { getAllCoupon, handleAddCoupon, handleUpdateCoupon } from '~/services';

const cx = classNames.bind(styles);

const customStyles = {
    content: {
        height: 'fit-content',
        width: '900px',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

function ModalCoupon({ isOpen, FuncToggleModal, data }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    useEffect(() => {
        if (data) {
            let defaultValues = {};
            defaultValues.code = data?.code ? data?.code : '';
            defaultValues.value = data?.value ? data?.value : 0;
            defaultValues.stock = data?.stock ? data?.stock : 0;
            defaultValues.status = data?.status ? data?.status : '';
            reset({ ...defaultValues });
        } else {
            let defaultValues = {};
            defaultValues.code = '';
            defaultValues.value = 0;
            defaultValues.stock = 0;
            defaultValues.status = 'active';
            reset({ ...defaultValues });
        }
    }, [data]);

    const user = useSelector((state) => state.auth.login?.currentUser);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    let subtitle;

    const afterOpenModal = () => {
        subtitle.style.color = '#f00';
    };

    const onSubmit = async (brand) => {
        let axiosJWT = await axiosMiddle(jwt_decode, user?.accessToken, user, dispatch);

        if (data) {
            let obj = {
                id: data.id,
                code: brand.code,
                value: brand.value,
                status: brand.status,
                stock: brand.stock,
            };
            let res = await handleUpdateCoupon(axiosJWT, obj, user?.accessToken);
            console.log('check res', res);
            if (res.data && res.data.errCode === 0) {
                toast.success(res.data.errMessage);
                await getAllCoupon();
                FuncToggleModal();
            } else {
                toast.success(res.data.errMessage);
            }
        } else {
            let obj = {
                code: brand.code,
                value: brand.value,
                status: brand.status,
                stock: brand.stock,
            };
            let res = await handleAddCoupon(axiosJWT, obj, user?.accessToken);
            if (res.data && res.data.errCode === 0) {
                toast.success(res.data.errMessage);
                await getAllCoupon();
                FuncToggleModal();
            } else {
                toast.success(res.data.errMessage);
            }
        }
    };

    return (
        <>
            <div>
                <Modal
                    isOpen={isOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={FuncToggleModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <div className={cx('header')}>
                        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Mã Giảm Giá</h2>
                        <button className={cx('close')} onClick={FuncToggleModal}>
                            Đóng
                        </button>
                    </div>
                    <div className={cx('top')}>
                        <>{data ? <h1>Cập Nhật Mã Giảm Giá</h1> : <h1>Thêm Mã Giảm Giá</h1>}</>
                    </div>
                    <div className={cx('bottom')}>
                        <div className={cx('right')}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className={cx('form-input')}>
                                    <label>Mã</label>

                                    <input placeholder="Headway" {...register('code')} />
                                </div>
                                <div className={cx('form-input')}>
                                    <label>Giá trị</label>

                                    <input placeholder="Headway" {...register('value')} />
                                </div>
                                <div className={cx('form-input')}>
                                    <label>Số lượng</label>

                                    <input placeholder="Headway" {...register('stock')} />
                                </div>
                                <div className={cx('form-input')}>
                                    <label>Status</label>
                                    <select {...register('status')}>
                                        <option value="active">Active</option>
                                        <option value="disable">Disable</option>
                                    </select>
                                </div>
                                <input className={cx('btnSave')} type="submit" />
                            </form>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
}

export default ModalCoupon;
