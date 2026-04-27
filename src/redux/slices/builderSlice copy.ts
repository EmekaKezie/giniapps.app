import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  IBuilder,
  IBuilderDocument,
  IBuilderDocumentItems,
  IBuilderStyling,
} from "../../types/IBuilder";

const initialState: IBuilder = {
  html: "",
  template: {},
  document: {},
  styling: {},
};

const builderSlice = createSlice({
  name: "builderRedux",
  initialState,
  reducers: {
    onSetInvoice: (state, action: PayloadAction<IBuilder>) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    onUpdateInvoice: (
      state,
      action: PayloadAction<Partial<IBuilderDocument>>,
    ) => {
      state.document = { ...state.document, ...action.payload };
    },

    onUpdateInvoiceItems: (
      state,
      action: PayloadAction<IBuilderDocumentItems[]>,
    ) => {
      state.document.items = action.payload;
    },

    onUpdateInvoiceStyle: (
      state,
      action: PayloadAction<Partial<IBuilderStyling>>,
    ) => {
      state.styling = { ...state.styling, ...action.payload };
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
