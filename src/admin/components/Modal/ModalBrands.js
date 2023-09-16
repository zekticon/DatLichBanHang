import styles from './ModalBrands.module.scss';
import classNames from 'classnames/bind';
import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import images from '~/assets/images';
import { useSelector } from 'react-redux';
import CommonUtils from '~/utils/CommonUtlis';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { loginSuccess } from '~/redux/authSlice';
import { refreshToken } from '~/services';
import { createNewBrand, editBrand, getAllBrands, handleEditUser } from '~/redux/apiReques';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { axiosMiddle } from '~/services/axiosJWT';
import { DriveFolderUploadOutlined } from '@mui/icons-material';

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

function ModalBrands({ isOpen, FuncToggleModal, data }) {
    let [image, setImage] = useState();
    let [loading, setLoading] = useState(false);
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
        defaultValues.title = data?.title ? data?.title : '';
        defaultValues.status = data?.status ? data?.status : 1;
        setImage(data?.photo);
        reset({ ...defaultValues });
    }, [data]);

    const user = useSelector((state) => state.auth.login?.currentUser);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    let subtitle;

    const afterOpenModal = () => {
        subtitle.style.color = '#f00';
    };

    const onSubmit = async (brand) => {
        setLoading(true);

        let axiosJWT = await axiosMiddle(jwt_decode, user?.accessToken, user, dispatch);

        if (data) {
            let obj = {
                id: data.id,
                title: brand.title,
                status: brand.status,
                photo: image,
            };
            let res = await editBrand(dispatch, axiosJWT, obj, user?.accessToken);
            if (res.errCode === 0) {
                setLoading(false);

                toast.success(res.errMessage);
                await getAllBrands(user?.accessToken, dispatch, axiosJWT, navigate);
                FuncToggleModal();
            } else {
                setLoading(false);

                toast.error(res.errMessage);
            }
        } else {
            let obj = {
                title: brand.title,
                status: brand.status,
                photo: image ? image : null,
            };
            let res = await createNewBrand(obj, user?.accessToken, dispatch, axiosJWT);
            if (res.errCode === 0) {
                setLoading(false);

                toast.success(res.errMessage);
                await getAllBrands(user?.accessToken, dispatch, axiosJWT, navigate);
                FuncToggleModal();
            } else {
                setLoading(false);

                toast.error(res.errMessage);
            }
        }
    };
    const handleOnchangeImg = async (e) => {
        let data = e.target.files;
        let files = data[0];

        if (files) {
            let base64 = await CommonUtils.getBase64(files);
            setImage(base64);
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
                        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>BRAND</h2>
                        <button className={cx('close')} onClick={FuncToggleModal}>
                            close
                        </button>
                    </div>
                    <div className={cx('top')}>
                        <>{brand ? <h1>Edit New Brand</h1> : <h1>Add New Brand</h1>}</>
                    </div>
                    <div className={cx('bottom')}>
                        {loading === true && <div className={cx('spinner-3')}></div>}
                        <div className={cx('left')}>
                            <img src={image ? image : images.noImage} alt="" />
                        </div>
                        <div className={cx('right')}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className={cx('form-input')}>
                                    <label htmlFor="file">
                                        Image: <DriveFolderUploadOutlined className={cx('icon')} />
                                    </label>
                                    <input
                                        onChange={(e) => handleOnchangeImg(e)}
                                        type="file"
                                        id="file"
                                        style={{ display: 'none' }}
                                    />
                                </div>
                                <div className={cx('form-input')}>
                                    <label>Title</label>

                                    <input placeholder="Headway" {...register('title', { required: true })} />

                                    {errors.exampleRequired && <p>This field is required</p>}
                                </div>
                                <div className={cx('form-input')}>
                                    <label>Status</label>
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

export default ModalBrands;
