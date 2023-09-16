import styles from './New.module.scss';
import classNames from 'classnames/bind';
import SideBar from '~/admin/components/sidebar/SideBar';
import NavBar from '~/admin/components/navbar/Navbar';
import images from '~/assets/images';
import { DriveFolderUploadOutlined } from '@mui/icons-material';
import { useState } from 'react';
import CommonUtils from '~/utils/CommonUtlis';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import config from '~/config';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { refreshToken } from '~/services';
import { loginSuccess } from '~/redux/authSlice';
import { createNewUser } from '~/redux/apiReques';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);
function New() {
    let [state, setState] = useState({
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

    let [reviewAvatar, setReviewAvatar] = useState('');

    const user = useSelector((state) => state.auth.login?.currentUser);

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

    const handleOnchangeImg = async (e) => {
        let data = e.target.files;
        let files = data[0];

        if (files) {
            let base64 = await CommonUtils.getBase64(files);
            setState({
                ...state,
                avatar: base64,
            });
            let objectUrl = URL.createObjectURL(files);
            setReviewAvatar(objectUrl);
        }
    };
    const handleOnchangeInput = (e, id) => {
        let copyState = { ...state };

        copyState[id] = e.target.value;

        setState(copyState);
    };

    const handleSaveUser = async (e) => {
        console.log(state);
        e.preventDefault();

        let res = await createNewUser(state, user?.accessToken, dispatch, axiosJWT);

        if (res && res.errCode === 0) {
            toast.success(res.errMessage);
            navigate(config.routes.users);
        } else {
            toast.error(res.errMessage);
        }
    };

    return (
        <>
            <div className={cx('new')}>
                <SideBar />
                <div className={cx('new-container')}>
                    <NavBar />
                    <div className={cx('top')}>
                        <h1>Add new user</h1>
                    </div>
                    <div className={cx('bottom')}>
                        <div className={cx('left')}>
                            <img src={reviewAvatar ? reviewAvatar : images.noImage} alt="" />
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
                                        value={state.password}
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
                                <button onClick={(e) => handleSaveUser(e)}>Send</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default New;
