import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import config from '~/config';
import LoginAdmin from './auth/adminLogin';
import List from './admin/pages/list/List';
import Single from './admin/pages/single/Single';
import New from './admin/pages/new/New';
import { ToastContainer } from 'react-toastify';
import { userInputs } from './formSource';
import LayoutAdmin from './layouts/LayoutAdmin';
import Brands from './admin/pages/brand/Brands';
import Category from './admin/pages/category/Category';
import Product from './admin/pages/product/Product';
import NewProduct from './admin/pages/newProduct/NewProduct';
import CustomerLogin from './auth/customerLogin/CustomerLogin';
import Home from './pages/Home';
import Dashboard from './admin/pages/home';
import { DefaultLayout } from './layouts';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import CheckOut from './pages/CheckOut/CheckOut';
import Order from './admin/pages/order/Order';
import OrderDetail from './admin/pages/orderDetail/OrderDetail';
import FilterCategory from './pages/FilterCategory/FilterCategory';
import HeaderCustomer from './layouts/component/HeaderCustomer/HeaderCustomer';
import ListDoctor from './pages/ListDoctor/ListDoctor';
import DoctorDetail from './admin/pages/doctor/DoctorDetail/DoctorDetail';
import ManageDoctor from './admin/pages/doctor/ManageDoctor/ManageDoctor';
import ManageSchedule from './admin/pages/doctor/ManageSchedule';
import VerifyEmail from './admin/pages/doctor/VerifyEmail';
import DoctorSchedule from './admin/pages/doctor/DoctorSchedule';
import ListScheduleDoctor from './admin/pages/listScheduleDoctor/ListScheduleDoctor';
import OrderHistory from './pages/OrderHistory/OrderHistory';
import Coupon from './admin/pages/coupon/Coupon';
import Banner from './admin/pages/banner/Banner';
import Gift from './admin/pages/gift/Gift';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path={config.routes.loginAdmin} element={<LoginAdmin />} />
                    <Route path={config.routes.dashboard}>
                        <Route
                            index
                            element={
                                <LayoutAdmin>
                                    <Dashboard />
                                </LayoutAdmin>
                            }
                        />
                        <Route path={config.routes.users}>
                            <Route
                                index
                                element={
                                    <LayoutAdmin>
                                        <List />
                                    </LayoutAdmin>
                                }
                            />
                            <Route
                                path={config.routes.single}
                                element={
                                    <LayoutAdmin>
                                        <Single />
                                    </LayoutAdmin>
                                }
                            />
                            <Route
                                path={config.routes.new}
                                element={<New inputs={userInputs} title="Add New User" />}
                            />
                        </Route>
                        <Route path={config.routes.brands}>
                            <Route
                                index
                                element={
                                    <LayoutAdmin>
                                        <Brands />
                                    </LayoutAdmin>
                                }
                            />
                        </Route>
                        <Route path={config.routes.manage_coupon}>
                            <Route
                                index
                                element={
                                    <LayoutAdmin>
                                        <Coupon />
                                    </LayoutAdmin>
                                }
                            />
                        </Route>
                        <Route path={config.routes.manage_banner}>
                            <Route
                                index
                                element={
                                    <LayoutAdmin>
                                        <Banner />
                                    </LayoutAdmin>
                                }
                            />
                        </Route>
                        <Route path={config.routes.manage_gift}>
                            <Route
                                index
                                element={
                                    <LayoutAdmin>
                                        <Gift />
                                    </LayoutAdmin>
                                }
                            />
                        </Route>
                        <Route path={config.routes.category}>
                            <Route
                                index
                                element={
                                    <LayoutAdmin>
                                        <Category />
                                    </LayoutAdmin>
                                }
                            />
                        </Route>
                        <Route path={config.routes.product}>
                            <Route
                                index
                                element={
                                    <LayoutAdmin>
                                        <Product />
                                    </LayoutAdmin>
                                }
                            />
                            <Route
                                path={config.routes.create_product}
                                element={
                                    <LayoutAdmin>
                                        <NewProduct />
                                    </LayoutAdmin>
                                }
                            />
                            <Route
                                path={config.routes.editProduct}
                                element={
                                    <LayoutAdmin>
                                        <NewProduct />
                                    </LayoutAdmin>
                                }
                            />
                        </Route>
                        <Route path={config.routes.order}>
                            <Route
                                index
                                element={
                                    <LayoutAdmin>
                                        <Order />
                                    </LayoutAdmin>
                                }
                            />

                            <Route
                                path={config.routes.order_detail}
                                element={
                                    <LayoutAdmin>
                                        <OrderDetail />
                                    </LayoutAdmin>
                                }
                            />
                        </Route>
                        <Route path={config.routes.manage_doctor}>
                            <Route
                                index
                                element={
                                    <LayoutAdmin>
                                        <ManageDoctor />
                                    </LayoutAdmin>
                                }
                            />
                        </Route>
                        <Route path={config.routes.manage_schedule}>
                            <Route
                                index
                                element={
                                    <LayoutAdmin>
                                        <ManageSchedule />
                                    </LayoutAdmin>
                                }
                            />
                        </Route>
                        <Route path={config.routes.doctor_schedule}>
                            <Route
                                index
                                element={
                                    <LayoutAdmin>
                                        <ListScheduleDoctor data={'none'} />
                                    </LayoutAdmin>
                                }
                            />
                        </Route>
                        <Route path={config.routes.doctor_history}>
                            <Route
                                index
                                element={
                                    <LayoutAdmin>
                                        <ListScheduleDoctor data={'history'} />
                                    </LayoutAdmin>
                                }
                            />
                        </Route>
                        <Route path={config.routes.verify_email}>
                            <Route
                                index
                                element={
                                    <DefaultLayout>
                                        <VerifyEmail />
                                    </DefaultLayout>
                                }
                            />
                        </Route>
                    </Route>
                </Routes>

                <Routes>
                    <Route
                        path={config.routes.customer_login}
                        element={
                            <DefaultLayout>
                                <CustomerLogin />
                            </DefaultLayout>
                        }
                    />
                    <Route path={config.routes.home}>
                        <Route index element={<HeaderCustomer />} />
                        <Route
                            path={config.routes.list_doctor}
                            element={
                                <DefaultLayout>
                                    <ListDoctor />
                                </DefaultLayout>
                            }
                        />
                        <Route path={config.routes.detail_doctor}>
                            <Route
                                index
                                element={
                                    <DefaultLayout>
                                        <DoctorDetail />
                                    </DefaultLayout>
                                }
                            />
                        </Route>
                        <Route
                            path={config.routes.filter_category}
                            element={
                                <DefaultLayout>
                                    <FilterCategory />
                                </DefaultLayout>
                            }
                        />

                        <Route
                            path={config.routes.product_detail}
                            element={
                                <DefaultLayout>
                                    <ProductDetail />
                                </DefaultLayout>
                            }
                        />
                        <Route
                            path={config.routes.check_out}
                            element={
                                <DefaultLayout>
                                    <CheckOut />
                                </DefaultLayout>
                            }
                        />
                        <Route
                            path={config.routes.order_history}
                            element={
                                <DefaultLayout>
                                    <OrderHistory />
                                </DefaultLayout>
                            }
                        />
                    </Route>
                </Routes>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </div>
        </Router>
    );
}
export default App;
