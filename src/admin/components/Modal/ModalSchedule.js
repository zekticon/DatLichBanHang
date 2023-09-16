import styles from './ModalBrands.module.scss';
import classNames from 'classnames/bind';
import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { editBookAppointment } from '~/services';

const cx = classNames.bind(styles);

const customStyles = {
    content: {
        height: '350px',
        width: '900px',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

function ModalSchedule({ isOpen, FuncToggleModal, data }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    let [brand, setBrand] = useState('');
    useEffect(() => {
        setBrand(data);
        let defaultValues = {};
        defaultValues.title = data?.name ? data?.name : '';
        defaultValues.status = data?.status ? data?.status : 0;
        reset({ ...defaultValues });
    }, [data]);

    let subtitle;

    const afterOpenModal = () => {
        subtitle.style.color = '#f00';
    };

    const onSubmit = async (brand) => {
        let res = await editBookAppointment({ id: data.id, status: brand.status });
        if (res.errCode === 0) {
            toast.success(res.errMessage);
            FuncToggleModal();
        } else {
            toast.success(res.errMessage);
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
                        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Lịch Khám</h2>
                        <button className={cx('close')} onClick={FuncToggleModal}>
                            Đóng
                        </button>
                    </div>
                    <div className={cx('top')}>
                        <h1>Cập Nhật Trạng Thái</h1>
                    </div>
                    <div className={cx('bottom')}>
                        <div className={cx('right')}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className={cx('form-input')}>
                                    <label>Tên bệnh nhân</label>

                                    <input placeholder="Headway" {...register('title', { required: true })} />

                                    {errors.exampleRequired && <p>This field is required</p>}
                                </div>
                                <div className={cx('form-input')}>
                                    <label>Trạng thái</label>
                                    <select {...register('status')}>
                                        <option value="S2">Đã xác nhận</option>
                                        <option value="S3">Đã khám</option>
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

export default ModalSchedule;
