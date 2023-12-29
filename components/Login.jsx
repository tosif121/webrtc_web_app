import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

function Login() {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    userName: '',
    password: '',
  });
  const router = useRouter();
  const NAME_REGEX = /^[a-zA-Z_ ]+$/;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { userName: '', password: '' };

    if (!formData.userName.trim()) {
      newErrors.userName = 'Please enter user name';
      valid = false;
    } else if (!NAME_REGEX.test(formData.userName.trim())) {
      newErrors.userName = 'Please enter a valid user name';
      valid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Please enter password';
      valid = false;
    } else if (formData.password.trim().length < 6) {
      newErrors.password = 'Password length should be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.userName === 'webrtc_client' && formData.password === 'password') {
      const token = 'ba333f19-1c93-46f5-bf9b-e7c23b7e5c48';
      Cookies.set('token_webrtc', token);
      router.push('/');
      toast.success('Login Successfully');
    } else if (validateForm()) {
      toast.error('Your username or password is incorrect');
    }
  };

  useEffect(() => {
    const tokenCookie = Cookies.get('token_webrtc');

    if (tokenCookie) {
      console.log('Token not found');
      router.push('/');
    }
  }, []);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="sm:w-full sm:max-w-sm p-8 bg-white shadow-sm rounded-lg">
          <div className="mx-auto">
            <img className="mx-auto h-20 w-auto" src="/images/logo.png" alt="webrtc.iotcom.io" />
            <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="userName" className="block text-base font-medium leading-6 text-gray-900">
                User Name
              </label>
              <div className="mt-2">
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  autoComplete="userName"
                  value={formData.userName.replace(/\s+/g, '')}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.userName && <p className="text-red-500 text-sm mt-1">{errors.userName}</p>}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-base font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={handleInputChange}
                  value={formData.password.replace(/\s+/g, '')}
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-base font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
