import { loginUser, registerUser } from '@/actions/auth';
import { createSlice } from '@reduxjs/toolkit';
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    token: null,
  } as any,
  reducers: {
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      // Không cần cập nhật token ở đây vì bạn đã lưu token vào Local Storage trong async thunk của bạn.
      // Trong Redux Toolkit, việc cập nhật token sẽ được thực hiện bằng cách trực tiếp thay đổi trạng thái `token` trong initialState.
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token; // Lưu token vào state sau khi đăng nhập thành công
      state.error = null;
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
         // Lưu thông tin người dùng đăng ký thành công vào state
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.error.message; // Lưu thông tin lỗi nếu đăng ký thất bại vào state
      });
      
  },
});
// export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export const { loginSuccess } = authSlice.actions;
export const authSliceReducer = authSlice.reducer;
