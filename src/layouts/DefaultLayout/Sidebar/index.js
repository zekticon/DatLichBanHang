import className from 'classnames/bind';
import styles from './Sidebar.module.scss';
import { Wrapper as PopperWrapper } from '~/Component/Popper';
import DiscountIcon from '@mui/icons-material/Discount';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useDispatch, useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';

import { useEffect, useState } from 'react';
import { axiosMiddle } from '~/services/axiosJWT';
import { getListParentCategory } from '~/redux/apiReques';
import Tippy from '@tippyjs/react/headless';

import 'tippy.js/dist/tippy.css';
import { useNavigate } from 'react-router-dom';
import config from '~/config';

function Sidebar() {
    const cx = className.bind(styles);

    let [listParent, setListParent] = useState();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchApi() {
            let res = await getListParentCategory(dispatch);
            setListParent(res.data);
        }
        fetchApi();
    }, []);

    const viewCategory = (id) => {
        console.log(id);
        navigate(`/category/${id}`);
    };
    return (
        <aside className={cx('wrapper')}>
            {listParent?.map((item, index) => {
                return (
                    // <Tippy
                    //     className={cx('tippy')}
                    //     interactive
                    //     delay={300}
                    //     render={(attrs) => (
                    //         <div className={cx('category-dropdown')} tabIndex="-1" {...attrs}>
                    //             <PopperWrapper className={cx('popper-wrapper')}>
                    //                 <>hello</>
                    //             </PopperWrapper>
                    //         </div>
                    //     )}
                    <div onClick={() => viewCategory(item.id)} className={cx('row-item')}>
                        <div className={cx('title')}>{item.title}</div>
                        <div className={cx('icon')}>
                            <KeyboardArrowRightIcon />
                        </div>
                    </div>
                    // ></Tippy>
                );
            })}
        </aside>
    );
}

export default Sidebar;
