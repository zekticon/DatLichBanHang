const routes = {
    //admin
    dashboard: '/admin',
    loginAdmin: '/login-admin',
    new: 'new',
    users: '/admin/users',
    single: 'details/:id',
    manage_doctor: '/admin/manage-doctor',
    manage_schedule: '/admin/manage_schedule',

    manage_coupon: '/admin/manage-coupon',
    manage_banner: '/admin/manage-banner',
    manage_gift: '/admin/manage-gift',

    verify_email: '/admin/verify-booking',

    doctor_schedule: '/admin/doctor-schedule/:id',
    doctor_history: '/admin/doctor-history/:id',

    //doctor

    //brands
    brands: '/admin/brands',

    //category
    category: '/admin/category',

    //product
    product: '/admin/product',
    editProduct: 'edit-product/:productId',
    create_product: 'create-product',

    //order
    order: '/admin/order',
    order_detail: 'order-detail/:id',

    //customer
    customer_login: '/login-customer',

    home: '/',
    product_detail: '/product-detail/:id',
    list_doctor: '/list-doctor',
    detail_doctor: '/detail-doctor/:id',

    check_out: '/check-out',
    filter_category: '/category/:id',

    order_history: '/order-history',
};
export default routes;
