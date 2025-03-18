import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaUser, FaUserLock } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice"
import { Link } from "react-router-dom";


const Avatar = () => {
  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
  navigate('/');
  };

  return (
    <>
      <div>
        <Menu as='div' className='relative inline-block text-left z-40'>
          <div>
            <Menu.Button className='w-10 h-10 2xl:w-12 2xl:h-12 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700'>
              <span className='text-white font-semibold'>
                <FaUser />
              </span>
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-gray-200 shadow-lg ring-1 ring-white/10 focus:outline-none'>
              <div className='p-4'>
                <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/dashboard"
                    className={`${
                      active ? "bg-white" : ""
                    } text-black group flex w-full items-center rounded-md px-2 py-2 text-base`}
                  >
                    <FaUser className="mr-2" aria-hidden="true" />
                    Dashboard
                  </Link>
                )}
                </Menu.Item>

                <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/profile"
                    className={`${
                      active ? "bg-gray-100" : ""
                    } text-black group flex w-full items-center rounded-md px-2 py-2 text-base`}
                  >
                    <FaUserLock className="mr-2" aria-hidden="true" />
                    Profile
                  </Link>
                )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logoutHandler}
                      className={`${
                        active ? "bg-gray-700" : ""
                      } text-red-500 group flex w-full items-center rounded-md px-2 py-2 text-base`}
                    >
                      <IoLogOutOutline className='mr-2' aria-hidden='true' />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </>
  );
};

export default Avatar;
