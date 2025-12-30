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
  console.log("🔍 [VIDEO SDK API] Validating Meeting", {
    meetingId: meetingId,
    meetingId_length: meetingId?.length,
    meetingId_type: typeof meetingId,
    url: url
  });

  // BUG FIX: Check if meeting ID format looks like VideoSDK format (xxxx-xxxx-xxxx)
  // VideoSDK meeting IDs are typically in format: xxxx-xxxx-xxxx (alphanumeric with dashes)
  const videosdkFormatRegex = /^[\w]{4}-[\w]{4}-[\w]{4}$/;
  if (meetingId && !videosdkFormatRegex.test(meetingId)) {
    console.warn('⚠️ [VIDEO SDK API] Meeting ID does not match VideoSDK format (xxxx-xxxx-xxxx)');
    console.warn('⚠️ [VIDEO SDK API] Meeting ID:', meetingId);
    console.warn('⚠️ [VIDEO SDK API] This might be an old/invalid meeting ID from database');
    // Return error indicating invalid format
    return { meetingId: null, err: 'Invalid meeting ID format. Please create a new meeting.' };
  }

  const options = {
    method: "GET",
    headers: { Authorization: token, "Content-Type": "application/json" },
  };

  try {
    console.log('⏳ [VIDEO SDK API] Sending validation request...');
    const response = await fetch(url, options);
    
    console.log('📥 [VIDEO SDK API] Response Status:', response.status);
    console.log('📥 [VIDEO SDK API] Response OK:', response.ok);

    if (response.status === 400) {
      const data = await response.text();
      console.error('❌ [VIDEO SDK API] Validation failed (400):', data);
      return { meetingId: null, err: data || 'Room not found.' };
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('❌ [VIDEO SDK API] Validation failed:', response.status, errorText);
      return { meetingId: null, err: `Validation failed: ${response.status}` };
    }

    const data = await response.json();
    console.log('✅ [VIDEO SDK API] Validation Response Data:', data);

    if (data.roomId) {
      return { meetingId: data.roomId, err: null };
    } else {
      return { meetingId: null, err: data.error || 'Room not found.' };
    }
  } catch (error) {
    console.error('❌ [VIDEO SDK API] Network/Request Error:', error);
    console.error('❌ [VIDEO SDK API] Error Type:', error?.name);
    console.error('❌ [VIDEO SDK API] Error Message:', error?.message);
    
    // BUG FIX: Handle network errors gracefully
    if (error?.message === 'Network request failed' || error?.message?.includes('Network')) {
      return { 
        meetingId: null, 
        err: 'Network error. Please check your internet connection and try again.' 
      };
    }
    
    // For other errors, return generic error
    return { 
      meetingId: null, 
      err: error?.message || 'Failed to validate meeting. Please try again.' 
    };
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
