import { Form, notification } from "antd";
import api from "../../services/api";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../hooks/useSettings";
import {APP_NAME} from "../../utils/config.ts";
interface User {
  user_id: number;
  username: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: User;
  to: string;
}
export const AuthLogin = () => {
  const navigate = useNavigate();
  const onLogin = async (values: any) => {
    const response = await api.post("/user/login", values);
    return response.data as LoginResponse;
  };

  const { login } = useAuth();

  const { data: info } = useSettings();

  const { mutateAsync: loginMutation, isLoading } = useMutation(onLogin, {
    onSuccess: (data) => {
      notification.success({
        message: "Success",
        description: data.message,
        placement: "bottomRight",
      });
      login(data.token, data.user);
      navigate(data.to);
    },
    onError: (error) => {
      // is axios
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        notification.error({
          message: "Error",
          description: message,
          placement: "bottomRight",
        });
        return;
      }

      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    },
  });

  return (
    <div className="flex min-h-full bg-white flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 flex items-center">
              <img className="h-8 w-auto" src="/logo.png" alt={APP_NAME} />
              <span className="text-lg font-bold">{APP_NAME}</span>
              <span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 ml-2">
                {/* @ts-ignore */}
                {`v${__APP_VERSION__}`}
              </span>
            </div>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Login to your account
            </h2>
          </div>

          <div className="mt-10">
            <div>
              <Form
                layout="vertical"
                className="space-y-6"
                onFinish={loginMutation}
                requiredMark={false}
              >
                {" "}
                <Form.Item
                  name="username"
                  label={
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Username
                    </label>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please input your username!",
                    },
                  ]}
                >
                  <input
                    autoComplete="username"
                    placeholder="Username"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6 px-3"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  label={
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Password
                    </label>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <input
                    autoComplete="current-password"
                    placeholder="Password"
                    type="password"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  />
                </Form.Item>
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {isLoading ? "Loading..." : "Login"}
                  </button>
                </div>
              </Form>
            </div>
            {info?.isRegistrationAllowed ? (
              <p className="mt-10 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Register
                </Link>
              </p>
            ) : (
              <p className="mt-10 text-center text-xs text-gray-500">
                Registration is disabled by admin.
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute h-full w-full object-cover rounded-sm bg-gradient-to-r from-sky-400 to-blue-500"></div>
      </div>
    </div>
  );
};
