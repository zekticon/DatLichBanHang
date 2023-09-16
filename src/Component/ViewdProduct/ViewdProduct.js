import className from 'classnames/bind';
import React from 'react';

import styles from './ViewedProduct.module.scss';
import images from '~/assets/images';

const cx = className.bind(styles);

function ViewedProduct() {
    return <div className={cx('wrapper')}></div>;
}
export default ViewedProduct;
