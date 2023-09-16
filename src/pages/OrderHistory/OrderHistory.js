import StorefrontIcon from '@mui/icons-material/Storefront';
import images from '~/assets/images';
import { NumericFormat } from 'react-number-format';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllOrderOfUser } from '~/services';
import { useNavigate } from 'react-router-dom';
import './OrderHistory.scss';

function OrderHistory() {
    const currentUser = useSelector((state) => state.auth.loginCustomer?.currentCustomer?.user);
    const navigate = useNavigate();

    let [allProduct, setAllProduct] = useState([]);

    let [loading, setLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `Lịch Sử Đơn Hàng Của Bạn`;
        const fetchApi = async () => {
            setLoading(true);
            let res = await getAllOrderOfUser(currentUser.id);
            if (res && res.data && res.data.length > 0) {
                setLoading(false);

                setAllProduct(res.data);
            } else {
                setLoading(false);

                setAllProduct([]);
            }
        };

        fetchApi();
    }, []);

    const viewDetailProduct = (id) => {
        if (id === '#') return;
        navigate(`/product-detail/${id}`);
    };

    const handleViewOrderDetail = (data) =>{

    }

    return (
        <>
            <div className="flex flex-col h-fit gap-3 justify-around mt-6 mb-6">
                <h1 className="text-[#424242] mt-[95px] font-medium text-[22px]">Đơn hàng của tôi</h1>
                {loading === true ? (
                    <div className="continuous-list-order"></div>
                ) : (
                    <>
                        {allProduct && allProduct.length > 0 ? (
                            allProduct.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-3 h-full bg-white px-2 py-2 rounded-lg"
                                    >
                                        <div className="flex items-center justify-between px-4">
                                            <div className="flex items-center">
                                                <StorefrontIcon /> <span>{`Mã đơn hàng: ${item.order_number}`}</span>
                                            </div>
                                            <div className="flex gap-3 items-center ">
                                                <span
                                                    onClick={() => console.log('checkkk', item)}
                                                    className="border border-sky-500 rounded-lg px-2 cursor-pointer hover:text-stone-400 hover:bg-red-200"
                                                >
                                                    Xem chi tiết đơn hàng
                                                </span>
                                                <span className="rounded-lg bg-gray-200 px-2 py-1">
                                                    {item.status === 'new'
                                                        ? 'Đơn hàng mới'
                                                        : item.status === 'process'
                                                        ? 'Đang chuẩn bị hàng'
                                                        : 'Vận chuyển'}
                                                </span>
                                            </div>
                                        </div>
                                        {item.ProductOrders.map((jitem, jindex) => {
                                            return (
                                                <div key={jindex}>
                                                    <span className="border-t "></span>
                                                    <div className="flex px-32 gap-3">
                                                        <img
                                                            onClick={() =>
                                                                viewDetailProduct(
                                                                    jitem.imageData ? jitem.imageData.id : '#',
                                                                )
                                                            }
                                                            className="w-[80px] h-[80px] rounded-xl cursor-pointer"
                                                            src={
                                                                jitem.imageData
                                                                    ? jitem.imageData.Images[0].photo
                                                                    : images.noImage
                                                            }
                                                            alt=""
                                                        />
                                                        <div className="flex items-start justify-between w-full">
                                                            <p
                                                                className="w-[400px] cursor-pointer hover:text-sky-700 hover:font-bold"
                                                                onClick={() =>
                                                                    viewDetailProduct(
                                                                        jitem.imageData ? jitem.imageData.id : '#',
                                                                    )
                                                                }
                                                            >
                                                                {jitem.imageData
                                                                    ? jitem.imageData.title
                                                                    : 'Sản phẩm đã bị xóa'}
                                                            </p>
                                                            <span className="">
                                                                <NumericFormat
                                                                    className="currency"
                                                                    type="text"
                                                                    value={
                                                                        jitem.imageData ? jitem.imageData.price : '0'
                                                                    }
                                                                    displayType="text"
                                                                    thousandSeparator={true}
                                                                    suffix={'đ'}
                                                                />
                                                            </span>

                                                            <span className="">{`Số lượng: ${jitem.quantity}`}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })
                        ) : (
                            <>
                                <div className="flex flex-col items-center justify-center gap-3 h-[200px] bg-white px-2 py-2 rounded-lg">
                                    <strong className="text-orange-700">BẠN CHƯA CÓ ĐƠN HÀNG NÀO GẦN ĐÂY^^</strong>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default OrderHistory;
