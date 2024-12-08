export interface Expense {
    id: string;
    value: number;
    category_id: string;
    deleted: boolean;
    type_id: string;
    description?: string;
    user_id: string;
    created_date: string;
    updated_date: string;
}

export interface NewExpense {
    value: number;
    category_id: string;
    deleted?: boolean;
    type_id: string;
    description?: string;
    user_id: string;
}

export interface UpdateExpense {
    value?: number;
    category_id?: string;
    deleted?: boolean;
    type_id?: string;
    description?: string;
    user_id?: string;
    updated_date?: string;
}
