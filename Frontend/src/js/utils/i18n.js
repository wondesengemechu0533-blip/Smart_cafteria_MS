/**
 * Smart Cafeteria Ordering System
 * Unified Global Bilingual (English & Amharic) i18n Engine
 * - Single source of truth for ALL pages
 * - Persists language across all pages via localStorage
 * - Auto-injects language switcher where missing
 * - Supports data-i18n, ID mapping, and directTextMap fallback
 */

export const translations = {
  en: {
    // ===== NAVIGATION =====
    nav_home: "Home",
    nav_menu: "Menu",
    nav_cart: "Cart",
    nav_track: "Track Active Order",
    nav_history: "My Orders",
    nav_profile: "My Profile",
    nav_logout: "Logout",
    nav_login: "Login",
    nav_register: "Register",
    nav_notifications: "Notifications",
    nav_feedback: "Feedback",
    nav_admin: "Admin",
    nav_kitchen: "Kitchen",

    // ===== HOME PAGE (index.html) =====
    navHome: "Home",
    navMenu: "Menu",
    navHow: "How It Works",
    navFeatures: "Features",
    navTestimonials: "Testimonials",
    navLogin: "Login",
    navRegister: "Register",
    banner1Title: "Special Breakfast Deals",
    banner1Desc: "Get up to 20% off on traditional breakfast combos every morning!",
    banner2Title: "Fresh & Spicy Lunch Delights",
    banner2Desc: "Authentic Shiro, Siga Firfir, and fresh salads prepared daily.",
    banner3Title: "Fresh Juices & Roasted Coffee",
    banner3Desc: "Pair your meal with premium Macchiato or Layered Sprice Juice.",
    howTitle: "How It Works",
    howSubtitle: "Order your meal in three simple steps",
    step1Title: "Browse Menu",
    step1Desc: "Explore a variety of food items by category",
    step2Title: "Order & Pay",
    step2Desc: "Add items to cart and pay seamlessly via TeleBirr or CBE Birr",
    step3Title: "Track & Collect",
    step3Desc: "Track your order status in real-time and collect your meal",
    menuPreviewTitle: "Popular Menu Items",
    menuPreviewSubtitle: "Check out our most popular dishes",
    viewFullMenuBtn: "View Full Menu",
    whyTitle: "Why Choose Us?",
    whySubtitle: "Key features that make our system special",
    feat1Title: "No More Queues",
    feat1Desc: "Order your meals remotely without waiting in long lines",
    feat2Title: "Order Anywhere",
    feat2Desc: "Place your order easily from anywhere on campus",
    feat3Title: "Real-Time Updates",
    feat3Desc: "Track your order progress live from kitchen to pick-up",
    feat4Title: "Easy Payment",
    feat4Desc: "Fast and secure digital payment via CBE Birr & TeleBirr",
    feat5Title: "Order History",
    feat5Desc: "View and reorder your favorite past orders anytime",
    feat6Title: "Smart Reports",
    feat6Desc: "Comprehensive sales and inventory reports for management",
    testTitle: "What Our Users Say",
    testSubtitle: "Feedback from our cafeteria users",
    test1Quote: '"This system saved me so much time waiting in cafeteria lines! I order easily and get notified when ready."',
    test2Quote: '"The kitchen dashboard is very convenient! I can easily view orders and update their status live."',
    test3Quote: '"The admin panel gives full control over menu and operations. The reports are extremely helpful!"',
    footerAbout: "Modern cafeteria ordering system that makes food ordering fast, simple, and efficient.",

    // ===== MENU PAGE =====
    menu_title: "Delicious Meals & Drinks",
    menu_subtitle: "Browse and order fresh food directly from your cafeteria",
    menu_hero_title: "Ethiopian Food, Coffee & Pastry",
    menu_hero_subtitle: "Authentic traditional meals, freshly brewed Ethiopian coffee, and delicious bakery cakes.",
    search_placeholder: "Search food items...",
    search_placeholder_menu: "Search food, coffee, cakes...",
    search_placeholder_mobile: "Search menu items...",
    cat_all: "All",
    cat_breakfast: "Breakfast",
    cat_mains: "Main Meals",
    cat_fasting: "Fasting",
    cat_beverages: "Beverages",
    cat_snacks: "Snacks",
    cat_fasting_meals: "Fasting Meals",
    add_to_cart: "Add to Cart",
    add: "Add",
    unavailable: "Unavailable",
    available: "Available",
    not_available: "Not Available",
    currency: "ETB",
    price: "Price",
    results_loading: "Loading menu...",
    results_count: "Loading menu...",
    sort_by: "Sort by:",
    sort_name: "Name",
    sort_low_high: "Price: Low to High",
    sort_high_low: "Price: High to Low",
    no_results_title: "No Food or Drink Items Found",
    no_results_desc: "We couldn't find anything matching your search. Try searching for food, beverages, or snacks!",
    reset_filters: "Reset Filters",

    // ===== CART =====
    cart_title: "Your Shopping Cart",
    cart_subtitle: "Review your selected food items before checkout",
    cart_my_cart: "My Food Cart",
    cart_back_to_menu: "Back to Menu",
    cart_item: "Item",
    cart_price: "Price",
    cart_quantity: "Quantity",
    cart_total: "Total",
    cart_empty: "Your cart is empty!",
    cart_browse_btn: "Browse Menu",
    cart_clear_btn: "Clear Cart",
    cart_clear_all: "Clear All",
    cart_checkout_btn: "Proceed to Checkout",
    cart_order_items: "Order Items",
    cart_add_more: "Add More Food",
    order_summary: "Order Summary",
    subtotal: "Subtotal",
    service_fee: "Service Fee",
    grand_total: "Total Amount",
    total_amount: "Total Amount",
    order_review: "Order Review",

    // ===== CHECKOUT =====
    checkout_title: "Checkout & Payment",
    checkout_subtitle: "Complete your dining preferences and contact details",
    checkout_header: "Checkout",
    back_to_cart: "Back to Cart",
    dining_option: "Dining Option",
    dine_in: "Dine-In",
    takeaway: "Takeaway",
    table_number: "Table Number",
    contact_details: "Contact Details",
    full_name: "Full Name",
    phone_number: "Phone Number",
    payment_method: "Payment Method",
    place_order_btn: "Place Order",
    confirm_order: "Confirm Order",
    telebirr: "Telebirr",
    chapa: "Chapa",
    cbe_birr: "CBE Birr",
    chapa_test_mode: "Chapa Test Mode",

    // ===== ORDER HISTORY & TRACKING =====
    history_title: "My Order History",
    history_subtitle: "View all your past and active food orders",
    history_header: "Order History",
    all_orders: "All Orders",
    completed: "Completed",
    pending: "Pending",
    in_progress: "In Progress / Pending",
    cancelled: "Cancelled",
    clear_history: "Clear History",
    no_orders: "No order history found",
    order_id: "Order ID",
    order_date: "Date",
    order_type: "Type",
    order_status: "Status",
    status_pending: "Pending",
    status_preparing: "Preparing",
    status_ready: "Ready for Pickup",
    status_served: "Served",
    status_cancelled: "Cancelled",
    status_completed: "Completed",
    view_details: "View Details",
    reorder_btn: "Reorder",
    track_order: "Track Order",
    track_active_order: "Track Active Order",
    live_order_tickets: "Live Order Tickets",

    // ===== PROFILE =====
    profile_title: "My Profile",
    profile_account_details: "Account Details",
    profile_manage: "Manage your contact details and default dining preferences for faster checkout.",
    profile_personal_details: "Personal Details",
    profile_checkout_prefs: "Default Checkout Preferences",
    profile_full_name: "Full Name",
    profile_phone: "Phone Number",
    profile_email: "Email Address",
    profile_lang_pref: "Language Preference",
    profile_preferred_order: "Preferred Order Type",
    profile_default_table: "Default Table / Office #",
    profile_save: "Save Changes",
    profile_member: "Cafeteria Member",
    profile_account_settings: "Account Settings",
    profile_save_success: "Profile updated successfully",

    // ===== AUTH PAGES =====
    auth_welcome_back: "Welcome back",
    auth_signin_subtitle: "Sign in to continue to your cafeteria account.",
    auth_phone_email: "Phone or Email",
    auth_password: "Password",
    auth_forgot: "Forgot password?",
    auth_login_btn: "Login to Account",
    auth_no_account: "Don't have an account?",
    auth_create_account: "Create an account",
    auth_back_home: "Back to Home Page",
    auth_good_food: "Good food, good mood.",
    auth_welcome_desc: "Welcome back to Smart Cafeteria. Order your favorite meals quickly, conveniently, and enjoy a smarter cafeteria experience.",
    auth_quick_ordering: "Quick Ordering",
    auth_easy_cart: "Easy Cart",
    auth_order_tracking: "Order Tracking",
    auth_create_title: "Create Account",
    auth_create_subtitle: "Fill in your details to get started with Smart Cafeteria.",
    auth_full_name: "Full Name",
    auth_email: "Email Address",
    auth_phone: "Phone Number",
    auth_confirm_password: "Confirm Password",
    auth_register_btn: "Register Account",
    auth_has_account: "Already have an account?",
    auth_sign_in: "Sign in",
    auth_smart_dining: "Smart dining, simplified.",
    auth_join_desc: "Join Smart Cafeteria today to order your favorite campus meals, track your queue status seamlessly, and avoid long lines.",
    auth_instant_activation: "Instant Account Activation",
    auth_preorder: "Pre-order Meals Easily",
    auth_secure: "Secure Digital Payments & Tracking",

    // ===== ADMIN =====
    admin_dashboard: "Admin Dashboard",
    admin_users: "Users",
    admin_menu: "Menu / Foods",
    admin_categories: "Categories",
    admin_orders: "Orders",
    admin_payments: "Payments",
    admin_cancellations: "Cancellations",
    admin_reports: "Reports",
    admin_activity: "Activity Logs",
    admin_profile: "Profile",
    admin_settings: "Settings",
    admin_overview: "Dashboard Overview",
    admin_realtime_stats: "Real-time statistics from MongoDB — updated live from the database.",
    admin_refresh: "Refresh",
    admin_autorefresh_off: "Auto-refresh OFF",
    admin_export: "Export",
    admin_last_7: "Last 7 Days",
    admin_last_30: "Last 30 Days",
    admin_last_90: "Last 90 Days",
    admin_custom: "Custom",
    admin_total_users: "Total Users",
    admin_customers: "Customers",
    admin_kitchen_staff: "Kitchen Staff",
    admin_admins: "Admins",
    admin_total_menu: "Total Menu Items",
    admin_available_now: "Available Now",
    admin_out_of_stock: "Out of Stock",
    admin_categories_label: "Categories",
    admin_total_orders: "Total Orders",
    admin_pending: "Pending",
    admin_preparing: "Preparing",
    admin_ready: "Ready",
    admin_completed: "Completed",
    admin_cancelled: "Cancelled",
    admin_successful_payments: "Successful Payments",
    admin_pending_payments: "Pending Payments",
    admin_failed_payments: "Failed Payments",
    admin_total_revenue: "Total Revenue",
    admin_order_status_overview: "Order Status Overview",
    admin_revenue_last7: "Revenue (Last 7 Days)",
    admin_recent_orders: "Recent Orders",
    admin_recent_payments: "Recent Payments",
    admin_view_all: "View All",
    admin_logout_confirm: "Are you sure you want to log out?",
    admin_main: "MAIN",
    admin_management: "MANAGEMENT",
    admin_analytics: "ANALYTICS & REPORTS",
    admin_system: "SYSTEM",
    admin_logout: "Logout",

    // ===== KITCHEN =====
    kitchen_title: "Kitchen Display System",
    kitchen_station: "Station 1",
    kitchen_manage_queue: "Manage Full Queue",
    kitchen_pending: "Pending Kitchen",
    kitchen_preparing: "In Preparation",
    kitchen_ready: "Ready For Pickup",
    kitchen_live_sync: "Live Sync Active",
    kitchen_access_denied: "Access denied. Kitchen staff and Admins only.",

    // ===== COMMON =====
    loading: "Loading...",
    loading_menu: "Loading menu...",
    unable_load_menu: "Unable to Load Menu",
    check_connection: "We couldn't reach the menu right now. Please check your connection and try again.",
    try_again: "Try Again",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    price: "Price",
    category: "Category",
    description: "Description",
    quantity: "Quantity",
    total: "Total",
    subtotal_label: "Subtotal",
    tax: "Tax",
    discount: "Discount",
    remove: "Remove",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    close: "Close",
    back: "Back",
    next: "Next",
    previous: "Previous",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Info",
    no_data: "No data available",
    please_wait: "Please wait...",
    home: "Home",
    login: "Login",
    register: "Register",
    logout: "Logout",
    menu: "Menu",
    cart: "Cart",
    checkout: "Checkout",
    profile: "Profile",
    settings: "Settings",
    language: "Language",
    dashboard: "Dashboard",
    orders: "Orders",
    orderHistory: "Order History",
    orderTracking: "Track Order",
    notifications: "Notifications",
    feedback: "Feedback",
    success_added: "Item added to cart!",
    success_removed: "Item removed from cart!",
    order_confirmed: "Order Confirmed!",
    no_menu_items: "No menu items found",

    // ===== CART PAGE =====
    cart_page_title: "Your Cart - Smart Cafeteria",
    back_to_menu: "Back to Menu",
    my_food_cart: "My Food Cart",
    track_order: "Track Order",
    order_items: "Order Items",
    clear_all: "Clear All",
    order_summary: "Order Summary",
    subtotal: "Subtotal",
    service_fee: "Service Fee",
    total_amount: "Total Amount",
    proceed_to_checkout: "Proceed to Checkout",
    add_more_food: "Add More Food",
    your_cart_is_empty: "Your cart is empty!",
    add_some_delicious_food: "Add some delicious food from the menu.",
    browse_menu: "Browse Menu",
    view_details: "View Details",

    // ===== CHECKOUT PAGE =====
    checkout_page_title: "Checkout - Smart Cafeteria",
    back_to_cart: "Back to Cart",
    checkout_header: "Checkout",
    dining_option: "Dining Option",
    dine_in: "Dine-In",
    takeaway: "Takeaway",
    table_number: "Table Number",
    table_number_placeholder: "e.g., 12",
    contact_details: "Contact Details",
    full_name: "Full Name",
    full_name_placeholder: "Enter your full name",
    phone_number: "Phone Number",
    phone_number_placeholder: "0911223344",
    phone_format_hint: "Format: 09XXXXXXXX or 07XXXXXXXX",
    payment_method: "Payment Method",
    telebirr: "Telebirr",
    telebirr_desc: "Pay securely with Telebirr",
    chapa: "Chapa",
    chapa_desc: "Pay securely with Chapa",
    cbe_birr: "CBE Birr",
    cbe_birr_desc: "Pay securely with CBE Birr",
    chapa_test_mode: "Chapa Test Mode",
    chapa_test_info_title: "Chapa Test Mode",
    chapa_test_info_desc: "You are using Chapa's test (sandbox) environment. When the Chapa payment page opens, use these test details:",
    chapa_test_card: "Card: 4242 4242 4242 4242",
    chapa_test_cvv: "CVV: 123",
    chapa_test_expiry: "Expiry: any future date (e.g. 12/30)",
    chapa_test_bank_note: "Or choose one of Chapa's sandbox banks on the payment page. After paying you'll be redirected back and your receipt will be shown automatically.",
    confirm_order: "Confirm Order",
    place_order: "Place Order",
    order_review: "Order Review",

    // ===== ORDER HISTORY =====
    history_page_title: "My Order History",
    history_title: "My Order History",
    history_subtitle: "View all your past and active food orders",
    all_orders: "All Orders",
    completed: "Completed",
    pending: "Pending",
    in_progress: "In Progress",
    cancelled: "Cancelled",
    clear_history: "Clear History",
    no_orders: "No order history found",
    order_id: "Order ID",
    order_date: "Date",
    order_type: "Type",
    order_status: "Status",
    status_pending: "Pending",
    status_preparing: "Preparing",
    status_ready: "Ready for Pickup",
    status_served: "Served",
    status_completed: "Completed",
    status_cancelled: "Cancelled",
    reorder: "Reorder",
    track_active_order: "Track Active Order",

    // ===== ORDER TRACKING =====
    tracking_page_title: "Track Order - Smart Cafeteria",
    live_order_tickets: "Live Order Tickets",
    order_progress: "Order Progress",
    estimated_time: "Estimated Time",

    // ===== PROFILE =====
    profile_page_title: "My Profile",
    profile_account_details: "Account Details",
    profile_manage: "Manage your contact details and default dining preferences for faster checkout.",
    profile_personal_details: "Personal Details",
    profile_checkout_prefs: "Default Checkout Preferences",
    profile_email: "Email Address",
    profile_lang_pref: "Language Preference",
    profile_preferred_order: "Preferred Order Type",
    profile_default_table: "Default Table / Office #",
    profile_save: "Save Changes",
    profile_member: "Cafeteria Member",
    profile_account_settings: "Account Settings",
    profile_save_success: "Profile updated successfully",
    profile_avatar: "Profile Picture",
    change_avatar: "Change Avatar",

    // ===== NOTIFICATIONS =====
    notifications_page_title: "Notifications",
    notifications_title: "Notifications",
    no_notifications: "No notifications yet",
    mark_all_read: "Mark All as Read",

    // ===== FEEDBACK =====
    feedback_page_title: "Feedback",
    feedback_title: "Feedback",
    feedback_subtitle: "Share your experience with us",
    feedback_name: "Your Name",
    feedback_email: "Email",
    feedback_message: "Your Message",
    feedback_submit: "Submit Feedback",
    feedback_success: "Thank you for your feedback!",

    // ===== AUTH PAGES (additional) =====
    auth_forgot_password: "Forgot Password?",
    auth_reset_password: "Reset Password",
    auth_send_reset_link: "Send Reset Link",
    auth_remember_me: "Remember me",
    auth_or: "or",

    // ===== FOOTER =====
    footer_quick_links: "Quick Links",
    footer_roles: "Roles",
    footer_customer: "Customer",
    footer_kitchen: "Kitchen",
    footer_admin: "Admin",
    footer_contact: "Contact",
    footer_rights: "All Rights Reserved.",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Service",
    footer_developed_by: "Developed by",

    // ===== ADMIN DASHBOARD =====
    admin_dashboard_page_title: "Admin Dashboard - Smart Cafeteria",
    dashboard_overview: "Dashboard Overview",
    admin_realtime_stats: "Real-time statistics from MongoDB — updated live from the database.",
    admin_last_updated: "Last updated:",
    admin_refresh: "Refresh",
    admin_auto_refresh_off: "Auto-refresh OFF",
    admin_auto_refresh_on: "Auto-refresh ON",
    admin_refresh_interval: "Refresh Interval",
    admin_30_seconds: "30 seconds",
    admin_1_minute: "1 minute",
    admin_5_minutes: "5 minutes",
    admin_export: "Export",
    admin_export_data: "Export Data",
    admin_date_range: "Date Range",
    admin_last_7_days: "Last 7 Days",
    admin_last_30_days: "Last 30 Days",
    admin_last_90_days: "Last 90 Days",
    admin_custom: "Custom",
    admin_start_date: "Start Date",
    admin_end_date: "End Date",
    admin_apply: "Apply",
    admin_keyboard_shortcuts: "Keyboard Shortcuts:",
    admin_refresh_shortcut: "R - Refresh",
    admin_autorefresh_shortcut: "A - Auto-refresh",
    admin_export_shortcut: "E - Export",
    admin_fullscreen_shortcut: "F - Fullscreen Charts",
    admin_realtime_clock: "Real-time Clock",
    admin_alerts_panel: "Alerts Panel",
    admin_total_users: "Total Users",
    admin_customers: "Customers",
    admin_kitchen_staff: "Kitchen Staff",
    admin_admins: "Admins",
    admin_total_menu_items: "Total Menu Items",
    admin_available_now: "Available Now",
    admin_out_of_stock: "Out of Stock",
    admin_categories: "Categories",
    admin_total_orders: "Total Orders",
    admin_pending_orders: "Pending",
    admin_preparing_orders: "Preparing",
    admin_ready_orders: "Ready",
    admin_completed_orders: "Completed",
    admin_cancelled_orders: "Cancelled",
    admin_successful_payments: "Successful Payments",
    admin_pending_payments: "Pending Payments",
    admin_failed_payments: "Failed Payments",
    admin_total_revenue: "Total Revenue",
    admin_order_status_overview: "Order Status Overview",
    admin_revenue_last7: "Revenue (Last 7 Days)",
    admin_recent_orders: "Recent Orders",
    admin_recent_payments: "Recent Payments",
    admin_view_all: "View All",
    admin_no_data: "No data available",
    admin_loading: "Loading...",

    // ===== ADMIN SIDEBAR NAV =====
    admin_nav_dashboard: "Dashboard",
    admin_nav_users: "Users",
    admin_nav_menu: "Menu / Foods",
    admin_nav_categories: "Categories",
    admin_nav_orders: "Orders",
    admin_nav_payments: "Payments",
    admin_nav_cancellations: "Cancellations",
    admin_nav_reports: "Reports",
    admin_nav_activity: "Activity Logs",
    admin_nav_feedback: "Feedback",
    admin_nav_profile: "Profile",
    admin_nav_settings: "Settings",
    admin_nav_logout: "Logout",
    admin_main: "MAIN",
    admin_management: "MANAGEMENT",
    admin_analytics: "ANALYTICS & REPORTS",
    admin_system: "SYSTEM",
    admin_logout_confirm: "Are you sure you want to log out?",

    // ===== ADMIN MENU MANAGEMENT =====
    admin_menu_page_title: "Menu Management - Smart Cafeteria",
    admin_menu_management: "Menu / Foods Management",
    admin_menu_subtitle: "Manage menu items, categories, and availability",
    admin_add_menu_item: "Add Menu Item",
    admin_edit_menu_item: "Edit Menu Item",
    admin_view_menu_item: "View Menu Item",
    admin_delete_menu_item: "Delete Menu Item",
    admin_menu_name_en: "English Name",
    admin_menu_name_am: "Amharic Name",
    admin_menu_category: "Category",
    admin_menu_price: "Price (ETB)",
    admin_menu_prep_time: "Preparation Time (min)",
    admin_menu_availability: "Availability",
    admin_menu_available: "Available for ordering",
    admin_menu_not_available: "Not available for ordering",
    admin_menu_description_en: "Description (English)",
    admin_menu_description_am: "Description (Amharic)",
    admin_menu_image_upload: "Upload Image (JPG, PNG, WEBP, max 2 MB)",
    admin_menu_image_url: "...or Image URL (optional)",
    admin_menu_image_preview: "Image Preview",
    admin_remove_image: "Remove Image",
    admin_save_item: "Save Item",
    admin_update_item: "Update Item",
    admin_cancel: "Cancel",
    admin_confirm_delete: "Delete this menu item? This cannot be undone.",
    admin_make_available: "Make available",
    admin_make_unavailable: "Make unavailable",
    admin_search_placeholder: "Search by name (EN/AM), description...",
    admin_all_categories: "All Categories",
    admin_all_availability: "All Availability",
    admin_available: "Available",
    admin_out_of_stock: "Out of Stock",
    admin_sort_newest: "Newest First",
    admin_sort_oldest: "Oldest First",
    admin_sort_name: "Name A-Z",
    admin_sort_price_asc: "Price Low to High",
    admin_sort_price_desc: "Price High to Low",
    admin_reset_filters: "Reset",
    admin_pagination_info: "Page {page} of {pages} ({total} items)",
    admin_prev_page: "Previous",
    admin_next_page: "Next",
    admin_metric_total_items: "Total Items",
    admin_metric_available: "Available Items",
    admin_metric_out_of_stock: "Out of Stock",
    admin_metric_categories: "Categories",

    // ===== ADMIN USERS =====
    admin_users_page_title: "Users Management - Smart Cafeteria",
    admin_users_title: "Users Management",
    admin_users_subtitle: "Manage all users in the system",
    admin_user_search: "Search users...",
    admin_user_role: "Role",
    admin_user_status: "Status",
    admin_user_actions: "Actions",
    admin_user_edit: "Edit",
    admin_user_delete: "Delete",
    admin_user_active: "Active",
    admin_user_inactive: "Inactive",
    admin_user_role_customer: "Customer",
    admin_user_role_kitchen: "Kitchen Staff",
    admin_user_role_admin: "Admin",
    add_user: "Add User",
    edit_user: "Edit User",
    view_details: "View Details",
    change_role: "Change Role",
    change_role_for: "Change role for",
    reset_password: "Reset Password",
    reset_password_for: "Reset password for",
    reset_password_btn: "Reset Password",
    change_status: "Change Account Status",
    change_status_for: "Change status for",
    save_role: "Save Role",
    save_status: "Save Status",
    saving: "Saving",
    all_users: "All Users",
    all_roles: "All Roles",
    all_status: "All Status",
    user_col_user: "User",
    user_col_role: "Role",
    user_col_balance: "Balance",
    user_col_status: "Status",
    user_col_joined: "Joined",
    user_col_actions: "Actions",
    user_details: "User Details",
    user_id: "User ID",
    email_address: "Email Address",
    phone_number: "Phone Number",
    phone_hint: "Phone (09XXXXXXXX)",
    wallet_balance: "Wallet Balance (ETB)",
    joined: "Joined",
    role_customer: "Customer",
    role_kitchen: "Kitchen Staff / Food Maker",
    role_admin: "Admin",
    status_active: "Active",
    status_blocked: "Blocked",
    status_suspended: "Suspended",
    new_password: "New Password",
    new_password_optional: "New Password (leave blank to keep)",
    confirm_password: "Confirm Password",
    total_users: "Total Users",
    active_customers: "Active Customers",
    staff: "Staff",
    blocked_users: "Blocked Users",
    password_required_new: "Password is required for new users",
    user_saved: "User saved successfully",
    failed_save_user: "Failed to save user",
    user_not_found: "User not found",
    role_updated: "Role updated successfully",
    failed_role: "Failed to update role",
    status_updated: "Status updated successfully",
    failed_status: "Failed to update status",
    password_min_6: "Password must be at least 6 characters",
    passwords_no_match: "Passwords do not match",
    password_reset_success: "Password reset successfully",
    failed_password_reset: "Failed to reset password",
    user_deactivated: "User deactivated successfully",
    failed_delete: "Failed to deactivate user",
    confirm_delete_user: 'Deactivate user "{name}"? They will no longer be able to log in.',
    cannot_deactivate_own: "Cannot deactivate your own account",
    page_info: "Page {page} of {pages} ({total} users)",

    // ===== ADMIN ORDERS =====
    admin_orders_page_title: "Orders Management - Smart Cafeteria",
    admin_orders_title: "Orders Management",
    admin_order_search: "Search orders...",
    admin_order_filter_status: "Filter by status",
    admin_order_filter_payment: "Filter by payment",
    admin_order_date: "Date",
    admin_order_customer: "Customer",
    admin_order_items: "Items",
    admin_order_amount: "Amount",
    admin_order_payment_method: "Payment Method",
    admin_order_payment_status: "Payment Status",
    admin_order_action: "Action",
    admin_order_update_status: "Update Status",
    admin_order_status_pending: "Pending",
    admin_order_status_preparing: "Preparing",
    admin_order_status_ready: "Ready",
    admin_order_status_served: "Served",
    admin_order_status_cancelled: "Cancelled",

    // ===== ADMIN PAYMENTS =====
    admin_payments_page_title: "Payments - Smart Cafeteria",
    admin_payments_title: "Payments",
    admin_payment_search: "Search payments...",
    admin_payment_method: "Method",
    admin_payment_amount: "Amount",
    admin_payment_status: "Status",
    admin_payment_date: "Date",
    admin_payment_ref: "Reference",

    // ===== ADMIN REPORTS =====
    admin_reports_page_title: "Reports - Smart Cafeteria",
    admin_reports_title: "Reports",
    admin_sales_report: "Sales Report",
    admin_inventory_report: "Inventory Report",
    admin_user_report: "User Report",
    admin_export_report: "Export Report",

    // ===== ADMIN SETTINGS =====
    admin_settings_page_title: "Settings - Smart Cafeteria",
    admin_settings_title: "System Settings",
    admin_general_settings: "General Settings",
    admin_maintenance_mode: "Maintenance Mode",
    admin_order_availability: "Order Availability",
    admin_max_order_qty: "Max Order Quantity",
    admin_currency: "Currency",
    admin_timezone: "Timezone",
    admin_save_settings: "Save Settings",

    // ===== ADMIN CATEGORIES =====
    admin_categories_page_title: "Categories Management - Smart Cafeteria",
    admin_categories_title: "Categories Management",
    admin_add_category: "Add Category",
    admin_edit_category: "Edit Category",
    admin_category_name_en: "English Name",
    admin_category_name_am: "Amharic Name",
    admin_category_icon: "Icon",
    admin_category_active: "Active",
    admin_category_inactive: "Inactive",

    // ===== KITCHEN =====
    kitchen_page_title: "Kitchen Display System",
    kitchen_dashboard: "Kitchen Dashboard",
    kitchen_station: "Station",
    kitchen_manage_queue: "Manage Full Queue",
    kitchen_pending_orders: "Pending Orders",
    kitchen_preparing_orders: "In Preparation",
    kitchen_ready_orders: "Ready For Pickup",
    kitchen_live_sync: "Live Sync Active",
    kitchen_access_denied: "Access denied. Kitchen staff and Admins only.",
    kitchen_order_number: "Order #",
    kitchen_order_time: "Order Time",
    kitchen_customer: "Customer",
    kitchen_items: "Items",
    kitchen_status: "Status",
    kitchen_action: "Action",
    kitchen_start_preparing: "Start Preparing",
    kitchen_mark_ready: "Mark Ready",
    kitchen_complete: "Complete",
    kitchen_no_orders: "No orders at the moment",
    kitchen_new_order_sound: "New Order Alert",

    // ===== COMMON UI ELEMENTS =====
    required_field: "Required",
    optional_field: "Optional",
    select_option: "Select an option",
    yes: "Yes",
    no: "No",
    ok: "OK",
    apply: "Apply",
    reset: "Reset",
    clear: "Clear",
    submit: "Submit",
    update: "Update",
    create: "Create",
    add: "Add",
    remove: "Remove",
    delete_confirm: "Are you sure you want to delete this?",
    unsaved_changes: "You have unsaved changes. Are you sure you want to leave?",
    page_not_found: "Page not found",
    access_denied: "Access denied",
    session_expired: "Your session has expired. Please log in again.",
    network_error: "Network error. Please check your connection and try again.",
    server_error: "Server error. Please try again later.",
    validation_error: "Please check the form for errors.",

    // ===== FOOD DETAILS =====
    food_details_page_title: "Food Details - Smart Cafeteria",
    food_details_description: "Description",
    food_details_price: "Price",
    food_details_category: "Category",
    food_details_prep_time: "Preparation Time",
    food_details_add_to_cart: "Add to Cart",
    food_details_unavailable: "Currently Unavailable",
    food_details_back_to_menu: "Back to Menu",

    // ===== CANCEL ORDER =====
    cancel_order_page_title: "Cancel Order - Smart Cafeteria",
    cancel_order_title: "Cancel Order",
    cancel_order_reason: "Reason for cancellation",
    cancel_order_reason_placeholder: "Please provide a reason...",
    cancel_order_submit: "Cancel Order",
    cancel_order_confirm: "Are you sure you want to cancel this order?",
    order_cancelled_success: "Order cancelled successfully",
    order_cannot_be_cancelled: "This order cannot be cancelled",

    // ===== PAYMENT SIMULATION =====
    payment_sim_page_title: "Payment Simulation",
    payment_sim_title: "Simulate Payment",
    payment_sim_method: "Payment Method",
    payment_sim_phone: "Phone Number",
    payment_sim_amount: "Amount",
    payment_sim_pay: "Pay Now",
    payment_sim_success: "Payment successful!",
    payment_sim_failed: "Payment failed. Please try again.",
  },
  am: {
    nav_home: "መነሻ",
    nav_menu: "ማውጫ",
    nav_cart: "ካርት",
    nav_track: "የትዕዛዝ ሁኔታ",
    nav_history: "ትዕዛዞቼ",
    nav_profile: "መገለጫዬ",
    nav_logout: "ውጣ",
    nav_login: "ግባ",
    nav_register: "ተመዝገብ",
    nav_notifications: "ማስታወቂያዎች",
    nav_feedback: "አስተያየት",
    nav_admin: "አስተዳዳሪ",
    nav_kitchen: "ኩሽና",

    navHome: "መነሻ",
    navMenu: "ማውጫ",
    navHow: "እንዴት እንደሚሰራ",
    navFeatures: "ባህሪያት",
    navTestimonials: "አስተያየቶች",
    navLogin: "ግባ",
    navRegister: "ተመዝገብ",
    banner1Title: "ልዩ የቁርስ ቅናሾች",
    banner1Desc: "በየጠዋቱ በባህላዊ የቁርስ ምግቦች ላይ እስከ 20% ቅናሽ ያግኙ!",
    banner2Title: "ትኩስ እና ጣፋጭ የምሳ ምግቦች",
    banner2Desc: "በየቀኑ የሚዘጋጁ ልዩ ሽሮ፣ የሥጋ ፍርፍር እና ትኩስ ሰላጣዎች።",
    banner3Title: "ትኩስ ጭማቂዎች እና የተጠበሰ ቡና",
    banner3Desc: "ምግብዎን ከባህላዊ ማኪያቶ ወይም ከተደራረበ ስፕሪስ ጭማቂ ጋር ያጣጥሙ።",
    howTitle: "እንዴት እንደሚሰራ",
    howSubtitle: "በሦስት ቀላል ደረጃዎች ምግብዎን ይዘዙ",
    step1Title: "ምግቦችን ይመልከቱ",
    step1Desc: "የተለያዩ ምግቦችን በምድባቸው ይመልከቱ",
    step2Title: "ይዘዙ እና ይክፈሉ",
    step2Desc: "ምግብ ወደ ካርት ይጨምሩ እና በTeleBirr ወይም CBE Birr ክፍያ ይፈጽሙ",
    step3Title: "ይከታተሉ እና ይቀበሉ",
    step3Desc: "በእውነተኛ ጊዜ ትዕዛዝዎን ይከታተሉ እና ይቀበሉ",
    menuPreviewTitle: "በጣም ተወዳጅ ምግቦች",
    menuPreviewSubtitle: "በጣም ተወዳጅ የሆኑ ምግቦቻችንን ይመልከቱ",
    viewFullMenuBtn: "ሙሉ ማውጫውን ይመልከቱ",
    whyTitle: "ለምን እኛን ይመርጣሉ?",
    whySubtitle: "ሥርዓታችንን ልዩ የሚያደርጉት ባህሪያት",
    feat1Title: "ረጅም ወረፋ የለም",
    feat1Desc: "ረጅም ወረፋ ሳይጠብቁ ምግብዎን በቅድመ ሁኔታ ይዘዙ",
    feat2Title: "ከየትኛውም ቦታ ይዘዙ",
    feat2Desc: "ከየትኛውም ቦታ ሆነው በቀላሉ ምግብዎን ይዘዙ",
    feat3Title: "የቀጥታ ማሳወቂያዎች",
    feat3Desc: "የትዕዛዝዎን ሁኔታ በእውነተኛ ጊዜ ይከታተሉ",
    feat4Title: "ቀላል ክፍያ",
    feat4Desc: "በCBE Birr እና TeleBirr ፈጣን ክፍያ ይፈጽሙ",
    feat5Title: "ያለፉ ትዕዛዞች",
    feat5Desc: "ያለፉትን ትዕዛዞች እና ታሪክ በማንኛውም ጊዜ ይመልከቱ",
    feat6Title: "ዘመናዊ ሪፖርቶች",
    feat6Desc: "ለአስተዳዳሪዎች ዝርዝር የሽያጭ እና የካፌቴሪያ ሪፖርቶች",
    testTitle: "ተጠቃሚዎቻችን ምን ይላሉ?",
    testSubtitle: "ተጠቃሚዎቻችን ስለ ሥርዓታችን ያላቸው አስተያየት",
    test1Quote: '"ይህ ስርዓት በካፊቴሪያ ውስጥ ረጅም ጊዜ ከመጠበቅ አድኖኛል! በቀላሉ ምግብ አዝዣለሁ እና ዝግጁ በሚሆንበት ጊዜ ማሳወቂያ አገኛለሁ።"',
    test2Quote: '"የኩሽና ዳሽቦርዱ በጣም ምቹ ነው! ትዕዛዞችን በቀላሉ ማየት እና ሁኔታቸውን በቀጥታ ማዘመን እችላለሁ።"',
    test3Quote: '"የአስተዳደር ፓነሉ ሁሉንም ነገር ለመቆጣጠር ያስችላል። ሪፖርቶች በጣም ጠቃሚ ናቸው!"',
    footerAbout: "ዘመናዊ የካፊቴሪያ አገልግሎት — ምግብ ማዘዝን ፈጣን፣ ቀላል እና ቀልጣፋ የሚያደርግ ስርዓት።",

    menu_title: "ጣፋጭ የምግብ እና የመጠጥ አማራጮች",
    menu_subtitle: "ትኩስ ምግቦችን በቀላሉ ከካፌቴሪያችን ይዘዙ",
    menu_hero_title: "የኢትዮጵያ ምግብ፣ ቡና እና ፓስትሪ",
    menu_hero_subtitle: "ባህላዊ ምግቦች፣ ትኩስ የኢትዮጵያ ቡና እና ጣፋጭ ኬኮች።",
    search_placeholder: "ምግብ ወይም መጠጥ ፈልግ...",
    search_placeholder_menu: "ምግብ፣ ቡና፣ ኬኮች ፈልግ...",
    search_placeholder_mobile: "ምግቦችን ፈልግ...",
    cat_all: "ሁሉም",
    cat_breakfast: "ቁርስ",
    cat_mains: "ዋና ምግቦች",
    cat_fasting: "የፆም ምግቦች",
    cat_beverages: "መጠጦች",
    cat_snacks: "መክሰስ",
    cat_fasting_meals: "የጾም ምግቦች",
    add_to_cart: "ወደ ካርት ጨምር",
    add: "ጨምር",
    unavailable: "አይገኝም",
    available: "ይገኛል",
    not_available: "አይገኝም",
    currency: "ብር",
    price: "ዋጋ",
    results_loading: "ምግቦችን በመጫን ላይ...",
    results_count: "ምግቦችን በመጫን ላይ...",
    sort_by: "ደርድር በ:",
    sort_name: "ስም",
    sort_low_high: "ዋጋ: ዝቅተኛ ወደ ከፍተኛ",
    sort_high_low: "ዋጋ: ከፍተኛ ወደ ዝቅተኛ",
    no_results_title: "ምንም ምግብ ወይም መጠጥ አልተገኘም",
    no_results_desc: "ከፍለጋዎ ጋር የሚዛመድ ምንም ነገር ማግኘት አልቻልንም። ምግብ፣ መጠጥ ወይም መክሰስ ይፈልጉ!",
    reset_filters: "ማጣሪያዎችን ዳግም አስጀምር",

    cart_title: "የግዢ ካርትዎ",
    cart_subtitle: "ክፍያ ከመፈጸምዎ በፊት የመረጧቸውን ምግቦች ይመልከቱ",
    cart_my_cart: "የምግብ ካርቴ",
    cart_back_to_menu: "ወደ ማውጫ ተመለስ",
    cart_item: "ምግብ",
    cart_price: "ዋጋ",
    cart_quantity: "ብዛት",
    cart_total: "ጠቅላላ",
    cart_empty: "ካርትዎ ባዶ ነው!",
    cart_browse_btn: "ምግቦችን ይመልከቱ",
    cart_clear_btn: "ካርት አፅዳ",
    cart_clear_all: "ሁሉንም አፅዳ",
    cart_checkout_btn: "ወደ ክፍያ ሂድ",
    cart_order_items: "የትዕዛዝ ዕቃዎች",
    cart_add_more: "ተጨማሪ ምግብ ጨምር",
    order_summary: "የትዕዛዝ ማጠቃለያ",
    subtotal: "ንዑስ ድምር",
    service_fee: "የአገልግሎት ክፍያ",
    grand_total: "ጠቅላላ ክፍያ",
    total_amount: "ጠቅላላ ክፍያ",
    order_review: "የትዕዛዝ ማጠቃለያ",

    checkout_title: "ክፍያ እና ማጠቃለያ",
    checkout_subtitle: "የመመገቢያ አማራጭ እና የግል መረጃዎን ያጠናቅቁ",
    checkout_header: "ክፍያ",
    back_to_cart: "ወደ ካርት ተመለስ",
    dining_option: "የመመገቢያ አማራጭ",
    dine_in: "በቦታው ለመመገብ",
    takeaway: "ለይዞ መሄድ",
    table_number: "የጠረጴዛ ቁጥር",
    contact_details: "የግል መረጃ",
    full_name: "ሙሉ ስም",
    phone_number: "ስልክ ቁጥር",
    payment_method: "የክፍያ ዘዴ",
    place_order_btn: "ትዕዛዝ ፈጽም",
    confirm_order: "ትዕዛዝ አረጋግጥ",
    telebirr: "ቴሌብር",
    chapa: "ቻፓ",
    cbe_birr: "CBE ብር",
    chapa_test_mode: "የቻፓ ሙከራ ሁነታ",

    history_title: "ያለፉ ትዕዛዞቼ",
    history_subtitle: "ያለፉትን እና አሁን ያሉትን ትዕዛዞችዎን ይመልከቱ",
    history_header: "የትዕዛዝ ታሪክ",
    all_orders: "ሁሉም ትዕዛዞች",
    completed: "የተጠናቀቀ",
    pending: "በመጠባበቅ ላይ",
    in_progress: "በሂደት ላይ",
    cancelled: "ተሰርዟል",
    clear_history: "ታሪክ አፅዳ",
    no_orders: "ምንም የትዕዛዝ ታሪክ አልተገኘም",
    order_id: "የትዕዛዝ ቁጥር",
    order_date: "ቀን",
    order_type: "ዓይነት",
    order_status: "ሁኔታ",
    status_pending: "በመጠባበቅ ላይ",
    status_preparing: "በዝግጅት ላይ",
    status_ready: "ዝግጁ ነው",
    status_served: "ተስተናግዷል",
    status_cancelled: "ተሰርዟል",
    status_completed: "የተጠናቀቀ",
    view_details: "ዝርዝር ይመልከቱ",
    reorder_btn: "እንደገና እዘዝ",
    track_order: "ትዕዛዝ መከታተያ",
    track_active_order: "የትዕዛዝ ሁኔታ",
    live_order_tickets: "የቀጥታ ትዕዛዝ ቲኬቶች",

    profile_title: "መገለጫዬ",
    profile_account_details: "የሂሳብ ዝርዝሮች",
    profile_manage: "ለፈጣን ክፍያ የግንኙነት ዝርዝሮችዎን እና የመመገቢያ ምርጫዎን ያስተዳድሩ።",
    profile_personal_details: "የግል ዝርዝሮች",
    profile_checkout_prefs: "ነባሪ የክፍያ ምርጫዎች",
    profile_full_name: "ሙሉ ስም",
    profile_phone: "ስልክ ቁጥር",
    profile_email: "ኢሜይል አድራሻ",
    profile_lang_pref: "የቋንቋ ምርጫ",
    profile_preferred_order: "የሚመረጥ የትዕዛዝ ዓይነት",
    profile_default_table: "ነባሪ ጠረጴዛ / ቢሮ ቁጥር",
    profile_save: "ለውጦችን አስቀምጥ",
    profile_member: "የካፌቴሪያ አባል",
    profile_account_settings: "የሂሳብ ቅንብሮች",
    profile_save_success: "መገለጫ በተሳካ ሁኔታ ተዘምኗል",

    auth_welcome_back: "እንኳን ደህና መጡ",
    auth_signin_subtitle: "ወደ ካፌቴሪያ ሂሳብዎ ለመቀጠል ይግቡ።",
    auth_phone_email: "ስልክ ወይም ኢሜይል",
    auth_password: "የይለፍ ቃል",
    auth_forgot: "የይለፍ ቃል ረሱ?",
    auth_login_btn: "ወደ ሂሳብ ግባ",
    auth_no_account: "ሂሳብ የለዎትም?",
    auth_create_account: "ሂሳብ ፍጠር",
    auth_back_home: "ወደ መነሻ ተመለስ",
    auth_good_food: "ጥሩ ምግብ፣ ጥሩ ስሜት።",
    auth_welcome_desc: "እንኳን ወደ ስማርት ካፌቴሪያ በደህና መጡ። ተወዳጅ ምግቦችዎን በፍጥነት፣ በቀላሉ ይዘዙ እና ብልህ የካፌቴሪያ ተሞክሮ ይደሰቱ።",
    auth_quick_ordering: "ፈጣን ትዕዛዝ",
    auth_easy_cart: "ቀላል ካርት",
    auth_order_tracking: "ትዕዛዝ መከታተያ",
    auth_create_title: "ሂሳብ ፍጠር",
    auth_create_subtitle: "ከስማርት ካፌቴሪያ ጋር ለመጀመር ዝርዝሮችዎን ይሙሉ።",
    auth_full_name: "ሙሉ ስም",
    auth_email: "ኢሜይል አድራሻ",
    auth_phone: "ስልክ ቁጥር",
    auth_confirm_password: "የይለፍ ቃል አረጋግጥ",
    auth_register_btn: "ሂሳብ መዝግብ",
    auth_has_account: "አስቀድሞ ሂሳብ አለዎት?",
    auth_sign_in: "ግባ",
    auth_smart_dining: "ብልህ አመጋገብ፣ ቀላል የተደረገ።",
    auth_join_desc: "ዛሬ የስማርት ካፌቴሪያ አባል ይሁኑ ተወዳጅ የካምፓስ ምግቦችዎን ይዘዙ፣ ወረፋዎን በቀላሉ ይከታተሉ እና ረጅም ወረፋዎችን ያስወግዱ።",
    auth_instant_activation: "ፈጣን ሂሳብ ማግበር",
    auth_preorder: "ምግቦችን በቅድሚያ በቀላሉ ይዘዙ",
    auth_secure: "ደህንነቱ የተጠበቀ ዲጂታል ክፍያ እና ክትትል",

    admin_dashboard: "የአስተዳዳሪ ዳሽቦርድ",
    admin_users: "ተጠቃሚዎች",
    admin_menu: "ማውጫ / ምግቦች",
    admin_categories: "ምድቦች",
    admin_orders: "ትዕዛዞች",
    admin_payments: "ክፍያዎች",
    admin_cancellations: "ስረዛዎች",
    admin_reports: "ሪፖርቶች",
    admin_activity: "የእንቅስቃሴ ምዝግቦች",
    admin_profile: "መገለጫ",
    admin_settings: "ቅንብሮች",
    admin_overview: "የዳሽቦርድ አጠቃላይ እይታ",
    admin_realtime_stats: "ከMongoDB የቀጥታ ስታቲስቲክስ — ከዳታቤዝ በቀጥታ ይዘምናል።",
    admin_refresh: "አድስ",
    admin_autorefresh_off: "ራስ-አድስ ጠፍቷል",
    admin_export: "ላክ",
    admin_last_7: "ያለፉ 7 ቀናት",
    admin_last_30: "ያለፉ 30 ቀናት",
    admin_last_90: "ያለፉ 90 ቀናት",
    admin_custom: "ብጁ",
    admin_total_users: "ጠቅላላ ተጠቃሚዎች",
    admin_customers: "ደንበኞች",
    admin_kitchen_staff: "የኩሽና ሰራተኞች",
    admin_admins: "አስተዳዳሪዎች",
    admin_total_menu: "ጠቅላላ የምግብ ዝርዝር",
    admin_available_now: "አሁን የሚገኝ",
    admin_out_of_stock: "ያለቀ",
    admin_categories_label: "ምድቦች",
    admin_total_orders: "ጠቅላላ ትዕዛዞች",
    admin_pending: "በመጠባበቅ ላይ",
    admin_preparing: "በዝግጅት ላይ",
    admin_ready: "ዝግጁ",
    admin_completed: "የተጠናቀቀ",
    admin_cancelled: "ተሰርዟል",
    admin_successful_payments: "የተሳኩ ክፍያዎች",
    admin_pending_payments: "በመጠባበቅ ላይ ያሉ ክፍያዎች",
    admin_failed_payments: "ያልተሳኩ ክፍያዎች",
    admin_total_revenue: "ጠቅላላ ገቢ",
    admin_order_status_overview: "የትዕዛዝ ሁኔታ አጠቃላይ እይታ",
    admin_revenue_last7: "ገቢ (ያለፉ 7 ቀናት)",
    admin_recent_orders: "የቅርብ ትዕዛዞች",
    admin_recent_payments: "የቅርብ ክፍያዎች",
    admin_view_all: "ሁሉንም ይመልከቱ",
    admin_logout_confirm: "እርግጠኛ ነዎት መውጣት ይፈልጋሉ?",
    admin_main: "ዋና",
    admin_management: "አስተዳደር",
    admin_analytics: "ትንታኔ እና ሪፖርቶች",
    admin_system: "ስርዓት",
    admin_logout: "ውጣ",

    // ===== ADMIN USERS (Amharic) =====
    admin_users_page_title: "የተጠቃሚ አስተዳደር - ስማርት ካፌቴሪያ",
    admin_users_title: "የተጠቃሚ አስተዳደር",
    admin_users_subtitle: "በስርዓቱ ውስጥ ያሉትን ሁሉ ተጠቃሚዎች ያስተዳድሩ",
    admin_user_search: "ተጠቃሚዎችን ፈልግ...",
    add_user: "ተጠቃሚ ጨምር",
    edit_user: "ተጠቃሚ አስተካክል",
    view_details: "ዝርዝር ይመልከቱ",
    change_role: "ምድብ ይለውጡ",
    change_role_for: "ምድብ ይለውጡ ለ",
    reset_password: "የይለፍ ቃል ዳግም አስጀምር",
    reset_password_for: "የይለፍ ቃል ዳግም አስጀምር ለ",
    reset_password_btn: "የይለፍ ቃል ዳግም አስጀምር",
    change_status: "የሂሳብ ሁኔታ ይለውጡ",
    change_status_for: "የሂሳብ ሁኔታ ይለውጡ ለ",
    save_role: "ምድብ አስቀምጥ",
    save_status: "ሁኔታ አስቀምጥ",
    saving: "በማስቀምት ላይ",
    all_users: "ሁሉም ተጠቃሚዎች",
    all_roles: "ሁሉም ምድቦች",
    all_status: "ሁሉም ሁኔታ",
    user_col_user: "ተጠቃሚ",
    user_col_role: "ምድብ",
    user_col_balance: "ሂሳብ",
    user_col_status: "ሁኔታ",
    user_col_joined: "ተቀኝቷል",
    user_col_actions: "ተግባራት",
    user_details: "የተጠቃሚ ዝርዝሮች",
    user_id: "የተጠቃሚ መለያ",
    email_address: "ኢሜይል አድራሻ",
    phone_number: "ስልክ ቁጥር",
    phone_hint: "ስልክ (09XXXXXXXX)",
    wallet_balance: "የዋሌት ሂሳብ (ብር)",
    joined: "ተቀኝቷል",
    role_customer: "ተጠቃሚ",
    role_kitchen: "የኩሽና ሰራተኛ / ምግብ አዘጋጅ",
    role_admin: "አስተዳዳሪ",
    status_active: "ንቁ",
    status_blocked: "ተቋርጧል",
    status_suspended: "Suspended",
    new_password: "አዲስ የይለፍ ቃል",
    new_password_optional: "አዲስ የይለፍ ቃል (ለመቀጠል ባዶ ይተዉ)",
    confirm_password: "የይለፍ ቃል አረጋግጥ",
    total_users: "ጠቅላላ ተጠቃሚዎች",
    active_customers: "ንቁ ደንበኞች",
    staff: "ሰራተኞች",
    blocked_users: "ተቋርጧቸው ተጠቃሚዎች",
    password_required_new: "ለአዲስ ተጠቃሚዎች የይለፍ ቃል ያስፈልጋል",
    user_saved: "ተጠቃሚ በተሳካ ሁኔታ ተዘምኗል",
    failed_save_user: "ተጠቃሚን ማስቀምት አልተቻለም",
    user_not_found: "ተጠቃሚ አልተገኘም",
    role_updated: "ምድብ በተሳካ ሁኔታ ተዘምኗል",
    failed_role: "ምድብ ማዘመን አልተቻለም",
    status_updated: "ሁኔታ በተሳካ ሁኔታ ተዘምኗል",
    failed_status: "ሁኔታ ማዘመን አልተቻለም",
    password_min_6: "የይለፍ ቃል ቢያንስ 6 ቁምፊዎች መሆን አለበት",
    passwords_no_match: "የይለፍ ቃሎች አይመሳሰሉም",
    password_reset_success: "የይለፍ ቃል በተሳካ ሁኔታ ተዘምኗል",
    failed_password_reset: "የይለፍ ቃል ማስቀምት አልተቻለም",
    user_deactivated: "ተጠቃሚ በተሳካ ሁኔታ ተቦዝዩዋል",
    failed_delete: "ተጠቃሚን ማቦዝየት አልተቻለም",
    confirm_delete_user: 'ተጠቃሚ "{name}" ይቦዝዩ? ከሀሳብ ይSES አይችሉም።',
    cannot_deactivate_own: "የራስዎን ሂሳብ ማቦዝየት አይችሉም",
    page_info: "ገጹ {page} ከ {pages} ({total} ተጠቃሚዎች)",

    kitchen_title: "የኩሽና ማሳያ ስርዓት",
    kitchen_station: "ጣቢያ 1",
    kitchen_manage_queue: "ሙሉ ወረፋ አስተዳድር",
    kitchen_pending: "በመጠባበቅ ላይ ያለ ኩሽና",
    kitchen_preparing: "በዝግጅት ላይ",
    kitchen_ready: "ለመውሰድ ዝግጁ",
    kitchen_live_sync: "ቀጥታ ማመሳሰል ንቁ ነው",
    kitchen_access_denied: "መዳረሻ ተከልክሏል። የኩሽና ሰራተኞች እና አስተዳዳሪዎች ብቻ።",

    loading: "በመጫን ላይ...",
    loading_menu: "ምግቦችን በመጫን ላይ...",
    unable_load_menu: "ምግቦችን መጫን አልተቻለም",
    check_connection: "ምግቦችን ማግኘት አልቻልንም። እባክዎ ግንኙነትዎን ያረጋግጡ እና እንደገና ይሞክሩ።",
    try_again: "እንደገና ሞክር",
    search: "ፈልግ",
    filter: "ማጣሪያ",
    sort: "ደርድር",
    price: "ዋጋ",
    category: "ምድብ",
    description: "መግለጫ",
    quantity: "ብዛት",
    total: "ጠቅላላ",
    subtotal_label: "ንዑስ ድምር",
    tax: "ግብር",
    discount: "ቅናሽ",
    remove: "አስወግድ",
    edit: "አስተካክል",
    delete: "ሰርዝ",
    save: "አስቀምጥ",
    cancel: "ሰርዝ",
    confirm: "አረጋግጥ",
    close: "ዝጋ",
    back: "ተመለስ",
    next: "ቀጣይ",
    previous: "ቀዳሚ",
    error: "ስህተት",
    success: "ተሳክቷል",
    warning: "ማስጠንቀቂያ",
    info: "መረጃ",
    no_data: "ምንም መረጃ የለም",
    please_wait: "እባክዎ ይጠብቁ...",
    home: "መነሻ",
    login: "ግባ",
    register: "ተመዝገብ",
    logout: "ውጣ",
    menu: "ማውጫ",
    cart: "ካርት",
    checkout: "ክፍያ",
    profile: "መገለጫ",
    settings: "ቅንብሮች",
    language: "ቋንቋ",
    dashboard: "ዳሽቦርድ",
    orders: "ትዕዛዞች",
    orderHistory: "የትዕዛዝ ታሪክ",
    orderTracking: "ትዕዛዝ ክትትል",
    notifications: "ማስታወቂያዎች",
    feedback: "አስተያየት",
    success_added: "ምግቡ ወደ ካርት ታክሏል!",
    success_removed: "ምግቡ ከካርት ተወግዷል!",
    order_confirmed: "ትዕዛዙ ተረጋግጧል!",
    no_menu_items: "ምንም የምግብ ዝርዝር አልተገኘም"
},
  om: {
    nav_home: "Mana",
    nav_menu: "Menyuu",
    nav_cart: "Kaartii",
    nav_track: "Amma Aadaa",
    nav_history: "Aadaawwan Koottu",
    nav_profile: "Profaayilii Koottu",
    nav_logout: "Ba'uu",
    nav_login: "Seenuu",
    nav_register: "Galgalaa",
    nav_notifications: "Odeeffannoo",
    nav_feedback: "Fageenya",
    nav_admin: "Haadha",
    nav_kitchen: "Mana Caccabsaa",

    navHome: "Mana",
    navMenu: "Menyuu",
    navHow: "Akkamitti Jira",
    navFeatures: "Tayyoota",
    navTestimonials: "Raawwii",
    navLogin: "Seenuu",
    navRegister: "Galgalaa",
    banner1Title: "Gabbachisa Quraa Bagaa",
    banner1Desc: "Gadi gadi bishaan quraa jireenya bagaa 20% olitti!",
    banner2Title: "Migaa fi Guyyaa Bagaa",
    banner2Desc: "Shiroo, Sigaa Firfir, fi Salladaaddaa quraa quraa kan jiru.",
    banner3Title: "Sukke fi Bunna Caccabsaa",
    banner3Desc: "Migaa kee Macchiato bagaa fi Jusuu Sprice Qabaxii fi tajaajila.",
    howTitle: "Akkamitti Jira",
    howSubtitle: "Migaa keessan waggaa sadanii qofa jiruun galgalaa",
    step1Title: "Menyuu Dubbisuu",
    step1Desc: "Migaa yeroo baay'ee meeshaa yeroo argachuuf dubbisuu",
    step2Title: "Galgalaa fi Kaffaltii",
    step2Desc: "Migaa kaartii tiin jijjiiruu fi TeleBirr ama CBE Birr qofa kaffaltii",
    step3Title: "Tajaajila fi Qabachuun",
    step3Desc: "Amma aadaa keessan akka jiru tajaajilaa fi qabachuu",
    menuPreviewTitle: "Migaa Gabaabaa",
    menuPreviewSubtitle: "Migaa gabaabaa keessan dubbisuu",
    viewFullMenuBtn: "Menyuu Guutuu Dubbisuu",
    whyTitle: "Maaliif Isin Deeemu?",
    whySubtitle: "Tayyoota isin bagaa gahee kan systeemu keessan",
    feat1Title: "Lafaa Hin Jiru",
    feat1Desc: "Lafaa fida duraa malee migaa keessan qofa galgalaa",
    feat2Title: "Meeshaa Hunda Wajjin Galgalaa",
    feat2Desc: "Meeshaa hunda wajjin kampuusa migaa keessan qofa galgalaa",
    feat3Title: "Odeeffannoo Qofa",
    feat3Desc: "Hordoffa aadaa keessan caccabsaa fi qabachuu mana caccabsaa",
    feat4Title: "Kaffaltii Qofa",
    feat4Desc: "Kaffaltii dijitaalaa TeleBirr fi CBE Birr qofa deemaa",
    feat5Title: "Aadaa Durii",
    feat5Desc: "Aadaa duraa fi tarree kan mirgaa yeroo hunda dubbachuu",
    feat6Title: "Raawwii Daldalaa",
    feat6Desc: "Raawwii goggogaa guddinaa fi kafaasii haadhaa",
    testTitle: "Balaa'ummaakeen Maali Yoo Ta'u?",
    testSubtitle: "Balaa'ummaa isin kennu fageenya systeemu keessan",
    test1Quote: '"Systeemu kun na gadi fida duraa keessa caasaluu dhaabuuf gargaarsa! Qofa galgalaa jiruuf odeeffannoo qabachuuf hubachuuf."',
    test2Quote: '"Dashboard kana caccabsaa bagaa dha! Aadawwan dubbachuu fi amma isaanii qofa goggogaa."',
    test3Quote: '"Panel haadhaa dabalata hundaa qaban. Raawwii dhiiraatan gargaarsa!"',
    footerAbout: "Systeemu galgalaa mana caccabsaa haaraa kan migaa galgalaa qofa, qofa, fi danda'uuf jiru.",

    menu_title: "Migaa fi Deemuu Bagaa",
    menu_subtitle: "Migaa quraa mana caccabsaa keessatti wajjin dubbisuu fi galgalaa",
    menu_hero_title: "Migaa Itoophiyaa, Bunna fi Pastry",
    menu_hero_subtitle: "Migaa aadaa bagaa, bunna Itoophiyaa quraa caccabsaa, fi keki bakarii bagaa.",
    search_placeholder: "Migaa fi deemuu barbaaduu...",
    search_placeholder_menu: "Migaa, bunna, keki barbaaduu...",
    search_placeholder_mobile: "Migaa menyuu barbaaduu...",
    cat_all: "Hundumaa",
    cat_breakfast: "Quraa",
    cat_mains: "Migaa Gabaabaa",
    cat_fasting: "Migaa Ts'oomii",
    cat_beverages: "Deemuwwan",
    cat_snacks: "Caccabsaa Xiqqaa",
    cat_fasting_meals: "Migaa Soomaa",
    add_to_cart: "Kaartii Dabaluu",
    add: "Dabaluu",
    unavailable: "Hin Argachuun",
    available: "Argachuu",
    not_available: "Hin Argachuun",
    currency: "ETB",
    price: "Qiiwwa",
    results_loading: "Menyuu qabachuuf jiru...",
    results_count: "Menyuu qabachuuf jiru...",
    sort_by: "Qaamachuu:",
    sort_name: "Maqaa",
    sort_low_high: "Qiiwwa: Gadiitti Gabaabaatti",
    sort_high_low: "Qiiwwa: Gabaabaatti Gadiitti",
    no_results_title: "Migaa fi Deemuu Hama Argaman",
    no_results_desc: "Barbaachisaa keessanii gabaachu male. Migaa, deemuwwan, ama caccabsaa xiwwaa barbaaduu!",
    reset_filters: "Filteeroota Deebi'uu",

    cart_title: "Kaartii Gadaa Keessan",
    cart_subtitle: "Galgalaatti hundaan migaa filatame keessan dubbisuu",
    cart_my_cart: "Kaartii Migaa Koottu",
    cart_back_to_menu: "Menyuu Deebi'uu",
    cart_item: "Migaa",
    cart_price: "Qiiwwa",
    cart_quantity: "Meqaa",
    cart_total: "Dhibee",
    cart_empty: "Kaartii keessan boodaa!",
    cart_browse_btn: "Menyuu Dubbisuu",
    cart_clear_btn: "Kaartii Calaaluu",
    cart_clear_all: "Hundumaa Calaaluu",
    cart_checkout_btn: "Kaffaltii Jiru",
    cart_order_items: "Migaa Aadaa",
    cart_add_more: "Migaa Dabalataa Dabaluu",
    order_summary: "Kumaa Aadaa",
    subtotal: "Dhibee Kutaa",
    service_fee: "Qiiwwa Tajaajilaa",
    grand_total: "Qiiwwa Dhibee",
    total_amount: "Qiiwwa Dhibee",
    order_review: "Aadaa Dubbachuu",

    checkout_title: "Kaffaltii fi Dubbachuu",
    checkout_subtitle: "Filannoo migaa fi odeeffannoo walqabatu keessan dhaabbisuu",
    checkout_header: "Kaffaltii",
    back_to_cart: "Kaartii Deebi'uu",
    dining_option: "Filannoo Migaa",
    dine_in: "Mana Caccabsaa Keessa",
    takeaway: "Qabachuu",
    table_number: "Lakkoofsa Miizee",
    contact_details: "Odeeffannoo Walqabatu",
    full_name: "Maqaa Guutuu",
    phone_number: "Lakkoofsa Bilbilaa",
    payment_method: "Hojii Kaffaltii",
    place_order_btn: "Aadaa Galgalaa",
    confirm_order: "Aadaa Hubachuu",
    telebirr: "Telebirr",
    chapa: "Chapa",
    cbe_birr: "CBE Birr",
    chapa_test_mode: "Hojii Tajaajila Chapa",

    history_title: "Tarree Aadaawwan Koottu",
    history_subtitle: "Aadaawwan duraa fi qofa jiru wajjin dubbachuu",
    history_header: "Tarree Aadaa",
    all_orders: "Aadaawwan Hundumaa",
    completed: "Dhibbee",
    pending: "Jirutti",
    in_progress: "Waliigalaa / Jirutti",
    cancelled: "Baay'ee",
    clear_history: "Tarree Calaaluu",
    no_orders: "Tarree aadaa hin argaman",
    order_id: "ID Aadaa",
    order_date: "Guyyaa",
    order_type: "Ala",
    order_status: "Amma",
    status_pending: "Jirutti",
    status_preparing: "Caccabsaa Jiru",
    status_ready: "Qabachuuf Qaba",
    status_served: "Kennamaniin",
    status_cancelled: "Baay'ee",
    status_completed: "Dhibbee",
    view_details: "Ballinaa Dubbachuu",
    reorder_btn: "Dabalee Galgalaa",
    track_order: "Aadaa Tajaajilaa",
    track_active_order: "Aadaa Qofa Tajaajilaa",
    live_order_tickets: "Tikikii Aadaa Qofa",

    profile_title: "Profaayilii Koottu",
    profile_account_details: "Ballinaa Haalaa",
    profile_manage: "Odeeffannoo walqabatu fi filannoo kaffaltii aadaa aadaa qofa qofa.",
    profile_personal_details: "Ballinaa Biraa",
    profile_checkout_prefs: "Filannoo Aadaa Aadaa",
    profile_full_name: "Maqaa Guutuu",
    profile_phone: "Lakkoofsa Bilbilaa",
    profile_email: "Adeeysa Imeelii",
    profile_lang_pref: "Filannoo Afaan",
    profile_preferred_order: "Aadaa Kan Mirgii",
    profile_default_table: "Miizee / Ofiisa Aadaa",
    profile_save: "Goggogaa Kabbashuu",
    profile_member: "Aalada Mana Caccabsaa",
    profile_account_settings: "Qindaa'ina Haalaa",
    profile_save_success: "Profaayilii bagaa qindeessite",

    auth_welcome_back: "Bagaa Nagaan Dhuftan",
    auth_signin_subtitle: "Haalaa mana caccabsaa keessan jiruun seenuu.",
    auth_phone_email: "Bilbilaa ama Imeeli",
    auth_password: "Jechaa Sirrii",
    auth_forgot: "Jechaa Sirrii Hubate?",
    auth_login_btn: "Haalaa Seenuu",
    auth_no_account: "Haalaa Hin Qabne?",
    auth_create_account: "Haalaa Uumuu",
    auth_back_home: "Mana Deebi'uu",
    auth_good_food: "Migaa bagaa, mootummaa bagaa.",
    auth_welcome_desc: "Bagaa nagaan dhufte Smart Cafeteria. Migaa jaalala keessan qofa, qofa galgalaa fi mootummaa mana caccabsaa bagaa argachuu.",
    auth_quick_ordering: "Galgalaa Xinnaa",
    auth_easy_cart: "Kaartii Qofa",
    auth_order_tracking: "Aadaa Tajaajilaa",
    auth_create_title: "Haalaa Uumuu",
    auth_create_subtitle: "Smart Cafeteria wajjin jiruun ballinaa keessan buusuu.",
    auth_full_name: "Maqaa Guutuu",
    auth_email: "Adeeysa Imeelii",
    auth_phone: "Lakkoofsa Bilbilaa",
    auth_confirm_password: "Jechaa Sirrii Hubachuu",
    auth_register_btn: "Haalaa Galgalaa",
    auth_has_account: "Hunda haalaa qaba?",
    auth_sign_in: "Seenuu",
    auth_smart_dining: "Migaa Daldalaa, qofa ta'e.",
    auth_join_desc: "Boran Smart Cafeteria aanaa jiraachuu, migaa kampuusa jaalala keessan galgalaa, amma lafaa keessan qofa tajaajilaa, fi lafaa fida duree si wayyu.",
    auth_instant_activation: "Haalaa Xinnaa Fufuu",
    auth_preorder: "Migaa Qophaa Qofa Galgalaa",
    auth_secure: "Kaffaltii Dijitaalaa Amannaa fi Tajaajilaa",

    admin_dashboard: "Dashboard Haadhaa",
    admin_users: "Balaa'ummaa",
    admin_menu: "Menyuu / Migaa",
    admin_categories: "Qaammoota",
    admin_orders: "Aadaawwan",
    admin_payments: "Kaffaltii",
    admin_cancellations: "Baay'yuu",
    admin_reports: "Raawwii",
    admin_activity: "Raawwii Hojii",
    admin_profile: "Profaayilii",
    admin_settings: "Qindaa'ina",
    admin_overview: "Mul'isa Dashboard",
    admin_realtime_stats: "Statistika qofa MongoDB irraa — qofa dattabaasii wajjin deebi'aman.",
    admin_refresh: "Goggogaa",
    admin_autorefresh_off: "Goggogaa-awwaa OFF",
    admin_export: "Baasuu",
    admin_last_7: "Torba 7 Guyyaa",
    admin_last_30: "Torba 30 Guyyaa",
    admin_last_90: "Torba 90 Guyyaa",
    admin_custom: "Biraa",
    admin_total_users: "Balaa'ummaa Dhibee",
    admin_customers: "Dhiibbaa'oota",
    admin_kitchen_staff: "Hojjettoota Mana Caccabsaa",
    admin_admins: "Haadhaalee",
    admin_total_menu: "Migaa Menyuu Dhibee",
    admin_available_now: "Ammaan Argachuu",
    admin_out_of_stock: "Baay'ee",
    admin_categories_label: "Qaammoota",
    admin_total_orders: "Aadaawwan Dhibee",
    admin_pending: "Jirutti",
    admin_preparing: "Caccabsaa Jiru",
    admin_ready: "Qaba",
    admin_completed: "Dhibbee",
    admin_cancelled: "Baay'ee",
    admin_successful_payments: "Kaffaltii Dhibbee",
    admin_pending_payments: "Kaffaltii Jirutti",
    admin_failed_payments: "Kaffaltii Baay'ee",
    admin_total_revenue: "Goggogaa Dhibee",
    admin_order_status_overview: "Mul'isa Amma Aadaa",
    admin_revenue_last7: "Goggogaa (Torba 7 Guyyaa)",
    admin_recent_orders: "Aadaawwan Duree",
    admin_recent_payments: "Kaffaltii Duree",
    admin_view_all: "Hundumaa Dubbachuu",
    admin_logout_confirm: "Ba'uuf isaan si hubachuu?",
    admin_main: "GABAABAA",
    admin_management: "HAADHANNAA",
    admin_analytics: "DUBBACHUU FI RAWWII",
    admin_system: "SISTEEMAA",
    admin_logout: "Ba'uu",

    kitchen_title: "Sisteemaa Mul'isa Mana Caccabsaa",
    kitchen_station: "Bukkoo 1",
    kitchen_manage_queue: "Lafaa Guutuu Haadhuu",
    kitchen_pending: "Mana Caccabsaa Jirutti",
    kitchen_preparing: "Caccabsaa Jiru",
    kitchen_ready: "Qabachuuf Qaba",
    kitchen_live_sync: "Waliigalaa Qofa Argaman",
    kitchen_access_denied: "Bilisa deebi'e. Hojjettoota mana caccabsaa fi haadhaalee qofa.",

    loading: "Qabachuuf jiru...",
    loading_menu: "Menyuu qabachuuf jiru...",
    unable_load_menu: "Menyuu Qabachuu Dhiibbaa",
    check_connection: "Menyuu gargaaru male. Maaloo walqabatuu keessan hubachuu fi dabaluu.",
    try_again: "Dabaluu",
    search: "Barbaaduu",
    filter: "Filteerii",
    sort: "Qaamachuu",
    price: "Qiiwwa",
    category: "Qaammoo",
    description: "Ibsaa",
    quantity: "Meqaa",
    total: "Dhibee",
    subtotal_label: "Dhibee Kutaa",
    tax: "Kaanisa",
    discount: "Goggisa",
    remove: "Calaaluu",
    edit: "Gogguusuu",
    delete: "Baay'uu",
    save: "Kabbashuu",
    cancel: "Baay'uu",
    confirm: "Hubachuu",
    close: "Dafkaa",
    back: "Deebi'uu",
    next: "Kebba",
    previous: "Dura",
    error: "Kalaalloo",
    success: "Dhibbee",
    warning: "Iyyannoo",
    info: "Odeeffannoo",
    no_data: "Odeeffannoo hin jiru",
    please_wait: "Maaloo ni jiru...",
    home: "Mana",
    login: "Seenuu",
    register: "Galgalaa",
    logout: "Ba'uu",
    menu: "Menyuu",
    cart: "Kaartii",
    checkout: "Kaffaltii",
    profile: "Profaayilii",
    settings: "Qindaa'ina",
    language: "Afaan",
    dashboard: "Dashboard",
    orders: "Aadaawwan",
    orderHistory: "Tarree Aadaa",
    orderTracking: "Aadaa Tajaajilaa",
    notifications: "Odeeffannoo",
    feedback: "Fageenya",
    success_added: "Migaa kaartii dabale!",
    success_removed: "Migaa kaartii calale!",
    order_confirmed: "Aadaa hubachii!",
    no_menu_items: "Migaa menyuu hin argaman"
  }
};

const directTextMap = {
  "Home": { en: "Home", am: "መነሻ" },
  "Menu": { en: "Menu", am: "ማውጫ" },
  "Cart": { en: "Cart", am: "ካርት" },
  "Track Active Order": { en: "Track Active Order", am: "የትዕዛዝ ሁኔታ" },
  "Track Order": { en: "Track Order", am: "ትዕዛዝ መከታተያ" },
  "My Orders": { en: "My Orders", am: "ትዕዛዞቼ" },
  "Order History": { en: "Order History", am: "የትዕዛዝ ታሪክ" },
  "History": { en: "History", am: "ታሪክ" },
  "My Profile": { en: "My Profile", am: "መገለጫዬ" },
  "Profile": { en: "Profile", am: "መገለጫ" },
  "Logout": { en: "Logout", am: "ውጣ" },
  "Login": { en: "Login", am: "ግባ" },
  "Register": { en: "Register", am: "ተመዝገብ" },
  "Back to Menu": { en: "Back to Menu", am: "ወደ ማውጫ ተመለስ" },
  "Back to Cart": { en: "Back to Cart", am: "ወደ ካርት ተመለስ" },
  "Browse Menu": { en: "Browse Menu", am: "ምግቦችን ይመልከቱ" },
  "Add More Food": { en: "Add More Food", am: "ተጨማሪ ምግብ ጨምር" },
  "Add to Cart": { en: "Add to Cart", am: "ወደ ካርት ጨምር" },
  "Add": { en: "Add", am: "ጨምር" },
  "Clear Cart": { en: "Clear Cart", am: "ካርት አፅዳ" },
  "Clear All": { en: "Clear All", am: "ሁሉንም አፅዳ" },
  "Clear History": { en: "Clear History", am: "ታሪክ አፅዳ" },
  "Full Name": { en: "Full Name", am: "ሙሉ ስም" },
  "Phone Number": { en: "Phone Number", am: "ስልክ ቁጥር" },
  "Email Address": { en: "Email Address", am: "ኢሜይል አድራሻ" },
  "Table Number": { en: "Table Number", am: "የጠረጴዛ ቁጥር" },
  "Dining Option": { en: "Dining Option", am: "የመመገቢያ አማራጭ" },
  "Dine-In": { en: "Dine-In", am: "በቦታው ለመመገብ" },
  "Takeaway": { en: "Takeaway", am: "ለይዞ መሄድ" },
  "Payment Method": { en: "Payment Method", am: "የክፍያ ዘዴ" },
  "Telebirr": { en: "Telebirr", am: "ቴሌብር" },
  "Chapa": { en: "Chapa", am: "ቻፓ" },
  "CBE Birr": { en: "CBE Birr", am: "CBE ብር" },
  "Place Order": { en: "Place Order", am: "ትዕዛዝ ፈጽም" },
  "Confirm Order": { en: "Confirm Order", am: "ትዕዛዝ አረጋግጥ" },
  "Proceed to Checkout": { en: "Proceed to Checkout", am: "ወደ ክፍያ ሂድ" },
  "Order Summary": { en: "Order Summary", am: "የትዕዛዝ ማጠቃለያ" },
  "Order Review": { en: "Order Review", am: "የትዕዛዝ ማጠቃለያ" },
  "Order Items": { en: "Order Items", am: "የትዕዛዝ ዕቃዎች" },
  "Subtotal": { en: "Subtotal", am: "ንዑስ ድምር" },
  "Service Fee": { en: "Service Fee", am: "የአገልግሎት ክፍያ" },
  "Total Amount": { en: "Total Amount", am: "ጠቅላላ ክፍያ" },
  "Total": { en: "Total", am: "ጠቅላላ" },
  "Price": { en: "Price", am: "ዋጋ" },
  "Quantity": { en: "Quantity", am: "ብዛት" },
  "Item": { en: "Item", am: "ምግብ" },
  "Checkout": { en: "Checkout", am: "ክፍያ" },
  "My Food Cart": { en: "My Food Cart", am: "የምግብ ካርቴ" },
  "Contact Details": { en: "Contact Details", am: "የግል መረጃ" },
  "Dashboard": { en: "Dashboard", am: "ዳሽቦርድ" },
  "Dashboard Overview": { en: "Dashboard Overview", am: "የዳሽቦርድ አጠቃላይ እይታ" },
  "Total Users": { en: "Total Users", am: "ጠቅላላ ተጠቃሚዎች" },
  "Customers": { en: "Customers", am: "ደንበኞች" },
  "Kitchen Staff": { en: "Kitchen Staff", am: "የኩሽና ሰራተኞች" },
  "Admins": { en: "Admins", am: "አስተዳዳሪዎች" },
  "Total Menu Items": { en: "Total Menu Items", am: "ጠቅላላ የምግብ ዝርዝር" },
  "Available Now": { en: "Available Now", am: "አሁን የሚገኝ" },
  "Out of Stock": { en: "Out of Stock", am: "ያለቀ" },
  "Categories": { en: "Categories", am: "ምድቦች" },
  "Total Orders": { en: "Total Orders", am: "ጠቅላላ ትዕዛዞች" },
  "Pending": { en: "Pending", am: "በመጠባበቅ ላይ" },
  "Preparing": { en: "Preparing", am: "በዝግጅት ላይ" },
  "Ready": { en: "Ready", am: "ዝግጁ ነው" },
  "Completed": { en: "Completed", am: "የተጠናቀቀ" },
  "Cancelled": { en: "Cancelled", am: "ተሰርዟል" },
  "Successful Payments": { en: "Successful Payments", am: "የተሳኩ ክፍያዎች" },
  "Pending Payments": { en: "Pending Payments", am: "በመጠባበቅ ላይ ያሉ ክፍያዎች" },
  "Failed Payments": { en: "Failed Payments", am: "ያልተሳኩ ክፍያዎች" },
  "Total Revenue": { en: "Total Revenue", am: "ጠቅላላ ገቢ" },
  "All Orders": { en: "All Orders", am: "ሁሉም ትዕዛዞች" },
  "Refresh": { en: "Refresh", am: "አድስ" },
  "Export": { en: "Export", am: "ላክ" },
  "View All": { en: "View All", am: "ሁሉንም ይመልከቱ" },
  "Auto-refresh OFF": { en: "Auto-refresh OFF", am: "ራስ-አድስ ጠፍቷል" },
  "Kitchen Display System": { en: "Kitchen Display System", am: "የኩሽና ማሳያ ስርዓት" },
  "Station 1": { en: "Station 1", am: "ጣቢያ 1" },
  "Manage Full Queue": { en: "Manage Full Queue", am: "ሙሉ ወረፋ አስተዳድር" },
  "Pending Kitchen": { en: "Pending Kitchen", am: "በመጠባበቅ ላይ ያለ ኩሽና" },
  "In Preparation": { en: "In Preparation", am: "በዝግጅት ላይ" },
  "Ready For Pickup": { en: "Ready For Pickup", am: "ለመውሰድ ዝግጁ" },
  "Live Sync Active": { en: "Live Sync Active", am: "ቀጥታ ማመሳሰል ንቁ ነው" },
  "Live Order Tickets": { en: "Live Order Tickets", am: "የቀጥታ ትዕዛዝ ቲኬቶች" },
  "All": { en: "All", am: "ሁሉም" },
  "Breakfast": { en: "Breakfast", am: "ቁርስ" },
  "Main Meals": { en: "Main Meals", am: "ዋና ምግቦች" },
  "Fasting": { en: "Fasting", am: "የፆም" },
  "Fasting Meals": { en: "Fasting Meals", am: "የፆም ምግቦች" },
  "Beverages": { en: "Beverages", am: "መጠጦች" },
  "Snacks": { en: "Snacks", am: "መክሰስ" },
  "Name": { en: "Name", am: "ስም" },
  "Account Settings": { en: "Account Settings", am: "የሂሳብ ቅንብሮች" },
  "Account Details": { en: "Account Details", am: "የሂሳብ ዝርዝሮች" },
  "Cafeteria Member": { en: "Cafeteria Member", am: "የካፌቴሪያ አባል" },
  "Save Changes": { en: "Save Changes", am: "ለውጦችን አስቀምጥ" },
  "Welcome back": { en: "Welcome back", am: "እንኳን ደህና መጡ" },
  "Create Account": { en: "Create Account", am: "ሂሳብ ፍጠር" },
  "Smart Cafeteria": { en: "Smart Cafeteria", am: "ስማርት ካፌቴሪያ" },
  // Search placeholders
  "Search food, coffee, cakes...": { en: "Search food, coffee, cakes...", am: "ምግብ፣ ቡና፣ ኬኮች ፈልግ..." },
  "Search menu items...": { en: "Search menu items...", am: "ምግቦችን ፈልግ..." },
  "Search food items...": { en: "Search food items...", am: "ምግብ ወይም መጠጥ ፈልግ..." },
  "Search orders...": { en: "Search orders...", am: "ትዕዛዞችን ፈልግ..." },
  "Search payments...": { en: "Search payments...", am: "ክፍያዎችን ፈልግ..." },
  // Cart & menu extra
  "Loading menu...": { en: "Loading menu...", am: "ምግቦችን በመጫን ላይ..." },
  "Menu unavailable": { en: "Menu unavailable", am: "ምግብ ዝርዝር አይገኝም" },
  "Your cart is empty": { en: "Your cart is empty", am: "ካርትዎ ባዶ ነው!" },
  "Add some delicious food from the menu.": { en: "Add some delicious food from the menu.", am: "ከማውጫው አንዳንድ ጣፋጭ ምግቦችን ይጨምሩ።" },
  "Delicious item from our kitchen.": { en: "Delicious item from our kitchen.", am: "ከኩሽናችን ጣፋጭ ምግብ።" },
  "Sort by:": { en: "Sort by:", am: "ደርድር በ:" },
  "Order Items": { en: "Order Items", am: "የትዕዛዝ ዕቃዎች" },
  "Your cart is empty!": { en: "Your cart is empty!", am: "ካርትዎ ባዶ ነው!" },
  "We couldn't find anything matching your search. Try searching for food, beverages, or snacks!": { en: "We couldn't find anything matching your search. Try searching for food, beverages, or snacks!", am: "ከፍለጋዎ ጋር የሚዛመድ ምንም ነገር ማግኘት አልቻልንም። ምግብ፣ መጠጥ ወይም መክሰስ ይፈልጉ!" },
  "No Food or Drink Items Found": { en: "No Food or Drink Items Found", am: "ምንም ምግብ ወይም መጠጥ አልተገኘም" },
  "Reset Filters": { en: "Reset Filters", am: "ማጣሪያዎችን ዳግም አስጀምር" },
  "Available": { en: "Available", am: "ይገኛል" },
  "Not Available": { en: "Not Available", am: "አይገኝም" },
  "Unavailable": { en: "Unavailable", am: "አይገኝም" },
  "Try Again": { en: "Try Again", am: "እንደገና ሞክር" },
  "Unable to Load Menu": { en: "Unable to Load Menu", am: "ምግቦችን መጫን አልተቻለም" },
  "We couldn't reach the menu right now. Please check your connection and try again.": { en: "We couldn't reach the menu right now. Please check your connection and try again.", am: "ምግቦችን ማግኘት አልቻልንም። እባክዎ ግንኙነትዎን ያረጋግጡ እና እንደገና ይሞክሩ።" },
  "Good food, good mood.": { en: "Good food, good mood.", am: "ጥሩ ምግብ፣ ጥሩ ስሜት።" },
  "Welcome back to Smart Cafeteria. Order your favorite meals quickly, conveniently, and enjoy a smarter cafeteria experience.": { en: "Welcome back to Smart Cafeteria. Order your favorite meals quickly, conveniently, and enjoy a smarter cafeteria experience.", am: "እንኳን ወደ ስማርት ካፌቴሪያ በደህና መጡ። ተወዳጅ ምግቦችዎን በፍጥነት፣ በቀላሉ ይዘዙ እና ብልህ የካፌቴሪያ ተሞክሮ ይደሰቱ።" },
  "Sign in to continue to your cafeteria account.": { en: "Sign in to continue to your cafeteria account.", am: "ወደ ካፌቴሪያ ሂሳብዎ ለመቀጠል ይግቡ።" },
  "Phone or Email": { en: "Phone or Email", am: "ስልክ ወይም ኢሜይል" },
  "Password": { en: "Password", am: "የይለፍ ቃል" },
  "Forgot password?": { en: "Forgot password?", am: "የይለፍ ቃል ረሱ?" },
  "Login to Account": { en: "Login to Account", am: "ወደ ሂሳብ ግባ" },
  "Don't have an account?": { en: "Don't have an account?", am: "ሂሳብ የለዎትም?" },
  "Create an account": { en: "Create an account", am: "ሂሳብ ፍጠር" },
  "Back to Home Page": { en: "Back to Home Page", am: "ወደ መነሻ ተመለስ" },
  "Quick Ordering": { en: "Quick Ordering", am: "ፈጣን ትዕዛዝ" },
  "Easy Cart": { en: "Easy Cart", am: "ቀላል ካርት" },
  "Order Tracking": { en: "Order Tracking", am: "ትዕዛዝ መከታተያ" },
  "Create Account": { en: "Create Account", am: "ሂሳብ ፍጠር" },
  "Fill in your details to get started with Smart Cafeteria.": { en: "Fill in your details to get started with Smart Cafeteria.", am: "ከስማርት ካፌቴሪያ ጋር ለመጀመር ዝርዝሮችዎን ይሙሉ።" },
  "Full Name": { en: "Full Name", am: "ሙሉ ስም" },
  "Confirm Password": { en: "Confirm Password", am: "የይለፍ ቃል አረጋግጥ" },
  "Register Account": { en: "Register Account", am: "ሂሳብ መዝግብ" },
  "Already have an account?": { en: "Already have an account?", am: "አስቀድሞ ሂሳብ አለዎት?" },
  "Sign in": { en: "Sign in", am: "ግባ" },
  "Smart dining, simplified.": { en: "Smart dining, simplified.", am: "ብልህ አመጋገብ፣ ቀላል የተደረገ።" },
  "Join Smart Cafeteria today to order your favorite campus meals, track your queue status seamlessly, and avoid long lines.": { en: "Join Smart Cafeteria today to order your favorite campus meals, track your queue status seamlessly, and avoid long lines.", am: "ዛሬ የስማርት ካፌቴሪያ አባል ይሁኑ ተወዳጅ የካምፓስ ምግቦችዎን ይዘዙ፣ ወረፋዎን በቀላሉ ይከታተሉ እና ረጅም ወረፋዎችን ያስወግዱ።" },
  "Instant Account Activation": { en: "Instant Account Activation", am: "ፈጣን ሂሳብ ማግበር" },
  "Pre-order Meals Easily": { en: "Pre-order Meals Easily", am: "ምግቦችን በቅድሚያ በቀላሉ ይዘዙ" },
  "Secure Digital Payments & Tracking": { en: "Secure Digital Payments & Tracking", am: "ደህንነቱ የተጠበቀ ዲጂታል ክፍያ እና ክትትል" },
  "Ethiopian Food, Coffee & Pastry": { en: "Ethiopian Food, Coffee & Pastry", am: "የኢትዮጵያ ምግብ፣ ቡና እና ፓስትሪ" },
  "Authentic traditional meals, freshly brewed Ethiopian coffee, and delicious bakery cakes.": { en: "Authentic traditional meals, freshly brewed Ethiopian coffee, and delicious bakery cakes.", am: "ባህላዊ ምግቦች፣ ትኩስ የኢትዮጵያ ቡና እና ጣፋጭ ኬኮች።" },
  // Common actions
  "View Details": { en: "View Details", am: "ዝርዝር ይመልከቱ" },
  "Track Active Order": { en: "Track Active Order", am: "የትዕዛዝ ሁኔታ" },
  "Order History": { en: "Order History", am: "የትዕዛዝ ታሪክ" },
  "Notifications": { en: "Notifications", am: "ማስታወቂያዎች" },
  "Feedback": { en: "Feedback", am: "አስተያየት" },
  "Account Settings": { en: "Account Settings", am: "የሂሳብ ቅንብሮች" },
  "Account Details": { en: "Account Details", am: "የሂሳብ ዝርዝሮች" },
  "Cafeteria Member": { en: "Cafeteria Member", am: "የካፌቴሪያ አባል" },
  "Save Changes": { en: "Save Changes", am: "ለውጦችን አስቀምጥ" },

  // ===== AUTH PAGE HEADLINE FRAGMENTS =====
  "good mood.": { en: "good mood.", am: "ጥሩ ስሜት።" },
  "simplified.": { en: "simplified.", am: "ቀላል የተደረገ።" },
  "Cafeteria": { en: "Cafeteria", am: "ካፌቴሪያ" },

  // ===== PROFILE PAGE =====
  "Customer": { en: "Customer", am: "ደንበኛ" },
  "No phone added": { en: "No phone added", am: "ስልክ አልተጨመረም" },
  "Personal Details": { en: "Personal Details", am: "የግል ዝርዝሮች" },
  "Username": { en: "Username", am: "የተጠቃሚ ስም" },
  "Language Preference": { en: "Language Preference", am: "የቋንቋ ምርጫ" },
  "Address": { en: "Address", am: "አድራሻ" },
  "Default Checkout Preferences": { en: "Default Checkout Preferences", am: "ነባሪ የክፍያ ምርጫዎች" },
  "Preferred Order Type": { en: "Preferred Order Type", am: "የሚመረጥ የትዕዛዝ አይነት" },
  "Dine-In (Cafeteria Table)": { en: "Dine-In (Cafeteria Table)", am: "በቦታው መመገብ (የካፌቴሪያ ጠረጴዛ)" },
  "Takeaway / Express Pick-up": { en: "Takeaway / Express Pick-up", am: "ለይዞ መሄድ / ፈጣን መልቀሚያ" },

  // ===== ORDER HISTORY / TRACKING =====
  "In Progress / Pending": { en: "In Progress / Pending", am: "በሂደት ላይ / በመጠባበቅ ላይ" },
  "No Past Orders Found": { en: "No Past Orders Found", am: "ምንም ያለፉ ትዕዛዞች አልተገኙም" },
  "You haven't placed any food orders yet.": { en: "You haven't placed any food orders yet.", am: "እስካሁን ምንም የምግብ ትዕዛዝ አላስፈጽመውም።" },
  "No Active Order Found": { en: "No Active Order Found", am: "ንቁ ትዕዛዝ አልተገኘም" },
  "View Menu": { en: "View Menu", am: "ማውጫ ይመልከቱ" },

  // ===== NOTIFICATIONS =====
  "User": { en: "User", am: "ተጠቃሚ" },
  "No Notifications": { en: "No Notifications", am: "ምንም ማስታወቂያዎች የሉም" },

  // ===== FEEDBACK PAGE =====
  "Select a rating": { en: "Select a rating", am: "ደረጃ ይምረጡ" },
  "Feedback Topic": { en: "Feedback Topic", am: "የአስተያየት ርዕስ" },
  "Food & Drink Quality": { en: "Food & Drink Quality", am: "የምግብ እና የመጠጥ ጥራት" },
  "Service & Preparation Speed": { en: "Service & Preparation Speed", am: "የአገልግሎት እና የዝግጅት ፍጥነት" },
  "Cafeteria Cleanliness": { en: "Cafeteria Cleanliness", am: "የካፌቴሪያ ንፅህና" },
  "Website / App Suggestion": { en: "Website / App Suggestion", am: "የድረ-ገፅ / መተግበሪያ ሀሳብ" },
  "Other": { en: "Other", am: "ሌላ" },
  "Specific Dish (Optional)": { en: "Specific Dish (Optional)", am: "የተወሰነ ምግብ (አማራጭ)" },
  "My Past Reviews": { en: "My Past Reviews", am: "የቀድሞ ግምገማዎቼ" },

  // ===== MENU SORT / RESULTS =====
  "Price: Low to High": { en: "Price: Low to High", am: "ዋጋ: ከዝቅተኛ ወደ ከፍተኛ" },
  "Price: High to Low": { en: "Price: High to Low", am: "ዋጋ: ከከፍተኛ ወደ ዝቅተኛ" }
};

// Support both storage keys for backward compatibility
const STORAGE_KEYS = ["scos_language", "cafeteria_language"];

function readLanguage() {
  for (const k of STORAGE_KEYS) {
    const v = localStorage.getItem(k);
    if (v === "en" || v === "am" || v === "om") return v;
  }
  return "en";
}

function writeLanguage(lang) {
  for (const k of STORAGE_KEYS) {
    localStorage.setItem(k, lang);
  }
  // Also sync profile language preference if exists
  try {
    const profileRaw = localStorage.getItem("userProfile");
    if (profileRaw) {
      const p = JSON.parse(profileRaw);
      if (p && typeof p === "object") {
        p.language = lang;
        localStorage.setItem("userProfile", JSON.stringify(p));
      }
    }
  } catch (_) {}
}

export function getCurrentLanguage() {
  return readLanguage();
}

export function setLanguage(lang) {
  if (lang !== "en" && lang !== "am" && lang !== "om") return;
  writeLanguage(lang);
  applyTranslations();
  window.dispatchEvent(new CustomEvent("language:changed", { detail: { language: lang } }));
  window.dispatchEvent(new CustomEvent("languageChanged", { detail: { language: lang } }));
}

export function getText(key) {
  const lang = getCurrentLanguage();
  return translations[lang]?.[key] || translations.en[key] || key;
}

function updateIdTranslations(lang) {
  const t = translations[lang] || translations.en;
  const ids = Object.keys(t);
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      const val = t[id];
      if (typeof val === "string" && val.startsWith("<")) {
        el.innerHTML = val;
      } else if (val) {
        // Preserve icons inside element
        const icon = el.querySelector("i");
        if (icon && el.childNodes.length > 1) {
          const last = el.childNodes[el.childNodes.length - 1];
          if (last && last.nodeType === 3) {
            last.nodeValue = " " + val;
          } else {
            el.textContent = val;
            if (icon) el.prepend(icon);
          }
        } else if (icon) {
          const iconHtml = icon.outerHTML;
          el.innerHTML = `${iconHtml} ${val}`;
        } else {
          el.textContent = val;
        }
      }
    }
  });
}

export function applyTranslations() {
  const lang = getCurrentLanguage();
  const t = translations[lang] || translations.en;

  // Set html lang & body class
  try {
    document.documentElement.lang = lang;
    document.body.classList.toggle("lang-am", lang === "am");
    document.body.classList.toggle("lang-en", lang === "en");
    document.body.classList.toggle("lang-om", lang === "om");
  } catch (_) {}

  // 1. Attribute translation via data-i18n
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    const val = t[key];
    if (!val) return;
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      if (el.hasAttribute("placeholder")) {
        el.setAttribute("placeholder", val);
      } else {
        el.textContent = val;
      }
    } else if (el.hasAttribute("data-i18n-html")) {
      el.innerHTML = val;
    } else {
      const icon = el.querySelector("i");
      if (icon && el.textContent.trim() !== val) {
        const iconHtml = icon.outerHTML;
        el.innerHTML = `${iconHtml} ${val}`;
      } else {
        el.textContent = val;
      }
    }
  });

  // Handle placeholder specific attribute
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const val = key && t[key];
    if (val) el.setAttribute("placeholder", val);
  });

  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    const val = key && t[key];
    if (val) el.setAttribute("title", val);
  });

  // 2. ID-based translation (for index.html and other pages with IDs matching keys)
  updateIdTranslations(lang);

  // 3. Direct DOM Text mapping fallback (covers hard-coded English without data-i18n)
  const normalize = (s) => s.replace(/\s+/g, " ").trim();
  const targets = document.querySelectorAll("a, button, label, h1, h2, h3, h4, h5, th, td, span, p, small, strong, option");
  targets.forEach((el) => {
    // Skip if already handled by data-i18n or id match
    if (el.hasAttribute("data-i18n") || el.id && t[el.id]) return;
    // Only handle leaf nodes or single-icon wrappers
    const hasOnlyTextOrIcon = el.children.length === 0 || (el.children.length === 1 && el.querySelector("i, svg"));
    if (!hasOnlyTextOrIcon) return;
    // Ignore option elements inside language selectors to avoid infinite loop (we handle separately)
    if (el.tagName === "OPTION" && el.closest("select.scos-lang-select, select#langToggleSelect, select#preferred-language")) return;
    const lastNode = el.childNodes[el.childNodes.length - 1];
    const rawText = lastNode?.nodeValue?.trim();
    if (!rawText) return;
    const normRaw = normalize(rawText);
    for (const [key, val] of Object.entries(directTextMap)) {
      if (normRaw === normalize(val.en) || normRaw === normalize(val.am)) {
        const newText = val[lang] || val.en;
        if (el.children.length === 1 && el.querySelector("i, svg")) {
          lastNode.nodeValue = " " + newText;
        } else {
          el.textContent = newText;
        }
        break;
      }
    }
  });

  // 3b. Placeholder translation (search inputs etc.)
  document.querySelectorAll("input[placeholder], textarea[placeholder]").forEach((el) => {
    if (el.hasAttribute("data-i18n-placeholder") || el.hasAttribute("data-i18n")) return;
    const ph = el.getAttribute("placeholder")?.trim();
    if (!ph) return;
    const normPh = ph.replace(/\s+/g, " ").trim();
    for (const [key, val] of Object.entries(directTextMap)) {
      if (normPh === val.en.replace(/\s+/g, " ").trim() || normPh === val.am.replace(/\s+/g, " ").trim()) {
        el.setAttribute("placeholder", val[lang] || val.en);
        break;
      }
    }
  });

  // 4. Update all dropdown selectors on the page
  document.querySelectorAll(".scos-lang-select, #langToggleSelect, #preferred-language, #language-switcher select").forEach((select) => {
    // Only sync language selectors, not other selects
    if (select.id === "preferred-language" || select.classList.contains("scos-lang-select") || select.id === "langToggleSelect") {
      select.value = lang;
    }
  });

  // 5. Update dynamic content like menu item names if they have data-lang alternate?
  document.querySelectorAll("[data-en][data-am]").forEach((el) => {
    const val = el.getAttribute(`data-${lang}`);
    if (val) el.textContent = val;
  });
}

export function renderLangSwitcher(containerElement) {
  if (!containerElement) return;
  const currentLang = getCurrentLanguage();
  // Include globe icon + label for clarity; works on both light/dark headers because background is white
  containerElement.innerHTML = `
    <div class="lang-switcher-widget" style="display:inline-flex;align-items:center;gap:6px;margin:0 8px;background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:3px 8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <i class="fa-solid fa-globe" style="color:#2563eb;font-size:13px;"></i>
      <select class="scos-lang-select" aria-label="Language Selector" style="background:transparent;color:#0f172a;border:none;font-weight:700;cursor:pointer;font-size:13px;outline:none;min-width:110px;">
        <option value="en" ${currentLang === "en" ? "selected" : ""}>🇬🇧 English</option>
        <option value="am" ${currentLang === "am" ? "selected" : ""}>🇪🇹 አማርኛ</option>
        <option value="om" ${currentLang === "om" ? "selected" : ""}>🇪🇹 Afaan Oromoo</option>
      </select>
    </div>
  `;
  const selectEl = containerElement.querySelector(".scos-lang-select");
  if (selectEl) {
    selectEl.addEventListener("change", (e) => setLanguage(e.target.value));
  }
}

function ensureSwitcherInjected() {
  if (document.querySelector(".scos-lang-select, #langToggleSelect")) {
    // Sync value but still ensure admin/kitchen headers have it if missing there
    const existsInAdminNav = document.querySelector(".admin-navbar .scos-lang-select");
    const existsInKds = document.querySelector(".kds-header .scos-lang-select");
    if (!existsInAdminNav && document.querySelector(".admin-navbar .nav-right")) {
      const wrapper = document.createElement("span");
      wrapper.style.display = "inline-flex";
      wrapper.style.alignItems = "center";
      wrapper.style.marginRight = "12px";
      renderLangSwitcher(wrapper);
      const navRight = document.querySelector(".admin-navbar .nav-right");
      navRight.prepend(wrapper);
    }
    if (!existsInKds && document.querySelector(".kds-header")) {
      const wrapper = document.createElement("span");
      renderLangSwitcher(wrapper);
      const kdsHeader = document.querySelector(".kds-header");
      const actions = kdsHeader.querySelector("div:last-child");
      if (actions) actions.prepend(wrapper);
      else kdsHeader.appendChild(wrapper);
    }
    return;
  }

  // Try multiple header containers
  const candidates = [
    document.querySelector(".nav-container"),
    document.querySelector(".navbar-header .header-actions"),
    document.querySelector(".header-actions"),
    document.querySelector(".navbar .nav-container"),
    document.querySelector(".nav-right"),
    document.querySelector(".admin-navbar .nav-right"),
    document.querySelector(".kds-header"),
    document.querySelector("header .container"),
    document.querySelector(".header .container"),
    document.querySelector(".user-profile-menu"),
    document.querySelector(".nav-auth"),
    document.querySelector(".nav-links"),
    document.querySelector("nav"),
    document.querySelector("header")
  ].filter(Boolean);

  for (const container of candidates) {
    if (container.querySelector(".scos-lang-select, #langToggleSelect")) continue;
    // Prefer injecting into header actions or nav containers
    if (container.classList.contains("nav-container") || container.classList.contains("header-actions") || container.classList.contains("nav-right") || container.classList.contains("kds-header")) {
      const wrapper = document.createElement("span");
      wrapper.style.display = "inline-flex";
      wrapper.style.alignItems = "center";
      if (container.classList.contains("kds-header")) {
        const actions = container.querySelector("div:last-child");
        if (actions) {
          renderLangSwitcher(wrapper);
          actions.prepend(wrapper);
          return;
        }
      }
      renderLangSwitcher(wrapper);
      // For nav-container: insert before user menu or at end
      const userMenu = container.querySelector(".user-profile-menu, .nav-auth, .user-nav-links");
      if (userMenu && userMenu.parentElement) userMenu.parentElement.insertBefore(wrapper, userMenu);
      else container.appendChild(wrapper);
      return;
    }
  }

  // Fallback for auth pages (login/register) – fixed floating selector
  if (!document.querySelector(".scos-lang-select")) {
    const floating = document.createElement("div");
    floating.style.position = "fixed";
    floating.style.top = "16px";
    floating.style.right = "16px";
    floating.style.zIndex = "9999";
    renderLangSwitcher(floating);
    document.body.appendChild(floating);
  }
}

// Global window attachments for backward compatibility
window.setLanguage = setLanguage;
window.applyTranslations = applyTranslations;
window.getCurrentLanguage = getCurrentLanguage;
window.renderLangSwitcher = renderLangSwitcher;
window.t = getText;

// Initialize
function initI18n() {
  applyTranslations();
  ensureSwitcherInjected();
  // Listen to any language selector on page
  document.querySelectorAll(".scos-lang-select, #langToggleSelect, #preferred-language").forEach((select) => {
    // Avoid duplicate listeners by cloning? Use flag
    if (select.dataset.i18nBound) return;
    select.dataset.i18nBound = "1";
    select.addEventListener("change", (e) => setLanguage(e.target.value));
  });
  // Watch for dynamic DOM changes (e.g., admin-layout injected navbar)
  const observer = new MutationObserver(() => {
    ensureSwitcherInjected();
    // Re-apply translations if new nodes added that contain direct text
    // Debounce slightly
    clearTimeout(window.__i18nDebounce);
    window.__i18nDebounce = setTimeout(applyTranslations, 100);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Listen storage changes from other tabs
  window.addEventListener("storage", (e) => {
    if (STORAGE_KEYS.includes(e.key)) applyTranslations();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initI18n);
} else {
  initI18n();
}

// Also re-apply on language events
window.addEventListener("language:changed", applyTranslations);
window.addEventListener("languageChanged", applyTranslations);
