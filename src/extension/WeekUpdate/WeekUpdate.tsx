import React, { useEffect, useState } from "react";
import { BiLogOutCircle, BiMenu } from "react-icons/bi";
import { BsFillFileSpreadsheetFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Api from "../API/Api";
import { userLoginInfo } from "../Slice/UserSlice";

interface RootState {
  userInfo: {
    userInfo: {
      id: number;
      created_at: string;
      email: string;
      name: string;
      photo: string;
      role: string;
      updated_at: string;
    };
  };
}

interface tokenInt {
  [key: string]: string;
}

const WeekUpdate: React.FC = () => {
  const [menu, setMenu] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [important, setImportant] = useState<string>("");
  const [priorities, setPriorities] = useState<string>("");
  const [concerns, setConcerns] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<boolean>(false);
  const redirect = useNavigate();
  const dispatch = useDispatch();
  let user = useSelector((state: RootState) => state.userInfo.userInfo);

  const logout = () => {
    chrome.storage.local.set({ tracker_token: undefined });
    dispatch(userLoginInfo(undefined));
    redirect("/popup.html");
  };

  const messageUpdate = () => {
    setTimeout(() => {
      setMessage(false);
      redirect("/home");
    }, 3000);
  };

  const submitweekUpdate = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: user.id,
        important: important,
        priorities: priorities,
        concerns: concerns,
        summary: summary,
      }),
    };
    Api(
      "WeeklyUpdate",
      requestOptions.method,
      requestOptions.body,
      requestOptions.headers
    ).then((response) => {
      if (response.status === 200) {
        setSuccess(response.data);
        setMessage(!message);
        messageUpdate();
      }
    });
  };
  useEffect(() => {
    chrome.storage.local.get(["tracker_token"]).then((result: tokenInt) => {
      setToken(result.tracker_token);
    });
  }, []);
  return (
    <div className=" pt-2">
      <div className="pt-2 pb-4 px-2 flex justify-between shadow-md items-center">
        <img src="logo.png" className="w-2/5 h-8" />
        <div className="relative">
          <button
            className="py-2 px-2"
            onClick={() => {
              setMenu(!menu);
            }}
          >
            <BiMenu className="w-7 h-7" />
          </button>
          {menu && (
            <div className="absolute bg-white right-0 p-1 rounded-md shadow-[0px_0px_7px_-2px_rgba(0,0,0,0.52)] w-40 z-20">
              <ul>
                <li
                  className="p-2 text-slate-600 flex items-center cursor-pointer hover:bg-slate-400 rounded-lg"
                  onClick={() => {
                    redirect("/home");
                  }}
                >
                  <BsFillFileSpreadsheetFill className="mr-2 h-4 w-4" />
                  Daily Update
                </li>
                <li
                  className="p-2 text-slate-600 flex items-center cursor-pointer hover:bg-slate-400 rounded-lg"
                  onClick={logout}
                >
                  <BiLogOutCircle className="mr-2 h-4 w-4" />
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="pt-4 bg-slate-300 relative">
        <div className="px-4 pt-2 pb-4 border-b shadow-lg">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-slate-700">
              Weekly Update
            </h3>
            {success !== "" ? (
              <p
                className={`absolute top-0 right-0 w-4/5 rounded bg-emerald-500 z-20 py-2 font-semibold text-white ${
                  message
                    ? " transition ease-in-out "
                    : "translate-x-full transition ease-in-out"
                }`}
              >
                {success}
              </p>
            ) : (
              <></>
            )}
          </div>
          <div className="mt-3 mb-3 bg-slate-300 px-3 pb-3 pt-1">
            <div className="mt-3">
              <textarea
                className="p-2 text-slate-800 w-full focus:outline-none"
                placeholder="What are the important things you got done?"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setImportant(e.target.value);
                }}
              />
            </div>
            <div className="mt-3">
              <textarea
                className="p-2 text-slate-800 w-full focus:outline-none"
                placeholder="What are your top priorities?"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setPriorities(e.target.value);
                }}
              />
            </div>
            <div className="mt-3">
              <textarea
                className="p-2 text-slate-800 w-full focus:outline-none"
                placeholder="What concerns should the team be aware of?"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setConcerns(e.target.value);
                }}
              />
            </div>
            <div className="mt-3">
              <textarea
                className="p-2 text-slate-800 w-full focus:outline-none"
                placeholder="Summary"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setSummary(e.target.value);
                }}
              />
            </div>
            <button
              className="w-full rounded-md py-2 bg-blue-300 mt-3 text-sm text-slate-600"
              onClick={submitweekUpdate}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekUpdate;
