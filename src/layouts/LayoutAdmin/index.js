import styles from './LayoutAdmin.module.scss';
import classNames from 'classnames/bind';
import SideBar from '~/admin/components/sidebar/SideBar';
import NavBar from '~/admin/components/navbar/Navbar';

const cx = classNames.bind(styles);

function LayoutAdmin({ children }) {
    return (
        <>
            <div className={cx('home')}>
                <SideBar />
                <div className={cx('homeContainer')}>
                    <NavBar />
                    {children}
                </div>
            </div>
        </>
    );
}

export default LayoutAdmin;
