import React, { useEffect, useState } from "react";
import { BiLogOutCircle, BiMenu } from "react-icons/bi";
import { BsFillFileSpreadsheetFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useStopwatch } from "../Stopwatch/index";
import { userLoginInfo } from "../Slice/UserSlice";
import TimerStyledBlack from "../StopwatchStyle/Black";
import TimerStyledWhite from "../StopwatchStyle/White";
import Api from "../API/Api";
import { useSelector } from "react-redux";

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

interface curWork {
  created_at: Date;
  employee_id: number;
  end: Date;
  hours: number;
  id: number;
  ip: string;
  project: string;
  running: string;
  start: Date;
  status: string;
  tdescription: string;
  time: Date;
  turl: string;
  updated_at: Date;
  vpn: string;
  work: string;
}
interface oldWork {
  created_at: Date;
  employee_id: number;
  end: Date;
  hours: number;
  id: number;
  ip: string;
  project: string;
  running: string;
  start: Date;
  status: string;
  tdescription: string;
  time: Date;
  turl: string;
  updated_at: Date;
  vpn: string;
  work: string;
}

interface tokenInt {
  [key: string]: string;
}

const DailyStandup: React.FC = () => {
  const [vpn, setVpn] = useState<boolean>(false);
  const [work, setWork] = useState<boolean>(false);
  const [ip, setIp] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [pname, setPname] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [menu, setMenu] = useState<boolean>(false);
  const [journy, setJourney] = useState<boolean>(false);
  const [timer, setTimer] = useState<boolean>(false);
  const [dailyID, setDailyID] = useState<number | null>(null);
  const [currentwork, setCurrentwork] = useState<curWork | null>(null);
  const [prevwork, setPrevwork] = useState<oldWork[]>([]);
  const [currentHour, setCurrentHour] = useState<string>("");
  const [have, setHave] = useState<number>(0);
  const [update, setUpdate] = useState<string>("");
  const redirect = useNavigate();
  const dispatch = useDispatch();
  let user = useSelector((state: RootState) => state.userInfo.userInfo);

  const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false, offsetTimestamp: true });

  const logout = () => {
    chrome.storage.local.remove("tracker_token");
    dispatch(userLoginInfo(undefined));
    redirect("/popup.html");
  };

  const getworkData = (token: string, selected: string) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: user.id,
        get: selected,
      }),
    };
    Api(
      `getWorksUpdate`,
      requestOptions.method,
      requestOptions.body,
      requestOptions.headers
    ).then((response) => {
      if (response.status === 200) {
        console.log(response);

        if (response.data.running !== null) {
          const a: Date = new Date(response.data.running.start);
          const b: Date = new Date();
          const diffirence = a.valueOf() - b.valueOf();
          start(Math.abs(diffirence / 1000));
        }
        setHave(response.data.dataHave);
        setCurrentwork(response.data.running);
        setPrevwork(response.data.current);
        setCurrentHour(response.data.currentHour);
      }
    });
  };

  const startClocker = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: user.id,
        vpn: vpn,
        work: work,
        ip: ip,
      }),
    };
    Api(
      "dailyStart",
      requestOptions.method,
      requestOptions.body,
      requestOptions.headers
    ).then((response) => {
      if (response.status === 200) {
        setDailyID(response.data);
        start(0);
        setJourney(!journy);
      }
    });
  };

  const backHandler = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: dailyID,
        pname: pname,
        url: url,
        desc: desc,
        current: update,
      }),
    };
    Api(
      "dailyStartUpdate",
      requestOptions.method,
      requestOptions.body,
      requestOptions.headers
    ).then((response) => {
      if (response.status === 200) {
        setHave(response.data.dataHave);
        setCurrentwork(response.data.running);
        setPrevwork(response.data.current);
        setCurrentHour(response.data.currentHour);
        setTimer(!timer);
        setJourney(!journy);
        setVpn(false);
        setWork(false);
      }
    });
  };

  const stopHandler = () => {
    pause();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: currentwork.id,
        client: currentwork.employee_id,
        hour: `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:${(
          "0" + seconds
        ).slice(-2)}`,
        current: update,
      }),
    };
    Api(
      "dailyStartStop",
      requestOptions.method,
      requestOptions.body,
      requestOptions.headers
    ).then((response) => {
      if (response.status === 200) {
        setHave(response.data.dataHave);
        setCurrentwork(response.data.running);
        setPrevwork(response.data.current);
        setCurrentHour(response.data.currentHour);
        setJourney(false);
        setTimer(false);
      }
    });
  };

  const selectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    chrome.storage.local.set({ selected: e.target.value });
    setUpdate(e.target.value);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: user.id,
        get: e.target.value,
      }),
    };
    Api(
      `getWeekUpdate`,
      requestOptions.method,
      requestOptions.body,
      requestOptions.headers
    ).then((response) => {
      if (response.status === 200) {
        setPrevwork(response.data.current);
        setCurrentHour(response.data.currentHour);
      }
    });
  };

  useEffect(() => {
    let selected: string;
    chrome.storage.local.get(["selected"]).then((result: tokenInt) => {
      selected = result.selected;
      setUpdate(result.selected);
    });
    chrome.storage.local.get(["tracker_token"]).then((result: tokenInt) => {
      setToken(result.tracker_token);
      getworkData(result.tracker_token, selected);
    });
  }, []);
  return (
    <div className=" py-2">
      <div className="pt-2 px-2 flex justify-between shadow-md items-center fixed top-0 w-full left-0 z-20 bg-slate-100">
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
                    redirect("/week");
                  }}
                >
                  <BsFillFileSpreadsheetFill className="mr-2 h-4 w-4" />
                  Weekly Update
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
      <div className="pt-4 mt-11">
        <div className="px-4 pt-2 pb-4 border-b shadow-lg">
          {currentwork ? (
            <>
              <div className="p-2 flex items-center justify-between bg-slate-200">
                <p className="pr-2 text-justify">
                  {currentwork.project !== "" ? currentwork.project : "No Name"}
                </p>

                <button
                  className="bg-red-500 px-2 py-1 rounded-md"
                  onClick={stopHandler}
                >
                  <TimerStyledWhite
                    seconds={seconds}
                    minutes={minutes}
                    hours={hours}
                    days={undefined}
                  />
                </button>
              </div>
            </>
          ) : journy ? (
            <div>
              <div className="flex items-center justify-between bg-slate-300 border">
                <p className="py-3 px-2 text-base text-slate-500">
                  Date:{" "}
                  <span className="text-slate-700">
                    {new Date().getDate() +
                      "-" +
                      (new Date().getMonth() + 1) +
                      "-" +
                      new Date().getFullYear()}
                  </span>
                </p>
                <p className="px-2 text-base text-slate-500 flex items-center">
                  Time:{" "}
                  <TimerStyledBlack
                    seconds={seconds}
                    minutes={minutes}
                    hours={hours}
                    days={undefined}
                  />
                </p>
              </div>
              <div className="mt-3 mb-3 bg-slate-300 px-3 py-3">
                <div className="mt-3">
                  <input
                    className="p-2 text-slate-800 w-full focus:outline-none"
                    placeholder="Project name"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setPname(e.target.value);
                    }}
                  />
                </div>
                <div className="mt-3">
                  <input
                    className="p-2 text-slate-800 w-full focus:outline-none"
                    placeholder="Task Url"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setUrl(e.target.value);
                    }}
                  />
                </div>
                <div className="mt-3">
                  <textarea
                    className="p-2 text-slate-800 w-full focus:outline-none"
                    placeholder="Task Description"
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      setDesc(e.target.value);
                    }}
                  />
                </div>
              </div>
              <button
                className="w-full bg-blue-500 text-white text-center py-3 rounded-lg"
                onClick={backHandler}
              >
                Done
              </button>
            </div>
          ) : timer ? (
            <>
              <div className="p-2 flex items-center justify-between bg-slate-200">
                <p className="pr-2 text-justify">{pname}</p>

                <button
                  className="bg-red-500 px-2 py-1 rounded-md"
                  onClick={() => {
                    reset();
                    pause();
                  }}
                >
                  <TimerStyledWhite
                    seconds={seconds}
                    minutes={minutes}
                    hours={hours}
                    days={undefined}
                  />
                </button>
              </div>
            </>
          ) : (
            <div>
              <div className="flex mb-2 justify-between items-center px-3">
                <p className="capitalize text-sm text-blue-400">
                  did you connect vpn today?
                </p>
                <label
                  htmlFor="Toggle"
                  className="inline-flex items-center space-x-4 cursor-pointer text-gray-100"
                >
                  <span className="relative">
                    <input
                      id="Toggle"
                      type="checkbox"
                      className="hidden peer"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setVpn(e.target.checked);
                      }}
                    />
                    <div className="w-10 h-6 rounded-full shadow-inner bg-slate-400 peer-checked:bg-blue-400"></div>
                    <div className="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow bg-white peer-checked:right-0 peer-checked:left-auto"></div>
                  </span>
                </label>
              </div>
              <div className="flex mb-2 justify-between items-center px-3">
                <p className="capitalize text-sm text-blue-400">
                  do you have any work today?
                </p>
                <label
                  htmlFor="Toggle1"
                  className="inline-flex items-center space-x-4 cursor-pointer text-gray-100"
                >
                  <span className="relative">
                    <input
                      id="Toggle1"
                      type="checkbox"
                      className="hidden peer"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setWork(e.target.checked);
                      }}
                    />
                    <div className="w-10 h-6 rounded-full shadow-inner bg-slate-400 peer-checked:bg-blue-400"></div>
                    <div className="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow bg-white peer-checked:right-0 peer-checked:left-auto"></div>
                  </span>
                </label>
              </div>
              {vpn && (
                <div className="px-3 mb-2">
                  <p className="capitalize text-sm text-blue-400">IP address</p>
                  <input
                    className="w-full p-2 border focus:outline-none"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setIp(e.target.value);
                    }}
                  />
                </div>
              )}

              <button
                className="w-full bg-blue-500 text-white text-center py-3 rounded-lg"
                onClick={startClocker}
              >
                Start Daily Work
              </button>
            </div>
          )}
        </div>
        <div className="py-2 px-4">
          {have > 0 ? (
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-600">
                Previous Daily Updates
              </p>
            </div>
          ) : (
            <></>
          )}

          {have > 0 ? (
            <>
              <div className="flex justify-between items-center py-3 border-b">
                <select
                  className="text-slate-500 py-2 font-semibold rounded focus:outline-none"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    selectHandler(e)
                  }
                  value={update}
                >
                  <option value="1">Today</option>
                  <option value="2">Current week</option>
                  <option value="3">Last week</option>
                </select>
                <p className="text-xs font-semibold text-slate-500">
                  {currentHour}
                </p>
              </div>
              {prevwork.map((item: oldWork) => {
                return (
                  <div className="p-2 bg-slate-200 mt-3" key={item.id}>
                    <div className="text-sm font-semibold text-slate-600">
                      Date: <>{new Date(item.created_at).toDateString()}</>
                    </div>
                    <div className="flex items-center justify-between">
                      {item.project !== null ? (
                        <p className="pr-2 text-justify">{item.project}</p>
                      ) : (
                        <p className="pr-2 text-justify text-slate-500">
                          No Name
                        </p>
                      )}

                      <button
                        className={`${
                          item.status === "approved"
                            ? "bg-gradient-to-tr from-green-300 to-emerald-500"
                            : item.status === "decline"
                            ? "bg-red-500"
                            : "bg-yellow-300"
                        } px-2 py-1 rounded-md `}
                      >
                        {item.hours}
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <p
              className={`text-base font-semibold text-center text-slate-500 mt-5`}
            >
              No Recent Entries
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyStandup;
