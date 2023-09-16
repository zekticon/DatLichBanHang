import className from 'classnames/bind';
import React from 'react';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import styles from './Banner.module.scss';
import images from '~/assets/images';

const cx = className.bind(styles);

function Banner() {
    let setting = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    return (
        <div className={cx('wrapper')}>
            <Slider {...setting}>
                <div className={cx('img')}>
                    <img src={images.banner} alt="" />
                </div>
            </Slider>
        </div>
    );
}
export default Banner;
