const API_BASE_URL = "https://api.videosdk.live/v2";
const VIDEOSDK_TOKEN = process.env.REACT_APP_VIDEOSDK_TOKEN;
const API_AUTH_URL = process.env.REACT_APP_AUTH_URL;

console.log("process.envkkk", process.env);

export const getToken = async () => {
  if (VIDEOSDK_TOKEN && API_AUTH_URL) {
    console.error(
      "Error: Provide only ONE PARAMETER - either Token or Auth API"
    );
  } else if (VIDEOSDK_TOKEN) {
    return VIDEOSDK_TOKEN;
  } else if (API_AUTH_URL) {
    const res = await fetch(`${API_AUTH_URL}/get-token`, {
      method: "GET",
    });
    const { token } = await res.json();
    return token;
  } else {
    console.error("Error: ", Error("Please add a token or Auth Server URL"));
  }
};

export const createMeeting = async ({ token }) => {
  const url = `${API_BASE_URL}/rooms`;
  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
  };

  const response = await fetch(url,options);
  const data = await response.json();

  if(data.roomId){
    console.log('data.roomId in api.js line number 36 : ',data.roomId)
    return data.roomId
  }else{
    return null
  }
 };

export const validateMeeting = async ({ meetingId, token }) => {
  const url = `${API_BASE_URL}/rooms/validate/${meetingId}`;
console.log("mettiing id and token",meetingId, token)

  const options = {
    method: "GET",
    // headers: { Authorization: `Bearer ${token}` },
    headers: { Authorization: token, "Content-Type": "application/json" },
  };

  // const result = await fetch(url, options)
  //   .then((response) => response.json()) //result will have meeting id
  //   .catch((error) => console.error("error", error));

  // return result ? result.roomId === meetingId : false;
  const response = await fetch(url, options)
console.log(" meeting response", response);
  if (response.status === 400) {
    const data = await response.text()
    return { meetingId: null, err: data }
  }

  const data = await response.json()
  console.log(" meetingdata response", response.json());

  if (data.roomId) {

    return { meetingId: data.roomId, err: null }
  } else {
    return { meetingId: null, err: data.error }
  }
};
// const response = await fetch(url, options)

//   if (response.status === 400) {
//     const data = await response.text()
//     return { meetingId: null, err: data }
//   }

//   const data = await response.json()

//   if (data.roomId) {
//     return { meetingId: data.roomId, err: null }
//   } else {
//     return { meetingId: null, err: data.error }
//   }

export const fetchSession = async ({ meetingId, token }) => {
  const url = `${API_BASE_URL}/sessions?roomId=${meetingId}`;

  const options = {
    method: "GET",
    headers: { Authorization: token },
  };

  const result = await fetch(url, options)
    .then((response) => response.json()) //result will have meeting id
    .catch((error) => console.error("error", error));
  return result ? result.data[0] : null;
};
