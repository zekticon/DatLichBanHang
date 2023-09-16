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
import { getAllCoupon, getAllGift, handleAddGift, handleUpdateCoupon, handleUpdateGift } from '~/services';

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

function ModalGift({ isOpen, FuncToggleModal, data }) {
    console.log('check res', data);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    useEffect(() => {
        if (data) {
            let defaultValues = {};
            defaultValues.title = data?.title ? data?.title : '';
            defaultValues.status = data?.status ? data?.status : 0;

            reset({ ...defaultValues });
        } else {
            let defaultValues = {};
            defaultValues.title = '';
            defaultValues.status = 1;
            reset({ ...defaultValues });
        }
    }, [data]);

    const user = useSelector((state) => state.auth.login?.currentUser);

    const dispatch = useDispatch();

    let subtitle;

    const afterOpenModal = () => {
        subtitle.style.color = '#f00';
    };

    const onSubmit = async (gift) => {
        let axiosJWT = await axiosMiddle(jwt_decode, user?.accessToken, user, dispatch);

        if (data) {
            let obj = {
                id: data.id,
                title: gift.title,
                status: gift.status,
            };
            let res = await handleUpdateGift(axiosJWT, obj, user?.accessToken);
            if (res.data && res.data.errCode === 0) {
                toast.success(res.data.errMessage);
                // await getAllGift();
                FuncToggleModal();
            } else {
                toast.success(res.data.errMessage);
            }
        } else {
            let obj = {
                title: gift.title,
                status: gift.status,
            };
            let res = await handleAddGift(axiosJWT, obj, user?.accessToken);
            if (res.data && res.data.errCode === 0) {
                toast.success(res.data.errMessgae);
                // await getAllCoupon();
                FuncToggleModal();
            } else {
                toast.success(res.data.errMessgae);
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
                        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Quà Tặng</h2>
                        <button className={cx('close')} onClick={FuncToggleModal}>
                            Đóng
                        </button>
                    </div>
                    <div className={cx('top')}>
                        <>{data ? <h1>Cập Nhật Quà Tặng</h1> : <h1>Thêm Quà Tặng</h1>}</>
                    </div>
                    <div className={cx('bottom')}>
                        <div className={cx('right')}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className={cx('form-input')}>
                                    <label>Tên</label>

                                    <input placeholder="Headway" {...register('title')} />
                                </div>

                                <div className={cx('form-input')}>
                                    <label>Trạng thái</label>
                                    <select {...register('status')}>
                                        <option value={1}>Active</option>
                                        <option value={0}>Disable</option>
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

export default ModalGift;
