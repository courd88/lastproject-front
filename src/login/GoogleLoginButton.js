import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const clientId = '248755996027-vfjb4igodn9qj0mjn5us426g2e9ma1o5.apps.googleusercontent.com';
  const tempPwKey = 'TemporaryKey';
  const navigate = useNavigate();
  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={(response) => {
            //base64 디코딩인 줄 알았는데 jwtDecode로 디코딩하면 됨.
            //base64 디코딩은 window.atob(), btoa() 함수 사용하면 됨. (참고)
            const decodeString = jwtDecode(response.credential);
            console.log(decodeString);
            axios.post(`http://${process.env.REACT_APP_JKS_IP}:8080/api/login/google`, decodeString)
              .then((response) => {
                console.log(response);
                //만약 1이 왔다면, 
                if (response.data == 1) {
                  const Data = {
                    "userId": decodeString.email,
                    "userPw": tempPwKey
                  }

                  const params = {
                    userId: decodeString.email
                  }

                  //정지 기한 검증
                  axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/user/suspension`, { params: params })
                    .then((response) => {
                      console.log(response.data)
                      if (response.data > 0) {
                        alert("사용정지기한이 " + response.data + "일 남아있어 로그인이 불가합니다.")
                        return
                      } else {
                        axios.post(`http://${process.env.REACT_APP_JKS_IP}:8080/login`, Data)
                          .then((response) => {
                            sessionStorage.setItem("token", response.data);
                            console.log(response);
                            navigate("/");
                          })
                          .catch((error) => {
                            console.log(error);
                          })
                      }
                    })
                    .catch(error => {
                      console.log(error)
                    })


                } else if (response.data == 0) {
                  //만약 0이 왔다면,
                  navigate("/regist/social/google", { state: decodeString });
                }
              })
              .catch((error) => {
                console.log(error);
              })

          }}
          onFailure={(error) => {
            console.log(error);
          }}
        />
      </GoogleOAuthProvider>
    </>
  )
}
export default GoogleLoginButton;