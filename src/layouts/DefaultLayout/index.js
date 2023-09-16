import PropTypes from 'prop-types';
import className from 'classnames/bind';

import Header from '../component/Header';
import styles from './DefaultLayout.module.scss';
import Footer from '../component/Footer/Footer';
const cx = className.bind(styles);

function DefaultLayout({ children }) {
    return (
        <>
            <div className={cx('wrapper')}>
                <Header />
                <div className={cx('container')}>
                    <div className={cx('content')}>{children}</div>
                </div>

                <Footer />
            </div>
        </>
    );
}
DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
export default DefaultLayout;
