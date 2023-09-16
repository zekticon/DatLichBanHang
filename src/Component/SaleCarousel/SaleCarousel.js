import className from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

import styles from './SaleCarousel.module.scss';
import images from '~/assets/images';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { Link, useNavigate } from 'react-router-dom';
import { handleAverage, handleStarAverage } from '~/utils/Star';

const cx = className.bind(styles);

function SaleCarousel(data, sale) {
    const [allProduct, setAllProduct] = useState();
    useEffect(() => {
        if (data.sale === true) {
            if (data.data) {
                let productSale = data.data.filter((item) => {
                    return item.discount > 0;
                });
                setAllProduct(productSale);
            }
        } else {
            setAllProduct(data.data);
        }
    }, [data, sale]);
    return (
        <>
            <div className="border rounded-lg w-full flex flex-col py-1 px-2">
                {data.sale === true ? (
                    <h1 className="font-bold text-[20px] uppercase text-[#155383]">☘ siêu sale mỗi ngày ☘</h1>
                ) : (
                    <>
                        <h1 className="font-bold text-[20px] uppercase text-[#155383]">☘ các sản phẩm gợi ý ☘</h1>
                    </>
                )}
                <div className=" z-50 w-full flex justify-center" style={{ zIndex: 1 }}>
                    <div className=" w-full lg:w-4/5">
                        {/* Carousel for Small-Sized Screen */}
                        <CarouselProvider
                            className="relative block sm:hidden z-0"
                            naturalSlideWidth={100}
                            naturalSlideHeight={125}
                            totalSlides={1}
                            visibleSlides={2}
                            step={1}
                            infinite={true}
                        >
                            <div className="js-flickity flex justify-center items-center overflow-hidden">
                                <ButtonBack
                                    role="button"
                                    aria-label="slide backward"
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-full flex justify-center items-center bg-white border border-gray-300 hover:bg-gray-400 absolute z-30 left-0 ml-8 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer"
                                    id="prev"
                                >
                                    <svg
                                        width={8}
                                        height={14}
                                        viewBox="0 0 8 14"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M7 1L1 7L7 13"
                                            stroke="black"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </ButtonBack>
                                <Slider>
                                    {allProduct ? (
                                        allProduct.map((item, index) => {
                                            return (
                                                <Slide index={index}>
                                                    <Link to={`/product-detail/${item.id}`}>
                                                        <div className="flex flex-col z-0 h-[333px] py-[2px] cursor-pointer hover:shadow-lg hover:shadow-indigo-500/40 px-[4px] border rounded-lg sm:w-auto md:w-[191px]">
                                                            <div className=" relative w-full">
                                                                <img
                                                                    src={item.image ? item.image : images.product1}
                                                                    alt=""
                                                                    className="object-cover object-center border rounded-lg "
                                                                />
                                                                {item.discount > 0 ? (
                                                                    <div className="absolute top-0 left-0 text-[12px] text-[#fff] py-[1px] px-2 border rounded-lg bg-[#e02220]">{`-${item.discount}%`}</div>
                                                                ) : (
                                                                    <div
                                                                        style={{ display: 'none' }}
                                                                        className="absolute"
                                                                    >{`-${item.discount}%`}</div>
                                                                )}
                                                                <span className="absolute text-[12px] border rounded-lg bg-[#dbdada] bottom-0 left-0">
                                                                    {item.unit}
                                                                </span>
                                                            </div>

                                                            <div className="w-full">
                                                                <p className="h-[40px] w-full text-[#155383] text-[13px] font-medium overflow-hidden">
                                                                    {item.title}
                                                                </p>
                                                            </div>
                                                            <div className="flex gap-1 items-center">
                                                                <NumericFormat
                                                                    className="text-[14px] font-medium text-[#d50000]"
                                                                    type="text"
                                                                    value={item.price * ((100 - item.discount) / 100)}
                                                                    displayType="text"
                                                                    thousandSeparator={true}
                                                                    suffix={'đ'}
                                                                />
                                                                <NumericFormat
                                                                    className="text-[12px] font-normal line-through text-[#8d919d]"
                                                                    type="text"
                                                                    value={item.price}
                                                                    displayType="text"
                                                                    thousandSeparator={true}
                                                                    suffix={'đ'}
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[#fab313]">
                                                                    {handleStarAverage(handleAverage(item.reviews))}
                                                                </span>
                                                                <span className="text-[#8d919d] text-[10px]">
                                                                    {item.reviews && item.reviews.length > 0
                                                                        ? `(${item?.reviews.length})`
                                                                        : ''}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div className="text-[13px] text-[#8d919d]">
                                                                    {item.brand}
                                                                </div>
                                                                <div className="text-[13px] text-[#8d919d]">
                                                                    Đã bán: {item.sold ? item.sold : 0}
                                                                </div>
                                                            </div>
                                                            {item.reviews && item.reviews.length > 0 ? (
                                                                <></>
                                                            ) : (
                                                                <div className="flex gap-1 items-center h-[25px] text-ellipsis overflow-hidden bg-[#ffe2e2]">
                                                                    <CardGiftcardIcon className="text-[#d50000]" />
                                                                    <span className="text-[12px] text-[#d50000] pt-1 h-full w-full ">
                                                                        Mua 1 tặng Tay khoan nhanh đèn Led đuôi Coupling
                                                                        + Trâm máy - PROTAPER + Côn Protaper Gapadent
                                                                        (SL có hạn)
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Link>
                                                </Slide>
                                            );
                                        })
                                    ) : (
                                        <></>
                                    )}
                                </Slider>
                                <ButtonNext
                                    role="button"
                                    aria-label="slide forward"
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-full flex justify-center items-center bg-white border border-gray-300 hover:bg-gray-400 absolute z-30 right-0 mr-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                                    id="next"
                                >
                                    <svg
                                        width={8}
                                        height={14}
                                        viewBox="0 0 8 14"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M1 1L7 7L1 13"
                                            stroke="black"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </ButtonNext>
                            </div>
                        </CarouselProvider>

                        {/* Carousel for Medium and Large-Sized Screen */}
                        <CarouselProvider
                            className="relative hidden sm:block"
                            naturalSlideWidth={100}
                            isIntrinsicHeight={125}
                            totalSlides={2}
                            visibleSlides={1}
                            step={1}
                            infinite={true}
                            currentSlide={1}
                        >
                            <div className="js-flickity flex justify-center items-center">
                                <ButtonBack
                                    role="button"
                                    aria-label="slide backward"
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-full flex justify-center items-center bg-white border border-gray-300 hover:bg-gray-400 absolute z-30 left-0 ml-8 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer"
                                    id="prev"
                                >
                                    <svg
                                        width={8}
                                        height={14}
                                        viewBox="0 0 8 14"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M7 1L1 7L7 13"
                                            stroke="black"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </ButtonBack>
                                <Slider className="carousel__sliderLarge">
                                    {allProduct ? (
                                        allProduct.map((item, index) => {
                                            return (
                                                <Slide index={index}>
                                                    <Link to={`/product-detail/${item.id}`}>
                                                        <div className="flex flex-col h-fit py-[2px] cursor-pointer hover:shadow-lg hover:shadow-indigo-500/40 px-[4px] border rounded-lg sm:w-auto md:w-[191px]">
                                                            <div className=" relative w-full">
                                                                <img
                                                                    src={item.image ? item.image : images.product1}
                                                                    alt=""
                                                                    className="object-cover object-center border rounded-lg "
                                                                />
                                                                {item.discount > 0 ? (
                                                                    <div className="absolute top-0 left-0 text-[12px] text-[#fff] py-[1px] px-2 border rounded-lg bg-[#e02220]">{`-${item.discount}%`}</div>
                                                                ) : (
                                                                    <div
                                                                        style={{ display: 'none' }}
                                                                        className="absolute"
                                                                    >{`-${item.discount}%`}</div>
                                                                )}
                                                                <span className="absolute text-[12px] border rounded-lg bg-[#dbdada] bottom-0 left-0">
                                                                    {item.unit}
                                                                </span>
                                                            </div>

                                                            <div className="w-full">
                                                                <p className="h-[40px] w-full text-[#155383] text-[13px] font-medium overflow-hidden">
                                                                    {item.title}
                                                                </p>
                                                            </div>
                                                            <div className="flex gap-1 items-center">
                                                                <NumericFormat
                                                                    className="text-[14px] font-medium text-[#d50000]"
                                                                    type="text"
                                                                    value={item.price * ((100 - item.discount) / 100)}
                                                                    displayType="text"
                                                                    thousandSeparator={true}
                                                                    suffix={'đ'}
                                                                />
                                                                <NumericFormat
                                                                    className="text-[12px] font-normal line-through text-[#8d919d]"
                                                                    type="text"
                                                                    value={item.price}
                                                                    displayType="text"
                                                                    thousandSeparator={true}
                                                                    suffix={'đ'}
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[#fab313]">
                                                                    {handleStarAverage(handleAverage(item.reviews))}
                                                                </span>
                                                                <span className="text-[#8d919d] text-[10px]">
                                                                    {item.reviews && item.reviews.length > 0
                                                                        ? `(${item?.reviews.length})`
                                                                        : ''}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div className="text-[13px] text-[#8d919d]">
                                                                    {item.brand}
                                                                </div>
                                                                <div className="text-[13px] text-[#8d919d]">
                                                                    Đã bán: {item.sold ? item.sold : 0}
                                                                </div>
                                                            </div>
                                                            {item.reviews && item.reviews.length > 0 ? (
                                                                <></>
                                                            ) : (
                                                                <div className="flex gap-1 items-center h-[25px] text-ellipsis overflow-hidden bg-[#ffe2e2]">
                                                                    <CardGiftcardIcon className="text-[#d50000]" />
                                                                    <span className="text-[12px] text-[#d50000] pt-1 h-full w-full ">
                                                                        Mua 1 tặng Tay khoan nhanh đèn Led đuôi Coupling
                                                                        + Trâm máy - PROTAPER + Côn Protaper Gapadent
                                                                        (SL có hạn)
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Link>
                                                </Slide>
                                            );
                                        })
                                    ) : (
                                        <></>
                                    )}
                                </Slider>
                                <ButtonNext
                                    role="button"
                                    aria-label="slide forward"
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-full flex justify-center items-center bg-white border border-gray-300 hover:bg-gray-400 absolute z-30 right-0 mr-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                                    id="next"
                                >
                                    <svg
                                        width={8}
                                        height={14}
                                        viewBox="0 0 8 14"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M1 1L7 7L1 13"
                                            stroke="black"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </ButtonNext>
                            </div>
                        </CarouselProvider>
                    </div>

                    <style>
                        {`
                    .gallery-cell {
                        height: 386px;
                        padding-right:15px;
                    }
                    @media (min-width: 300px) and (max-width: 420px) {
                        .gallery-cell {
                            height: 286px !important;
                            
                        }
                    }
                    
                    @media (max-width: 640px) {
                        .gallery-cell {
                            padding-right:0;
                        }
                    }

                    .carousel__sliderLarge {
                        padding-left: 20%;
                        padding-right: 20%;
                    }

                    /* gives us the illusion of spaces between the slides */
                    .carousel__inner-slideLarge {
                        width: calc(100% - 20px);
                        height: calc(100% - 20px);
                        left: 10px;
                        top: 10px;
                        
                    }
                `}
                    </style>
                </div>
            </div>
        </>
    );
}
export default SaleCarousel;
