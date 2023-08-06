import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "@/actions/product";

const AddProduct = () => {
  const dispatch = useDispatch();

  // Khởi tạo state để lưu trữ thông tin sản phẩm cần thêm
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    discount: "",
    image: "",
    category: "",
    sizes: [],
    comments:[] // Thêm trường sizes để lưu thông tin về size và số lượng
  });

  // State để lưu trữ thông báo lỗi
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    discount: "",
    image: "",
    category: "",
    sizes: [], // Thêm trường errors.sizes để lưu thông báo lỗi cho size và số lượng
  });

  // State để lưu trữ trạng thái xem đã bấm nút Thêm hay chưa
  const [submitted, setSubmitted] = useState(false);

  // Xử lý khi người dùng nhập liệu vào các trường
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Xử lý khi người dùng nhập liệu vào các trường size và số lượng
  const handleSizeChange = (index, field, value) => {
    // Sao chép mảng sizes hiện tại và cập nhật thông tin cho size và số lượng tại vị trí index
    const updatedSizes = [...productData.sizes];
    updatedSizes[index] = {
      ...updatedSizes[index],
      [field]: value,
    };

    setProductData((prevData) => ({
      ...prevData,
      sizes: updatedSizes,
    }));
  };

  // Xử lý khi người dùng click vào nút "Thêm sản phẩm"
  const handleAddProduct = () => {
    // Đánh dấu là đã bấm nút Thêm
    setSubmitted(true);

    // Kiểm tra và validate dữ liệu
    const errors = {};
    if (!productData.name) {
      errors.name = "Vui lòng nhập tên sản phẩm";
    }
    if (!productData.description) {
      errors.description = "Vui lòng nhập mô tả sản phẩm";
    }
    if (!productData.price) {
      errors.price = "Vui lòng nhập giá sản phẩm";
    }
    if (!productData.originalPrice) {
      errors.originalPrice = "Vui lòng nhập giá gốc sản phẩm";
    }
    if (!productData.discount) {
      errors.discount = "Vui lòng nhập giảm giá sản phẩm";
    }
    if (!productData.image) {
      errors.image = "Vui lòng nhập đường dẫn ảnh sản phẩm";
    }
    if (!productData.category) {
      errors.category = "Vui lòng nhập danh mục sản phẩm";
    }

    // Kiểm tra lỗi cho size và số lượng
    const sizeErrors = productData.sizes.map((size, index) => {
      const errors = {};
      if (!size.size) {
        errors.size = "Vui lòng nhập kích thước (size)";
      }
      if (!size.quantity) {
        errors.quantity = "Vui lòng nhập số lượng";
      }
      return errors;
    });

    setErrors({
      ...errors,
      sizes: sizeErrors,
    });

    // Nếu có thông báo lỗi, không thực hiện thêm sản phẩm
    if (
      Object.values(errors).some((error) => error !== "") ||
      sizeErrors.some((error) => Object.values(error).some((e) => e !== ""))
    ) {
      return;
    }

    // Gọi action addProduct để thêm sản phẩm mới
    dispatch(addProduct(productData))
      .then(() => {
        // Thêm thành công, chuyển hướng sang trang admin (ví dụ là "/admin")
        window.location.href = "/admin";
        alert("Thêm sản phẩm thành công");
      })
      .catch((error) => {
        // Xử lý lỗi nếu cần thiết
        console.error("Lỗi khi thêm sản phẩm:", error);
      });
  };
  return (
    <div className="relative flex min-h-screen text-gray-800 bg-gradient-to-r from-gray-100 via-[#bce1ff] to-gray-100 antialiased flex-col justify-center overflow-hidden bg-red-50 py-6 sm:py-12">
      <div className="relative py-3 sm:w-96 mx-auto text-center">
        <span className="text-2xl font-black">Thêm sản phẩm</span>
        <form className="mt-4 bg-blue-100 shadow-md rounded-lg text-left px-8 py-6">
          <div className="form-group">
            <label htmlFor="name" className="block font-semibold text-gray-700">
              Tên sản phẩm:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className={`w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm ${errors.name && submitted ? "border-red-500" : ""
                }`}
              placeholder="Nhập tên sản phẩm"
            />
            {errors.name && submitted && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="block mt-3 font-semibold text-gray-700">
              Mô tả:
            </label>
            <textarea
              id="description"
              name="description"
              value={productData.description}
              onChange={handleChange}
              className={`w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm ${errors.description && submitted ? "border-red-500" : ""
                }`}
              placeholder="Nhập mô tả sản phẩm"
            />
            {errors.description && submitted && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="price" className="block mt-3 font-semibold text-gray-700">
              Giá:
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className={`w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm ${errors.price && submitted ? "border-red-500" : ""
                }`}
              placeholder="Nhập giá sản phẩm"
            />
            {errors.price && submitted && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="originalPrice" className="block mt-3 font-semibold text-gray-700">
              Giá gốc:
            </label>
            <input
              type="number"
              id="originalPrice"
              name="originalPrice"
              value={productData.originalPrice}
              onChange={handleChange}
              className={`w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm ${errors.originalPrice && submitted ? "border-red-500" : ""
                }`}
              placeholder="Nhập giá gốc sản phẩm"
            />
            {errors.originalPrice && submitted && (
              <p className="text-red-500 text-sm mt-1">{errors.originalPrice}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="discount" className="block mt-3 font-semibold text-gray-700">
              Giảm giá:
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={productData.discount}
              onChange={handleChange}
              className={`w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm ${errors.discount && submitted ? "border-red-500" : ""
                }`}
              placeholder="Nhập giảm giá sản phẩm"
            />
            {errors.discount && submitted && (
              <p className="text-red-500 text-sm mt-1">{errors.discount}</p>
            )}
          </div>


          <div className="form-group">
            <label htmlFor="size" className="block mt-3 font-semibold text-gray-700">
              Kích thước (Size):
            </label>
            {productData.sizes.map((size, index) => (
              <div key={index} className="flex items-center mt-2">
                <input
                  type="text"
                  id={`size${index}`}
                  name="size"
                  value={size.size}
                  onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                  className={`w-20 rounded-lg border-gray-200 p-2 text-sm shadow-sm ${errors.sizes[index]?.size && submitted ? "border-red-500" : ""
                    }`}
                  placeholder="Size"
                />
                <input
                  type="number"
                  id={`quantity${index}`}
                  name="quantity"
                  value={size.quantity}
                  onChange={(e) => handleSizeChange(index, "quantity", e.target.value)}
                  className={`w-20 ml-4 rounded-lg border-gray-200 p-2 text-sm shadow-sm ${errors.sizes[index]?.quantity && submitted ? "border-red-500" : ""
                    }`}
                  placeholder="Số lượng"
                />
                {errors.sizes[index]?.size && submitted && (
                  <p className="text-red-500 text-sm mt-1 ml-2">{errors.sizes[index]?.size}</p>
                )}
                {errors.sizes[index]?.quantity && submitted && (
                  <p className="text-red-500 text-sm mt-1 ml-2">{errors.sizes[index]?.quantity}</p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setProductData((prevData) => ({ ...prevData, sizes: [...prevData.sizes, { size: "", quantity: "" }] }))}
              className="block mt-2 bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600"
            >
              Thêm size
            </button>
          </div>


          <div className="form-group">
            <label htmlFor="image" className="block mt-3 font-semibold text-gray-700">
              Ảnh:
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={productData.image}
              onChange={handleChange}
              className={`w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm ${errors.image && submitted ? "border-red-500" : ""
                }`}
              placeholder="Nhập đường dẫn ảnh sản phẩm"
            />

          </div>

          <div className="form-group">
            <label htmlFor="category" className="block mt-3 font-semibold text-gray-700">
              Danh mục loại
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={productData.category}
              onChange={handleChange}
              className={`w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm ${errors.category && submitted ? "border-red-500" : ""
                }`}
              placeholder="Nhập loại sản phẩm"
            />
            {errors.category && submitted && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddProduct}
            className="block mt-4 bg-purple-500 text-white py-2 px-6 rounded-md hover:bg-purple-600"
          >
            Thêm sản phẩm
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
