import className from 'classnames/bind';
import React, { useEffect, useState } from 'react';

import styles from './Product.module.scss';
import images from '~/assets/images';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

const cx = className.bind(styles);

function Product(id, title, photo, sold, price) {
    const [state, setState] = useState({
        id: '',
        title: '',
        photo: '',
        sold: '',
        price: '',
    });
    // useEffect(() => {
    //     setState({
    //         id: id,
    //         title: title,
    //         photo: photo,
    //         sold: sold,
    //         price: price,
    //     });
    // }, []);

    console.log(id, title, photo, sold, price);

    return <></>;
}
export default Product;
