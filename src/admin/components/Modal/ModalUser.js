import styles from './ModalUser.module.scss';
import classNames from 'classnames/bind';
import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import images from '~/assets/images';
import { DriveFolderUploadOutlined } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import CommonUtils from '~/utils/CommonUtlis';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import config from '~/config';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { loginSuccess } from '~/redux/authSlice';
import { refreshToken } from '~/services';
import { handleEditUser } from '~/redux/apiReques';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

const customStyles = {
    content: {
        height: '650px',
        width: '900px',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

function ModalUser({ isOpen, FuncToggleModal }) {
    const userRedux = useSelector((state) => state.user.userInfo?.user);
    const user = useSelector((state) => state.auth.login?.currentUser);

    let [state, setState] = useState({
        id: 0,
        firstName: '',
        lastName: '',
        address: '',
        gender: '',
        email: '',
        password: '',
        phonenumber: '',
        avatar: '',
        positionId: 'None',
        roleId: 'Doctor',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    let axiosJWT = axios.create({
        baseURL: process.env.REACT_APP_BACKEND_URL,
    });

    axiosJWT.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decodeToken = jwt_decode(user?.accessToken);
            if (decodeToken.exp < date.getTime() / 1000) {
                const data = await refreshToken();
                const refreshUser = {
                    ...user,
                    accessToken: data.accessToken,
                };
                dispatch(loginSuccess(refreshUser));
                config.headers['token'] = 'Bearer ' + data.accessToken;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        },
    );

    useEffect(() => {
        if (userRedux) {
            setState({
                id: userRedux.id,
                firstName: userRedux.firstName,
                lastName: userRedux.lastName,
                address: userRedux.address,
                gender: userRedux.gender,
                email: userRedux.email,
                phonenumber: userRedux.phonenumber,
                avatar: userRedux?.image,
                positionId: userRedux.positionId,
                roleId: userRedux.roleId,
            });
        }
    }, [userRedux]);

    let subtitle;

    const afterOpenModal = () => {
        subtitle.style.color = '#f00';
    };
    const handleOnchangeImg = async (e) => {
        let data = e.target.files;
        let files = data[0];

        if (files) {
            let base64 = await CommonUtils.getBase64(files);
            setState({
                ...state,
                avatar: base64,
            });
        }
    };
    const handleSaveUser = async () => {
        let res = await handleEditUser(state, user?.accessToken, dispatch, axiosJWT);
        if (res.errCode === 0) {
            toast.success(res.errMessage);
            FuncToggleModal();
        } else {
            toast.error(res.errMessage);
        }
    };

    const handleOnchangeInput = (e, id) => {
        e.preventDefault();
        let copyState = { ...state };

        copyState[id] = e.target.value;

        setState(copyState);
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
                        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Edit User</h2>
                        <button className={cx('close')} onClick={FuncToggleModal}>
                            close
                        </button>
                    </div>
                    <div className={cx('top')}>
                        <h1>Add new user</h1>
                    </div>
                    <div className={cx('bottom')}>
                        <div className={cx('left')}>
                            <img src={state.avatar ? state.avatar : images.noImage} alt="" />
                        </div>
                        <div className={cx('right')}>
                            <form>
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
                                    <label>First Name</label>
                                    <input
                                        value={state.firstName}
                                        onChange={(e) => handleOnchangeInput(e, 'firstName')}
                                        type="text"
                                        placeholder="John"
                                    />
                                </div>
                                <div className={cx('form-input')}>
                                    <label>Last Name</label>
                                    <input
                                        value={state.lastName}
                                        onChange={(e) => handleOnchangeInput(e, 'lastName')}
                                        type="text"
                                        placeholder="Wick"
                                    />
                                </div>
                                <div className={cx('form-input')}>
                                    <label>Gender</label>
                                    <input
                                        value={state.gender}
                                        onChange={(e) => handleOnchangeInput(e, 'gender')}
                                        type="text"
                                        placeholder="Male or female"
                                    />
                                </div>
                                <div className={cx('form-input')}>
                                    <label>Email</label>
                                    <input
                                        value={state.email}
                                        onChange={(e) => handleOnchangeInput(e, 'email')}
                                        type="email"
                                        readOnly
                                        placeholder="thanhhoa@gmail.com"
                                    />
                                </div>
                                <div className={cx('form-input')}>
                                    <label>Phone</label>
                                    <input
                                        value={state.phonenumber}
                                        onChange={(e) => handleOnchangeInput(e, 'phonenumber')}
                                        type="text"
                                        placeholder="07954564152"
                                    />
                                </div>
                                <div className={cx('form-input')}>
                                    <label>Password</label>
                                    <input
                                        disabled="disabled"
                                        value="1213465466"
                                        onChange={(e) => handleOnchangeInput(e, 'password')}
                                        type="password"
                                    />
                                </div>
                                <div className={cx('form-input')}>
                                    <label>Address</label>
                                    <input
                                        value={state.address}
                                        onChange={(e) => handleOnchangeInput(e, 'address')}
                                        type="text"
                                        placeholder="A16/5 ap 1"
                                    />
                                </div>
                                <div className={cx('btnSave')} onClick={(e) => handleSaveUser(e)}>
                                    Send
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
}

export default ModalUser;
