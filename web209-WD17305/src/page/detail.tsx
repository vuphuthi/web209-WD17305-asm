import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getProductById, getProducts } from "@/actions/product";
import { add } from "@/slices/cart";
import { IProduct } from "@/interfaces/product";
import {
  addCommentToProduct,
  fetchCommentsByProductId,
} from "@/actions/comment";
import { useSelector } from "react-redux";
import { useLocalStorage } from "@/hook";

const ProductDetailPage = () => {
  const truncateName = (name: string, maxLength: number) => {
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...';
    }
    return name;
  };
  // const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [user] = useLocalStorage("user", null);

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  //// comment


  const [isCommentValid, setIsCommentValid] = useState(false);
  const [showCommentValidation, setShowCommentValidation] = useState(false);
  /// size
  const [selectedSize, setSelectedSize] = useState<string>(""); // Giá trị mặc định ban đầu cho kích cỡ

  // const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedSize(event.target.value);
  // };

  const id = Number(useParams<{ id: string }>().id);
  const comments = useSelector(
    (state: any) => state.comment.commentsByProduct[id]
  );
  // const commentStatus = useSelector((state: any) => state.comment.status);
  const error = useSelector((state: any) => state.comment.error);


  /// phan trang comment


  /// quantity
  const [selectedProductQuantity, setSelectedProductQuantity] = useState(1);
  const [sizeQuantities, setSizeQuantities] = useState<
    { size: string; quantity: number }[]
  >([]);

  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSizeValue = event.target.value;
    setSelectedSize(selectedSizeValue);
  
    // Tạo một bản sao của mảng selectedProduct.sizes
    const updatedSizes = selectedProduct?.sizes.slice();
  
    // Tìm số lượng tương ứng với size đã chọn
    const selectedSizeQuantity = updatedSizes.find(
      (size: any) => size.size === selectedSizeValue
    )?.quantity || 0;
  
    setSelectedProductQuantity(1); // Mỗi khi kích cỡ thay đổi, reset số lượng sản phẩm đã chọn về 1
    setSizeQuantities(updatedSizes); // Cập nhật danh sách size và số lượng tương ứng
  };
  

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedProductQuantity(Number(event.target.value));
  };

  const getProductQuantityOptions = () => {
    const maxQuantity =
      selectedProduct?.sizes?.find((size: any) => size.size === selectedSize)
        ?.quantity || 0;

    return Array.from({ length: maxQuantity }, (_, index) => index + 1);
  };
  /// quantity
  /// quantity
  const lastName = user?.lastName;
  const userimage = user?.userimage;

  const [commentInput, setCommentInput] = useState('');

  const handleAddComment = (comment: string) => {
    if (user) {
      if (comment.trim() !== "") {
        const currentDateTime = getCurrentDateTime();
        // Lấy tên người dùng từ localStorage nếu đã đăng nhập
        dispatch(addCommentToProduct({ id, comment, lastName, userimage, timestamp: currentDateTime, }));
        setIsCommentValid(true);
        setCommentInput('');
      } else {
        // Đặt trạng thái validate về true để hiển thị thông báo lỗi
        setIsCommentValid(false);
      }
      // Đặt biến state showCommentValidation về true để hiển thị trạng thái validate khi người dùng click vào nút "Gửi"
      setShowCommentValidation(true);
    } else {
      // Đặt biến state showCommentValidation về true để hiển thị trạng thái validate khi người dùng click vào nút "Gửi"
      setShowCommentValidation(true);
    }
  };
  const ITEMS_PER_PAGE = 4; // Số lượng bình luận hiển thị trên mỗi trang

const sortedComments = comments?.slice().sort((a: any, b: any) => {
  const dateA = new Date(a.timestamp);
  const dateB = new Date(b.timestamp);
  return dateA - dateB;
});
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    // Lấy giá trị currentPage từ localStorage nếu có
    const storedPage = localStorage.getItem("currentPage");
    if (storedPage) {
      setCurrentPage(parseInt(storedPage));
    }
  }, []);

  useEffect(() => {
    // Lưu giá trị currentPage vào localStorage mỗi khi currentPage thay đổi
    localStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  const totalComments = sortedComments?.length || 0;
  const totalPages = Math.ceil(totalComments / ITEMS_PER_PAGE);
  const indexOfLastComment = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstComment = indexOfLastComment - ITEMS_PER_PAGE;
  const currentComments = sortedComments?.slice(indexOfFirstComment, indexOfLastComment);

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
  };

  //// comment

  const getCurrentDateTime = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const currentDate = new Date();
    return currentDate.toLocaleDateString('vi-VN', options);
  };
  const { selectedProduct, isLoading } = useAppSelector(
    (state: any) => state.product
  );
  const allProducts = useAppSelector((state: any) => state.product.products);

  useEffect(() => {
    if (id) {
      dispatch(getProductById(Number(id)));
      dispatch(getProducts()); // Gọi action để lấy danh sách sản phẩm
      dispatch(fetchCommentsByProductId(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (selectedProduct && selectedSize) {
      const productToAdd = {
        ...selectedProduct,
        size: selectedSize,
        quantity: selectedQuantity,
      };
      dispatch(add(productToAdd));
      alert("Đã thêm sản phẩm vào giỏ hàng.");
    } else {
      // Hiển thị thông báo lỗi nếu người dùng chưa chọn kích cỡ
      alert("Vui lòng chọn kích cỡ sản phẩm trước khi thêm vào giỏ hàng.");

    }
  };
  useEffect(() => {
    if (selectedProduct && allProducts) {
      // Lọc danh sách các sản phẩm liên quan dựa vào category của sản phẩm hiện tại
      const relatedProducts = allProducts.filter(
        (product: any) => product.category === selectedProduct.category
      );

      // Loại bỏ sản phẩm hiện tại khỏi danh sách liên quan
      const filteredRelatedProducts = relatedProducts.filter(
        (product: any) => product.id !== selectedProduct.id
      );

      // Giới hạn số lượng sản phẩm liên quan hiển thị, chẳng hạn 4 sản phẩm
      const limitRelatedProducts = filteredRelatedProducts.slice(0, 4);

      setRelatedProducts(limitRelatedProducts);
    }
  }, [selectedProduct, allProducts]);

  if (isLoading) {
    return <p>Đang tải...</p>;
  }

  if (error) {
    return <p>Lỗi: {error}</p>;
  }

  if (!selectedProduct) {
    return <p>Không tìm thấy sản phẩm.</p>;
  }

  return (
    <div className="bg-indigo-50 py-2">
      <header>{/* Your header code here */}</header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Your breadcrumbs code here */}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col md:flex-row -mx-4">
          <div className="md:flex-1 px-4">
            <div x-data="{ image: 1 }" x-cloak>
              <div className="h-64 md:h-80 rounded-lg bg-gray-100 mb-4">
                <div
                  x-show="image === index + 1"
                  className="h-64 md:h-80 rounded-lg bg-gray-100 mb-4 flex items-center justify-center"
                >
                  <img
                    src={selectedProduct.image}
                    alt={"Image" + selectedProduct.image}
                    className="object-contain h-full w-full"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="md:flex-1 px-4">
            <h2 className="mb-2 leading-tight tracking-tight font-bold text-gray-800 text-2xl md:text-3xl">
              {selectedProduct.name}
            </h2>
            <p className="text-gray-500 text-sm">
              Loại{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                {selectedProduct.category}
              </a>
            </p>

            <div className="flex items-center space-x-4 my-4">
              <div>
                <div className="rounded-lg bg-gray-100 flex py-2 px-3">
                  <span className="text-indigo-400 mr-1 mt-1">$</span>
                  <span className="font-bold text-indigo-600 text-3xl">
                    {selectedProduct.price}
                  </span>
                </div>
              </div>
              {selectedProduct.discount && (
                <div className="flex-1">
                  <p className="text-green-500 text-xl font-semibold">
                    Giảm {selectedProduct.discount}%
                  </p>
                  <p className="text-gray-400 text-sm">
                    Bao gồm tất cả các loại thuế.
                  </p>
                </div>
              )}
            </div>

            <p className="text-gray-500">{selectedProduct.description}</p>

            <div className="flex py-4 space-x-4">
              <div className="relative flex-1">
                <div className="text-center left-0 pt-2 right-0 absolute block text-xs uppercase text-gray-400 tracking-wide font-semibold">
                  Số lượng
                </div>
                <select
                  className="cursor-pointer appearance-none rounded-xl border border-gray-200 pl-7 pr-11 h-14 flex items-end pb-1 w-full"
                  value={selectedProductQuantity}
                  onChange={handleQuantityChange}
                >
                  <option value="size">Chọn số lượng</option>
                  {selectedProduct &&
                    Array.isArray(getProductQuantityOptions()) &&
                    getProductQuantityOptions().map((quantity) => (
                      <option key={quantity} value={quantity}>
                        {quantity}
                      </option>
                    ))}
                </select>

                <svg
                  className="w-5 h-5 text-gray-400 absolute right-0 bottom-0 mb-2 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                  />
                </svg>
              </div>
              <div className="relative flex-1">
                <div className="text-center left-0 pt-2 right-0 absolute block text-xs uppercase text-gray-400 tracking-wide font-semibold">
                  Kích cỡ
                </div>
                <select
                  className="cursor-pointer appearance-none rounded-xl border border-gray-200 pl-7 pr-11 h-14 flex items-end pb-1 w-full"
                  value={selectedSize}
                  onChange={handleSizeChange}
                >
                  <option value="size">Chọn kích cỡ</option>
                  {selectedProduct &&
                    selectedProduct.sizes &&
                    Array.isArray(selectedProduct.sizes) &&
                    selectedProduct.sizes.map((sizeOption: any) => (
                      <option key={sizeOption.size} value={sizeOption.size}>
                        {sizeOption.size}
                      </option>
                    ))}
                </select>

                <svg
                  className="w-5 h-5 text-gray-400 absolute right-0 bottom-0 mb-2 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                  />
                </svg>
              </div>

              <button
                type="button"
                className="flex-shrink-0 h-14 px-6 py-2 font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>

        <div className="bg-transparent mt-8 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Bình luận</h2>

          {user && (
            <div className="flex items-center mb-4">
              <div className="relative">
                <img
                  className="w-10 h-10 object-cover rounded-full transition duration-300 transform hover:scale-110 cursor-pointer"
                  src={user.userimage}
                  alt="Avatar"
                />
                <div className="absolute bottom-0 right-0 p-1 bg-indigo-600 rounded-full">
                  <svg
                    className="w-3 h-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.293-3.293a1 1 0 011.414-1.414 3 3 0 104.243-4.243 1 1 0 011.414-1.414 5 5 0 11-7.071 7.071z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-lg text-gray-800 font-semibold">{user.lastName}</p>
              </div>
            </div>
          )}
          {/* Hiển thị danh sách bình luận */}
          {Array.isArray(currentComments) && currentComments.length > 0 ? (
            currentComments.map((comment, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-4">
                <div className="flex items-center mb-4">
                  <img className="w-10 h-10 object-cover rounded-full mr-4" src={comment.image} alt="Avatar" />
                  <div>
                    <p className="text-lg text-gray-800 font-semibold">{comment.username}</p>
                    <p className="text-sm text-gray-500">{comment.date}</p>
                  </div>
                </div>
                <p className="text-lg text-gray-800">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Không có bình luận.</p>
          )}
          <div className="flex items-center justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`mx-1 px-3 py-1 rounded-lg ${currentPage === pageNumber ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'
                  }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>
          {/* Form bình luận */}
          {user && (
            <form onSubmit={(e) => { e.preventDefault(); handleAddComment(commentInput) }} className="mt-4 flex items-center border border-gray-300 rounded-lg">
              <input
                type="text"
                name="comment"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Nhập bình luận..."
                className="w-full p-3 focus:outline-none"
              />
              <button type="submit" className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none transition-colors">
                Gửi
              </button>
            </form>
          )}

          {/* Hiển thị thông báo yêu cầu đăng nhập nếu chưa đăng nhập */}
          {!user ? (
            <div className="mt-4 bg-red-100 p-4 rounded-lg mb-4">
              <span className="text-red-700">
                Bạn cần <Link to="/signin" className="text-indigo-600 hover:underline">Đăng nhập</Link> để sử dụng chức năng bình luận
              </span>
            </div>
          ) : (
            <div className="mt-3">
              {isCommentValid && showCommentValidation && (
                <div className="bg-green-100 p-4 rounded-lg mb-4">
                  <p className="text-green-700">Bình luận đã được đăng thành công.</p>
                </div>
              )}
              {isCommentValid === false && showCommentValidation && (
                <div className="bg-red-100 p-4 rounded-lg mb-4">
                  <p className="text-red-700">Vui lòng nhập nội dung bình luận.</p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-8 pb-5">
          <h2 className="text-2xl font-bold mb-4">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md p-4 transition duration-300 transform hover:scale-105"
              >
                <img
                  src={product.image}
                  alt={"Related Image" + product.id}
                  className="w-full h-40 object-cover mb-4 rounded-lg"
                />
                <h3 className="mb-2 text-lg font-medium dark:text-white text-gray-900">
                  {truncateName(product.name, 50)}
                </h3>
                <p className="text-gray-500 text-sm">
                  Loại{" "}
                  <Link
                    to={`/category/${product.category}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {product.category}
                  </Link>
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-indigo-400 mt-1">$</span>
                    <span className="font-bold text-indigo-600 text-xl">
                      {product.price}
                    </span>
                  </div>
                  {product.discount && (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                      Giảm {product.discount}%
                    </div>
                  )}
                </div>
                <Link to={`/products/${product.id}`}>
                  <button className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2 w-full">
                    Xem chi tiết
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
