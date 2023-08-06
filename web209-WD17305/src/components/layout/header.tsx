import { useLocalStorage } from "@/hook";
import { useAppSelector } from "@/store/hook";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const truncateName = (name: string, maxLength: number) => {
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...';
    }
    return name;
  };
  const cartItems = useAppSelector((state) => state.cart.items);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [user, setUser] = useLocalStorage('user', null)
  useEffect(() => {
    // Tính tổng số lượng sản phẩm trong giỏ hàng từ danh sách cartItems
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(totalItems);

    // Tính tổng số tiền trong giỏ hàng từ danh sách cartItems
    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    setCartTotalAmount(totalAmount);
  }, [cartItems]);
  const handleLogout = () => {
    // Xử lý logic đăng xuất ở đây

    // Sau khi đăng xuất, xóa thông tin người dùng từ Local Storage
    setUser(null);
    window.location.reload();
  };
  return (
    <div>
      <header className="bg-white">
        {/* {user && user.firstName && user.lastName && (
          <div className="ml-2 lg:ml-4 relative pl-[80px] mt-2 inline-block">
            <span className="text-gray-500 text-lg">Chào mừng, {user.firstName} {user.lastName}!</span>
          </div>
        )} */}
        <div className="container mx-auto px-4 py-5 flex items-center">
          {/* Logo */}
          <div className="mr-auto md:w-48 flex-shrink-0">
            <img className="h-8 md:h-10" src="https://i.ibb.co/98pHdFq/2021-10-27-15h51-15.png" alt="" />
          </div>

          {/* Search */}
          <div className="w-full max-w-xs xl:max-w-lg 2xl:max-w-2xl bg-gray-100 rounded-md hidden xl:flex items-center">
            <select className="bg-transparent uppercase font-bold text-sm p-4 mr-4" name="" id="">
              <option>all categories</option>
            </select>
            <input className="border-l border-gray-300 bg-transparent font-semibold text-sm pl-4" type="text" placeholder="I'm searching for ..." />
            <svg className="ml-auto h-5 px-4 text-gray-500 svg-inline--fa fa-search fa-w-16 fa-9x" aria-hidden="true" focusable="false" data-prefix="far" data-icon="search" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" >
              <path fill="currentColor" d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z"></path>
            </svg>
          </div>

          {/* Phone number */}

          <div className="ml-auto md:w-48 hidden pr-8 sm:flex flex-col place-items-end">
  <div className="bg-blue-500 px-4 py-2 rounded-md">
    <span className="text-white font-bold md:text-xl">Hỗ trợ 24/7</span>
  </div>
  <span className="mt-2 text-sm text-gray-400">Hotline: 0356 277 440</span>
</div>
          {!user && (
            <div className="pr-2">
              <svg className="h-9 lg:h-10 p-2 text-gray-500 svg-inline--fa fa-user fa-w-14 fa-9x" aria-hidden="true" focusable="false" data-prefix="far" data-icon="user" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" >
                <path fill="currentColor" d="M313.6 304c-28.7 0-42.5 16-89.6 16-47.1 0-60.8-16-89.6-16C60.2 304 0 364.2 0 438.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-25.6c0-74.2-60.2-134.4-134.4-134.4zM400 464H48v-25.6c0-47.6 38.8-86.4 86.4-86.4 14.6 0 38.3 16 89.6 16 51.7 0 74.9-16 89.6-16 47.6 0 86.4 38.8 86.4 86.4V464zM224 288c79.5 0 144-64.5 144-144S303.5 0 224 0 80 64.5 80 144s64.5 144 144 144zm0-240c52.9 0 96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 43.1-96 96-96z"></path>
              </svg>
            </div>
          )}
          {/* Buttons */}
          <nav className="flex items-center space-x-4">
            {user ? (
              <div className="relative flex items-center space-x-2">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Link to={`/users/${user.id}`}>
                  <img
                    className="w-full h-full object-cover transform hover:scale-110 transition duration-400 cursor-pointer"
                    src={user.userimage}
                    alt="Avatar"
                  />
                  </Link>
                </div>
                <div className="hidden md:block">
                  <p className="text-lg text-gray-800 font-semibold">{truncateName(user.lastName, 10)}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/signin"
                  className="text-emerald-600 font-bold border border-emerald-600 hover:bg-emerald-600 hover:text-white px-[10px] py-1 rounded-md transition duration-300"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/signup"
                  className="text-indigo-600 font-bold border border-indigo-600 hover:bg-indigo-600 hover:text-white px-[17px] py-1 rounded-md transition duration-300"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {user && (
              <button
                className="ml-4 text-indigo-600 font-bold hover:text-indigo-800 transition duration-300"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            )}
          </nav>

          {/* Hiển thị số lượng sản phẩm và số tiền trong giỏ hàng */}
          <li className="ml-2 lg:ml-4 relative inline-block">
            <Link to="cart">
              <div className="absolute -top-1 right-0 z-10 bg-yellow-400 text-xs font-bold px-1 py-0.5 rounded-sm">
                {cartItemCount > 0 && <div className="cart-count">{cartItemCount}</div>}
              </div>
              <svg className="h-9 lg:h-10 p-2 text-gray-500 svg-inline--fa fa-shopping-cart fa-w-18 fa-9x" aria-hidden="true" focusable="false" data-prefix="far" data-icon="shopping-cart" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" >
                <path fill="currentColor" d="M551.991 64H144.28l-8.726-44.608C133.35 8.128 123.478 0 112 0H12C5.373 0 0 5.373 0 12v24c0 6.627 5.373 12 12 12h80.24l69.594 355.701C150.796 415.201 144 430.802 144 448c0 35.346 28.654 64 64 64s64-28.654 64-64a63.681 63.681 0 0 0-8.583-32h145.167a63.681 63.681 0 0 0-8.583 32c0 35.346 28.654 64 64 64 35.346 0 64-28.654 64-64 0-18.136-7.556-34.496-19.676-46.142l1.035-4.757c3.254-14.96-8.142-29.101-23.452-29.101H203.76l-9.39-48h312.405c11.29 0 21.054-7.869 23.452-18.902l45.216-208C578.695 78.139 567.299 64 551.991 64zM208 472c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm256 0c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm23.438-200H184.98l-31.31-160h368.548l-34.78 160z"></path>
              </svg>

            </Link>
          </li>
          <div className="ml-4 hidden sm:flex flex-col font-bold">

            <span className="text-xs text-gray-400">Tổng</span>
            <span>${cartTotalAmount.toFixed(2)}</span>
          </div>
        </div>
        <hr />
      </header>
    </div>
  );
};

export default Header;
