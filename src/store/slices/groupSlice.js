import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async ({ name }, { rejectWithValue }) => {
    console.log(name);

    // try {
    const response = await axios({
      url: "http://localhost:8080/api/groups",
      data: { name },
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      method: "post",
    });
    console.log(response.data);
    return response.data;
    // } catch (error) {
    // console.log(error.getMessage());

    // return rejectWithValue(error.response.data);
    // }
  }
);

// Guruhlarni yuklash uchun thunk funksiyasi
export const fetchGroups = createAsyncThunk(
  "groups/fetchGroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios({
        url: "http://localhost:8080/api/groups",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        method: "get",
      });
      console.log(response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Xabarlarni olish uchun thunk funksiyasi
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (groupId, { rejectWithValue }) => {
    try {
      console.log(groupId);

      const response = await axios({
        url: `http://localhost:8080/api/messages/group/${groupId.groupId}`,
        headers: { Authorization: "Bearer " + groupId.token },
        method: "get",
      });
      return response.data; // Xabarlar ro'yxati
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Xabarlarni olish uchun thunk funksiyasi
export const fetchMessagesUser = createAsyncThunk(
  "messages/fetchMessages",
  async (groupId, { rejectWithValue }) => {
    try {
      console.log(groupId);

      const response = await axios({
        url: `http://localhost:8080/api/messages/user/${groupId.groupId}`,
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        method: "get",
      });
      console.log(response.data);
      
      return response.data; // Xabarlar ro'yxati
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Xabar jo'natish uchun thunk funksiyasi
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ groupId, content }, { rejectWithValue }) => {
    try {
      const response = await axios({
        url: `http://localhost:8080/api/messages/group/${groupId}`,
        data: content,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        method: "post",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendMessageToUser = createAsyncThunk(
  "messages/sendMessageToUser",
  async ({ groupId, content }, { rejectWithValue }) => {
    try {
      const response = await axios({
        url: `http://localhost:8080/api/messages/user/${groupId}`,
        data: content,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        method: "post",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Guruhga foydalanuvchi qo'shish
export const addMemberToGroup = createAsyncThunk(
  "groups/addMember",
  async ({ groupId, email }, { rejectWithValue }) => {
    console.log(email);

    try {
      const response = await axios({
        url: `http://localhost:8080/api/groups/${groupId}/add-member`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: email,
      });
      // if (!response.ok) {
      //   throw new Error("Failed to add member to group");
      // }
      console.log(response.data);

      return { groupId, email }; // Javob qaytish
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const groupSlice = createSlice({
  name: "groups",
  initialState: {
    onlineUsers: [],
    groups: [],
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups.push(action.payload);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true; // Yozilmoqda belgisi
        state.error = null; // Xatoliklarni tozalash
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload; // fetchGroups qaytargan ma'lumot saqlanmoqda
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Xatolik holati
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload); // Yangi xabarlar qo'shilmoqda
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Xatolik saqlash
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload; // Xabarlar ro'yxati saqlanmoqda
      })
      .addCase(addMemberToGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMemberToGroup.fulfilled, (state, action) => {
        state.loading = false;
        const { groupId, email } = action.payload;
        const group = state.groups.find((g) => g.id === groupId);
        if (group) {
          group.members.push(email); // Yangi foydalanuvchi qo‘shish
        }
      })
      .addCase(addMemberToGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default groupSlice.reducer;
