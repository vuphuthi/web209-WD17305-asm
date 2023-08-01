// File: server.js (hoặc index.js, tùy theo tên bạn chọn cho file server)

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

// Cấu hình bodyParser để có thể đọc dữ liệu từ body của yêu cầu POST
app.use(bodyParser.json());

// Giả định rằng bạn đã có một cơ sở dữ liệu lưu trữ các sản phẩm và bình luận
let products = [
  {
    id: 1,
    name: "Product 1",
    comments: [],
  },
  {
    id: 2,
    name: "Product 2",
    comments: [],
  },
  // Các sản phẩm khác
];

// API endpoint để thêm bình luận vào sản phẩm dựa vào id sản phẩm
app.post("/products/:id/comments", (req, res) => {
  const productId = parseInt(req.params.id);
  const commentContent = req.body.content;

  // Tìm sản phẩm có id tương ứng trong cơ sở dữ liệu
  const product = products.find((product) => product.id === productId);

  if (!product) {
    return res.status(404).json({ error: "Product not found." });
  }

  // Tạo bình luận mới với nội dung được gửi từ yêu cầu POST
  const newComment = {
    id: product.comments.length + 1, // Điểm danh số lượng bình luận
    content: commentContent,
  };

  // Thêm bình luận vào mảng bình luận của sản phẩm
  product.comments.push(newComment);

  // Trả về thông tin bình luận vừa thêm để frontend có thể cập nhật state
  return res.status(200).json(newComment);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
