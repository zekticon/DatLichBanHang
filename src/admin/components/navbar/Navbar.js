import styles from './Navbar.module.scss';
import classNames from 'classnames/bind';
import {
    ChatBubbleOutlineOutlined,
    DarkModeOutlined,
    FullscreenExitOutlined,
    LanguageOutlined,
    ListOutlined,
    NotificationAddOutlined,
    PeopleAltOutlined,
    SearchOutlined,
} from '@mui/icons-material';

import images from '~/assets/images';
import { useSelector } from 'react-redux';

import Tippy from '@tippyjs/react/headless';

const cx = classNames.bind(styles);
function NavBar() {
    const user = useSelector((state) => state.auth.login.currentUser?.user);

    console.log('check ', user);

    return (
        <>
            <div className={cx('navbar')}>
                <div className={cx('wrapper')}>
                    <div className={cx('search')}>
                        <input type="text" placeholder="Search..." />
                        <SearchOutlined />
                    </div>
                    <div className={cx('items')}>
                        <div className={cx('item')}>
                            <PeopleAltOutlined className={cx('icon')} />
                            <span>
                                Xin chào:{' '}
                                {`${user?.lastName ? user?.lastName : ''} ${user?.firstName ? user?.firstName : ''}`}
                            </span>
                        </div>

                        <div className={cx('item')}>
                            <Tippy
                                render={(attrs) => (
                                    <div className="box" tabIndex="-1" {...attrs}>
                                        My tippy box
                                    </div>
                                )}
                            >
                                <button className={cx('action-btn')}>
                                    <img
                                        src={user?.photo ? user.photo : images.noImage}
                                        alt=""
                                        className={cx('avatar')}
                                    />
                                </button>
                            </Tippy>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NavBar;
