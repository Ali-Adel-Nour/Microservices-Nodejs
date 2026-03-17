import { Static, Type } from '@sinclair/typebox';

const CartItemDto = Type.Object({
productId: Type.Integer(),
qty: Type.Integer({ minimum: 1 }),
});

export const CartRequestDto = Type.Object({
userId: Type.Integer(),
items: Type.Array(CartItemDto, { minItems: 1 }),
})


export type CartRequestInput = Static<typeof CartRequestDto>   


export const CartEditRequestDto = Type.Object({
userId: Type.Integer(),
items: Type.Array(CartItemDto, { minItems: 1 }),
})


export type CartEditRequestInput = Static<typeof CartEditRequestDto>   