import * as React from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import UserPasswordForm from 'src/components/UserPasswordForm';
import { userService, alertService } from 'src/services';

export default function Login() {
  const router = useRouter();

  // form validation rules 
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // Functions to build form with useForm() hook
  const { register, handleSubmit, formState: { errors } } = useForm(formOptions);

  function onSubmit({ username, password }) {
    return userService.login(username, password)
      .then(() => {
        // get return url from query parameters or default to '/'
        const returnUrl = router.query.returnUrl || '/';
        router.push(returnUrl);
      })
      .catch((err => {
        alertService.error(err);
      }));
  }

  return (
    <UserPasswordForm
      action={'login'}
      register={register}
      handleSubmit={handleSubmit(onSubmit)}
      errors={errors}
    />
  );
}
