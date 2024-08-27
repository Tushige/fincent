import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Control, FieldPath } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { signUpFormSchema } from "../form/utils"
import clsx from "clsx"

const formSchema = signUpFormSchema()

interface AppFormInput {
  control: Control<z.infer<typeof formSchema>>,
  name: FieldPath<z.infer<typeof formSchema>>,
  label: string,
  className?: string,
  placeholder: string
}
export const AppFormInput = ({
  control,
  name,
  label,
  placeholder,
  className,
  ...props
}: AppFormInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({field}) => (
        <FormItem className={clsx(className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} {...props} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}