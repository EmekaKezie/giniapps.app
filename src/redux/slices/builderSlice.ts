import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  IInvoiceItemView,
  IInvoiceStyles,
  IInvoiceView,
} from "@appTypes/IInvoice";

const initialState: IInvoiceView = {
  invoice_id: "",
  title: "",
  logo: "",
  subtitle: "",
  html: "",
  tmpl: "",
  invoice_no: "",
  invoice_status: "",
  issue_date: "",
  due_date: "",
  note: "",
  currency: "",
  tax_type: "",
  tax_rate: 0,
  folder_id: "",
  client_id: "",
  payout_id: "",
  items: [],
  styles: [],
  client: undefined,
  payout: undefined,
  config: undefined,
  folder: undefined,
};

const builderSlice = createSlice({
  name: "builderRedux",
  initialState,
  reducers: {
    onSetInvoice: (state, action: PayloadAction<IInvoiceView>) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    onUpdateInvoice: (state, action: PayloadAction<IInvoiceView>) => {
      //state = { ...state, ...action.payload };
      return { ...state, ...action.payload };
    },

    onUpdateInvoiceItems: (
      state,
      action: PayloadAction<IInvoiceItemView[]>,
    ) => {
      state.items = action.payload;
    },

    onUpdateInvoiceStyle: (state, action: PayloadAction<IInvoiceStyles[]>) => {
      state.styles = action.payload;
    },
  },
});

export const {
  onSetInvoice,
  onUpdateInvoice,
  onUpdateInvoiceItems,
  onUpdateInvoiceStyle,
} = builderSlice.actions;
export default builderSlice.reducer;
