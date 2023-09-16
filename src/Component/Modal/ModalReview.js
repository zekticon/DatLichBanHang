import Modal from 'react-modal';
import { toast } from 'react-toastify';

import './ModalReview.scss';
import { useState } from 'react';
import { handleSubmitReview } from '~/services';

const customStyles = {
    content: {
        height: 'fit-content',
        width: 'fit-content',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

function ModalReviews({ isOpen, FuncToggleModal, data }) {
    console.log('check data', data);
    let subtitle;

    const afterOpenModal = () => {
        subtitle.style.color = '#f00';
    };

    let [chooseStar, setChooseStar] = useState(0);
    let [title, setTitle] = useState('');
    let [description, setDescription] = useState('');

    const submit = async () => {
        if (!title || !description || chooseStar === 0) {
            return toast.warning('Vui lòng nhập đủ thông tin bên dưới!');
        }

        const res = await handleSubmitReview({
            user_id: data.user_id,
            product_id: data.product_id,
            rate: chooseStar,
            title: title,
            description: description,
        });
        if (res.errCode === 0) {
            toast.success(res.errMessage);
            FuncToggleModal();
        } else {
            toast.error(res.errMessage);
        }
    };

    return (
        <>
            <div>
                <Modal
                    isOpen={isOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={FuncToggleModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <div className="wrapper-review w-[700px] h-fit flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <p className="text-[#8d919d] text-[14px]">
                                Hãy chia sẻ nhận xét của quý khách về sản phẩm là nguồn chia sẻ thông tin thiết thực đến
                                cộng đồng bác sĩ nha khoa
                            </p>
                            <button
                                onClick={() => FuncToggleModal()}
                                className="rounded-lg px-5 py-2 text-white font-medium bg-[#216DAA] hover:bg-[#188aeb]"
                            >
                                Đóng
                            </button>
                        </div>
                        <div className="flex flex-col gap-3 items-start justify-center my-0 mx-auto">
                            <p>1. Đánh giá của bạn về sản phẩm này:</p>
                            <div className="star-rating">
                                <input type="radio" id="5-stars" name="rating" value="5" />
                                <label for="5-stars" className="star cursor-pointer" onClick={() => setChooseStar(5)}>
                                    &#9733;
                                </label>
                                <input
                                    type="radio"
                                    id="4-stars"
                                    name="rating"
                                    value="4"
                                    onClick={() => setChooseStar(4)}
                                />
                                <label for="4-stars" className="star">
                                    &#9733;
                                </label>
                                <input
                                    type="radio"
                                    id="3-stars"
                                    name="rating"
                                    value="3"
                                    onClick={() => setChooseStar(3)}
                                />
                                <label for="3-stars" className="star">
                                    &#9733;
                                </label>
                                <input
                                    type="radio"
                                    id="2-stars"
                                    name="rating"
                                    value="2"
                                    onClick={() => setChooseStar(2)}
                                />
                                <label for="2-stars" className="star">
                                    &#9733;
                                </label>
                                <input
                                    type="radio"
                                    id="1-star"
                                    name="rating"
                                    value="1"
                                    onClick={() => setChooseStar(1)}
                                />
                                <label for="1-star" className="star">
                                    &#9733;
                                </label>
                            </div>
                            <p>2. Tiêu đề nhận xét:</p>
                            <input
                                className="border rounded-lg bg-[#f3f4f5] w-[548px]"
                                type="text"
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Nhập tiêu đề nhận xét"
                            />
                            <p>3. Viết nhận xét của bạn vào bên dưới:</p>
                            <textarea
                                className="border rounded-lg bg-[#f3f4f5] w-[548px] h-[113px] outline-none"
                                type="text"
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Nhận xét của bạn"
                            />
                            <div className="w-[548px] flex justify-end">
                                <button
                                    onClick={() => submit()}
                                    className="cursor-pointer rounded-lg px-3 py-1 text-white font-bold bg-[#216DAA] hover:bg-[#188aeb]"
                                >
                                    Gởi nhận xét
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
}

export default ModalReviews;
