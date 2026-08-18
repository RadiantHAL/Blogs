import type { FieldError } from "react-hook-form";

type props = {
  error:FieldError | undefined;
}

const Error = ({error}:props) => {
  return (
    <>
      {error && <p className='text-red-500 text-sm mt-1'>{error?.message}</p>}
    </>
  )
}

export default Error
