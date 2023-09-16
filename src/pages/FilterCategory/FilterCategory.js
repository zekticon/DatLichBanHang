import className from 'classnames/bind';
import 'tippy.js/dist/tippy.css';
import 'react-image-gallery/styles/scss/image-gallery.scss';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { NumericFormat } from 'react-number-format';

import images from '~/assets/images';

import styles from './FilterCategory.module.scss';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { getAllBrandFilter, getAllParentCategory, getProductFilter } from '~/services';
import { getListParentCategory } from '~/redux/apiReques';
const cx = className.bind(styles);

const rangePriceArr = [
    {
        id: 1,
        priceA: 0,
        priceB: 419999,
    },
    {
        id: 2,
        priceA: 420000,
        priceB: 3199999,
    },
    {
        id: 3,
        priceA: 3200000,
        priceB: 8352999,
    },
    {
        id: 4,
        priceA: 8353000,
        priceB: 39999999,
    },
];

function FilterCategory() {
    const dispatch = useDispatch();

    const { id } = useParams();

    let [toggleCategory, setToggleCategory] = useState(true);
    let [togglePrice, setTogglePrice] = useState(true);
    let [toggleBrand, setToggleBrand] = useState(true);
    let [loadMore, setLoadMore] = useState(false);
    let [loadPrice, setLoadPrice] = useState(false);
    let [selected, setSelected] = useState('trend');
    let [arrFilterCat, setArrFilterCat] = useState(null);
    let [arrFilterBrand, setArrFilterBrand] = useState(null);
    let [arrFilterPrice, setArrFilterPrice] = useState(null);

    let [listCategory, setListCategory] = useState([]);
    let [listBrand, setLisBrand] = useState([]);
    let [listProduct, setListProduct] = useState([]);
    let [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchApi = async () => {
            window.scrollTo(0, 0);
            document.title = `Mua online sản phẩm Hàng Việt Nam giá tốt & khuyến mãi hấp dẫn | Sàn Nha Khoa Lớn Nhất VN`;
            const res = await getListParentCategory(dispatch);
            const brands = await getAllBrandFilter();

            if (id) {
                let data = {};
                data.action = 'trend';
                data.id = +id;
                const products = await getProductFilter(data);
                if (products.errCode === 0) {
                    setListProduct(products.data);
                }
            }
            if (res.errCode === 0 && res.data.length > 0) {
                let catCurrent = res.data.find((item) => {
                    return item.id === +id;
                });
                setArrFilterCat(catCurrent);
                setListCategory(res.data);
                setLisBrand(brands.data);
            }
        };

        fetchApi();
    }, []);

    useEffect(() => {
        setLoading(true);
        let data = {};
        data.action = selected;
        data.id = arrFilterCat ? arrFilterCat.id : null;
        data.brand_id = arrFilterBrand ? arrFilterBrand.id : null;
        data.priceA = arrFilterPrice ? arrFilterPrice.priceA : null;
        data.priceB = arrFilterPrice ? arrFilterPrice.priceB : null;

        const fetchApi = async () => {
            const products = await getProductFilter(data);
            if (products && products.errCode === 0) {
                setLoading(false);
                if (products.data) {
                    setListProduct(products.data);
                } else {
                    setListProduct([]);
                }
                setListProduct(products.data);
            } else {
                setLoading(false);

                setListProduct([]);
            }
        };
        fetchApi();
    }, [arrFilterCat, arrFilterPrice, arrFilterBrand, selected]);

    const chooseCategory = (item, id) => {
        if (id === 'cat') {
            if (arrFilterCat && arrFilterCat.id === item.id) {
                setArrFilterCat(null);
            } else {
                setArrFilterCat(item);
            }
        } else if (id === 'price') {
            if (arrFilterPrice && arrFilterPrice.priceA === item.priceA) {
                setArrFilterPrice(null);
            } else {
                setArrFilterPrice(item);
            }
        } else {
            if (arrFilterBrand && arrFilterBrand.title === item.title) {
                setArrFilterBrand(null);
            } else {
                setArrFilterBrand(item);
            }
        }
    };
    const navigate = useNavigate();
    const viewDetailProduct = (id) => {
        navigate(`/product-detail/${id}`);
    };

    const handleDelete = () => {
        setArrFilterCat(null);
        setArrFilterPrice(null);
        setArrFilterBrand(null);
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <Link to="#">
                    <div className={cx('category')}>Trang chủ</div>
                </Link>
                <div className={cx('wrapper-content')}>
                    <div className={cx('sidebar')}>
                        <div className={cx('filter')}>
                            <div className={cx('top')}>
                                <h3>Bộ lọc</h3>
                                <button onClick={() => handleDelete()}>Xóa hết</button>
                            </div>
                            {arrFilterCat && (
                                <div onClick={() => setArrFilterCat(null)} className={cx('selectedCate')}>
                                    <p>
                                        {`${arrFilterCat.title} `} <span>x</span>
                                    </p>
                                </div>
                            )}
                            {arrFilterBrand && (
                                <div onClick={() => setArrFilterBrand(null)} className={cx('selectedCate')}>
                                    <p>
                                        {`${arrFilterBrand.title} `} <span>x</span>
                                    </p>
                                </div>
                            )}
                            {arrFilterPrice && (
                                <div onClick={() => setArrFilterPrice(null)} className={cx('selectedCate')}>
                                    <div className={cx('filter-price')}>
                                        <NumericFormat
                                            className="currency"
                                            type="text"
                                            value={arrFilterPrice.priceA}
                                            displayType="text"
                                            thousandSeparator={true}
                                            suffix={'đ'}
                                        />{' '}
                                        -
                                        <NumericFormat
                                            className="currency"
                                            type="text"
                                            value={arrFilterPrice.priceB}
                                            displayType="text"
                                            thousandSeparator={true}
                                            suffix={'đ'}
                                        />{' '}
                                        <div className={cx('x')}>x</div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <span className={cx('line')}></span>
                        <div className={cx('wrapper-list-category')}>
                            <div onClick={() => setToggleCategory(!toggleCategory)} className={cx('btn-category')}>
                                <span>Danh mục</span>
                                <span>{toggleCategory === true ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</span>
                            </div>
                            {toggleCategory === true && (
                                <div className={cx('list-category')}>
                                    <div
                                        className={cx('item-category')}
                                        style={{
                                            overflow: loadMore === false ? 'hidden' : 'hidden',
                                            height: loadMore === false ? '126px' : 'fit-content',
                                        }}
                                    >
                                        {listCategory &&
                                            listCategory.length > 0 &&
                                            listCategory.map((item, index) => {
                                                return (
                                                    <>
                                                        <div key={index}>
                                                            <label className={cx('container')}>
                                                                <input
                                                                    onClick={() => chooseCategory(item, 'cat')}
                                                                    type="checkbox"
                                                                    readOnly
                                                                    checked={
                                                                        arrFilterCat?.id === item.id ? true : false
                                                                    }
                                                                />
                                                                <span className={cx('checkmark')}>{item.title}</span>
                                                            </label>
                                                        </div>
                                                    </>
                                                );
                                            })}

                                        <button
                                            onClick={() => {
                                                setLoadMore(!loadMore);
                                            }}
                                        >
                                            Thu gọn
                                            <span>
                                                {loadMore === true ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                            </span>
                                        </button>
                                    </div>
                                    <button
                                        style={{ display: loadMore === true ? 'none' : 'block' }}
                                        onClick={() => {
                                            setLoadMore(!loadMore);
                                        }}
                                    >
                                        Xem thêm
                                        <span>{loadMore === true ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        <span className={cx('line')}></span>
                        <div className={cx('wrapper-list-category')}>
                            <div onClick={() => setTogglePrice(!togglePrice)} className={cx('btn-category')}>
                                <span>Khoảng giá</span>
                                <span>{togglePrice === true ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</span>
                            </div>
                            {togglePrice === true && (
                                <div className={cx('list-category')}>
                                    <div
                                        className={cx('item-category')}
                                        style={{
                                            overflow: loadPrice === false ? 'hidden' : 'hidden',
                                            height: loadPrice === false ? '126px' : 'fit-content',
                                        }}
                                    >
                                        {rangePriceArr.map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <label className={cx('container')}>
                                                        <input
                                                            onClick={(e) => {
                                                                chooseCategory(item, 'price');
                                                            }}
                                                            checked={arrFilterPrice?.id === item.id}
                                                            type="checkbox"
                                                            readOnly
                                                        />
                                                        <span className={cx('checkmark')}>
                                                            <NumericFormat
                                                                className="currency"
                                                                type="text"
                                                                // value={item.price * ((100 - item.discount) / 100)}
                                                                value={item.priceA}
                                                                displayType="text"
                                                                thousandSeparator={true}
                                                                suffix={'đ'}
                                                            />{' '}
                                                            -{' '}
                                                            <NumericFormat
                                                                className="currency"
                                                                type="text"
                                                                // value={item.price * ((100 - item.discount) / 100)}
                                                                value={item.priceB}
                                                                displayType="text"
                                                                thousandSeparator={true}
                                                                suffix={'đ'}
                                                            />
                                                        </span>
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                        <span className={cx('line')}></span>
                        <div className={cx('wrapper-list-brand')}>
                            <div onClick={() => setToggleBrand(!toggleBrand)} className={cx('btn-brand')}>
                                <span>Thương hiệu</span>
                                <span>{toggleBrand === true ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</span>
                            </div>
                            {toggleBrand === true && (
                                <div className={cx('list-brand')}>
                                    <div className={cx('item')}>
                                        {listBrand &&
                                            listBrand.length > 0 &&
                                            listBrand.map((item, index) => {
                                                return (
                                                    <div key={index}>
                                                        <img
                                                            onClick={() => chooseCategory(item, 'brand')}
                                                            src={item.Image?.photo ? item.Image.photo : images.noImage}
                                                            alt=""
                                                        />
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={cx('content')}>
                        <div className={cx('header-list')}>
                            <div className={cx('top')}>
                                <p>Nha khoa tổng quát</p>
                                <span>{`(${listProduct ? listProduct.length : 0} trên ${
                                    listProduct ? listProduct.length : 0
                                } sản phẩm)`}</span>
                            </div>
                            <div className={cx('bottom')}>
                                <div className={cx('bot-left')}>
                                    <span className={cx('text')}>Sắp xếp theo: </span>
                                    <div className={cx('list-btn')}>
                                        <button
                                            onClick={() => setSelected('trend')}
                                            className={selected === 'trend' ? cx('btn-active') : ''}
                                        >
                                            Phổ biến
                                        </button>
                                        <button
                                            onClick={() => setSelected('sold')}
                                            className={selected === 'sold' ? cx('btn-active') : ''}
                                        >
                                            Bán chạy
                                        </button>
                                        <button
                                            onClick={() => setSelected('discount')}
                                            className={selected === 'discount' ? cx('btn-active') : ''}
                                        >
                                            Giảm giá nhiều
                                        </button>
                                        <button
                                            onClick={() => setSelected('priceLow')}
                                            className={selected === 'priceLow' ? cx('btn-active') : ''}
                                        >
                                            Giá thấp
                                        </button>
                                        <button
                                            onClick={() => setSelected('priceHigh')}
                                            className={selected === 'priceHigh' ? cx('btn-active') : ''}
                                        >
                                            Giá cao
                                        </button>
                                    </div>
                                </div>

                                <span className={cx('number-page')}>1/1</span>
                            </div>
                        </div>
                        {loading === true ? (
                            <div className={cx('wrapper-loading')}>
                                <div className={cx('wobbling-4')}></div>
                            </div>
                        ) : (
                            <div className={cx('main-content')}>
                                {!listProduct && loading === false && (
                                    <div className={cx('no-product')}>Không có sản phẩm</div>
                                )}
                                {/* {listProduct?.length === 0 && <div className={cx('no-product')}>Không có sản phẩm</div>} */}
                                {listProduct &&
                                    listProduct.length > 0 &&
                                    listProduct.map((item, index) => {
                                        return (
                                            <div key={index} onClick={() => viewDetailProduct(item.id)}>
                                                <div className={cx('wrapper')}>
                                                    <div className={cx('top')}>
                                                        <img
                                                            src={
                                                                item.Images[0].photo
                                                                    ? item.Images[0].photo
                                                                    : images.product1
                                                            }
                                                            alt=""
                                                        />

                                                        {item.discount > 0 ? (
                                                            <div className={cx('sale')}>{`-${item.discount}%`}</div>
                                                        ) : (
                                                            <div
                                                                style={{ display: 'none' }}
                                                                className={cx('sale')}
                                                            >{`-${item.discount}%`}</div>
                                                        )}
                                                        <span className={cx('unit')}>bộ</span>
                                                        <div className={cx('event')}>
                                                            <img src={images.eventsale} alt="" />
                                                        </div>
                                                    </div>

                                                    <div className={cx('bottom')}>
                                                        <p>{item.title}</p>
                                                        <div className={cx('wrapper-price')}>
                                                            <div className={cx('price')}>
                                                                <NumericFormat
                                                                    className="currency"
                                                                    type="text"
                                                                    value={item.price * ((100 - item.discount) / 100)}
                                                                    displayType="text"
                                                                    thousandSeparator={true}
                                                                    suffix={'đ'}
                                                                />
                                                            </div>
                                                            <div className={cx('old-price')}>
                                                                <NumericFormat
                                                                    className="currency"
                                                                    type="text"
                                                                    value={item.price}
                                                                    displayType="text"
                                                                    thousandSeparator={true}
                                                                    suffix={'đ'}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className={cx('wrapper-brand')}>
                                                            <div className={cx('brand')}>{item?.Brand.title}</div>
                                                            <div className={cx('sold')}>
                                                                Đã bán: {item.sold ? item.sold : 0}
                                                            </div>
                                                        </div>
                                                        <div className={cx('gift')}>
                                                            <CardGiftcardIcon className={cx('icon')} />
                                                            <span>
                                                                Mua 1 tặng Tay khoan nhanh đèn Led đuôi Coupling + Trâm
                                                                máy - PROTAPER + Côn Protaper Gapadent (SL có hạn)
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* </div> */}
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default FilterCategory;
