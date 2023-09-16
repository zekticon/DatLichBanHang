import className from 'classnames/bind';
import { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DiscountIcon from '@mui/icons-material/Discount';
import 'tippy.js/dist/tippy.css';
import 'react-image-gallery/styles/scss/image-gallery.scss';

import images from '~/assets/images';

import styles from './CheckOut.module.scss';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import config from '~/config';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart, addProductToCartRedux, deleteCartRedux } from '~/redux/requestApp';
import { set } from 'react-hook-form';
import { useDebounce } from '~/hooks';
import { createOrder, searchCoupon } from '~/services';
const cx = className.bind(styles);

function CheckOut() {
    const productCart = useSelector((state) => state.cartRedux.cart?.arrCart);

    const currentUser = useSelector((state) => state.auth.loginCustomer?.currentCustomer?.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    let [listProduct, setListProduct] = useState([]);

    let [coupon, setCoupon] = useState('');
    let [loading, setLoading] = useState(false);
    let [message, setMessage] = useState('');
    let [showMessage, setShowMessage] = useState(false);
    let [couponResult, setCouponResult] = useState();
    let [loadingSubmit, setLoadingSubmit] = useState(false);

    let [state, setState] = useState({
        firstName: '',
        lastName: '',
        phonenumber: '',
        email: '',
        address: '',
        note: '',
    });
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `Thanh toán`;
        setState({
            email: currentUser ? currentUser.email : '',
            firstName: currentUser ? currentUser.firstName : '',
            lastName: currentUser ? currentUser.lastName : '',
            phonenumber: currentUser ? currentUser.phonenumber : '',
            address: currentUser ? currentUser.address : '',
        });
    }, []);

    const debounced = useDebounce(coupon, 700);

    useEffect(() => {
        if (!debounced.trim()) {
            return;
        }

        const fetchApi = async () => {
            setLoading(true);
            await setTimeout(async () => {
                const result = await searchCoupon(coupon);

                if (result.errCode === 0 && result.data?.stock > 0) {
                    setShowMessage(true);
                    setCouponResult(result.data);
                }
                if (result.errCode === 0 && result.data?.stock === 0) {
                    setMessage('Mã giảm giá đã hết');
                } else if (result.errCode === 0) {
                    setMessage(`Giảm giá ${result.data.value}%`);
                } else {
                    setShowMessage(false);
                    setCouponResult(null);

                    setMessage('Mã giảm giá không tồn tại!!!');
                }
                setLoading(false);
            }, 1000);
        };

        fetchApi();
    }, [debounced, coupon]);

    let [render, setRender] = useState(0);

    useEffect(() => {
        if (productCart) {
            setListProduct(productCart);
        } else {
            setRender(render++);
        }
    }, [productCart]);

    const handleOnchange = (e) => {
        const searchCoupon = e.target.value;
        if (!searchCoupon.startsWith(' ')) {
            setCoupon(searchCoupon);
        }
    };

    const handleIncrease = async (id) => {
        let arr = [...listProduct];

        arr.map(async (item, index) => {
            let data = {
                id: id,
                title: item.title,
                quality: item.quality,
                total: item.total,
                discount: item.discount,
                price: item.price,
                brand: item.brand,
                unit: item.unit,
                priceSale: item.priceSale,
                image: item.image,
                writable: true,
            };
            let dataCartSe = {
                user_id: currentUser.id,
                product_id: id,
                quantity: item.quality,
            };
            if (item.id === id) {
                const increase = () => {
                    let sum = item.quality;
                    sum += 1;
                    return sum;
                };
                data.quality = increase();
                dataCartSe.quantity = data.quality;
                let res = await addProductToCart(dataCartSe);
                console.log(res);
                if (res.errCode !== 0) {
                    toast.warning(res.errMessage);
                } else {
                    if (item.discount > 0) {
                        const sumPriceSale = () => {
                            let sum = item.total;
                            sum += item.priceSale;

                            return sum;
                        };
                        data.total = sumPriceSale();
                    } else {
                        const sumPrice = () => {
                            let sum = item.total;
                            sum += item.price;

                            return sum;
                        };
                        data.total = sumPrice();
                    }
                    arr[index] = data;
                    await addProductToCartRedux(dispatch, arr);
                }

                return item;
            }
        });
    };

    const handleDecrease = (id) => {
        listProduct.map(async (item, index) => {
            let arr = [...listProduct];
            let data = {
                id: id,
                title: item.title,
                quality: item.quality,
                brand: item.brand,
                unit: item.unit,
                total: item.total,
                discount: item.discount,
                price: item.price,
                priceSale: item.priceSale,
                image: item.image,

                writable: true,
            };
            let dataCartSe = {
                user_id: currentUser.id,
                product_id: id,
                quantity: item.quality,
            };
            if (item.id === id) {
                if (item.quality === 1) {
                    let dataCart = {
                        user_id: currentUser.id,
                        product_id: id,
                        quantity: 0,
                    };
                    arr = [...arr.slice(0, index), ...arr.slice(index + 1)];
                    setListProduct(arr);
                    await addProductToCartRedux(dispatch, arr);
                    await addProductToCart(dataCart);
                    return;
                }
                const decrease = () => {
                    let sum = item.quality;
                    sum -= 1;
                    return sum;
                };
                data.quality = decrease();
                dataCartSe.quantity = data.quality;
                if (item.discount > 0) {
                    const subPriceSale = () => {
                        let sub = item.total;
                        sub -= item.priceSale;

                        return sub;
                    };
                    data.total = subPriceSale();
                    console.log(item.total);
                } else {
                    const subPrice = () => {
                        let sub = item.total;
                        sub -= item.price;

                        return sub;
                    };
                    data.total = subPrice();
                }
                arr[index] = data;
                await addProductToCartRedux(dispatch, arr);
                await addProductToCart(dataCartSe);
                return item;
            }
        });
    };

    const handleTotalQuantity = () => {
        let arr = [];
        listProduct.forEach((item) => {
            arr.push(item.quality);
        });
        if (arr.length > 0) {
            return arr.reduce((a, b) => {
                return a + b;
            });
        }
    };

    const handleTotal = () => {
        let arr = [];
        listProduct.forEach((item) => {
            arr.push(item.total);
        });
        if (arr.length > 0) {
            return arr.reduce((a, b) => {
                return a + b;
            });
        }
    };
    const inputOnchange = (e, id) => {
        let value = e.target.value;
        let copyState = { ...state };
        copyState[id] = value;

        setState(copyState);
    };

    console.log(couponResult);

    const handleSubmit = async () => {
        setLoadingSubmit(true);
        if (currentUser) {
            let arrProduct = [];
            let order_number = `NK${Math.floor(Math.random() * 1000000 + 1)}NMN`;

            listProduct?.map((item) => {
                let product = {};
                product.product_id = item.id;
                product.quantity = item.quality;
                product.order_number = order_number;

                arrProduct.push(product);
            });

            let data = {
                user_id: currentUser.id,
                product: arrProduct,
                order_number: order_number,
                coupon: couponResult ? couponResult.code : null,
                sub_total: couponResult ? handleTotal() * ((100 - couponResult.value) / 100) : handleTotal(),
                quantity: handleTotalQuantity(),
                lastName: state.lastName,
                firstName: state.firstName,
                address: state.address,
                phonenumber: state.phonenumber,
                email: state.email,
                note: state.note,
                action: 'new',
                status: 'new',
            };
            let res = await createOrder(data);
            if (res.errCode === 0) {
                setLoadingSubmit(false);

                await deleteCartRedux(dispatch);
                toast.success(res.errMessage);
                navigate(config.routes.home);
            }
        } else {
            setLoadingSubmit(false);

            navigate(config.routes.customer_login);
        }
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <Link to={config.routes.home}>
                    <div className={cx('category')}>Trang chủ</div>
                </Link>
                <div className={cx('main-content')}>
                    <div className={cx('content-left')}>
                        <div className={cx('top-left')}>
                            <h1>Thông tin giỏ hàng</h1>
                            <span className={cx('trick')}>
                                Mẹo: nhấn nút <span className={cx('red')}>(-)</span> màu đỏ để xóa sản phẩm
                            </span>
                            {listProduct && listProduct.length > 0 ? (
                                listProduct.map((item, index) => {
                                    return (
                                        <>
                                            <div key={index} className={cx('product')}>
                                                <img src={item.image ? item.image : images.noImage} alt="" />
                                                <div className={cx('info')}>
                                                    <div className={cx('top-info')}>
                                                        {`${item.title} (${item.brand})`}
                                                    </div>
                                                    <span className={cx('line')}></span>
                                                    <div className={cx('body-info')}>
                                                        <p>{`${item.title} (${item.unit})`}</p>
                                                        <span className={cx('price')}>
                                                            <NumericFormat
                                                                className="currency"
                                                                type="text"
                                                                value={item.priceSale ? item.priceSale : item.price}
                                                                displayType="text"
                                                                thousandSeparator={true}
                                                                suffix={'đ'}
                                                            />
                                                        </span>
                                                        <div className={cx('action')}>
                                                            <button
                                                                onClick={() => handleDecrease(item.id)}
                                                                className={cx('button-decrease')}
                                                            >
                                                                <RemoveIcon />
                                                            </button>
                                                            <input value={item.quality} />
                                                            <button
                                                                onClick={() => handleIncrease(item.id)}
                                                                className={cx('button-increase')}
                                                            >
                                                                <AddIcon />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })
                            ) : (
                                <>
                                    <div className={cx('product')}></div>
                                </>
                            )}
                        </div>
                        <div className={cx('bottom-left')}>
                            <h1>Thông tin vận chuyển</h1>
                            <div className={cx('form')}>
                                <div className={cx('name')}>
                                    <input
                                        value={state.firstName}
                                        onChange={(e) => inputOnchange(e, 'firstName')}
                                        placeholder="Tên"
                                    />
                                    <input
                                        onChange={(e) => inputOnchange(e, 'lastName')}
                                        value={state.lastName}
                                        placeholder="Họ và tên lót"
                                    />
                                </div>
                                <div className={cx('sdt-mail')}>
                                    <input
                                        onChange={(e) => inputOnchange(e, 'phonenumber')}
                                        value={state.phonenumber}
                                        className={cx('sdt')}
                                        placeholder="Số điện thoại"
                                    />
                                    <input
                                        onChange={(e) => inputOnchange(e, 'email')}
                                        value={state.email}
                                        className={cx('email')}
                                        placeholder="Email nhận thông tin đơn hàng"
                                    />
                                </div>
                                <div className={cx('address')}>
                                    <input
                                        onChange={(e) => inputOnchange(e, 'address')}
                                        value={state.address}
                                        placeholder="Địa chỉ nhận hàng (ghi cụ thể số nhà, tên đường, thành phố!!!)"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('content-right')}>
                        <div className={cx('top-right')}>
                            <div className={cx('coupon')}>
                                <input
                                    value={coupon}
                                    onChange={(e) => handleOnchange(e)}
                                    placeholder="Nhập mã giảm giá (nếu có)"
                                />

                                <DiscountIcon className={cx('icon')} />
                                {loading === true && <span className={cx('wobbling-3')}></span>}

                                <button>Áp dụng</button>
                            </div>
                            {message && <span className={cx('message')}>{message}</span>}
                        </div>
                        <div className={cx('bottom-right')}>
                            <h1>Thông tin đơn hàng</h1>
                            <div className={cx('total')}>
                                <p>Tổng tiền hàng</p>
                                <span>
                                    <NumericFormat
                                        className="currency"
                                        type="text"
                                        value={handleTotal() > 0 ? handleTotal() : 0}
                                        displayType="text"
                                        thousandSeparator={true}
                                        suffix={'đ'}
                                    />
                                </span>
                            </div>
                            {couponResult && (
                                <div className={cx('total')}>
                                    <p>Phiếu giảm giá</p>
                                    <span>{`Phiếu giảm giá ${couponResult.value}%`}</span>
                                </div>
                            )}
                            <span className={cx('line')}></span>

                            <div className={cx('shipping')}>
                                <p>Phí vận chuyển (GHTK)</p>
                                <span>0đ</span>
                            </div>
                            <span className={cx('line-t')}></span>
                            {showMessage === true ? (
                                <div className={cx('pay')}>
                                    <p>Tổng thanh toán</p>
                                    <span className={cx('red')}>
                                        <span>
                                            <NumericFormat
                                                className="currency"
                                                type="text"
                                                value={
                                                    handleTotal() > 0
                                                        ? handleTotal() * ((100 - couponResult.value) / 100)
                                                        : 0
                                                }
                                                displayType="text"
                                                thousandSeparator={true}
                                                suffix={'đ'}
                                            />
                                        </span>
                                    </span>
                                    <span className={cx('price-old')}>
                                        <NumericFormat
                                            className="currency"
                                            type="text"
                                            value={handleTotal() > 0 ? handleTotal() : 0}
                                            displayType="text"
                                            thousandSeparator={true}
                                            suffix={'đ'}
                                        />
                                    </span>
                                </div>
                            ) : (
                                <div className={cx('pay')}>
                                    <p>Tổng thanh toán</p>

                                    <span className={cx('red')}>
                                        <NumericFormat
                                            className="currency"
                                            type="text"
                                            value={handleTotal() > 0 ? handleTotal() : 0}
                                            displayType="text"
                                            thousandSeparator={true}
                                            suffix={'đ'}
                                        />
                                    </span>
                                </div>
                            )}
                            <textarea
                                onChange={(e) => inputOnchange(e, 'note')}
                                value={state.note}
                                placeholder="Ghi chú đơn hàng"
                            />
                            <div className={cx('button')}>
                                <button onClick={() => handleSubmit()}>
                                    {loadingSubmit === true ? <div className={cx('spinner-3')}></div> : 'đặt mua'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CheckOut;
