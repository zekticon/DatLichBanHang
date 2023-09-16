import className from 'classnames/bind';
import React from 'react';

import styles from './BookingSchedules.module.scss';
import images from '~/assets/images';

const cx = className.bind(styles);

function BookingSchedules() {
    return (
        <div className={cx('wrapper')}>
            <h1>Dịch vụ Đặt Lịch Khám bệnh của hệ thống </h1>
            <div className={cx('list-item')}>
                <div className={cx('item')}>
                    <img src={images.schedules1} alt="" />
                    <h1>VẬT LIỆU CHẤT LƯỢNG</h1>
                    <p>Các vật liệu tại phòng khám từ các nguồn uy tín</p>
                </div>
                <div className={cx('item')}>
                    <img src={images.schedules3} alt="" />
                    <h1>PHÒNG KHÁM VƯỢT TRỘI</h1>
                    <p>Thiết bị nha khoa theo chuẩn giấy phép</p>
                    <p>Đầy đủ thiết bị, dụng cụ, vật liệu</p>
                    <button>Đặt lịch khám ngay</button>
                </div>
                <div className={cx('item')}>
                    <img src={images.schedules2} alt="" />
                    <h1>VẬT LIỆU CHẤT LƯỢNG</h1>
                    <p>Các vật liệu tại phòng khám từ các nguồn uy tín</p>
                </div>
            </div>
        </div>
    );
}
export default BookingSchedules;
