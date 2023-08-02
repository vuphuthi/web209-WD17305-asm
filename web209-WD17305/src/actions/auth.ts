import {  saveTokenToLocalStorage } from "@/localStorageUtils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk('auth/loginUser', async (formData) => {
  try {
    const { data } =await axios.post(`http://localhost:3001/signin`,formData);

    // Lưu token vào Local Storage
    saveTokenToLocalStorage(data.token);

    return data.user; // Trả về thông tin người dùng sau khi đăng nhập thành công
  } catch (error) {
    throw new Error('Đăng nhập thất bại. Kiểm tra email và mật khẩu.');
  }
});

  export const registerUser = createAsyncThunk('auth/registerUser', async (formData) => {
    try {
        const { data } = await axios.post(`http://localhost:3001/signup`,formData)
        return data
    } catch (error:any) {
    //   throw new Error('Có lỗi xảy ra khi đăng ký.');
       return error = error.message
    }
  })