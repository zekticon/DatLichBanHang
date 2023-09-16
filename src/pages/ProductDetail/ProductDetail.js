import className from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import 'tippy.js/dist/tippy.css';
import 'react-image-gallery/styles/scss/image-gallery.scss';

import images from '~/assets/images';

import styles from './ProductDetail.module.scss';
import ImageGallery from 'react-image-gallery';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SaleCarousel from '~/Component/SaleCarousel/SaleCarousel';
import TabsStyle from '~/Component/TabsStyle/TabsStyle';
import { useDispatch, useSelector } from 'react-redux';
import { getAllGiftActive, getProductInfo } from '~/services';
import { getAllProductLittleInfo } from '~/redux/apiReques';
import { addProductToCart, addProductToCartRedux } from '~/redux/requestApp';
import { toast } from 'react-toastify';
import config from '~/config';
import ModalReviews from '~/Component/Modal/ModalReview';
import { handleAverage, handleStarAverage } from '~/utils/Star';
import routes from '~/config/routes';
const cx = className.bind(styles);

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function ProductDetail() {
    const cartRedux = useSelector((state) => state.cartRedux.cart?.arrCart);
    const currentUser = useSelector((state) => state.auth.loginCustomer?.currentCustomer?.user);

    const navigate = useNavigate();

    let [isOpen, setIsOpen] = useState(false);

    const dispatch = useDispatch();
    const { id } = useParams();
    const idProduct = parseInt(id);

    let [arrCart, setArrCart] = useState([]);
    let [imageProduct, setImageProduct] = useState([]);
    let [quality, setQuality] = useState(0);
    let [loading, setLoading] = useState(false);
    let [loadingAddCart, setLoadingAddCart] = useState(false);

    const [state, setState] = useState({
        title: '',
        rate: 4,
        sold: 0,
        unit: '',
        price: 0,
        priceSale: 0,
        discount: 0,

        category: '',
        category_id: 0,
        allReviews: [],
        brand: '',
        brand_id: 0,
    });
    const [stateHtml, setStateHtml] = useState({
        description: '',
        assign: '',
        feature: '',
        specification: '',
    });
    let [total, setTotal] = useState(0);
    const [allProduct, setAllProduct] = useState();
    const [comment, setComment] = useState([]);
    const [gifts, setGifts] = useState([]);
    let [productCart, setProductCart] = useState([]);

    const handleAveragedRate = (arr) => {
        if (arr && arr.length > 0) {
            let a = arr.reduce((acc, item) => {
                return acc + item;
            });

            return a / 5;
        }
    };

    useEffect(() => {
        fetchApiProduct();
    }, []);
    async function fetchApiProduct() {
        window.scrollTo(0, 0);
        setLoading(true);

        let res = await getProductInfo(id);
        document.title = `${res.data.dataProduct.title} | Sàn Nha Khoa Lớn Nhất VN`;
        let gift = await getAllGiftActive();

        let dataProduct = res.data.dataProduct;

        let arrReviews = [];

        if (dataProduct.Reviews && dataProduct.Reviews.length > 0) {
            dataProduct.Reviews.forEach((item) => {
                arrReviews.push(item.rate);

                return arrReviews;
            });
        }
        setLoading(false);

        if (dataProduct.Images) {
            let arr = [];

            dataProduct.Images.map((item) => {
                let obj = {};
                obj.original = item.photo;
                obj.thumbnail = item.photo;

                arr.push(obj);
                setImageProduct(arr);
            });
        }
        if (gift && gift.length > 0) {
            setGifts(gift.data);
        } else {
            setGifts(gift.data);
        }
        setComment(dataProduct.Reviews);
        setState({
            ...state,
            title: dataProduct.title,
            rate: handleAveragedRate(arrReviews),
            allReviews: dataProduct.Reviews,
            brand: dataProduct.Brand.title,
            sold: dataProduct.sold,
            price: dataProduct.price,
            priceSale: dataProduct.price * ((100 - dataProduct.discount) / 100),
            unit: dataProduct.unit_of_product,
            discount: dataProduct.discount,
            type: dataProduct.type,
        });
        setStateHtml({
            description: dataProduct.Markdown.descriptionHtml,
            assign: dataProduct.Markdown.assignHtml,
            feature: dataProduct.Markdown.featureHtml,
            specification: dataProduct.Markdown.specificationHtml,
        });
    }

    useEffect(() => {
        setArrCart(cartRedux);
    }, [cartRedux]);

    useEffect(() => {
        if (productCart.length > 0) {
            const fetchRedux = async () => {
                let res = await addProductToCartRedux(dispatch, productCart);
            };
            fetchRedux();
        }
    }, [productCart]);

    useEffect(() => {
        async function fetchApi() {
            let res = await getAllProductLittleInfo(dispatch);

            setAllProduct(res);
        }
        fetchApi();
    }, []);

    const handleIncrease = () => {
        setQuality((quality) => (quality += 1));
        if (state.discount > 0) {
            setTotal((priceSale) => (priceSale += state.priceSale));
        } else {
            setTotal((price) => (price += state.price));
        }
    };

    const handleDecrease = () => {
        if (quality < 1) return;
        setQuality((quality) => (quality -= 1));

        if (state.discount > 0) {
            setTotal((priceSale) => (priceSale -= state.priceSale));
        } else {
            setTotal((price) => (price -= state.price));
        }
    };

    const dataTabs = {
        Html: stateHtml,
        title: state.title,
        brand: state.brand,
        type: state.type,
        unit: state.unit,
    };

    const handleAddProductToCart = async () => {
        if (quality === 0) return toast.error('Vui lòng chọn số lượng');
        setLoadingAddCart(true);

        if (currentUser) {
            let data = {
                id: idProduct,
                title: state.title,
                quality: quality,
                unit: state.unit,
                brand: state.brand,
                total: total,
                discount: state.discount,
                price: state.price,
                priceSale: state.priceSale,
                image: imageProduct[0].original,
                writable: true,
            };

            let itemData = {
                user_id: currentUser.id,
                product_id: idProduct,
                quantity: quality,
            };

            let arr = [];

            let res = await addProductToCart(itemData);
            if (res.errCode === 1) {
                setLoadingAddCart(false);

                toast.warning(res.errMessage);
            } else {
                if (arrCart && arrCart.length > 0) {
                    setLoadingAddCart(false);

                    let arrItem = [...cartRedux];
                    const check = arrItem.find((item) => item.id === idProduct);
                    if (check) {
                        arrItem.forEach(async (item, index) => {
                            if (item.id === idProduct) {
                                arrItem[index] = data;
                                setProductCart(arrItem);
                                return;
                            }
                        });
                    } else if (check === undefined) {
                        arrItem.forEach(async (item, index) => {
                            if (item.id !== idProduct) {
                                setProductCart([...arrItem, data]);

                                return;
                            }
                        });
                    }

                    return;
                } else {
                    setLoadingAddCart(false);

                    arr.push(data);
                    if (res.errCode === 1) {
                        toast.warning(res.errMessage);
                    } else {
                        toast.success('Thêm sản phẩm vào giỏ hàng thành công !!!');

                        setProductCart(arr);
                    }
                }
            }
        } else {
            navigate(config.routes.customer_login);
        }
    };

    const loginCustomer = () => {
        navigate(config.routes.customer_login);
    };

    const OpenModal = () => {
        setIsOpen(true);
    };
    const toggleModal = () => {
        setIsOpen(!isOpen);
        fetchApiProduct();
    };

    const dataReview = {
        product_id: id,
        user_id: currentUser?.id,
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <Link to={config.routes.home}>
                    <div className={cx('category')}>Trang chủ</div>
                </Link>
                <div className={cx('product-main-content')}>
                    <div className={cx('content-left')}>
                        <div className={cx('product-image')}>
                            {loading === true ? (
                                <div className={cx('spinner-7')}></div>
                            ) : (
                                <ImageGallery items={imageProduct} />
                            )}
                        </div>
                    </div>
                    {loading === true && <div className={cx('continuous-1')}></div>}
                    {loading === false && (
                        <div className={cx('content-right')}>
                            <div className={cx('title')}>{`${state.title} - ${state.brand} - ${state.unit}`}</div>
                            <div className={cx('brand')}>
                                Xuất xứ:
                                <Link to={`/category/${id}`}>
                                    <span>{` ${state.brand} `}</span>
                                </Link>
                            </div>
                            <div className={cx('rate-all')}>
                                <div className={cx('rating')}>{handleStarAverage(handleAverage(comment))}</div>
                                <div className={cx('rate-number')}>{`${state.allReviews.length} đánh giá`}</div>
                                <span> | </span>
                                <div className={cx('sold')}>{`Đã bán ${state.sold ? state.sold : 0}`}</div>
                            </div>
                            <div className={cx('line')}></div>
                            <div className={cx('price-rate')}>
                                <div className={cx('price')}>
                                    <div className={cx('price-now')}>
                                        <NumericFormat
                                            className="currency"
                                            type="text"
                                            value={state.priceSale}
                                            displayType="text"
                                            thousandSeparator={true}
                                            suffix={'đ'}
                                        />
                                    </div>
                                    <div className={cx('price-old')}>
                                        <span className={cx('price-label')}>{`-${state.discount}%`}</span>
                                        <div className={cx('price-old-l')}>
                                            <NumericFormat
                                                className="currency"
                                                type="text"
                                                value={state.price}
                                                displayType="text"
                                                thousandSeparator={true}
                                                suffix={'đ'}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('rate')}>
                                    <span className={cx('title')}>Bạn thấy giá này?</span>
                                    <div className={cx('like')}>
                                        <ThumbUpOffAltIcon className={cx('icon-like')} />
                                        <span> Hợp lý</span>
                                    </div>
                                    <div className={cx('dislike')}>
                                        <ThumbDownOffAltIcon className={cx('icon-dislike')} />
                                        <span> Cao</span>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('line')}></div>
                            <div className={cx('wrapper-gift')}>
                                <div className={cx('gift')}>
                                    <LocalShippingIcon className={cx('icon')} />
                                    <span className={cx('title')}>Cho đơn hàng từ 2.000.000đ</span>
                                </div>
                                {gifts && gifts.length > 0 ? (
                                    gifts.map((item, index) => {
                                        return (
                                            <div key={index} className={cx('gift')}>
                                                <CheckCircleIcon className={cx('icon')} />
                                                <span className={cx('title')}>{item.title}</span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className={cx('table-price')}>
                                <div className={cx('table-wrapper')}>
                                    <div>
                                        <div className={cx('tr-title')}>
                                            <div className={cx('name-product')}>Tên sản phẩm</div>
                                            <div className={cx('unit-product')}>Đơn vị</div>
                                            <div className={cx('price-product')}>Giá</div>
                                            <div className={cx('quality-product')}>Số lượng</div>
                                        </div>
                                        <div className={cx('tr-value')}>
                                            <div className={cx('name-product')}>{state.title}</div>
                                            <div className={cx('unit-product')}>{state.unit}</div>
                                            <div className={cx('price-product')}>
                                                <NumericFormat
                                                    className="currency"
                                                    type="text"
                                                    value={state.priceSale}
                                                    displayType="text"
                                                    thousandSeparator={true}
                                                    suffix={'đ'}
                                                />
                                            </div>
                                            <div className={cx('quality-product')}>
                                                <button onClick={() => handleDecrease()}>
                                                    <RemoveIcon />
                                                </button>
                                                <input value={quality} />
                                                <button onClick={() => handleIncrease()}>
                                                    <AddIcon />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('price-total')}>
                                    <p>
                                        Tổng tiền:{' '}
                                        <span className={cx('total')}>
                                            {
                                                <NumericFormat
                                                    className="currency"
                                                    type="text"
                                                    value={total}
                                                    displayType="text"
                                                    thousandSeparator={true}
                                                    suffix={'đ'}
                                                />
                                            }
                                        </span>
                                    </p>
                                    <p>
                                        Số lượng: <span>{quality}</span>
                                    </p>

                                    <button onClick={() => handleAddProductToCart()}>
                                        {loadingAddCart === true ? (
                                            <div className={cx('spinner-3')}></div>
                                        ) : (
                                            <>
                                                <ShoppingCartIcon /> <span>thêm vào giỏ hàng</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <SaleCarousel data={allProduct} />
                <div className={cx('description')}>
                    <TabsStyle data={dataTabs} />
                </div>
                <ModalReviews data={dataReview} isOpen={isOpen} FuncToggleModal={() => toggleModal()} />
                <div className={cx('review')}>
                    <h1>ĐÁNH GIÁ NHA SĨ</h1>
                    <div className="flex  justify-center gap-5 h-[196px] w-full">
                        <div className="flex flex-col items-center justify-center h-full w-[200px]">
                            <p className="text-[#222222] text-[14px] font-medium">Đánh giá trung bình</p>
                            <div className="p-0 text-[#222222] text-[42px] font-bold">{`${handleAverage(
                                comment,
                            )}/5`}</div>
                            <span className="text-[#fab313] font-bold">
                                {handleStarAverage(handleAverage(comment))}
                            </span>
                            <p className="text-[#8d919d] text-[14px]">{`(${comment ? comment.length : 0} đánh giá)`}</p>
                        </div>
                        <div className="flex flex-col gap-3 items-center justify-center  h-full">
                            <p className="text-[#222222]">Chia sẻ nhận xét về sản phẩm</p>
                            {currentUser ? (
                                <button
                                    onClick={() => OpenModal()}
                                    className="rounded-lg px-3 py-1 text-white font-bold bg-[#216DAA] hover:bg-[#188aeb]"
                                >
                                    Viết nhận xét
                                </button>
                            ) : (
                                <button
                                    onClick={() => loginCustomer()}
                                    className="rounded-lg px-3 py-1 text-white font-bold bg-[#216DAA] hover:bg-[#188aeb]"
                                >
                                    Vui lòng đăng nhập!
                                </button>
                            )}
                        </div>
                    </div>
                    <div className={cx('wrapper')}>
                        {comment && comment.length > 0 ? (
                            <>
                                <div className={cx('content-top')}></div>
                                <div className={cx('content-bottom')}>
                                    {comment &&
                                        comment?.map((item, index) => {
                                            return (
                                                <>
                                                    <div key={index} className={cx('comment')}>
                                                        <div className={cx('left')}>
                                                            <img
                                                                src={
                                                                    item.User?.Image.photo
                                                                        ? item.User?.Image.photo
                                                                        : images.noImage
                                                                }
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className={cx('right')}>
                                                            <span>{`*** ${
                                                                item.User && item.User.firstName
                                                                    ? item.User.firstName
                                                                    : 'Vô danh'
                                                            } - ${item.title}`}</span>
                                                            <div className={cx('star')}>
                                                                {handleStarAverage(item.rate)}
                                                            </div>
                                                            <div className={cx('desc')}>{item.description}</div>
                                                            <div className={cx('line')}></div>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })}
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductDetail;
