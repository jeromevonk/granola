import * as React from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import UserPasswordForm from 'src/components/UserPasswordForm';
import { userService, alertService } from 'src/services';

const minPasswordLength = 6;

export default function Register() {
  const router = useRouter();

  // form validation rules 
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required').min(minPasswordLength, `Password must have a minimum of ${minPasswordLength} characters`)
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // Functions to build form with useForm() hook
  const { register, handleSubmit, formState: { errors } } = useForm(formOptions);

  function onSubmit(user) {
    return userService.register(user)
      .then(() => {
        alertService.success('Registration successful', { keepAfterRouteChange: true });
        router.push('login');
      })
      .catch((err => {
        alertService.error(err);
      }));
  }

  return (
    <UserPasswordForm
      action={'register'}
      register={register}
      handleSubmit={handleSubmit(onSubmit)}
      errors={errors}
    />
  );
}
