import React, { useEffect } from 'react';
import className from 'classnames/bind';
import styles from '../../DefaultLayout/DefaultLayout.module.scss';
import './HeaderCustomer.scss';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import images from '~/assets/images';
import { getAllProductLittleInfo, getListParentCategory } from '~/redux/apiReques';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SaleCarousel from '~/Component/SaleCarousel/SaleCarousel';
import Footer from '../Footer/Footer';
import Header from '../Header';
import CategoryFeature from '~/Component/CategoryFeature/CategoryFeature';
import ListProduct from '~/Component/ListProduct/ListProduct';
import config from '~/config';
import { getAllBanner } from '~/services';

const cx = className.bind(styles);

function HeaderCustomer() {
    let [listParent, setListParent] = useState();
    let [bannerFour, setBannerFour] = useState([]);
    let [mainBanner, setMainBanners] = useState('');
    let [bannerLong, setBannerLong] = useState('');

    let [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const navigate = useNavigate();
    const [allProduct, setAllProduct] = useState();
    useEffect(() => {
        fetchBanner();
    }, []);
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `Nhà Cung Cấp Thiết Bị Vật Liệu Phòng Khám Nha Khoa Giá Sỉ, Rẻ Hcm`;

        async function fetchApi() {
            let res = await getListParentCategory(dispatch);

            let sss = await getAllProductLittleInfo(dispatch);
            setAllProduct(sss);

            setListParent(res.errCode === 0 && res.data && res.data.length > 0 ? res.data : []);
            console.log('check ', res);
        }
        fetchApi();
    }, []);

    const fetchBanner = async () => {
        setLoading(true);
        const res = await getAllBanner();
        if (res.data && res.data.length > 0) {
            setLoading(false);

            setMainBanners(res.data[0].Image.photo);
            setBannerFour(
                res.data.filter((item, index) => {
                    return index > 0 && index < 5;
                }),
            );
            setBannerLong(res.data[5].Image.photo);
        }
    };

    const viewCategory = (id) => {
        console.log(id);
        navigate(`/category/${id}`);
    };
    const viewListDoctor = () => {
        navigate(config.routes.list_doctor);
    };

    return (
        <>
            {/* <div className={cx('wrapper')}> */}

            <Header />
            {/* </div> */}
            <div className="container flex flex-col gap-4 items-center pt-[76px]">
                <div className=" mx-auto h-fit grid grid-cols-12 gap-3 ">
                    <div className="hidden px-8 rounded-lg flex-initial col-span-12 sm:h-[200px] md:h-fit md:overflow-auto md:mt-5 md:block md:col-span-3 shadow-md md:px-1 lg:px-0">
                        {!listParent && <div className="continuous-3"></div>}
                        <aside className="flex flex-col sm:h-[202px] lg:h-[280px] lg:py-[3px] md:py-[3px] xl:h-full p-5  justify-around">
                            {listParent?.map((item, index) => {
                                return (
                                    <div
                                        className="flex justify-between md:-h[1px] md:py-0 items-center hover:bg-[#e7f3fd] cursor-pointer"
                                        onClick={() => viewCategory(item.id)}
                                    >
                                        <p className="sm:text-[10px] md:text-sm lg:text-xl text-[#216daa] ">
                                            {item.title}
                                        </p>
                                        <div>
                                            <KeyboardArrowRightIcon />
                                        </div>
                                    </div>
                                );
                            })}
                        </aside>
                    </div>
                    <div className="flex-initial col-span-12 py-4  md:col-span-5 ">
                        {mainBanner ? (
                            <img
                                className="bg-no-repeat rounded-lg"
                                src={mainBanner ? mainBanner : images.banner}
                                alt="images"
                            />
                        ) : (
                            <div className="continuous-2"></div>
                        )}
                    </div>
                    <div className="hidden  flex-initial col-span-12  md:col-span-4  md:grid md:grid-cols-2 gap-1">
                        {bannerFour && bannerFour.length === 4 ? (
                            bannerFour.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <img src={item.Image.photo} className="w-full" alt="" />
                                    </div>
                                );
                            })
                        ) : (
                            <>
                                <div className="continuous-1"></div>
                                <div className="continuous-1"></div>
                                <div className="continuous-1"></div>
                                <div className="continuous-1"></div>
                            </>
                        )}
                    </div>
                </div>
                <div className="h-fit w-full rounded-lg bg-[#aae5ff] gap-3 py-5 px-5 flex flex-col justify-around items-center">
                    <h1 className="uppercase font-bold">dịch vụ đặt lịch khám bệnh của hệ thống</h1>
                    <div className="flex gap-5 justify-around items-center">
                        <div className=" ">
                            <div className="flex flex-col gap-3 items-center justify-around">
                                <img src={images.schedules1} alt="" />
                                <h1 className="text-center">VẬT LIỆU CHẤT LƯỢNG</h1>
                                <p className=" hidden sm:block text-center">
                                    Các vật liệu tại phòng khám từ các nguồn uy tín
                                </p>
                            </div>
                        </div>
                        <div className="">
                            <div className="flex flex-col gap-3 items-center justify-around">
                                <img src={images.schedules2} alt="" />
                                <h1 className="text-center">PHÒNG KHÁM VƯỢT TRỘI</h1>
                                <p className=" hidden sm:block text-center">
                                    Thiết bị nha khoa theo chuẩn giấy phép Đầy đủ thiết bị, dụng cụ, vật liệu
                                </p>
                            </div>
                        </div>
                        <div className="">
                            <div className="flex flex-col gap-3 items-center justify-around">
                                <img src={images.schedules3} alt="" />
                                <h1 className="text-center">VẬT LIỆU CHẤT LƯỢNG</h1>
                                <p className="hidden sm:w- sm:block text-center">
                                    Các vật liệu tại phòng khám từ các nguồn uy tín
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => viewListDoctor()}
                        className="border text-white bg-[#216daa] rounded-lg py-3 px-5"
                    >
                        Đặt lịch khám ngay
                    </button>
                </div>

                <img className="w-full rounded-lg" src={bannerLong ? bannerLong : images.bannerSale} alt="" />

                <div className="w-full flex gap-3 justify-between">
                    <div className="flex-1">
                        <img className="w-full rounded-lg" src={images.bannerSale4} alt="" />
                    </div>
                    <div className="flex-1">
                        <img className="w-full rounded-lg" src={images.bannerSale5} alt="" />
                    </div>
                    <div className="flex-1">
                        <img className="w-full rounded-lg" src={images.bannerSale6} alt="" />
                    </div>
                </div>
                <div className=""></div>
                <SaleCarousel data={allProduct} sale={true} />
                <CategoryFeature />
                <ListProduct data={allProduct} />
            </div>

            <Footer />
        </>
    );
}

export default HeaderCustomer;
