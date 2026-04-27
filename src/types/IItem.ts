export interface IItemView {
  item_id: string;
  company_id: string;
  description: string;
  price: string;
  created_date: string;
  creator_user_id: string;
  modified_date: string;
  modifier_user_id: string;
}

export interface IItemInput {
  description: string;
  price: string;
}
