import { createSlice } from '@reduxjs/toolkit'

export const activeChatSlice = createSlice({
  name: 'activeChat',
  initialState: {
    activeInitial: localStorage.getItem("activeInitial") ? JSON.parse(localStorage.getItem("activeInitial")):null,
  },
  reducers: {
    active: (state, action) => {
      state.activeInitial = action.payload
    },
    
  },
})

export const { active } = activeChatSlice.actions

export default activeChatSlice.reducer