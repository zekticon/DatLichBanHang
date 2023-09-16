import className from 'classnames/bind';
import 'tippy.js/dist/tippy.css';
import HeadlessTippy from '@tippyjs/react/headless';
import { NumericFormat } from 'react-number-format';
import { toast } from 'react-toastify';

import SearchIcon from '@mui/icons-material/Search';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Person4Icon from '@mui/icons-material/Person4';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import styles from './Header.module.scss';
import images from '~/assets/images';
import { Wrapper as PopperWrapper } from '~/Component/Popper';

import config from '~/config';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '~/hooks';
import { searchProduct } from '~/redux/apiReques';
import { useDispatch, useSelector } from 'react-redux';
import Tippy from '@tippyjs/react/headless';
import { addProductToCart, addProductToCartRedux, deleteCartRedux, logoutCustomer } from '~/redux/requestApp';
import { getAllGiftActive } from '~/services';

const cx = className.bind(styles);

function Header() {
    const productCart = useSelector((state) => state.cartRedux.cart?.arrCart);
    const currentUser = useSelector((state) => state.auth.loginCustomer?.currentCustomer?.user);

    let [listProduct, setListProduct] = useState([]);
    const [gifts, setGifts] = useState([]);

    let [render, setRender] = useState(0);

    useEffect(() => {
        fetchGifts();
        if (productCart) {
            setListProduct(productCart);
        } else {
            setListProduct(productCart);
            setRender(render++);
        }
    }, [productCart]);

    const fetchGifts = async () => {
        let gift = await getAllGiftActive();
        if (gift && gift.length > 0) {
            setGifts(gift.data);
        } else {
            setGifts(gift.data);
        }
    };

    const [searchValue, setSearchValue] = useState('');
    const [showResult, setShowResult] = useState(true);

    let [loading, setLoading] = useState('');
    let [searchResult, setSearchResult] = useState([]);

    const inputRef = useRef();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const debounced = useDebounce(searchValue, 700);

    useEffect(() => {
        if (!debounced.trim()) {
            return;
        }

        const fetchApi = async () => {
            setLoading(true);

            const result = await searchProduct(dispatch, debounced);
            setSearchResult(result);
            setShowResult(true);
            setLoading(false);
        };

        fetchApi();
    }, [debounced, searchValue]);

    const handleOnchange = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        } else if (searchValue.startsWith('')) {
            console.log('searchValue');
            setSearchResult([]);
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
                dataCartSe.quantity = increase();
                let res = await addProductToCart(dataCartSe);
                console.log('check res', res);
                if (res.errCode === 1) {
                    toast.warning(res.errMessage);
                } else {
                    data.quality = increase();

                    if (item.discount > 0) {
                        const sumPriceSale = () => {
                            let sum = item.total;
                            sum += item.priceSale;

                            return sum;
                        };
                        data.total = sumPriceSale();
                        console.log(item.total);
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
                    return item;
                }
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
                total: item.total,
                brand: item.brand,

                unit: item.unit,
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

    const handleHideResult = () => {
        setShowResult(false);
    };

    const handleTotal = () => {
        let arr = [];
        if (listProduct) {
            listProduct.forEach((item) => {
                arr.push(item.total);
            });
            if (arr.length > 0) {
                return arr.reduce((a, b) => {
                    return a + b;
                });
            }
        }
    };

    const handleCheckOut = () => {
        navigate(config.routes.check_out);
    };
    const viewDetailProduct = (id) => {
        navigate(`/product-detail/${id}`);
    };

    const handleLogout = async () => {
        let res = await logoutCustomer(dispatch);

        if (res && res.errCode === 0) {
            await deleteCartRedux(dispatch);

            navigate(config.routes.home);
        }
    };

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('left')}>
                    <Link to={config.routes.home}>
                        <div className={cx('logo')}>
                            <img src={images.logo} alt="" />
                        </div>
                    </Link>
                </div>
                <div className={cx('cat')}>
                    <MenuOpenIcon className={cx('iconMenu')} />
                </div>
                <div className={cx('right')}>
                    <div className={cx('top')}>
                        <ul>
                            <li>Hotline: 1900 633 639</li>
                            <li>
                                <Link to={config.routes.order_history}>Lịch sử mua hàng</Link>
                            </li>
                            {currentUser ? (
                                <Tippy
                                    arrow
                                    interactive
                                    delay={300}
                                    render={(attrs) => (
                                        <div className={cx('loyalty-dropdown')} tabIndex="-1" {...attrs}>
                                            <PopperWrapper className="hover:bg-[#7590a6] ">
                                                <p
                                                    onClick={() => handleLogout()}
                                                    className="cursor-pointer text-black hover:text-gray-300 px-2 pb-[0.75rem] pt-0"
                                                >
                                                    Đăng xuất
                                                </p>
                                            </PopperWrapper>
                                        </div>
                                    )}
                                    onClickOutside={handleHideResult}
                                >
                                    <li className="cursor-pointer hover:text-[#ed780b]">{`Xin chào ${currentUser.firstName}`}</li>
                                </Tippy>
                            ) : (
                                <Link to={config.routes.customer_login}>
                                    <li>Đăng nhập</li>
                                </Link>
                            )}
                        </ul>
                    </div>
                    <div className={cx('bottom')}>
                        <HeadlessTippy
                            interactive
                            visible={showResult && searchResult.length > 0}
                            render={(attrs) => (
                                <div className={cx('search-result')} tabIndex="1" {...attrs}>
                                    <PopperWrapper>
                                        <h4 className={cx('key-search')}>Bạn đang tìm: {searchValue}</h4>
                                        {searchResult.map((result) => (
                                            <>
                                                <div
                                                    onClick={() => viewDetailProduct(result.id)}
                                                    className={cx('search-item')}
                                                >
                                                    <img src={result.photo ? result.photo : images.noImage} alt="" />
                                                    <span>{result.title}</span>
                                                </div>
                                                <div className={cx('line')}></div>
                                            </>
                                        ))}
                                    </PopperWrapper>
                                </div>
                            )}
                            onClickOutside={handleHideResult}
                        >
                            <div className={cx('search')}>
                                <SearchIcon className={cx('icon-search')} />
                                <input
                                    ref={inputRef}
                                    value={searchValue}
                                    onChange={(e) => {
                                        handleOnchange(e);
                                    }}
                                    placeholder="Tìm gì cũng có, thử ngay! (gọi 1900.633.639)"
                                />
                                {loading ? (
                                    <div className={cx('spinner-3')}></div>
                                ) : (
                                    <div className={cx('spinner')}></div>
                                )}
                                <button>Tìm kiếm</button>
                            </div>
                        </HeadlessTippy>
                        <div className={cx('action')}>
                            <Tippy
                                arrow
                                interactive
                                delay={300}
                                render={(attrs) => (
                                    <div className={cx('loyalty-dropdown')} tabIndex="-1" {...attrs}>
                                        <PopperWrapper className={cx('popper-wrapper')}>
                                            <>hello</>
                                        </PopperWrapper>
                                    </div>
                                )}
                                onClickOutside={handleHideResult}
                            >
                                <div className={cx('loyalty')}>
                                    <Person4Icon className={cx('icon-loyalty')} />
                                    <div className={cx('item')}>
                                        <span className={cx('level')}>THƯỜNG</span>
                                        <span className={cx('point')}>0</span>
                                    </div>
                                </div>
                            </Tippy>

                            <Tippy
                                arrow
                                interactive
                                followCursor={true}
                                delay={300}
                                render={(attrs) => (
                                    <div className={cx('gift-dropdown')} tabIndex="-1" {...attrs}>
                                        <PopperWrapper className={cx('popper-wrapper')}>
                                            {gifts && gifts.length > 0 ? (
                                                gifts.map((item, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-start gap-3 px-2 cursor-pointer hover:bg-[#e7f3fd]"
                                                        >
                                                            <CheckCircleIcon className="text-[#78ca32]" />
                                                            <span className={cx('title')}>{item.title}</span>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <></>
                                            )}
                                        </PopperWrapper>
                                    </div>
                                )}
                                onClickOutside={handleHideResult}
                            >
                                <div className={cx('gift')}>
                                    <CardGiftcardIcon className={cx('gift-icon')} />
                                    <div className={cx('notifi')}>{gifts && gifts.length > 0 ? gifts.length : 0}</div>
                                </div>
                            </Tippy>
                            <Tippy
                                arrow
                                interactive
                                followCursor={true}
                                delay={300}
                                render={(attrs) => (
                                    <div className={cx('cart-dropdown')} tabIndex="-1" {...attrs}>
                                        <PopperWrapper>
                                            <div className={cx('container')}>
                                                <p className={cx('title')}>Sản Phẩm Mới Thêm</p>
                                                {listProduct &&
                                                    // listProduct.length > 0 &&
                                                    listProduct.map((item, index) => {
                                                        return (
                                                            <>
                                                                <div className={cx('product-item')}>
                                                                    <div className={cx('left')}>
                                                                        <img
                                                                            src={
                                                                                item.image ? item.image : images.noImage
                                                                            }
                                                                            alt=""
                                                                        />
                                                                        <div className={cx('name')}>
                                                                            <span className={cx('top-title')}>
                                                                                {item.title}
                                                                            </span>
                                                                            <span className={cx('price')}>
                                                                                <div className={cx('price-sale')}>
                                                                                    <NumericFormat
                                                                                        className="currency"
                                                                                        type="text"
                                                                                        value={item.priceSale}
                                                                                        displayType="text"
                                                                                        thousandSeparator={true}
                                                                                        suffix={'đ'}
                                                                                    />
                                                                                </div>
                                                                                <div className={cx('price-old')}>
                                                                                    <NumericFormat
                                                                                        className="currency"
                                                                                        type="text"
                                                                                        value={item.price}
                                                                                        displayType="text"
                                                                                        thousandSeparator={true}
                                                                                        suffix={'đ'}
                                                                                    />
                                                                                </div>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className={cx('right-count')}>
                                                                        <div className={cx('quality-product')}>
                                                                            <button
                                                                                onClick={() => handleDecrease(item.id)}
                                                                            >
                                                                                <RemoveIcon />
                                                                            </button>
                                                                            <input
                                                                                className="text-black"
                                                                                value={item.quality}
                                                                                readOnly
                                                                            />

                                                                            <button
                                                                                onClick={() => handleIncrease(item.id)}
                                                                            >
                                                                                <AddIcon />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        );
                                                    })}

                                                <div className={cx('total')}>
                                                    <div className={cx('total-left')}>
                                                        <div className={cx('wrapper-price')}>
                                                            <p>Tổng tiền: </p>
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
                                                        <div className={cx('count-product')}>
                                                            <p className={cx('title-count')}>Sản phẩm: </p>
                                                            <span className={cx('count')}>
                                                                {listProduct && listProduct.length > 0
                                                                    ? listProduct.length
                                                                    : 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={cx('button-right')}>
                                                        <button onClick={() => handleCheckOut()}>Đặt hàng</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </PopperWrapper>
                                    </div>
                                )}
                                onClickOutside={handleHideResult}
                            >
                                <div onClick={() => navigate(config.routes.check_out)} className={cx('cart')}>
                                    <ShoppingCartIcon className={cx('cart-icon')} />
                                    <div className={cx('notifi')}>
                                        {listProduct && listProduct.length > 0 ? listProduct.length : 0}
                                    </div>
                                    <div className={cx('pulsing-2')}></div>
                                </div>
                            </Tippy>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
