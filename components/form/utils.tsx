import {z} from 'zod'


export const signUpFormSchema = () => z.object({
  firstName: z.string().min(1, {
    message: 'first Name must be at least 1 character.'
  }),
  lastName: z.string().min(1, {
    message: 'last Name must be at least 1 character.'
  }),
  dateOfBirth: z.string(),
  ssn: z.string().min(4).max(4),

  email: z.string().email(),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.'
  }),
  confirm: z.string(),
  address1: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  userAgreement: z.boolean({
    message: 'Please agree to the terms and condition'
  })
}).refine((data) => data.password === data.confirm,  {
  message: "Passwords don't match",
  path: ['confirm']
})

export const signInFormSchema = () => z.object({
  email: z.string().email().min(5, {
    message: 'Username must be at least 2 characters.'
  }),
  password: z.string()
})


export const transferFundsFormSchema = () => z.object({
  email: z.string().email(),
  memo: z.string().max(150, {
    message: 'Memo must not be longer than 150 characters'
  }).optional(),
  amount: z.string(),
  senderBankId: z.string().min(4, 'Please select a valid bank account'),
  shareableId: z.string().min(8, 'Please select a valid shareable id')
})